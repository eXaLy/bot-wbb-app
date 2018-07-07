import * as discord from 'discord.io';
import * as tokenFinder from './utils/tokenFinder';
import logger from './utils/logger';
import { Observable } from 'rxjs';
import { MessageData } from './data/messageData';

export class Bot {

  private bot: discord.Client;

  constructor() {
    this.initialiseBot();
  }

  private initialiseBot() : void {
    const config = {
      token: tokenFinder.findToken(),
      autorun: true,
    };

    this.bot = new discord.Client(config);
    this.bot.on('ready', (evt) : void => {
      logger.info('Connected');
      logger.info('Logged in as: ' + this.bot.username + ' - (' + this.bot.id + ')');
    });
  }

  public messages = new Observable<MessageData>((observer) => {
    this.bot.on('message', (user: discord.User, userId: string, channelId: string,
                            message: string, event: Event) : void => {
      if (userId !== this.bot.id) {
        const data = new MessageData(userId, channelId, message);
        observer.next(data);
      }
    });
  });

  public reply(data: MessageData) : void {
    this.bot.sendMessage({
      to: data.channelId,
      message: data.message,
    });
    logger.info('Replying on [' + data.channelId + '] with message: [' + data.message + ']');
  }
}
