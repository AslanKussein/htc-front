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
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getRealPropertyList`, search);
  }

}
