/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TblRolesPermiso } from './tblRolesPermiso';


export interface TblModulo { 
    id?: number;
    nombreModulo?: string | null;
    fechaCreacion?: string;
    tblRolesPermisos?: Array<TblRolesPermiso> | null;
}

