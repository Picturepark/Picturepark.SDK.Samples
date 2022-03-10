import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ClientConfiguration } from '../models/client-configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config: ClientConfiguration;

  constructor(private http: HttpClient) {}

  public loadConfig(): Promise<boolean> {
    return this.http
      .get<ClientConfiguration>('/configuration/client')
      .pipe(
        map((result) => {
          this.config = result;
          return true;
        })
      )
      .toPromise();
  }
}

export function configFactory(config: ConfigService) {
  return () => config.loadConfig();
}
