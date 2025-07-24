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
          fetchWeatherByCity('Tehran');
        }
      );
    } else {
      showError('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.');
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
  }
}

function displayWeather(data) {
  const weatherOutput = document.getElementById('weather-output');
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('fa-IR');
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('fa-IR');

  weatherOutput.innerHTML = `
    <div class="weather-card hidden">
      <div class="weather-header">
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
      </div>
      <div class="weather-details">
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

