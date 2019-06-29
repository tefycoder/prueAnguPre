import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from 'app/utils/app.utils';
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from 'app/model/comboitem';
import { Cotizacion } from 'app/model/sm-cotizacion';
import 'app/../assets/js/plugins/jquery.PrintArea.js';
import {Archivo} from 'app/model/archivo';
import { AdjuntoService} from 'app/service/adjuntoservice';


import { CotizacionService} from 'app/service/sm-cotizacionservice';
import { LoginService } from 'app/service/login.service';
// import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
// import { Caracteristicas } from 'app/model/retenciones';
import {  ProductoAux, AtributoxProductoAux, Producto, AtributoxProducto } from 'app/model/sm-cotizacion';

declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $,DatatableFunctions: any;
var oCotizacionProveedorFormularioComponent: CotizacionProveedorFormularioComponent,
    dtDetalleProductos, dtGenerales, dtArticulos, dtArchivos, archivo: Archivo;
@Component({
  moduleId: module.id,
  selector: 'cotizacionproveedorformulario-cmp',
  templateUrl: './cotizacionproveedorformulario.component.html',
  providers: [ CotizacionService, MasterService, LoginService, AdjuntoService]
})

export class CotizacionProveedorFormularioComponent implements OnInit, AfterViewInit {

    public id: string;
    public esBorrador: string;
    public id_doc: string;

    util: AppUtils;
    public listPrioridadCombo: ComboItem[];
    public listMonedaCombo: ComboItem[];
    public listUnidadMedidaCombo: ComboItem[];
    public listEstadoCombo: ComboItem[];
    public item: Cotizacion;
    public atencionA: string;
    public estadoRFQ: string;

    public url_main_module_page = '/sm-cotizacion/proveedor/buscar';

    public prodAux: ProductoAux[];
    public atributosxProdAux: AtributoxProductoAux[];
    public toggleButton: boolean;
    public indiceProdSel: number;
    public archivo: Archivo;
    public ProgressUpload: boolean;


    constructor(private activatedRoute: ActivatedRoute, private router: Router, public _dataServiceAdjunto: AdjuntoService,
                private _masterService: MasterService, private _dataService:  CotizacionService, private_securityService: LoginService) {

        this.id = '0';
        this.esBorrador = '0';
        this.id_doc = '';

        this.util = new AppUtils(this.router, this._masterService);
        this.item = new Cotizacion();
        this.atencionA='';
        this.prodAux=[];
        this.atributosxProdAux=[];

        this.toggleButton=true;
        this.indiceProdSel=-1;

        this.archivo = new Archivo();
        this.ProgressUpload = false;
        this.estadoRFQ = '';
    }


    print(event): void {
        // oDetraccionCompradorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
        //  oDetraccionCompradorFormularioComponent.item.estado = $("#estadoComprador option:selected").text();
        setTimeout(function () {
            $('div#print-section-material').printArea({ popTitle: 'COTIZACIÓN', mode: 'iframe', popClose: false });
        }, 100);
        // hay que chequear en donde imprime esta parte en conformidaad de servicio
    }


    ngOnInit() {
        // oDetraccionCompradorFormularioComponent = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.esBorrador = params ['b'];
            this.id_doc = params ['c'];
        });

        if (this.id !== '0') {
            this.toggleButton = true;
        } else {
            this.toggleButton = false;
            this.esBorrador ='1';
        }

        this.util.listEstadoHAS(function (data: ComboItem[]) {
            oCotizacionProveedorFormularioComponent.listEstadoCombo = data;
        });

        oCotizacionProveedorFormularioComponent = this;

    }
    public navigate(nav) {
        this.router.navigate(nav, { relativeTo: this.activatedRoute });
    }


    async habilitarEdicion(e) {

        if(this.estadoRFQ === 'RANUL'){
            $('#botonrfq').attr('enabled');
        }else{
            $('#botonrfq').attr('disabled');
            swal({
                html: '<p class=text-center>La Solicitud de Cotización ha sido cerrada</p>',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
              });
              return false;
        }
/*
        if(this.toggleButton) {
*/

            for(const atrib of this.item.atributos){
                if (atrib.modificable.trim() === 'S') {
                    $('input[name*="articuloItem-'+atrib.idatributo+'"]').prop('disabled', false);
                }
            }

            for (let objP of this.item.productos) {
                $('input[name*="atributoPrecio-'+objP.idproducto+'"]').prop('disabled', false);
                $('input[name*="atributoUnidad-'+objP.idproducto+'"]').prop('disabled', false);
                $('input[name*="atributoCantidad-'+objP.idproducto+'"]').prop('disabled', false);
                $('input[name*="atributoFechaDeEntrega-'+objP.idproducto+'"]').prop('disabled', false);
            }

            oCotizacionProveedorFormularioComponent.item.version+=1;

            $('.remove').css('display', 'inline');
            // $('input[name*="habilitarEdicion"]').attr("value", "Your new search string");

/*
            $('button[name*=habilitarEdicion]').text('DESHABILITAR EDICIÓN');
        }else{
            for(let atrib of this.item.atributos){
                if (atrib.modificable.trim()=='S')
                    $('input[name*="articuloItem-'+atrib.idatributo+'"]').prop('disabled', true);
            }

            for (let objP of this.item.productos) {
                $('input[name*="atributoPrecio-'+objP.idproducto+'"]').prop('disabled', true);
                $('input[name*="atributoUnidad-'+objP.idproducto+'"]').prop('disabled', true);
                $('input[name*="atributoCantidad-'+objP.idproducto+'"]').prop('disabled', true);
                $('input[name*="atributoFechaDeEntrega-'+objP.idproducto+'"]').prop('disabled', true);
            }

            oCotizacionProveedorFormularioComponent.item.version+=-1;

            $('.remove').css('display', 'none');
            //$('input[name*="habilitarEdicion"]').attr("value", "Your new search string");
            $('button[name*=habilitarEdicion]').text('HABILITAR EDICIÓN');
        }

        this.toggleButton = !this.toggleButton;
*/

    }


        async enviarCotizacion(e){

            this.toggleButton = true;
            // this.item.numeroseguimient = this.guia.nroguia1 + "-" + this.guia.nroguia2;
            // this.itemRFQ.nroreq = this.item.rfq; 
            // console.log(this.itemRFQ.nroreq);
            this.item.estado = 'GPUBL';
            this.item.productos=[];
            this.item.idrfq=this.item.idrfq;
            this.item.numerorfq=this.item.numerorfq;
            this.item.version+=-1;

            // alert(this.item.idrfq);
            // return '';

            this.item.idmoneda=$('#moneda').val();
            // this.item.orgpro= this.itemRFQ.proveedorDirigido[0].codproveedor;//JSON.parse(localStorage.getItem('org_ruc'))+'';      
            this.item.orgpro= this.item.orgcom;

            let i = 0, j = 0;
            for (const obj of this.item.atributos) {
                if(obj.modificable.trim()==='S'){
                    if(obj.nombreatributo.toUpperCase()==='MONEDA') {
                        this.item.atributos[i].valorenviado=$('#moneda').val();
                    } else {
                        this.item.atributos[i].valorenviado=$("input[name*='articuloItem-"+obj.idatributo+"']").val();
                    }
                }
                i++;
            }

            i = 0;
            for (let obj of this.prodAux) {
                let newProd: Producto = new Producto();
                newProd.codigoproducto=obj.codigoproducto;
                newProd.nombreproducto=obj.nombreproducto;
                newProd.descripcionproducto=obj.descripcionproducto;

                // j=0;
                for (const objAxP of obj.atributos) {
                    let newAtrib: AtributoxProducto = new AtributoxProducto();

                    if(objAxP.nombreatributo.toUpperCase()==='CANTIDAD'){
                        newAtrib.valor=$("input[name*='atributoCantidad-"+obj.idproducto+"']").val();
                        $("input[name*='atributoCantidad-"+obj.idproducto+"']").prop( 'disabled', true );
                    } else if(objAxP.nombreatributo.toUpperCase()==='PRECIO'){
                        newAtrib.valor=$("input[name*='atributoPrecio-"+obj.idproducto+"']").val();
                    } else if(objAxP.nombreatributo.toUpperCase()==='UNIDAD DE MEDIDA'){
                        newAtrib.valor=$("input[name*='atributoUnidad-"+obj.idproducto+"']").val();
                    } else if(objAxP.nombreatributo.toUpperCase()==='FECHA DE ENTREGA'){
                        newAtrib.valor=$("input[name*='atributoFechaDeEntrega-"+obj.idproducto+"']").val(); 
                    } else {
                        newAtrib.valor=objAxP.valorenviado;
                    }

                    newAtrib.nombre=objAxP.nombreatributo;
                    newAtrib.obligatorio=objAxP.mandatorio;

                    newAtrib.valoreditable=objAxP.modificable;
                    newAtrib.valortipodato=objAxP.atributovalortipodato;
                    newAtrib.valorunidad=objAxP.nombreunidad;

                    newProd.atributos.push(newAtrib);
                }
                this.item.productos.push(newProd);
                i++;
            }

            if(this.esBorrador === '1') {
                this.item.IdBorrador = this.item.id_doc;
            }

            if (await this.validardatos(e, true)) {

                this._dataService
                    .agregar(this.item)
                    .subscribe(
                    p => {
                            swal({
                                // text: 'La información ha sido enviada. Confirme el correcto registro de la misma verificando el Número ERP en la columna correspondiente. Espere dicho número para la impresión de su constancia.',
                                text: 'La cotización ha sido enviada con éxito.',
                                type: 'success',
                                buttonsStyling: false,
                                confirmButtonClass: "btn btn-success"
                            }).then(
                                (result) => {
                                    let nav = ['/sm-cotizacion/proveedor/buscar'];
                                    oCotizacionProveedorFormularioComponent.navigate(nav);
                                }, (dismiss) => {
                                    let nav = ['/sm-cotizacion/proveedor/buscar'];
                                    oCotizacionProveedorFormularioComponent.navigate(nav);
                            });
                    },
                    e => {
                        this.toggleButton = false;
                        console.log(e);
                    },
                    () => { });
            } else {
                this.toggleButton = false;
            }
    }////enviarCotizacion


    async validardatos (e, enviar = false){

        if (this.item.numeroseguimiento == null || this.item.numeroseguimiento.trim() === '') {
            swal({
                text: 'N° Cotización es un campo requerido.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
        }

        if (this.item.idmoneda == null || this.item.idmoneda.trim() === '') {
            swal({
                text: 'Moneda es un campo requerido.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
        }

        return true;
    }


    agregarArchivo(event) {
        this.archivo = new Archivo();
        this.archivo.nombreblob = 'org/' + localStorage.getItem('org_ruc') + '/cp/' + DatatableFunctions.newUUID();
        $('#btnEliminarAA').click();
        $('#txtArchivo').val(null);
        event.preventDefault();
    }


    eliminarArchivos(event) {
        event.preventDefault();
        let checkboxes = $('#dtArchivos').find('.checkboxArchivos:checked');
        if (checkboxes.length <= 0) {
            swal({
                text: 'Debe seleccionar un Archivo.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
        } else {
            let mensaje = '¿Desea eliminar el archivo seleccionado?';
            if (checkboxes.length > 1) {
                mensaje = '¿Desea eliminar los archivos seleccionados?';
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
                var lista = oCotizacionProveedorFormularioComponent.item.docadjuntos as Archivo[];
                for (let checkbox of checkboxes) {
                    let id = $(checkbox).val();
                    lista = lista.filter(a => a.id != id);
                }

                oCotizacionProveedorFormularioComponent.item.docadjuntos = JSON.parse(JSON.stringify(ActualizarCorrelativoArchivosAdjuntos(lista)));
                setTimeout(function () {
                    dtArchivos.ajax.reload();
                }, 500);
            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
            });
        }
    }



    grabarArchivoAdjunto() {
        if (!this.validarDocumentos()) {
          return false;
        }
    
        let docs_ordenado = this.item.docadjuntos.sort((n, n1): number => {
          if (n.id < n1.id) return -1;
          if (n.id > n1.id) return 1;
          return 0;
        });

        if (docs_ordenado.length > 0)
          this.archivo.id = docs_ordenado[docs_ordenado.length - 1].id + 1;
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

        oCotizacionProveedorFormularioComponent._dataServiceAdjunto
          .AgregarArchivo(this.archivo)
          .subscribe(
          p => {
            this.ProgressUpload = false;
            oCotizacionProveedorFormularioComponent.archivo.url = oCotizacionProveedorFormularioComponent._dataServiceAdjunto.ObtenerUrlDescarga(oCotizacionProveedorFormularioComponent.archivo);
            oCotizacionProveedorFormularioComponent.item.docadjuntos.push(JSON.parse(JSON.stringify(oCotizacionProveedorFormularioComponent.archivo)));
            setTimeout(function () {
              dtArchivos.ajax.reload();
            }, 500);
    
            $("#mdlArchivosAdjuntos").modal('toggle');
          },
          e => console.log(e),
          () => { });
    
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
    

      onChangeFile(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        this.archivo.contenido = files[0];
      }


  ngAfterViewInit() {

    if (this.id != '0'){
        let publicada = true;
        if(this.esBorrador == '1'){
            publicada = false;
        }


        this._dataService
        .obtener(this.id, publicada)
        .subscribe(
        p => {
            this.item = p;
           // this.item.nomusucom='';
            console.log('************ ITEM ***********');
            console.log(this.item);
            console.log('*****************************');

            // if(this.item.nomusucom.trim()!='')
            //     oCotizacionProveedorFormularioComponent.atencionA=p.nomusucom.trim();
            // else
            //     oCotizacionProveedorFormularioComponent.atencionA=p.nomorgcom.trim();
          // oCotizacionProveedorFormularioComponent.estadoRFQ = p.estadorfqcomprador.trim();

            setTimeout(function () {
            $("input").each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() == '') {
                    $(this.parentElement).addClass("is-empty");
                }
            });
            $("select").each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() == '') {
                    $(this.parentElement).addClass("is-empty");
                }
            });
            $("textarea").each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() == '') {
                    $(this.parentElement).addClass("is-empty");
                }
            });
            // console.log(dtArticulos);
            // console.log( dtProveedores);
            dtGenerales.ajax.reload();
            dtArticulos.ajax.reload();
            dtArchivos.ajax.reload();
            // dtDetalleAtributos.ajax.reload();
            // dtProveedores.ajax.reload();
            // dtProveedoresInvitados.ajax.reload();
            }, 100);
        },
        e => console.log(e),
        () => { });

    }

    dtGenerales = $('#dtGenerales').DataTable({
      footerCallback: function (row, data, start, end, display) {
        console.log(data);
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oCotizacionProveedorFormularioComponent.item.atributos
        };
        callback(
          result
        );
      },
      "createdRow": function (row, data, index) {
        if (data.es_subitem == false && data.tienesubitem) {
          $(row).addClass('highlight');
          $(row).attr('identificador', data.id);
        }
        else {
          //$(row).attr('parentid', data.parentid);
          $('td', row).eq(0).addClass('text-center');
        }
      },
      columns: [
          { data: 'nombreatributo' },
          { data: 'valorenviado' },
          { data: 'nombreunidad'},
          { data: 'modificable' },
          { data: 'mandatorio' },
      ],
      columnDefs: [
          { "className": "text-center", "targets": [0, 1, 2, 3, 4] },
          {
            render: function (data, type, row) {

                if(row.nombreatributo.toUpperCase()=='MONEDA'){
                    
//                    let isDisabled='';
                    
  //                  if (row.modificable.trim()=='N'){
    //                    isDisabled='disabled';

                        let comboHTML = '<select class="form-group label-floating form-control" id="moneda" name="moneda" '+(row.modificable.trim()=='S'?'':'disabled')+'><option disabled></option>';
                        
                      //  if(row.valorenviado.trim().toUpperCase()=='PEN')
                        comboHTML+='<option value="PEN" '+(row.valorenviado.trim().toUpperCase()=='PEN'?'selected':'')+'>PEN</option>';
                        comboHTML+='<option value="USD" '+(row.valorenviado.trim().toUpperCase()=='USD'?'selected':'')+'>USD</option>';
                        comboHTML+='<option value="EUR" '+(row.valorenviado.trim().toUpperCase()=='EUR'?'selected':'')+'>EUR</option>';

                        return comboHTML+'</select>';
                        //else
                          //  comboHTML+='<option value="PEN">PEN</option>';
                    /*    
                        if(row.valorenviado.trim().toUpperCase()=='USD')
                            comboHTML+='<option value="USD" selected >USD</option>';
                        else
                            comboHTML+='<option value="USD">USD</option>';
                                                
                        if(row.valorenviado.trim().toUpperCase()=='EUR')
                            comboHTML+='<option value="EUR" selected >EUR</option>';
                        else
                            comboHTML+='<option value="EUR">EUR</option>';
                                        
                        comboHTML+='</select>';

                        return comboHTML;
                        */
                  //  }
                    //else{
                      //  return row.valorenviado
                   // }
                    //$("#moneda").val("PEN");
                    //row.valorenviado;

                }
                else{                        
                    if (row.modificable.trim()=='S')
                        return '<input name="articuloItem-'+row.idatributo+'" type="text"   value="'+row.valorenviado+'" class="form-control" disabled>';
                    else
                        return '<input name="articuloItem-'+row.idatributo+'" type="hidden" value="'+row.valorenviado+'">'+row.valorenviado;
                }
                /*
                if (row.modificable.trim()=='S')
                  return '<input name="articuloItem" type="text" class="form-control"  value="'+row.id+'">';
                else
                  return row.id;
                */
            },
            targets: 1
        },
      ]
    });



          /***------GENERAR SEGUNDA TABLA DEARTICULOS */
          dtArticulos = $('#dtArticulos').DataTable({
            footerCallback: function (row, data, start, end, display) {
              console.log(data);
            },
            'order': [[1, 'asc']],
            'ajax': function (data, callback, settings) {

                  oCotizacionProveedorFormularioComponent.prodAux=new Array();
                  let productos=oCotizacionProveedorFormularioComponent.item.productos;

                  if (productos != null){
                    let i = 0;
                    for (let objP of productos) {
                        let newProdAux:ProductoAux= new ProductoAux();
                        newProdAux.idproducto=objP.idproducto;
                        // newProdAux.posicion=objP.posicion;

                        // alert(objP.nombreproducto);
                        newProdAux.codigoproducto=objP.codigoproducto;
                        newProdAux.nombreproducto=objP.nombreproducto;
                        newProdAux.descripcionproducto=objP.descripcionproducto;
                        let j = 0;

                        for (let objAxP of productos[i].atributos) {
                            let newAtribxProdAux:AtributoxProductoAux= new AtributoxProductoAux();

                            newAtribxProdAux.atributovalortipodato=productos[i].atributos[j].valortipodato;
                            newAtribxProdAux.mandatorio=productos[i].atributos[j].obligatorio;
                            newAtribxProdAux.modificable=productos[i].atributos[j].valoreditable;
                            newAtribxProdAux.nombreatributo=productos[i].atributos[j].nombre;
                            newAtribxProdAux.nombreunidad=productos[i].atributos[j].valorunidad;
                            newAtribxProdAux.valorenviado=productos[i].atributos[j].valor;
                            newAtribxProdAux.idatributo=productos[i].atributos[j].idatributo;

                            if( productos[i].atributos[j].nombre.toUpperCase()==='POSICION' ||
                                productos[i].atributos[j].nombre.toUpperCase()==='POSICIÓN' ) {
                                newProdAux.posicion=productos[i].atributos[j].valor;
                                newAtribxProdAux.esvisible=false;
                            } else if(productos[i].atributos[j].nombre.toUpperCase()==='CANTIDAD'){
                                newProdAux.cantidadsolicitada=productos[i].atributos[j].valor;
                                newProdAux.cantidadofrecida=productos[i].atributos[j].valor;
                                newAtribxProdAux.esvisible=false;
                                if(productos[i].atributos[j].valoreditable.trim().toUpperCase()=='S'){
                                    newProdAux.esmodificablecantidadofrecida=true;
                                }
                            } else if(productos[i].atributos[j].nombre.toUpperCase()=='PRECIO'){
                                newProdAux.precio=productos[i].atributos[j].valor;
                                newAtribxProdAux.esvisible=false;
                                if(productos[i].atributos[j].valoreditable.trim().toUpperCase()=='S'){
                                    newProdAux.esmodificableprecio=true;
                                }
                            } else if(productos[i].atributos[j].nombre.toUpperCase()=='UNIDAD DE MEDIDA'){
                                newProdAux.unidad=productos[i].atributos[j].valor;
                                newAtribxProdAux.esvisible=false;
                                if(productos[i].atributos[j].valoreditable.trim().toUpperCase()=='S'){
                                    newProdAux.esmodificableunidad=true;
                                }
                            } else if(productos[i].atributos[j].nombre.toUpperCase()=='FECHA DE ENTREGA'){
                                // alert(productos[i].atributos[j].valor);
                                // newProdAux.fechaentrega=productos[i].atributos[j].valor!=''?DatatableFunctions.FormatDatetimeForDisplay(new Date(productos[i].atributos[j].valor)):new Date;
                                newProdAux.fechaentrega=productos[i].atributos[j].valor!=''?productos[i].atributos[j].valor:'';
                                newAtribxProdAux.esvisible=false;
                                if(productos[i].atributos[j].valoreditable.trim().toUpperCase()=='S'){
                                    newProdAux.esmodificablefechaentrega=true;
                                }
                            }
                            newProdAux.atributos.push(newAtribxProdAux);
                            j++;
                        }

                        oCotizacionProveedorFormularioComponent.prodAux.push(newProdAux);
                        i++;

                    }
                  }

                  const result = {
                      data: oCotizacionProveedorFormularioComponent.prodAux
                  };
                  callback(
                      result
                  );
            },
            "createdRow": function (row, data, index) {
                if (data.es_subitem == false && data.tienesubitem) {
                    $(row).addClass('highlight');
                    $(row).attr('identificador', data.id);
                }
                else {
                    //$(row).attr('parentid', data.parentid);
                    $('td', row).eq(0).addClass('text-center');
                }
            },
            columns: [
                { data: 'posicion' },
                { data: 'codigoproducto' },
                { data: 'nombreproducto'},
                { data: 'cantidadofrecida'},
                { data: 'precio'},
                { data: 'unidad'},
                { data: 'fechaentrega'},
            ],
            columnDefs: [
                { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5] },
                {
                    render: function (data, type, row) {      
                        return '<a href="javascript:void(0);" row-id="' + row.idproducto + '" class="atributos" title="Ver Atributos">' + row.codigoproducto + '</a>';
                    },
                    targets: 1
                },  
                {
                    render: function (data, type, row) {      
                        if(row.esmodificableprecio)
                            return '<input style="width:70px;" name="atributoPrecio-'+row.idproducto+'" type="text" value="'+row.precio+'" class="form-control" disabled>';
                        else
                            return row.precio;
                    },
                    targets: 4
                },     
                {
                    render: function (data, type, row) {
                        if(row.esmodificableunidad)
                            return '<input style="width:90px;" name="atributoUnidad-'+row.idproducto+'" type="text"  value="'+row.unidad+'" class="form-control" disabled>';
                        else
                            return row.unidad;
                    },
                    targets: 5
                },    
                {
                    render: function (data, type, row) {
                        if(row.esmodificablecantidadofrecida)
                            return '<input style="width:70px;" name="atributoCantidad-'+row.idproducto+'" type="text"  value="'+row.cantidadofrecida+'" class="form-control" disabled>';
                        else
                            return row.cantidadofrecida;
                    },
                    targets: 6
                },     
                {
                    render: function (data, type, row) {
                        if(row.esmodificablefechaentrega)                        
                            return '<input name="atributoFechaDeEntrega-'+row.idproducto+'" type="text"  value="'+row.fechaentrega+'" class="form-control" disabled>';
                        else
                            return row.fechaentrega;
                    },
                    targets: 7
                }   
            ]
          });


          dtArticulos.on('click', '.atributos', function (event) {
              var $tr = $(this).closest('tr');
              let id = $tr.find("a.atributos").attr('row-id');
              let prodSel = oCotizacionProveedorFormularioComponent.prodAux.find(a => a.idproducto == id  );

              oCotizacionProveedorFormularioComponent.indiceProdSel=oCotizacionProveedorFormularioComponent.prodAux.indexOf(prodSel);
              oCotizacionProveedorFormularioComponent.atributosxProdAux=prodSel.atributos.filter(x => x.esvisible==true);

              dtDetalleProductos.ajax.reload();
              $("#mdlAtributosLista").modal('show');

              event.preventDefault();
          });


          /********************Detalle de Atributos por Producto*************************/ 
          dtDetalleProductos = $('#dtDetalleAtributosxProducto').DataTable({
            footerCallback: function (row, data, start, end, display) {
                console.log(data);
            },
            "order": [[1, "asc"]],
            "ajax": function (data, callback, settings) {
                let result = {
                    data : oCotizacionProveedorFormularioComponent.atributosxProdAux,
                };                  
                callback(
                    result
                );
            },
            "createdRow": function (row, data, index) {
                if (data.es_subitem == false && data.tienesubitem) {
                    $(row).addClass('highlight');
                    $(row).attr('identificador', data.id);
                }
                else {
                    //$(row).attr('parentid', data.parentid);
                    $('td', row).eq(0).addClass('text-center');
                }
            },
            columns: [
                //{data: 'id'},
                { data: 'nombreatributo' },
                { data: 'valorenviado' },
                { data: 'nombreunidad' },
                { data: 'modificable' },
                { data: 'mandatorio' },
            ],
            columnDefs: [
                { "className": "text-center", "targets": [0, 1, 2, 3, 4] },
                {
                    render: function (data, type, row) {
                        if (row.modificable.trim()=='S'){
                          let isDisabled = 'disabled';

                          if (!oCotizacionProveedorFormularioComponent.toggleButton)
                              isDisabled='';
                          return '<input name="producto-atributo-'+row.idatributo+'" type="text" class="form-control"  value="'+row.valorenviado+'" '+isDisabled+'>';
                        }else
                          return row.valorenviado;
                    },
                    targets: 1
                },       
            ]      
          });


    /***------DOCUMENTOS ADJUNTOS */
    dtArchivos = $('#dtArchivos').DataTable({
      footerCallback: function (row, data, start, end, display) {
          console.log(data);
      },
      'order': [[0, 'asc']],
      'ajax': function (data, callback, settings) {
          let result = {
            data: oCotizacionProveedorFormularioComponent.item.docadjuntos

          };
          callback(
            result
          );
      },
      'createdRow': function (row, data, index) {
          if (data.es_subitem == false && data.tienesubitem) {
            $(row).addClass('highlight');
            $(row).attr('identificador', data.id);
          } else {
            // $(row).attr('parentid', data.parentid);
            $('td', row).eq(0).addClass('text-center');
          }
      },
      columns: [
          { data: 'id' },
          { data: 'nombre' },
          { data: 'descripcion' },
          { data: 'id' },
      ],
      columnDefs: [
          { "className": "text-center", "targets": [0, 1, 2, 3 ] },
          {
              render: function (data, type, row) {
                let display = oCotizacionProveedorFormularioComponent.toggleButton?'display: none;':'';

                return '<a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
                '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">' +
                '<i class="material-icons">get_app</i></button></a>' +
                    '<button class="btn btn-simple btn-danger btn-icon remove" style="' + display+
                    '" rel="tooltip" title="Eliminar" data-placement="left">' +
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

        var lista = oCotizacionProveedorFormularioComponent.item.docadjuntos as Archivo[];
        archivo = lista.find(a => a.id == row_id) as Archivo;

        oCotizacionProveedorFormularioComponent._dataServiceAdjunto
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
              var lista = oCotizacionProveedorFormularioComponent.item.docadjuntos as Archivo[];
              var listafiltrada = lista.filter(a => a.id != row_id);
              oCotizacionProveedorFormularioComponent.item.docadjuntos = JSON.parse(JSON.stringify(ActualizarCorrelativoArchivosAdjuntos(listafiltrada)));
              setTimeout(function () {
                dtArchivos.ajax.reload();
              }, 500);
            }, function (dismiss) {
              // dismiss can be 'cancel', 'overlay',
              // 'close', and 'timer'
            });
            e.preventDefault();
          });
  }

  grabarAtributos(){
        let i=0;
        for (let objAxP of this.prodAux[this.indiceProdSel].atributos) {
            if (objAxP.modificable.trim() === 'S' && objAxP.esvisible == true) {
                this.prodAux[this.indiceProdSel].atributos[i].valorenviado=$('input[name*="producto-atributo-'+objAxP.idatributo +'"]').val();
            }
            i++;
        }
        $('#mdlAtributosLista').modal('hide');
  }
  // ngAfterViewChecked() {
    // this.cdRef.detectChanges();
  // }

}

function ActualizarCorrelativoArchivosAdjuntos(lista) {
    let index = 1;
    for (const item of lista) {
      item.id = index++;
    }
    return lista;
}

function ActualizarCorrelativos(lista) {
    let index = 1;
    for (const item of lista) {
      item.noitem = index++;
    }
    return lista;
}