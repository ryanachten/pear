/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RtcService } from './rtc.service';

describe('Service: Rtc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RtcService]
    });
  });

  it('should ...', inject([RtcService], (service: RtcService) => {
    expect(service).toBeTruthy();
  }));
});
