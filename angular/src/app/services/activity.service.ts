import { Injectable } from '@angular/core';
import { BaseDataService } from './base-data.service';
import { IViewActivity } from '../../../../types/viewmodels';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends BaseDataService<IViewActivity> {
  constructor(http: HttpClient) {
    super('activity', http);
  }
}
