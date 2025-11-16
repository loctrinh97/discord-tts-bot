git clone ...
cd discord-tts-bot
# sửa .env
.\setup.ps1
.\.venv\Scripts\activate
node bot.js



# with Docker
docker build -t discord-tts-bot .
docker run -d --restart unless-stopped --env-file .env --name discord-tts-bot discord-tts-bot
