export * from './equiposRuta.service';
import { EquiposRutaService } from './equiposRuta.service';
export * from './familiasProductos.service';
import { FamiliasProductosService } from './familiasProductos.service';
export * from './lineas.service';
import { LineasService } from './lineas.service';
export * from './maquinas.service';
import { MaquinasService } from './maquinas.service';
export * from './planeacionProduccion.service';
import { PlaneacionProduccionService } from './planeacionProduccion.service';
export * from './producto.service';
import { ProductoService } from './producto.service';
export * from './restriccionLavados.service';
import { RestriccionLavadosService } from './restriccionLavados.service';
export * from './restriccionMaquinas.service';
import { RestriccionMaquinasService } from './restriccionMaquinas.service';
export * from './restriccionRutas.service';
import { RestriccionRutasService } from './restriccionRutas.service';
export * from './tipoMaquina.service';
import { TipoMaquinaService } from './tipoMaquina.service';
export * from './zona.service';
import { ZonaService } from './zona.service';
export const APIS = [EquiposRutaService, FamiliasProductosService, LineasService, MaquinasService, PlaneacionProduccionService, ProductoService, RestriccionLavadosService, RestriccionMaquinasService, RestriccionRutasService, TipoMaquinaService, ZonaService];
