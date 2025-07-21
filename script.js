document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('get-weather-btn');
    const output = document.getElementById('weather-output');

    btn.addEventListener('click', function () {
        output.textContent = 'در حال دریافت موقعیت مکانی...';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    const fakeWeather = getFakeWeather(lat, lon);

                    output.innerHTML = `
                        <strong>موقعیت مکانی:</strong><br>
                        عرض جغرافیایی: ${lat.toFixed(4)}<br>
                        طول جغرافیایی: ${lon.toFixed(4)}<br><br>
                        <strong>پیش‌بینی آب‌وهوا:</strong><br>
                        دما: ${fakeWeather.temp}°C<br>
                        وضعیت آسمان: ${fakeWeather.sky}<br>
                        رطوبت: ${fakeWeather.humidity}%
                    `;
                },
                function (error) {
                    output.textContent = 'دریافت موقعیت مکانی با خطا مواجه شد.';
                }
            );
        } else {
            output.textContent = 'مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.';
        }
    });

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
});
