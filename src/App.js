import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { useEffect, useReducer, useState } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import "leaflet/dist/leaflet.css";
import SearchBar from "./SearchBar";

const reducerFunction = (state, action) => {
  if (action.type === "onChange") {
    return {
      center: action.center,
      zoom: action.zoom,
      countries: state.countries,
    };
  }
  if (action.type === "countries") {
    return {
      center: state.center,
      zoom: state.zoom,
      countries: action.countries,
    };
  }
  return state;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const initailMapState = {
    center: { lat: 34, lng: -34 },
    zoom: 3,
    countries: [],
  };
  const [mapProps, dispatch] = useReducer(reducerFunction, initailMapState);

  useEffect(() => {
    const getWorldwideData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/all");
      const data = await response.json();
      setCountryInfo(data);
    };
    getWorldwideData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const responseData = await response.json();
      const recievedCountries = responseData.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso3,
      }));

      const sortedData = sortData(responseData);
      setTableData(sortedData);
      setCountries(recievedCountries);
      dispatch({ type: "countries", countries: responseData });
    };
    try {
      getCountriesData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const response = await fetch(url);
    const responseData = await response.json();
    setCountryInfo(responseData);

    dispatch({
      type: "onChange",
      center: {
        lat: responseData.countryInfo.lat,
        lng: responseData.countryInfo.long,
      },
      zoom: 4,
    });
  };

  const inputChangeHandler = (input) => {
    setCountry(input)
    const event = {target: {value: input}}
    onCountryChange(event)
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__headerTitle" >COVID-19 TRACKER</h1>
          <SearchBar countries={countries} onInputChange={inputChangeHandler} />
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem key="WW" value="worldwide">
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
          isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
          isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          countries={mapProps.countries}
          center={mapProps.center}
          zoom={mapProps.zoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
      <Typography color="textSecondary">Made with 💓 by Mubeen Ahmed</Typography>
    </div>
  );
}

export default App;
