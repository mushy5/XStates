import {useEffect, useState} from 'react';
import './App.css';

export default function App() {
  const [placeList, setPlaceList] = useState({
    countries: [],
    states: [],
    cities: [],
  });
  const [placeObj, setPlaceObj] = useState({
    country: "",
    state: "",
    city: "",
  });

  const handleChange = (event) => {
    setPlaceObj({ ...placeObj, [event.target.id]: event.target.value });
  };

  const getCountries = async () => {
    let response = await fetch(
      "https://crio-location-selector.onrender.com/countries"
    );
    let data = await response.json();
    //setPlaceList({ ...placeList, [countries]: data });
    setPlaceList({ ...placeList, countries: data });
  };
  const getStates = async () => {
    //console.log("selected country :", placeObj.country);
    let response = await fetch(
      `https://crio-location-selector.onrender.com/country=${placeObj.country}/states`
    );
    let data = await response.json();
    setPlaceList({ ...placeList, states: data });
  };
  const getCities = async () => {
    let response = await fetch(
      `https://crio-location-selector.onrender.com/country=${placeObj.country}/state=${placeObj.state}/cities`
    );
    let data = await response.json();
    setPlaceList({ ...placeList, cities: data });
  };
  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    setPlaceObj({ ...placeObj, state: "", city: "" });
    if (placeObj.country) getStates();
  }, [placeObj.country]);
  useEffect(() => {
    setPlaceObj({ ...placeObj, city: "" });
    if (placeObj.country && placeObj.state) getCities();
  }, [placeObj.state]);

  return (
    <div className="App">
      <h1>Select Location</h1>
      <div className="dropdowns">
        <select
          value={placeObj.country}
          id="country"
          onChange={handleChange}
          className="dropdown"
        >
          <option value="" disabled>
            Select Country
          </option>
          {placeList.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={placeObj.state}
          id="state"
          onChange={handleChange}
          className="dropdown"
          disabled={!placeObj.country}
        >
          <option value="" disabled>
            Select State
          </option>
          {placeList.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={placeObj.city}
          id="city"
          onChange={handleChange}
          className="dropdown"
          disabled={!placeObj.state}
        >
          <option value="" disabled>
            Select City
          </option>
          {placeList.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="result">
        {placeObj.city && (
          <h3>
            You selected <span className="highlighted">{placeObj.city}</span>,{' '}
            <span className="dim">{placeObj.country}</span>,{' '}
            <span className="dim">{placeObj.state}</span>
          </h3>
        )}
      </div>
    </div>
  );
}

