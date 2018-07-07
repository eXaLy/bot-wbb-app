import { Bot } from 'bot';
import { MessageData } from '../data/messageData';

export class ListenToReply {

  constructor(bot: Bot) {
    this.initData();
    bot.messages.subscribe({
      next: data => bot.reply(new MessageData(data.userId, data.channelId, this.ask(data.message))),
    });
  }

  private initData() : void {
    // TODO
  }

  private ask(message: string) : string {
    return message + ' haha';
  }
}
