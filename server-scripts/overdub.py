from pydub import AudioSegment

print("Python is trying")

import sys
import json
print 'Number of arguments:', len(sys.argv), 'arguments.'
print 'Argument List:', str(sys.argv)

print(sys.argv[2])
print(sys.argv[3])
roomAddress = sys.argv[1]
sounds = json.loads(sys.argv[2])
duration = sys.argv[3]



combined = AudioSegment.silent(duration=int(duration))
for sound in sounds:
   segment = AudioSegment.from_wav(roomAddress + sounds[sound])
   combined = combined.overlay(segment)

exportAddress = roomAddress + 'combinedfiles.wav'
file_handle = combined.export(exportAddress, format="wav")

print(file_handle)
sys.stdout.flush()

#import os.path
# >>> os.path.join('/my/root/directory', 'in', 'here')
# '/my/root/directory/in/here'