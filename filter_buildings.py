import json
from random import randrange

with open('json/buildings.json.bak') as json_file:
    data = json.load(json_file)
    filtered_buildings = []
    for feature in data['features']:
        rand = randrange(5)
        if rand == 1:
            filtered_buildings.append(feature)



    	

    print(json.dumps(filtered_buildings))