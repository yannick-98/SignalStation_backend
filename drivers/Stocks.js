const Stock = require("../models/Stock");
const Signal = require("../models/Signal");

const fetch = require("node-fetch");
const apiKey5 = "FOLTKD0XAVGZXMSG";
const apiKey1 = "S77781KDCZNLR4PQ";
const apiKey2 = "NSL2OVDYARM5JAVU";
const apiKey4 = "FZNX0I5GJR0RR2WF";
const apiKey3 = "VH7QCE4SEUNM4ZAX";
const apiKey = "6MKD1957033T6D2H";

const symbols = [
  //"EURUSD",
  // "EURGBP",
  // "GBPUSD",
  "EURCHF",
  // "EURCAD",
  // "EURJPY",
  // "EURNZD",
  // "GBPCAD",
  // "USDJPY",
  // "AUDUSD",
  // "NZDUSD",
];

const call = async (req, res) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=EURUSD&apikey=${apiKey}`;
  const url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=EURUSD&apikey=${apiKey5}`;
  const url3 = `https://www.alphavantage.co/query?function=RSI&symbol=EURUSD&interval=weekly&time_period=10&series_type=open&apikey=${apiKey}`;
  const urlSTOCH = `https://www.alphavantage.co/query?function=STOCH&symbol=EURUSD&interval=weekly&apikey=${apiKey}`;
  const urlADX = `https://www.alphavantage.co/query?function=ADX&symbol=XAUUSD&interval=weekly&time_period=10&apikey=${apiKey}`;

  try {
    const response = await fetch(urlSTOCH);
    const data = await response.json();
    // const stoch = data["Technical Analysis: STOCH"];
    // const indDaily = new IndDaily({
    //   symbol: "XAUUSD",
    //   stoch,
    // });
    // await indDaily.save();
    return res.status(200).json({
      status: "success",
      message: "Data for all currency pairs updated successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

//ALPHAVANTAGE API
const importDaily = async (req, res) => {
  try {
    for (const symbol of symbols) {
      const url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey2}`;
      const response = await fetch(url1);
      const data = await response.json();
      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) {
        return res.status(400).json({
          status: "error",
          error: "API limit reached",
        });
      }
      const lastDate = Object.keys(timeSeries)[0];

      const stock = await Stock.findOne({ symbol: symbol, tf: "daily" });
      if (stock) {
        let data = stock.data;
        data[lastDate] = timeSeries[lastDate];
        await Stock.updateOne(
          { symbol: symbol, tf: "daily" },
          { $set: { data: data } },
          { new: true }
        );
      } else {
        const stocks = new Stock({
          symbol: symbol,
          tf: "daily",
          data: timeSeries,
        });
        await stocks.save();
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Data for all currency pairs updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

const importWeekly = async (req, res) => {
  try {
    for (const symbol of symbols) {
      const url1 = `https:www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${apiKey5}`;
      const response = await fetch(url1);
      const data = await response.json();
      const timeSeries = data["Weekly Time Series"];
      if (!timeSeries) {
        return res.status(400).json({
          status: "error",
          error: "API limit reached",
          timeSeries,
        });
      }
      const lastDate = Object.keys(timeSeries)[0];
      const stock = await Stock.findOne({ symbol: symbol, tf: "weekly" });
      if (stock) {
        let data = stock.data;
        data[lastDate] = timeSeries[lastDate];
        await Stock.updateOne(
          { symbol: symbol, tf: "weekly" },
          { $set: { data: data } },
          { new: true }
        );
      } else {
        const stocks = new Stock({
          symbol: symbol,
          tf: "weekly",
          data: timeSeries,
        });
        await stocks.save();
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Data for all currency pairs updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

const importIndDaily = async (req, res) => {
  try {
    for (const symbol of symbols) {
      const stock = await Stock.findOne({ symbol: symbol, tf: "daily" });
      if (!stock) {
        return res.status(404).json({
          status: "error",
          message: "Stock not found",
        });
      }

      const urlRSI = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=10&series_type=open&apikey=${apiKey}`;
      const resRSI = await fetch(urlRSI);
      const dataRSI = await resRSI.json();
      const rsi = dataRSI["Technical Analysis: RSI"];
      const lastDateRSI = Object.keys(rsi)[0];
      if (Number(lastDateRSI.RSI) > 70) {
        const signal = new Signal({
          symbol: symbol,
          tf: "daily",
          ind: "rsi",
          data: Number(lastDateRSI.RSI),
          text: "Overbought",
        });
        await signal.save();
      }
      if (Number(lastDateRSI.RSI) < 30) {
        const signal = new Signal({
          symbol: symbol,
          tf: "daily",
          ind: "rsi",
          data: Number(lastDateRSI.RSI),
          text: "Oversold",
        });
        await signal.save();
      }

      const urlSTOCH = `https://www.alphavantage.co/query?function=STOCH&symbol=${symbol}&interval=daily&apikey=${apiKey}`;
      const resSTOCH = await fetch(urlSTOCH);
      const dataSTOCH = await resSTOCH.json();
      const stoch = dataSTOCH["Technical Analysis: STOCH"];

      const urlADX = `https://www.alphavantage.co/query?function=ADX&symbol=${symbol}&interval=daily&time_period=10&apikey=${apiKey}`;
      const resADX = await fetch(urlADX);
      const dataADX = await resADX.json();
      const adx = dataADX["Technical Analysis: ADX"];
      const lastDateADX = Object.keys(adx)[0];
      if (Number(lastDateADX.ADX) > 25) {
        const signal = new Signal({
          symbol: symbol,
          tf: "daily",
          ind: "adx",
          data: Number(lastDateADX.ADX),
          text: "Trend",
        });
        await signal.save();
      }

      const urlATR = `https://www.alphavantage.co/query?function=ATR&symbol=${symbol}&interval=daily&time_period=10&apikey=${apiKey}`;
      const resATR = await fetch(urlATR);
      const dataATR = await resATR.json();
      const atr = dataATR["Technical Analysis: ATR"];
      const lastDateATR = Object.keys(atr)[0];
      if (Number(lastDateATR.ATR) > 0.001) {
        const signal = new Signal({
          symbol: symbol,
          tf: "daily",
          ind: "atr",
          data: Number(lastDateATR.ATR),
          text: "Volatility",
        });
        await signal.save();
      }

      const urlBBANDS = `https://www.alphavantage.co/query?function=BBANDS&symbol=${symbol}&interval=daily&time_period=5&series_type=open&nbdevup=3&nbdevdn=3&apikey=${apiKey}`;
      const resBBANDS = await fetch(urlBBANDS);
      const dataBBANDS = await resBBANDS.json();
      const bbands = dataBBANDS["Technical Analysis: BBANDS"];
      const lastDateBBANDS = Object.keys(bbands)[0];
      if (
        Number(lastDateBBANDS["Real Upper Band"]) -
          Number(lastDateBBANDS["Real Lower Band"]) >
          0.001 &&
        Number(lastDateBBANDS["Real Upper Band"]) -
          Number(lastDateBBANDS["Real Lower Band"]) <
          0.01
      ) {
        const signal = new Signal({
          symbol: symbol,
          tf: "daily",
          ind: "bbands",
          data:
            Number(lastDateBBANDS["Real Upper Band"]) -
            Number(lastDateBBANDS["Real Lower Band"]),
          text: "Volatility",
        });
        await signal.save();
      }

      const urlEMA200 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=daily&time_period=200&series_type=open&apikey=${apiKey}`;
      const resEMA200 = await fetch(urlEMA200);
      const dataEMA200 = await resEMA200.json();
      const ema200 = dataEMA200["Technical Analysis: EMA"];

      const urlEMA50 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=daily&time_period=50&series_type=open&apikey=${apiKey}`;
      const resEMA50 = await fetch(urlEMA50);
      const dataEMA50 = await resEMA50.json();
      const ema50 = dataEMA50["Technical Analysis: EMA"];

      const urlEMA20 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=daily&time_period=20&series_type=open&apikey=${apiKey}`;
      const resEMA20 = await fetch(urlEMA20);
      const dataEMA20 = await resEMA20.json();
      const ema20 = dataEMA20["Technical Analysis: EMA"];

      const urlEMA10 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=daily&time_period=10&series_type=open&apikey=${apiKey}`;
      const resEMA10 = await fetch(urlEMA10);
      const dataEMA10 = await resEMA10.json();
      const ema10 = dataEMA10["Technical Analysis: EMA"];

      const data = stock.data;
      const keys = Object.keys(data);
      for (const key of keys) {
        data[key].rsi = rsi[key] || 0;
        data[key].stoch = stoch[key] || 0;
        data[key].adx = adx[key] || 0;
        data[key].ema200 = ema200[key] || 0;
        data[key].ema50 = ema50[key] || 0;
        data[key].ema20 = ema20[key] || 0;
        data[key].ema10 = ema10[key] || 0;
        data[key].atr = atr[key] || 0;
        data[key].bbands = bbands[key] || 0;
      }
      console.log(rsi);
      console.log(data);
      await Stock.updateOne(
        { symbol: symbol, tf: "daily" },
        { $set: { data: data } },
        { new: true }
      );
    }
    return res.status(200).json({
      status: "success",
      message: "Data for all indicators imported successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

// const importIndWeekly = async (req, res) => {
//   try {
//     for (const symbol of symbols) {
//       const urlRSI = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=weekly&time_period=10&series_type=open&apikey=${apiKey}`;
//       const resRSI = await fetch(urlRSI);
//       const dataRSI = await resRSI.json();
//       const rsi = dataRSI["Technical Analysis: RSI"];

//       const urlSTOCH = `https://www.alphavantage.co/query?function=STOCH&symbol=${symbol}&interval=weekly&apikey=${apiKey}`;
//       const resSTOCH = await fetch(urlSTOCH);
//       const dataSTOCH = await resSTOCH.json();
//       const stoch = dataSTOCH["Technical Analysis: STOCH"];

//       const urlADX = `https://www.alphavantage.co/query?function=ADX&symbol=${symbol}&interval=weekly&time_period=10&apikey=${apiKey}`;
//       const resADX = await fetch(urlADX);
//       const dataADX = await resADX.json();
//       const adx = dataADX["Technical Analysis: ADX"];

//       const urlATR = `https://www.alphavantage.co/query?function=ATR&symbol=${symbol}&interval=weekly&time_period=10&apikey=${apiKey}`;
//       const resATR = await fetch(urlATR);
//       const dataATR = await resATR.json();
//       const atr = dataATR["Technical Analysis: ATR"];

//       const urlBBANDS = `https://www.alphavantage.co/query?function=BBANDS&symbol=${symbol}&interval=weekly&time_period=5&series_type=open&nbdevup=3&nbdevdn=3&apikey=${apiKey}`;
//       const resBBANDS = await fetch(urlBBANDS);
//       const dataBBANDS = await resBBANDS.json();
//       const bbands = dataBBANDS["Technical Analysis: BBANDS"];

//       const urlMACD = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=weekly&series_type=open&apikey=${apiKey}`;
//       const resMACD = await fetch(urlMACD);
//       const dataMACD = await resMACD.json();
//       const macd = dataMACD["Technical Analysis: MACD"];

//       const urlEMA200 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=weekly&time_period=200&series_type=open&apikey=${apiKey}`;
//       const resEMA200 = await fetch(urlEMA200);
//       const dataEMA200 = await resEMA200.json();
//       const ema200 = dataEMA200["Technical Analysis: EMA"];

//       const urlEMA50 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=weekly&time_period=50&series_type=open&apikey=${apiKey}`;
//       const resEMA50 = await fetch(urlEMA50);
//       const dataEMA50 = await resEMA50.json();
//       const ema50 = dataEMA50["Technical Analysis: EMA"];

//       const urlEMA20 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=weekly&time_period=20&series_type=open&apikey=${apiKey}`;
//       const resEMA20 = await fetch(urlEMA20);
//       const dataEMA20 = await resEMA20.json();
//       const ema20 = dataEMA20["Technical Analysis: EMA"];

//       const urlEMA10 = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=weekly&time_period=10&series_type=open&apikey=${apiKey}`;
//       const resEMA10 = await fetch(urlEMA10);
//       const dataEMA10 = await resEMA10.json();
//       const ema10 = dataEMA10["Technical Analysis: EMA"];

//       const stock = await IndWeekly.findOne({ symbol: symbol });

//       if (stock) {
//         await IndWeekly.updateOne(
//           { symbol: symbol },
//           {
//             $set: {
//               rsi: rsi,
//               stoch: stoch,
//               adx: adx,
//               ema200: ema200,
//               ema50: ema50,
//               ema20: ema20,
//               ema10: ema10,
//               atr: atr,
//               bbands: bbands,
//               macd: macd,
//             },
//           },
//           { new: true }
//         );
//       } else {
//         const indWeekly = new IndWeekly({
//           symbol: symbol,
//           rsi: rsi,
//           stoch: stoch,
//           adx: adx,
//           ema200: ema200,
//           ema50: ema50,
//           ema20: ema20,
//           ema10: ema10,
//           atr: atr,
//           bbands: bbands,
//           macd: macd,
//         });
//         await indWeekly.save();
//       }
//     }
//     return res.status(200).json({
//       status: "success",
//       message: "Data for all indicators imported successfully.",
//       rsi,
//       stoch,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "error",
//       error: error,
//     });
//   }
// };

// MONGODB;
const getDaily = async (req, res) => {
  try {
    let stocks = await Stock.find({ tf: "daily" });

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Stock not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Stock found",
      stocks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getWeekly = async (req, res) => {
  try {
    let stocks = await Stock.find({ tf: "weekly" });

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Stocks not found",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Stocks found",
      stocks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// const getIndWeekly = async (req, res) => {
//   try {
//     //Consulta con métodos find( construir consulta), limit(limitar cantidad), sort(ordenar) y exec(ejecutar consulta)
//     let stocks = await IndWeekly.find({}).limit().sort({ date: -1 }).exec();

//     //Validación datos recibidos
//     if (!stocks || stocks.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "Stocks not found",
//       });
//     }

//     //Respuesta validada
//     return res.status(200).send({
//       status: "success",
//       message: "Stocks found",
//       stocks,
//     });

//     //Error en método find
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "error",
//       message: "Internal Server Error",
//     });
//   }
// };

module.exports = {
  importDaily,
  importWeekly,
  importIndDaily,
  // importIndWeekly,
  getDaily,
  getWeekly,
  // getIndWeekly,
  call,
};

// const daily = async (req, res) => {
//   const currencyPairs = symbols;

//   try {
//     for (const symbol of currencyPairs) {
//       const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
//       const response = await fetch(url);
//       const data = await response.json();

//       const stocks = new Daily({
//         symbol: symbol,
//         data: data,
//       });

//       await stocks.save();
//     }
//     console.log("success");
//     return res.status(200).json({
//       status: "success",
//       message: "Data for all currency pairs imported successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       status: "error",
//       error: error,
//     });
//   }
// };

// const weekly = async (req, res) => {
//   const currencyPairs = symbols;

//   try {
//     for (const symbol of currencyPairs) {
//       const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}}`;
//       const response = await fetch(url);
//       const data = await response.json();

//       const stocks = new Weekly({
//         symbol: symbol,
//         data: data,
//       });

//       await stocks.save();
//     }
//     console.log("success");
//     return res.status(200).json({
//       status: "success",
//       message: "Data for all currency pairs imported successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       status: "error",
//       error: error,
//     });
//   }
// };
