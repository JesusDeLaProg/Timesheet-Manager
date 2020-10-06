import { Injectable } from '@angular/core';
import { BaseDataService, IQueryOptions } from './base-data.service';
import {
  IViewPhase,
  ICrudResult,
  IViewActivity,
} from '../../../../types/viewmodels';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PhaseService extends BaseDataService<IViewPhase> {
  constructor(http: HttpClient) {
    super('phase', http);
  }

  getAllPopulated(options?: IQueryOptions) {
    return this.get<ICrudResult<IViewPhase<IViewActivity>[]>>(
      'populated',
      options
    );
  }
}
