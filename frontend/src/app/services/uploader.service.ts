import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {tap} from 'rxjs/internal/operators';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public uploadData(selectedFile: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);

    return this.http.post<any>(`${this.configService.apiFileManagerUrl}/api/upload`, uploadData)
      .pipe(
        tap(),
      );
  }

  public getHeadersById(guid): Observable<any> {
    console.log(guid)
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/download/` + guid, {
      observe: 'response'
    })
      .pipe(
        tap(),
      );
  }

  public getPhotoById(guid): Observable<any> {
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/api/download/` + guid, {})
      .pipe(
        tap(),
      );
  }

  public getFileInfoUsingGET(guid): Observable<any> {
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/info/` + guid, {})
      .pipe(
        tap(),
      );
  }

  /**
   * downloadPreview
   * @param guid
   * временно
   */
  public getPhotoByIdPreview(guid: string): Observable<string> {
    return this.http.get<string>(`${this.configService.apiFileManagerUrl}/api/download/${guid}/preview`).pipe(
      map((res) => res)
    )

  }

  public removePhotoById(guid): Observable<any> {
    return this.http.delete<any>(`${this.configService.apiFileManagerUrl}/api/delete/` + guid, {})
      .pipe(
        tap(),
      );
  }

  public getResumePhoto(guid): Observable<any> {
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}//download/` + guid, {})
      .pipe(
        tap(),
      );
  }
}
