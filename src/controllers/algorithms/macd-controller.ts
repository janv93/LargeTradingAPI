import IndicatorsController from '../technical-analysis/indicators-controller';
import { BinanceKline } from '../../interfaces';
import BaseController from '../base-controller';

export default class MacdController extends BaseController {
  private indicatorsController: IndicatorsController;

  constructor() {
    super();
    this.indicatorsController = new IndicatorsController();
  }

  public setSignals(klines: Array<BinanceKline>, fast: string, slow: string, signal: string): Array<BinanceKline> {
    const histogram = this.indicatorsController.macd(klines, fast, slow, signal);
    const klinesWithHistogram = klines.slice(-histogram.length);
    this.findOptimalEntry(klinesWithHistogram, histogram);

    let lastHistogram: number;
    let lastMove: string;
    let sumHighs = 0;
    let peakHigh = 0;
    let numberHighs = 0;
    let sumLows = 0;
    let peakLow = 0;
    let numberLows = 0;
    let positionOpen = false;
    let positionOpenType: string;

    klinesWithHistogram.forEach((kline, index) => {
      const h = histogram[index].histogram;

      if (!lastHistogram) {
        lastHistogram = h;
        return;
      }

      if (!lastMove) {
        lastMove = h - lastHistogram > 0 ? 'up' : 'down';
      }

      const move = h - lastHistogram > 0 ? 'up' : 'down';
      const momentumSwitch = move !== lastMove;

      // buy when macd h. is decreasing at high value or increasing at low value, sell when macd h. hits 0
      if (momentumSwitch) {
        if (!positionOpen) {
          if (move === 'down' && h > 0) {
            sumHighs += h;
            numberHighs++;
            peakHigh = h > peakHigh ? h : peakHigh;
            const averageHigh = sumHighs / numberHighs;

            if (h > (averageHigh + peakHigh) / 2) {
              kline.signal = this.sellSignal;
              positionOpen = true;
              positionOpenType = this.sellSignal;
            }
          } else if (move === 'up' && h < 0) {
            sumLows += h;
            numberLows++;
            peakLow = h > peakLow ? h : peakLow;
            const averageLow = sumLows / numberLows;

            if (h < (averageLow + peakLow) / 2) {
              kline.signal = this.buySignal;
              positionOpen = true;
              positionOpenType = this.buySignal;
            }
          }
        } else {
          if ((positionOpenType === this.sellSignal && h < 0) || (positionOpenType === this.buySignal && h > 0)) {
            kline.signal = this.closeSignal;
            positionOpen = false;
          }
        }
      }

      lastHistogram = h;
      lastMove = move;
    });

    return klines;
  }

  /**
   * test different macd h. strategies
   */
  private findOptimalEntry(klines: Array<BinanceKline>, histogram: Array<any>) {
    let lastHistogram: number;
    let lastMove: string;
    let sumDiffs = 0.0;
    let numberDiffs = 0.0;

    klines.forEach((kline, index) => {
      const h = histogram[index].histogram;
      const currentPrice = Number(kline.prices.close);

      if (!lastHistogram) {
        lastHistogram = h;
        return;
      }

      if (!lastMove) {
        lastMove = h - lastHistogram > 0 ? 'up' : 'down';
      }

      const move = h - lastHistogram > 0 ? 'up' : 'down';
      const momentumSwitch = move !== lastMove;

      const kline5Steps = klines[index + 20];
      const price5Steps = kline5Steps ? Number(kline5Steps.prices.close) : null;

      if (momentumSwitch && move === 'up') {
        if (price5Steps) {
          const priceDiff = price5Steps - currentPrice;
          sumDiffs += priceDiff;
          numberDiffs++;
        }
      }
    });

    const averageDiff = sumDiffs / numberDiffs;
    console.log(averageDiff);
  }


}