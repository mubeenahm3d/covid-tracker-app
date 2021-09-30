import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 220,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 220,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 220,
  },
};

// Sorting Countries by cases for table
export const sortData = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => a.cases < b.cases);
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0.0";

// Draw Circle on the map
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup className="info-popup">
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}{" "}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
