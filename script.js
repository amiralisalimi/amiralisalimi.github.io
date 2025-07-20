document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('get-weather-btn');
    const output = document.getElementById('weather-output');

    btn.addEventListener('click', function () {
        output.textContent = 'در حال گرفتن اطلاعات آب و هوا...';
    });
});
