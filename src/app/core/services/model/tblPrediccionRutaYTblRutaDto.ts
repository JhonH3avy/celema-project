/**
 * Mi API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TblPrediccionRutaYTblRutaDto { 
    id?: number;
    nombreRuta?: string | null;
    descripcion?: string | null;
    idFamilia?: number | null;
    nombreFamilia?: string | null;
    tipoRuta?: string | null;
    linea?: number;
    restriccion?: number | null;
    nombreRestriccion?: string | null;
    precision?: number | null;
    listaEquipos?: Array<string> | null;
    sugerencia?: boolean;
    mensaje?: string | null;
    seleccionado?: boolean;
}

