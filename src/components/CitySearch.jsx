import { useState } from 'react';

// Two ways to choose a place:
// 1) city name  2) latitude + longitude. Plus a "My location" button (bonus).
function CitySearch({ onSearch, onCoords, onUseMyLocation, disabled }) {
  const [mode, setMode] = useState('city');   // 'city' or 'coords'
  const [city, setCity] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [formError, setFormError] = useState('');

  function handleCity(e) {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  }

  function handleCoords(e) {
    e.preventDefault();
    const latitude = Number(lat);
    const longitude = Number(lon);
    // Check the numbers before calling the API
    if (lat === '' || lon === '' || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setFormError('Please enter both latitude and longitude as numbers.');
      return;
    }
    if (latitude < -90 || latitude > 90) {
      setFormError('Latitude must be between -90 and 90.');
      return;
    }
    if (longitude < -180 || longitude > 180) {
      setFormError('Longitude must be between -180 and 180.');
      return;
    }
    setFormError('');
    onCoords(latitude, longitude);
  }

  return (
    <div className="search-box">
      <div className="tabs" role="group" aria-label="Search by">
        <button type="button" className={mode === 'city' ? 'tab active' : 'tab'} aria-pressed={mode === 'city'} onClick={() => setMode('city')}>
          City name
        </button>
        <button type="button" className={mode === 'coords' ? 'tab active' : 'tab'} aria-pressed={mode === 'coords'} onClick={() => setMode('coords')}>
          Latitude &amp; longitude
        </button>
      </div>

      {mode === 'city' ? (
        <form className="search" onSubmit={handleCity}>
          <label htmlFor="city" className="visually-hidden">City name</label>
          <input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Type a city, e.g. Ulaanbaatar"
          />
          <button type="submit" disabled={disabled}>Search</button>
        </form>
      ) : (
        <form className="search" onSubmit={handleCoords} noValidate>
          <label className="field">
            Latitude
            <input type="number" step="any" min="-90" max="90" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="47.92" />
          </label>
          <label className="field">
            Longitude
            <input type="number" step="any" min="-180" max="180" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="106.92" />
          </label>
          <button type="submit" disabled={disabled}>Show weather</button>
        </form>
      )}

      {formError && <p className="error" role="alert">{formError}</p>}

      <button type="button" className="light my-location" onClick={onUseMyLocation} disabled={disabled}>
        📍 Use my location
      </button>
    </div>
  );
}

export default CitySearch;
