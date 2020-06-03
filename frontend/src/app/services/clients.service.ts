import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Util} from "./util";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private configService: ConfigService,
              private util: Util,
              private http: HttpClient) {
  }

  /**
   * Просмотр реестра клиентов
   * @param search
   */
  getClientList(obj: any): Observable<any> {
    let params = new HttpParams();
    if (!this.util.isNullOrEmpty(obj.offset)) {
      params = params.append('offset', obj.offset);
    }
    if (!this.util.isNullOrEmpty(obj.page)) {
      params = params.append('page', obj.page);
    }
    if (!this.util.isNullOrEmpty(obj.size)) {
      params = params.append('size', obj.size);
    }
    if (!this.util.isNullOrEmpty(obj.paged)) {
      params = params.append('paged', obj.paged);
    }
    if (!this.util.isNullOrEmpty(obj.sort)&&!this.util.isNullOrEmpty(obj.sort.sorted)) {
      params = params.append('sort.sorted', obj.sort.sorted);
    }
    if (!this.util.isNullOrEmpty(obj.sort)&&!this.util.isNullOrEmpty(obj.sort.unsorted)) {
      params = params.append('sort.unsorted', obj.sort.unsorted);
    }
    if (!this.util.isNullOrEmpty(obj.text)) {
      params = params.append('text', obj.text);
    }
    if (!this.util.isNullOrEmpty(obj.unpaged)) {
      params = params.append('unpaged', obj.unpaged);
    }
    return this.http.get<any>(`${this.configService.apiViewManagerUrl}/register/getClientList`, {params});
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/profile-client/` + id);
  }

  updateClientById(form: any): Observable<any> {
    return this.http.put<any>(`${this.configService.apiUserManagerUrl}/api/profile-client/crm`, form);
  }

  findClientByPhoneNumber(phoneNumber): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/search/by-phone-number?phoneNumber=` + phoneNumber);
  }

}
