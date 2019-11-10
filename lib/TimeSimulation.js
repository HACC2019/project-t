import STATION_RECORDS from '../json/station_records';
const DAY = 1000 * 60 * 60 * 24;

export default class TimeSimulation {
    constructor() {
        this._records = STATION_RECORDS.slice().filter((record) => {
          // Filter only "valid" records
          return record['Energy(kWh)'] > 0;
        });

        // Add Date objects to all records
        for (let record of this._records) {
            record['Start Time'] = new Date(record['Start Time']);
            record['End Time'] = new Date(record['End Time']);
        }

        this._records.sort((a, b) => {
            let aTime = a['End Time'];
            let bTime = b['End Time'];

            if (aTime < bTime) {
                return -1
            } else if (aTime > bTime) {
                return 1
            } else {
                return 0;
            }
        });
        this._currentTime = 0;
        this._currentRecords = [];
        this._listeners = [];

        this.setTime(new Date('09-01-18 17:00:00').getTime());
    }

    getWeekNumber() {
        let adjustedEpoch = new Date('01-04-1970 00:00:00').getTime();

        return Math.floor((this._currentTime - adjustedEpoch) / (DAY * 7));
    }

    getTime() {
        return this._currentTime;
    }

    setTime(time) {
        if (time < this._currentTime) {
            // If the new time is earlier than the current time, just take a subset of the current data
            let removeIndex = this._currentRecords.length;
            
            for (let i = this._currentRecords.length - 1; i >= 0; i--) {
                if (this._currentRecords[i]['End Time'].getTime() > time) {
                    removeIndex = i;
                } else {
                    break;
                }
            }
            
            this._currentRecords.splice(removeIndex, this._currentRecords.length - removeIndex);
        } else if (time > this._currentTime) {
            // If the new time is later than the earlier time, just add records to the data
            for (let i = this._currentRecords.length; i < this._records.length; i++) {
                if (this._records[i]['End Time'].getTime() <= time) {
                    this._currentRecords.push(this._records[i]);
                } else {
                    break;
                }
            }
        }

        this._currentTime = time;

        for (let callback of this._listeners) {
            callback(this.getRecords());
        }
    }

    nextDay() {
        this.setTime(this._currentTime + (86400 * 1000));
    }

    previousDay() {
        this.setTime(this._currentTime - (86400 * 1000));
    }

    nextWeek() {
        this.setTime(this._currentTime + (604800 * 1000));
    }

    previousWeek() {
        this.setTime(this._currentTime - (604800 * 1000));
    }

    getRecords() {
        return this._currentRecords;
    }

    addListener(callback) {
        this._listeners.push(callback);
    }
}
