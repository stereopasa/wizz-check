import { sprintf } from 'sprintf-js';
import chalk from 'chalk';

console.log(sprintf("%s", "aaaa"));

// IEV-CGN[Cologne]: 2887.2 (2018-03-27T00:00:00)

// result.forEach(data => {
//     console.log(data.departureStation + "-" + data.arrivalStation
//       + "[" + citiesMapping[data.arrivalStation].shortName + "]"
//       + ": " + data.price.amount
//       + " (" + data.departureDate + ")");
//   })

const data = {
    price: {
        amount: 2887.2
    },
    arrivalStation: "CGN",
    departureStation: "IEV",
    departureDate: "2018-03-27T00:00:00"
}

const citiesMapping = {
    "CGN": {
        shortName: "shortName"
    }
}
console.log(sprintf(
    "%-14s %3s-%3s%-18s %s",
    // chalk.red(String(data.price.amount)),
    chalk.red('123'),
    chalk.blue(data.departureStation),
    data.arrivalStation,
    "[" + citiesMapping[data.arrivalStation].shortName + "]",
    data.departureDate.substring(0, data.departureDate.indexOf('T'))
));