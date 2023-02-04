# Large Trading API
This API allows to backtest any custom trading algorithm on symbols like cryptos, stocks, etfs, forex.
A backtest is a test of an algorithm on historical data.

Frontend: [Trading Chart Visualizer](https://github.com/janv93/trading-chart-visualizer)

## Status:

### Done:

- [x] Fetch stock, index and crypto candlestick data
- [x] Caching candlesticks in data base
- [x] Indicators
- [x] Algorithms setting position signals on past data

### Todo:

- [ ] AI: Transformer as improvement to standard NNs (position encoding time steps)
- [ ] Algorithm that builds strategies using multiple indicators and figuring out which combined indicators work the best
- [ ] Sentiment analysis of popular Twitter traders using Twitter API and ChatGPT API

### How to use backtests:

- either start the frontend project [Trading Chart Visualizer](https://github.com/janv93/trading-chart-visualizer) or call manually
- add credentials file (.env) to call APIs
- add or use existing algorithms in src/controllers/algorithms/
- when adding new algorithm, add settings for algorithm to frontend code
- npm i, npm start
- initialize data, e.g. localhost:3000/initKlines?exchange=binance&symbol=BTCUSDT&timeframe=1h (this is also done by the frontend)
- call algorithm, e.g. localhost:3000/klinesWithAlgorithm?algorithm=deepTrend&symbol=BTCUSDT&timeframe=1h&times=10 (this is also done by the frontend)

## Note:

- Install software requiements for tensorflow in order to use GPU: https://www.tensorflow.org/install/gpu.
- You can replace @tensorflow/tfjs-node-gpu with @tensorflow/tfjs-node to use CPU instead. This can greatly increase performance, depending on the network shape.
