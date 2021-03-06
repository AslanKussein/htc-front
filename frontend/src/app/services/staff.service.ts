import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
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
    return this.http.post<any>(`${this.configService.apiUserManagerUrl}/api/users/list`, search);
  }

  getUserById(obj): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/users/` + obj.id);
  }
  getOrganizationById(obj): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/organizations/` + obj.id);
  }

  getUserInfo(obj): Observable<any> {
    let params = new HttpParams();
    if (!this.util.isNullOrEmpty(obj.group)) {
      params = params.append('groupId', obj.group);
    }
    if (!this.util.isNullOrEmpty(obj.organizationId)) {
      params = params.append('organizationId', obj.organizationId);
    }
    params = params.append('locale', String(language.language));
    if (!this.util.isNullOrEmpty(obj.roles)) {
      params = params.append('roleId', obj.roles);
    }
    if (!this.util.isNullOrEmpty(obj.search)) {
      params = params.append('value', obj.search);
    }
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/users/filter`, {params});
  }

  getRoleList(): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiRoleManagerUrl}/roles`, {params});
  }

  getOrganizationList(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/organizations/getAll`);
  }

  getGroupList(): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/groups`, {params});
  }

  public createUser(obj): Observable<any> {
    return this.http.post(`${this.configService.apiUserManagerUrl}/api/users`, obj)
      .pipe(
        tap(),
      );
  }

  public createOrganization(obj): Observable<any> {
    return this.http.post(`${this.configService.apiUserManagerUrl}/api/organizations`, obj)
      .pipe(
        tap(),
      );
  }

  public updateUserActiveById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/api/users/` + obj.id + `/active`, {isActive: obj.isActive})
      .pipe(
        tap(),
      );
  }
  public updateOrganization(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/api/organizations/` + obj.id, obj)
      .pipe(
        tap(),
      );
  }

  public deleteOrganization(id): Observable<any> {
    return this.http.delete<any>(`${this.configService.apiUserManagerUrl}/api/organizations/` + id, {})
      .pipe(
        tap(),
      );
  }

  public updateOrganizationById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/api/users/` + obj.id + `/organization`, {organizationId: obj.organizationId})
      .pipe(
        tap(),
      );
  }

  public updateUserRolesById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/api/users/` + obj.id + `/roles`, {roles: obj.roles})
      .pipe(
        tap(),
      );
  }


  public updateUserGroupById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/api/users/` + obj.id + `/group`, {groupId: obj.group})
      .pipe(
        tap(),
      );
  }


  public updatePasswordById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/api/users/` + obj.id + `/pass`, {pass: obj.passNew})
      .pipe(
        tap(),
      );
  }

}
