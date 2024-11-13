import { useState, useEffect, useRef } from 'react'
import './App.css'
import { DotLottieReact} from '@lottiefiles/dotlottie-react';


function App() {
  const [Ipcity, setIpcity] = useState("India")
  const Plipcity = useRef(null)
  const [Wdata, setWdata] = useState(null)

  useEffect(() => {
    Fetchdata(Ipcity)
  }, [Ipcity])


  const Fetchdata = async (city) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=fc0c9d8ea32645ecad673943241311&q=${city}&days=7&aqi=yes&alerts=no`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    setWdata(data)
  }

  const Searchhandler = () => {
    setIpcity(Plipcity.current.value)
    Plipcity.current.value = ''
  }

  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  console.log(Wdata?.current?.condition?.text)

  const Aqiadvice = () => {
    let aqi = Wdata?.current?.air_quality?.pm2_5;
    if (aqi < 50) return "Good air quality with minimal health risk";
    if (aqi < 100) return "Moderate air quality; safe for most but sensitive groups should take caution";
    if (aqi < 150) return "Unhealthy for sensitive groups; people with breathing issues should limit time outside";
    return "Unhealthy air quality; everyone may experience health effects";
  }

  const Heatadvice = () => {
    let heatIndex = Wdata?.current.heatindex_c;
    if (heatIndex < 80) return "Comfortable temperature";
    if (heatIndex < 90) return "Moderate heat; could be uncomfortable with prolonged exposure";
    if (heatIndex < 105) return "High heat; caution advised, especially during outdoor activity";
    return "Very high heat; dangerous with extended exposure";

  }

  const Windadvice = () => {
    let windSpeed = Wdata?.current.wind_kph;
    if (windSpeed < 5) return "Calm wind";
    if (windSpeed < 15) return "Light breeze";
    if (windSpeed < 25) return "Moderate breeze; noticeable on the face";
    return "Strong wind; may make it difficult to move freely";
  }


  return (
    <>


      <nav>
        <p className="logo">Weather.i</p>
        <input ref={Plipcity} onKeyPress={(e) => e.key === "Enter" && Searchhandler()} className='cityip' type="text" placeholder='Enter city name' />
      </nav>

      <main>

        <div className="left">
          <div className="leftup">

            <div className="curr_winfo">

              <div className="c_rigthpart">
                <p className="c_name">{Ipcity}</p>
                <p className="curr_date">{getCurrentDate()}</p>
                <p className="curr_temp">{Wdata?.current?.temp_c}°</p>
              </div>

              <div className="c_leftpart">
                <img className='wicon' src={Wdata?.current?.condition.icon} alt="weather icon" height={120} width={120} />
              </div>

            </div>

            <div className="hourly_weather">

              {/* <p className="h_heading">Hourly Forecast</p> */}
              <div className="h_f_container">

                {Wdata?.forecast?.forecastday[0]?.hour.slice(new Date().getHours(), new Date().getHours() + 5).map((Hdata, Index) => (
                  <div className="h_card" key={Index}>
                    <p className="h_time">{new Date(Hdata.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <img className='wicon' src={Hdata.condition.icon} alt="weather icon" height={32} width={32} />
                    <p className="h_temp">{Hdata.temp_c}°</p>
                  </div>
                ))}


              </div>

            </div>

          </div>


          <div className="downleft transparent">

            <div className="feelslike otherinfo">
              <div className="otherinner transparent">
                <img className='transparent oticon' src="aqi.png" alt="temp icon" height={24} />
                <p className="sm transparent">AQI</p>
              </div>
              <div className="descpt transparent">
                <p className="numot transparent">{Wdata?.current?.air_quality?.pm2_5}</p>
                <p className="otdesc transparent">{Aqiadvice()}</p>
              </div>
            </div>

            <div className="feelslike otherinfo">
              <div className="otherinner transparent">
                <img className='transparent oticon' src="heat_index.png" alt="temp icon" height={24} />
                <p className="sm transparent">Heat Index</p>
              </div>
              <div className="descpt transparent">
                <p className="numot transparent">{Wdata?.current.heatindex_c}</p>
                <p className="otdesc transparent">{Heatadvice()}</p>
              </div>
            </div>

            <div className="feelslike otherinfo">
              <div className="otherinner transparent">
                <img className='transparent oticon' src="windspeed.png" alt="temp icon" height={24} />
                <p className="sm transparent">Wind Speed</p>
              </div>
              <div className="descpt transparent">
                <p className="numot transparent">{Wdata?.current.wind_kph}</p>
                <p className="otdesc transparent">{Windadvice()}</p>
              </div>
            </div>

          </div>
        </div>

        <div className="right">
          {Wdata?.forecast?.forecastday.map((day,index)=>(
          <div className="sevenw transparent" key={index}>
            <p className="sday transparent">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <p className="stemp transparent">{day.day.maxtemp_c}°</p>
            <img className='transparent' src={day.day.condition.icon} alt="w_icon" height={24} />
          </div>
          ))}
          

        </div>
      </main>



    </>
  )
}

export default App