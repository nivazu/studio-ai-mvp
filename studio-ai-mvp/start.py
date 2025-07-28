#!/usr/bin/env python3
"""
Studio AI Startup Script
Enhanced startup with environment validation and user-friendly messages
"""

import os
import sys
import subprocess
from pathlib import Path

def print_banner():
    """Print the Studio AI banner"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                         🎨 Studio AI                        ║
    ║                Premium Marketing Image Generator              ║
    ║                                                              ║
    ║  Transform ideas into stunning professional images           ║
    ║  using cutting-edge FLUX.1 AI technology                    ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python version: {sys.version.split()[0]}")

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import requests
        import PIL
        print("✅ All dependencies installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e.name}")
        print("   Run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = Path(".env")
    env_example_path = Path(".env.example")
    
    if not env_path.exists():
        if env_example_path.exists():
            print("⚠️  .env file not found")
            print("   Copy .env.example to .env and add your API keys:")
            print("   cp .env.example .env")
        else:
            print("❌ No environment configuration found")
        return False
    
    # Load and check .env content
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        hf_token = os.getenv("HUGGING_FACE_API_TOKEN")
        if not hf_token or hf_token == "your_hugging_face_token_here":
            print("⚠️  Hugging Face API token not configured")
            print("   Get your token from: https://huggingface.co/settings/tokens")
            return False
        
        print("✅ Environment variables configured")
        return True
        
    except ImportError:
        print("⚠️  python-dotenv not installed")
        return False

def create_directories():
    """Create necessary directories"""
    dirs = [
        "static/generated_images"
    ]
    
    for directory in dirs:
        Path(directory).mkdir(parents=True, exist_ok=True)
    
    print("✅ Directories created")

def start_server():
    """Start the FastAPI server"""
    print("\n🚀 Starting Studio AI server...")
    print("   Server will be available at: http://localhost:8000")
    print("   Press Ctrl+C to stop the server\n")
    
    try:
        # Try to start with uvicorn
        cmd = [
            "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ]
        subprocess.run(cmd)
    except FileNotFoundError:
        print("❌ uvicorn not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "uvicorn[standard]"])
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n\n👋 Studio AI server stopped. Goodbye!")

def main():
    """Main startup function"""
    print_banner()
    
    # Check system requirements
    check_python_version()
    
    # Check dependencies
    if not check_dependencies():
        print("\n📦 Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print()
    
    # Check environment
    env_ok = check_env_file()
    
    # Create directories
    create_directories()
    
    if not env_ok:
        print("\n⚠️  Environment setup incomplete!")
        print("   Please configure your API keys in .env file before starting.")
        print("   See README.md for detailed setup instructions.")
        choice = input("\n   Continue anyway? (y/N): ").lower().strip()
        if choice != 'y':
            print("👋 Setup your environment and run again!")
            sys.exit(0)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()