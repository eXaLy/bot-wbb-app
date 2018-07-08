import { Observable, Subject, interval, from } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { FeedProcessor } from './feedProcessor';
import logger from '../../utils/logger';

const TAG = '[FeedRunner]';
const FIVE_SECONDS_IN_MILLIS = 5000;

export class FeedRunner {

  private processor: FeedProcessor;
  private feedSubject = new Subject<string>();
  private isEnabled = false;

  public feed = new Observable<string>((observer) => {
    this.feedSubject.subscribe({
      next: text => observer.next(text),
    });
  });

  constructor(processor: FeedProcessor) {
    this.processor = processor;
    this.initialiseRequestRunner();
  }

  public enable() : void {
    this.isEnabled = true;
  }

  public disable() : void {
    this.isEnabled = false;
  }

  private initialiseRequestRunner() : void {
    interval(FIVE_SECONDS_IN_MILLIS).pipe(
      filter(_ => this.isEnabled),
      flatMap(_ => this.processor.fetch()),
      flatMap(data => from(data)),
    )
    .subscribe({
      next: data => this.feedSubject.next(data),
      error: e => logger.error(TAG + ' Request failed', e),
    });
  }
}
