import json

from random import randrange

x = []
new_data = []

with open('json/trips.json.bak') as json_file:
    data = json.load(json_file)
    for row in data:
        for _ in range(0, 100):
            temp = {
                'path': row['path']
            }
            timestamps = []
            timestamps_needed = len(row['path'])
            time = 100 * randrange(50)

            for _ in range(0, timestamps_needed):
                t = randrange(25)
                time += t
                timestamps.append(time)
            
            temp['timestamps'] = timestamps
            new_data.append(temp)
    for row in data:
        for _ in range(0, 100):
            temp = {
                'path': row['path']
            }
            timestamps = []
            tp = row['path'][::-1]
            temp['path'] = tp

            timestamps_needed = len(row['path'])
            time = 100 * randrange(50)

            for _ in range(0, timestamps_needed):
                t = randrange(25)
                time += t
                timestamps.append(time)
            
            temp['timestamps'] = timestamps
            new_data.append(temp)

    print(json.dumps(new_data))