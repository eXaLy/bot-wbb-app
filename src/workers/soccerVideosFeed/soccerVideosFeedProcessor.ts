import { Observable } from 'rxjs';
import logger from '../../utils/logger';

const TAG = '[SoccerVideosFeedProcessor]';

export class SoccerVideosFeedProcessor {

  constructor() {
  }

  public fetch() : Observable<string[]> {
    logger.info(TAG + ' Fetch latest data');
    return new Observable<string[]>((observer) => {
    });
  }
}
