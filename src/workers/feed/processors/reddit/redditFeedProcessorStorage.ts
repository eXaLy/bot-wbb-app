import { FileStorage } from '../../../../storage/fileStorage';

const KEY_LAST_UPDATE = 'reddit-feed-last-update';

export class RedditFeedProcessorStorage {

  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  public setLastUpdate(timestamp: string) : void {
    this.fileStorage.storeFile(KEY_LAST_UPDATE, timestamp);
  }

  public getLastUpdate() : string {
    return this.fileStorage.readFile(KEY_LAST_UPDATE);
  }
}
