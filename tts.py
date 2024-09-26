# tts.py
from gtts import gTTS
import sys

def generate_tts(text, output_file):
    tts = gTTS(text=text, lang='vi')
    tts.save(output_file)

if __name__ == "__main__":
    # Accept text as a command-line argument
    text = sys.argv[1]
    output_file = sys.argv[2]
    generate_tts(text, output_file)
