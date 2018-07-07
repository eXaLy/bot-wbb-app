export class MessageData {
  userId: string;
  channelId: string;
  message: string;

  constructor(userId: string, channelId: string, message: string) {
    this.userId = userId;
    this.channelId = channelId;
    this.message = message;
  }
}
