import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Import our custom logic
from image_generator import translate_text, create_flux_prompt, generate_image_with_flux

# Load environment variables from a .env file
# This should be at the top to ensure variables are available
load_dotenv()

# --- Pydantic Models ---
# Defines the structure of the JSON we expect from the frontend
class OfferRequest(BaseModel):
    product: str
    offer: str

# --- FastAPI App Initialization ---
app = FastAPI()

# --- API Endpoints ---
@app.post("/api/generate-image")
async def generate_image_endpoint(request: OfferRequest):
    """
    This is the main API endpoint that the frontend will call.
    It orchestrates the entire process from translation to image generation.
    """
    print(f"Received request for product: '{request.product}' with offer: '{request.offer}'")

    # Step 1: Translate the user's Hebrew input to English
    try:
        translated_product = translate_text(request.product)
        translated_offer = translate_text(request.offer)
    except Exception as e:
        print(f"An error occurred during translation: {e}")
        raise HTTPException(status_code=500, detail="Translation service failed.")

    # Step 2: Engineer the high-quality prompt for the Flux.1 model
    final_prompt = create_flux_prompt(translated_product, translated_offer)
    print(f"Generated Final Prompt: {final_prompt}")

    # Step 3: Call the image generation function
    try:
        image_path = generate_image_with_flux(final_prompt)
        if image_path:
            # If successful, return the path to the generated image
            return {"imageUrl": image_path}
        else:
            # Handle cases where image generation failed
            raise HTTPException(status_code=503, detail="Image generation service failed or is unavailable.")
    except Exception as e:
        print(f"An unexpected error occurred during image generation: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")


# --- Static Files Mounting ---
# This line must be LAST to ensure API routes are registered first.
# It serves the HTML, CSS, and JS files from the 'static' directory.
app.mount("/", StaticFiles(directory="static", html=True), name="static")

