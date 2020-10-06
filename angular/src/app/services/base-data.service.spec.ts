import { TestBed } from '@angular/core/testing';

import { BaseDataService } from './base-data.service';

describe('BaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseDataService = TestBed.inject(BaseDataService);
    expect(service).toBeTruthy();
  });
});
