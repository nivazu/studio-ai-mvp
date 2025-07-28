// ===== MODERN STUDIO AI SCRIPT =====
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the HTML elements we need
    const generateBtn = document.getElementById('generate-btn');
    const productInput = document.getElementById('product-input');
    const offerInput = document.getElementById('offer-input');
    const resultImage = document.getElementById('result-image');
    const imagePlaceholder = document.getElementById('image-placeholder');
    const resultContainer = document.getElementById('result-container');
    const successModal = document.getElementById('success-modal');
    const downloadBtn = document.querySelector('.download-btn');
    const shareBtn = document.querySelector('.share-btn');
    const regenerateBtn = document.querySelector('.regenerate-btn');

    // Enhanced input animations
    const inputs = [productInput, offerInput];
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            addInputAnimation(input);
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });

        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    });

    // Add floating label animation
    function addInputAnimation(input) {
        if (!input.classList.contains('animate-fade-in')) {
            input.classList.add('animate-fade-in');
        }
    }

    // Enhanced form validation with premium feedback
    function validateForm() {
        const product = productInput.value.trim();
        const offer = offerInput.value.trim();

        if (!product || !offer) {
            showPremiumAlert('אנא מלא את כל השדות כדי ליצור תמונה מדהימה', 'warning');
            // Add shake animation to empty fields
            if (!product) addShakeAnimation(productInput);
            if (!offer) addShakeAnimation(offerInput);
            return false;
        }

        if (product.length < 2 || offer.length < 2) {
            showPremiumAlert('אנא הזן לפחות 2 תווים בכל שדה', 'warning');
            return false;
        }

        return true;
    }

    // Add shake animation for validation feedback
    function addShakeAnimation(element) {
        element.parentElement.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.parentElement.style.animation = '';
        }, 500);
    }

    // Premium alert system
    function showPremiumAlert(message, type = 'info') {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.premium-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `premium-alert premium-alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(alert);

        // Add CSS for premium alert if not exists
        if (!document.querySelector('#premium-alert-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-alert-styles';
            style.textContent = `
                .premium-alert {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 10000;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 1rem;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    animation: slideInRight 0.3s ease-out;
                    max-width: 300px;
                }
                .premium-alert-warning {
                    border-left: 4px solid #f59e0b;
                }
                .premium-alert-info {
                    border-left: 4px solid #3b82f6;
                }
                .alert-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--gray-700);
                    font-weight: 500;
                }
                .alert-content i {
                    color: #f59e0b;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => alert.remove(), 300);
            }
        }, 4000);
    }

    // Enhanced loading state with premium animations
    function setLoadingState(isLoading) {
        if (isLoading) {
            generateBtn.classList.add('loading');
            generateBtn.disabled = true;
            imagePlaceholder.style.display = 'none';
            resultContainer.style.display = 'none';
            
            // Add loading placeholder
            showLoadingPlaceholder();
        } else {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            hideLoadingPlaceholder();
        }
    }

    // Loading placeholder with animated skeleton
    function showLoadingPlaceholder() {
        const loadingHTML = `
            <div class="loading-placeholder">
                <div class="loading-skeleton">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                </div>
                <div class="loading-message">
                    <i class="fas fa-magic"></i>
                    <span>יוצר עבורך תמונה מדהימה...</span>
                </div>
            </div>
        `;

        const imageResult = document.querySelector('.image-result');
        imageResult.innerHTML = loadingHTML;

        // Add loading styles
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading-placeholder {
                    text-align: center;
                    padding: 2rem;
                }
                .loading-skeleton {
                    margin-bottom: 2rem;
                }
                .skeleton-image {
                    width: 100%;
                    height: 300px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 1rem;
                    margin-bottom: 1rem;
                }
                .skeleton-text {
                    height: 20px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 10px;
                    margin: 0.5rem auto;
                    width: 80%;
                }
                .skeleton-text.short {
                    width: 60%;
                }
                .loading-message {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    color: var(--gray-600);
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                .loading-message i {
                    animation: spin 2s linear infinite;
                    color: var(--primary-color, #667eea);
                }
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function hideLoadingPlaceholder() {
        const imageResult = document.querySelector('.image-result');
        imageResult.innerHTML = `
            <div id="image-placeholder" class="image-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-image"></i>
                    <p>התמונה המדהימה שלך תופיע כאן</p>
                    <span class="placeholder-hint">מלא את הפרטים למעלה ולחץ "צור תמונה"</span>
                </div>
            </div>
            
            <div id="result-container" class="result-container" style="display: none;">
                <img id="result-image" src="" alt="התמונה שנוצרה">
                <div class="image-actions">
                    <button class="action-btn download-btn">
                        <i class="fas fa-download"></i>
                        הורד תמונה
                    </button>
                    <button class="action-btn share-btn">
                        <i class="fas fa-share-alt"></i>
                        שתף
                    </button>
                    <button class="action-btn regenerate-btn">
                        <i class="fas fa-redo"></i>
                        צור שוב
                    </button>
                </div>
            </div>
        `;
    }

    // Show success modal with animation
    function showSuccessModal() {
        successModal.style.display = 'flex';
        successModal.style.animation = 'fadeIn 0.3s ease-out';
        document.body.style.overflow = 'hidden';
    }

    // Close modal function (global for onclick)
    window.closeModal = function() {
        successModal.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            successModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    };

    // Enhanced result display with animations
    function showResult(imageUrl) {
        const newResultImage = document.getElementById('result-image');
        const newResultContainer = document.getElementById('result-container');
        const newImagePlaceholder = document.getElementById('image-placeholder');

        if (newResultImage && newResultContainer && newImagePlaceholder) {
            newResultImage.src = imageUrl;
            newImagePlaceholder.style.display = 'none';
            newResultContainer.style.display = 'block';
            newResultContainer.classList.add('animate-fade-in');

            // Show success modal
            setTimeout(() => {
                showSuccessModal();
            }, 500);

            // Reattach event listeners to new buttons
            attachActionListeners();
        }
    }

    // Attach event listeners to action buttons
    function attachActionListeners() {
        const newDownloadBtn = document.querySelector('.download-btn');
        const newShareBtn = document.querySelector('.share-btn');
        const newRegenerateBtn = document.querySelector('.regenerate-btn');

        if (newDownloadBtn) {
            newDownloadBtn.addEventListener('click', handleDownload);
        }
        if (newShareBtn) {
            newShareBtn.addEventListener('click', handleShare);
        }
        if (newRegenerateBtn) {
            newRegenerateBtn.addEventListener('click', handleRegenerate);
        }
    }

    // Enhanced download functionality
    function handleDownload() {
        const imageUrl = document.getElementById('result-image').src;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `studio-ai-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showPremiumAlert('התמונה הורדה בהצלחה!', 'info');
    }

    // Enhanced share functionality
    async function handleShare() {
        const imageUrl = document.getElementById('result-image').src;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'תמונה מ-Studio AI',
                    text: 'צפו בתמונה המדהימה שיצרתי עם Studio AI',
                    url: imageUrl
                });
            } catch (err) {
                console.log('שיתוף בוטל');
            }
        } else {
            // Fallback - copy to clipboard
            try {
                await navigator.clipboard.writeText(imageUrl);
                showPremiumAlert('הקישור הועתק ללוח!', 'info');
            } catch (err) {
                showPremiumAlert('לא ניתן לשתף כרגע', 'warning');
            }
        }
    }

    // Regenerate functionality
    function handleRegenerate() {
        handleGenerateClick();
    }

    // Main function to handle the button click with enhanced UX
    const handleGenerateClick = async () => {
        // Validate form
        if (!validateForm()) {
            return;
        }

        const product = productInput.value.trim();
        const offer = offerInput.value.trim();

        // Set loading state
        setLoadingState(true);

        try {
            // API Call with enhanced error handling
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: product,
                    offer: offer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'אירעה שגיאה בשרת');
            }

            const data = await response.json();
            
            // Show success result with animation
            setTimeout(() => {
                showResult(data.imageUrl);
            }, 1000); // Small delay for better UX

        } catch (error) {
            console.error('Error:', error);
            showPremiumAlert(`משהו השתבש: ${error.message}`, 'warning');
            
            // Reset placeholder
            const newImagePlaceholder = document.getElementById('image-placeholder');
            if (newImagePlaceholder) {
                newImagePlaceholder.style.display = 'block';
                newImagePlaceholder.querySelector('p').textContent = 'יצירת התמונה נכשלה. נסה שוב.';
            }
        } finally {
            setLoadingState(false);
        }
    };

    // Attach main event listener
    generateBtn.addEventListener('click', handleGenerateClick);

    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleGenerateClick();
        }
        if (e.key === 'Escape') {
            if (successModal.style.display === 'flex') {
                closeModal();
            }
        }
    });

    // Add fade-in animation styles
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize page with animation
    document.body.classList.add('animate-fade-in');
});
