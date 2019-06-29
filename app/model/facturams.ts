import {Factura as Factura2 } from "app/model/factura";
export class FacturaMS {
  FACUPLOADMQ: FACUPLOADMQ;
  factura?: Factura2;
  recurso?: string;
  vc_numeroseguimiento?: string;
  session_id?: string;
  id_doc?:string;
}

export class FACUPLOADMQ{
  IdUsrProveedor?: string;
  IdOrgProveedor?: string;
  RucProveedor?: string;
  RazonSocialProveedor?: string;
  DireccionProveedor?: string;
  Factura?: Factura[];
  
}

export class Factura{
  /*IdMoneda?: string;
  IdTipoDocumento?: string;
  TipoDocumento?: string;*/
  
  NumeroFactura?: string;
  NumeroGuia?: string;
  NumeroOC?: string;
  IdOrgCliente?: string;
  RucCliente?: string;
  RazonSocialCliente?: string;
  FechaRegistro?: string;
  FechaEnvio?: string;
  FechaEmision?: string;
  //FechaCreacion?: string;
  PlazoPago?: string;
  PeriodoPlazoPago?: string;
  CondicionPago?: string;
  SubTotal?: string;
  Impuesto1?: string;
  Impuesto2?: string;
  Impuesto3?: string;
  ImpuestoReferencial?: string;
  ImpuestoGVR?: string;
  Total?: string;
  Observaciones?: string;
  FechaVencimiento?: string;
  FechaRecepcion?: string;
  FechaPago?: string;
  FechaProgramadaPago?: string;
  TipoOperacion?: string;
  FormaPago?: string;
  DocumentoPago?: string;
  DocumentoERP?: string;
  PagoTipoDocumento?: string;
  PagoNroDocumento?: string;
  PagoMoneda?: string;
  Moneda?: string;
  PagoMontoPagado?: string;
  PagoBanco?: string;
  DctoTipoDocumento?: string;
  DctoNroDocumento?: string;
  DctoMoneda?: string;
  DctoMonto?: string;
  Almacen?: string;
  IdCierres?: string;
  Status?: string;
  IdTablaEstado?: string;
  IdRegistroEstadoProv?: string;
  IdRegistroEstadoComp?: string;
  ISOEstadoProv?: string;
  ISOEstadoComp?: string;
  Estado?: string;
  EstadoComprador?: string;
  CodigoERPProveedor?: string;
  CodigoSociedad?: string;
  IndicadorDetraccion?: string;
  CodigoBien?: string;
  DescripcionBien?: string;
  PorcentajeDetraccion?: string;
  IdCondicionPago?: string;
  DescripcionCondicionPago?: string;
  IndImpuesto?: string;
  TipoRegistro?: string;
  CodigoErp?: string;
  NumeroNota?: string;
  TipoNota?: string;
  Motivo?: string;
  Actividad?: string;
  PorcentajeImpuestoRetenido?: string;
  IdTablaMoneda?: string;
  IdRegistroMoneda?: string;
  IdTablaTipoComprobante?:string;
  IdRegistroTipoComprobante?:string;
  IdTablaTipoEmision?:string;
  IdRegistroTipoEmision?:string;
  TipoFactura?:string;
  IdBorrador?:string;
  /*Moneda?: string;
  TipoComprobante?: string;
  NroDocumentoPago?: string;
  LlaveERP?: string;*/
  ItemFactura?: ItemFactura[];
  ArchivoAdjunto?: ArchivoAdjunto[];
}

export class ItemFactura{
  NumGuiaItem?: string;
  NumeroItemOC?: string;
  IdGuia?: string;
  IdProdxGuia?: string;
  NumeroParte?: string;
  DescripcionItem?: string;
  CantidadItem?: string;
  UnidadMedidaItem?: string;
  PrecioUnitario?: string;
  PrecioTotal?: string;
  NumeroGuiaItem?: string;
  NumeroOcItem?: string;
  Posicion?: string;
  CodigoGuiaERP?: string;
  EjercicioGuia?: string;
  IdTablaUnidad? : string;
  IdRegistroUnidad? : string;
  DocumentoMaterial?: DocumentoMaterial[];
  
  //DocumentoMaterial?: string;
}

export class DocumentoMaterial{
  NumeroGuiaERP?: string;
  EjercicioGuiaERP?: string;
  PosicionGuiaERP?: string;
  CantidadGuiaERP?: string;
  SubTotalItemGuiaERP?: string;
}

export class ArchivoAdjunto{
  Nombre?: string;
  Descripcion?: string;
  URL?: string;
}