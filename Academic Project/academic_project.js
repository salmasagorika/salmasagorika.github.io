// Placeholder for future interactivity
// Example: handle 'View Project' button clicks

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn-view').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Find the project title related to this button
      const projectCard = btn.closest('.project-card');
      const title = projectCard.querySelector('.project-title').textContent.trim();
      if (title === 'Dynamics of Shoreline Changes on Bhasan Char Island') {
        window.location.href = '/project-reports/BhasanChar.html';
      } else {
        alert('Project details coming soon!');
      }
    });
  });
}); 