import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaSearch,
  FaWind,
  FaTint
} from "react-icons/fa";

export default function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "cf3a5d7de40e39842db481729c9a9f28";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, fail);
    }
  }, []);

  const success = async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setData(res.data);
      setError("");
    } catch {
      setError("Unable to detect location weather");
    }
    setLoading(false);
  };

  const fail = () => setError("Location permission denied");

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setData(res.data);
      setError("");
    } catch {
      setError("City not found");
      setData(null);
    }
    setLoading(false);
  };

  const getWeatherIcon = (main) => {
    if (main.includes("cloud")) return <FaCloud className="text-blue-400 animate-pulse" />;
    if (main.includes("rain")) return <FaCloudRain className="text-indigo-400 animate-bounce" />;
    if (main.includes("clear")) return <FaSun className="text-yellow-400 animate-spin-slow" />;
    if (main.includes("snow")) return <FaSnowflake className="text-cyan-300 animate-ping" />;
    return <FaSun className="text-yellow-300" />;
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-black flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-gradient-to-tl from-white/10 to-white/20 backdrop-blur-xl rounded-3xl shadow-xl p-8 flex flex-col items-center space-y-6 animate-fadeIn">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide animate-pulse">
           Weather App
        </h1>


        <div className="w-full flex gap-3">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:text-yellow-300 transition-colors duration-300"
              onClick={getWeather}
            />
            <input
              type="text"
              placeholder="Enter city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl bg-white/20 placeholder-white text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          <button
            onClick={getWeather}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:scale-105 transform transition duration-300"
          >
            Go
          </button>
        </div>

       
        {error && (
          <p className="text-red-500 font-bold animate-bounce">{error}</p>
        )}

       
        {loading && (
          <p className="text-white font-bold animate-ping">Loading...</p>
        )}

       
        {data && !loading && (
          <div className="flex flex-col items-center space-y-4 w-full text-white">
            <h2 className="text-2xl font-bold">{data.name}</h2>
            <div className="text-6xl">{getWeatherIcon(data.weather[0].main.toLowerCase())}</div>
            <p className="text-4xl font-extrabold">{Math.round(data.main.temp)}°C</p>
            <div className="flex flex-col gap-2 text-lg md:text-xl w-full">
              <p className="flex justify-between px-4 py-1 bg-white/10 rounded-xl hover:bg-white/20 transition duration-300">
                <span>{data.weather[0].description}</span>
              </p>
              <p className="flex justify-between px-4 py-1 bg-white/10 rounded-xl hover:bg-white/20 transition duration-300">
                <span>Humidity</span> <FaTint /> {data.main.humidity}%
              </p>
              <p className="flex justify-between px-4 py-1 bg-white/10 rounded-xl hover:bg-white/20 transition duration-300">
                <span>Wind</span> <FaWind /> {data.wind.speed} km/h
              </p>
            </div>
          </div>
        )}

       
        <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-purple-400/30 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-400/30 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}
