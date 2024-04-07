import { Algorithm, Kline } from '../../../../interfaces';
import Base from '../../../base';
import Charting from '../../patterns/charting';

export default class TrendLine extends Base {
  private charting = new Charting();

  public setSignals(klines: Kline[], algorithm: Algorithm): Kline[] {
    this.charting.addPivotPoints(klines, 10, 10);
    this.charting.addTrendLines(klines, 70, 150);
    //console.log(klines);

    klines.forEach((kline, i) => {
      if (kline.chartData?.trendLines?.length) {
        //console.log(i, kline.chartData.trendlines[0])
      }
    })

    return klines;
  }
}