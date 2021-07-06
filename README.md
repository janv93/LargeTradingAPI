# LargeTradingAPI
This node API fulfills all the fundamental necessities of trading automation, including unique and combined trading strategies, backtesting, price prediction and executive behavior like opening and closing positions.

Frontend: [AngularChartVisualizer](https://github.com/janv93/AngularChartVisualizer)

## Status:

### Done:

- [x] Fetch Binance candlestick data
- [x] Indicators working: RSI, MACD (same as Binance/TradingView)
- [x] Basic Algorithms setting position signals
- [x] Backtesting position signals
- [x] Caching candlesticks in data base

### TBD:

- [ ] Finding linear/consistent and profitable algorithm on 100k+ timeframes (max: 10k on RSI algorithm)
- [ ] When profitable: Start forward test with Binance
- [ ] Implement Machine Learning: Linear regression on indicators, LSTM on closes
