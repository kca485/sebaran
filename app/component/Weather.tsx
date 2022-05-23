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
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    fetch('/.netlify/functions/fetch-weather/fetch-weather.js')
      .then((res) => res.json())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.msg, 'application/xml');
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
          setErrorMessage('gagal mengurai data');
        } else {
          const gkWeather = doc.querySelector(`[id='${GUNUNG_KIDUL_ID}'] [id='${WEATHER_ID}']`);
          if (!gkWeather) {
            setErrorMessage('gagal mengambil informasi cuaca');
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
    <tr key={info.dateTime}>
      <td className="pb-2 pr-4">{formatDateTime(info.dateTime)}</td>
      <td className="align-top">{condition.get(info.code)}</td>
    </tr>
  ));
  return (
    <div className="flex justify-center">
      <div className="mt-10 mx-4">
        <h1 className="text-2xl">Cuaca Kabupaten Gunung Kidul</h1>
        {
          weatherInfo.length && !errorMessage
            ? null
            : <div className="mt-4">mengambil data cuaca...</div>
        }
        {
          errorMessage
            ? <p>Error: {errorMessage}</p>
            : null
        }
        <table className="mt-4">
          <tbody>
            {infoList}
          </tbody>
        </table>
        <small>sumber: <a href="https://data.bmkg.go.id/prakiraan-cuaca/">BMKG</a></small>
      </div>
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
