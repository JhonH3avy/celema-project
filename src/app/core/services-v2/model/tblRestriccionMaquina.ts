/**
 * Apis_Optimizacion
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DateOnly } from './dateOnly';


export interface TblRestriccionMaquina { 
    IdRestriccionMaquina?: number | null;
    IdMaquina?: string | null;
    IdFamilia?: number | null;
    Descripcion?: string | null;
    TipoRestriccion?: string | null;
    UnidadMedida?: string | null;
    Valor?: number | null;
    Prioridad?: number | null;
    Estado?: boolean | null;
    FechaCreacion?: DateOnly;
    familiaNombre?: string | null;
    nombreMaquina?: string | null;
    zonaNombre?: string | null;
    tipoMaquina?: string | null;
}
