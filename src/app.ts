import { Bot } from './bot/bot';
import { ListenToReplyManager } from './workers/listenToReply/listenToReplyManager';
import { ListenToReplyProcessor } from './workers/listenToReply/listenToReplyProcessor';

class App {

  constructor() {
    const bot = new Bot();
    new ListenToReplyManager(bot, new ListenToReplyProcessor());
  }
}

export default new App();
