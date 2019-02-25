import json
import hashlib

with open('all.json', 'r') as file:
    data = json.load(file)

'''
for game, top50 in data.items():
    sha = hashlib.sha1(game.encode('utf-8'))
    with open(f'{sha.hexdigest()}.json', 'w') as file:
        json.dump(top50, file)
'''