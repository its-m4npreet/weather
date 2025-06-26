        // Coordinates and timezone (New Delhi, change as needed)
        let latitude = 28.6139;
        let longitude = 77.2090;
        const timezone = 'Asia/Kolkata';

        // API URLs
        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&hourly=temperature_2m,precipitation_probability,weathercode&forecast_days=7&timezone=${timezone}`;
        let airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,european_aqi&forecast_days=5&timezone=${timezone}`;

        // Weather code to icon mapping (adjust based on your assets)
        const weatherCodeToIcon = {
            0: './assests/sunny.png', // Clear sky
            1: './assests/partly-cloudy.png', // Mainly clear
            2: './assests/partly-cloudy.png', // Partly cloudy
            3: './assests/cloud.png', // Overcast
            61: './assests/rainy.png', // Rain
            63: './assests/rainy.png', // Moderate rain
            65: './assests/rainy.png', // Heavy rain
            // Add more mappings based on Open-Meteo weather codes and your assets
        };

        // AQI level mapping (based on European AQI)
              function getAqiLevel(aqi) {
            if (aqi <= 20) return { level: 'Good', color: 'bg-green-100',textColor:'bg-green-500' , message: '🟢 Air quality is good. It’s a great day to be outside!', width: (aqi / 100) * 100 };
            if (aqi <= 40) return { level: 'Fair', color: 'bg-yellow-100', textColor:'bg-yellow-500' , message: '🟡 Air quality is acceptable. Sensitive groups may notice effects.', width: (aqi / 100) * 100};
            if (aqi <= 60) return { level: 'Moderate', color: 'bg-orange-100', textColor:'bg-orange-500' , message: '🟠 Air quality is moderate. Unhealthy for sensitive groups.', width: (aqi / 100) * 100, textColor:'bg-orange-500' };
            if (aqi <= 80) return { level: 'Poor', color: 'bg-red-100', textColor:'bg-orange-500' , textColor:'bg-red-500', message: '🔴 Air quality is poor. Health effects may occur.', width: (aqi / 100) * 100 , textColor:'bg-red-500'};
            return { level: 'Very Poor', color: 'bg-purple-100', textColor:'bg-puple-500' , message: '🟣 Air quality is very poor. Serious health effects possible.', width: (aqi / 100) * 100 };
        }


        // Fetch coordinates for a city
        async function getCoordinates(city) {
            try {
                const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    return { latitude: data.results[0].latitude, longitude: data.results[0].longitude };
                } else {
                    alert('City not found. Please try another city.');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching coordinates:', error);
                alert('Failed to fetch coordinates. Please try again.');
                return null;
            }
        }

        // Update current weather and date
        async function updateCurrentWeather() {
            try {
                const response = await fetch(weatherUrl);
                const data = await response.json();

                // Current temperature (latest hourly data)
                const currentTemp = data.hourly.temperature_2m[0];
                document.querySelector('.currentTemp').textContent = `${Math.round(currentTemp)}°`;

                // Max/min temperature (today's daily data)
                document.querySelector('.higherTemp').textContent = `${Math.round(data.daily.temperature_2m_max[0])}°`;
                document.querySelector('.lowestTemp').textContent = `${Math.round(data.daily.temperature_2m_min[0])}°`;

                // Precipitation status
                const precip = data.daily.precipitation_sum[0];
                document.querySelector('.currentInfo p:nth-child(2)').textContent = precip > 0 ? 'Precipitations' : 'No Precipitations';

                // Weather icon
                const weatherCode = data.daily.weathercode[0];
                document.querySelector('.weatherMainIcon img').src = weatherCodeToIcon[weatherCode] || './assests/partly-cloudy.png';

                // Update date and day
                const today = new Date();
                document.querySelector('.day').textContent = today.toLocaleString('en-IN', { weekday: 'long' });
                document.querySelector('.month-text').textContent = today.toLocaleString('en-IN', { month: 'short' });
                document.querySelector('.date').textContent = today.getDate();
            } catch (error) {
                console.error('Error fetching current weather:', error);
                alert('Failed to fetch weather data.');
            }
        }

        // Update hourly forecast
        async function updateHourlyForecast() {
            try {
                const response = await fetch(weatherUrl);
                const data = await response.json();
                const hourlyContainer = document.querySelector('.hourlyForcast .space-y-2n');
                hourlyContainer.innerHTML = ''; // Clear existing items

                // Display next 8 hours
                for (let i = 0; i < 8; i++) {
                    const time = new Date(data.hourly.time[i]).toLocaleString('en-IN', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
                    const temp = Math.round(data.hourly.temperature_2m[i]);
                    const weatherCode = data.hourly.weathercode[i];
                    const iconSrc = weatherCodeToIcon[weatherCode] || './assests/partly-cloudy.png';

                    const hourlyDiv = document.createElement('div');
                    hourlyDiv.className = 'hourly p-6 flex flex-col items-center justify-center gap-3';
                    hourlyDiv.style.padding = '10px';
                    hourlyDiv.innerHTML = `
                        <span class="temp">${temp}°</span>
                        <img class="icon" src="${iconSrc}" alt="Weather" width="48" height="48">
                        <span class="hour w-16">${time}</span>
                    `;
                    hourlyContainer.appendChild(hourlyDiv);
                }
            } catch (error) {
                console.error('Error fetching hourly forecast:', error);
                alert('Failed to fetch hourly forecast.');
            }
        }

        // Update weekly forecast
        async function updateWeeklyForecast() {
            try {
                const response = await fetch(weatherUrl);
                const data = await response.json();
                const weeklyContainer = document.querySelector('.weekForcast .flex');
                weeklyContainer.innerHTML = ''; // Clear existing items

                for (let i = 0; i < 7; i++) {
                    const date = new Date(data.daily.time[i]);
                    const weekday = date.toLocaleString('en-IN', { weekday: 'short' });
                    const temp = Math.round(data.daily.temperature_2m_max[i]);
                    const weatherCode = data.daily.weathercode[i];
                    const iconSrc = weatherCodeToIcon[weatherCode] || './assests/partly-cloudy.png';

                    const dailyDiv = document.createElement('div');
                    dailyDiv.className = 'daily flex flex-col items-center justify-center';
                    dailyDiv.innerHTML = `
                        <span class="temp text-blue-200 text-lg font-semibold">${temp}°</span>
                        <img class="icon" src="${iconSrc}" alt="Weather" width="48" height="48">
                        <span class="weekday w-16 text-lg font-medium text-gray-100">${weekday}</span>
                    `;
                    weeklyContainer.appendChild(dailyDiv);
                }
            } catch (error) {
                console.error('Error fetching weekly forecast:', error);
                alert('Failed to fetch weekly forecast.');
            }
        }

        // Update air pollution
     
        // Update air pollution
        async function updateAirPollution() {
            try {
                const response = await fetch(airQualityUrl);
                const data = await response.json();

                // Use latest hourly AQI (European AQI)
                const aqi = data.hourly.european_aqi[0] || 35; // Fallback to 35 if null
                const aqiInfo = getAqiLevel(aqi);

                // Update UI
                document.getElementById('air-quality-level').textContent = aqiInfo.level;
                document.getElementById('air-quality-level').className =`level font-bold text-lg rounded-2xl shadow-sm ${aqiInfo.textColor}`;
                console.log(aqiInfo);
                document.getElementById('aqi-index').textContent = `AQI: ${Math.round(aqi)}`;
                document.getElementById('aqi-progress').style.width = `${aqiInfo.width}%`;
                document.getElementById('aqi-progress').className = `h-3 rounded-full transition-all duration-300 ${aqiInfo.textColor}`;
                document.getElementById('air-quality-msg').textContent = aqiInfo.message;
                document.getElementById('air-quality-msg').className = `inline-block font-medium rounded-full shadow-md ${aqiInfo.color.replace('bg-', 'bg-').replace('500', '100')} text-${aqiInfo.color.split('-')[1]}-700`;
                document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleString('en-IN', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true })} IST, ${new Date().toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
            } catch (error) {
                console.error('Error fetching air pollution:', error);
                alert('Failed to fetch air pollution data.');
            }
        }
        

        // Search bar event listener
        document.querySelector('#searchBtn').addEventListener('click', async () => {
            const city = document.querySelector('#cityInput').value.trim();
            if (!city) {
                alert('Please enter a city name.');
                return;
            }
            const coords = await getCoordinates(city);
            if (coords) {
                latitude = coords.latitude;
                longitude = coords.longitude;
                // Update API URLs
                weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&hourly=temperature_2m,precipitation_probability,weathercode&forecast_days=7&timezone=${timezone}`;
                airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,european_aqi&forecast_days=5&timezone=${timezone}`;
                // Refresh data
                updateCurrentWeather();
                updateHourlyForecast();
                updateWeeklyForecast();
                updateAirPollution();
            }
        });

        // Initialize all updates
        window.onload = () => {
            updateCurrentWeather();
            updateHourlyForecast();
            updateWeeklyForecast();
            updateAirPollution();
        };


        document.addEventListener('DOMContentLoaded', () => {
            const welcomePage = document.getElementById('welcome-page');
            const mainContent = document.getElementById('main-content');
            if (welcomePage && mainContent) {
                mainContent.style.display = 'none';
                welcomePage.style.display = 'block';
                setTimeout(() => {
                    welcomePage.style.display = 'none';
                    mainContent.style.display = 'block';
                }, 2000); // Show welcome page for 2 seconds
            }
        });
