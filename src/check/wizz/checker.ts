import { cities } from "./data";
import * as rp from "request-promise";
import * as DateUtils from "../../utils/DateUtils";

export class WizzCheck {
  private static TARGET_DATE_FROM: Date = new Date(2017, 9, 9);
  private static TARGET_DATE_TO: Date = new Date(2018, 9, 13);
  private static DEPARTURE_STATION = "KTW";

  check() {
    let city = cities.find(element => element.iata === WizzCheck.DEPARTURE_STATION);

    let tempConnection = ["AGA", "AHO"];
    // city.connections.reduce((promise, connection) =>
    tempConnection.reduce((promise, connection: any) =>
      promise.then((result: any[]) => {
        let options = this.createOptions(
          WizzCheck.DEPARTURE_STATION,
          connection.iata,
          DateUtils.toWizzTime(WizzCheck.TARGET_DATE_FROM),
          DateUtils.toWizzTime(WizzCheck.TARGET_DATE_TO)
        );
        return rp(options)
          .then(data => {
            let filtered = this.handleResponse(data);
            return result.concat(filtered);
          })
      }),
      Promise.resolve([]))
      .then((result: any[]) => {
        result.sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));
        result.forEach(data => {
          console.log(data.departureStation + "-" + data.arrivalStation + ": " + data.price.amount);
        })
      });
  }

  async sendRequest(options: any) {
    await rp(options)
      .then(data => {
        let res = this.handleResponse(data);
      })
      .catch(err => console.log(err));
  }

  handleResponse(data: any) {
    let result = [];
    for (let flightData of data.outboundFlights) {
      let departureDate = new Date(flightData.departureDate);
      if (departureDate >= WizzCheck.TARGET_DATE_FROM && departureDate <= WizzCheck.TARGET_DATE_TO) {
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
        "origin": "https://wizzair.com",
        "referer": "https://wizzair.com/en-gb/flights/timetable/" + departureStation + "/" + arrivalStation,
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
      },
      json: true
    };

    return options;
  }
}
