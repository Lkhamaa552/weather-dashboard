import { useState } from 'react';

// Search form: city name, plus a button for the user's own location (bonus)
function CitySearch({ onSearch, onUseMyLocation, disabled }) {
  const [city, setCity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <label htmlFor="city" className="visually-hidden">City name</label>
      <input
        id="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Type a city, e.g. Ulaanbaatar"
      />
      <button type="submit" disabled={disabled}>Search</button>
      <button type="button" className="light" onClick={onUseMyLocation} disabled={disabled}>
        📍 My location
      </button>
    </form>
  );
}

export default CitySearch;