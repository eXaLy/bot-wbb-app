import { Observable } from 'rxjs';
import logger from '../../utils/logger';

const TAG = '[FeedProcessor]';

export class FeedProcessor {

  constructor() {
  }

  public fetch() : Observable<string[]> {
    logger.info(TAG + ' Fetch latest data');
    return new Observable<string[]>((observer) => {
    });
  }
}
