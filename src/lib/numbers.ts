export function isValidNumber(n?: string | number) {
   function parseNumber(number: typeof n) {
      if (Number.isNaN(number)) return new Error(number + " is not a number type")
      if (typeof number === "number" || (typeof number === 'string' && isFinite(+number))) return number
      return new Error(number + " is not a number type")
   }
   return !(parseNumber(n) instanceof Error)
}

export function toFixedDecimal(num: number | string, decimal = 2) {
   if (decimal === 0) return parseInt(String(num))
   const dotIndex = String(num).indexOf('.')
   if (!isValidNumber(num) && dotIndex > 0) {
      return String(num).slice(0, dotIndex + decimal + 1)
   }
   return num
}

export function formatNumber(num?: number | string, currencySign?: string, decimals = false) {
   if (num === undefined || !isValidNumber(num) || isNaN(+num) || +num === 0) return '0.0'
   return `${currencySign ?? ''}${intNumberFormat(decimals).format(+num)}`
}

export function metricPrefix(num: number, digits = 1) {
   if (!num) return "0";
   const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "Q" },
   ];
   const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
   var item = lookup
      .slice()
      .reverse()
      .find(item => num >= item.value);
   return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
}

export function intNumberFormat(decimals = true) {
   return new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: decimals ? 1 : 0,
      maximumFractionDigits: decimals ? 1 : 0
   })
}

export function getRandomInt(min: number, max: number) {
   min = Math.ceil(min);
   max = Math.floor(max);
   //The maximum is exclusive and the minimum is inclusive
   return Math.floor(Math.random() * (max - min) + min);
}

export function getPercentageChange(x: number, y: number) {
   return (y - x) / x
}