import { COIN_DAILY_PORTION } from "../constants";
import { CoinBalance } from "../types";

// creates daily portions of each coin balance
export const getDailyPortion = (balance: CoinBalance) => {
  return Object.entries(balance).reduce(
    (diff, [key, value]) => ({
      ...diff,
      [key]: Math.floor(value / COIN_DAILY_PORTION),
    }),
    {} as CoinBalance
  );
};

export const balanceAddition = (
  balance: CoinBalance,
  newBalance: CoinBalance,
  operation: 1 | -1 = 1,
  multiplier = 1
) =>
  Object.entries(balance).reduce((resultBalance, [key, value]) => {
    const addition = newBalance[key] || 0;
    return {
      ...resultBalance,
      [key]: value + addition * operation * multiplier,
    };
  }, {} as CoinBalance);

export const balanceToTotalCoins = (balance: CoinBalance) =>
  Object.values(balance).reduce((sum, currSum) => sum + currSum);

export const isComplete = (balance: CoinBalance) =>
  Object.values(balance).every((value) => value > 0);
