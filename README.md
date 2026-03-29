git clone ...
cd discord-tts-bot
# edit .env
.\setup.ps1
npm run deploy:commands
npm start



# with Docker
docker build -t discord-tts-bot .
docker run -d --restart unless-stopped --env-file .env --name discord-tts-bot discord-tts-bot
