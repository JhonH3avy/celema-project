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


export interface TblProducto { 
    IdProducto?: string | null;
    IdFamilia?: number | null;
    Nombre?: string | null;
    Presentacion?: string | null;
    Volumen?: string | null;
    FechaCreacion?: DateOnly;
    Estado?: boolean | null;
    nombreFamilia?: string | null;
}
