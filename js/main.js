// Enhanced Portfolio Interactive Features
// Main JavaScript file for smooth scrolling, active link highlighting and synchronized sidebar scrolling

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sidebar = document.querySelector('.sidebar');
  const contentContainer = document.querySelector('.content-container');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const backToTopButton = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const navContainer = document.querySelector('.nav');
  const sections = document.querySelectorAll('.section');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const closeIcon = document.querySelector('.close-icon');
  
  // Variables for scroll optimization
  let isScrolling = false;
  let scrollTimeout;
  let lastScrollTop = 0;
  
  // Function to update active section
  function updateActiveSection() {
    const scrollPosition = contentContainer.scrollTop;
    let currentSection = null;
    let closestSection = null;
    let closestDistance = Infinity;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200; // Increased offset for earlier activation
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      // Special handling for About section (top of page)
      if (section.id === 'about') {
        if (scrollPosition < 200) {
          currentSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
      // Special handling for References section (bottom of page)
      else if (section.id === 'references') {
        if (scrollPosition >= sectionTop - 100) {
          currentSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
      // Regular sections
      else {
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
      
      // Find closest section for fallback
      const distance = Math.abs(scrollPosition - sectionTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });
    
    // Fallback to closest section if no section is in view
    if (!currentSection) {
      currentSection = closestSection;
      if (currentSection) {
        currentSection.classList.add('active');
      }
    }
    
    // Update navigation links with smooth scrolling
    if (currentSection) {
      const currentSectionId = currentSection.getAttribute('id');
      navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        // Special case: highlight About link when at the very top
        if ((scrollPosition < 200 && link.getAttribute('href') === '#top') || (linkTarget === currentSectionId && link.getAttribute('href') !== '#top')) {
          link.classList.add('active');
          
          // Smoothly scroll the sidebar to keep the active link visible
          const linkEffectiveOffset = link.offsetTop - navContainer.offsetTop;
          const navScrollPosition = linkEffectiveOffset - (navContainer.clientHeight / 2) + (link.offsetHeight / 2);
          
          // Use requestAnimationFrame for smoother scrolling
          requestAnimationFrame(() => {
            navContainer.scrollTo({
              top: Math.max(0, navScrollPosition),
              behavior: 'smooth'
            });
          });
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  // Add scroll event listener to content container with improved performance
  contentContainer.addEventListener('scroll', function() {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        isScrolling = false;
      });
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateActiveSection();
    }, 50); // Reduced timeout for more responsive updates

    // Back to top button visibility
    if (contentContainer.scrollTop > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Initialize active section on load
  updateActiveSection();
  
  // Initialize the carousel if it exists
  initCarousel();
  
  // ----- Mobile Navigation Toggle -----
  mobileNavToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    this.classList.toggle('active');
    this.setAttribute('aria-expanded', sidebar.classList.contains('active'));
  });
  
  // Only close when clicking the toggle button or a nav link
  document.querySelectorAll('.nav-container ul li').forEach(listItem => {
    listItem.addEventListener('click', function(e) {
      // Find the nav-link within the clicked list item
      const link = this.querySelector('.nav-link');
      if (!link) return; // If no nav-link found, do nothing

      e.preventDefault(); // Prevent default behavior of any link within the li
      
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        mobileNavToggle.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
      
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Set smooth scroll to target within contentContainer
        contentContainer.scrollTo({
          top: targetSection.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ----- Back to Top Button -----
  backToTopButton.addEventListener('click', function() {
    contentContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ----- Field Trip Tabs -----
  function initFieldTripTabs() {
    const tabContainer = document.querySelector('.field-trip-tabs');
    if (!tabContainer) return;

    const tabLinks = tabContainer.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.field-trip-content-wrapper .tab-content');

    // Swipe gesture support for mobile (tab bar)
    let touchStartX = 0;
    let touchEndX = 0;

    tabContainer.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    tabContainer.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, false);

    // Swipe gesture support for mobile (content area)
    const contentWrapper = document.querySelector('.field-trip-content-wrapper');
    if (contentWrapper) {
      contentWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, false);
      contentWrapper.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
      }, false);
    }

    function switchTabWithAnimation(newIndex, direction) {
      const activeIndex = Array.from(tabLinks).findIndex(l => l.classList.contains('active'));
      if (activeIndex === newIndex) return;
      const currentTab = tabLinks[activeIndex];
      const nextTab = tabLinks[newIndex];
      const currentContent = tabContents[activeIndex];
      const nextContent = tabContents[newIndex];
      // Remove any previous animation classes
      tabContents.forEach(content => {
        content.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
      });
      // Animate out current content
      if (direction === 'left') {
        currentContent.classList.add('slide-out-left');
        nextContent.classList.add('slide-in-right');
      } else {
        currentContent.classList.add('slide-out-right');
        nextContent.classList.add('slide-in-left');
      }
      // Hide all tab contents after animation
      setTimeout(() => {
        tabLinks.forEach(l => l.classList.remove('active'));
        nextTab.classList.add('active');
        tabContents.forEach(content => {
          content.classList.remove('active');
          content.style.display = 'none';
        });
        nextContent.style.display = 'block';
        requestAnimationFrame(() => {
          nextContent.classList.add('active');
        });
      }, 400); // Match animation duration
    }

    function handleGesture() {
      const activeIndex = Array.from(tabLinks).findIndex(l => l.classList.contains('active'));
      if (touchEndX < touchStartX - 40) { // Swipe left
        if (activeIndex < tabLinks.length - 1) {
          switchTabWithAnimation(activeIndex + 1, 'left');
        }
      }
      if (touchEndX > touchStartX + 40) { // Swipe right
        if (activeIndex > 0) {
          switchTabWithAnimation(activeIndex - 1, 'right');
        }
      }
    }

    tabContainer.addEventListener('click', (e) => {
      const link = e.target.closest('.tab-link');
      if (!link) return;
      e.preventDefault();
      const tabId = link.dataset.tab;
      const newActiveContent = document.getElementById(tabId);
      if (!newActiveContent) return;
      const newIndex = Array.from(tabLinks).indexOf(link);
      const activeIndex = Array.from(tabLinks).findIndex(l => l.classList.contains('active'));
      if (newIndex === activeIndex) return;
      const direction = newIndex > activeIndex ? 'left' : 'right';
      switchTabWithAnimation(newIndex, direction);
    });
  }
  initFieldTripTabs();

  // ----- Carousel Functionality -----
  function initCarousel() {
    const carousels = document.querySelectorAll('.carousel, .drawing-carousel');
    let globalAutoSlideInterval;
    
    function startGlobalAutoSlide() {
      globalAutoSlideInterval = setInterval(() => {
        carousels.forEach(carousel => {
          const nextBtn = carousel.querySelector('.next');
          if (nextBtn) nextBtn.click();
        });
      }, 6000); // Increased to 6 seconds for better viewing with smoother transitions
    }

    function stopGlobalAutoSlide() {
      clearInterval(globalAutoSlideInterval);
    }

    carousels.forEach(carousel => {
      const items = carousel.querySelectorAll('.carousel-item');
      const indicators = carousel.querySelectorAll('.indicator');
      const prevBtn = carousel.querySelector('.prev');
      const nextBtn = carousel.querySelector('.next');
      let currentIndex = 0;
      const totalItems = items.length;
      let isTransitioning = false;
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartTime = 0;
      let touchEndTime = 0;

      function updateCarousel() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Remove active class from all items and indicators
        items.forEach(item => {
          item.classList.remove('active');
          item.classList.remove('prev');
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current item and indicator
        items[currentIndex].classList.add('active');
        if (indicators[currentIndex]) {
          indicators[currentIndex].classList.add('active');
        }

        // Add prev class to previous item for smooth transition
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        items[prevIndex].classList.add('prev');

        // Reset transition flag after animation
        setTimeout(() => {
          isTransitioning = false;
        }, 800); // Match this with CSS transition duration
      }

      function nextSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }

      function prevSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      }

      // Event listeners for controls
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          prevSlide();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          nextSlide();
        });
      }

      // Event listeners for indicators
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
          e.preventDefault();
          if (isTransitioning) return;
          currentIndex = index;
          updateCarousel();
        });
      });

      // Touch events for mobile swipe
      carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
      }, { passive: true });

      carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndTime = Date.now();
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        const swipeTime = touchEndTime - touchStartTime;
        const swipeDistance = touchEndX - touchStartX;
        
        // Only trigger swipe if it's quick enough and long enough
        if (swipeTime < 300 && Math.abs(swipeDistance) > swipeThreshold) {
          if (swipeDistance < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }

      // Pause auto-slide on hover/touch
      carousel.addEventListener('mouseenter', stopGlobalAutoSlide);
      carousel.addEventListener('mouseleave', startGlobalAutoSlide);
      carousel.addEventListener('touchstart', stopGlobalAutoSlide, { passive: true });
      carousel.addEventListener('touchend', startGlobalAutoSlide, { passive: true });

      // Keyboard navigation
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        }
      });
    });

    // Start auto-slide
    startGlobalAutoSlide();
  }

  // ----- Intersection Observer for Animations -----
  // Create an observer for fade-in effects when scrolling
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
  };
  
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  
  // Apply the animation to all section content elements
  const sectionContents = document.querySelectorAll('.section-content > div');
  sectionContents.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    appearOnScroll.observe(item);
  });

  /** Sidebar navigation: robust, industry-standard active section tracking and smooth scroll **/

  // Intersection Observer for active section
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60% 0px', // Trigger when section top is 40% from top
    threshold: 0
  };

  let currentActive = null;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (currentActive) currentActive.classList.remove('active');
        const newActive = document.querySelector('.nav-link[href="#' + id + '"]');
        if (newActive) {
          newActive.classList.add('active');
          currentActive = newActive;
        }
        // Optionally, highlight the section itself
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // --- Fix .main-container padding bug ---
  function setMainContainerPadding() {
    var mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.style.padding = '24px 32px';
    }
  }
  setMainContainerPadding();
  window.addEventListener('resize', setMainContainerPadding);

  // --- Scroll restoration for nav links (preserve scroll on reload) ---
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // --- Keyboard navigation for sidebar ---
  navLinks.forEach((link, idx) => {
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (navLinks[idx + 1]) navLinks[idx + 1].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (navLinks[idx - 1]) navLinks[idx - 1].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });

  // --- Focus style for accessibility ---
  navLinks.forEach(link => {
    link.addEventListener('focus', function() {
      link.style.outline = '2px solid #2B5797';
    });
    link.addEventListener('blur', function() {
      link.style.outline = '';
    });
  });

  // --- Use scrollIntoView for all smooth scrolls ---
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const mobileNavToggle = document.getElementById('mobileNavToggle');
        sidebar.classList.remove('active');
        mobileNavToggle.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Prevent double scrollbars ---
  document.body.style.overflowX = 'hidden';

  // --- Debounce for resize events (performance) ---
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      setMainContainerPadding();
    }, 100);
  });

  // Smooth scroll to top and close sidebar on mobile when About is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Close sidebar if open (mobile)
        var sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
        }
      }
    });
  });
});

// PDF Modal functionality
const pdfUrl = 'documents/CV.pdf#toolbar=1&navpanes=0&scrollbar=0&view=FitH';
const modal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');
const closeModal = document.querySelector('.close-modal');
const cvButtons = document.querySelectorAll('#cvButton, #cvButtonMain');

// Function to open modal
function openModal() {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  if (hamburgerMenu) {
    hamburgerMenu.style.visibility = 'hidden';
  }
  if (mobileNavToggle) {
    mobileNavToggle.style.visibility = 'hidden';
  }
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  pdfViewer.src = pdfUrl;
  document.body.style.overflow = 'hidden';
}

// Function to close modal
function closeModalFunc() {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    if (hamburgerMenu) {
      hamburgerMenu.style.visibility = 'visible';
    }
    if (mobileNavToggle) {
      mobileNavToggle.style.visibility = 'visible';
    }
    pdfViewer.src = '';
    document.body.style.overflow = '';
  }, 300);
}

// Event listeners
cvButtons.forEach(button => {
    button.addEventListener('click', openModal);
});

closeModal.addEventListener('click', closeModalFunc);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalFunc();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModalFunc();
    }
});