import { FileStorage } from '../../../../storage/fileStorage';
import logger from '../../../../utils/logger';

const TAG = '[RedditFeedProcessorStorage]';
const KEY_LAST_UPDATE = 'reddit-feed-last-update';

export class RedditFeedProcessorStorage {

  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  public setLastUpdate(timestamp: number) : void {
    this.fileStorage.storeFile(KEY_LAST_UPDATE, timestamp.toString());
  }

  public getLastUpdate() : number {
    try {
      return +this.fileStorage.readFile(KEY_LAST_UPDATE);
    } catch (e) {
      logger.warning(TAG + ' Last update not found for: ' + KEY_LAST_UPDATE);
    }
    return 0;
  }
}
