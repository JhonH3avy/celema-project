/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TblRestriccionRutum } from './tblRestriccionRutum';
import { TblRestriccionEquipo } from './tblRestriccionEquipo';


export interface TblUnidadMedidum { 
    idUnidadMedida?: number;
    nombre?: string | null;
    tblRestriccionEquipos?: Array<TblRestriccionEquipo> | null;
    tblRestriccionRuta?: Array<TblRestriccionRutum> | null;
}
