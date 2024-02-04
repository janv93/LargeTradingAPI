import { Kline, Signal } from '../../../../interfaces';
import Base from '../../../base';
import Charting from '../../patterns/charting';

export default class Trendline extends Base {
  private charting = new Charting();

  public setSignals(klines: Kline[], algorithm: string): Kline[] {
    this.charting.addPivotPoints(klines, 10, 10);
    this.charting.addTrendLines(klines, 70, 100);
    console.log(klines);

    return klines;
  }
}