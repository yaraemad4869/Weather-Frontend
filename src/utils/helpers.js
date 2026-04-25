export const formatTemperature = (temp) => {
  return `${Math.round(temp)}°C`;
};

export const formatWindSpeed = (speed) => {
  return `${Math.round(speed)} km/h`;
};

export const formatHumidity = (humidity) => {
  return `${Math.round(humidity)}%`;
};

export const formatPressure = (pressure) => {
  return `${Math.round(pressure)} hPa`;
};

export const getWeatherIcon = (condition) => {
  const icons = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'thunderstorm': '⛈️',
    'mist': '🌫️',
    default: '🌡️'
  };
  return icons[condition?.toLowerCase()] || icons.default;
};

export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const calculateAverage = (numbers) => {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};