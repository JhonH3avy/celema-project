import { Injectable } from '@angular/core';
import { TblPrediccionRutaYTblRutaDto } from './model/tblPrediccionRutaYTblRutaDto';
import { BehaviorSubject, Observable } from 'rxjs';
import { InitialRoutePrioritizationRequest } from './model/initialRoutePrioritizationRequest';

@Injectable({
  providedIn: 'root'
})
export class PrioritizationService {

  private familyIds: number[] = [];
  private semana: string = '';

  saveRoutePlanificationsForPrioritization(familyIds: number[], semana: string): void {
    this.familyIds = familyIds;
    this.semana = semana;
  }

  getInitialRequestToPrioritizeRoutes(): InitialRoutePrioritizationRequest {
    return {
      familyIds: this.familyIds,
      semana: this.semana,
    };
  }
}
