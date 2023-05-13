export type CountryCords = {
  xl: number;
  xh: number;
  yl: number;
  yh: number;
};
export type CountryInput = {
  cords: CountryCords;
  name: string;
};

export type InputData = {
  countries: CountryInput[];
};

export type Country = CountryInput & {};

export type CoinBalance = Record<string, number>;

export type City = {
  country: Country;
  coinBalance: CoinBalance;
  coinsIncome: CoinBalance[];
};

export type Map = (null | City)[][];
