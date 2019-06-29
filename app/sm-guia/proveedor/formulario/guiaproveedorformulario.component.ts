import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { DetalleOrdenCompra } from "app/model/detalleordencompra";
import { BuscarOrdenCompra } from "app/model/buscarordencompra";
import { ClienteBuscar } from "app/model/cliente";
import { Guia, Articulo, ClienteFiltros } from "app/model/guia";
import { Archivo } from "app/model/archivo";
import { MasterService } from '../../../service/masterservice';
import { GuiaService } from "app/service/guiaservice";
import { OrdenCompraService } from "app/service/ordencompraservice";
import { AdjuntoService } from "app/service/adjuntoservice";

import { OrdenCompraFiltros, Producto } from '../../../model/ordencompra';

import { AppUtils } from "../../../utils/app.utils";
import { ComboItem } from "app/model/comboitem";
import '../../../../assets/js/plugins/jquery.PrintArea.js';
import { URL_BUSCAR_OC, URL_BUSCAR_ORGANIZACION } from 'app/utils/app.constants';
import { LoginService } from '../../../service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var moment, swal, saveAs: any;
declare var $: any;
declare var DatatableFunctions: any;
var oGuiaProveedorFormularioComponent: GuiaProveedorFormularioComponent, dtAtributos, datatable, dtArticulos, datatableOC, dtArchivos, archivo: Archivo;

@Component({
  moduleId: module.id,
  selector: 'guiaproveedorformulario-cmp',
  templateUrl: 'guiaproveedorformulario.component.html',
  providers: [AdjuntoService, OrdenCompraService, GuiaService, MasterService, LoginService]
})

export class GuiaProveedorFormularioComponent implements OnInit, OnChanges, AfterViewInit {

  util: AppUtils;
  public id: string = '0';
  public esBorrador: string = '0';
  public id_doc: string = '';
  public toggleButton: boolean = true;
  public ProgressUpload: boolean = false;

  private activatedRoute: ActivatedRoute;
  public guia: Guia;
  public guiaOriginal: Guia;
  public filtrooc: OrdenCompraFiltros;

  public listMotivoGuiaCombo: ComboItem[];
  public listTransporteGuiaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listUnidadMedidaPesoCombo: ComboItem[];
  public listTipoDocIdentidad: ComboItem[];

  public listEstadoCombo: ComboItem[];
  public listEstadoOCCombo: ComboItem[];

  public archivo: Archivo;
  public btnSeleccionar: boolean = false;

  public filtroCliente: ClienteFiltros;
  public producto: Articulo;
  public baseurl: string;
  public botonImprimir: Boton = new Boton();
  public botonEdicion: Boton = new Boton();
  public botonDescartar: Boton = new Boton();
  public botonGuardar: Boton = new Boton();
  public botonEnviar: Boton = new Boton();

  public url_main_module_page = '/sm-guia/proveedor/buscar';
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }


  constructor(activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataServiceAdjunto: AdjuntoService, private _dataService: GuiaService, private _dataServiceOC: OrdenCompraService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
    this.filtroOCDefecto();
    this.filtroClienteDefecto();
    this.activatedRoute = activatedRoute;
    this.util = new AppUtils(this.router, this._masterService);
    this.guia = new Guia();
    this.guiaOriginal = new Guia();
    this.archivo = new Archivo();
    this.producto = new Articulo();
    this.baseurl = $("#baseurl").attr("href");
  }


  obtenerBotones() {

    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {
      console.log('ObtenerBotonesCache', botones);
      this.configurarBotones(botones);
    }
    else {

      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {
          console.log('obtenerBotones', botones);
          oGuiaProveedorFormularioComponent.configurarBotones(botones);
          oGuiaProveedorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { });

    }

  }


  configurarBotones(botones: Boton[]) {
    if (botones && botones.length > 0) {
      this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;
      this.botonDescartar = botones.find(a => a.nombre === 'descartarborrador') ? botones.find(a => a.nombre === 'descartarborrador') : this.botonDescartar;
      this.botonEdicion = botones.find(a => a.nombre === 'habilitaredicion') ? botones.find(a => a.nombre === 'habilitaredicion') : this.botonEdicion;
      this.botonEnviar = botones.find(a => a.nombre === 'enviar') ? botones.find(a => a.nombre === 'enviar') : this.botonEnviar;
      this.botonGuardar = botones.find(a => a.nombre === 'guardar') ? botones.find(a => a.nombre === 'guardar') : this.botonGuardar;
    }
  }



  print(event): void {
    oGuiaProveedorFormularioComponent.guia.motivoguia_text = $("#motivoguia option:selected").text();
    oGuiaProveedorFormularioComponent.guia.estado_text = $("#estado option:selected").text();
    oGuiaProveedorFormularioComponent.guia.tipodoctransporte_text = $("#tipodoctransporte option:selected").text();
    oGuiaProveedorFormularioComponent.guia.tipotransporte_text = $("#tipotransporte option:selected").text();

    oGuiaProveedorFormularioComponent.guia.totalvolumenund_text = $("#totalvolumenund option:selected").text();
    oGuiaProveedorFormularioComponent.guia.totalpesobrutound_text = $("#totalpesobrutound option:selected").text();

    setTimeout(function () {
      $("div#print-section-guia").printArea({ popTitle: 'GUIA', mode: "iframe", popClose: false });
    }, 200);
  }


  async validardatos(e, enviar = false) {
    if (this.guia.nroguia.trim() == "" || this.guia.nroguia.trim() == "-") {
      swal({
        text: "Nro. Guia es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.nroguia1.trim() == "") {
      swal({
        text: "Debe completar la serie del Nro. de Guía.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.nroguia2.trim() == "") {
      swal({
        text: "Debe completar el correlativo del Nro. de Guía.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    let regex = /^[0-9]+$/i;
    let str = this.guia.nroguia1.trim() + this.guia.nroguia2.trim();

    if (!regex.test(str)) {
      swal({
        text: "Nro. Guia solo puede contener caracteres numéricos",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (this.guia.razonsocialcliente == null || this.guia.razonsocialcliente.trim() == "") {
      swal({
        text: "Organización Compradora es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.ruccliente == null || this.guia.ruccliente.trim() == "") {
      swal({
        text: "RUC Organización Compradora es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.motivoguia == null || this.guia.motivoguia.trim() == "") {
      swal({
        text: "Motivo Guia es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.fechaemision == null || this.guia.fechaemision.toString() == "") {
      swal({
        text: "Fecha Emisión es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.fechainiciotraslado == null || this.guia.fechainiciotraslado.toString() == "") {
      swal({
        text: "Fecha Traslado es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    if (this.guia.fechaprobablearribo == null || this.guia.fechaprobablearribo.toString() == "") {
      swal({
        text: "Fecha Probable Arribo es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }


    let fechaemision = DatatableFunctions.ConvertStringToDatetime(this.guia.fechaemision);
    let fechainiciotraslado = DatatableFunctions.ConvertStringToDatetime(this.guia.fechainiciotraslado);
    let fechaprobablearribo = DatatableFunctions.ConvertStringToDatetime(this.guia.fechaprobablearribo);

    if (fechaemision > fechainiciotraslado) {
      swal({
        text: 'La Fecha de Emisión debe ser menor a la Fecha de Inicio de Traslado.',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (fechainiciotraslado > fechaprobablearribo) {
      swal({
        text: 'La Fecha de Inicio de Traslado debe ser menor a la Fecha Probable de Arribo.',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (this.guia.articulos == null || this.guia.articulos.length == 0) {
      swal({
        text: "Al menos un ítem es requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    if (enviar) {
      for (let articulo of this.guia.articulos) {  
        //articulo.cantidaddespachada=articulo.cantidadpedido;
        
        if (articulo.cantidaddespachada == null || (articulo.cantidaddespachada.toString().trim() == "")) {
          swal({
            text: "El campo Cantidad Despachada es requerido. Por favor revisar el N° Item " + articulo.nroitem.toString(),
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });

          return false;
        }

        if (parseInt(articulo.cantidaddespachada).toString()=='NaN') {
          swal({
            text: "El campo Cantidad Despachada debe contener un valor válido. Por favor revisar el N° Item " + articulo.nroitem.toString(),
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });

          return false;
        }

        if ( (parseInt(articulo.cantidaddespachada)<1) || (parseInt(articulo.cantidaddespachada) > (parseInt(articulo.cantidadpedido) - parseInt(articulo.cantidadrecibida)) ) ){
          swal({
            text: "El valor del campo Cantidad Despachada debe ser mayor a cero y menor o igual a la resta de los campos Cantidad del Pedido y Cantidad Recibida. Por favor revisar el N° Item " + articulo.nroitem.toString(),
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });

          return false;
        }
                
        if (articulo.estado == "Despachada") {
          swal({
            text: "Eliminar los ítems que ya fueron despachados.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });

          return false;

        }
      }
      let guias = await this._dataService
        .verificar_duplicados(this.guia.nroguia, localStorage.getItem('org_id'), this.guia.idorgcompradora).toPromise();

      if (Number(guias.recordsTotal) > 0) {
        oGuiaProveedorFormularioComponent.toggleButton = false;
        swal({
          text: "El número de guía ya existe.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        }).then(function () {

          $("#nroguia1").focus();
        });

        return false;
      }

    }

    return true;
  }

  async enviarGuia(e) {
    this.toggleButton = true;
    this.guia.nroguia = this.guia.nroguia1 + "-" + this.guia.nroguia2;
    this.guia.estado = "GPUBL";

    if (await this.validardatos(e, true)) {

      this._dataService
        .agregar(this.guia)
        .subscribe(
        p => {
          swal({
            text: 'La información ha sido enviada. Confirme el correcto registro de la misma verificando el Número ERP en la columna correspondiente. Espere dicho número para la impresión de su constancia.',
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success"
          });

          let nav = ['/sm-guia/proveedor/buscar'];
          oGuiaProveedorFormularioComponent.navigate(nav);

        },
        e => {
          this.toggleButton = false;
          console.log(e);
        },
        () => { });
    }
    else {
      this.toggleButton = false;
    }
  }


  async guardarGuia(e) {
    this.toggleButton = true;
    this.guia.nroguia = this.guia.nroguia1 + "-" + this.guia.nroguia2;
    this.guia.estado = "GPREI";
    if (await this.validardatos(e, false)) {
      this._dataService
        .guardar(this.guia)
        .subscribe(
        p => {

          swal({
            text: "La información ha sido guardada. Confirme el correcto registro de la misma verificando el N° Guía en la columna correspondiente.",
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success"
          });
          let nav = ['/sm-guia/proveedor/buscar'];
          oGuiaProveedorFormularioComponent.navigate(nav);

        },
        e => {
          this.toggleButton = false;
          console.log(e);
        },
        () => { });
    }
    else {
      this.toggleButton = false;
    }

  }


  agregarArchivo(event) {
    this.archivo = new Archivo();

    this.archivo.nombreblob = 'org/' + localStorage.getItem('org_ruc') + '/guia/' + DatatableFunctions.newUUID();
    $('#btnEliminarAA').click();

    $('#txtArchivo').val(null);
    event.preventDefault();
  }


  descartarBorrador(event) {
    swal({
      html: '¿Está seguro de descartar la guia?',
      type: "warning",
      //html: true,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-default",
      cancelButtonClass: "btn btn-warning",
    }).then(
      function () {

        oGuiaProveedorFormularioComponent._dataService.descartarBorrador(oGuiaProveedorFormularioComponent.id)
          .subscribe(
          p => {
            swal({
              text: "Se descartó la guia.",
              type: 'success',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-success",
              confirmButtonText: "Aceptar",
            }).then(
              function () {
                let nav = ['/sm-guia/proveedor/buscar'];
                oGuiaProveedorFormularioComponent.navigate(nav);
              },
              function (dismiss) {
                let nav = ['/sm-guia/proveedor/buscar'];
                oGuiaProveedorFormularioComponent.navigate(nav);

              });

          },
          e => console.log(e),
          () => { });
      },
      function (dismiss) {
      })

    event.preventDefault();
  }


  validarDocumentos() {
    if ($("#txtArchivo").get(0).files.length == 0) {
      swal({
        text: "Un archivo es requerido. Por favor completar y volver a intentar!",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }
    return true;
  }


  filtroClienteDefecto() {
    this.filtroCliente = {
      ruccodigo: '',
      ruc: '',
      razonsocial: '',
    }
  }


  onChangeFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.archivo.contenido = files[0];
  }


  grabarArchivoAdjunto() {
    if (!this.validarDocumentos()) {
      return false;
    }

    let docs_ordenado = this.guia.docadjuntos.sort((n, n1): number => {
      if (n.id < n1.id) return -1;
      if (n.id > n1.id) return 1;
      return 0;
    });
    if (docs_ordenado.length > 0) {
      let max_id = docs_ordenado[docs_ordenado.length - 1].id;
      this.archivo.id = max_id + 1;
    }
    else
      this.archivo.id = 1;

    var fullPath = $('#txtArchivo').val();
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
      this.archivo.nombre = filename;

    }

    this.ProgressUpload = true;

    oGuiaProveedorFormularioComponent._dataServiceAdjunto
      .AgregarArchivo(this.archivo)
      .subscribe(
      p => {
        this.ProgressUpload = false;
        oGuiaProveedorFormularioComponent.archivo.url = oGuiaProveedorFormularioComponent._dataServiceAdjunto.ObtenerUrlDescarga(oGuiaProveedorFormularioComponent.archivo);
        oGuiaProveedorFormularioComponent.guia.docadjuntos.push(JSON.parse(JSON.stringify(oGuiaProveedorFormularioComponent.archivo)));
        setTimeout(function () {

          dtArchivos.ajax.reload();

        }, 500);

        $("#mdlArchivosAdjuntos").modal('toggle');
      },
      e => console.log(e),
      () => { });
  }


  eliminarArchivos(event) {
    event.preventDefault();
    let checkboxes = $('#dtArchivos').find('.checkboxArchivos:checked');
    if (checkboxes.length <= 0) {
      swal({
        text: "Debe seleccionar un Archivo.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }
    else {
      let mensaje = "¿Desea eliminar el archivo seleccionado?";
      if (checkboxes.length > 1) {
        mensaje = "¿Desea eliminar los archivos seleccionados?";
      }
      swal({
        text: mensaje,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-default",
        cancelButtonClass: "btn btn-warning",
      }).then(function () {
        var lista = oGuiaProveedorFormularioComponent.guia.docadjuntos as Archivo[];
        for (let checkbox of checkboxes) {

          let id = $(checkbox).val();
          lista = lista.filter(a => a.id != id);

        }
        oGuiaProveedorFormularioComponent.guia.docadjuntos = JSON.parse(JSON.stringify(ActualizarCorrelativos(lista)));
        setTimeout(function () {
          dtArchivos.ajax.reload();

        }, 500);
      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

      }

        );

    }

  }


  eliminarArticulos(event) {
    event.preventDefault();
    let checkboxArticulos = $('#dtArticulos').find('.checkboxArticulos:checked');
    if (checkboxArticulos.length <= 0) {
      swal({
        text: "Debe seleccionar un Articulo.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }
    else {
      let mensaje = "¿Desea eliminar el artículo seleccionado?";
      if (checkboxArticulos.length > 1) {
        mensaje = "¿Desea eliminar los artículos seleccionados?";
      }
      swal({
        text: mensaje,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-default",
        cancelButtonClass: "btn btn-warning",
      }).then(function () {
        var lista = oGuiaProveedorFormularioComponent.guia.articulos as Articulo[];
        for (let checkbox of checkboxArticulos) {

          let nroitem = $(checkbox).val();
          lista = lista.filter(a => a.nroitem != nroitem);

        }
        oGuiaProveedorFormularioComponent.guia.articulos = JSON.parse(JSON.stringify(ActualizarCorrelativos(lista)));
        setTimeout(function () {
          dtArticulos.ajax.reload();

        }, 500);
      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

      }

        );

    }

  }


  async  AgregarArticulosOC(event) {
    this.btnSeleccionar = true;
    event.preventDefault();
    let checkboxOCs = $('#dtBuscarOC').find('.checkboxOC:checked');
    if (checkboxOCs.length <= 0) {
      swal({
        text: "Debe seleccionar una Orden de Compra.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      this.btnSeleccionar = false;
      return false;
    }

    for (let checkboxGuia of checkboxOCs) {
      //oFacturaProveedorFormularioComponent.factura.detallefactura
      let id_doc = $(checkboxGuia).val();
      let oc = await this._dataServiceOC
        .obtener(id_doc, 'P', true).toPromise();

      let arrArticulos = oGuiaProveedorFormularioComponent.guia.articulos.filter(a => a.idoc == id_doc);

      if (arrArticulos != null && oc.productos.length == arrArticulos.length) {
        swal({
          text: "No se puede volver a agregar la OC #" + $(checkboxGuia).attr("numOC") + ".",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        this.btnSeleccionar = false;
        return false;
      }

      /*for (let detalle of oGuiaProveedorFormularioComponent.guia.articulos) {
        if (detalle.idoc == id_doc) {
          swal({
            text: "No se puede volver a agregar la OC #" + $(checkboxGuia).attr("numOC") + ".",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
        }
      }*/
    }

    let lista_ordenado = oGuiaProveedorFormularioComponent.guia.articulos.sort((n, n1): number => {
      this.btnSeleccionar = false;
      if (n.nroitem < n1.nroitem) return -1;
      if (n.nroitem > n1.nroitem) return 1;
      return 0;
    });
    let max_nroitem = 1;
    if (lista_ordenado.length > 0) {
      max_nroitem = lista_ordenado[lista_ordenado.length - 1].nroitem + 1;
    }
    for (let checkboxOC of checkboxOCs) {

      let id_doc = $(checkboxOC).val();
      let oc = await this._dataServiceOC
        .obtener(id_doc, 'P', true).toPromise();
      if (oc.tipo == "Material") { oGuiaProveedorFormularioComponent.guia.tipoguia = "M"; } else { oGuiaProveedorFormularioComponent.guia.tipoguia = "S"; }

      for (let producto of oc.productos) {
        if (oGuiaProveedorFormularioComponent.guia.articulos.find(a => a.IdProductoOrden == producto.IdProductoOrden) != null) {
          continue;
        }

        oGuiaProveedorFormularioComponent.guia.articulos.push({
          idoc: id_doc,
          nroitem: max_nroitem++,
          nrooc: oc.nroordencompra,
          nroitemoc: producto.posicion,
          codproducto: producto.micodigo,
          descproducto: producto.desccorta,
          cantidadpedido: producto.cantidad,
          cantidadrecibida: producto.cantidadRecibida,
          cantidaddespachada: producto.cantidadDespachada,          
          unidadmedida: producto.unidad,
          unidadmedidadespacho: producto.unidad,
          atributos: producto.atributos,
          pesoneto: "",
          unidadmedidapesoneto: producto.unidad,
          estado: producto.estado,
          nroparte: producto.micodigo,
          preciounitario: "",
          preciototal: "",
          IdProductoOrden: producto.IdProductoOrden,
          IdTablaUnidad: "",
          IdRegistroUnidad: "",
          IdProdxGuia: "",
          EjercicioGuia: "",
          destino: "",
          CodigoGuiaERP: "",
          NumeroMaterial: "",
        });


      }

    }


    setTimeout(function () {
      dtArticulos.ajax.reload();
      $("#mdlOrdenesCompra").modal('toggle');
    }, 500);



  }

  SeleccionarCliente(event) {
    this.btnSeleccionar = true;

    event.preventDefault();
    let checkboxClientes = $('#dtBuscarCliente').find('.checkboxCliente:checked');
    if (checkboxClientes.length <= 0) {
      swal({
        text: "Debe seleccionar una Organización Compradora.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      this.btnSeleccionar = false;
      return false;
    }
    if (checkboxClientes.length > 1) {
      swal({
        text: "Debe seleccionar solo una Organización Compradora.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      this.btnSeleccionar = false;
      return false;
    }

    for (let checkboxCliente of checkboxClientes) {

      let id_organizacion = $(checkboxCliente).val();

      this.guia.razonsocialcliente = $(checkboxCliente).attr("razonsocial");
      this.guia.ruccliente = $(checkboxCliente).attr("ruc");
      this.guia.idorgcompradora = id_organizacion;


    }


    setTimeout(function () {
      datatable.ajax.reload();
      $("input").each(function () {
        $(this).keydown();
        if (!$(this).val() || $(this).val() == '')
          $(this.parentElement).addClass("is-empty");
      });
      $("#mdlBuscarCliente").modal('toggle');
    }, 500);
  }



  validarfiltrosOC() {

    if (this.filtrooc.fechacreacioninicio == null || this.filtrooc.fechacreacioninicio.toString() == "") {
      swal({
        text: "Fecha de registro inicio es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }
    if (this.filtrooc.fechacreacionfin == null || this.filtrooc.fechacreacionfin.toString() == "") {
      swal({
        text: "Fecha de registro fin es un campo requerido.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;

    }

    if (this.filtrooc.fechacreacioninicio != null && this.filtrooc.fechacreacioninicio.toString() != "" && this.filtrooc.fechacreacionfin != null && this.filtrooc.fechacreacionfin.toString() != "") {
      let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(this.filtrooc.fechacreacioninicio);
      let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime(this.filtrooc.fechacreacionfin);



      if (moment(fechacreacionfin).diff(fechacreacioninicio, 'days') > 30) {

        swal({
          text: 'El filtro de búsqueda "Fecha de Creación" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });

        return false;
      }

      let fechacreacioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
      let fechacreacionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);

      if (fechacreacioninicio_str > fechacreacionfin_str) {
        swal({
          text: "El rango de Fechas de registro seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });

        return false;
      }
    }

    return true;
  }


  AbrirAgregarOC(event) {

    if (!this.guia.ruccliente || this.guia.ruccliente === '') {
      swal({
        text: "Debe seleccionar una organización compradora.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });

      return false;
    }

    $("#mdlOrdenesCompra").modal('show');

    $("select").each(function () {
      $(this).keydown();
      if (!$(this).val() || $(this).val() == '')
        $(this.parentElement).addClass("is-empty");
    });
    datatableOC.ajax.reload();

    event.preventDefault();

  }


  BuscarOCClick(event) {
    if (this.validarfiltrosOC())
      datatableOC.ajax.reload();

    event.preventDefault();
  }


  filtroOCDefecto() {
    let fechacreacioni = new Date();
    fechacreacioni.setDate(fechacreacioni.getDate() - 30);
    this.filtrooc = {

      nroordencompra: '',

      estado: 'ALLGUIA',


      fechacreacioninicio: fechacreacioni,
      fechacreacionfin: new Date(),


    }
  }


  buscarCliente(e) {

    this.filtroCliente.razonsocial = "";
    this.filtroCliente.ruc = "";
    if (datatable != null) {
      this.buscarClienteDT(e);
    } else {
      cargarBuscarClienteDT();
    }

  }


  ngOnInit() {
    $("#mdlBuscarCliente").on('hidden.bs.modal', function () {
      oGuiaProveedorFormularioComponent.btnSeleccionar = false;
    });
    $("#mdlBuscarCliente").on('shown.bs.modal', function () {
      oGuiaProveedorFormularioComponent.btnSeleccionar = false;
    });
    $("#mdlOrdenesCompra").on('hidden.bs.modal', function () {
      oGuiaProveedorFormularioComponent.btnSeleccionar = false;
    });
    $("#mdlOrdenesCompra").on('shown.bs.modal', function () {
      oGuiaProveedorFormularioComponent.btnSeleccionar = false;
    });

    oGuiaProveedorFormularioComponent = this;

    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.esBorrador = params['b'];
      this.id_doc = params['c'];
    });

    if (this.id != '0') {
      this.toggleButton = true;
      $("#btnAgregarItemOC").addClass('disabled');
      $("#btnEliminarItemOC").addClass('disabled');
    } else {

      this.esBorrador = '1';
      this.toggleButton = false;
      this.habilitarEdicion(null);
      this.guia.razonsocialproveedor = localStorage.getItem('org_nombre');
      this.guia.rucproveedor = localStorage.getItem('org_ruc');
    }

    this.util.listUnidadMedida(function (data: ComboItem[]) {
    });

    this.util.listUnidadMedidaVolumen(function (data: ComboItem[]) {

      oGuiaProveedorFormularioComponent.listUnidadMedidaCombo = data;
    });
    this.util.listUnidadMedidaMasa(function (data: ComboItem[]) {
      oGuiaProveedorFormularioComponent.listUnidadMedidaPesoCombo = data;
    });

    this.util.listMotivoGuia(function (data: ComboItem[]) {

      oGuiaProveedorFormularioComponent.listMotivoGuiaCombo = data;
    });

    this.util.listTransporteGuia(function (data: ComboItem[]) {

      oGuiaProveedorFormularioComponent.listTransporteGuiaCombo = data;
    });

    this.util.listTipoDocIdentidad(function (data: ComboItem[]) {

      oGuiaProveedorFormularioComponent.listTipoDocIdentidad = data;
    });

    this.util.listEstadoGuia(function (data: ComboItem[]) {
      oGuiaProveedorFormularioComponent.listEstadoCombo = data;
    });

    this.util.listEstadoOC(function (data: ComboItem[]) {
      oGuiaProveedorFormularioComponent.listEstadoOCCombo = data;
    });

  }

  
  ngAfterViewInit() {
    if (this.id != '0') {
      console.log('this.esBorrador', this.esBorrador);
      this.guia.tipoguia = "M";
      let publicada = true;
      if (this.esBorrador === '1')
        publicada = false;
      this._dataService
        .obtener(this.id, publicada)
        .subscribe(
        p => {

          this.guia = p;
          this.guia.id_doc = this.id_doc;
          this.guiaOriginal = JSON.parse(JSON.stringify(p));
          this.producto = p.articulos.length > 0 ? p.articulos[0] : new Articulo();
          setTimeout(function () {



            $("input").each(function () {
              $(this).keydown();
              if (!$(this).val() || $(this).val() == '')
                $(this.parentElement).addClass("is-empty");
            });
            $("select").each(function () {
              $(this).keydown();
              if (!$(this).val() || $(this).val() == '')
                $(this.parentElement).addClass("is-empty");
            });


            $("textarea").each(function () {
              $(this).keydown();
              if (!$(this).val() || $(this).val() == '')
                $(this.parentElement).addClass("is-empty");
            });


            dtArticulos.ajax.reload();
            dtArchivos.ajax.reload();
          }, 200);




        },
        e => console.log(e),
        () => { });
    }

    DatatableFunctions.ModalSettings();

    $('#mdlArchivosAdjuntos').on('shown.bs.modal', function () {
      $('#btnEliminarAA').click();

    });

    dtArchivos = $('#dtArchivos').on('draw.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtArchivos);

    }).DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oGuiaProveedorFormularioComponent.guia.docadjuntos
        };
        callback(
          result
        );
      },
      columns: [

        { data: 'id' },
        { data: 'nombre' },
        { data: 'descripcion' },

        { data: 'id' },
      ],
      columnDefs: [
        { "className": "text-center", "targets": [1, 2, 3] },
        {

          render: function (data, type, row) {
            if (oGuiaProveedorFormularioComponent.esBorrador == "1" || oGuiaProveedorFormularioComponent.id == "0") {
              return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" value="' + row.id + '" name="optionsCheckboxes" class="checkboxArchivos"></label></div></div>';
            } else {
              return '';
            }

          },
          targets: 0,
          orderable: false,
          visible: false,
        },
        {

          render: function (data, type, row) {


            return '<a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">' +
              '<i class="material-icons">get_app</i></button></a>' +
              '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
              '<i class="material-icons">delete</i>' +
              '</button>';
          },
          targets: 3
        }
      ]

    });


    // Edit record
    dtArchivos.on('click', '.download', function (event) {
      var $tr = $(this).closest('tr');

      let row_id = $tr.find("a.editar").attr('row-id');

      var lista = oGuiaProveedorFormularioComponent.guia.docadjuntos as Archivo[];
      archivo = lista.find(a => a.id == row_id) as Archivo;





      oGuiaProveedorFormularioComponent._dataServiceAdjunto
        .DescargarArchivo(archivo)
        .subscribe(
        blob => {



          saveAs(blob, archivo.nombre);


        },
        e => console.log(e),
        () => { });
      event.preventDefault();

    });

    // Delete a record
    dtArchivos.on('click', '.remove', function (e) {
      var $tr = $(this).closest('tr');
      var row_id = $tr.find("a.editar").attr('row-id') as number;

      swal({
        text: "¿Desea eliminar el registro seleccionado?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-default",
        cancelButtonClass: "btn btn-warning",
      }).then(function () {
        var lista = oGuiaProveedorFormularioComponent.guia.docadjuntos as Archivo[];
        var listafiltrada = lista.filter(a => a.id != row_id);
        oGuiaProveedorFormularioComponent.guia.docadjuntos = JSON.parse(JSON.stringify(listafiltrada));
        setTimeout(function () {
          dtArchivos.ajax.reload();

        }, 500);
      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

      });



      e.preventDefault();
    });
    MostrarCheckboxArchivos();

    cargarOrdenCompraDetalle();
    cargarBuscarOCDT();
    cargarBuscarClienteDT();
    DatatableFunctions.registerCheckAll();

    var max_chars = 500;
    $('#observaciones').keyup(function () {
      var chars = $(this).val().length;
      var diff = max_chars - chars;
      $('#lblDescLength').html("500 caracteres máximo (" + diff + ")");
    });

    $("#nroguia1").blur(function () {
      if (oGuiaProveedorFormularioComponent.guia.nroguia1 == null) {
        oGuiaProveedorFormularioComponent.guia.nroguia1 = "";
      }

      if (oGuiaProveedorFormularioComponent.guia.nroguia1 == "") { return }


      let regex = /^[0-9]+$/;
      let str = oGuiaProveedorFormularioComponent.guia.nroguia1.trim();

      if (!regex.test(str)) {
        swal({
          html: "<p class='text-center'>Nro. Guia - La Serie solo puede contener caracteres numéricos.</p>",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        }).then(function () {
          $("#nroguia1").focus();
        });

        return false;
      }


    });


    $("#nroguia2").blur(function () {
      if (oGuiaProveedorFormularioComponent.guia.nroguia2 == null) {
        oGuiaProveedorFormularioComponent.guia.nroguia2 = "";
      }

      if (oGuiaProveedorFormularioComponent.guia.nroguia2 == "") { return }


      let regex = /^[0-9]+$/i;
      let str = oGuiaProveedorFormularioComponent.guia.nroguia2.trim();

      if (!regex.test(str)) {
        swal({
          html: "<p class='text-center'>Nro. Guia - El Correlativo solo puede contener caracteres numéricos.</p>",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        }).then(function () {
          $("#nroguia2").focus();
        });

        return false;
      }


    });
    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges) {

  }


  async habilitarEdicion(e) {
    let ocs = [];
    let last_oc_id = "";
    for (let articulo of this.guia.articulos) {
      if (last_oc_id != articulo.idoc) {
        ocs.push(articulo.idoc);
      }
      last_oc_id = articulo.idoc;
    }

    for (let ocid of ocs) {
      let oc = await this._dataServiceOC
        .obtener(ocid, 'P', true).toPromise();

      for (let articulo of this.guia.articulos) {
        let articulo_oc = oc.productos.filter(a => a.IdProductoOrden == articulo.IdProductoOrden);
        if (articulo_oc == null || articulo_oc.length == 0) {
          continue;
        }
        articulo.estado = articulo_oc[0].estado;
        articulo.codproducto = articulo_oc[0].micodigo;
        articulo.descproducto = articulo_oc[0].desccorta;
        articulo.cantidadpedido = articulo_oc[0].cantidad;
        articulo.unidadmedida = articulo_oc[0].unidad;
        articulo.unidadmedidadespacho = articulo_oc[0].unidad;
        articulo.atributos = articulo_oc[0].atributos;
        articulo.unidadmedidapesoneto = articulo_oc[0].unidad;
        articulo.nroparte = articulo_oc[0].micodigo;
      }
    }


    this.toggleButton = false;
    setTimeout(function () {
      $(".toggleButton").prop('disabled', false);
      $("#btnAgregarItemOC").removeClass('disabled');
      $("#btnEliminarItemOC").removeClass('disabled');
    }, 200);
    setTimeout(function () {
      dtArticulos.ajax.reload();
    }, 500);
    MostrarCheckboxArticulos();
    MostrarCheckboxArchivos();
  }

  validarfiltrosCliente() {
    oGuiaProveedorFormularioComponent.filtroCliente.razonsocial = oGuiaProveedorFormularioComponent.filtroCliente.razonsocial.trim();
    oGuiaProveedorFormularioComponent.filtroCliente.ruc = oGuiaProveedorFormularioComponent.filtroCliente.ruc.trim();
    return true;
  }

  buscarClienteDT(e) {
    if (this.validarfiltrosCliente())
      datatable.ajax.reload();

    //e.preventDefault();
  }
}
function cargarOrdenCompraDetalle() {
  if (oGuiaProveedorFormularioComponent.listUnidadMedidaPesoCombo)
    cargarOrdenCompraDT();
  else {
    setTimeout(function () {
      cargarOrdenCompraDetalle();
    }, 200);
  }
}
function cargarBuscarClienteDT() {

  /*if (datatable != null) {
    oGuiaProveedorFormularioComponent.buscarClienteDT(event);
    return;
  }*/


  
  /*
   .on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, datatable);
    })
   */

  datatable = $('#dtBuscarCliente').DataTable({
    searching: false,

    serverSide: true,
    ajax: {

      beforeSend: function (request) {


        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_ORGANIZACION,
      dataSrc: "data",
      data: function (d) {

        if (oGuiaProveedorFormularioComponent.filtroCliente.razonsocial != "") {
          d.RazonSocial = oGuiaProveedorFormularioComponent.filtroCliente.razonsocial;
        }

        if (oGuiaProveedorFormularioComponent.filtroCliente.ruc != "") {
          d.Ruc = oGuiaProveedorFormularioComponent.filtroCliente.ruc;
        }

        d.column_names = 'IdOrganizacion,RazonSocial,Ruc';

      }
    },

    columns: [
      { data: 'IdOrganizacion' },
      { data: 'RazonSocial' },
      { data: 'Ruc' },
    ],
    columnDefs: [

      { "className": "text-center", "targets": [1, 2] },
      {
        render: function (data, type, row) {
          return '<div class="text-right" height="100%"><div class="radio text-right"><label><input type="radio" name="optionsCheckboxes" class="checkboxCliente" ruc="' + row.Ruc + '" razonsocial="' + row.RazonSocial + '" value="' + row.IdOrganizacion + '"></label></div></div>';
        },
        targets: 0
      },
    ]
  });

}

function cargarBuscarOCDT() {

  datatableOC = $('#dtBuscarOC').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatableOC);
  }).DataTable({
    pageLength: 5,
    order: [[8, "desc"], [1, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {
      //url: "http://localhost:3500/occomprador",
      beforeSend: function (request) {
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_OC,
      dataSrc: "data",
      data: function (d) {

        if (oGuiaProveedorFormularioComponent.filtrooc.nroordencompra != "") {
          d.NumeroOrden = oGuiaProveedorFormularioComponent.filtrooc.nroordencompra;
        }
        if (oGuiaProveedorFormularioComponent.filtrooc.nroordencompra != "NONE") {
          d.EstadoOrden = oGuiaProveedorFormularioComponent.filtrooc.estado;
        }
        if (oGuiaProveedorFormularioComponent.filtrooc.fechacreacioninicio) {
          let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime(oGuiaProveedorFormularioComponent.filtrooc.fechacreacioninicio);
          d.FechaRegistroInicio = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
        }
        if (oGuiaProveedorFormularioComponent.filtrooc.fechacreacionfin) {
          let fechacreacionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oGuiaProveedorFormularioComponent.filtrooc.fechacreacionfin));
          d.FechaRegistroFin = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        }

        d.TipoOrden = "M";
        d.org_idComprador = oGuiaProveedorFormularioComponent.guia.idorgcompradora;
        d.column_names = 'CodigoOrden,NumeroOrden,Fecha,EstadoOrden,TipoOrden,AtencionA,NITComprador,' +
          'UsuarioComprador,NombreComprador,NITVendedor,UsuarioProveedor,NombreVendedor,ValorTotal,MonedaOrden,' +
          'FechaCreacion,NumeroRfq,Version,FechaRegistro';
      }
    },

    columns: [
      { data: 'CodigoOrden', name: 'CodigoOrden' },
      { data: 'NumeroOrden', name: 'NumeroOrden' },
      { data: 'NombreComprador', name: 'NombreComprador' },
      { data: 'UsuarioComprador', name: 'UsuarioComprador' },
      { data: 'AtencionA', name: 'AtencionA' },
      { data: 'EstadoOrden', name: 'EstadoOrden' },
      { data: 'Version', name: 'Version' },
      { data: 'ValorTotal', name: 'ValorTotal' },
      { data: 'FechaRegistro', name: 'FechaRegistro' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8] },
      {
        render: function (data, type, row) {
          return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" name="optionsCheckboxes" numOC="' + row.NumeroOrden + '" value="' + row.CodigoOrden + '" class="checkboxOC"></label></div></div>';
        },
        targets: 0
      },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return DatatableFunctions.ParseFieldHtml(row.AtencionA);
        },
        targets: 4
      },
      {
        render: function (data, type, row) {
          //return data +' ('+ row[3]+')';
          return row.MonedaOrden + ' ' + DatatableFunctions.FormatNumber(row.ValorTotal);
        },
        targets: 7
      },
    ]
  });



}
function UnidadMedidaCombo(nroitem, value, disabled) {
  let text = '<select name="unidadmedidadespacho"  nroitem="' + nroitem + '" class="toggleButton unidadmedidadespacho' + nroitem + ' unidadmedidadespacho form-control dt-text"' + disabled + '> ' +
    '  <option Value=""></option>';

  if (oGuiaProveedorFormularioComponent.listUnidadMedidaCombo) {
    for (let i of oGuiaProveedorFormularioComponent.listUnidadMedidaCombo) {

      let selected = '';
      if (i.valor === value)
        selected = 'selected'
      text = text + '  <option Value="' + i.valor + '"' + selected + '>' + i.valor + '</option>';
    }
  }
  return text;
}
function cargarOrdenCompraDT() {

  dtArticulos = $('#dtArticulos').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, dtArticulos);


  }).DataTable({
    order: [[2,"asc"],[3,"asc"]],
    "ajax": function (data, callback, settings) {
      let result = {
        data: oGuiaProveedorFormularioComponent.guia.articulos
      };
      callback(
        result
      );
    },
    columns: [
      { data: 'nroitem' },
      { data: 'nroitem' },
      { data: 'nrooc' },
      { data: 'nroitemoc' },
      { data: 'codproducto' },
      { data: 'descproducto' },
      { data: 'unidadmedida' },
      { data: 'cantidadpedido' },
      { data: 'cantidadrecibida' },
      { data: 'cantidaddespachada' },
      { data: 'unidadmedidadespacho' },
      { data: 'estado' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
      {
        render: function (data, type, row) {
          if (oGuiaProveedorFormularioComponent.esBorrador == "1" || oGuiaProveedorFormularioComponent.id == "0") {
            return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" value="' + row.nroitem + '" name="optionsCheckboxes" class="checkboxArticulos"></label></div></div>';
          } else {
            return '';
          }
        },
        targets: 0
      },
      {
        render: function (data, type, row) {
          return row.codproducto;
          //return '<a href="javascript:void(0);" row-id="' + row.nroitem + '" class="atributos" title="Ver Atributos">' + row.codproducto + '</a>';
        },
        targets: 4
      },
      {
        render: function (data, type, row) {
          var disabled = "disabled";
          if (!oGuiaProveedorFormularioComponent.toggleButton)
            disabled = "";
          return '<input pattern= "[0-9]*"  name="cantidaddespachada" value="' + row.cantidaddespachada + '" nroitem="' + row.nroitem + '" type="text" class="toggleButton cantidaddespachada' + row.nroitem + ' cantidaddespachada form-control text-center dt-text" ' + disabled + '>';
        },
        targets: 9
      },
      /*
      {
         render: function (data, type, row) {
           var disabled = "disabled";
           if (!oGuiaProveedorFormularioComponent.toggleButton)
             disabled = "";
           return UnidadMedidaCombo(row.nroitem, row.unidadmedidadespacho, disabled);
         },
         targets: 10
       },
       */
      // oGuiaProveedorFormularioComponent.listUnidadMedidaPesoCombo 
    ]
  });

  dtArticulos.on('change', '.cantidaddespachada', function (event) {

    var nroitem = $(this).attr('nroitem');
    let producto = oGuiaProveedorFormularioComponent.guia.articulos.find(a => a.nroitem == nroitem);

    producto.cantidaddespachada = $(this).val();
    $('.cantidaddespachada' + nroitem).val(producto.cantidaddespachada);

  });




  dtArticulos.on('change', '.unidadmedidadespacho', function (event) {

    var nroitem = $(this).attr('nroitem');
    let producto = oGuiaProveedorFormularioComponent.guia.articulos.find(a => a.nroitem == nroitem);

    producto.unidadmedidadespacho = $(this).val();

    $('.unidadmedidadespacho' + nroitem).val(producto.unidadmedidadespacho);

  });

  dtArticulos.on('click', '.atributos', function (event) {
    var $tr = $(this).closest('tr');
    let id = $tr.find("a").attr('row-id');

    let producto = oGuiaProveedorFormularioComponent.guia.articulos.find(a => a.nroitem == id);

    oGuiaProveedorFormularioComponent.producto = producto;

    /*var atributos = JSON.parse(JSON.stringify(producto.atributos));//clone

    oGuiaProveedorFormularioComponent.atributos = atributos;*/


    setTimeout(function () {
      dtAtributos.ajax.reload();
      $("#mdlAtributosLista").modal('show');




      $("input").each(function () {
        $(this).keydown();
        if (!$(this).val() && $(this).val() == '')
          $(this.parentElement).addClass("is-empty");
      });
      $("select").each(function () {
        $(this).keydown();
        if (!$(this).val() && $(this).val() == '')
          $(this.parentElement).addClass("is-empty");
      });


      $("textarea").each(function () {
        $(this).keydown();
        if (!$(this).val() && $(this).val() == '')
          $(this.parentElement).addClass("is-empty");
      });





    }, 500);
    event.preventDefault();
  });


  dtArticulos.on('click', '.remove', function (e) {

    var $tr = $(this).closest('tr');
    var nroitem = $tr.find("a").attr('row-id') as number;

    swal({
      text: "¿Desea eliminar el artículo seleccionado?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-default",
      cancelButtonClass: "btn btn-warning",
    }).then(function () {
      var lista = oGuiaProveedorFormularioComponent.guia.articulos as Articulo[];

      var listafiltrada = lista.filter(a => a.nroitem != nroitem);
      oGuiaProveedorFormularioComponent.guia.articulos = JSON.parse(JSON.stringify(ActualizarCorrelativos(listafiltrada)));
      setTimeout(function () {
        dtArticulos.ajax.reload();

      }, 500);
    }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'

    }

      );


    e.preventDefault();
  });

  dtAtributos = $('#dtAtributos').DataTable({

    ajax: function (data, callback, settings) {

      let result = {
        data: oGuiaProveedorFormularioComponent.producto.atributos

      };
      callback(
        result
      );
    },
    columns: [


      { data: 'nombre' },
      { data: 'operador' },
      { data: 'valor' },
      { data: 'unidad' },


    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3] },
    ]

  });


  MostrarCheckboxArticulos();



}

function MostrarCheckboxArticulos() {
  if (!oGuiaProveedorFormularioComponent.toggleButton) {
    setTimeout(function () {
      if (dtArticulos) {
        var column = dtArticulos.column(0);

        // Toggle the visibility
        column.visible(true);
      }
    }, 200)
  }

}

function MostrarCheckboxArchivos() {
  if (!oGuiaProveedorFormularioComponent.toggleButton) {
    setTimeout(function () {
      if (dtArchivos) {
        var column = dtArchivos.column(0);

        // Toggle the visibility
        column.visible(true);
      }
    }, 200)
  }

}

function ActualizarCorrelativos(lista) {
  let index = 1;
  for (let item of lista) {
    item.nroitem = index++;

  }
  return lista;
}
