/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TblRestriccionEquipo } from './tblRestriccionEquipo';
import { TblSkufamilia } from './tblSkufamilia';


export interface TblRestriccionLavados { 
    idRestriccionLavados?: number;
    'descripción'?: string | null;
    estado?: boolean;
    fechaCreacion?: string;
    idFamilia?: number | null;
    tipoLavado?: string | null;
    frecuenciaLavado?: number | null;
    tiempoLavado?: number | null;
    prioridad?: number;
    idFamiliaNavigation?: TblSkufamilia;
    tblRestriccionEquipos?: Array<TblRestriccionEquipo> | null;
}
