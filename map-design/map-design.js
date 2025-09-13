document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.querySelector('.modal-content');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');

    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    let isDesktop = window.innerWidth > 768;

    // Panning variables
    let isPanning = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;
    let touchStartX, touchStartY;
    let initialPinchDistance = 0;
    let currentPinchDistance = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let clickStartTime = 0;
    let clickMoved = false;
    let swipeStartX = 0;
    let swipeEndX = 0;
    let isDragging = false;
    let initialScale = 1;
    let minSwipeDistance = 50; // Minimum distance for swipe to trigger

    // Update isDesktop on window resize
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth > 768;
    });

    // Function to reset transform
    const resetTransform = () => {
        translateX = 0;
        translateY = 0;
        scale = 1;
        updateImageTransform();
    };

    // Function to update image transform
    const updateImageTransform = () => {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    // Zoom functionality
    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.25, 3);
        updateImageTransform();
    });

    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.25, 1);
        if (scale === 1) {
            translateX = 0;
            translateY = 0;
        }
        updateImageTransform();
    });

    // Function to open the modal
    const openModal = (imgSrc, index) => {
        currentImageIndex = index;
        modalImage.src = imgSrc;
        modal.classList.add('show');
        resetTransform();
        
        // Wait for image to load before centering
        modalImage.onload = () => {
            resetTransform();
        };
    };

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('show');
        resetTransform();
    };

    // Function to navigate to next/previous image
    const navigateImage = (direction) => {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < galleryItems.length) {
            const img = galleryItems[newIndex].querySelector('img');
            openModal(img.src, newIndex);
        }
    };

    // Function to calculate distance between two touch points
    const getDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Mouse events for panning and closing
    modalContent.addEventListener('mousedown', (e) => {
        if (e.target === modalImage) {
            e.preventDefault();
            e.stopPropagation();
            isPanning = true;
            isDragging = false;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImage.style.cursor = 'grabbing';
            clickStartTime = Date.now();
            clickMoved = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning) {
            e.preventDefault();
            e.stopPropagation();
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Check if the mouse has moved significantly
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                isDragging = true;
                clickMoved = true;
            }

            translateX = deltaX;
            translateY = deltaY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isPanning) {
            e.preventDefault();
            e.stopPropagation();
            isPanning = false;
            modalImage.style.cursor = 'grab';
            
            const clickEndTime = Date.now();
            const clickDuration = clickEndTime - clickStartTime;

            // Only close if it's a quick click without dragging
            if (clickDuration < 300 && !isDragging) {
                closeModal();
            }
        }
    });

    // Touch events for mobile
    modalContent.addEventListener('touchstart', (e) => {
        if (e.target === modalImage) {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            touchMoved = false;
            initialScale = scale;
            swipeStartX = touch.clientX;

            // Handle pinch zoom
            if (e.touches.length === 2) {
                initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
            }
        }
    }, { passive: false });

    modalContent.addEventListener('touchmove', (e) => {
        if (e.target === modalImage) {
            e.preventDefault();
            e.stopPropagation();

            if (e.touches.length === 1) {
                // Panning or Swiping
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                // If we're zoomed in, handle as pan
                if (scale > 1) {
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    touchMoved = true;
                }
                translateX += deltaX;
                translateY += deltaY;
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                updateImageTransform();
                } else {
                    // If not zoomed, handle as swipe
                    swipeEndX = touch.clientX;
                    if (Math.abs(deltaX) > 5) {
                        touchMoved = true;
                    }
                }
            } else if (e.touches.length === 2) {
                // Pinch zoom
                currentPinchDistance = getDistance(e.touches[0], e.touches[1]);
                const pinchRatio = currentPinchDistance / initialPinchDistance;
                scale = Math.min(Math.max(initialScale * pinchRatio, 0.5), 3);
                updateImageTransform();
            }
        }
    }, { passive: false });

    modalContent.addEventListener('touchend', (e) => {
        if (e.target === modalImage) {
            e.preventDefault();
            e.stopPropagation();
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const swipeDistance = swipeEndX - swipeStartX;

            // Handle swipe navigation if not zoomed in
            if (scale <= 1 && Math.abs(swipeDistance) > minSwipeDistance && touchMoved) {
                if (swipeDistance > 0) {
                    // Swipe right - go to previous
                    navigateImage(-1);
                } else {
                    // Swipe left - go to next
                    navigateImage(1);
                }
                return;
            }

            // If the touch was short and didn't move much, close the modal
            if (touchDuration < 300 && !touchMoved) {
                closeModal();
            }
        }
    }, { passive: false });

    // Prevent default touch behavior on the modal
    modal.addEventListener('touchmove', (e) => {
        if (e.target === modalImage) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent double-tap zoom on mobile
    modalContent.addEventListener('touchend', (e) => {
        if (e.target === modalImage) {
            e.preventDefault();
        }
    }, { passive: false });

    // Add tap-to-close on mobile background
    modal.addEventListener('touchend', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    }, { passive: false });

    // Mouse wheel for zooming
    modalContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY;
        const zoomFactor = 0.1;
        
        if (delta < 0) {
            // Zoom in
            scale = Math.min(scale + zoomFactor, 3);
        } else {
            // Zoom out
            scale = Math.max(scale - zoomFactor, 0.5);
        }
        
        updateImageTransform();
    }, { passive: false });

    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            openModal(img.src, index);
        });
    });

    // Navigation arrow click events
    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(-1);
    });

    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(1);
    });

    // Event listeners to close the modal
    modal.addEventListener('click', (e) => {
        if (isDesktop) {
            // Don't close if clicking on navigation arrows or if we're panning
            if (e.target === prevArrow || e.target === nextArrow || 
                e.target.closest('.nav-arrow') || isPanning || isDragging || 
                e.target === modalImage) {
                return;
            }
            closeModal();
        } else if (e.target === modal) {
            // On mobile, only close when clicking the background
            closeModal();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        } else if (e.key === 'ArrowLeft' && modal.classList.contains('show')) {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight' && modal.classList.contains('show')) {
            navigateImage(1);
        }
    });
}); 