import { DEFAULT_COIN_AMOUNT } from "../constants";
import { City, CoinBalance, CountryInput, Map } from "../types";

export const findMaxCord = (
  countries: CountryInput[],
  compareField: "yh" | "xh"
) =>
  countries.reduce((maxCord, countryData) => {
    return Math.max(maxCord, countryData.cords[compareField]);
  }, 0);

export const printMap = (board: Map) => {
  let buffer = "";
  for (let i = 0; i < board.length; i++) {
    for (let x = 0; x < board[i].length; x++) {
      const alias = board[i][x]?.country?.name?.charAt(0);

      buffer += ` ${alias || "-"} `;
    }
    buffer += "\n";
  }
  console.log(buffer);
};

export const initMap = (maxWidth: number, maxHeight: number) => {
  const map: Map = [];

  for (let x = 0; x <= maxWidth; x++) {
    map.push([] as City[]);
    for (let y = 0; y <= maxHeight; y++) {
      map[x][y] = null;
    }
  }
  return map;
};

export const initCities = ({
  map,
  countries,
  defaultCoinBalance,
}: {
  map: Map;
  countries: CountryInput[];
  defaultCoinBalance: CoinBalance;
}) =>
  countries.forEach((country) => {
    const { name, cords } = country;

    const { xh, xl, yh, yl } = cords;

    for (let i = xl; i <= xh; i++) {
      for (let j = yl; j <= yh; j++) {
        if (map[i - 1][j - 1] !== null) {
          // this cell was used already
          throw "cords overlap";
        }
        map[i - 1][j - 1] = {
          country,
          coinsIncome: [],
          coinBalance: { ...defaultCoinBalance, [name]: DEFAULT_COIN_AMOUNT },
        };
      }
    }
  });

export const getNeighborsCords = (x: number, y: number) => [
  [x + 1, y],
  [x - 1, y],
  [x, y + 1],
  [x, y - 1],
];
