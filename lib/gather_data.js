import RECORDS from "../json/station_records.json";

class RecordAnalytics {
  /**
   * @param {TimeSimulation} [timeSimulation] The instance of TimeSimulation used by the app, if used.
   */
  constructor(timeSimulation) {
    this.simulation = timeSimulation;
  }
  
  /**
   * Gets the current time, either from the simulation, or by using real time.
   * @returns {number} Timestamp in milliseconds
   */
  getTime() {
    if (this.simulation) {
      return this.simulation.getTime();
    } else {
      return Date.now();
    }
  }
  
  getRecords() {
    if (this.simulation) {
      return this.simulation.getRecords();
    } else {
      return RECORDS;
    }
  }
  
  /**
   * Gets the timestamp of the current time minus the specified number of months.
   * @param {number} months The number of months
   * @returns Timestamp in milliseconds
   */
  getTimeFromMonthsAgo(months) {
    let current_time = new Date(this.getTime());
    return current_time.setMonth(current_time.getMonth() - months);
  }
  
  /**
   * Returns records pertaining to the given station. If months is specified, only returns records within that number of months. 
   * @param {number} stationID The station ID
   * @param {number} [months] The number of months to examine
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
  General function to calculate 1, 3, 6, or 12 months ago to parse data younger than that age
  args time is the number of months back the user would like to see
  returns the current time, minus time
   */

//  calcTime(time) {
//    let current_time = new Date(this.getTime());
//    return current_time.setMonth(current_time.getMonth() - time);
//  }


  /*
  Function finds the average time between charges
  station - the station whose data the user would like to view
  time - how far back to look through data (1 month, 6 months, 12 months
  returns the avgerage turnaround time



  to fix: would like function to just look at specific tariff times
   */

  findAvgTurn(station, time) {
    const raw_data = RECORDS;
    let arr_start = [];
    let arr_fin = [];
    let arr_turn = [];
    let earliest = this.calcTime(time);
    for (station in raw_data) {
      if (station["End Time"] > earliest) {
        arr_start.push(station["Start Time"]);
        arr_fin.push(station["Finish Time"]);

      }
    }
    arr_start = arr_start.sort((a, b) => b.date - a.date);
    arr_fin = arr_fin.sort((a, b) => b.date - a.date);
    for (let i = 0; i < arr_start.length; i++) {
      arr_turn[i] = arr_fin[i] - arr_start[i];
    }

    console.log(arr_turn);
    return arr_turn.reduce((accumulator, value) => {
      return accumulator + value
    }) / arr_turn.length;
  }
  
  getAverageTurnaround(stationID, months) {
    const data = this.getRecordsFor(stationID, months);
    
    if (data.length === 0) {
      return -1;
    }
    
    let previousEndTime = data[0]['End Time'];
    const idleTimes = [];
    
    for (let i = 1; i < data.length; i++) {
      idleTimes.push(data[i]['Start Time'].getTime() - previousEndTime.getTime());
    }
    
    return idleTimes.reduce((accumulator, value) => {
      return accumulator + value
    }) / (idleTimes.length - 1);
  }
  
  /*{
    "Charge Station Name": "A",
    "Session Initiated By": "MOBILE",
    "Start Time": "09-01-18 07:25:03",
    "End Time": "09-01-18 07:53:32",
    "Duration": "00:28:29",
    "Energy(kWh)": 8.84,
    "Session Amount": "$4.77",
    "Session Id": 3168811,
    "Port Type": "CHADEMO",
    "Payment Mode": "RFID",
    "id": 5
}*/



  /*
  function extracts the power for each charge from the JSON file
  args station is the station of interest
  args time is how far back the user would like to look in months
  returns an array of power values from charges at station
   */
  findStationPower(station, time) {
    const raw_data = RECORDS;
    const power = []
    let earliest = this.calcTime(time);
    for (station in raw_data) {
      if (station["End Time"] > earliest) {
        power.push(x["Energy(kWh)"])

      }
    }
    return power;
  }


  /*
  function uses findStationPower to determine the average power generated per charge
   args station is the station of interest
  args time is how far back the user would like to look in months
  returns a floating point value representing the avg kWh per charge
   */
  findAvgPower(station, time) {
    const power = this.findStationPower(station, time);

    return power.reduce() / power.length;
  }

  findChargeDurations(station, time) {
    const raw_data = RECORDS;
    let durations = [];

    let earliest = this.calcTime(time);

    for (station in raw_data) {
      if (station["End Time"] > earliest) {
        let hms = station["Duration"]; // your input string
        let a = hms.split(':'); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

        durations.push(seconds);


      }

    }
    return durations;
  }

  /*
   function calculates the average duration of charges at station of interest
    args station is the station of interest
   args time is how far back the user would like to look in months
   returns the avg duration of charges at SOI
   */
  findAvgDuration(station, time) {
    let durations = this.findChargeDurations(station, time);
    return durations.reduce() / durations.length;


  }

  /*
    function gets session amounts and pushes them onto array
   args station is the station of interest
   args time is how far back the user would like to look in months
    returns array of session amounts at SOI
   */
  getSessAmount(station, time) {
    const raw_data = RECORDS;
    let amount = [];
    let earliest = this.calcTime(time);

    for (station in raw_data) {
      if (station["End Time"] > earliest) {
        let raw_amount = station["Charge Amount"];
        raw_amount = raw_amount.slice(1);
        amount.push(raw_amount);
      }
    }
    return amount;
  }

  /*
  Function returns the avg power output per second
  args station is the SOI
  args time is the integer number of months to look back

  returns an array
   */

  getPowerPerTime(station, time) {
    const power = this.findStationPower(station, time);
    const duration = this.findChargeDurations(station, time);
    const powOverDuration = [];
    for (let i = 0; i < power.length; i++) {
      powOverDuration[i] = power[i] / duration[i];
    }
    return powOverDuration;
  }
}

export default RecordAnalytics;
