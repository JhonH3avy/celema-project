import { InitialProductFamilyRoutePrioritizationRequest } from './model/initialProductFamilyRoutePrioritizationRequest';
import { Injectable } from '@angular/core';
import { TblPrediccionRutaYTblRutaDto } from './model/tblPrediccionRutaYTblRutaDto';
import { BehaviorSubject, Observable } from 'rxjs';
import { InitialRoutePrioritizationRequest } from './model/initialRoutePrioritizationRequest';

@Injectable({
  providedIn: 'root'
})
export class PrioritizationService {

  private familyAndRouteIds: {familyId: number, routeId: number}[] = [];
  private semana: string = '';

  saveRoutePlanificationsForPrioritization(familyAndRouteIds: {familyId: number, routeId: number}[], semana: string): void {
    this.familyAndRouteIds = familyAndRouteIds;
    this.semana = semana;
  }

  getInitialRequestToPrioritizeRoutes(): InitialRoutePrioritizationRequest {
    return {
      productFamilyRoutePrioritizations: this.familyAndRouteIds.map(x => {
        return {
          familyId: x.familyId,
          routeId: x.routeId,
        } as InitialProductFamilyRoutePrioritizationRequest;
      }),
      semana: this.semana,
    };
  }
}
