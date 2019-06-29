import {Guia } from "app/model/guia";

  export class GuiaMS {
  GDUPLOADMQ: GDUPLOADMQ;
  id_doc?: string;
  guia?: Guia;
  recurso?: string;
  vc_numeroseguimiento?: string;
  session_id?: string;
}

export class GDUPLOADMQ{
  RucProveedor?: string;
  RazonSocialProveedor?: string;
  GuiaDespacho?: GuiaDespacho[];
}

export class GuiaDespacho{
  Estado?: string;
  IdTablaPeso?: string;
  IdRegistroPeso?: string;
  IdTablaVolumen?: string;
  IdRegistroVolumen?: string;
  IsoPeso?: string;
  IsoVolumen?: string;
  NumeroGuia?: string;
  RucCliente?: string;
  RazonSocialCliente?: string;
  FechaEmision?: string;
  FechaInicioTraslado?: string;
  FechaProbArribo?: string;
  IdTablaMotivoGuia?: string;
  IdRegistroMotivoGuia?: string;
  MotivoGuia?: string;
  Observaciones?: string;
  IdTablaTipDocTransportista?: string;
  IdRegistroTipDocTransportista?: string;
  TipDocTransportista?: string;
  NumDocTransportista?: string;
  RazonSocialTransportista?: string;
  PlacaoNave?: string;
  DirTransportista?: string;
  RegistroMTC?: string;
  IdTablaTipoTransporte?: string;
  IdRegistroTipoTransporte?: string;
  TipoTransporte?: string;
  PuntoPartida?: string;
  PuntoLlegada?: string;
  AlmacenDestino?: string;
  TotalBultos?: string;
  TotalVolumen?: string;
  TotalPesoBruto?: string;
  Tara?: string;
  TotalPesoNeto?: string;
  IdOrganizacionCreacion?: string;
  IdUsuarioCreacion?: string;
  IdOrganizacionCompradora?: string;
  IdOrganizacionProveedora?: string;
  TipoGuia?: string;
  ItemGuia: ItemGuia[];
  ArchivoAdjunto?: ArchivoAdjunto[];
  id_doc?: string;
}

export class ItemGuia{
  IdOc?: string;
  NumeroOrden?: string;
  NumeroParte?: string;
  DescripcionItem?: string;
  PesoNetoItem?: string;
  IdTablaunidadMedida?: string;
  IdRegistroUnidadMedida?: string;
  UnidadMedidaItem?: string;
  IdProductoxOc?: string;
  NumeroItem?: string;
  NumeroItemOC?: string;
  IdRegistroUnidadPeso?: string;
  UnidadPeso?: string;
  CantidadDespachada?: string;
  CantidadPedido?: string;
  Cantidadaf?: string;
  Destino?: string;
}

export class ArchivoAdjunto{
  Nombre?: string;
  Descripcion?: string;
  URL?: string;
}