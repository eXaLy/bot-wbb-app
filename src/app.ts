import { Bot } from './bot';
import { ListenToReply } from './processors/listenToReply';

class App {

  constructor() {
    const bot = new Bot();
    new ListenToReply(bot);
  }
}

export default new App();
