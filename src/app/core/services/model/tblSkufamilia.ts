/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TblSkumaestra } from './tblSkumaestra';
import { TblRestriccionLavados } from './tblRestriccionLavados';


export interface TblSkufamilia { 
    idFamilia?: number;
    nombreFamilia?: string | null;
    estado?: boolean;
    fechaCreacion?: string;
    tblRestriccionLavados?: Array<TblRestriccionLavados> | null;
    tblSkumaestras?: Array<TblSkumaestra> | null;
}
