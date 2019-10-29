import json

with open('json/road14.json') as json_file:
    data = json.load(json_file)
    obj = {
        'path': []
    }
    for p in data['snappedPoints']:
        obj['path'].append([p['location']['longitude'], p['location']['latitude']])

    print(json.dumps(obj))