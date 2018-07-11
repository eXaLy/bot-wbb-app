import './utils/stringExt';
import { Bot } from './bot/bot';
import { ListenToReplyManager } from './workers/listenToReply/listenToReplyManager';
import { ListenToReplyProcessor } from './workers/listenToReply/listenToReplyProcessor';
import { SubscriptionManager } from './subscription/subscriptionManager';
import { FeedManager } from './workers/feed/feedManager';
import { FeedRunner } from './workers/feed/feedRunner';
import { RedditFeedProcessor } from './workers/feed/processors/reddit/redditFeedProcessor';
import { FileStorage } from './storage/fileStorage';
import { RedditFeedProcessorStorage }
  from './workers/feed/processors/reddit/redditFeedProcessorStorage';
import { ConfigHandler } from './configuration/configHandler';

const KEY_FOOTBALL_FEED = 'football-feed';

class App {

  constructor() {

    const fileStorage = new FileStorage();
    const configHandler = new ConfigHandler();
    const bot = new Bot(configHandler);

    new ListenToReplyManager(bot, new ListenToReplyProcessor());

    new FeedManager(
      bot,
      new SubscriptionManager(bot, {
        key: KEY_FOOTBALL_FEED,
        subscribeCommand: '!startfootball',
        unsubscribeCommand: '!stopfootball',
      }),
      new FeedRunner(new RedditFeedProcessor(
        {
          key: KEY_FOOTBALL_FEED,
          resourceLink: 'https://www.reddit.com/r/soccer/new/.json',
          allowedSources: [
            'streamja.com',
            'clippituser.tv',
            'streamgoals.com',
            'streamable.com',
            'u.nya.is',
            'my.mixtape.moe',
          ],
        },
        new RedditFeedProcessorStorage(fileStorage, KEY_FOOTBALL_FEED),
      )),
    );
  }
}

export default new App();
