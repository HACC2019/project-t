import STATION_RECORDS from '../json/station_records';

const STATION_FAULT_THRESHOLD = 30;

export function getWeekNumber(date) {
    const DAY = 1000 * 60 * 60 * 24;
    // Unix epoch happens on Thursday, so add three days
    // And divide by seven days a week
    //  (new Date('01-05-1970 00:00-0000').getTime() + (DAY * 3)) / (DAY * 7)
    let adjustedEpoch = new Date('01-04-1970 00:00:00').getTime();

    return Math.floor((date.getTime() - adjustedEpoch) / (DAY * 7));
    //    (new Date('10-20-19 00:00:00-0000').getTime() + (1000 * 60 * 60 * 24 * 3)) / (1000 * 60 * 60 * 24 * 7)
}

export function processStationRecords() {
    function sum(accumulator, currentValue) {
        return accumulator + currentValue;
    }

    let stationMap = new Map();
    let faultMap = new Map();
    
    for (let record of STATION_RECORDS) {
        if (!stationMap.has(record['id'])) {
            stationMap.set(record['id'], []);
        }

        let weekRecords = stationMap.get(record['id']);
        let weekIndex = getWeekNumber(new Date(record['Start Time']));

        if (weekRecords[weekIndex] === undefined) {
            weekRecords[weekIndex] = [];
        }

        weekRecords[weekIndex].push(record);
    }

    for (let [stationID, stationWeeks] of stationMap) {
        let xyValues = [];
        let xValues = [];
        let yValues = [];
        let weekCount = 0;
        let weeklyAverage = 0;

        for (let week = 0; week < stationWeeks.length; week++) {
            let weekRecords = stationWeeks[week];

            if (weekRecords === undefined) {
                continue;
            }

            xyValues.push(week * weekRecords.length );
            xValues.push(week);
            yValues.push(weekRecords.length);
            weeklyAverage += weekRecords.length;
            weekCount++;
        }

        // https://classroom.synonym.com/calculate-trendline-2709.html
        let a = weekCount * xyValues.reduce(sum);
        let b = xValues.reduce(sum) * yValues.reduce(sum);
        let c = weekCount * xValues.reduce((accumulator, currentValue) => accumulator + currentValue ** 2, 0);
        let d = xValues.reduce(sum) ** 2;
        let m = (a - b) / (c - d);
        let e = yValues.reduce(sum);
        let f = m * xValues.reduce(sum);
        let yint = (e - f) / weekCount;

        stationWeeks.slopeIntercept = (x) => {
            return m * x + yint;
        }

        stationWeeks.average = weeklyAverage / weekCount;

        for (let week = 0; week < stationWeeks.length; week++) {
            let weekRecords = stationWeeks[week];

            if (weekRecords === undefined) {
                continue;
            }

            let percentError = (stationWeeks.slopeIntercept(week) - weekRecords.length) / weekRecords.length * 100;

            if (percentError > STATION_FAULT_THRESHOLD) {
                if (!faultMap.has(stationID)) {
                    faultMap.set(stationID, [])
                }
              
                let faultRecords = faultMap.get(stationID);
                
                faultRecords.push({
                    week: week,
                    expected: stationWeeks.slopeIntercept(week),
                    received: weekRecords.length
                });
                
                console.log(`POSSIBLE FAULT AT STATION ${stationID} IN WEEK ${week}. Expected ${stationWeeks.slopeIntercept(week)}, but only had ${weekRecords.length}`);
            }
        }
    }

    return faultMap;
}

console.log(processStationRecords());
