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
                    output.innerHTML = `عرض جغرافیایی: ${lat.toFixed(4)}<br>طول جغرافیایی: ${lon.toFixed(4)}`;
                },
                function (error) {
                    output.textContent = 'دریافت موقعیت مکانی با خطا مواجه شد.';
                }
            );
        } else {
            output.textContent = 'مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.';
        }
    });
});
