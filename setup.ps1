Write-Host "=== Discord TTS Bot setup ==="

# 1. Check Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js LTS first: https://nodejs.org/"
    exit 1
}

# 2. Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed or not in PATH. Please install Python 3 and check 'Add to PATH'."
    exit 1
}

# 3. Check FFmpeg
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Warning "FFmpeg is not installed or not in PATH. TTS voice playback may fail."
    Write-Warning "Download FFmpeg: https://www.gyan.dev/ffmpeg/builds/"
} else {
    Write-Host "FFmpeg found."
}

# 4. Install Node dependencies
Write-Host "Installing Node dependencies (npm install)..."
npm install

# 5. Create Python venv and install pip deps
Write-Host "Creating Python virtual environment (.venv)..."
python -m venv .venv

Write-Host "Installing Python dependencies (gTTS)..."
.\.venv\Scripts\pip install --upgrade pip
.\.venv\Scripts\pip install -r requirements.txt

Write-Host "=== Setup finished. To run bot: ==="
Write-Host "1) Activate venv: .\.venv\Scripts\activate"
Write-Host "2) Run: node bot.js"
