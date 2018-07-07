import * as messages from './listenToReplyMessages';

export class ListenToReplyProcessor {

  public ask(message: string) : string {
    const msgs = messages.default;
    for (const msgIn in msgs) {
      if (msgs.hasOwnProperty(msgIn) && message.toLowerCase().indexOf(msgIn) > -1) {
        return msgs[msgIn];
      }
    }
    return null;
  }
}
