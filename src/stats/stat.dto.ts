export class StatDto {
  id?: number;
  time?: number; // unix timestamp
  reportedHashrate: number; // H/s
  currentHashrate: number; // H/s
  validShares: number;
  invalidShares: number;
  staleShares: number;
  averageHashrate: number; // Average hashrate of the miner in H/s during the last 24h
  coinsPerHour: number; // Estimated number of coins mined per minute (based on your average hashrate as well as the average block time and difficulty of the network over the last 24 hours.)
  usdPerHour: number; // Estimated number of USD mined per minute (based on your average hashrate as well as the average block time and difficulty of the network over the last 24 hours.)
  btcPerHour: number; // Estimated number of BTC mined per minute (based on your average hashrate as well as the average block time and difficulty of the network over the last 24 hours.)
  isMaxEntity?: boolean; // Estimated number of BTC mined per minute (based on your average hashrate as well as the average block time and difficulty of the network over the last 24 hours.)
}
