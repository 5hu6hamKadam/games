import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private nextKey = new BehaviorSubject<string>('');
  public nextKey$ = this.nextKey.asObservable();

  constructor(private logger: NGXLogger) {}

  public setNextKey(char: string) {
    this.logger.trace(
      'KeyboardService : setNextKey : entering with char',
      char
    );
    this.nextKey.next(char);
  }
}
