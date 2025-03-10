/**
 * Mi API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { TblRolesPermiso } from "./tblRolesPermiso";


export interface TblModulos {
    idModulo?: number;
    nombreModulo?: string | null;
    fechaCreacion?: string;
    isCheck?: boolean;
    idPermisos?: Array<TblModulosAux> | null;
}

export interface TblModulosAux {
  idModulo?: number;
  nombre?: string | null;
  tblRolesPermisos?: Array<number> | null;
  isChecked: boolean
}
