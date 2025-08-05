import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import { environment } from '../../../environments/environment';
import {
  ILoadPosition,
  IPosition,
  IUpdatePosition,
} from '../interfaces/position.interface';

@Injectable({ providedIn: 'root' })
export class PositionService {
  apiUrl: string = environment.apiUrl;

  private path: string = 'positions';

  constructor(private http: HttpClient) {}

  getPositions(): Observable<IResponseCustom<ILoadPosition[]>> {
    return this.http.get<IResponseCustom<ILoadPosition[]>>(
      `${this.apiUrl}/${this.path}`,
      {
        withCredentials: true,
      }
    );
  }

  addPosition(position: IPosition): Observable<IResponseCustom<ILoadPosition>> {
    return this.http.post<IResponseCustom<ILoadPosition>>(
      `${this.apiUrl}/${this.path}`,
      position,
      {
        withCredentials: true,
      }
    );
  }

  updatePosition(
    position: IUpdatePosition
  ): Observable<IResponseCustom<ILoadPosition>> {
    return this.http.put<IResponseCustom<ILoadPosition>>(
      `${this.apiUrl}/${this.path}`,
      position,
      {
        withCredentials: true,
      }
    );
  }

  removePosition(positionId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(
      `${this.apiUrl}/${this.path}/${positionId}`,
      {
        withCredentials: true,
      }
    );
  }
}
