// Script to handle AQI logic
    const aqi = 35; // Current AQI value
    const levelEl = document.getElementById('level');
    const indexEl = document.getElementById('index');
    const messageEl = document.getElementById('air-quality-msg');
    const progressBar = document.getElementById('aqi-progress');

    let emoji = '';
    let bg = '';
    let text = '';
    let levelText = '';
    let message = '';
    let progressColor = '';

    if (aqi <= 50) {
      emoji = '🟢';
      bg = 'bg-green-100';
      text = 'text-green-700';
      levelText = 'Good';
      message = 'Air quality is good. It’s a great day to be outside and breathe easy!';
      progressColor = 'bg-green-500';
    } else if (aqi <= 100) {
      emoji = '🟡';
      bg = 'bg-yellow-100';
      text = 'text-yellow-700';
      levelText = 'Moderate';
      message = 'Air quality is acceptable. Sensitive groups take care.';
      progressColor = 'bg-yellow-500';
    } else if (aqi <= 150) {
      emoji = '🟠';
      bg = 'bg-orange-100';
      text = 'text-orange-700';
      levelText = 'Unhealthy';
      message = 'Unhealthy for sensitive groups. Limit outdoor time.';
      progressColor = 'bg-orange-500';
    } else {
      emoji = '🔴';
      bg = 'bg-red-100';
      text = 'text-red-700';
      levelText = 'Very Unhealthy';
      message = 'Unhealthy air. Avoid outdoor activity.';
      progressColor = 'bg-red-500';
    }

    // Update the display elements
    indexEl.textContent = `AQI: ${aqi}`;
    levelEl.className = `level font-bold text-lg rounded-2xl px-4 py-1 shadow-sm ${bg} ${text}`;
    levelEl.textContent = levelText;
    messageEl.className = `inline-block font-medium px-4 py-2 rounded-full shadow-md ${bg} ${text} transition-all duration-300`;
    messageEl.textContent = `${emoji} ${message}`;
    progressBar.className = `${progressColor} h-3 rounded-full transition-all duration-300`;
    progressBar.style.width = `${(aqi / 500) * 100}%`; // Scaled to a max AQI of 500



    // 2fb5dca0430680a0202996c9c07a2e74 weather API key

    // https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={2fb5dca0430680a0202996c9c07a2e74}


    const apiKey = "2fb5dca0430680a0202996c9c07a2e74";
const lat = 44.34;
const lon = 10.99;

fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data); // check in browser console

    // Display current temperature
    document.getElementsByClassName("currentTemp").textContent = ` ${data.current.temp}°C`;
    console.log(data.current.temp);

    // Display hourly forecast (next 6 hours)
    const hourlyContainer = document.getElementById("hourly");
    data.hourly.slice(0, 6).forEach(hour => {
      const hourItem = document.createElement("div");
      const date = new Date(hour.dt * 1000);
      hourItem.innerHTML = `${date.getHours()}:00 - ${hour.temp}°C`;
      hourlyContainer.appendChild(hourItem);
    });

    // Display 7-day forecast
    const dailyContainer = document.getElementById("daily");
    data.daily.slice(0, 7).forEach(day => {
      const date = new Date(day.dt * 1000);
      const item = document.createElement("div");
      item.innerHTML = `${date.toDateString()}: ${day.temp.max}°C / ${day.temp.min}°C`;
      dailyContainer.appendChild(item);
    });
  });
