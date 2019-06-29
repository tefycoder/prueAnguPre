import { Archivo } from "app/model/archivo";
export class Guia {
  constructor() {
    this.fechaemision = null;
    this.fechainiciotraslado = null;
    this.fechaprobablearribo = null;
    this.articulos = [];
    this.docadjuntos = [];
    this.nroguia = "";
    this.nroguia1 = "";
    this.nroguia2 = "";
  }
  id: string;
  idorgcompradora?: string;
  nroguia: string;
  nroguia1: string;
  nroguia2: string;
  rucproveedor: string;
  razonsocialproveedor: string;
  ruccliente: string;
  razonsocialcliente: string;
  fechaemision: Date;
  fechainiciotraslado: Date;
  fechaprobablearribo: Date;
  motivoguia: string;
  motivoguia_text?: string;
  observaciones: string;
  motivorechazosap: string;
  motivoerrorsap: string;
  tipodoctransporte: string;
  tipoguia?: string;
  tipodoctransporte_text?: string;
  rucdnitransporte: string;
  razonsocialnombretransporte: string;
  placatransporte: string;
  direcciontransporte: string;
  codigomtctransporte: string;
  tipotransporte: string;
  tipotransporte_text?: string;
  puntopartida: string;
  puntollegada: string;
  alamcendestino: string;
  totalbultos: string;
  totalvolumen: string;
  totalvolumenund: string;
  totalvolumenund_text?: string;
  totalpesobruto: string;
  totalpesobrutound: string;
  totalpesobrutound_text?: string;
  tara: string;
  totalpesoneto: string;
  nroerpdocmaterial: string;
  estado?: string;
  estado_text?: string;
  id_doc?: string;


  articulos: Articulo[];
  docadjuntos?: Archivo[];
}

export class Articulo {
  idoc?: string;
  nroitem: number;
  nrooc: string;
  nroitemoc: string;
  nroparte: string;
  codproducto: string;
  descproducto: string;
  preciounitario: string;
  preciototal: string;
  cantidadpedido?: string;//cantaceptadaorgcomp
  unidadmedida?: string;//unidadmedidaorgcomp
  cantidadatendida?: string;
  precioitemoc?: string;
  subtotalitemoc?: string;
  subtotalitemguia?: string;
  cantidadrecibida?: string;
  cantidaddespachada?: string;
  unidadmedidadespacho?: string;
  pesoneto?: string;
  unidadmedidapesoneto?: string;
  IdTablaUnidad: string;
  IdRegistroUnidad: string;
  IdProdxGuia?: string;
  EjercicioGuia: string;
  IdProductoOrden?: string;
  destino?: string;
  estado: string;
  CodigoGuiaERP: string;
  NumeroMaterial: string;

  atributos?: Atributo[];
  desccorta?: string;
  constructor() {
    this.atributos = [];
  }

}
export class Atributo {

  nombre: string;
  operador: string;
  valor: string;
  unidad: string;
}

export class GuiaBuscar {
  id: number;
  nroguia: string;
  estado: string;
  proveedor: string;
  fechaemision: string;
  fechainiciotraslado: string;
  fechaprobablearribo: string;
  documentoerp: string;

}

export class GuiaFiltros {
  nroguia?: string;
  nrooc?: string;
  nroerp?: string;

  fechaemisioninicio?: Date;
  fechaemisionfin?: Date;
  estado?: string;

  publicada?: boolean;

}

export class ClienteFiltros {
  razonsocial?: string;
  ruccodigo?: string;
  ruc?: string;


}