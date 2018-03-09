import { Cities } from "../interfaces";
import * as moment from "moment";

const citiesData = require("../data/cities.json") as Cities;

// const data = dataJSON as Cities;

// const citiesObject = JSON.parse(cities);

// console.log(typeof data.cities);
// console.log(data.cities[0]);

console.log(citiesData.cities[0].iata);

const citiesMapping = citiesData.cities.reduce((accumulator, city) => {
  accumulator[city.iata] = city;
  return accumulator;
}, {});

// console.log(citiesMapping);

console.log(new Date(2018, 0, 1).toLocaleString());
console.log(new Date(Date.UTC(2018, 0, 1)).toISOString())
console.log(new Date('2018-03-26').toISOString())

console.log(moment().toArray())
console.log(moment('2018-03-26').diff(moment('2018-03-27'), 'days'))
console.log(moment('2018-03-26').diff(moment('2018-03-25'), 'days'))

// const citiesMapping = citiesObject.reduce((accumulator, city) => {
//   accumulator[city.iata] = city;
//   return accumulator;
// }, new Object());
// console.log(JSON.stringify(citiesObject));
// console.log("test");
