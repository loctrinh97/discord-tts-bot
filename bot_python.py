import os
import discord
import asyncio
from discord.ext import commands
from gtts import gTTS
from dotenv import load_dotenv

# Load the token from the .env file
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

# Set up the bot without a command prefix
bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())

# Function to generate TTS and save it as an mp3 file
async def generate_tts(text, lang='vi'):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: generate_tts_sync(text, lang))

def generate_tts_sync(text, lang='vi'):
    tts = gTTS(text=text, lang=lang, slow=False)
    filename = f"tts_output_{text[:10]}.mp3"  # Create unique filename based on text
    tts.save(filename)
    return filename

# Function to auto-join the user's voice channel
async def auto_join(ctx):
    if ctx.author.voice:
        channel = ctx.author.voice.channel
        await channel.connect()
        await ctx.send("Auto-joined your voice channel.")
    else:
        await ctx.send("You're not in a voice channel! Join one first so I can follow you.")

# Listener to respond to messages without needing a prefix
@bot.event
async def on_message(message):
    if message.author == bot.user:
        return  # Ignore messages from the bot itself

    content = message.content.lower()

    # Auto-join the user's voice channel and play TTS if the message starts with "say"
    if content.startswith('say'):
        # Extract the text to say after "say"
        text_to_say = message.content[4:].strip()

        # Check if the bot is already connected to a voice channel
        voice_client = discord.utils.get(bot.voice_clients, guild=message.guild)

        # If the bot is not connected, automatically join the user's voice channel
        if not voice_client or not voice_client.is_connected():
            await auto_join(message)
            voice_client = discord.utils.get(bot.voice_clients, guild=message.guild)

        if not voice_client:
            return  # Exit if we couldn't join a voice channel

        try:
            # Generate the TTS audio file asynchronously
            tts_file = await generate_tts(text_to_say)

            # Check if something is already playing and stop it
            if voice_client.is_playing():
                voice_client.stop()

            # Play the TTS file in the voice channel
            voice_client.play(discord.FFmpegPCMAudio(tts_file), after=lambda e: os.remove(tts_file))
            await message.channel.send(f"Playing: {text_to_say}")
        except Exception as e:
            await message.channel.send(f"An error occurred: {e}")

    # Process other commands normally if they exist
    await bot.process_commands(message)

# Bot command to manually join a voice channel
@bot.command(name='join')
async def join(ctx):
    if ctx.author.voice:
        channel = ctx.author.voice.channel
        await channel.connect()
        await ctx.send("Bot has joined the voice channel.")
    else:
        await ctx.send("You need to join a voice channel first!")

# Bot command to leave the voice channel
@bot.command(name='leave')
async def leave(ctx):
    voice_client = discord.utils.get(bot.voice_clients, guild=ctx.guild)
    if voice_client and voice_client.is_connected():
        await voice_client.disconnect()
        await ctx.send("Bot has left the voice channel.")
    else:
        await ctx.send("I'm not in a voice channel!")

# Run the bot
bot.run(TOKEN)
