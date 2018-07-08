import './utils/stringExt';
import { Bot } from './bot/bot';
import { ListenToReplyManager } from './workers/listenToReply/listenToReplyManager';
import { ListenToReplyProcessor } from './workers/listenToReply/listenToReplyProcessor';
import { SubscriptionManager } from './subscription/subscriptionManager';
import { FeedManager } from './workers/feed/feedManager';
import { FeedRunner } from './workers/feed/feedRunner';
import { RedditFeedProcessor } from './workers/feed/processors/reddit/redditFeedProcessor';
import { TokenStorage } from './bot/tokenStorage';
import { FileStorage } from './storage/fileStorage';
import { RedditFeedProcessorStorage }
  from './workers/feed/processors/reddit/redditFeedProcessorStorage';

class App {

  constructor() {

    const fileStorage = new FileStorage();
    const bot = new Bot(new TokenStorage(fileStorage));

    new ListenToReplyManager(bot, new ListenToReplyProcessor());

    new FeedManager(
      bot,
      new SubscriptionManager(bot, {
        key: 'soccer-feed',
        subscribeCommand: '!startsoccer',
        unsubscribeCommand: '!stopsoccer',
      }),
      new FeedRunner(new RedditFeedProcessor(
        {
          key: 'soccer-feed',
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
        new RedditFeedProcessorStorage(fileStorage),
      )),
    );
  }
}

export default new App();
