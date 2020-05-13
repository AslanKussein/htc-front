import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';
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
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public getPhotoById(guid): Observable<any> {
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/api/download/` + guid, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
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
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public getResumePhoto(getPhotoById): Observable<any> {
    // let params = new HttpParams();
    // params = params.append('photoId', String(getPhotoById));

    return this.http.get<any>(`${this.configService.apiFileManagerUrl}//download/` + getPhotoById, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return throwError(
      error);
  }
}
