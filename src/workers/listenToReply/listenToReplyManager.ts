import { Bot } from '../../bot/bot';
import { MessageData } from '../../bot/messageData';
import { ListenToReplyProcessor } from './listenToReplyProcessor';
import logger from '../../utils/logger';

const TAG = '[ListenToReplyManager]';

export class ListenToReplyManager {

  private bot: Bot;
  private processor: ListenToReplyProcessor;

  constructor(bot: Bot, processor: ListenToReplyProcessor) {
    this.bot = bot;
    this.processor = processor;
    this.listenToMessages();
  }

  private listenToMessages() : void {
    this.bot.messages.subscribe({
      next: data => this.onMessage(data),
    });
  }

  private onMessage(data: MessageData) : void {
    logger.info(TAG + ' Message in');
    const msg = this.processor.ask(data.message);
    if (msg !== null) {
      this.bot.reply(new MessageData(data.userId, data.channelId, msg));
    }
  }
}
