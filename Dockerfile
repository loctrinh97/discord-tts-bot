# Use Node.js base image with Debian
FROM node:20-bullseye

# Install Python 3 + pip + FFmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Node dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Install Python dependencies (for tts.py)
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the source code
COPY . .

# Set env
ENV NODE_ENV=production

# Default command to run the bot
CMD ["node", "bot.js"]
