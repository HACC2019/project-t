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

  /*
  General function to calculate 1, 3, 6, or 12 months ago to parse data younger than that age
  args time is the number of months back the user would like to see
  returns the current time, minus time
   */

//  calcTime(time) {
//    let current_time = new Date(this.getTime());
//    return current_time.setMonth(current_time.getMonth() - time);
//  }
  
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
   * Gets all the records to be analyzed, either from the simulation, if used, or by loading the file directly.
   * 
   * @returns {Array} An array of records
   */
  getRecords() {
    if (this.simulation) {
      return this.simulation.getRecords();
    } else {
      return RECORDS;
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
    return this.getRecords().filter((station) => {
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

  /*
  Function finds the average time between charges
  station - the station whose data the user would like to view
  time - how far back to look through data (1 month, 6 months, 12 months
  returns the avgerage turnaround time



  to fix: would like function to just look at specific tariff times
   */

//  findAvgTurn(station, time) {
//    const raw_data = RECORDS;
//    let arr_start = [];
//    let arr_fin = [];
//    let arr_turn = [];
//    let earliest = this.calcTime(time);
//    for (station in raw_data) {
//      if (station["End Time"] > earliest) {
//        arr_start.push(station["Start Time"]);
//        arr_fin.push(station["Finish Time"]);
//
//      }
//    }
//    arr_start = arr_start.sort((a, b) => b.date - a.date);
//    arr_fin = arr_fin.sort((a, b) => b.date - a.date);
//    for (let i = 0; i < arr_start.length; i++) {
//      arr_turn[i] = arr_fin[i] - arr_start[i];
//    }
//
//    console.log(arr_turn);
//    return arr_turn.reduce((accumulator, value) => {
//      return accumulator + value
//    }) / arr_turn.length;
//  }

  /**
   * Calculates the average time between charges of the station with the specified station ID. If months is specified, only returns results from within that number of months.
   * 
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months back to examine
   * @returns {number} The average turnaround time, in milliseconds
   */
  getAverageTurnaround(stationID, months) {
    const data = this.getRecordsFor(stationID, months);

    if (data.length === 0) {
      return -1;
    }

    let previousEndTime = data[0]['End Time'];
    const idleTimes = [];

    for (let i = 1; i < data.length; i++) {
      idleTimes.push((data[i]['Start Time'].getTime() - previousEndTime.getTime()));
      previousEndTime = data[i]['End Time'];
    }

    return idleTimes.reduce((accumulator, value) => {
      return accumulator + value
    }) / (idleTimes.length - 1);
  }

  /*
  function extracts the power for each charge from the JSON file
  args station is the station of interest
  args time is how far back the user would like to look in months
  returns an array of power values from charges at station
   */
//  findStationPower(station, time) {
//    const raw_data = RECORDS;
//    const power = []
//    let earliest = this.calcTime(time);
//    for (station in raw_data) {
//      if (station["End Time"] > earliest) {
//        power.push(x["Energy(kWh)"])
//
//      }
//    }
//    return power;
//  }
  
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

  /*
  function uses findStationPower to determine the average power generated per charge
   args station is the station of interest
  args time is how far back the user would like to look in months
  returns a floating point value representing the avg kWh per charge
   */
//  findAvgPower(station, time) {
//    const power = this.findStationPower(station, time);
//
//    return power.reduce() / power.length;
//  }
  
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
  
//  findChargeDurations(station, time) {
//    const raw_data = RECORDS;
//    let durations = [];
//
//    let earliest = this.calcTime(time);
//
//    for (station in raw_data) {
//      if (station["End Time"] > earliest) {
//        let hms = station["Duration"]; // your input string
//        let a = hms.split(':'); // split it at the colons
//
//        // minutes are worth 60 seconds. Hours are worth 60 minutes.
//        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
//
//        durations.push(seconds);
//
//
//      }
//
//    }
//    return durations;
//  }
  
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
      return (parseInt(hours, 10) * 60 * 60 * 1000) + (parseInt(minutes, 10) * 60 * 1000) + (parseInt(seconds, 10) * 1000);
    });
  }

  /*
   function calculates the average duration of charges at station of interest
    args station is the station of interest
   args time is how far back the user would like to look in months
   returns the avg duration of charges at SOI
   */
//  findAvgDuration(station, time) {
//    let durations = this.findChargeDurations(station, time);
//    return durations.reduce() / durations.length;
//
//
//  }

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

  /*
    function gets session amounts and pushes them onto array
   args station is the station of interest
   args time is how far back the user would like to look in months
    returns array of session amounts at SOI
   */
//  getSessAmount(station, time) {
//    const raw_data = RECORDS;
//    let amount = [];
//    let earliest = this.calcTime(time);
//
//    for (station in raw_data) {
//      if (station["End Time"] > earliest) {
//        let raw_amount = station["Charge Amount"];
//        raw_amount = raw_amount.slice(1);
//        amount.push(raw_amount);
//      }
//    }
//    return amount;
//  }

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
  
  /*
  Function returns the avg power output per second
  args station is the SOI
  args time is the integer number of months to look back

  returns an array
   */

//  getPowerPerTime(station, time) {
//    const power = this.findStationPower(station, time);
//    const duration = this.findChargeDurations(station, time);
//    const powOverDuration = [];
//    for (let i = 0; i < power.length; i++) {
//      powOverDuration[i] = power[i] / duration[i];
//    }
//    return powOverDuration;
//  }
  
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
}

export default RecordAnalytics;
