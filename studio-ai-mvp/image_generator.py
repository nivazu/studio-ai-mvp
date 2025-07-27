import os
import requests
from google.cloud import translate_v2 as translate
from PIL import Image
from io import BytesIO
import uuid

# --- Configuration ---
# It's better to load these from environment variables in main.py
# and pass them as arguments, but for clarity, we define them here.
HUGGING_FACE_API_TOKEN = os.getenv("HUGGING_FACE_API_TOKEN")
# Note: For Google Cloud, ensure you have set up authentication correctly.
# This usually means setting the GOOGLE_APPLICATION_CREDENTIALS environment variable.
# For example: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"

# The specific Flux.1 model we want to use via the Hugging Face Inference API
FLUX_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"


def translate_text(text: str) -> str:
    """
    Translates a given text from Hebrew to English using Google Cloud Translate API.
    
    Args:
        text (str): The Hebrew text to translate.

    Returns:
        str: The translated English text, or the original text if translation fails.
    """
    try:
        translate_client = translate.Client()
        result = translate_client.translate(text, target_language='en', source_language='iw')
        print(f"Translated '{text}' to '{result['translatedText']}'")
        return result['translatedText']
    except Exception as e:
        print(f"Error during translation: {e}")
        # Fallback to original text if translation fails
        return text

def create_flux_prompt(product_name: str, offer_text: str) -> str:
    """
    Constructs a highly detailed, "magic" prompt for the Flux.1 model
    to achieve maximum realism for a commercial product.
    
    Args:
        product_name (str): The name of the product (in English).
        offer_text (str): The text for the special offer (in English).

    Returns:
        str: The fully engineered prompt.
    """
    template = (
        "Award-winning product photography of {product_name}. "
        "Hyper-realistic, 8k resolution, insane detail. "
        "Shot on a Sony a7R IV with a 85mm F1.4 lens. "
        "Elegant, clean composition with soft, cinematic studio lighting. "
        "The background is a neutral, out-of-focus studio setting. "
        "A subtle, tastefully designed graphic element shows the text '{offer_text}'. "
        "Commercial, advertising aesthetic, ready for a high-end magazine cover."
    )
    return template.format(product_name=product_name, offer_text=offer_text)

def generate_image_with_flux(prompt: str) -> str | None:
    """
    Sends a prompt to the Flux.1 model via Hugging Face's Inference API
    and saves the resulting image.

    Args:
        prompt (str): The detailed prompt for the image generation.

    Returns:
        str | None: The file path to the saved image, or None if generation failed.
    """
    if not HUGGING_FACE_API_TOKEN:
        print("Error: HUGGING_FACE_API_TOKEN is not set.")
        return None

    headers = {"Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}"}
    payload = {"inputs": prompt}

    print("Sending request to Flux.1 model...")
    try:
        response = requests.post(FLUX_API_URL, headers=headers, json=payload, timeout=120) # Increased timeout for model loading
        
        # Check for successful response
        if response.status_code == 200:
            # Generate a unique filename to avoid overwriting
            unique_filename = f"{uuid.uuid4()}.jpg"
            save_path_dir = "static/generated_images"
            
            # Create directory if it doesn't exist
            os.makedirs(save_path_dir, exist_ok=True)
            
            full_path = os.path.join(save_path_dir, unique_filename)

            # Open the image from the binary response and save it
            image = Image.open(BytesIO(response.content))
            image.save(full_path)
            
            print(f"Image successfully generated and saved to {full_path}")
            # Return the web-accessible path
            return f"/{full_path}"
        else:
            # Handle API errors
            print(f"Error from Hugging Face API: Status Code {response.status_code}")
            print(f"Response: {response.text}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request to Hugging Face: {e}")
        return None
