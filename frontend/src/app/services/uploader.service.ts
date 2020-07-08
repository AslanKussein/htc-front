import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
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

    return this.http.post<any>(`${this.configService.apiFileManagerUrl}/api/upload`, uploadData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: any) => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  public getHeadersById(guid): Observable<any> {
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/api/download/` + guid, {
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
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/api/info/` + guid, {})
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
    return this.http.get<any>(`${this.configService.apiFileManagerUrl}/api/download/` + guid, {})
      .pipe(
        tap(),
      );
  }

  public getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
        break;
      case HttpEventType.Response:
        return this.apiResponse(event);
        break;
    }
  }

  public fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }

  public apiResponse(event) {
    return event.body;
  }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }
}
