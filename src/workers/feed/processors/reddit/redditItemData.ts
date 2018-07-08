export class RedditItemData {
  createdTimestamp: number;
  title: string;
  url: string;

  constructor(createdTimestamp: number, title: string, url: string) {
    this.createdTimestamp = createdTimestamp;
    this.title = title;
    this.url = url;
  }

  public toDisplayString() : string {
    return this.title + '\n' + this.url;
  }
}
