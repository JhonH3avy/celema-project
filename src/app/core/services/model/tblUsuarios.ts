/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TblIntentosDeLogin } from './tblIntentosDeLogin';
import { TblModulosUsuario } from './tblModulosUsuario';


export interface TblUsuarios { 
    id?: number;
    correoElectronico?: string | null;
    cedula?: number;
    nombre?: string | null;
    apellido?: string | null;
    cargo?: string | null;
    fechaIngreso?: string;
    ultimoAcceso?: string;
    clave?: string | null;
    activo?: boolean;
    foto?: string | null;
    tblModulosUsuarios?: Array<TblModulosUsuario> | null;
    intentosDeLogin?: Array<TblIntentosDeLogin> | null;
}

