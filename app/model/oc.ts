export class OC {
  idoc: string;
  idusuariocomprador: string;
  n_usuariocomprador: string;
  numseguimiento: string;
  version: number;
  tipo: number;
  prioridad: string;
  fecharegistro: string;
  terminosentrega: string;
  consignatario: string;
  fechaenvio: string;
  paisembarque: string;
  regionembarque: string;
  condicionembarque: string;
  embarcador: string;
  embarqueparcial: number;
  puertodesembarque: string;
  polizaseguro: string;
  aduana: string;
  companiainspectora: string;
  num_inspeccion: string;
  autorizadopor: string;
  cargo: string;
  tiemporecordatorio: number;
  valortotal: number;
  otroscostos: number;
  valorventa: number;
  descuento: number;
  subtotal: number;
  fecha_autorizacion: string;
  moneda: number;
  preciofob: number;
  codigoalmacenenvio: string;
  lab: string;
  isc: number;
  flagorigen: number;
  codigousuariocreacion: string;
  fechahoracreacion: string;
  habilitado: number;
  vc_estadocomprador: string;
  vc_estadoproveedor: string;
  fechacreacion: string;
  tipotransporte: string;
  tasacambio: number;
  condicionpago: string;
  valorcondpago: number;
  codalmacenenvio: number;
  otrosimpuestos: number;
  idorgcompradora: string;
  idorgproveedora: string;
  impuestos: number;
  direccionfactura: string;
  numerorfq: string;
  numeroqt: string;
  versionqt: number;
  factura: string;
  tipocambio: number;
  rucproveedor: number;
  razonsocialproveedor: string;
  atenciona: string;
  emailcontacto: string;
  //comentariocomprador: string;
  descuentoporcentaje: number;
  impuestosporcentaje: number;
  logo: string;
  firma: string;
  flagocdirecta: number;
  in_requiereinspeccion: number;
  in_numeroap: number;
  fl_precioqt: number;
  tipooc: string;
  idorgpropietaria: string;
  ts_fechanotificacion: Date;
  //ts_fechacompromisoppto: string;
  vc_razonsocialcomprador: string;
  vc_creadopor: string;
  in_codigoproveedor: string;
  vc_grupocompra: string;
  ts_fechainiciocontrato: string;
  ts_fechafincontrato: string;
  /*vc_numeroexpedientesiaf: string;
  vc_tipocontratacion: string;
  vc_objetocontratacion: string;
  vc_descripcioncontratacion: string;
  vc_unidadessolicitantes: string;
  vc_unidadesinformantes: string;*/
  lista_archivoxoc: ListaArchivoxoc[];
  lista_atributoxoc: ListaAtributoxoc[];
  lista_prodxoc: ListaProdxoc[];
}

export class CambioEstado {
  estadoactual: string;
  accion: string;
}

export class ListaArchivoxoc{
  in_idarchivooc: string;
  vc_nombre: string;
  vc_ruta: string;
  vc_descripcion: string;
  in_codigousuariocreacion: number;
  in_habilitado: number;
}

export class ListaAtributoxoc{
  vc_nombreatributo: string;
  in_idatributo: string;
  vc_valorenviado: string;
  vc_mandatorio: string;
  vc_modificable: string;
  in_idunidad: number;
  in_codigousuariocreacion: number;
  in_habilitado: number;
}

export class ListaProdxoc{
  in_idproductoxoc: string;
  in_idproducto: string;
  vc_codigoproductoorg: string;
  in_tipoproducto: number;
  vc_descortapro: string;
  in_codigousuariocreacion: string;
  in_habilitado: number;
  vc_estadoprod: string;
  in_idorganizacion: string;
  in_posicion: number;
  ts_fechaentregaproducto: Date;
  fl_precioproducto: number;
  fl_cantidadproducto: number;
  fl_preciototalproducto: number;
  in_idunidadproducto: number;
  vc_posicion: string;
  in_idoc: string;
  in_idproductocat: number;
  in_idcategoria: number;
  ts_fechahoracreacion: Date;
  in_itemrequisicion: number;
  fl_cantidadproductopend: number;
  in_idprodb2m: number;
  in_idrequerimiento: number;
  in_posicionreq: number;
  fl_cantidadrecepcionada: number;
}
