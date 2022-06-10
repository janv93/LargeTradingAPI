# Large Trading API
This node API fulfills all the fundamental necessities of trading automation, including unique and combined trading strategies, backtesting, price prediction and executive behavior like opening and closing positions.

Frontend: [Trading Chart Visualizer](https://github.com/janv93/trading-chart-visualizer)

## Status:

### Done:

- [x] Fetch Binance candlestick data
- [x] Caching candlesticks in data base
- [x] Indicators working: EMA, RSI, MACD (same as Binance/TradingView)
- [x] Basic Algorithms setting position signals
- [x] Backtest
- [x] Find profitable and linear/consistent algorithm on 100k+ / max timeframes (Currently: EMA 80 on 1h)
- [x] Forward test

### WIP:

- [ ] Tensorflow.js algos

### Todo:

- [ ] Transformer as improvement to standard NNs (position encoding time steps)
- [ ] Add APIs for backtesting and trading stocks and ETFs

### How to use backtests:

- npm i, npm start the project
- start the frontend project [Trading Chart Visualizer](https://github.com/janv93/trading-chart-visualizer)
- add or use existing algorithms in src/controllers/algorithms/
- when adding new algorithm, add settings for algorithm to frontend code
- npm start
- initialize data, e.g. localhost:3000/initKlines?exchange=binance&symbol=BTCUSDT&timeframe=1h
- call algorithm, e.g. localhost:3000/klinesWithAlgorithm?algorithm=deepTrend&symbol=BTCUSDT&timeframe=1h&times=10

## Note:

- Install software requiements for tensorflow in order to use GPU: https://www.tensorflow.org/install/gpu. As of 11/7/21 you can use the latest version (it states CUDA 11.2 and cuDNN 8.1.0 but latest is tested and works, GPU gets registered "Created device /job:localhost/replica:0/task:0/device:GPU:0 with 8963 MB memory:  -> device: 0, name: NVIDIA GeForce RTX 2080 Ti")
- You can replace @tensorflow/tfjs-node-gpu with @tensorflow/tfjs-node to use CPU instead. This can greatly increase performance, depending on the network shape (neurons/cells per layer must be very large for GPU advantage) and your hardware.
