import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { Cotizacion, Primero, Atributo, Producto, AtributoxProducto,
         ProductoAux, AtributoxProductoAux /*, Atributocrear, Productocrear , Archivos*/ } from 'app/model/sm-cotizacion';
import { MasterService } from 'app/service/masterservice';


import {URL_CREAR_QT} from 'app/utils/app.constants';
/*estoy añadiendo esto*/ 
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'app/service/login.service';
/*import { Location } from '@angular/common';*/
/*------*/
import { AdjuntoService} from "app/service/adjuntoservice";
import { CotizacionService} from "app/service/sm-cotizacionservice";
import {Archivo} from "app/model/archivo";

import { ComboItem } from "app/model/comboitem";

import { RfqService} from "app/service/sm-rfqservice";
import { AppUtils } from "app/utils/app.utils";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RFQCompradorInsert } from "app/model/sm-rfqcomprador";

declare var DatatableFunctions, $, moment, swal, saveAs: any;

var oCotizacionProveedorCrearComponent: CotizacionProveedorCrearComponent,dtArticulos,dtGenerales2, dtArchivos,archivo: Archivo, dtDetalleProductos;

@Component({
    moduleId: module.id,
    selector: 'cotizacionproveedorcrear-cmp',
    templateUrl: 'cotizacionproveedorcrear.component.html',
    providers: [ RfqService, MasterService, LoginService, CotizacionService, AdjuntoService]
})

export class CotizacionProveedorCrearComponent implements OnInit, OnChanges, AfterViewInit {

  public item: Cotizacion;
  // public atributos?: Atributocrear[];

  public toggleButton: boolean;
  public ProgressUpload: boolean;
  public classDisabled: string;

  public itemRFQ: RFQCompradorInsert;
  public util: AppUtils;
  public idRFQ: string;
  public prodAux: ProductoAux[];
  public atributosxProdAux: AtributoxProductoAux[];
  public indiceProdSel: number;
  public listMonedaCombo: ComboItem[];
  public archivo: Archivo;
  public atencionA: string;

    /*
        constructor(private activatedRoute: ActivatedRoute, private router: Router,
                    private _masterService: MasterService, private _dataService:  RfqService, private_securityService: LoginService) {
                    this.util = new AppUtils(this.router, this._masterService);

            this.itemRFQ = new RFQCompradorInsert();

        }
    */
    constructor( private route: ActivatedRoute,  private router: Router, private _masterService: MasterService,
                 private _dataService:  CotizacionService, public _dataServiceAdjunto: AdjuntoService,
                 private _dataServiceRFQ:  RfqService, private_securityService: LoginService) {

        this.util = new AppUtils(this.router, this._masterService);
        this.item = new Cotizacion();
        this.itemRFQ = new RFQCompradorInsert();
        this.archivo = new Archivo();
        this.atencionA = '';
        this.indiceProdSel = -1;

        this.item.version = '1';
        this.item.mensaje = '';

        let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        this.item.nomusupro = usuarioActual.nombrecompleto;
        this.prodAux = [];
        this.atributosxProdAux = [];

        // this.item.orgpro= this.itemRFQ.proveedorDirigido[0].codproveedor;//JSON.parse(localStorage.getItem('org_ruc'))+'';
        // this.activatedRoute = activatedRoute;;
        /*
        this.itemoriginal = new Cotizacion();
        this.archivo = new Archivo();
        this.producto = new Articulo();
        */

        this.toggleButton = true;
        this.ProgressUpload = false;
        this.classDisabled = 'disabled';
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
          this.idRFQ = params['id'];
        });
        // this.item = new Cotizacion();
        // Code for the Validator
        oCotizacionProveedorCrearComponent=this;

        //  this.item.atributos[0].mandatorio= this.itemRFQ.atributos[0].;
        this.util.listMonedas(function (data: ComboItem[]) {
            oCotizacionProveedorCrearComponent.listMonedaCombo = data;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngAfterViewInit() {
        let correlativoQT = '';

        this._dataService
            .generarNumeroDeSeguimiento()
            .subscribe(
            p => {
                correlativoQT = p;
            },
            e => console.log(e),
            () => { });

        this._dataServiceRFQ
            .obtener(this.idRFQ)
            .subscribe(
            p => {
                this.itemRFQ = p;

                if (this.itemRFQ.atributos != null) {
                    for (let obj of this.itemRFQ.atributos) {
                        let newItem: Primero  = new Primero ();
                        newItem.idatributo=obj.id;
                        newItem.nombreatributo=obj.nombreatributo;
                        newItem.valorenviado=obj.valor;
                        newItem.nombreunidad=obj.unidad;
                        newItem.modificable=obj.modificable;
                        newItem.mandatorio=obj.mandatorio;
                        newItem.atributovalortipodato=obj.atributovalortipodato;
                        this.item.atributos.push(newItem);
                    }
                }

                if(p.propietario.trim() !== '') {
                    oCotizacionProveedorCrearComponent.atencionA = p.propietario.trim();
                } else {
                    oCotizacionProveedorCrearComponent.atencionA = p.nomorgcompradora.trim();
                }

                oCotizacionProveedorCrearComponent.item.numeroseguimiento = correlativoQT;

                /*
                if (this.itemRFQ.productos != null) {
                    for (let obj of this.itemRFQ.productos) {
                        let newItem: Producto  = new Producto ();
                        newItem.nombreatributo=obj.nombreatributo;
                        newItem.valorenviado=obj.valor;
                        newItem.nombreunidad=obj.unidad;
                        newItem.modificable=obj.modificable;
                        newItem.mandatorio=obj.mandatorio;


                        id: number;
                        posicion: string; // posiscion 
                        codigoproducto?: string;
                        nombreproducto: string;
                        descripcionproducto:string;
                        //cantidadbase: number;
                        unidad: string;
                        cantidad: number;
                        precio: number;
                        //adjuntos: string;
                        fechaentrega: Date;

                        posicion: number; // posiscion 
                        codigoproducto: string;
                        nombreproducto: string;
                        objetocontrato: string;
                        cantidad: string;
                        unidad: string;
                        atributos?: Atributo[];

                        this.item.productos.push(newItem);

                    }
                }
                */

                    dtArticulos.ajax.reload();
                    // console.log(this.itemRFQ);
                    setTimeout(function () {

                        $('input').each(function () {
                            $(this).keydown();
                            if (!$(this).val() && $(this).val() === '') {
                                $(this.parentElement).addClass('is-empty');
                            }
                        });
                        $('select').each(function () {
                            $(this).keydown();
                            if (!$(this).val() && $(this).val() === '') {
                                $(this.parentElement).addClass('is-empty');
                            }
                        });
                        $('textarea').each(function () {
                            $(this).keydown();
                            if (!$(this).val() && $(this).val() === '') {
                                $(this.parentElement).addClass('is-empty');
                            }
                        });

                        // console.log(dtArticulos);
                        // console.log( dtProveedores);

                        dtArticulos.ajax.reload();
                        dtGenerales2.ajax.reload();
                        dtArchivos.ajax.reload();
                        // dtArticulos2.ajax.reload();
                        // dtProveedores.ajax.reload();
                        // dtProveedoresInvitados.ajax.reload();

                    }, 50);
            },
            e => console.log(e),
            () => { });


          dtArticulos = $('#dtGenerales').DataTable({
            footerCallback: function (row, data, start, end, display) {
                console.log(data);
                /*var total = 0;
                data.forEach(element => {
                  if (element.es_subitem == false)
                    total = total + parseFloat(element.valorrecibido.replace(',', ''));
                });
                var api = this.api(), data;
                //oRfqCompradorFormularioComponent.item.total = DatatableFunctions.FormatNumber(total);

                /*$(api.column(7).footer()).html(
                  oDetraccionCompradorFormularioComponent.item.total
                );*/
            },
            'order': [[1, 'asc']],
            'ajax': function (data, callback, settings) {
                const result = {
                  data: oCotizacionProveedorCrearComponent.item.atributos
                };
                callback(
                  result
                );
            },
            /*"createdRow": function (row, data, index) {
                if (data.es_subitem == false && data.tienesubitem) {
                    $(row).addClass('highlight');
                    $(row).attr('identificador', data.id);
                }
                else {
                    //$(row).attr('parentid', data.parentid);
                    $('td', row).eq(0).addClass('text-center');
                }
            },*/
            columns: [
                { data: 'nombreatributo' },
                { data: 'valorenviado' },
                { data: 'nombreunidad' },
                { data: 'modificable' },
                { data: 'mandatorio' },
            ],
            columnDefs: [
                { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4] },
                {
                    render: function (data, type, row) {

                        if(row.nombreatributo.toUpperCase() === 'MONEDA') {

                            let isDisabled = '';

                            if (row.modificable.trim() === 'N') {
                                isDisabled = 'disabled';
                            }

                            let comboHTML = '<select class="form-group label-floating form-control"  id="moneda" name="moneda" ' +
                                            isDisabled + '><option disabled="" ></option>';

                            if(row.valorenviado.trim().toUpperCase() === 'PEN') {
                                comboHTML += '<option value="PEN" selected >PEN</option>';
                            } else {
                                comboHTML += '<option value="PEN">PEN</option>';
                            }

                            if(row.valorenviado.trim().toUpperCase() === 'USD') {
                                comboHTML += '<option value="USD" selected >USD</option>';
                            } else {
                                comboHTML += '<option value="USD">USD</option>';
                            }

                            if(row.valorenviado.trim().toUpperCase() === 'EUR') {
                                comboHTML += '<option value="EUR" selected >EUR</option>';
                            } else {
                                comboHTML += '<option value="EUR">EUR</option>';
                            }

                            comboHTML += '</select>';

                            // $("#moneda").val("PEN");
                            // row.valorenviado;
                            return comboHTML;
                        } else {
                            if (row.modificable.trim() === 'S') {
                                return '<input name="articuloItem-' + row.idatributo + '" type="text"   value="' + row.valorenviado +
                                       '" class="form-control" >';
                            } else {
                                return '<input name="articuloItem-' + row.idatributo + '" type="hidden" value="' + row.valorenviado +
                                       '">' + row.valorenviado;
                            }
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

          /*************SRGUNDA TABLA*************** */
          dtGenerales2 = $('#dtGenerales2').DataTable({
            footerCallback: function (row, data, start, end, display) {
              console.log(data);
            },
            'order': [[1, 'asc']],
            'ajax': function (data, callback, settings) {
                oCotizacionProveedorCrearComponent.prodAux=new Array();
                let productos=oCotizacionProveedorCrearComponent.itemRFQ.productos;

                if (productos != null){
                  let i = 0;
                  for (let objP of productos) {
                      let newProdAux:ProductoAux= new ProductoAux();
                      newProdAux.idproducto=objP.idproducto;
                      newProdAux.codigoproducto=objP.codigoproducto;
                      newProdAux.nombreproducto=objP.nombreproducto;
                      newProdAux.descripcionproducto=objP.descripcionproducto;
                      let j = 0;
                      for (let objAxP of productos[i].atributos) {
                          let newAtribxProdAux:AtributoxProductoAux= new AtributoxProductoAux();
                          // newAtribxProdAux.atributovalortipodato=productos[i].atributos[j];
                          newAtribxProdAux.atributovalortipodato=productos[i].atributos[j].atributovalortipodato;
                          newAtribxProdAux.idatributo=productos[i].atributos[j].idatributo;
                          newAtribxProdAux.idproductoxrfq=productos[i].atributos[j].idproductoxrfq;
                          newAtribxProdAux.idrfq=productos[i].atributos[j].idrfq;
                          newAtribxProdAux.mandatorio=productos[i].atributos[j].mandatorio;
                          newAtribxProdAux.modificable=productos[i].atributos[j].modificable;
                          newAtribxProdAux.nombreatributo=productos[i].atributos[j].nombreatributo;
                          newAtribxProdAux.nombreunidad=productos[i].atributos[j].nombreunidad;
                          newAtribxProdAux.valorenviado=productos[i].atributos[j].valorenviado;

                          if( productos[i].atributos[j].nombreatributo.toUpperCase() === 'POSICION' ||
                              productos[i].atributos[j].nombreatributo.toUpperCase() === 'POSICIÓN' ) {
                              newProdAux.posicion = productos[i].atributos[j].valorenviado;
                              newAtribxProdAux.esvisible = false;
                          } else if(productos[i].atributos[j].nombreatributo.toUpperCase() === 'CANTIDAD') {
                              newProdAux.cantidadsolicitada = productos[i].atributos[j].valorenviado;
                              newProdAux.cantidadofrecida = productos[i].atributos[j].valorenviado;
                              newAtribxProdAux.esvisible = false;
                              if(productos[i].atributos[j].modificable.trim().toUpperCase() === 'S') {
                                    newProdAux.esmodificablecantidadofrecida = true;
                              }
                          } else if(productos[i].atributos[j].nombreatributo.toUpperCase() === 'PRECIO') {
                              newProdAux.precio = productos[i].atributos[j].valorenviado;
                              newAtribxProdAux.esvisible = false;
                              if(productos[i].atributos[j].modificable.trim().toUpperCase() === 'S') {
                                    newProdAux.esmodificableprecio = true;
                              }
                          } else if(productos[i].atributos[j].nombreatributo.toUpperCase() === 'UNIDAD DE MEDIDA') {
                              newProdAux.unidad=productos[i].atributos[j].valorenviado;
                              newAtribxProdAux.esvisible = false;
                              if(productos[i].atributos[j].modificable.trim().toUpperCase() === 'S') {
                                    newProdAux.esmodificableunidad = true;
                              }
                          } else if(productos[i].atributos[j].nombreatributo.toUpperCase() === 'FECHA DE ENTREGA') {
                              newProdAux.fechaentrega=productos[i].atributos[j].valorenviado !== ''?DatatableFunctions.FormatDatetimeForDisplay(new Date(productos[i].atributos[j].valorenviado)):new Date;
                              newAtribxProdAux.esvisible = false;
                              if(productos[i].atributos[j].modificable.trim().toUpperCase() === 'S') {
                                    newProdAux.esmodificablefechaentrega = true;
                              }
                          } // else {

                          newProdAux.atributos.push(newAtribxProdAux);
                          // }
                          j++;
                      }
                      oCotizacionProveedorCrearComponent.prodAux.push(newProdAux);
                      i++;
                  }
                }

                const result = {
                    data: oCotizacionProveedorCrearComponent.prodAux
                };
                callback(
                    result
                );
            },

            columns: [
                { data: 'posicion' },
                { data: 'codigoproducto' },
                { data: 'nombreproducto'},
                { data: 'cantidadsolicitada'},
                { data: 'precio'},
                { data: 'unidad'},
                { data: 'cantidadofrecida'},
                { data: 'fechaentrega'},

                // { data: 'cantidad'},
            ],
            columnDefs: [
                { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7] },
                {
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0);" row-id="' + row.idproducto +
                               '" class="atributos" title="Ver Atributos">' + row.codigoproducto + '</a>';
                    },
                    targets: 1
                },
                {
                    render: function (data, type, row) {
                        if(row.esmodificableprecio) {
                            return '<input style="width:70px;" name="atributoPrecio-' + row.idproducto +
                                   '" type="text"   value="' + row.precio + '" class="form-control" >';
                        } else {
                            return row.precio;
                        }
                    },
                    targets: 4
                },
                {
                    render: function (data, type, row) {
                        if(row.esmodificableunidad) {
                            return '<input style="width:90px;" name="atributoUnidad-' + row.idproducto +
                                   '" type="text"   value="' + row.unidad + '" class="form-control" >';
                        } else {
                            return row.unidad;
                        }
                    },
                    targets: 5
                },
                {
                    render: function (data, type, row) {
                        if(row.esmodificablecantidadofrecida) {
                            return '<input style="width:70px;" name="atributoCantidad-' + row.idproducto +
                                   '" type="text"   value="'+row.cantidadofrecida+'" class="form-control" >';
                        } else {
                            return row.cantidadofrecida;
                        }
                    },
                    targets: 6
                },
                {
                    render: function (data, type, row) {
                        if(row.esmodificablefechaentrega) {
                            return '<input name="atributoFechaDeEntrega-' + row.idproducto +
                                   '" type="text"   value="'+row.fechaentrega+'" class="form-control" >';
                        } else {
                            return row.fechaentrega;
                        }
                    },
                    targets: 7
                }
            ]
          });


          dtGenerales2.on('click', '.atributos', function (event) {
              var $tr = $(this).closest('tr');
              let id = $tr.find('a.atributos').attr('row-id');
              let prodSel = oCotizacionProveedorCrearComponent.prodAux.find(a => a.idproducto == id  );

              oCotizacionProveedorCrearComponent.indiceProdSel=oCotizacionProveedorCrearComponent.prodAux.indexOf(prodSel);
              oCotizacionProveedorCrearComponent.atributosxProdAux=prodSel.atributos.filter(x => x.esvisible==true);

              dtDetalleProductos.ajax.reload();
              $('#mdlAtributosLista').modal('show');

              event.preventDefault();
          });


          /********************Detalle de Atributos por Producto*************************/ 
          dtDetalleProductos = $('#dtDetalleAtributosxProducto').DataTable({
            footerCallback: function (row, data, start, end, display) {
                console.log(data);
            },
            'order': [[1, 'asc']],
            'ajax': function (data, callback, settings) {
                const result = {
                    data : oCotizacionProveedorCrearComponent.atributosxProdAux,
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
                // {data: 'idatributo'},
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
                        if (row.modificable.trim()==='S') {
                          return '<input name="producto-' + row.idproductoxrfq + '-atributo-' + row.idatributo +
                                 '" type="text" class="form-control"  value="' + row.valorenviado + '">';
                        } else {
                          return row.valorenviado;
                        }
                    },
                    targets: 1
                },
            ]
          });


        /*************TABLA DE ARCHIVOS************ */
        DatatableFunctions.ModalSettings();

        $('#mdlArchivosAdjuntos').on('shown.bs.modal', function () {
            $('#btnEliminarAA').click();
        });

        dtArchivos = $('#dtArchivos').on('draw.dt', function (e, settings, json) {
          DatatableFunctions.initDatatable(e, settings, json, dtArchivos);
        }).DataTable({
          ajax: function (data, callback, settings) {
                const result = {
                data: oCotizacionProveedorCrearComponent.item.docadjuntos
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
            { 'className': 'text-center', 'targets': [1, 2, 3] },
            {
              render: function (data, type, row) {
                  return '<div class="text-center" height="100%"><div class="checkbox text-right"><label>'+
                         '<input type="checkbox" value="' + row.id + '" name="optionsCheckboxes" class="checkboxArchivos">'+
                         '</label></div></div>';
              },
              targets: 0,
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

          var lista = oCotizacionProveedorCrearComponent.item.docadjuntos as Archivo[];
          archivo = lista.find(a => a.id == row_id) as Archivo;

          oCotizacionProveedorCrearComponent._dataServiceAdjunto
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
          var row_id = $tr.find('a.editar').attr('row-id') as number;

          swal({
                    text: '¿Desea eliminar el registro seleccionado?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-default',
                    cancelButtonClass: 'btn btn-warning',
            }).then(function () {
                    var lista = oCotizacionProveedorCrearComponent.item.docadjuntos as Archivo[];
                    var listafiltrada = lista.filter(a => a.id != row_id);
                    oCotizacionProveedorCrearComponent.item.docadjuntos = JSON.parse(JSON.stringify(listafiltrada));
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

    }////ngAfterViewInit


    async grabarAtributos(e) {
        let i=0;
        for (const objAxP of this.prodAux[this.indiceProdSel].atributos) {
            if (objAxP.modificable.trim()==='S' && objAxP.esvisible==true) {
                this.prodAux[this.indiceProdSel].atributos[i].valorenviado=$('input[name*="producto-'+objAxP.idproductoxrfq+'-atributo-'+objAxP.idatributo +'"]').val();
            }
            i++;
        }
        $('#mdlAtributosLista').modal('hide');
    };

    async guardarCotizacion(e) {
        // alert(moment().format());
        // return null;

        this.toggleButton = true;
        // this.factura.nocomprobantepago = this.item.nocomprobantepago1 + "-" + this.factura.nocomprobantepago2;
        this.item.estado = 'Q';
        this.item.IdBorrador = this.item.id_doc;

        this.item.fechacreacion = moment().format();
        this.item.fechaemision = moment().format('DD/MM/YYYY');


        this.guardarDatosDePantalla();

        if (await this.validardatos(e, false)) {
          this._dataService
            .guardar(this.item)
            .subscribe(
            p => {
                swal({
                    text: 'La información ha sido guardada. Confirme el correcto registro de la misma verificando el No. Doc. de Pago '+
                          'en la columna correspondiente.',
                    type: 'success',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success'
                });
                let nav = ['/sm-requerimiento/proveedor/buscar'];
                oCotizacionProveedorCrearComponent.navigate(nav);
            },
            e => {
                this.toggleButton = false;
                console.log(e);
            },
            () => { });
        } else {
          this.toggleButton = false;
        }
    }

    guardarDatosDePantalla() {

        this.item.productos=[];
        this.item.idrfq=this.itemRFQ.idrfq;
        this.item.numerorfq=this.itemRFQ.nroreq;

        this.item.idmoneda=$('#moneda').val();
        this.item.orgpro= this.itemRFQ.proveedorDirigido[0].codproveedor;// JSON.parse(localStorage.getItem('org_ruc'))+'';      

        let i = 0, j = 0;
        for (const obj of this.item.atributos) {
            if(obj.modificable.trim()==='S') {
                if(obj.nombreatributo.toUpperCase()==='MONEDA') {
                    this.item.atributos[i].valorenviado=$('#moneda').val();
                } else {
                    this.item.atributos[i].valorenviado=$('input[name*="articuloItem-'+obj.idatributo+'"]').val();
                }
            }
            i++;
        }

        i = 0;
        for (const obj of this.prodAux) {
            const newProd: Producto = new Producto();
            newProd.codigoproducto=obj.codigoproducto;
            newProd.nombreproducto=obj.nombreproducto;
            newProd.descripcionproducto=obj.descripcionproducto;

            // j=0;
            for (const objAxP of obj.atributos) {
                  const newAtrib: AtributoxProducto = new AtributoxProducto();

                  if(objAxP.nombreatributo.toUpperCase()==='CANTIDAD') {
                      newAtrib.valor=$('input[name*="atributoCantidad-'+obj.idproducto+'"]').val();
                      $('input[name*="atributoCantidad-'+obj.idproducto+'"]').prop( 'disabled', true );
                  } else if(objAxP.nombreatributo.toUpperCase()==='PRECIO') {
                      newAtrib.valor=$('input[name*="atributoPrecio-'+obj.idproducto+'"]').val();
                  } else if(objAxP.nombreatributo.toUpperCase()==='UNIDAD DE MEDIDA') {
                      newAtrib.valor=$('input[name*="atributoUnidad-'+obj.idproducto+'"]').val();
                  } else if(objAxP.nombreatributo.toUpperCase()==='FECHA DE ENTREGA') {
                      newAtrib.valor=$('input[name*="atributoFechaDeEntrega-'+obj.idproducto+'"]').val();
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

        // console.log
    }

    async enviarCotizacion(e) {

          this.toggleButton = true;
          // this.item.numeroseguimient = this.guia.nroguia1 + "-" + this.guia.nroguia2;
          // this.itemRFQ.nroreq = this.item.rfq; 
          // console.log(this.itemRFQ.nroreq);
          this.item.estado = 'GPUBL';
          this.guardarDatosDePantalla();

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
                            confirmButtonClass: 'btn btn-success'
                        }).then(
                            (result) => {
                                let nav = ['/sm-requerimiento/proveedor/buscar'];
                                oCotizacionProveedorCrearComponent.navigate(nav);
                            }, (dismiss) => {
                                let nav = ['/sm-requerimiento/proveedor/buscar'];
                                oCotizacionProveedorCrearComponent.navigate(nav);
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

    public navigate(nav) {
        this.router.navigate(nav, { relativeTo: this.route });
    }

    /*************FUNCION AGREGAR ARCHIVOS************* */
    agregarArchivo(event) {
        this.archivo = new Archivo();

        this.archivo.nombreblob = 'org/' + localStorage.getItem('org_ruc') + '/cotizacion/' + DatatableFunctions.newUUID();
        $('#btnEliminarAA').click();
        $('#txtArchivo').val(null);
        event.preventDefault();
    }

    validarDocumentos() {
        if ($('#txtArchivo').get(0).files.length == 0) {
            swal({
            text: 'Un archivo es requerido. Por favor completar y volver a intentar!',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning'
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

    grabarArchivoAdjunto() {
        if (!this.validarDocumentos()) {
            return false;
        }

        let docs_ordenado = this.item.docadjuntos.sort((n, n1): number => {
            if (n.id < n1.id) { return -1; };
            if (n.id > n1.id) { return 1; };
            return 0;
        });
        if (docs_ordenado.length > 0) {
            let max_id = docs_ordenado[docs_ordenado.length - 1].id;
            this.archivo.id = max_id + 1;
        } else {
            this.archivo.id = 1;
        }

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

        oCotizacionProveedorCrearComponent._dataServiceAdjunto
            .AgregarArchivo(this.archivo)
            .subscribe(
            p => {
            this.ProgressUpload = false;
            oCotizacionProveedorCrearComponent.archivo.url = oCotizacionProveedorCrearComponent._dataServiceAdjunto.ObtenerUrlDescarga(oCotizacionProveedorCrearComponent.archivo);
            oCotizacionProveedorCrearComponent.item.docadjuntos.push(JSON.parse(JSON.stringify(oCotizacionProveedorCrearComponent.archivo)));
            setTimeout(function () {
                dtArchivos.ajax.reload();
            }, 500);

            $('#mdlArchivosAdjuntos').modal('toggle');
            },
            e => console.log(e),
            () => { });
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
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-default',
                    cancelButtonClass: 'btn btn-warning',
                }).then(function () {
                    var lista = oCotizacionProveedorCrearComponent.item.docadjuntos as Archivo[];
                    for (const checkbox of checkboxes) {
                        let id = $(checkbox).val();
                        lista = lista.filter(a => a.id != id);
                    }
                    oCotizacionProveedorCrearComponent.item.docadjuntos = JSON.parse(JSON.stringify(ActualizarCorrelativos(lista)));
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

};

/*************FUNCION AGREGAR ARCHIVOS************* */

  function MostrarCheckboxArchivos() {
    if (!oCotizacionProveedorCrearComponent.toggleButton) {
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
    for (const item of lista) {
      item.nroitem = index++;
    }
    return lista;
  }
