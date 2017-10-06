import { cities } from "../check/wizz/data"

    const citiesMapping = cities.reduce((accumulator, city) => {
        accumulator[city.iata] = city;
        return accumulator;
    }, new Object());
console.log(JSON.stringify(citiesMapping))