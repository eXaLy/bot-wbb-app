import { FileStorage } from '../../../../storage/fileStorage';
import logger from '../../../../utils/logger';

const TAG = '[RedditFeedProcessorStorage]';
const KEY_LAST_UPDATE = 'reddit-feed-last-update';

export class RedditFeedProcessorStorage {

  private storageKey: string;
  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage, key: string) {
    this.storageKey = KEY_LAST_UPDATE + '-' + key;
    this.fileStorage = fileStorage;
  }

  public setLastUpdate(timestamp: number) : void {
    logger.info(TAG + ' Storing: ' + this.storageKey + ' with: ' + timestamp);
    this.fileStorage.storeFile(this.storageKey, timestamp.toString());
  }

  public getLastUpdate() : number {
    logger.info(TAG + ' Getting: ' + this.storageKey);
    try {
      let lastUpdate = this.fileStorage.readFile(this.storageKey);
      if (lastUpdate === null) {
        lastUpdate = '0';
      }
      return Number(lastUpdate);
    } catch (e) {
      logger.warning(TAG + ' Something went wrong requesting: ' + this.storageKey);
    }
    return 0;
  }
}
