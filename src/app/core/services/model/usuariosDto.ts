/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RestriccionMaquinaModuloDto } from './restriccionMaquinaModuloDto';


export interface UsuariosDto { 
    id?: number;
    correoElectronico?: string | null;
    cedula?: number;
    nombre?: string | null;
    apellido?: string | null;
    cargo?: string | null;
    clave?: string | null;
    activo?: boolean;
    roles?: Array<number> | null;
    usuarioPermiso?: Array<RestriccionMaquinaModuloDto> | null;
}

