import * as data from "../../data/cities.json";
import * as rp from "request-promise";
import * as moment from "moment";
import { sprintf } from "sprintf-js";
import * as DateUtils from "../../utils/DateUtils";
import chalk from "chalk";
import { createOptions } from "../../utils/WizzAirUtils";
import { Cities, Flight, WizzResponse, Connection } from "../../interfaces";

const citiesData = (<any>data) as Cities;

export class WizzCheck {
  private static DATE_FROM: Date = new Date("2018-03-26");
  private static DATE_TO: Date = new Date("2018-05-06");
  private static TARGET_DATE: Date = new Date("2018-04-30");
  private static DAYS_RANGE: number = 1;
  private static DEPARTURE_STATION = "IEV";

  private citiesMapping = citiesData.cities.reduce((accumulator, city) => {
    accumulator[city.iata] = city;
    return accumulator;
  }, {});

  private departureCity = citiesData.cities.find(
    city => city.iata === WizzCheck.DEPARTURE_STATION
  );

  async check() {
    await this.departureCity.connections
      .reduce((promise, connection) => {
        return promise
          .then(result => this.sendRequest(connection, result))
          .catch(e => console.log("error: " + connection.iata));
      }, Promise.resolve(<Flight[]>[]))
      .then((result: Flight[]) => {
        result
          .filter(e => e.price && e.priceType !== "soldOut")
          .sort(
            (a, b) =>
              a.price.amount != b.price.amount
                ? a.price.amount - b.price.amount
                : new Date(a.departureDate).getTime() -
                  new Date(b.departureDate).getTime()
          )
          .forEach(data => this.print(data));
      })
      .catch(e => console.log(e));
  }

  async sendRequest(connection: Connection, flights: Flight[]) {
    let options = createOptions(
      WizzCheck.DEPARTURE_STATION,
      connection.iata,
      DateUtils.toWizzTime(WizzCheck.DATE_FROM),
      DateUtils.toWizzTime(WizzCheck.DATE_TO)
    );
    return await rp(options)
      .then(data => [...flights, ...this.handleResponse(data)])
      .catch(err => console.log(err));
  }

  private handleResponse(data: WizzResponse): Flight[] {
    if (!data || !data.returnFlights) {
      return [];
    }

    const result = [];
    for (let flightData of data.returnFlights) {
      const daysDiff = moment(flightData.departureDate).diff(
        WizzCheck.TARGET_DATE,
        "days"
      );
      if (Math.abs(daysDiff) <= WizzCheck.DAYS_RANGE) {
        result.push(flightData);
      }
    }
    return result;
  }

  private print(data: Flight) {
    console.log(
      sprintf(
        "%-16s %3s-%3s%-18s %s",
        chalk.red(String(data.price.amount)),
        data.departureStation,
        chalk.blue(data.arrivalStation),
        "[" + this.citiesMapping[data.arrivalStation].shortName + "]",
        data.departureDate.substring(0, data.departureDate.indexOf("T"))
      )
    );
  }
}
