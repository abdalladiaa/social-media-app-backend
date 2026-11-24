import AppError from "../../pkg/error/error.js";

type ToMsUnit =   "second"|"minute"|"hour" | "day"
type ToSecondsUnit = "millisecond" | "minute"|"hour" | "day"

export const toMs = (value: number, unit: ToMsUnit) => {
  switch (unit) {
    case "second":
      return value * 1000;

    case "minute":
      return value * 60 * 1000;

    case "hour":
      return value * 60 * 60 * 1000;

    case "day":
      return value * 24 * 60 * 60 * 1000;

    default:
      throw new AppError("Invalid time unit" , 500);
  }
};

export const toSeconde = (value: number, unit: ToSecondsUnit) => {
  switch (unit) {
    case "millisecond":
      return value / 1000;

    case "minute":
      return value * 60;

    case "hour":
      return value * 60 * 60;

    case "day":
      return value * 24 * 60 * 60;

    default:
      throw new AppError("Invalid time unit" , 500);
  }
};
