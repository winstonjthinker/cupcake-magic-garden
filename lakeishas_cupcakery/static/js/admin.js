/**
 * Lakeisha's Cupcakery - Admin Dashboard JavaScript
 * Handles all interactive functionality for the admin dashboard
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSidebar();
    initMobileMenu();
    initDropdowns();
    initModals();
    initTabs();
    initForms();
    initDataTables();
    initCharts();
    initNotifications();
    initFileUploads();
    initDatePickers();
    initRichTextEditors();
    
    // Add any other initializations here
});

/**
 * Initialize sidebar functionality
 */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Add overlay to the page
    document.body.appendChild(overlay);
    
    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
            document.body.classList.toggle('sidebar-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('show');
        this.classList.remove('show');
        document.body.classList.remove('sidebar-open');
    });
    
    // Toggle nav sections
    const navSectionHeaders = document.querySelectorAll('.nav-section-header');
    navSectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const section = this.parentElement;
            section.classList.toggle('collapsed');
        });
    });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize dropdown menus
 */
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.nextElementSibling;
            const isActive = dropdown.classList.contains('show');
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show', !isActive);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('[data-toggle="dropdown"]')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

/**
 * Initialize modal dialogs
 */
function initModals() {
    // Open modal
    const modalButtons = document.querySelectorAll('[data-toggle="modal"]');
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const modal = document.querySelector(target);
            
            if (modal) {
                modal.classList.add('show');
                document.body.classList.add('modal-open');
                
                // Focus on first input if exists
                const input = modal.querySelector('input, select, textarea');
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            }
        });
    });
    
    // Close modal
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                closeModal(modal);
            }
        }
    });
    
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // Trigger a custom event when modal is closed
        setTimeout(() => {
            const event = new CustomEvent('modal.closed', { detail: { modal } });
            document.dispatchEvent(event);
        }, 300);
    }
}

/**
 * Initialize tab functionality
 */
function initTabs() {
    const tabLinks = document.querySelectorAll('[data-tab]');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.tabs');
            
            if (!tabContainer) return;
            
            // Update active tab
            tabContainer.querySelectorAll('.tab-link').forEach(tab => {
                tab.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Trigger custom event
            const event = new CustomEvent('tab.changed', { 
                detail: { 
                    tabId,
                    tabElement: this,
                    contentElement: tabContent
                } 
            });
            document.dispatchEvent(event);
        });
    });
}

/**
 * Initialize form validation and enhancements
 */
function initForms() {
    // Add form validation
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            this.classList.add('was-validated');
        });
    });
    
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });
    
    // File input preview
    const fileInputs = document.querySelectorAll('.custom-file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'Choose file';
            const label = this.nextElementSibling;
            label.textContent = fileName;
            
            // Show preview if it's an image
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                const preview = this.closest('.form-group').querySelector('.image-preview');
                
                if (preview) {
                    reader.onload = function(e) {
                        preview.innerHTML = `<img src="${e.target.result}" class="img-thumbnail" style="max-height: 150px;">`;
                    }
                    
                    reader.readAsDataURL(this.files[0]);
                }
            }
        });
    });
}

/**
 * Initialize DataTables for tables with data-table class
 */
function initDataTables() {
    const dataTables = document.querySelectorAll('.data-table');
    
    if (typeof $.fn.DataTable === 'function') {
        dataTables.forEach(table => {
            const options = {
                responsive: true,
                pageLength: 25,
                lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']],
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search...",
                    lengthMenu: "Show _MENU_ entries",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "No entries found",
                    infoFiltered: "(filtered from _MAX_ total entries)",
                    paginate: {
                        first: '«',
                        previous: '‹',
                        next: '›',
                        last: '»'
                    },
                    aria: {
                        sortAscending: ": activate to sort column ascending",
                        sortDescending: ": activate to sort column descending"
                    }
                },
                dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                     "<'row'<'col-sm-12'tr>>" +
                     "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                initComplete: function() {
                    // Add custom classes to elements
                    this.api().container()
                        .addClass('w-100')
                        .find('input[type="search"]')
                        .addClass('form-control form-control-sm')
                        .css('width', '200px')
                        .attr('placeholder', 'Search...');
                }
            };
            
            // Initialize DataTable
            $(table).DataTable(options);
        });
    } else {
        console.warn('DataTables is not loaded. Make sure to include the DataTables library.');
    }
}

/**
 * Initialize charts using Chart.js
 */
function initCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Make sure to include the Chart.js library.');
        return;
    }
    
    // Sales chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        const salesData = JSON.parse(salesCtx.getAttribute('data-sales') || '[]');
        const labels = salesData.map(item => item.date);
        const data = salesData.map(item => item.amount);
        
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales',
                    data: data,
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    borderColor: '#6c5ce7',
                    borderWidth: 2,
                    pointBackgroundColor: '#6c5ce7',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#6c5ce7',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#2d3748',
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 14 },
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Doughnut chart for order status
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        const statusData = JSON.parse(statusCtx.getAttribute('data-status') || '{}');
        const labels = Object.keys(statusData);
        const data = Object.values(statusData);
        const backgroundColors = [
            'rgba(108, 92, 231, 0.8)',
            'rgba(0, 184, 148, 0.8)',
            'rgba(253, 203, 110, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(128, 142, 155, 0.8)'
        ];
        
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }
}

/**
 * Initialize notification system
 */
function initNotifications() {
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (!alert.classList.contains('alert-dismissible')) {
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, 5000);
        }
    });
    
    // Close button for alerts
    document.addEventListener('click', function(e) {
        if (e.target.matches('.alert .close, .alert .close-btn')) {
            e.preventDefault();
            const alert = e.target.closest('.alert');
            if (alert) {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }
        }
    });
    
    // Show toast notification
    window.showToast = function(options) {
        const { type = 'info', message, duration = 5000 } = options;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto hide
        const timer = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        // Close on click
        toast.querySelector('.toast-close').addEventListener('click', function() {
            clearTimeout(timer);
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    };
}

/**
 * Initialize file upload preview
 */
function initFileUploads() {
    const fileInputs = document.querySelectorAll('.file-upload-input');
    
    fileInputs.forEach(input => {
        const container = input.closest('.file-upload');
        if (!container) return;
        
        const preview = container.querySelector('.file-upload-preview');
        const fileName = container.querySelector('.file-upload-name');
        const clearBtn = container.querySelector('.file-upload-clear');
        
        // Show file name on change
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Show file name
                if (fileName) {
                    fileName.textContent = file.name;
                }
                
                // Show image preview
                if (preview && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        preview.innerHTML = `
                            <div class="image-preview-container">
                                <img src="${e.target.result}" alt="Preview" class="img-fluid">
                            </div>
                        `;
                    };
                    
                    reader.readAsDataURL(file);
                }
                
                // Show clear button
                if (clearBtn) {
                    clearBtn.style.display = 'inline-block';
                }
            }
        });
        
        // Clear file input
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                input.value = '';
                
                if (fileName) {
                    fileName.textContent = 'No file chosen';
                }
                
                if (preview) {
                    preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
                }
                
                this.style.display = 'none';
            });
        }
    });
}

/**
 * Initialize date pickers
 */
function initDatePickers() {
    if (typeof flatpickr !== 'undefined') {
        flatpickr('.date-picker', {
            dateFormat: 'Y-m-d',
            allowInput: true
        });
        
        flatpickr('.datetime-picker', {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            time_24hr: true,
            allowInput: true
        });
    }
}

/**
 * Initialize rich text editors
 */
function initRichTextEditors() {
    // Check if Summernote is available
    if (typeof $.fn.summernote === 'function') {
        $('.rich-text-editor').summernote({
            height: 300,
            minHeight: 150,
            maxHeight: 500,
            focus: true,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ]
        });
    } else if (typeof tinymce !== 'undefined') {
        // Fallback to TinyMCE if available
        tinymce.init({
            selector: '.rich-text-editor',
            height: 300,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | bold italic backcolor | \
                     alignleft aligncenter alignright alignjustify | \
                     bullist numlist outdent indent | removeformat | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
            skin: 'oxide',
            content_css: 'default'
        });
    } else {
        console.warn('No rich text editor found. Make sure to include either Summernote or TinyMCE.');
    }
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    if (typeof $ !== 'undefined' && typeof $.fn.tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
    } else if (typeof tippy !== 'undefined') {
        tippy('[data-toggle="tooltip"]', {
            content(reference) {
                return reference.getAttribute('title');
            },
            onShow(instance) {
                instance.reference.removeAttribute('title');
            },
            onHidden(instance) {
                instance.reference.setAttribute('title', instance.reference._tippyContent);
            }
        });
    }
}

/**
 * Initialize select2 for enhanced select elements
 */
function initSelect2() {
    if (typeof $.fn.select2 === 'function') {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: 'Select an option',
            allowClear: true
        });
        
        $('.select2-tags').select2({
            theme: 'bootstrap4',
            width: '100%',
            tags: true,
            tokenSeparators: [',', ' ']
        });
    }
}

// Export functions for use in other scripts
window.AdminUI = {
    showToast: window.showToast,
    initSidebar,
    initModals,
    initTabs,
    initDataTables,
    initCharts,
    initNotifications,
    initFileUploads,
    initDatePickers,
    initRichTextEditors,
    initTooltips,
    initSelect2
};

// Add CSRF token to all AJAX requests
if (typeof $ !== 'undefined') {
    $.ajaxSetup({
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    });
}

// Helper function to get cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Add a simple debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
