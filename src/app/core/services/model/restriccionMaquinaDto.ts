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


export interface RestriccionMaquinaDto { 
    id?: number;
    idMaquina?: string | null;
    idFamilia?: number | null;
    descripcion?: string | null;
    tipoRestriccion?: string | null;
    unidadMedida?: string | null;
    valor?: number | null;
    prioridad?: number | null;
    estado?: boolean | null;
    fechaCreacion?: string | null;
    permisosRestriccionMaquina?: Array<RestriccionMaquinaModuloDto> | null;
}

