import { cities } from "./data";
import * as rp from "request-promise";
import { sprintf } from "sprintf-js";
import * as DateUtils from "../../utils/DateUtils";

export class WizzCheck {
  private static TARGET_DATE_FROM: Date = new Date(2017, 9, 9);
  private static TARGET_DATE_TO: Date = new Date(2017, 9, 14);
  private static DEPARTURE_STATION = "KTW";

  async check() {
    const citiesMapping = cities.reduce((accumulator, city) => Object.assign(
          accumulator,
          { [city.iata]: city }
        ), {});
    const departureCity = cities.find(city => city.iata === WizzCheck.DEPARTURE_STATION);

    await departureCity.connections
      .reduce((promise, connection) => {
        return promise
          .then(result => this.sendRequest(connection, result))
          .catch(e => console.log("error: " + connection.iata));
      }, Promise.resolve([]))
      .then((result: any[]) => {
        result = result.filter(e => e.price && e.priceType !== "soldOut");
        result.sort((a, b) => (a.price.amount != b.price.amount ? a.price.amount - b.price.amount : new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()));
        result.forEach(data => {
          let formatted = sprintf("%5d %s (%s) : %s -> %s (%s [%s])", data.price.amount, data.price.currencyCode, DateUtils.dateFromISO(data.departureDate), data.departureStation, data.arrivalStation, citiesMapping[data.arrivalStation].shortName, citiesMapping[data.arrivalStation].countryCode);
          console.log(formatted);
        });
      })
      .catch(e => console.log(e));
  }

  async sendRequest(connection: any, resultAccumulator) {
    let options = this.createOptions(
      WizzCheck.DEPARTURE_STATION,
      connection.iata,
      DateUtils.toWizzTime(WizzCheck.TARGET_DATE_FROM),
      DateUtils.toWizzTime(WizzCheck.TARGET_DATE_TO)
    );
    return await rp(options)
      .then(data => {
        let filtered = this.handleResponse(data);
        return resultAccumulator.concat(filtered);
      })
      .catch(err => console.log(err));
  }

  handleResponse(data: any) {
    let result = [];
    for (let flightData of data.outboundFlights) {
      let departureDate = new Date(flightData.departureDate);
      if (
        departureDate >= WizzCheck.TARGET_DATE_FROM &&
        departureDate <= WizzCheck.TARGET_DATE_TO
      ) {
        result.push(flightData);
      }
    }
    return result;
  }

  private createOptions(
    departureStation: string,
    arrivalStation: string,
    from: string,
    to: string
  ) {
    const options = {
      method: "POST",
      uri: "https://be.wizzair.com/7.3.2/Api/search/timetable",
      body: {
        flightList: [
          {
            departureStation: departureStation,
            arrivalStation: arrivalStation,
            from: from,
            to: to
          }
        ],
        priceType: "wdc"
      },
      headers: {
        "accept-language": "en-US,en;q=0.8,ru;q=0.6",
        origin: "https://wizzair.com",
        referer:
          "https://wizzair.com/en-gb/flights/timetable/" +
          departureStation +
          "/" +
          arrivalStation,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      },
      json: true
    };

    return options;
  }
}
