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
    try{
      let response = await fetch(
        "https://crio-location-selector.onrender.com/countries"
      );
      let data = await response.json();
      //setPlaceList({ ...placeList, [countries]: data });
      setPlaceList({ ...placeList, countries: data });
    }catch(err){
      console.error("Error fetching countries:", err);
    }
   
  };
  const getStates = async () => {
    try{
      let response = await fetch(
        `https://crio-location-selector.onrender.com/country=${placeObj.country}/states`
      );
      let data = await response.json();
      setPlaceList(prevState => ({ ...prevState, states: data }));
    }catch(err){
      console.error("Error fetching countries:", err);

    }
  };
  const getCities = async () => {
    try{
      let response = await fetch(
        `https://crio-location-selector.onrender.com/country=${placeObj.country}/state=${placeObj.state}/cities`
      );
      let data = await response.json();
      setPlaceList(prevState => ({ ...prevState, cities: data }));
    }catch(err){
      console.error("Error fetching countries:", err);
    }
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
          <div>
            You selected <span className="highlighted">{placeObj.city}</span>,{' '}
            <span className="dim">{placeObj.state}</span>,{' '}
            <span className="dim">{placeObj.country}</span>
          </div>
        )}
      </div>
    </div>
  );
}

