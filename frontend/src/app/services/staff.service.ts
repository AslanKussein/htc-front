import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {language} from "../../environments/language";
import {tap} from "rxjs/operators";
import {Util} from "./util";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private configService: ConfigService,
              private util: Util,
              private http: HttpClient) {
  }

  getUserList(search: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/users`, {params});
  }

  getUserById(obj): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/users/`+obj.id);
  }

  getUserInfo(obj): Observable<any> {
    let params = new HttpParams();
    if(!this.util.isNullOrEmpty(obj.group)){
      params = params.append('groupId',obj.group);
    }
    params = params.append('locale', String(language.language));
    if(!this.util.isNullOrEmpty(obj.roles)){
      params = params.append('roleId',obj.roles);
    }
    if(!this.util.isNullOrEmpty(obj.search)){
      params = params.append('value',obj.search);
    }
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/users/filter`,{params});
  }

  getRoleList(search: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiRoleManagerUrl}/roles`, {params});
  }

  getGroupList(search: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/groups`, {params});
  }

  public createUser(obj): Observable<any> {
    return this.http.post(`${this.configService.apiUserManagerUrl}/users`, obj)
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  public updateUserActiveById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/users/`+obj.id+`/active`,{isActive:obj.isActive} )
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  public updateUserRolesById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/users/`+obj.id+`/roles`,{roles:obj.roles} )
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  public updatePasswordById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/users/`+obj.id+`/pass`,{pass:obj.passNew} )
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

}
