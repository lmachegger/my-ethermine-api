import { StatDto } from './stat.dto';
const fetch = require('node-fetch');

export function fetchFromApi(onData: (data) => void, onError: (error) => void) {
  console.log('fetchFromApi');
  const url =
    'https://api.ethermine.org/miner/9af9008cc4B5ed2A245c4F0eA042B5396bEf13e0/currentStats';

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        console.error('error fetching api');
        onError('error fetching api');
      }

      res
        .json()
        .then((data) => {
          console.log(data);
          onData(data);
        })
        .catch((error) => {
          console.error('error parsing json: ', error);
          onError(error);
        });
    })
    .catch((error) => {
      console.error('error fetching api');
      onError(error);
    });
}

export function apiObjectToDto(apiObj: any): StatDto {
  const dto = new StatDto();
  dto.averageHashrate = apiObj.data.averageHashrate;
  dto.btcPerHour = apiObj.data.btcPerMin;
  dto.coinsPerHour = apiObj.data.coinsPerMin;
  dto.currentHashrate = apiObj.data.currentHashrate;
  dto.invalidShares = apiObj.data.invalidShares;
  dto.reportedHashrate = apiObj.data.reportedHashrate;
  dto.staleShares = apiObj.data.staleShares;
  dto.time = apiObj.data.time;
  dto.usdPerHour = apiObj.data.usdPerMin;
  dto.validShares = apiObj.data.validShares;
  return dto;
}
