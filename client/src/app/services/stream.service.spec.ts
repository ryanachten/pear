/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { StreamService } from "./stream.service";

describe("Service: Stream", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StreamService],
    });
  });

  it("should ...", inject([StreamService], (service: StreamService) => {
    expect(service).toBeTruthy();
  }));
});
