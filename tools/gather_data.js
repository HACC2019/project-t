const file = "json\station_records.json";

/*
General function to calculate 1, 3, 6, or 12 months ago to parse data younger than that age
args time is the number of months back the user would like to see
returns the current time, minus time
 */
function calcTime(time) {
  let current_time = Date.now();
  return current_time.setMonth(current_time.getMonth()- time);
}


/*
Function finds the average time between charges
station - the station whose data the user would like to view
time - how far back to look through data (1 month, 6 months, 12 months
returns the avgerage turnaround time



to fix: would like function to just look at specific tariff times
 */

function findAvgTurn(station, time) {
  const raw_data = JSON.parse(file);
  let arr_start = [];
  let arr_fin = [];
  let arr_turn = [];
  let earliest = calcTime(time);
  for( let x in raw_data) {
    if(x["End Time"] > earliest ) {
      if(x["Charge Station Name"] === station) {
        arr_start.push(x["Start Time"]);
        arr_fin.push(x["Finish Time"]);
      }
    }
  }
  arr_start = arr_start.sort((a, b) => b.date - a.date);
  arr_fin = arr_fin.sort((a, b) => b.date -a.date);
  for(i=0; i < arr_start.length; i++) {
    arr_turn[i] = arr_fin[i] - arr_start[i];
  }
  return arr_turn.reduce() / arr_turn.length;
}



/*
function extracts the power for each charge from the JSON file
args station is the station of interest
args time is how far back the user would like to look in months
returns an array of power values from charges at station
 */
function findStationPower(station, time) {
  const raw_data = JSON.parse(file);
  const power = []
  let earliest = calcTime(time);
  for(let x in raw_data) {
    if(x["End Time"] > earliest) {
      if(x["Charge Station Name"] === station) {
        power.push(x["Energy(kWh)"])
      }
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
function findAvgPower(station, time) {
  const power = findStationPower(station, time);

  return power.reduce() / power.length;
}

function findChargeDurations(station, time) {
  const raw_data = JSON.parse(file);
  let durations = [];

  let earliest = calcTime(time);

  for (let x in raw_data) {
    if (x["End Time"] > earliest) {
      if (x["Charge Station Name"] === station) {

        let hms = x["Duration"];   // your input string
        let a = hms.split(':'); // split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

        durations.push(seconds);
      }

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
function findAvgDuration(station, time) {
  let durations = findChargeDurations(station, time);
  return durations.reduce() /durations.length;


}

/*
  function gets session amounts and pushes them onto array
 args station is the station of interest
 args time is how far back the user would like to look in months
  returns array of session amounts at SOI
 */
function getSessAmount (station, time) {
  const raw_data = JSON.parse(file);
  let amount = [];
  let earliest = calcTime(time);

  for(let x in raw_data) {
    if(x["End Time"] > earliest) {
      if(x["Charge Station Name"] === station) {
        let raw_amount = x["Charge Amount"];
        raw_amount = raw_amount.slice(1);
        amount.push(raw_amount);
      }
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

function getPowerPerTime(station, time) {
  const power = findStationPower(station, time);
  const duration = findChargeDurations(station, time);
  const powOverDuration = [];
  for (let i = 0; i < power.length; i++) {
    powOverDuration[i] = power[i] / duration[i];
  }
  return powOverDuration;
}





