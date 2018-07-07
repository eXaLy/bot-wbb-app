import { Bot } from 'bot';
import { MessageData } from '../data/messageData';
import * as messages from './listenToReplyMessages';

export class ListenToReply {

  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
    bot.messages.subscribe({
      next: data => this.onMessage(data),
    });
  }

  private onMessage(data: MessageData) : void {
    const msg = this.ask(data.message);
    if (msg !== null) {
      this.bot.reply(new MessageData(data.userId, data.channelId, msg));
    }
  }

  private ask(message: string) : string {
    const msgs = messages.default;
    for (const msgIn in msgs) {
      if (msgs.hasOwnProperty(msgIn) && message.toLowerCase().indexOf(msgIn) > -1) {
        return msgs[msgIn];
      }
    }
    return null;
  }
}
