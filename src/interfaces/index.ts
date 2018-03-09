export interface City {
  iata: string;
  longitude: number;
  currencyCode: string;
  latitude: number;
  shortName: string;
  countryName: string;
  countryCode: string;
  connections: Connection[];
}

export interface Connection {
  iata: string;
  operationStartDate: string;
  rescueEndDate: string;
  isDomestic: boolean;
}

export interface Cities {
  cities: City[];
}

export interface Flight {
  departureStation: string;
  arrivalStation: string;
  departureDate: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  priceType: string;
  departureDates: string;
  classOfService: string;
  hasMacFlight: boolean;
}

export interface WizzResponse {
  outboundFlights: Flight[];
  returnFlights: Flight[];
}
