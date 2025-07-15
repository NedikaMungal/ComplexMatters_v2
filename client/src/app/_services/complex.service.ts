import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_models/user';
import { Complex } from '../_models/complex';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplexService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  complexes: Complex[] = [];

  getComplexByComplexId(complexId: string): Observable<Complex> {
    return this.http.get<Complex>(this.baseUrl + 'complex/getcomplexbycomplexid/' + complexId);
  }

  getAllComplexes(): Observable<Complex[]> {
    return this.http.get<Complex[]>(this.baseUrl + 'complex/getallcomplexes');
  }

  createUpdate(model: any) {
    return this.http.post<Complex>(this.baseUrl + 'complex/createupdate', model).pipe(
      map(complex => {
        if (complex) {
        }
        else {
        }
      })


    )
  }

  deleteComplexByComplexId(complexId: number): Observable<any> {
    const url = this.baseUrl + 'complex/deletecomplexbycomplexid/' + complexId;
    return this.http.delete(url);
  }



}

