import RECORDS from "../json/station_records.json";

class RecordAnalytics {
  /**
   * @param {TimeSimulation} [timeSimulation] The instance of TimeSimulation used by the app, if used.
   */
  constructor(timeSimulation) {
    this.simulation = timeSimulation;
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
      records = RECORDS;
    }

    if (stationID !== undefined) {
      records = records.filter((station) => {
        if (station.id == stationID) {
          if (months === undefined) {
            return true;
          } else {
            if (new Date(station["End Time"]).getTime() >= this.getTimeFromMonthsAgo(months)) {
              return true;
            }
          }
        }

        return false;
      });
    }

    return records;
  }

  /**
   * Gets all the valid records to be analyzed, either from the simulation, if used, or by loading the file directly.
   *
   * @returns {Array} An array of records
   */
  getInvalidRecords(stationID, time) {
    if(stationID === undefined) {
      if (this.simulation) {
        return this.simulation.getInvalidRecords();
      } else {
        return RECORDS.filter((record) => {
          // Filter only "invalid" records
          return record['Energy(kWh)'] === 0;
        });
      }
    }
    else {
      data = getRecordsFor(stationID, time)
      if (this.simulation) {
        return this.simulation.getInvalidRecords();
      } else {
        return data.filter((record) => {
          // Filter only "invalid" records
          return record['Energy(kWh)'] === 0;
        });
      }
    }

    }
  

  /**
   * Returns records pertaining to the given station. If months is specified, only returns records within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @return {Array} An array of records
   */
  getRecordsFor(stationID, months) {
    return this.getRecords(stationID, months);
  }

  /**
   * Calculates the average time between charges of the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average turnaround time, in seconds
   */
  getAverageTurnaround(stationID, months) {
    const data = this.getRecordsFor(stationID, months);

    if (data.length === 0) {
      return -1;
    }

    let previousEndTime = data[0]['End Time'];
    const idleTimes = [];

    for (let i = 1; i < data.length; i++) {
      idleTimes.push((data[i]['Start Time'].getTime() - previousEndTime.getTime()) / 60000);
      previousEndTime = data[i]['End Time'];
    }

    return Math.ceil(idleTimes.reduce((accumulator, value) => {
      return accumulator + value
    }) / (idleTimes.length - 1));
  }

  /**
   * Gets the power usage of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of power values, in kWh, from charge sessions at the station
   */
  getSessionPowerUsages(stationID, months) {
    const data = this.getRecordsFor(stationID, months);

    return data.map((record) => {
      return record['Energy(kWh)'];
    });
  }

  /**
   * Calculates the average power usage of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average kWh used per session
   */
  getAveragePowerUsage(stationID, months) {
    const power = this.getSessionPowerUsages(stationID, months);

    return power.reduce((accumulator, value) => {
      return accumulator + value
    }) / power.length;
  }

  /**
   * Gets the durations of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of durations, in milliseconds, from charge sessions at the station
   */
  getSessionDurations(stationID, months) {
    const data = this.getRecordsFor(stationID, months);

    return data.map((record) => {
      const [hours, minutes, seconds] = record['Duration'].split(':');
      return (parseInt(hours, 10) * 60 * 60) + (parseInt(minutes, 10) * 60) + parseInt(seconds, 10);
    });
  }

  /**
   * Calculates the average duration of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average duration of each session, in milliseconds
   */
  getAverageDuration(stationID, months) {
    const durations = this.getSessionDurations(stationID, months);

    return durations.reduce((accumulator, value) => {
      return accumulator + value
    }) / durations.length;
  }

  /**
   * Gets the prices of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number[]} An array of prices, in dollars, from charge sessions at the station
   */
  getSessionPrices(stationID, months) {
    const data = this.getRecordsFor(stationID, months);

    return data.map((record) => {
      return parseFloat(record['Session Amount'].match(/\$(\d+\.\d+)/)[1]);
    });
  }

  /**
   * Calculates the average price of charge sessions at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average price of each session, in dollars
   */
  getAveragePrice(stationID, months) {
    const prices = this.getSessionPrices(stationID, months);

    return prices.reduce((accumulator, value) => {
      return accumulator + value
    }) / prices.length;
  }

  /**
   * Gets the power per second average of each charge session at the station with the specified station ID. If months is specified, only returns results from within that number of months.
   *
   * @param {number} stationID The station ID
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
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average power per second of each session
   */
  getAveragePowerPerSecond(stationID, months) {
    const powerPerSeconds = this.getSessionPowerPerSeconds(stationID, months);

    return powerPerSeconds.reduce((accumulator, value) => {
      return accumulator + value
    }) / powerPerSeconds.length;
  }


  /**
   * @param data  The array of objects to be filtered
   * @param port The port type, CHADEMO or DCCOMBOTYP1
   * @return Array of objects with the given port type
   */

  getByDataByPortType(data, port) {
    if (port !== "CHADEMO" && port !== "DCCOMBOTYP1") {
      return -1;
    } else {
      return _.where(data, { "Port Type": port });
    }
  }

  /**
   * @param data  The array of objects to be filtered
   * @param payMeth The payment method, CREDITCARD or RFID
   * @return Array of objects with the given payment method
   */

  getByDataByPayType(data, payMeth) {
    if (payMeth !== "CREDITCARD" && payMeth !== "RFID") {
      return -1;
    } else {
      return _.where(data, { "Payment Mode": payMeth });
    }
  }

  /**
   * @param data The array of objects to be filtered
   * @param sessionStart The method of session initiation, MOBILE or DEVICE
   * @return Array of objects with the given session start method
   */

  getByDataBySessionStart(data, sessionStart) {
    if (sessionStart !== "MOBILE" && sessionStart !== "DEVICE" && sessionStart !== "WEB") {
      return -1;
    } else {
      return _.where(data, { "Session Initiated By": sessionStart });
    }
  }

}



export default RecordAnalytics;
