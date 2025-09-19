import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const MOBILE_BREAKPOINT = 768;

@Injectable({ providedIn: 'root' })
export class IsMobileService {
  private isMobile$ = new BehaviorSubject<boolean>(window.innerWidth < MOBILE_BREAKPOINT);

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          map(() => window.innerWidth < MOBILE_BREAKPOINT),
          startWith(window.innerWidth < MOBILE_BREAKPOINT)
        )
        .subscribe(value => this.ngZone.run(() => this.isMobile$.next(value)));
    });
  }

  get isMobile(): Observable<boolean> {
    return this.isMobile$.asObservable();
  }
}
