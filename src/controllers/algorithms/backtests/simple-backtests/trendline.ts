import { Kline, Signal } from '../../../../interfaces';
import Base from '../../../base';
import Charting from '../../patterns/charting';

export default class Trendline extends Base {
  private charting = new Charting();

  public setSignals(klines: Kline[], algorithm: string): Kline[] {
    const klinesWithPP = this.charting.calcPivotPoints(klines, 10);
    console.log(klinesWithPP);
    return klines;
  }
}