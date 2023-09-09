import axios from 'axios';
import { AlpacaResponse, Kline } from '../../interfaces';
import Base from '../base';
import database from '../../data/database';
import stateService from '../state-service';

export default class Alpaca extends Base {
  private database = database;
  private stateService = stateService;
  private klines: Kline[] = [];
  private rateLimitPerMinute = 200;

  public async getKlines(symbol: string, timeframe: string, startTime?: number, pageToken?: string): Promise<AlpacaResponse> {
    const baseUrl = 'https://data.alpaca.markets/v2/stocks/' + symbol + '/bars';

    const query = {
      timeframe: timeframe ? this.mapTimeframe(timeframe) : '1Minute',
      end: new Date(Date.now() - 15000000).toISOString(),
      adjustment: 'split'
    };

    if (startTime) {
      query['start'] = new Date(startTime).toISOString();
    }

    if (pageToken) {
      query['page_token'] = pageToken;
    }

    const klineUrl = this.createUrl(baseUrl, query);

    const options = {
      headers: {
        'APCA-API-KEY-ID': process.env.alpaca_api_key,
        'APCA-API-SECRET-KEY': process.env.alpaca_api_secret
      }
    };

    console.log('GET ' + klineUrl);

    try {
      await this.waitIfRateLimitReached();
      const res = await axios.get(klineUrl, options);
      const klines = this.mapKlines(symbol, timeframe, res.data.bars);
      return { nextPageToken: res.data.next_page_token, klines };
    } catch (err) {
      this.handleError(err);
      return { nextPageToken: '', klines: [] };
    }
  }

  /**
   * initialize database with klines from predefined start date until now
   * allows to cache already requested klines and only request recent klines
   */
  public async initKlinesDatabase(symbol: string, timeframe: string): Promise<Kline[]> {
    const startTime = this.calcStartTime(timeframe);

    try {
      const res = await this.database.getKlines(symbol, timeframe);

      if (!res || !res.length) {  // not in database yet
        const newKlines = await this.getKlinesFromStartUntilNow(symbol, startTime, timeframe);
        await this.database.writeKlines(newKlines);
        console.log('Database initialized with ' + newKlines.length + ' klines');
        console.log();
        return newKlines;
      } else {  // already in database
        const dbKlines = res;
        const lastKline = dbKlines[dbKlines.length - 1];
        const newStart = lastKline.times.open;

        const newKlines = await this.getKlinesFromStartUntilNow(symbol, newStart, timeframe);
        newKlines.shift();    // remove first kline, since it's the same as last of dbKlines
        console.log('Added ' + newKlines.length + ' new klines to database');
        console.log();
        await this.database.writeKlines(newKlines);
        const mergedKlines = dbKlines.concat(newKlines);
        return mergedKlines;
      }
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  /**
   * get klines from startTime until now
   */
  private async getKlinesFromStartUntilNow(symbol: string, startTime: number, timeframe: string): Promise<Kline[]> {
    let finalKlines: Kline[] = [];
    let pageToken: string | undefined;

    while (true) {
      const res = await this.getKlines(symbol, timeframe, startTime, pageToken);
      finalKlines.push(...res.klines);
      pageToken = res.nextPageToken;

      if (!pageToken) {
        break;
      }
    }

    console.log();
    console.log(`Received total of ${finalKlines.length} klines`);
    console.log(this.timestampsToDateRange(finalKlines[0].times.open, finalKlines[finalKlines.length - 1].times.open));
    console.log();

    finalKlines.sort((a, b) => a.times.open - b.times.open);
    return finalKlines;
}

  public async getAssets(): Promise<string[]> {
    let res;

    const options = {
      headers: {
        'APCA-API-KEY-ID': process.env.alpaca_api_key,
        'APCA-API-SECRET-KEY': process.env.alpaca_api_secret
      }
    };

    res = await axios.get('https://api.alpaca.markets/v2/assets', options);
    return res.data.map(s => s.symbol);
  }

  private mapKlines(symbol: string, timeframe: string, klines: any): Kline[] {
    return klines.map(k => {
      return {
        symbol,
        timeframe,
        times: {
          open: (new Date(k.t)).getTime()
        },
        prices: {
          open: k.o,
          high: k.h,
          low: k.l,
          close: k.c
        },
        volume: k.v,
        numberOfTrades: k.n
      };
    });
  }

  private mapTimeframe(timeframe: string): string {
    const amount = timeframe.replace(/\D/g, '');
    const unit = timeframe.replace(/[0-9]/g, '');

    switch (unit) {
      case 'm': return amount + 'Minute';
      case 'h': return amount + 'Hour';
      case 'd': return amount + 'Day';
      case 'w': return amount + 'Week';
      default: return 'incorrect timeframe';
    }
  }

  private async waitIfRateLimitReached(): Promise<void> {
    this.stateService.alpacaRequestsSentThisMinute++;

    // wait at rate limit
    if (this.stateService.alpacaRequestsSentThisMinute >= this.rateLimitPerMinute) {
      await this.sleep(60000);
      this.stateService.alpacaRequestsSentThisMinute = 0;
    }
    // continue
  }
}