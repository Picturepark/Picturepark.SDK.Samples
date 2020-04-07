import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppInfo } from '../models/app-info';

@Injectable({ providedIn: 'root' })
export class InfoService {
  constructor(private http: HttpClient) {}

  getAppInfo(): Observable<AppInfo> {
    const url_ = 'app/info';

    const options = { headers: new HttpHeaders() };

    return this.http.get<AppInfo>(url_, options);
  }
}
