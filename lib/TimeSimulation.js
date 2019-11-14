import STATION_RECORDS from '../json/station_records';
const DAY = 1000 * 60 * 60 * 24;

export default class TimeSimulation {
    constructor() {
        this._validRecords = STATION_RECORDS.slice();
          
        // Add Date objects to all records
        for (let record of this._validRecords) {
            record['Start Time'] = new Date(record['Start Time']);
            record['End Time'] = new Date(record['End Time']);
        }

        this._validRecords.sort((a, b) => {
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
        
        this._invalidRecords = this._validRecords.slice().filter((record) => {
          // Filter only "invalid" records
          return record['Energy(kWh)'] === 0;
        });
          
        this._validRecords = this._validRecords.filter((record) => {
          // Filter only "valid" records
          return record['Energy(kWh)'] > 0;
        });

        this._currentTime = 0;
        this._currentValidRecords = [];
        this._currentInvalidRecords = [];
        this._listeners = [];

        this.setTime(new Date('09-01-18 00:00:00').getTime());
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
            let removeValidIndex = this._currentValidRecords.length;
            let removeInvalidIndex = this._currentValidRecords.length;
            
            for (let i = this._currentValidRecords.length - 1; i >= 0; i--) {
                if (this._currentValidRecords[i]['End Time'].getTime() > time) {
                    removeValidIndex = i;
                } else {
                    break;
                }
            }
            
            for (let i = this._currentInvalidRecords.length - 1; i >= 0; i--) {
                if (this._currentInvalidRecords[i]['End Time'].getTime() > time) {
                    removeInvalidIndex = i;
                } else {
                    break;
                }
            }
          
            this._currentValidRecords.splice(removeValidIndex, this._currentValidRecords.length - removeValidIndex);
            this._currentInvalidRecords.splice(removeInvalidIndex, this._currentInvalidRecords.length - removeInvalidIndex);
        } else if (time > this._currentTime) {
            // If the new time is later than the earlier time, just add records to the data
            for (let i = this._currentValidRecords.length; i < this._validRecords.length; i++) {
                if (this._validRecords[i]['End Time'].getTime() <= time) {
                    this._currentValidRecords.push(this._validRecords[i]);
                } else {
                    break;
                }
            }
            for (let i = this._currentInvalidRecords.length; i < this._invalidRecords.length; i++) {
                if (this._invalidRecords[i]['End Time'].getTime() <= time) {
                    this._currentInvalidRecords.push(this._invalidRecords[i]);
                } else {
                    break;
                }
            }
        }

        this._currentTime = time;

        for (let callback of this._listeners) {
            callback(this.getValidRecords());
        }
    }
    
    advanceHour(hours = 1) {
        this.setTime(this._currentTime + (3600 * 1000 * hours));
    }
    
    rewindHour(hours = 1) {
        this.setTime(this._currentTime - (3600 * 1000 * hours));
    }

    advanceDay() {
        this.setTime(this._currentTime + (86400 * 1000));
    }

    rewindDay() {
        this.setTime(this._currentTime - (86400 * 1000));
    }

    advanceWeek() {
        this.setTime(this._currentTime + (604800 * 1000));
    }

    rewindWeek() {
        this.setTime(this._currentTime - (604800 * 1000));
    }

    getValidRecords() {
        return this._currentValidRecords;
    }

    getInvalidRecords() {
        return this._currentInvalidRecords;
    }

    addListener(callback) {
        this._listeners.push(callback);
    }
}
