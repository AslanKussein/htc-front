import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * Просмотр реестра клиентов
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/profile`);
  }

  updateProfile(obj: any): Observable<any> {
    return this.http.put<any>(`${this.configService.apiUserManagerUrl}/api/profile`, obj);
  }

}
