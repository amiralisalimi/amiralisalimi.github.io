const API_KEY = '20a3b8d81e54c79e021bc6436ea216cb';

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('get-weather-btn');
  const manualBtn = document.getElementById('manual-fetch');
  const output = document.getElementById('weather-output');
  const citySelect = document.getElementById('city-select');

  const cached = localStorage.getItem('lastWeather');
  if (cached) {
    displayWeather(JSON.parse(cached));
  }

  btn.addEventListener('click', function () {
    output.innerHTML = '<div class="loader"></div>';
    output.style.display = 'block';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByCoords(lat, lon);
        },
        function (error) {
          showError('دسترسی به موقعیت مکانی امکان‌پذیر نیست. استفاده از موقعیت پیش‌فرض تهران.');
          const tehranLat = 35.6892;
          const tehranLon = 51.3890;
          const fakeWeather = getFakeWeather();
          displayFakeWeather(fakeWeather, 'تهران', tehranLat, tehranLon);
        }
      );
    } else {
      showError('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.');
      const tehranLat = 35.6892;
      const tehranLon = 51.3890;
      const fakeWeather = getFakeWeather();
      displayFakeWeather(fakeWeather, 'تهران', tehranLat, tehranLon);
    }
  });

  manualBtn.addEventListener('click', function () {
    const selectedCity = citySelect.value;
    output.innerHTML = '<div class="loader"></div>';
    output.style.display = 'block';
    fetchWeatherByCity(selectedCity);
  });
});

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fa`
    );
    if (!response.ok) throw new Error('خطا در دریافت اطلاعات آب‌وهوا');
    const data = await response.json();
    localStorage.setItem('lastWeather', JSON.stringify(data));
    displayWeather(data);
  } catch (err) {
    showError(err.message);
    const fakeWeather = getFakeWeather();
    displayFakeWeather(fakeWeather, null, lat, lon);
  }
}

async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
    );
    if (!response.ok) throw new Error('خطا در دریافت اطلاعات شهر انتخاب‌شده');
    const data = await response.json();
    localStorage.setItem('lastWeather', JSON.stringify(data));
    displayWeather(data);
  } catch (err) {
    showError(err.message);
    const fakeWeather = getFakeWeather();
    displayFakeWeather(fakeWeather, city, 0, 0);
  }
}

function displayWeather(data) {
  const weatherOutput = document.getElementById('weather-output');
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString('fa-IR');
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('fa-IR');
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('fa-IR');

  weatherOutput.innerHTML = `
    <div class="weather-card hidden">
      <div class="weather-header">
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
      </div>
      <div class="weather-details">
        <p>تاریخ: ${formattedDate}</p>
        <p>ساعت: ${formattedTime}</p>
        <p>دما: <span>${Math.round(data.main.temp)}°C</span></p>
        <p>دمای محسوس: ${Math.round(data.main.feels_like)}°C</p>
        <p>وضعیت: ${data.weather[0].description}</p>
        <p>رطوبت: ${data.main.humidity}%</p>
        <p>سرعت باد: ${data.wind.speed} متر/ثانیه</p>
        <p>طلوع آفتاب: ${sunrise}</p>
        <p>غروب آفتاب: ${sunset}</p>
      </div>
    </div>
  `;

  setTimeout(() => {
    const card = document.querySelector('.weather-card');
    if (card) card.classList.remove('hidden');
  }, 50);

  updateBackground(data.weather[0].id);
}

function displayFakeWeather(fakeWeather, cityName, lat, lon) {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString('fa-IR');

  const weatherOutput = document.getElementById('weather-output');
  const locationText = cityName 
    ? cityName 
    : `موقعیت تقریبی: (${lat.toFixed(2)}, ${lon.toFixed(2)})`;

  weatherOutput.innerHTML = `
    <div class="weather-card fallback-bg hidden">
      <div class="weather-header">
        <h2>${locationText}</h2>
        <span>پیش‌بینی ساختگی</span>
      </div>
      <div class="weather-details">
        <p>تاریخ: ${formattedDate}</p>
        <p>ساعت: ${formattedTime}</p>
        <p>دما: ${fakeWeather.temp}°C</p>
        <p>وضعیت: ${fakeWeather.sky}</p>
        <p>رطوبت: ${fakeWeather.humidity}%</p>
      </div>
    </div>
  `;

  setTimeout(() => {
    const card = document.querySelector('.weather-card');
    if (card) card.classList.remove('hidden');
  }, 50);
}

function getFakeWeather() {
  const temps = [22, 25, 28, 31, 35];
  const skies = ['آفتابی', 'ابری', 'نیمه‌ابری', 'بارانی', 'طوفانی'];
  const humidities = [30, 40, 50, 60, 70];

  return {
    temp: temps[Math.floor(Math.random() * temps.length)],
    sky: skies[Math.floor(Math.random() * skies.length)],
    humidity: humidities[Math.floor(Math.random() * humidities.length)],
  };
}

function showError(message) {
  const output = document.getElementById('weather-output');
  output.innerHTML = `<div class="error-card hidden">${message}</div>`;
  setTimeout(() => {
    const errCard = document.querySelector('.error-card');
    if (errCard) errCard.classList.remove('hidden');
  }, 50);
}

function updateBackground(weatherId) {
  const body = document.body;
  if (weatherId >= 200 && weatherId < 300) {
    body.style.background = 'linear-gradient(to right, #3e5151, #decba4)';
  } else if (weatherId >= 300 && weatherId < 600) {
    body.style.background = 'linear-gradient(to right, #bdc3c7, #2c3e50)';
  } else if (weatherId >= 600 && weatherId < 700) {
    body.style.background = 'linear-gradient(to right, #83a4d4, #b6fbff)';
  } else if (weatherId === 800) {
    body.style.background = 'linear-gradient(to right, #56ccf2, #2f80ed)';
  } else if (weatherId > 800) {
    body.style.background = 'linear-gradient(to right, #757f9a, #d7dde8)';
  } else {
    body.style.background = '#f0f0f0';
  }
}