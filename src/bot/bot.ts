import * as discord from 'discord.io';
import logger from '../utils/logger';
import { Observable, Subject } from 'rxjs';
import { MessageData } from './messageData';
import { TokenStorage } from './tokenStorage';

const TAG = '[BOT]';

export class Bot {

  private tokenStorage: TokenStorage;
  private bot: discord.Client;
  private messagesSubject = new Subject<MessageData>();

  public messages = new Observable<MessageData>((observer) => {
    this.messagesSubject.subscribe({
      next: msg => observer.next(msg),
    });
  });

  constructor(tokenStorage: TokenStorage) {
    this.tokenStorage = tokenStorage;
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

  private initialiseBot() : void {
    const config = {
      token: this.tokenStorage.getToken(),
      autorun: true,
    };

    this.bot = new discord.Client(config);

    this.bot.on('ready', (evt) : void => {
      logger.info(TAG + ' Connected');
      logger.info(TAG + ' Logged in as: ' + this.bot.username + ' - (' + this.bot.id + ')');
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
  }
}
