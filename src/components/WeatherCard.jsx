import { describeWeather } from '../weatherCodes';

// Shows the current weather that comes in as props
function WeatherCard({ place, weather }) {
  const [text, emoji] = describeWeather(weather.weather_code);

  return (
    <article className="weather-card">
      <h2>{place}</h2>
      <p className="emoji" aria-hidden="true">{emoji}</p>
      <p className="temp">{weather.temperature_2m.toFixed(1)} °C</p>
      <p className="desc">{text}</p>
      <ul className="details">
        <li>Feels like {weather.apparent_temperature.toFixed(1)} °C</li>
        <li>Wind {weather.wind_speed_10m.toFixed(1)} km/h</li>
        <li>Humidity {weather.relative_humidity_2m}%</li>
      </ul>
    </article>
  );
}

export default WeatherCard;