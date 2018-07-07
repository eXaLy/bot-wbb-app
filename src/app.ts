import './utils/stringExt';
import { Bot } from './bot/bot';
import { ListenToReplyManager } from './workers/listenToReply/listenToReplyManager';
import { ListenToReplyProcessor } from './workers/listenToReply/listenToReplyProcessor';
import { SoccerVideosFeedManager } from './workers/soccerVideosFeed/soccerVideosFeedManager';
import { SubscriptionManager } from './workers/subscription/subscriptionManager';
import { SoccerVideosFeedProcessor } from './workers/soccerVideosFeed/soccerVideosFeedProcessor';

class App {

  constructor() {

    const bot = new Bot();

    new ListenToReplyManager(bot, new ListenToReplyProcessor());

    new SoccerVideosFeedManager(
      bot,
      new SubscriptionManager(bot, 'soccer-feed', '!startsoccer', '!stopsoccer'),
      new SoccerVideosFeedProcessor(),
    );
  }
}

export default new App();
