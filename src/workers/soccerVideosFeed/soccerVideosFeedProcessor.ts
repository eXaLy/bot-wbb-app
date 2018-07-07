import { Observable, Subject } from 'rxjs';

export class SoccerVideosFeedProcessor {

  private feedSubject = new Subject<string>();

  public feed = new Observable<string>((observer) => {
    this.feedSubject.subscribe({
      next: text => observer.next(text),
    });
  });

  public start() : void {

  }

  public stop() : void {

  }
}
