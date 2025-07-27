document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the HTML elements we need
    const generateBtn = document.getElementById('generate-btn');
    const productInput = document.getElementById('product-input');
    const offerInput = document.getElementById('offer-input');
    const resultImage = document.getElementById('result-image');
    const imagePlaceholder = document.getElementById('image-placeholder');
    const spinner = generateBtn.querySelector('.spinner');
    const btnText = generateBtn.querySelector('.btn-text');

    // Main function to handle the button click
    const handleGenerateClick = async () => {
        const product = productInput.value.trim();
        const offer = offerInput.value.trim();

        // Basic validation to ensure inputs are not empty
        if (!product || !offer) {
            alert('אנא מלא את כל השדות כדי ליצור תמונה.');
            return;
        }

        // --- UI updates for loading state ---
        generateBtn.disabled = true;
        spinner.style.display = 'block';
        btnText.style.display = 'none';
        imagePlaceholder.style.display = 'none';
        resultImage.style.display = 'none'; // Hide previous image

        try {
            // --- API Call using fetch ---
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

            // Check if the server responded with an error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'אירעה שגיאה בשרת');
            }

            const data = await response.json();

            // --- UI updates on success ---
            resultImage.src = data.imageUrl;
            resultImage.style.display = 'block';
            imagePlaceholder.style.display = 'none';

        } catch (error) {
            // --- UI updates on failure ---
            console.error('Error:', error);
            alert(`אופס, משהו השתבש: ${error.message}`);
            imagePlaceholder.style.display = 'block'; // Show the placeholder again on error
            imagePlaceholder.querySelector('p').textContent = 'יצירת התמונה נכשלה. נסה שוב.';
        } finally {
            // --- Reset UI regardless of success or failure ---
            generateBtn.disabled = false;
            spinner.style.display = 'none';
            btnText.style.display = 'block';
        }
    };

    // Attach the event listener to the button
    generateBtn.addEventListener('click', handleGenerateClick);
});
