import { Archivo } from "app/model/archivo";
export class Factura {
  constructor() {
    this.fechaemision = new Date();
    this.fechavencimiento = new Date();
    this.fecharecepcion = new Date();
    this.fecharegistro = new Date();
    this.fechapago = new Date();    
    this.docadjuntos = [];
    this.detallefactura=[];
    this.eshas = false;
    this.esguiamaterial = true;
    this.esfisico = true;
    this.importetotal='';
  }
  id: number;
  IdOrgCliente: number;
  esfisico: boolean;
  eselectronico: boolean;
  eshas: boolean=false;
  esguiamaterial: boolean=true;
  nocomprobantepago: string;
  nocomprobantepago1: string;
  nocomprobantepago2: string;
  cliente: string;
  ruccliente: string;
  razonsocialproveedor: string;
  rucproveedor: string;
  estado: string;
  estado_text?: string;
  estadocomprador?: string;
  fechaemision?: Date;
  guiasdespacho: string;
  ordencompraserviciocontrato: string;
  fechavencimiento?: Date;
  fecharecepcion?: Date;
  fecharegistro?: Date;
  documentoerp: string;
  formapago: string;
  moneda: string;
  motivorechazosap: string;
  motivoerrorsap: string;
  moneda_text?: string;
  bienserviciodetraccion: string;
  condicionpago: string;
  subtotal: string;
  igv: string;
  total: string;
  totaltexto: string;
  tipopago: string;
  tipodocumento?: string;
  tipodocumento_text?: string;
  nrodocumento: string;
  banco: string;
  fechapago: Date;
  monto: string;
  datospagomoneda: string;
  nrocheque: string;
  tipodescuento: string;
  nrocomprobante: string;
  dsctomonto: string;
  dsctomoneda: string;
  obscomprobantepago: string;
  obspagotipodescuento: string;
  obspagomonto: string;
  obspagomoneda: string;
  razonsocialcliente?: string;
  impuesto1?: string;
  impuesto2?: string;
  impuesto3?: string;
  importetotal?: string;
  importereferencial?: number;
  observaciones?: string;
  detallefactura?: DetalleFactura[];
  docadjuntos?: Archivo[];
  id_doc?: string;
  IdBorrador?:string;
}

export class DetalleFactura {
  IdGuia?: string;
  IdOc?: string;
  noitem: string;
  noguia: string;
  nooc: string;
  noitemoc: string;
  noparte: string;
  descproducto: string;
  preciounitreferencial: string;
  cantidad: string;
  importetotalitem: string;
  subtotalitemguia: string;
  IdProdxGuia: string;
  posicion: string;
  CodigoGuiaERP: string;
  EjercicioGuia: string;
  IdTablaUnidad: string;
  IdRegistroUnidad: string;
  unidadmedida?: string;
  estado?: string;
}

export class FacturaBuscar {
  id: number;
  nodocumentopago: string;
  cliente: string;
  tipodoc: string;
  formapago: string;
  importetotal: string;
  estado: string;
  fechaemision: string;
  fechaprogramadapago: string;
  fechapago: string;
  notas: string;
  documentoerp: string;
}

export class FacturaFiltros {

  nrocomprobantepago?: string;
  razonsocialproveedor?: string;
  rucproveedor?: string;
  razonsocialcliente?: string;
  ruccliente?: string;
  moneda?: string;
  estado?: string;
  fechaemisioninicio?: Date;
  fechaemisionfin?: Date;
  tipoemisionfisico?: boolean;
  tipoemisionelectronico?: boolean;
  publicada?:boolean;
}

export class ClienteFiltros {
  razonsocial?: string;
  ruccodigo?: string;
  ruc?: string;
}

export class GuiaFiltros {
  nroguia?: string;
  estado?: string;
  fechaemitidadesde?: Date;
  fechaemitidahasta?: Date;
}
