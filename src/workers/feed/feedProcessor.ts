import { Observable } from 'rxjs';

export interface FeedProcessor {
  fetch() : Observable<string[]>;
}
