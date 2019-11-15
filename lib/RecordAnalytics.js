import RECORDS from "../json/station_records";
import STATIONS from "../json/chargestations";

const DAY = 1000 * 60 * 60 * 24;
const STATION_FAULT_THRESHOLD = 30;

class RecordAnalytics {
  /**
   * @param {TimeSimulation} [timeSimulation] The instance of TimeSimulation used by the app, if used.
   */
  constructor(timeSimulation) {
    this.simulation = timeSimulation;
    this._timeRange = {type: 'Hour', value: 24, aggregate: 1};
    this._listeners = new Map();
    this._stations = new Map();

    for (let station of STATIONS) {
      this._stations.set(station.ID, station);
    }
  }

  addListener(object, callback) {
    if (!this._listeners.has(object)) {
      this._listeners.set(object, []);
    }

    this._listeners.get(object).push(callback);
  }

  removeListener(object, callback) {
    if (callback === undefined || callback === null) {
      if (this._listeners.has(object)) {
        this._listeners.delete(object);
      } else {
        let listeners = this._listeners.get(object);

        for (let i = listeners.length - 1; i >= 0; i--) {
          listeners.splice(i, 1);
        }

        if (listeners.length > 0) {
          this._listeners.set(object, listeners);
        } else {
          this._listeners.delete(object);
        }
      }
    }
  }

  /**
   * Gets the current time, either from the simulation, if used, or by using real time.
   * 
   * @returns {number} Timestamp in milliseconds
   */
  getTime() {
    if (this.simulation) {
      return this.simulation.getTime();
    } else {
      return Date.now();
    }
  }

  /**
   * Sets the time range of the analytics functions
   * @param {string} type Either Month or Hour
   * @param {number} Number of time units
   */
  setTimeRange(type, value, aggregate) {
    this._timeRange = {type: type.substring(0, 1).toUpperCase() + type.substring(1).toLowerCase(), value, aggregate: Number(aggregate)};

    for (let [thisValue, listeners] of this._listeners) {
      for (let callback of listeners) {
        callback.apply(thisValue);
      }
    }
  }

  /**
   * Gets the timestamp of the current time minus the specified number of months.
   * 
   * @param {number} months The number of months
   * @returns {number} Timestamp in milliseconds
   */
  getTimeFromMonthsAgo(months) {
    let current_time = new Date(this.getTime());
    return current_time.setMonth(current_time.getMonth() - months);
  }

  /**
   * Gets the timestamp of the current time minus the specified number of months.
   * 
   * @param {number} months The number of months
   * @returns {number} Timestamp in milliseconds
   */
  getTimeFromHoursAgo(hours) {
    let current_time = new Date(this.getTime());
    return current_time.getTime() - (1000 * 60 * 60 * hours);
  }

  /**
   * Sets the time range of the analytics functions
   * @param {string} type Either Month or Hour
   * @param {number} Number of time units
   */
  getTimeRange() {
    return this[`getTimeFrom${this._timeRange.type}sAgo`](this._timeRange.value);
  }

  /**
   * Gets the week number (starting from January 4, 1970)
   * @param {Date} Date object
   * @returns {number} The week number
   */
  getWeekFromDate(date) {
    // Unix epoch happens on Thursday, so add three days
    let adjustedEpoch = new Date('01-04-1970 00:00:00').getTime();

    // And divide by seven days a week
    return Math.floor((date.getTime() - adjustedEpoch) / (DAY * 7));
  }

  /**
   * Gets the date of the beginning of the week specified (Sunday at midnight).
   * @param {number} The week number
   * @returns {Date} Date object
   */
  getDateFromWeek(week) {
    // Unix epoch happens on Thursday, so add three days
    let adjustedEpoch = new Date('01-04-1970 00:00:00').getTime();

    return new Date((week * (DAY * 7)) + adjustedEpoch);
  }

  getStationDetails(stationID) {
    return this._stations.get(stationID);
  }

  /**
   * Gets valid records to be analyzed, either from the simulation, if used, or by loading the file directly.
   * If specified, only returns records pertaining to the given station. If months is specified, only returns records within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Array} An array of records
   */
  getRecords(stationID, months) {
    let records;

    if (this.simulation) {
      records = this.simulation.getValidRecords();
    } else {
      records = RECORDS.filter((record) => {
        // Filter only "valid" records
        return record['Energy(kWh)'] > 0;
      });
    }

    records = records.filter((station) => {
      let include = true;

      if (stationID !== undefined && stationID !== null) {
        if (station.id != stationID) {
          include = false;
        }
      }

      if (months !== undefined && months !== null) {
        if (new Date(station['Start Time']).getTime() < this.getTimeFromMonthsAgo(months)) {
          include = false;
        }
      } else {
        if (new Date(station['Start Time']).getTime() < this.getTimeRange()) {
          include = false;
        }
      }

      return include;
    });

    return records;
  }

  /**
   * Gets invalid records to be analyzed, either from the simulation, if used, or by loading the file directly.
   * If specified, only returns records pertaining to the given station. If months is specified, only returns records within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Array} An array of records
   */
  getInvalidRecords(stationID, months) {
    let records;

    if (this.simulation) {
      records = this.simulation.getInvalidRecords();
    } else {
      records = RECORDS.filter((record) => {
        // Filter only "invalid" records
        return record['Energy(kWh)'] === 0;
      });
    }

    records = records.filter((station) => {
      let include = true;

      if (stationID !== undefined && stationID !== null) {
        if (station.id != stationID) {
          include = false;
        }
      }

      if (months !== undefined && months !== null) {
        if (new Date(station['Start Time']).getTime() < this.getTimeFromMonthsAgo(months)) {
          include = false;
        }
      } else {
        if (new Date(station['Start Time']).getTime() < this.getTimeRange()) {
          include = false;
        }
      }

      return include;
    });

    return records;
  }

  aggregateRecords(records) {
    let adjustedEpoch = new Date('01-01-1970 00:00:00');
    let hourlyTotals = [];
    let bucketSize = 3600 * 1000 * this._timeRange.aggregate;
    let firstBucket = Math.floor((this.getTimeRange() - adjustedEpoch.getTime()) / bucketSize);
    let lastBucket = Math.floor((this.getTime() - adjustedEpoch.getTime()) / bucketSize);

    for (let record of records) {
      let hourIndex = Math.floor((record['Start Time'] - adjustedEpoch) / bucketSize);

      if (hourlyTotals[hourIndex] === undefined) {
        hourlyTotals[hourIndex] = [];
      }

      hourlyTotals[hourIndex].push(record);
    }

    for (let hour = firstBucket; hour < lastBucket; hour++) {
      if (hourlyTotals[hour] !== undefined) {
        hourlyTotals[hour] = hourlyTotals[hour].length;
      } else {
        hourlyTotals[hour] = 0;
      }
    }

    return hourlyTotals;
  }

  /**
   * Calculates the average time between charges of the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average turnaround time, in seconds
   */
  getAverageTurnaround(stationID, months) {
    const data = this.getRecords(stationID, months);

    if (data.length < 2) {
      return -1;
    }

    const stationMap = new Map();
    const idleTimes = [];

    for (let record of data) {
      if (!stationMap.has(record.id)) {
        stationMap.set(record.id, []);
      }

      stationMap.get(record.id).push(record);
    }

    for (let [stationID, records] of stationMap) {
      let previousEndTime = data[0]['End Time'];

      for (let i = 1; i < data.length; i++) {
        idleTimes.push((data[i]['Start Time'].getTime() - previousEndTime.getTime()) / 1000);
        previousEndTime = data[i]['End Time'];
      }
    }

    return idleTimes.reduce((accumulator, value) => {
      return accumulator + value
    }, 0) / idleTimes.length;
  }

  /**
   * Gets the power usage of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of power values, in kWh, from charge sessions at the station
   */
  getSessionPowerUsages(stationID, months) {
    const data = this.getRecords(stationID, months);

    return data.map((record) => {
      return record['Energy(kWh)'];
    });
  }

  /**
   * Calculates the average power usage of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average kWh used per session
   */
  getAveragePowerUsage(stationID, months) {
    const power = this.getSessionPowerUsages(stationID, months);

    if (power.length === 0) {
      return 0;
    }

    return power.reduce((accumulator, value) => {
      return accumulator + value
    }, 0) / power.length;
  }

  getTotalPowerUsage(stationID, months) {
    const power = this.getSessionPowerUsages(stationID, months);

    if (power.length == 0) return 0;

    return power.reduce((accumulator, value) => {
      return accumulator + value
    });
  }

  /**
   * Gets the durations of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of durations, in seconds, from charge sessions at the station
   */
  getSessionDurations(stationID, months) {
    const data = this.getRecords(stationID, months);

    return data.map((record) => {
      const [hours, minutes, seconds] = record['Duration'].split(':');
      return (parseInt(hours, 10) * 60 * 60) + (parseInt(minutes, 10) * 60) + parseInt(seconds, 10);
    });
  }

  /**
   * Calculates the average duration of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average duration of each session, in seconds
   */
  getAverageDuration(stationID, months) {
    const durations = this.getSessionDurations(stationID, months);

    if (durations.length === 0) {
      return 0;
    }

    return durations.reduce((accumulator, value) => {
      return accumulator + value
    }, 0) / durations.length;
  }

  /**
   * Gets the prices of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of prices, in dollars, from charge sessions at the station
   */
  getSessionPrices(stationID, months) {
    const data = this.getRecords(stationID, months);

    return data.map((record) => {
      return parseFloat(record['Session Amount'].match(/\$(\d+\.\d+)/)[1]);
    });
  }

  /**
   * Calculates the average price of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average price of each session, in dollars
   */
  getAveragePrice(stationID, months) {
    const prices = this.getSessionPrices(stationID, months);

    if (prices.length === 0) {
      return 0;
    }

    return prices.reduce((accumulator, value) => {
      return accumulator + value
    }, 0) / prices.length;
  }

  /**
   * Gets the power per second average of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of ratios from charge sessions at the station
   */
  getSessionPowerPerSeconds(stationID, months) {
    const power = this.getSessionPowerUsages(stationID, months);
    const duration = this.getSessionDurations(stationID, months);
    const powerPerSecond = [];

    for (let i = 0; i < power.length; i++) {
      powerPerSecond[i] = power[i] / duration[i];
    }

    return powerPerSecond;
  }

  /**
   * Calculates the average power per second of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average power per second of each session
   */
  getAveragePowerPerSecond(stationID, months) {
    const powerPerSeconds = this.getSessionPowerPerSeconds(stationID, months);

    if (powerPerSeconds.length === 0) {
      return 0;
    }

    return powerPerSeconds.reduce((accumulator, value) => {
      return accumulator + value
    }, 0) / powerPerSeconds.length;
  }

  /**
   * @param {string} portType The station ID
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Array} Array of objects with the given port type
   */
  getDataByPortType(portType, stationID, months) {
    const validRecords = this.getRecords(stationID, months);
    const invalidRecords = this.getInvalidRecords(stationID, months);

    return {
      valid: validRecords.filter((record) => {
        return record['Port Type'] == portType;
      }),
      invalid: invalidRecords.filter((record) => {
        return record['Port Type'] == portType;
      })
    }
  }

  /**
   * @param {string} payMethod The payment method, CREDITCARD or RFID
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Array} Array of objects with the given payment method
   */
  getDataByPayType(payMethod, stationID, months) {
    const validRecords = this.getRecords(stationID, months);
    const invalidRecords = this.getInvalidRecords(stationID, months);

    return {
      valid: validRecords.filter((record) => {
        return record['Payment Mode'] == payMethod;
      }),
      invalid: invalidRecords.filter((record) => {
        return record['Payment Mode'] == payMethod;
      })
    }
  }

  /**
   * @param {string} sessionStart The method of session initiation, MOBILE or DEVICE
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Array} Array of objects with the given session start method
   */
  getDataBySessionStart(sessionStart, stationID, months) {
    const validRecords = this.getRecords(stationID, months);
    const invalidRecords = this.getInvalidRecords(stationID, months);

    return {
      valid: validRecords.filter((record) => {
        return record['Session Initiated By'] == sessionStart;
      }),
      invalid: invalidRecords.filter((record) => {
        return record['Session Initiated By'] == sessionStart;
      })
    }
  }

  /**
   * @param {number} [stationID] The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Map} The fault map
   */
  getFaults(stationID, months) {
    const records = this.getRecords(stationID, months);
    const currentWeek = this.getWeekFromDate(new Date(this.getTime()));

    function sum(accumulator, currentValue) {
      return accumulator + currentValue;
    }

    let stationMap = new Map();
    let faultMap = new Map();

    for (let record of records) {
      if (!stationMap.has(record['id'])) {
        stationMap.set(record['id'], []);
      }

      let weekRecords = stationMap.get(record['id']);
      let weekIndex = this.getWeekFromDate(record['Start Time']);

      // Ignore the current week
      if (weekIndex === currentWeek) {
        continue;
      }

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
      let a = weekCount * xyValues.reduce(sum, 0);
      let b = xValues.reduce(sum, 0) * yValues.reduce(sum, 0);
      let c = weekCount * xValues.reduce((accumulator, currentValue) => accumulator + currentValue ** 2, 0);
      let d = xValues.reduce(sum, 0) ** 2;
      let m = (a - b) / (c - d);
      let e = yValues.reduce(sum, 0);
      let f = m * xValues.reduce(sum, 0);
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

//          console.log(`POSSIBLE FAULT AT STATION ${stationID} IN WEEK ${week}. Expected ${stationWeeks.slopeIntercept(week)}, but only had ${weekRecords.length}`);
        }
      }
    }

    return faultMap;
  }
}

export default RecordAnalytics;
