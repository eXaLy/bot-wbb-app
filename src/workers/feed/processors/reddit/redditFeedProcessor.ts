import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as https from 'https';
import { FeedProcessor } from '../../feedProcessor';
import { FeedConfigData } from '../../feedConfigData';
import logger from '../../../../utils/logger';
import { RedditFeedProcessorStorage } from './redditFeedProcessorStorage';
import { RedditItemData } from './redditItemData';

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
    return this.getResponse().pipe(
      map(data => this.parseData(data)),
      map(items => items.filter(item => !this.isUpToDate(item.createdTimestamp))),
      map(items => this.updateLastUpdate(items)),
      map(items => items.map(item => item.toDisplayString()),
    ));
  }

  private updateLastUpdate(items: RedditItemData[]) : RedditItemData[] {
    if (items.length > 0) {
      this.storage.setLastUpdate(items[0].createdTimestamp);
    }
    return items;
  }

  private parseData(body: string) : RedditItemData[] {
    const data = JSON.parse(body);

    const redditItems = [] as RedditItemData[];
    if (data && data.data && data.data.children) {
      const items = data.data.children;
      let i = 0;
      items.forEach((item) => {
        if (item.data && (this.config.allowedSources == null ||
            this.config.allowedSources.indexOf(item.data.domain) !== -1)) {

          const redditItem = new RedditItemData(item.data.created, item.data.title, item.data.url);
          redditItems.push(redditItem);
          i += 1;
        }
      });
    }
    return redditItems;
  }

  private isUpToDate(currentTimestamp: number) : boolean {
    const lastUpdate = this.storage.getLastUpdate();
    return currentTimestamp <= lastUpdate;
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
