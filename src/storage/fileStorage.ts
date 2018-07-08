import * as fs from 'fs';

const UTF8 = 'utf8';
const DEFAULT_DIR_PATH = './wbb-storage';

export class FileStorage {

  public readFile(fileName: string) : string {
    const path = this.buildPath(fileName);
    if (fs.existsSync(path)) {
      return fs.readFileSync(path, UTF8);
    }
    return null;
  }

  public storeFile(fileName: string, data: string) : void {
    this.createDirIfNeeded();
    fs.writeFileSync(this.buildPath(fileName), data, UTF8);
  }

  private buildPath(fileName: string) : string {
    return DEFAULT_DIR_PATH + '/' + fileName;
  }

  private createDirIfNeeded() : void {
    if (!fs.existsSync(DEFAULT_DIR_PATH)) {
      fs.mkdirSync(DEFAULT_DIR_PATH);
    }
  }
}
