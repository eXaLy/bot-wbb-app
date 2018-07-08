import { Observable } from 'rxjs';
import { FeedProcessor } from './feedProcessor';
import { FeedConfigData } from './feedConfigData';
import logger from '../../utils/logger';

const TAG = '[RedditFeedProcessor]';

export class RedditFeedProcessor implements FeedProcessor {

  private config: FeedConfigData;

  constructor(config: FeedConfigData) {
    this.config = config;
  }

  public fetch() : Observable<string[]> {
    logger.info(TAG + ' Fetch latest data');
    return new Observable<string[]>((observer) => {
    });
  }
}
