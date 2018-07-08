import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as https from 'https';
import { FeedProcessor } from '../../feedProcessor';
import { FeedConfigData } from '../../feedConfigData';
import logger from '../../../../utils/logger';
import { RedditFeedProcessorStorage } from './redditFeedProcessorStorage';

const TAG = '[RedditFeedProcessor]';

export class RedditFeedProcessor implements FeedProcessor {

  private config: FeedConfigData;
  private storage: RedditFeedProcessorStorage;

  constructor(config: FeedConfigData, storage: RedditFeedProcessorStorage) {
    this.config = config;
    this.storage = storage;
  }

  // override
  public fetch() : Observable<string[]> {
    return this.getResponse().pipe(map(data => this.findData(data)));
  }

  // TODO: FIX TIMESTAMP CHECKER + EXTRACT LOGIC
  private findData(body: string) : string[] {
    const data = JSON.parse(body);

    const sources = [] as string[];
    if (data && data.data && data.data.children) {
      const items = data.data.children;
      let i = 0;
      items.forEach((item) => {
        if (item.data && (this.config.allowedSources == null ||
            this.config.allowedSources.indexOf(item.data.domain) !== -1)) {

          if (!this.isUpToDate(item.data.created)) {
            if (i === 0) {
              this.storage.setLastUpdate(item.data.created);
            }

            logger.info(TAG + ' Found: ' + item.data.title);
            const source = item.data.title + '\n' + item.data.url;
            sources.push(source);
            i += 1;
          }
        }
      });
    }
    return sources;
  }

  private isUpToDate(currentTimestamp: string) : boolean {
    const lastUpdate = this.storage.getLastUpdate();
    return (lastUpdate !== null && currentTimestamp <= lastUpdate);
  }

  private getResponse() : Observable<string> {
    return new Observable<string>((observer) => {
      logger.info(TAG + ' Data requesting: ' + this.config.resourceLink);
      https.get(this.config.resourceLink, (res) => {
        let body = '';
        res.on('data', (d) => { body += d; });
        res.on('end', () => {
          logger.info(TAG + ' Data successful from: ' + this.config.resourceLink);
          observer.next(body);
          observer.complete();
        });
      }).on('error', (e) => {
        logger.error(TAG + ' Data request failed: ' + this.config.resourceLink);
        observer.error(e);
      });
    });
  }
}
