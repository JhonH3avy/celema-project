/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DateOnly } from './dateOnly';


export interface CrearRestriccionMaquinaDto { 
    idMaquina?: string | null;
    idFamilia?: number | null;
    descripcion?: string | null;
    tipoRestriccion?: string | null;
    unidadMedida?: string | null;
    valor?: number;
    prioridad?: number;
    estado?: boolean | null;
    fechaCreacion?: DateOnly;
}

