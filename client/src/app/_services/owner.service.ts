import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_models/user';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Owner } from '../_models/owner';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  owners: Owner[] = [];

  getOwnersByUnitId(unitId: number): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.baseUrl + 'owner/getownersbyunitid/' + unitId);
  }

  getOwnerByOwnerId(ownerId: number): Observable<Owner> {
    return this.http.get<Owner>(this.baseUrl + 'owner/getownerbyownerid/' + ownerId);
  }

  deleteOwnerByOwnerId(ownerId: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'owner/deleteownerbyownerid/' + ownerId);
  }

  createUpdateOwner(model: any) {
    return this.http.post<Owner>(this.baseUrl + 'owner/createupdateowner', model).pipe(
      map(owner => {
        if (owner) {
        }
        else {
        }
      })
    )
  }
}

