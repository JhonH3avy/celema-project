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


export interface ActualizarProductosDto { 
    idProducto?: string | null;
    idFamilia?: number | null;
    nombre?: string | null;
    presentacion?: string | null;
    volumen?: string | null;
    fechaCreacion?: DateOnly;
    estado?: boolean | null;
}
