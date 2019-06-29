import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import {Cotizacion} from "app/model/sm-cotizacion";
import 'app/../assets/js/plugins/jquery.PrintArea.js';

import { CotizacionService} from "app/service/sm-cotizacionservice";
import { LoginService } from 'app/service/login.service';
//import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
//import { Caracteristicas } from 'app/model/retenciones';
import {  ProductoAux, AtributoxProductoAux } from 'app/model/sm-cotizacion';


declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $,DatatableFunctions: any;
var oCotizacionCompradorFormularioComponent: CotizacionCompradorFormularioComponent, dtDetalleProductos, dtGenerales, dtArticulos, dtArchivos;
@Component({
  moduleId: module.id,
  selector: 'cotizacioncompradorformulario-cmp',
  templateUrl: './cotizacioncompradorformulario.component.html',
  providers: [ CotizacionService, MasterService, LoginService]
})

export class CotizacionCompradorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: string = '0';
  public esBorrador: string = '0';
  public id_doc:string = '';

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listEstadoCombo: ComboItem[];
  public item: Cotizacion;
  public atencionA: string;  

  public url_main_module_page = '/sm-cotizacion/comprador/buscar';

  public prodAux: ProductoAux[];
  public atributosxProdAux: AtributoxProductoAux[];  
  
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataService:  CotizacionService, private_securityService: LoginService) {
    this.util = new AppUtils(this.router, this._masterService);
    this.item = new Cotizacion();
    this.atencionA='';    
    this.prodAux=[];
    this.atributosxProdAux=[];
  }



  print(event): void {

    //oDetraccionCompradorFormularioComponent.item.moneda_txt = $("#moneda option:selected").text();
    //oRequerimientoCompradorFormularioComponent.item.estado = $("#estadoComprador option:selected").text();
    setTimeout(function () {
        $("div#print-section-material").printArea({ popTitle: 'COTIZACIÓN', mode: "iframe", popClose: false });
    }, 100);
    //hay que chequear en donde imprime esta parte en conformidaad de servicio
  }
  ngOnInit() {

    //oDetraccionCompradorFormularioComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.esBorrador = params ['b'];
      this.id_doc = params['c']
    });

    if (this.id != '0') {
      this.toggleButton = true;

    } else {
      this.esBorrador ='1';
      //this.item.numeroseguimiento
      this.toggleButton = false;
    }
    
    this.util.listEstadoHAS(function (data: ComboItem[]) {

      oCotizacionCompradorFormularioComponent.listEstadoCombo = data;
    });

    oCotizacionCompradorFormularioComponent = this;
  }


  ngAfterViewInit() {
    if (this.id != '0') {
      console.log('this.esBorrador', this.esBorrador);
      let publicada = true;
      if (this.esBorrador === '1')
        publicada = false;
    this._dataService
      .obtener(this.id, publicada)
      .subscribe(
      p => {
        this.item = p;
        this.item.id_doc = this.id_doc
        console.log(this.item);

        if(p.nomusucom.trim()!='')
          oCotizacionCompradorFormularioComponent.atencionA=p.nomusucom.trim();
        else
          oCotizacionCompradorFormularioComponent.atencionA=p.nomorgcom.trim();        
        
        setTimeout(function () {

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


          //console.log(dtArticulos);
          //console.log( dtProveedores);

          dtGenerales.ajax.reload();
          dtArticulos.ajax.reload();
          dtArchivos.ajax.reload();
          //dtDetalleAtributos.ajax.reload();
          //dtProveedores.ajax.reload();
          //dtProveedoresInvitados.ajax.reload();
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
            data: oCotizacionCompradorFormularioComponent.item.atributos

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
      ]
    });

    
    /***------GENERAR SEGUNDA TABLA DEARTICULOS */
    dtArticulos = $('#dtArticulos').DataTable({
      footerCallback: function (row, data, start, end, display) {
          console.log(data);
      },
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {

          oCotizacionCompradorFormularioComponent.prodAux=new Array();
          let productos=oCotizacionCompradorFormularioComponent.item.productos;

          if (productos != null){
            let i = 0;
            for (let objP of productos) {
                let newProdAux:ProductoAux= new ProductoAux();
                newProdAux.idproducto=objP.idproducto;
               // newProdAux.posicion=objP.posicion;               
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

                    if(productos[i].atributos[j].nombre.toUpperCase()=='POSICION' || productos[i].atributos[j].nombre.toUpperCase()=='POSICIÓN' ){
                        newProdAux.posicion=productos[i].atributos[j].valor;
                        newAtribxProdAux.esvisible=false;
                    } else if(productos[i].atributos[j].nombre.toUpperCase()=='CANTIDAD'){
                        newProdAux.cantidadsolicitada=productos[i].atributos[j].valor;
                        newProdAux.cantidadofrecida=productos[i].atributos[j].valor;
                        newAtribxProdAux.esvisible=false;                              
                    } else if(productos[i].atributos[j].nombre.toUpperCase()=='PRECIO'){
                        newProdAux.precio=productos[i].atributos[j].valor;
                        newAtribxProdAux.esvisible=false;                              
                    } else if(productos[i].atributos[j].nombre.toUpperCase()=='UNIDAD DE MEDIDA'){
                        newProdAux.unidad=productos[i].atributos[j].valor;
                        newAtribxProdAux.esvisible=false;                              
                    } else if(productos[i].atributos[j].nombre.toUpperCase()=='FECHA DE ENTREGA'){
                        //newProdAux.fechaentrega=productos[i].atributos[j].valor!=''?DatatableFunctions.FormatDatetimeForDisplay(new Date(productos[i].atributos[j].valor)):new Date;
                        newProdAux.fechaentrega=productos[i].atributos[j].valor!=''?productos[i].atributos[j].valor:'';
                        newAtribxProdAux.esvisible=false;
                    }
                    newProdAux.atributos.push(newAtribxProdAux);
                    j++;
                }
              
                oCotizacionCompradorFormularioComponent.prodAux.push(newProdAux);
                i++;

            }
          }

          let result = {
                data: oCotizacionCompradorFormularioComponent.prodAux
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
      ]
    });




    dtArticulos.on('click', '.atributos', function (event) {
        var $tr = $(this).closest('tr');
        let id = $tr.find("a.atributos").attr('row-id');
        let prodSel = oCotizacionCompradorFormularioComponent.prodAux.find(a => a.idproducto == id  );

      // oCotizacionCompradorFormularioComponent.indiceProdSel=oCotizacionCompradorFormularioComponent.prodAux.indexOf(prodSel);
        oCotizacionCompradorFormularioComponent.atributosxProdAux=prodSel.atributos.filter(x => x.esvisible==true);

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
            data : oCotizacionCompradorFormularioComponent.atributosxProdAux,
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
                if (row.modificable.trim()=='S')
                  return '<input name="producto-'+row.idproductoxrfq+'-atributo-'+row.idatributo+'" type="text" class="form-control"  value="'+row.valorenviado+'" disabled>';
                else
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
      "order": [[1, "asc"]],
      "ajax": function (data, callback, settings) {
        let result = {
          data: oCotizacionCompradorFormularioComponent.item.docadjuntos

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
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'url' },
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2] },
        {
    
          render: function (data, type, row) {

            return '<div class="text-center" ><a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-info btn-icon download text-center" rel="tooltip" title="Bajar Archivo" data-placement="center">' +
              '<i class="material-icons">get_app</i></button></a></div>';
          },
          targets: 3
        }
      ]
    });
  }

 
  ngAfterViewChecked() {
    //this.cdRef.detectChanges();
  }

}