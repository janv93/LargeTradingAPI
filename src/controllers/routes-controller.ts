import BinanceController from './binance-controller';
import MomentumController from './algorithms/momentum-controller';
import BacktestController from './algorithms/backtest-controller';
import IndicatorsController from './technical-analysis/indicators-controller';
import MacdController from './algorithms/macd-controller';
import RsiController from './algorithms/rsi-controller';

export default class RoutesController {
  private binanceController = new BinanceController();
  private momentumController = new MomentumController();
  private backtestController = new BacktestController();
  private indicatorsController = new IndicatorsController();
  private macdController = new MacdController();
  private rsiController = new RsiController();

  constructor() {
  }

  /**
   * get list of klines / candlesticks from binance
   */
  public getKlines(req, res): void {
    this.binanceController.getKlinesMultiple(req.query.symbol, req.query.times, req.query.timeframe)
      .then((response: any) => {
        res.send(response);
      });
  }

  /**
   * get list of klines / candlesticks from binance and add buy and sell signals
   * 
   * algorithm is delivered through query parameter 'algorithm'
   * depending on algorithm, additional query params may be necessary
   */
  public getKlinesWithAlgorithm(req, res): void {
    const query = req.query;

    this.binanceController.getKlinesMultiple(query.symbol, query.times, query.timeframe)
      .then((response: any) => {
        let klinesWithSignals: Array<any> = [];

        switch(query.algorithm) {
          case 'momentum':
            klinesWithSignals = this.momentumController.setSignals(response, query.streak);
            break;
          case 'macd':
            klinesWithSignals = this.macdController.setSignals(response, query.fast, query.slow, query.signal);
            break;
          case 'rsi':
            klinesWithSignals = this.rsiController.setSignals(response, Number(query.length));
            break;
        }
        
        if (klinesWithSignals.length > 0) {
          res.send(klinesWithSignals);
        } else {
          res.send('Algorithm "' + query.algorithm + '" does not exist');
        }
      });
  }

  public postBacktestData(req, res): void {
    const performance = this.backtestController.calcBacktestPerformance(req.body, req.query.commission, req.query.type);
    res.send(performance);
  }

  public postTechnicalIndicator(req, res): void {
    const query = req.query;
    let indicatorChart: Array<any> = [];

    switch (query.indicator) {
      case 'rsi': indicatorChart = this.indicatorsController.rsi(req.body, Number(query.length)); break;
      case 'macd': indicatorChart = this.indicatorsController.macd(req.body, query.fast, query.slow, query.signal); break;
    }

    if (indicatorChart.length > 0) {
      res.send(indicatorChart);
    } else {
      res.send('Indicator "' + query.indicator + '" does not exist');
    }
  }
}