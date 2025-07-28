#!/usr/bin/env python3
"""
Studio AI Demo Script
Demonstrates API usage and showcases the application functionality
"""

import requests
import json
import time
from datetime import datetime

def print_header():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                    🎨 Studio AI Demo                        ║
║               API Usage Demonstration                        ║
╚══════════════════════════════════════════════════════════════╝
    """)

def demo_api_call():
    """Demonstrate API call to generate image"""
    
    print("🚀 Starting Studio AI Demo...\n")
    
    # Demo data
    demo_requests = [
        {
            "product": "נעלי ספורט מעוצבות",
            "offer": "50% הנחה",
            "description": "Stylish sport shoes with 50% discount"
        },
        {
            "product": "עוגת שוקולד עשירה",
            "offer": "מהדורה מוגבלת",
            "description": "Rich chocolate cake - limited edition"
        },
        {
            "product": "תיק עור איכותי",
            "offer": "קולקציה חדשה",
            "description": "High-quality leather bag - new collection"
        }
    ]
    
    base_url = "http://localhost:8000"
    
    print(f"🔗 Testing connection to {base_url}...")
    
    try:
        # Test if server is running
        response = requests.get(base_url, timeout=5)
        print("✅ Server is running!")
    except requests.exceptions.RequestException:
        print("❌ Server is not running. Please start the server first:")
        print("   python start.py")
        print("   OR")
        print("   uvicorn main:app --host 0.0.0.0 --port 8000")
        return
    
    print("\n" + "="*60)
    print("🎯 Testing Image Generation API")
    print("="*60)
    
    for i, demo_data in enumerate(demo_requests, 1):
        print(f"\n📝 Demo {i}: {demo_data['description']}")
        print(f"   Product: {demo_data['product']}")
        print(f"   Offer: {demo_data['offer']}")
        
        # Prepare request
        api_url = f"{base_url}/api/generate-image"
        payload = {
            "product": demo_data["product"],
            "offer": demo_data["offer"]
        }
        
        print(f"📤 Sending request to {api_url}")
        
        start_time = time.time()
        
        try:
            response = requests.post(
                api_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=120  # 2 minutes timeout
            )
            
            end_time = time.time()
            duration = end_time - start_time
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Success! (took {duration:.2f} seconds)")
                print(f"🖼️  Image URL: {base_url}{result['imageUrl']}")
                
                # Save response to file for reference
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"demo_result_{i}_{timestamp}.json"
                
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump({
                        "request": payload,
                        "response": result,
                        "duration": duration,
                        "timestamp": timestamp
                    }, f, indent=2, ensure_ascii=False)
                
                print(f"💾 Result saved to: {filename}")
                
            else:
                print(f"❌ Error {response.status_code}: {response.text}")
                
        except requests.exceptions.Timeout:
            print("⏰ Request timed out (this is normal for first request as model loads)")
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        
        if i < len(demo_requests):
            print("\n⏳ Waiting 3 seconds before next request...")
            time.sleep(3)
    
    print("\n" + "="*60)
    print("🎉 Demo completed!")
    print("="*60)
    print("\n💡 Tips:")
    print("   • Open your browser and go to http://localhost:8000")
    print("   • Try the beautiful web interface")
    print("   • Check the generated images in static/generated_images/")
    print("   • View demo results in the generated JSON files")

def main():
    print_header()
    demo_api_call()

if __name__ == "__main__":
    main()