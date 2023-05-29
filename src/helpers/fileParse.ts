import fs from "fs";
import { CountryInput, InputData } from "../types";
import { FILENAME } from "../constants";

const inputCountryMapper = (line: string): CountryInput => {
  const lineParts = line.split(" ");

  if (lineParts.length !== 5) {
    throw `Invalid input: country line ${line} is invalid.`;
  }

  // error case 1
  if (lineParts[0].length > 25) {
    console.error("Invalid input: country name too long");
  }

  // get cords in integers
  const cordsArr = lineParts.slice(1).map((c) => parseInt(c));

  // error case 2
  if ([...cordsArr, lineParts[0]].join(" ").length !== line.length) {
    console.error("Invalid input: country coordinates containing floats");
  }

  // error case 3
  if (cordsArr.some((cord) => cord > 10 || cord < 1)) {
    throw `Invalid input: country ${lineParts[0]} cords are exceeding limits`;
  }

  const countryInput: CountryInput = {
    name: lineParts[0],
    cords: {
      xl: parseInt(lineParts[1]),
      yl: parseInt(lineParts[2]),
      xh: parseInt(lineParts[3]),
      yh: parseInt(lineParts[4]),
    },
  };

  // error case 4
  if (
    countryInput.cords.xl > countryInput.cords.xh ||
    countryInput.cords.yl > countryInput.cords.yh
  ) {
    throw `Invalid input: country ${lineParts[0]} cords have wrong order`;
  }

  return countryInput;
};

export const parseInputFile = () => {
  const lines = fs
    .readFileSync(FILENAME)
    .toString()
    .split("\n")
    .map((line) => line.replace("\r", ""));

  const testCases: InputData[] = [];
  let currTestCaseIdx = -1;
  let currCountryAmount: null | number = null;

  if (lines[lines.length - 1] !== "0") {
    throw "Input file must end with '0' line";
  }

  lines.forEach((line, idx) => {
    // if string starts with letter, gives NaN. Else - first number in line
    const parsedLine = parseInt(line);

    // case 1: we have countries number
    if (!isNaN(parsedLine)) {
      // error case 1
      if (parsedLine === 0) {
        if (idx !== lines.length - 1) {
          console.error("Invalid input: 0 countries before the end of file ");
        } else {
          // last line
          return;
        }
      }

      // error case 2
      if (parsedLine.toString().length !== line.length) {
        console.error("Invalid input: invalid country amount variable format");
      }

      // error case 3
      if (parsedLine > 20 || parsedLine < 1) {
        console.error("Invalid input: invalid country amount variable format");
      }

      // error case 4
      // check if country amount is same as actual amount
      // before switching to next test case
      if (
        currCountryAmount !== null &&
        currCountryAmount !== testCases[currTestCaseIdx].countries.length
      ) {
        console.error(
          "Invalid input: country amount is not same as actual amount"
        );
      }

      // switch to new test case
      currTestCaseIdx += 1;
      currCountryAmount = parsedLine;
      testCases[currTestCaseIdx] = {
        countries: [],
      };

      return;
    }

    // case 2: we have county line

    // if country amount hasn't been parsed yet
    if (currTestCaseIdx < 0) {
      throw "Invalid input: first line must contain integer";
    }

    const countryInput = inputCountryMapper(line);

    testCases[currTestCaseIdx].countries.push(countryInput);
  });
  return testCases;
};
