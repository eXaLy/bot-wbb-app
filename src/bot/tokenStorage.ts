import { FileStorage } from '../storage/fileStorage';
import logger from '../utils/logger';

const TAG = '[TokenStorage]';
const KEY_TOKEN = 'bot-token';

export class TokenStorage {

  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  public getToken() : string {
    try {
      return this.fileStorage.readFile(KEY_TOKEN);
    } catch (e) {
      logger.error(TAG + ' Token file not found in storage, expected file name: ' + KEY_TOKEN, e);
    }
  }
}
