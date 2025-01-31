const apiKey = '312ae3da38dc5de016ba65a3910e6094'
const searchBtn = document.querySelector(".search-button")
const cityInput = document.querySelector(".city-input")
const notFoundSection = document.querySelector(".not-found")
const searchMessageSection = document.querySelector(".search-message")
const weatherInfoSection = document.querySelector(".weather-info")
const loadingSection = document.querySelector(".loading-container")
const countryText = document.querySelector(".country-txt")
const dateText = document.querySelector(".current-date-txt")
const tempText = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")
const humidityValue = document.querySelector(".humidity-value-txt")
const speedValue = document.querySelector(".speed-value-txt")
const image = document.querySelector(".weather-summary-img")

const sections = [notFoundSection, searchMessageSection, weatherInfoSection, loadingSection]
const weekday = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


const handleSearch = () => {
    if (cityInput.value.trim() != '') {
        cityInput.blur()
        updateWeatherInfo(cityInput.value)
    }
    else {

    }
}

searchBtn.addEventListener("click", handleSearch)
cityInput.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        handleSearch()
    }
})


const showSection = (s) => {
    sections.forEach((section) => {
        if (section == s) {
            section.classList.remove("none")
        }
        else {
            section.classList.add("none")
        }
    })
}

// Fetch and Update weather data
const updateWeatherInfo = async (city) => {
    showSection(loadingSection)
    const weatherData = await fetchWeatherInfo(city, 'weather')

    if (weatherData.cod != 200) {
        showSection(notFoundSection)
    }
    else {
        const forecastData = await fetchWeatherInfo(city, 'forecast')

        const {
            name,
            sys: { country },
            wind: { speed },
            main: { temp, humidity },
            weather: [{
                main,
                icon
            }],
            timezone,
            dt

        } = weatherData

        const date = new Date((dt + timezone) * 1000)

        if (forecastData.cod == 200) {
            const forecastItemsContainer = document.querySelector(".forcast-items-container")
            forecastItemsContainer.innerHTML = ''

            forecastData.list.forEach((item) => {

                const forecastDate = new Date((item.dt + timezone) * 1000)

                if (item.dt_txt.includes("12:00:00") && (forecastDate.getUTCDate() != date.getUTCDate())) {

                    forecastItemsContainer.innerHTML += ` <div class="forcast-item">
                    <h4 class="forcast-item-date regular-txt">
                    ${forecastDate.getUTCDate()} ${months[forecastDate.getUTCMonth()].slice(0, 3)}
                    </h4>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="" class="forcast-item-img">
                    <h4 class="forcast-item-temp">
                        ${parseInt(item.main.temp) - 273} °C
                    </h4>
                    </div>`
                }
            })
        }

        countryText.innerHTML = `${name}, ${country}`
        dateText.innerHTML = `${weekday[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]}`
        tempText.innerHTML = `${parseInt(temp) - 273} °C`
        conditionTxt.innerHTML = main
        humidityValue.innerHTML = `${humidity} %`
        speedValue.innerHTML = `${parseInt(speed * 3.6)} Km/h`
        image.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

        showSection(weatherInfoSection)
    }
}

const fetchWeatherInfo = async (city, type) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/${type}?appid=${apiKey}&q=${city}`)
    return response.json()
}