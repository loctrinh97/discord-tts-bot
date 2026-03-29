Write-Host "=== Discord TTS Bot setup ==="

# 1. Check Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js LTS first: https://nodejs.org/"
    exit 1
}

# 2. Check FFmpeg
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Warning "FFmpeg is not installed or not in PATH. The bot also ships with ffmpeg-static, but having FFmpeg available system-wide helps for debugging."
} else {
    Write-Host "FFmpeg found."
}

# 3. Install Node dependencies
Write-Host "Installing Node dependencies (npm install)..."
npm install

Write-Host "=== Setup finished. To run bot: ==="
Write-Host "npm start"
