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


export interface CrearMaquinaDto { 
    idMaquina?: string | null;
    idTipo?: number | null;
    idZona?: number | null;
    nombre?: string | null;
    personalRequeridoMaquina?: number | null;
    personalRequeridoEmbalaje?: number | null;
    estado?: boolean | null;
    fechaCreacion?: DateOnly;
}

