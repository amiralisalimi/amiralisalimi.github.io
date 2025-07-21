const API_KEY = '20a3b8d81e54c79e021bc6436ea216cb';

document.getElementById('get-weather-btn').addEventListener('click', () => {
    const weatherOutput = document.getElementById('weather-output');

    weatherOutput.innerHTML = `
        <div class="d-flex justify-content-center mt-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">در حال بارگذاری...</span>
            </div>
        </div>`;
    weatherOutput.style.display = 'block';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
            error => {
                showError('دسترسی به موقعیت شما فعال نشد. لطفاً دسترسی موقعیت مکانی را مجاز کنید.');
                const { latitude, longitude } = { latitude: 35.6892, longitude: 51.3890 };
                const fakeWeather = getFakeWeather(latitude, longitude);
                displayFakeWeather(fakeWeather, latitude, longitude);
            }
        );
    } else {
        showError('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.');
        const { latitude, longitude } = { latitude: 35.6892, longitude: 51.3890 }; // تهران فرضی
        const fakeWeather = getFakeWeather(latitude, longitude);
        displayFakeWeather(fakeWeather, latitude, longitude);
    }
});

async function fetchWeather(lat, lon) {
    const weatherOutput = document.getElementById('weather-output');

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fa`
        );

        if (!response.ok) throw new Error('خطا در دریافت اطلاعات آب و هوا');

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
        const fakeWeather = getFakeWeather(lat, lon);
        displayFakeWeather(fakeWeather, lat, lon);
    }
}

function displayWeather(data) {
    const weatherOutput = document.getElementById('weather-output');

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('fa-IR');

    const weatherMain = data.weather[0].main.toLowerCase();
    let bgClass = '';

    switch (weatherMain) {
        case 'rain':
            bgClass = 'rainy-bg';
            break;
        case 'clear':
            bgClass = 'sunny-bg';
            break;
        case 'clouds':
            bgClass = 'cloudy-bg';
            break;
        default:
            bgClass = '';
    }

    weatherOutput.innerHTML = `
        <div class="weather-card ${bgClass} hidden">
            <div class="weather-header">
                <h2>${data.name}</h2>
                <img src="${iconUrl}" alt="${data.weather[0].description}">
            </div>
            <div class="weather-details">
                <p>تاریخ: ${formattedDate}</p>
                <p>ساعت: ${formattedTime}</p>
                <p>دما: ${Math.round(data.main.temp)}°C</p>
                <p>وضعیت: ${data.weather[0].description}</p>
                <p>رطوبت: ${data.main.humidity}%</p>
                <p>سرعت باد: ${data.wind.speed} متر/ثانیه</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        const weatherCard = document.querySelector('.weather-card');
        weatherCard.classList.remove('hidden');
    }, 50);
}

function displayFakeWeather(fakeWeather, lat, lon) {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('fa-IR');

    const weatherOutput = document.getElementById('weather-output');
    weatherOutput.innerHTML = `
        <div class="weather-card fallback-bg hidden">
            <div class="weather-header">
                <h2>موقعیت تقریبی: (${lat.toFixed(2)}, ${lon.toFixed(2)})</h2>
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
        card.classList.remove('hidden');
    }, 50);
}

function getFakeWeather(lat, lon) {
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
    const weatherOutput = document.getElementById('weather-output');
    weatherOutput.innerHTML = `<div class="error-card hidden">${message}</div>`;

    setTimeout(() => {
        const errorCard = document.querySelector('.error-card');
        errorCard.classList.remove('hidden');
    }, 50);
}
