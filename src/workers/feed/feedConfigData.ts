export class FeedConfigData {
  key: string;
  resourceLink: string;
  allowedSources?: string[];

  constructor(key: string, resourceLink: string, allowedSources?: string[]) {
    this.key = key;
    this.resourceLink = resourceLink;
    this.allowedSources = allowedSources;
  }
}
