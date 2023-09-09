import axios from 'axios';
import Base from '../base';
import fs from 'fs';
import { join } from 'path';
import { StockInfo } from '../../interfaces';


export default class Nasdaq extends Base {
  public getStocksByMarketCap(cap: number): StockInfo[] {
    const stocks = this.readStocks();
    return stocks.filter(s => s.cap > cap);
  }

  // stocks #1 to #rank in market cap
  public getStocksByMarketCapRank(rank: number): StockInfo[] {
    const stocks = this.readStocks();
    stocks.sort((a, b) => a.cap - b.cap);
    return stocks.slice(-rank);
  }

  private readStocks(): StockInfo[] {
    const csvLines = fs.readFileSync('src/controllers/other-apis/nasdaq-all-stocks.csv', 'utf-8').split('\n');

    return csvLines.slice(1).map(l => {
      const columns = l.split(',');

      return {
        symbol: columns[0],
        cap: Number(columns[5]),
        country: columns[6],
        sector: columns[9]
      };
    });
  }
}