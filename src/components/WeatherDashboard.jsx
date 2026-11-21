import { useEffect, useState } from 'react';
import CitySearch from './CitySearch';
import WeatherCard from './WeatherCard';

// Start with Seoul, so the page shows something right away
const START = { name: 'Seoul, South Korea', latitude: 37.57, longitude: 126.98 };

function WeatherDashboard() {
  const [location, setLocation] = useState(START);  // { name, latitude, longitude }
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the weather every time the coordinates change
  useEffect(() => {
    const controller = new AbortController();  // lets us cancel an old request

    async function loadWeather() {
      setLoading(true);
      setError('');
      try {
        const url =
          'https://api.open-meteo.com/v1/forecast' +
          `?latitude=${location.latitude}&longitude=${location.longitude}` +
          '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code' +
          '&wind_speed_unit=kmh';
        const res = await fetch(url, { signal: controller.signal });
        if (res.status === 429) throw new Error('Too many requests. Please wait a minute and try again.');
        if (!res.ok) throw new Error(`Weather service error (${res.status}). Check the coordinates.`);
        const data = await res.json();
        setWeather(data.current);
      } catch (err) {
        if (err.name === 'AbortError') return;  // we cancelled it, not a real error
        setWeather(null);
        setError(err.message === 'Failed to fetch' ? 'Network error. Check your internet connection.' : err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();

    // Cleanup: cancel the request if the location changes before it finishes
    return () => controller.abort();
  }, [location.latitude, location.longitude]);

  // Show the city in the browser tab
  useEffect(() => {
    document.title = `Weather in ${location.name}`;
  }, [location.name]);

  // City name -> coordinates with the Open-Meteo geocoding endpoint
  async function searchCity(city) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`
      );
      if (!res.ok) throw new Error(`Search failed (${res.status}).`);
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" was not found. Check the spelling.`);
      }
      const r = data.results[0];
      // Same place as now: the effect will not run again, so stop loading here
      if (r.latitude === location.latitude && r.longitude === location.longitude) setLoading(false);
      setLocation({ name: `${r.name}, ${r.country}`, latitude: r.latitude, longitude: r.longitude });
    } catch (err) {
      setLoading(false);
      setError(err.message === 'Failed to fetch' ? 'Network error. Check your internet connection.' : err.message);
    }
  }

  // Bonus: use the browser's location
  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Your browser does not support location.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          name: 'My location',
          latitude: Number(pos.coords.latitude.toFixed(2)),
          longitude: Number(pos.coords.longitude.toFixed(2))
        });
      },
      () => {
        setLoading(false);
        setError('Location permission was denied.');
      }
    );
  }

  return (
    <div className="dashboard">
      <CitySearch onSearch={searchCity} onUseMyLocation={useMyLocation} disabled={loading} />

      {loading && <p className="status" role="status">Loading weather…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && weather && <WeatherCard place={location.name} weather={weather} />}

      <p className="coords">
        Lat {location.latitude}, Lon {location.longitude} · Data: Open-Meteo
      </p>
    </div>
  );
}

export default WeatherDashboard;