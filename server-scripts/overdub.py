
from sys import argv
import json

roomAddress = argv[1]
soundDic = json.loads(argv[2])
duration = argv[3]

from pydub import AudioSegment

combined = AudioSegment.silent(duration=int(duration))
for sound in soundDic:
   segment = AudioSegment.from_wav(roomAddress + soundDic[sound])
   combined = combined.overlay(segment) 

exportAddress = roomAddress + 'combinedfiles.wav'
file_handle = combined.export(exportAddress, format="wav")