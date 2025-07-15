import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Unit } from '../_models/unit';
import { environment } from '../../environments/environment';
import { UnitType } from '../_models/unittype';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  units: Unit[] = []

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl + 'unit/getallunits');
  }

  getUnitsByComplexId(complexId: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl + 'unit/getunitsbycomplexid/' + complexId);
  }

  getUnitByUnitId(unitId: string): Observable<Unit> {
     return this.http.get<Unit>(this.baseUrl + 'unit/getunitbyunitid/' + unitId);
   }

  deleteUnitByUnitId(unitId: string) {
    return this.http.delete<Unit>(this.baseUrl + 'unit/deleteunitbyunitid/' + unitId);
  }


  createUpdateUnit(model: any) {
    return this.http.post<Unit>(this.baseUrl + 'unit/createupdateunit', model).pipe(
      map(unit => {
        if (unit) {
        }
        else {
        }
      })
    )
  }

  getUnitTypes(): Observable<UnitType[]> {
    return this.http.get<UnitType[]>(this.baseUrl + 'unit/getunittypes');
  }

}


