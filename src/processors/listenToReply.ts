import { Bot } from 'bot';
import { MessageData } from '../data/messageData';
import * as messages from './listenToReplyMessages';

export class ListenToReply {

  constructor(bot: Bot) {
    bot.messages.subscribe({
      next: data => bot.reply(new MessageData(data.userId, data.channelId, this.ask(data.message))),
    });
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
