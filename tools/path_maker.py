import json
import math
from random import randrange

DISTANCE_UNIT = 0.00002435159132531553
TIME_PER_UNIT = 1
CARS_PER_SEGMENT = 100
new_data = []

# https://community.esri.com/thread/158038
def point_distance(point1, point2):
    return math.sqrt(((point1[0] - point2[0]) ** 2) + ((point1[1] - point2[1]) ** 2))

with open('../json/trips.json.bak') as json_file:
    data = json.load(json_file)
    for path_segment in data:
        for _ in range(0, CARS_PER_SEGMENT):
            car = {
                'path': path_segment['path']
            }
            timestamps = []
            timestamps_needed = len(path_segment['path'])
            time = 10 * randrange(500)

            for i in range(0, timestamps_needed):
                time_to_point = 0
                if i != 0:
                    current_point = path_segment['path'][i]
                    previous_point = path_segment['path'][i - 1]
                    distance = point_distance(previous_point, current_point)
                    time_to_point = round((distance / DISTANCE_UNIT) * TIME_PER_UNIT)
#                    print(time_to_point)
                time += time_to_point
                timestamps.append(time)
            
            car['timestamps'] = timestamps
            new_data.append(car)
    for path_segment in data:
        for _ in range(0, CARS_PER_SEGMENT):
            car = {
                'path': path_segment['path']
            }
            timestamps = []
            # Reverse the path
            reversed_path = path_segment['path'][::-1]
            car['path'] = reversed_path

            timestamps_needed = len(reversed_path)
            time = 10 * randrange(500)

            for i in range(0, timestamps_needed):
                time_to_point = 0
                if i != 0:
                    current_point = reversed_path[i]
                    previous_point = reversed_path[i - 1]
                    distance = point_distance(previous_point, current_point)
                    time_to_point = round((distance / DISTANCE_UNIT) * TIME_PER_UNIT)
                time += time_to_point
                timestamps.append(time)
            
            car['timestamps'] = timestamps
            new_data.append(car)

    output_file = open('../json/trips.json', 'w+');
    output_file.write('const ROADS = ' + json.dumps(new_data))
    output_file.close()
    print('Wrote new trips to ../json/trips.json')
    