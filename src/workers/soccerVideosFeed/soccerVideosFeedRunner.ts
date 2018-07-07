import { Observable, Subject, interval, from } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { SoccerVideosFeedProcessor } from './soccerVideosFeedProcessor';

const FIVE_SECONDS_IN_MILLIS = 5000;

export class SoccerVideosFeedRunner {

  private processor: SoccerVideosFeedProcessor;
  private feedSubject = new Subject<string>();
  private isEnabled = false;

  public feed = new Observable<string>((observer) => {
    this.feedSubject.subscribe({
      next: text => observer.next(text),
    });
  });

  constructor(processor: SoccerVideosFeedProcessor) {
    this.processor = processor;
    this.initialiseRequestRunner();
  }

  private initialiseRequestRunner() {
    interval(FIVE_SECONDS_IN_MILLIS).pipe(
      filter(_ => this.isEnabled),
      flatMap(_ => this.processor.fetch()),
      flatMap(data => from(data)),
    )
    .subscribe({
      next: data => this.feedSubject.next(data),
    });
  }

  public enable() : void {
    this.isEnabled = true;
  }

  public disable() : void {
    this.isEnabled = false;
  }
}
