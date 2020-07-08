import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  getObjects(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/open-api/realProperty/getRealPropertyList`, search);
  }

  getRealPropertyWithAppList(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/api/register/getRealPropertyWithAppList`, search);
  }

}
