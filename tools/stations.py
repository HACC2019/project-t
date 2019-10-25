import json

with open('json/chargestations.json.bak') as json_file:
    data = json.load(json_file)
    for p in data:
    	lng = p['Longitude']
    	lat = p['Latitude']

    	contour = [
            [lng + .001, lat - .001],
    		[lng + .001, lat + .001],
    		[lng - .001, lat + .001],
    		[lng - .001, lat - .001]
    	]
    	p['contour'] = contour

    print(json.dumps(data))