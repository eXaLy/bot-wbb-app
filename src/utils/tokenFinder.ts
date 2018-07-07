import logger from '../utils/logger';
import * as fs from 'fs';

const UTF8 = 'utf8';
const TOKEN_PATH = './token';

export function findToken() : string {
  try {
    return fs.readFileSync(TOKEN_PATH, UTF8);
  } catch (e) {
    logger.error('Token file not found in root [token]', e);
  }
}
