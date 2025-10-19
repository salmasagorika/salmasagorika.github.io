// PDF Modal functionality for academic projects
document.addEventListener('DOMContentLoaded', function() {
  // PDF Modal elements
  const modal = document.getElementById('pdfModal');
  const pdfViewer = document.getElementById('pdfViewer');
  const closeModal = modal.querySelector('.close-modal');
  
  // PDF Selection Modal elements
  const pdfSelectionModal = document.getElementById('pdfSelectionModal');
  const pdfSelectionCloseModal = pdfSelectionModal.querySelector('.close-modal');

  // Function to open PDF modal
  function openPDFModal(pdfPath) {
    modal.style.display = 'block';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    pdfViewer.src = pdfPath + '#toolbar=1&navpanes=0&scrollbar=0&view=FitH';
    document.body.style.overflow = 'hidden';
  }

  // Function to close PDF modal
  function closePDFModal() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      pdfViewer.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  // Function to open PDF selection modal
  function openPDFSelectionModal(targetCard) {
    // Get the position and dimensions of the target card
    const cardRect = targetCard.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Position the modal exactly over the card
    pdfSelectionModal.style.position = 'absolute';
    pdfSelectionModal.style.top = (cardRect.top + scrollTop) + 'px';
    pdfSelectionModal.style.left = (cardRect.left + scrollLeft) + 'px';
    pdfSelectionModal.style.width = cardRect.width + 'px';
    pdfSelectionModal.style.height = cardRect.height + 'px';
    pdfSelectionModal.style.display = 'block';
    
    // Set the selection modal to match card dimensions exactly
    const selectionModal = pdfSelectionModal.querySelector('.selection-modal');
    selectionModal.style.width = cardRect.width + 'px';
    selectionModal.style.height = cardRect.height + 'px';
    
    // Trigger smooth animation
    requestAnimationFrame(() => {
      pdfSelectionModal.classList.add('show');
    });
    document.body.style.overflow = 'hidden';
  }

  // Function to close PDF selection modal
  function closePDFSelectionModal() {
    pdfSelectionModal.classList.remove('show');
    setTimeout(() => {
      pdfSelectionModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  // Handle 'View Project' button clicks
  document.querySelectorAll('.btn-view').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Find the project title related to this button
      const projectCard = btn.closest('.project-card');
      const title = projectCard.querySelector('.project-title').textContent.trim();
      
      if (title === 'Diversity and Abundance of Macrobenthos between Salimpur Coast and Shapuree Island, Bangladesh') {
        // Open the PDF in modal
        openPDFModal('Academic research.pdf');
      } else if (title === 'Empowering Coastal Communities and Strengthening Marine Biodiversity Conservation in Bangladesh') {
        // Open the PDF in modal
        openPDFModal('Internship.pdf');
      } else if (title === 'Environmental Impact Assessment on Temukhi Point and Surrounding Areas') {
        // Open PDF selection modal positioned over the card
        openPDFSelectionModal(projectCard);
      } else {
        alert('Project details coming soon!');
      }
    });
  });

  // Handle PDF option clicks in selection modal
  document.querySelectorAll('.pdf-option').forEach(function(option) {
    option.addEventListener('click', function() {
      const pdfPath = this.getAttribute('data-pdf');
      closePDFSelectionModal();
      setTimeout(() => {
        openPDFModal(pdfPath);
      }, 300);
    });
  });

  // Close modal event listeners
  closeModal.addEventListener('click', closePDFModal);
  pdfSelectionCloseModal.addEventListener('click', closePDFSelectionModal);
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', function(e) {
    // Close if clicking on the modal background
    if (e.target === modal) {
      closePDFModal();
    }
  });

  // Handle clicks on modal-content area (outside PDF container)
  const modalContent = modal.querySelector('.modal-content');
  modalContent.addEventListener('click', function(e) {
    // Close if clicking on modal-content but not on PDF container or iframe
    if (e.target === modalContent) {
      closePDFModal();
    }
  });

  pdfSelectionModal.addEventListener('click', function(e) {
    // Close if clicking on the modal background or on the selection container
    if (e.target === pdfSelectionModal || e.target.classList.contains('pdf-selection-container')) {
      closePDFSelectionModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (modal.classList.contains('show')) {
        closePDFModal();
      } else if (pdfSelectionModal.classList.contains('show')) {
        closePDFSelectionModal();
      }
    }
  });

  // Handle window resize to reposition modal
  window.addEventListener('resize', function() {
    if (pdfSelectionModal.classList.contains('show')) {
      // Find the Environmental Impact Assessment card and reposition modal
      const projectCards = document.querySelectorAll('.project-card');
      let targetCard = null;
      
      projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent.trim();
        if (title === 'Environmental Impact Assessment on Temukhi Point and Surrounding Areas') {
          targetCard = card;
        }
      });
      
      if (targetCard) {
        const cardRect = targetCard.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Update position and dimensions to match card exactly
        pdfSelectionModal.style.top = (cardRect.top + scrollTop) + 'px';
        pdfSelectionModal.style.left = (cardRect.left + scrollLeft) + 'px';
        pdfSelectionModal.style.width = cardRect.width + 'px';
        pdfSelectionModal.style.height = cardRect.height + 'px';
        
        // Update selection modal dimensions
        const selectionModal = pdfSelectionModal.querySelector('.selection-modal');
        selectionModal.style.width = cardRect.width + 'px';
        selectionModal.style.height = cardRect.height + 'px';
      }
    }
  });
}); 