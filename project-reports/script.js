/**
 * Enhanced LaTeX to Styled HTML JavaScript
 * ========================================
 * 
 * This script provides enhanced functionality for the styled HTML document:
 * - MathJax configuration
 * - Scroll-based sidebar highlighting
 * - Keyboard navigation
 * - Reference link handling
 * - Figure, table, and equation reference management
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Enhanced LaTeX to Styled HTML initialized!');
    
    // Initialize all functionality
    initMathJax();
    initScrollHighlighting();
    initKeyboardNavigation();
    initReferenceHandling();
    initFigureTableReferences();
    initMobileNavToggle();
    initSidebarAutoCloseOnTOCClick();
});

/**
 * MathJax Configuration
 */
function initMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }
}

/**
 * Reference Link Handling
 */
function initReferenceHandling() {
    // Handle figure, table, and equation references
    const refLinks = document.querySelectorAll('.figure-ref, .table-ref, .equation-ref');
    refLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Highlight the target briefly
                target.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    target.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

/**
 * Figure, Table, and Equation Reference Management
 */
function initFigureTableReferences() {
    // Add click handlers to figures, tables, and equations
    const figures = document.querySelectorAll('.figure-container');
    const tables = document.querySelectorAll('.table-wrapper');
    const equations = document.querySelectorAll('.equation-container');
    
    figures.forEach(figure => {
        figure.addEventListener('click', function() {
            const caption = this.querySelector('.figure-caption');
            if (caption) {
                // Copy figure number to clipboard
                const figureText = caption.textContent;
                navigator.clipboard.writeText(figureText).then(() => {
                    showNotification(`Copied: ${figureText}`);
                });
            }
        });
    });
    
    tables.forEach(table => {
        table.addEventListener('click', function() {
            const caption = this.querySelector('.table-caption');
            if (caption) {
                // Copy table number to clipboard
                const tableText = caption.textContent;
                navigator.clipboard.writeText(tableText).then(() => {
                    showNotification(`Copied: ${tableText}`);
                });
            }
        });
    });
    
    equations.forEach(equation => {
        equation.addEventListener('click', function() {
            const caption = this.querySelector('.equation-caption');
            if (caption) {
                // Copy equation number to clipboard
                const equationText = caption.textContent;
                navigator.clipboard.writeText(equationText).then(() => {
                    showNotification(`Copied: ${equationText}`);
                });
            }
        });
    });

    // Clean up equation numbers
    const equationNumbers = document.querySelectorAll('.equation-number');
    equationNumbers.forEach(num => {
        num.textContent = num.textContent.replace(/Equation\s?/, '');
    });
}

/**
 * Show notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Scroll-based Sidebar Highlighting
 */
function initScrollHighlighting() {
    const sections = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocLinks = document.querySelectorAll('#TOC a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Keyboard Navigation
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Navigation shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'h':
            e.preventDefault();
                    document.querySelector('.sidebar').classList.toggle('active');
                    break;
                case 't':
            e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'b':
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    break;
            }
        }
    });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNavToggle() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContainer = document.querySelector('.main-container');

    if (mobileNavToggle && sidebar && mainContainer) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
            mainContainer.classList.toggle('sidebar-active');
        });
    }
}

/**
 * Auto-close sidebar on TOC click (mobile/tablet)
 * For BhasanChar.html sidebar
 */
function initSidebarAutoCloseOnTOCClick() {
    const tocLinks = document.querySelectorAll('#TOC a[href^="#"]');
    const sidebar = document.querySelector('.sidebar');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mainContainer = document.querySelector('.main-container');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 900 && sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (mobileNavToggle) mobileNavToggle.classList.remove('active');
                if (mainContainer) mainContainer.classList.remove('sidebar-active');
            }
        });
    });
}
