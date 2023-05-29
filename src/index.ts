import { DEFAULT_COIN_AMOUNT } from "./constants";
import {
  balanceAddition,
  balanceToTotalCoins,
  getDailyPortion,
  isComplete,
} from "./helpers/coinBalance";
import { parseInputFile } from "./helpers/fileParse";
import {
  findMaxCord,
  getNeighborsCords,
  initCities,
  initMap,
  printMap,
} from "./helpers/map";
import { City, CoinBalance } from "./types";

const main = () => {
  const inputData = parseInputFile();

  inputData.forEach((testCase, idx) => {
    console.log(`Case Number ${idx + 1}`);

    const { countries } = testCase;

    const countriesNames = countries.map(({ name }) => name);

    const maxHeight = findMaxCord(countries, "yh") - 1;
    const maxWidth = findMaxCord(countries, "xh") - 1;

    // creates grid of the map
    const map = initMap(maxWidth, maxHeight);

    // printMap(map);

    const defaultCoinBalance = countriesNames.reduce(
      (coinBalance, country) => ({
        ...coinBalance,
        [country]: 0,
      }),
      {} as CoinBalance
    );

    // fill the map
    initCities({ map, defaultCoinBalance, countries });

    // printMap(map);

    let result = countriesNames.reduce(
      (result, country) => ({
        ...result,
        [country]: null,
      }),
      {} as any
    );

    // exception of algorithm
    if (countriesNames.length === 1) {
      console.log(`${countriesNames[0]} 0`);
      return;
    }

    let isCompleteAll = Object.values(result).every((d) => d != null);

    let currDay = 0;

    let incompleteCountries: string[] = [];

    while (!isCompleteAll) {
      for (let x = 0; x <= maxWidth; x++) {
        for (let y = 0; y <= maxHeight; y++) {
          const city = map[x][y];

          if (!city) {
            continue;
          }

          const dailyPortion = getDailyPortion(city.coinBalance);

          const neighborsCords = getNeighborsCords(x, y);

          const neighbors = neighborsCords
            .map(([neighborX, neighborY]) => {
              const xAxisRes = map[neighborX];
              if (!xAxisRes) {
                return null;
              }

              return xAxisRes[neighborY] ?? null;
            })
            .filter((_) => !!_) as City[];

          neighbors.forEach((neighbor) =>
            neighbor.coinsIncome.push(dailyPortion)
          );

          city.coinBalance = balanceAddition(
            city.coinBalance,
            dailyPortion,
            -1,
            neighbors.length
          );
        }
      }

      for (let x = 0; x <= maxWidth; x++) {
        for (let y = 0; y <= maxHeight; y++) {
          const city = map[x][y];

          if (!city) {
            continue;
          }

          const updatedBalance = city.coinsIncome.reduce(
            (updatedBalance, currentIncome) =>
              balanceAddition(updatedBalance, currentIncome),
            city.coinBalance
          );
          city.coinBalance = updatedBalance;
          city.coinsIncome = [];

          if (!isComplete(city.coinBalance)) {
            incompleteCountries.push(city.country.name);
          }
        }
      }

      currDay += 1;

      countriesNames.forEach((country) => {
        if (!incompleteCountries.includes(country) && !result[country]) {
          result[country] = currDay;
          console.log(country + " " + currDay);
        }
      });

      isCompleteAll = Object.values(result).every((d) => d != null);

      // day end
      incompleteCountries = [];
    }
  });
};

main();
