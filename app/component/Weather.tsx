import React, { useState, useEffect } from 'react';

const GUNUNG_KIDUL_ID = '501189';
const WEATHER_ID = 'weather';

const condition = new Map([
  ['0', 'Cerah'],
  ['1', 'Cerah Berawan'],
  ['2', 'Cerah Berawan'],
  ['3', 'Berawan'],
  ['4', 'Berawan Tebal'],
  ['5', 'Udara Kabur'],
  ['10', 'Asap'],
  ['45', 'Kabut'],
  ['60', 'Hujan Ringan'],
  ['61', 'Hujan Sedang'],
  ['63', 'Hujan Lebat'],
  ['80', 'Hujan Lokal'],
  ['95', 'Hujan Petir'],
  ['97', 'Hujan Petir'],
]);

interface HourInfo {
  dateTime: string;
  code: string;
}
function Weather() {
  const [weatherInfo, setWeatherInfo] = useState([] as HourInfo[]);
  useEffect(() => {
    fetch('/.netlify/functions/fetch-weather/fetch-weather.js')
      .then((res) => res.json())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.msg, 'application/xml');
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
          console.log('error while parsing');
        } else {
          const gkWeather = doc.querySelector(`[id='${GUNUNG_KIDUL_ID}'] [id='${WEATHER_ID}']`);
          if (!gkWeather) {
            console.log('could not find weather info');
            return;
          }

          const newWeatherInfo: HourInfo[] = [];
          Array.prototype.forEach.call(gkWeather.children, (child) => {
            const hourInfo = {
              dateTime: child.getAttribute('datetime'),
              code: child.firstElementChild.textContent,
            };
            newWeatherInfo.push(hourInfo);
          });
          setWeatherInfo(newWeatherInfo);
        }
      });
  }, []);

  const infoList = weatherInfo.map((info) => (
    <li>{formatDateTime(info.dateTime)}: {condition.get(info.code)}</li>
  ));
  return (
    <div>
      <h1>Cuaca</h1>
      <ul>
        {infoList}
      </ul>
      <small>sumber: <a href="https://data.bmkg.go.id/prakiraan-cuaca/">BMKG</a></small>
    </div>
  );
}

function formatDateTime(dateTime: string) {
  const year = dateTime.substring(0, 4);
  const month = dateTime.substring(4, 6);
  const day = dateTime.substring(6, 8);
  const hour = dateTime.substring(8, 10);
  const minute = dateTime.substring(10, 12);

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

export default Weather;
