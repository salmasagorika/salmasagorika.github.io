// PDF Modal functionality for academic projects
document.addEventListener('DOMContentLoaded', function() {
  // PDF Modal elements
  const modal = document.getElementById('pdfModal');
  const pdfViewer = document.getElementById('pdfViewer');
  const closeModal = document.querySelector('.close-modal');

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
      } else {
        alert('Project details coming soon!');
      }
    });
  });

  // Close modal event listeners
  closeModal.addEventListener('click', closePDFModal);
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closePDFModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closePDFModal();
    }
  });
}); 