/**
 * DRIVEFORGE - Vehicle Sales Resource & Knowledge Network
 * Master Application Logic & Interactions
 * Vanilla JavaScript + GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -----------------------------------------------------------------
  // 1. THEME ENGINE (LIGHT / DARK / SYSTEM PREFERENCE)
  // -----------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('driveforge_theme');

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('driveforge_theme', theme);

    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill text-secondary';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  }

  // Initial theme initialization
  const initialTheme = storedTheme || getSystemTheme();
  applyTheme(initialTheme);

  // Toggle button event listeners
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'bi-palette');
    });
  });

  // Listen for OS theme changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('driveforge_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // -----------------------------------------------------------------
  // 2. STICKY NAVBAR SCROLL BEHAVIOR & KEYBOARD ESCAPE
  // -----------------------------------------------------------------
  const navbar = document.querySelector('.navbar-driveforge');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Handle ESC key to close open offcanvas / dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openOffcanvas = document.querySelector('.offcanvas.show');
      if (openOffcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(openOffcanvas);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
      const openSuggestions = document.querySelector('.search-suggestions-container.active');
      if (openSuggestions) {
        openSuggestions.classList.remove('active');
      }
    }
  });


  // -----------------------------------------------------------------
  // 3. TOAST NOTIFICATION UTILITY
  // -----------------------------------------------------------------
  function ensureToastContainer() {
    let container = document.querySelector('.toast-container-custom');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container-custom';
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function(message, iconClass = 'bi-check-circle-fill', isError = false) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast-custom';
    toast.innerHTML = `
      <i class="bi ${iconClass} ${isError ? 'text-danger' : 'text-warning'}" style="font-size: 1.25rem;"></i>
      <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${message}</div>
      <button type="button" class="btn-close" style="font-size: 0.75rem;" aria-label="Close"></button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.btn-close');
    const removeToast = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', removeToast);
    setTimeout(removeToast, 4000);
  };


  // -----------------------------------------------------------------
  // 4. GLOBAL SEARCH SYSTEM & SHORTCUTS ( '/' or 'Ctrl+K' )
  // -----------------------------------------------------------------
  const searchInputs = document.querySelectorAll('.global-search-input');

  // Search hotkey
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const primaryInput = searchInputs[0];
      if (primaryInput) {
        primaryInput.focus();
        primaryInput.select();
      }
    }
  });

  // Mock catalog for instant suggestions
  const catalogSuggestions = [
    { title: 'Vehicle Sales Follow-Up Playbook', category: 'Playbooks', url: 'resource-details.html' },
    { title: 'Handling Common Customer Objections', category: 'Sales Guides', url: 'resource-details.html' },
    { title: 'First 30 Days Sales Consultant Guide', category: 'Checklists', url: 'resource-details.html' },
    { title: 'Trade-In Conversation Checklist', category: 'Checklists', url: 'templates.html' },
    { title: 'Test Drive Conversation Framework', category: 'Scripts', url: 'resource-details.html' },
    { title: 'Daily Sales Activity Planner', category: 'Templates', url: 'templates.html' },
    { title: 'Opening Customer Conversations in Showroom', category: 'Videos', url: 'video-tutorials.html' },
    { title: 'Overcoming Price & Financing Objections', category: 'Videos', url: 'video-tutorials.html' },
    { title: 'How to Re-engage Ghosted Leads (Discussion)', category: 'Community', url: 'community.html' }
  ];

  searchInputs.forEach(input => {
    const wrapper = input.closest('.search-wrapper');
    if (!wrapper) return;

    let suggestionsBox = wrapper.querySelector('.search-suggestions-container');
    if (!suggestionsBox) {
      suggestionsBox = document.createElement('div');
      suggestionsBox.className = 'search-suggestions-container';
      wrapper.appendChild(suggestionsBox);
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        suggestionsBox.classList.remove('active');
        return;
      }

      const matches = catalogSuggestions.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.slice(0, 5).map(m => `
          <a href="${m.url}" class="search-suggestion-item">
            <span><strong>${m.title}</strong></span>
            <span class="badge-custom badge-amber">${m.category}</span>
          </a>
        `).join('');
        suggestionsBox.classList.add('active');
      } else {
        suggestionsBox.innerHTML = `
          <div class="p-2 text-muted text-center" style="font-size: 0.85rem;">
            No matching resources found for "${q}".
          </div>
        `;
        suggestionsBox.classList.add('active');
      }
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        suggestionsBox.classList.remove('active');
      }
    });
  });

  // Popular search pills click handler
  document.querySelectorAll('.popular-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.getAttribute('data-search') || tag.innerText.trim().replace(/^#/, '');
      const input = document.querySelector('.library-search-input') || document.querySelector('.global-search-input');
      if (input) {
        input.value = term;
        input.dispatchEvent(new Event('input'));
        input.focus();
        // If on community page, smooth scroll to feed
        const feed = document.getElementById('communityDiscussionFeed');
        if (feed) {
          feed.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  // -----------------------------------------------------------------
  // 5. RESOURCE FILTERING & SORTING ENGINE (RESOURCES & TEMPLATES)
  // -----------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const resourceCards = document.querySelectorAll('.filterable-card');
  const sortSelect = document.querySelector('.sort-select');
  const resultsCounter = document.querySelector('.results-counter');

  function updateResourceFilter() {
    const cards = document.querySelectorAll('.filterable-card');
    if (!cards.length) return;

    const activeBtn = document.querySelector('.filter-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const searchField = document.querySelector('.library-search-input');
    const searchQuery = searchField ? searchField.value.trim().toLowerCase() : '';

    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardTitle = (card.querySelector('.card-title-text')?.innerText || '').toLowerCase();
      const cardDesc = (card.querySelector('.card-desc-text')?.innerText || '').toLowerCase();
      const cardText = (card.innerText || '').toLowerCase();

      const matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory.toLowerCase());
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery) || cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCounter) {
      const isCommunity = document.getElementById('communityDiscussionFeed') !== null;
      const entityName = isCommunity ? 'discussion' : 'resource';
      resultsCounter.innerText = `Showing ${visibleCount} ${entityName}${visibleCount === 1 ? '' : 's'}`;
    }

    const noResultsNotice = document.querySelector('.no-results-notice');
    if (noResultsNotice) {
      noResultsNotice.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateResourceFilter();
    });
  });

  const librarySearch = document.querySelector('.library-search-input');
  if (librarySearch) {
    librarySearch.addEventListener('input', updateResourceFilter);
  }

  // Sorting Handler
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortValue = sortSelect.value;
      const container = document.querySelector('.filterable-grid');
      if (!container) return;

      const cardArray = Array.from(resourceCards);

      cardArray.sort((a, b) => {
        if (sortValue === 'title-asc') {
          const titleA = (a.querySelector('.card-title-text')?.innerText || '').toLowerCase();
          const titleB = (b.querySelector('.card-title-text')?.innerText || '').toLowerCase();
          return titleA.localeCompare(titleB);
        } else if (sortValue === 'popular') {
          const popA = parseInt(a.getAttribute('data-popularity') || '0', 10);
          const popB = parseInt(b.getAttribute('data-popularity') || '0', 10);
          return popB - popA;
        } else {
          // newest default
          const dateA = parseInt(a.getAttribute('data-date') || '0', 10);
          const dateB = parseInt(b.getAttribute('data-date') || '0', 10);
          return dateB - dateA;
        }
      });

      cardArray.forEach(card => container.appendChild(card));
      showToast(`Sorted by ${sortSelect.options[sortSelect.selectedIndex].text}`, 'bi-sort-down');
    });
  }


  // -----------------------------------------------------------------
  // 6. VIDEO MODAL / LIGHTBOX INTERACTION
  // -----------------------------------------------------------------
  const videoCards = document.querySelectorAll('.video-interactive-trigger');
  const videoModalEl = document.getElementById('videoPlayerModal');

  if (videoModalEl) {
    const videoModal = new bootstrap.Modal(videoModalEl);
    const modalTitle = videoModalEl.querySelector('.video-modal-title');
    const modalCategory = videoModalEl.querySelector('.video-modal-category');
    const modalDuration = videoModalEl.querySelector('.video-modal-duration');
    const modalTrainer = videoModalEl.querySelector('.video-modal-trainer');
    const modalPoster = videoModalEl.querySelector('.video-modal-poster');

    videoCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const title = card.getAttribute('data-title') || 'Vehicle Sales Masterclass';
        const category = card.getAttribute('data-category') || 'Masterclass';
        const duration = card.getAttribute('data-duration') || '14:20';
        const trainer = card.getAttribute('data-trainer') || 'DRIVEFORGE Sales Faculty';
        const poster = card.getAttribute('data-poster') || 'assets/images/videos/video_sales_masterclass.jpg';

        if (modalTitle) modalTitle.innerText = title;
        if (modalCategory) modalCategory.innerText = category;
        if (modalDuration) modalDuration.innerText = duration;
        if (modalTrainer) modalTrainer.innerText = trainer;
        if (modalPoster) modalPoster.src = poster;

        videoModal.show();
      });
    });
  }


  // -----------------------------------------------------------------
  // 7. DOWNLOAD INTERACTION WITH DEMO FILE GENERATION & FEEDBACK
  // -----------------------------------------------------------------
  const downloadBtns = document.querySelectorAll('.download-trigger-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const fileName = btn.getAttribute('data-file') || 'DRIVEFORGE-Sales-Toolkit.pdf';
      const fileType = btn.getAttribute('data-type') || 'PDF Document';
      const fileSize = btn.getAttribute('data-size') || '1.8 MB';

      // Visual button loading state
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Preparing...`;
      btn.disabled = true;

      setTimeout(() => {
        // Create demo blob download
        const blob = new Blob([
          `DRIVEFORGE VEHICLE SALES KNOWLEDGE NETWORK\n` +
          `Resource: ${fileName}\n` +
          `Format: ${fileType} (${fileSize})\n` +
          `Date: ${new Date().toLocaleDateString()}\n` +
          `Notice: Fictional demonstration resource for automotive sales professionals.\n\n` +
          `Thank you for using DRIVEFORGE — Knowledge That Moves Sales Forward.`
        ], { type: 'text/plain;charset=utf-8' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        btn.innerHTML = originalHTML;
        btn.disabled = false;

        showToast(`Downloaded ${fileName} (${fileSize})`, 'bi-file-earmark-check-fill');
      }, 700);
    });
  });


  // -----------------------------------------------------------------
  // 8. BOOKMARK / SAVE RESOURCE INTERACTION
  // -----------------------------------------------------------------
  const bookmarkBtns = document.querySelectorAll('.bookmark-toggle-btn');
  bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const icon = btn.querySelector('i');
      const isBookmarked = btn.classList.toggle('bookmarked');

      if (isBookmarked) {
        if (icon) icon.className = 'bi bi-bookmark-fill text-warning';
        showToast('Resource saved to your bookmarks', 'bi-bookmark-check-fill');
      } else {
        if (icon) icon.className = 'bi bi-bookmark';
        showToast('Resource removed from bookmarks', 'bi-bookmark-dash');
      }
    });
  });


  // -----------------------------------------------------------------
  // 9. SHARE MODAL / COPY LINK TOAST
  // -----------------------------------------------------------------
  const shareBtns = document.querySelectorAll('.share-trigger-btn');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Resource link copied to clipboard!', 'bi-link-45deg');
        }).catch(() => {
          showToast('Link copied: ' + url, 'bi-link-45deg');
        });
      } else {
        showToast('Link copied: ' + url, 'bi-link-45deg');
      }
    });
  });


  // Reset filters button click
  document.addEventListener('click', (e) => {
    if (e.target.closest('.reset-filter-btn')) {
      const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allFilterBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        allFilterBtn.classList.add('active');
      }
      const searchField = document.querySelector('.library-search-input');
      if (searchField) {
        searchField.value = '';
      }
      updateResourceFilter();
    }
  });

  // -----------------------------------------------------------------
  // 10. COMMUNITY DISCUSSION INTERACTIONS & CREATION
  // -----------------------------------------------------------------
  // Upvote handling
  document.addEventListener('click', (e) => {
    const upvoteBtn = e.target.closest('.upvote-btn');
    if (upvoteBtn) {
      e.preventDefault();
      const countEl = upvoteBtn.querySelector('.vote-count');
      let currentVotes = parseInt(upvoteBtn.getAttribute('data-votes') || countEl.innerText || '0', 10);
      const isUpvoted = upvoteBtn.classList.contains('upvoted');

      if (isUpvoted) {
        currentVotes = Math.max(0, currentVotes - 1);
        upvoteBtn.classList.remove('upvoted', 'active');
        if (countEl) countEl.innerText = currentVotes;
        upvoteBtn.setAttribute('data-votes', currentVotes);
        showToast('Upvote removed', 'bi-hand-thumbs-down');
      } else {
        currentVotes += 1;
        upvoteBtn.classList.add('upvoted', 'active');
        if (countEl) countEl.innerText = currentVotes;
        upvoteBtn.setAttribute('data-votes', currentVotes);
        showToast('Discussion upvoted (+1)!', 'bi-hand-thumbs-up-fill');
      }
    }

    // Toggle replies drawer
    const replyToggleBtn = e.target.closest('.reply-toggle-btn') || e.target.closest('.discussion-title-link');
    if (replyToggleBtn) {
      e.preventDefault();
      const card = replyToggleBtn.closest('.card-treatment-discussion');
      if (card) {
        const drawer = card.querySelector('.discussion-reply-drawer');
        if (drawer) {
          const isOpen = drawer.style.display === 'block';
          drawer.style.display = isOpen ? 'none' : 'block';
        }
      }
    }

    // Share button
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      e.preventDefault();
      const shareUrl = window.location.href.split('#')[0] + '#community';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Discussion link copied to clipboard!', 'bi-clipboard-check-fill');
        }).catch(() => {
          showToast('Link copied to clipboard!', 'bi-share-fill');
        });
      } else {
        showToast('Discussion link ready to share!', 'bi-share-fill');
      }
    }
  });

  // Quick reply form submission
  document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('quick-reply-form')) {
      e.preventDefault();
      const form = e.target;
      const input = form.querySelector('input');
      const val = input.value.trim();
      if (!val) return;

      const card = form.closest('.card-treatment-discussion');
      const drawer = form.closest('.discussion-reply-drawer');
      if (drawer) {
        const newBubble = document.createElement('div');
        newBubble.className = 'reply-bubble';
        newBubble.innerHTML = `
          <div class="d-flex align-items-center justify-content-between mb-1">
            <strong class="small" style="color: var(--accent-amber);">You (Consultant)</strong>
            <span class="text-muted" style="font-size: 0.75rem;">Just now</span>
          </div>
          <p class="small text-secondary mb-0">${val}</p>
        `;
        drawer.insertBefore(newBubble, form);
        input.value = '';

        // Increment reply count button in card
        if (card) {
          const replyCountSpan = card.querySelector('.reply-toggle-btn span');
          if (replyCountSpan) {
            const currentReplies = parseInt(replyCountSpan.innerText, 10) || 0;
            replyCountSpan.innerText = `${currentReplies + 1} replies`;
          }
        }
        showToast('Your showroom insight was added!', 'bi-chat-left-check-fill');
      }
    }
  });

  // New Discussion Form
  const newDiscussionForm = document.getElementById('newDiscussionForm');
  if (newDiscussionForm) {
    const categoryLabels = {
      'techniques': 'Sales Techniques',
      'conversations': 'Customer Conversations',
      'follow-up': 'Follow-Up',
      'negotiation': 'Negotiation',
      'dealership': 'Dealership Life'
    };

    newDiscussionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('discussionTitle');
      const categorySelect = document.getElementById('discussionCategory');
      const messageInput = document.getElementById('discussionMessage');
      const tagsInput = document.getElementById('discussionTags');

      if (!titleInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out the title and message.', 'bi-exclamation-triangle-fill', true);
        return;
      }

      const title = titleInput.value.trim();
      const categorySlug = categorySelect.value || 'techniques';
      const categoryLabel = categoryLabels[categorySlug] || categorySelect.options[categorySelect.selectedIndex]?.text || 'Sales Techniques';
      const message = messageInput.value.trim();
      const tags = (tagsInput ? tagsInput.value.trim() : 'Showroom, BestPractices')
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const feed = document.getElementById('communityDiscussionFeed');
      if (feed) {
        const newCard = document.createElement('div');
        newCard.className = 'card-treatment-discussion filterable-card mb-4 p-4 rounded-4 bg-card border border-subtle shadow-sm';
        newCard.setAttribute('data-category', categorySlug);
        newCard.setAttribute('data-date', '20261001');
        newCard.setAttribute('data-popularity', '100');
        newCard.innerHTML = `
          <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div class="d-flex align-items-center gap-2">
              <div class="discussion-avatar" style="background: var(--accent-amber-soft); color: var(--accent-amber);">YOU</div>
              <div>
                <div class="fw-bold" style="font-size: 0.95rem; color: var(--text-primary);">You <span class="badge-custom ms-1" style="font-size: 0.72rem;">Sales Consultant</span></div>
                <span class="text-muted" style="font-size: 0.8rem;">Just now</span>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge-custom badge-amber">${categoryLabel}</span>
              <span class="badge bg-warning-subtle text-warning border border-warning-subtle small"><i class="bi bi-star-fill me-1"></i> New</span>
            </div>
          </div>
          <h3 class="card-title-text h5 fw-bold mb-2">
            <a href="javascript:void(0);" class="text-reset text-decoration-none hover-amber discussion-title-link">${title}</a>
          </h3>
          <p class="card-desc-text text-secondary mb-3" style="font-size: 0.96rem; line-height: 1.65;">${message}</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            ${tags.map(t => `<span class="badge-custom popular-tag" data-search="${t}">#${t}</span>`).join('')}
          </div>
          <div class="d-flex align-items-center justify-content-between pt-3 border-top border-subtle flex-wrap gap-2">
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="discussion-action-btn upvote-btn" data-votes="1" aria-label="Upvote discussion">
                <i class="bi bi-hand-thumbs-up-fill"></i>
                <span class="vote-count">1</span>
              </button>
              <button type="button" class="discussion-action-btn reply-toggle-btn" aria-label="Toggle replies">
                <i class="bi bi-chat-dots-fill"></i>
                <span>0 replies</span>
              </button>
              <span class="text-muted small ms-2"><i class="bi bi-eye me-1"></i> 1 view</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="discussion-action-btn share-btn" aria-label="Share discussion link">
                <i class="bi bi-share"></i>
                <span>Share</span>
              </button>
              <button type="button" class="discussion-action-btn bookmark-btn" aria-label="Bookmark discussion">
                <i class="bi bi-bookmark"></i>
              </button>
            </div>
          </div>
          <div class="discussion-reply-drawer mt-3" style="display: none;">
            <p class="small text-muted mb-2">No replies yet. Be the first to share advice!</p>
            <form class="quick-reply-form mt-2 d-flex gap-2">
              <input type="text" class="form-control form-control-sm form-control-custom" placeholder="Add showroom advice..." required>
              <button type="submit" class="btn btn-sm btn-primary-custom flex-shrink-0">Reply</button>
            </form>
          </div>
        `;

        feed.insertBefore(newCard, feed.firstChild);

        // Highlight animation
        newCard.style.boxShadow = '0 0 24px var(--accent-amber-glow)';
        setTimeout(() => {
          newCard.style.boxShadow = '';
        }, 3000);

        updateResourceFilter();
      }

      // Close modal
      const modalEl = document.getElementById('startDiscussionModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }

      newDiscussionForm.reset();
      showToast('Discussion published to the network!', 'bi-send-check-fill');
    });
  }


  // -----------------------------------------------------------------
  // 11. AUTHENTICATION & FORM VALIDATION (NO DASHBOARDS!)
  // -----------------------------------------------------------------
  // Password Visibility Toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-input-wrap')?.querySelector('input');
      const icon = btn.querySelector('i');
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.className = 'bi bi-eye-slash';
      } else {
        input.type = 'password';
        if (icon) icon.className = 'bi bi-eye';
      }
    });
  });

  // Login Form Demo
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value;
      const feedback = document.getElementById('loginFeedbackAlert');

      if (feedback) {
        feedback.innerHTML = `
          <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 1.25rem;"></i>
            <div>
              <strong>Welcome back!</strong> Demo sign-in verified for <code>${email || 'demo@driveforge.local'}</code>. 
              <div class="mt-1" style="font-size: 0.85rem;">
                Explore <a href="resources.html" class="fw-bold text-success text-decoration-underline">Resources</a> or join the 
                <a href="community.html" class="fw-bold text-success text-decoration-underline">Community</a>.
              </div>
            </div>
          </div>
        `;
        feedback.style.display = 'block';
      }
      showToast('Signed in successfully (demo session)', 'bi-shield-check');
    });
  }

  // Signup Form Demo
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName')?.value;
      const role = document.getElementById('signupRole')?.value;
      const pwd = document.getElementById('signupPassword')?.value;
      const pwdConfirm = document.getElementById('signupPasswordConfirm')?.value;
      const feedback = document.getElementById('signupFeedbackAlert');

      if (pwd !== pwdConfirm) {
        showToast('Passwords do not match.', 'bi-exclamation-octagon-fill', true);
        return;
      }

      if (feedback) {
        feedback.innerHTML = `
          <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-award-fill text-success" style="font-size: 1.25rem;"></i>
            <div>
              <strong>Account Created!</strong> Welcome ${name || 'Sales Professional'} (${role || 'Consultant'}). 
              Your DRIVEFORGE network membership is active.
              <div class="mt-1" style="font-size: 0.85rem;">
                Start learning with <a href="learn.html" class="fw-bold text-success text-decoration-underline">Learning Paths</a> or download <a href="templates.html" class="fw-bold text-success text-decoration-underline">Sales Toolkits</a>.
              </div>
            </div>
          </div>
        `;
        feedback.style.display = 'block';
      }
      showToast('Account created successfully!', 'bi-person-check-fill');
    });
  }

  // Forgot Password Form Demo
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('resetEmail')?.value;
      const feedback = document.getElementById('resetFeedbackAlert');

      if (feedback) {
        feedback.innerHTML = `
          <div class="alert alert-info d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-envelope-check-fill text-primary" style="font-size: 1.25rem;"></i>
            <div>
              <strong>Reset Instructions Sent!</strong> If an account matches <code>${email}</code>, you will receive a secure recovery link shortly. (Demo request).
            </div>
          </div>
        `;
        feedback.style.display = 'block';
      }
      showToast('Demo reset link request submitted.', 'bi-envelope-check');
    });
  }

  // Contact Form Demo
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('contactFeedbackAlert');
      if (feedback) {
        feedback.innerHTML = `
          <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 1.25rem;"></i>
            <div>
              <strong>Message Received!</strong> Thank you for reaching out to the DRIVEFORGE team. We will review your message and reply within 1 business day.
            </div>
          </div>
        `;
        feedback.style.display = 'block';
      }
      contactForm.reset();
      showToast('Message sent to DRIVEFORGE team', 'bi-chat-left-check-fill');
    });
  }


  // -----------------------------------------------------------------
  // 12. GSAP MICRO-ANIMATIONS (RESPECTS PREFERS-REDUCED-MOTION)
  // -----------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    // Hero Entrance
    if (document.querySelector('.hero-headline')) {
      gsap.from('.hero-editorial-lead', { opacity: 0, y: -15, duration: 0.6, ease: 'power2.out' });
      gsap.from('.hero-headline', { opacity: 0, y: 25, duration: 0.8, delay: 0.1, ease: 'power3.out' });
      gsap.from('.hero-subtext', { opacity: 0, y: 20, duration: 0.8, delay: 0.25, ease: 'power3.out' });
      gsap.from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.7, delay: 0.4, ease: 'power3.out' });
      gsap.from('.hero-search-box', { opacity: 0, y: 25, duration: 0.8, delay: 0.5, ease: 'power3.out' });
      gsap.from('.hero-composition-wrap', { opacity: 0, scale: 0.97, duration: 1, delay: 0.3, ease: 'power2.out' });
      gsap.from('.hero-floating-card', { opacity: 0, y: 30, duration: 0.8, delay: 0.7, stagger: 0.15, ease: 'back.out(1.4)' });
    }

    // Stagger animation for section cards on scroll/load
    const animateElements = document.querySelectorAll('.animate-fade-up');
    if (animateElements.length > 0) {
      gsap.from(animateElements, {
        opacity: 0,
        y: 30,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }
});
