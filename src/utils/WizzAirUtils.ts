export const getRandUserAgent = () => {
  const agents = [
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6`,
    `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
  ];

  return agents[(Math.random() * agents.length) | 0];
};

export const createOptions = (
  departureStation: string,
  arrivalStation: string,
  from: string,
  to: string
) => {
    const apiVersion = process.env.WIZZ_API_VERSION || '7.9.2';

  const options = {
    method: "POST",
    uri: `https://be.wizzair.com/${apiVersion}/Api/search/timetable`,
    body: {
      flightList: [
        {
          departureStation: departureStation,
          arrivalStation: arrivalStation,
          from: from,
          to: to
        },
        {
          departureStation: arrivalStation,
          arrivalStation: departureStation,
          from: from,
          to: to
        }
      ],
      priceType: "wdc",
      adultCount: 1,
      childCount: 0,
      infantCount: 0
    },
    headers: {
      "accept-language": "en-US,en;q=0.8,ru;q=0.6",
      origin: "https://wizzair.com",
      referer:
        "https://wizzair.com/en-gb/flights/timetable/" +
        departureStation +
        "/" +
        arrivalStation,
      "user-agent": getRandUserAgent()
    },
    json: true
  };

  return options;
};
