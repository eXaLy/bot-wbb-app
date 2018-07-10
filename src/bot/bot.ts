import * as discord from 'discord.io';
import logger from '../utils/logger';
import { Observable, Subject } from 'rxjs';
import { MessageData } from './messageData';
import { ConfigHandler } from '../configuration/configHandler';

const TAG = '[BOT]';

export class Bot {

  private configHandler: ConfigHandler;
  private bot: discord.Client;
  private messagesSubject = new Subject<MessageData>();

  public messages = new Observable<MessageData>((observer) => {
    this.messagesSubject.subscribe({
      next: msg => observer.next(msg),
    });
  });

  constructor(configHandler: ConfigHandler) {
    this.configHandler = configHandler;
    this.initialiseBot();
  }

  public reply(data: MessageData) : void {
    if (data.message !== null) {
      this.bot.sendMessage({
        to: data.channelId,
        message: data.message,
      });
      logger.info(
        TAG + ' Replying on [' + data.channelId + '] with message: [' + data.message + ']',
      );
    }
  }

  private getToken() : string {
    const token = this.configHandler.getBotToken();
    if (token === null || token.length === 0) {
      logger.error(TAG + ' Token is missing! Please provide it by NPM config param.');
    }
    return token;
  }

  private initialiseBot() : void {
    const config = {
      token: this.getToken(),
      autorun: true,
    };

    this.bot = new discord.Client(config);

    this.bot.on('ready', (evt) : void => {
      logger.info(TAG + ' Connected');
      logger.info(TAG + ' Logged in as: ' + this.bot.username + ' - (' + this.bot.id + ')');
    });

    this.bot.on('disconnect', (errMsg, code) => {
      logger.error(TAG + ' Connection failed: ' + errMsg);
    });

    this.bot.on('message', (user: discord.User, userId: string, channelId: string,
                            message: string, event: Event) : void => {
      if (userId !== this.bot.id) {
        const data = new MessageData(userId, channelId, message);
        this.messagesSubject.next(data);
        logger.info(
          TAG + ' Input: channel [' + data.channelId + '] with message: [' + data.message + ']',
        );
      }
    });

    this.bot.connect();
  }
}
