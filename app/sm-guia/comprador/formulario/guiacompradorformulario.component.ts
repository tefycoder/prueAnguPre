import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { DetalleOrdenCompra } from "app/model/detalleordencompra";
import { BuscarOrdenCompra } from "app/model/buscarordencompra";
import { ClienteBuscar } from "app/model/cliente";
import { Guia } from "app/model/sm-guia";
import { Archivo } from "app/model/archivo";
import { MasterService } from 'app/service/masterservice';
import { GuiaService } from "app/service/guiaservice";
import { AppUtils } from "app/utils/app.utils";
import { ComboItem } from "app/model/comboitem";
import { AdjuntoService } from "app/service/adjuntoservice";
import 'app/../assets/js/plugins/jquery.PrintArea.js';
import { LoginService } from 'app/service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var moment: any;
declare var $: any;
declare var DatatableFunctions, saveAs: any;
var oGuiaCompradorFormularioComponent: GuiaCompradorFormularioComponent, dtArticulos, dtArchivos, archivo: Archivo;
@Component({
  moduleId: module.id,
  selector: 'guiacompradorformulario-cmp',
  templateUrl: './guiacompradorformulario.component.html',
  providers: [AdjuntoService, GuiaService, MasterService, LoginService]
})

export class GuiaCompradorFormularioComponent implements OnInit, OnChanges, AfterViewInit {

  util: AppUtils;



  public guia: Guia;
  public id: string = '0';
  public toggleButton: boolean = true;
  private activatedRoute: ActivatedRoute;
  public listMotivoGuiaCombo: ComboItem[];
  public listTransporteGuiaCombo: ComboItem[];
  public listUnidadMedidaCombo: ComboItem[];
  public listUnidadMedidaPesoCombo: ComboItem[];
  public listTipoDocIdentidad: ComboItem[];

  public listEstadoCombo: ComboItem[];
  public baseurl: string;
  //public idorgc: string; 
  public botonImprimir: Boton = new Boton();
  public url_main_module_page = '/sm-guia/comprador/buscar';

  constructor(activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, private _dataServiceAdjunto: AdjuntoService, private _dataService: GuiaService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
    this.activatedRoute = activatedRoute;
    this.util = new AppUtils(this.router, this._masterService);
    this.guia = new Guia;
    //this.idorgc = '',
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
          oGuiaCompradorFormularioComponent.configurarBotones(botones);
          oGuiaCompradorFormularioComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { });

    }

  }
  configurarBotones(botones: Boton[]) {

    if (botones && botones.length > 0) {

      this.botonImprimir = botones.find(a => a.nombre === 'imprimir') ? botones.find(a => a.nombre === 'imprimir') : this.botonImprimir;

    }

  }
  print(event): void {
    oGuiaCompradorFormularioComponent.guia.motivoguia_text = $("#motivoguia option:selected").text();
    oGuiaCompradorFormularioComponent.guia.estado_text = $("#estado option:selected").text();
    oGuiaCompradorFormularioComponent.guia.tipodoctransporte_text = $("#tipodoctransporte option:selected").text();
    oGuiaCompradorFormularioComponent.guia.tipotransporte_text = $("#tipotransporte option:selected").text();

    oGuiaCompradorFormularioComponent.guia.totalvolumenund_text = $("#totalvolumenund option:selected").text();
    oGuiaCompradorFormularioComponent.guia.totalpesobrutound_text = $("#totalpesobrutound option:selected").text();

    setTimeout(function () {
      $("div#print-section-guia").printArea({ popTitle: 'GUIA', mode: "iframe", popClose: false });
    }, 200);

  }
  ngOnInit() {
    oGuiaCompradorFormularioComponent = this;

    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != '0') {
      this.toggleButton = true;
      $("#btnAgregarItemOC").addClass('disabled');
      $("#btnEliminarItemOC").addClass('disabled');
    } else {
      this.toggleButton = false;
    }
    this.guia = new Guia();
    this.util.listUnidadMedidaVolumen(function (data: ComboItem[]) {

      oGuiaCompradorFormularioComponent.listUnidadMedidaCombo = data;
    });

    this.util.listUnidadMedidaMasa(function (data: ComboItem[]) {
      oGuiaCompradorFormularioComponent.listUnidadMedidaPesoCombo = data;
    });

    this.util.listMotivoGuia(function (data: ComboItem[]) {

      oGuiaCompradorFormularioComponent.listMotivoGuiaCombo = data;
    });

    this.util.listTransporteGuia(function (data: ComboItem[]) {

      oGuiaCompradorFormularioComponent.listTransporteGuiaCombo = data;
    });

    this.util.listTipoDocIdentidad(function (data: ComboItem[]) {

      oGuiaCompradorFormularioComponent.listTipoDocIdentidad = data;
    });

    this.util.listEstadoGuia(function (data: ComboItem[]) {
      oGuiaCompradorFormularioComponent.listEstadoCombo = data;
    });



  }
  ngAfterViewInit() {

    this._dataService
      .obtener(this.id)
      .subscribe(
      p => {

        this.guia = p;
        // console.log('++++++++++++++AQUIIIIII+++++')
        // var idorgc2 = oGuiaCompradorFormularioComponent.idorgc;
        // idorgc2 = p.idorgcompradora2.trim();
        // console.log(idorgc2)
        localStorage.setItem('idorg',p.idorgcompradora2.trim());
        console.log('otra version de id++++')



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


          dtArticulos.ajax.reload();
          dtArchivos.ajax.reload();
        }, 100);




      },
      e => console.log(e),
      () => { });

    dtArchivos = $('#dtArchivos').on('draw.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, dtArchivos);
    }).DataTable({
      ajax: function (data, callback, settings) {

        let result = {
          data: oGuiaCompradorFormularioComponent.guia.docadjuntos

        };
        callback(
          result
        );
      },
      columns: [


        { data: 'nombre' },
        { data: 'descripcion' },

        { data: 'id' },
      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2] },

        {

          render: function (data, type, row) {


            return '<a class="editar" href="javascript:void(0);" row-id="' + row.id + '">' +
              '<button class="btn btn-simple btn-info btn-icon download" rel="tooltip" title="Bajar Archivo" data-placement="left">' +
              '<i class="material-icons">get_app</i></button></a>';
          },
          targets: 2
        }
      ]

    });


    // Edit record
    dtArchivos.on('click', '.download', function (event) {
      var $tr = $(this).closest('tr');

      let row_id = $tr.find("a.editar").attr('row-id');

      var lista = oGuiaCompradorFormularioComponent.guia.docadjuntos as Archivo[];
      archivo = lista.find(a => a.id == row_id) as Archivo;





      oGuiaCompradorFormularioComponent._dataServiceAdjunto
        .DescargarArchivo(archivo)
        .subscribe(
        blob => {



          saveAs(blob, archivo.nombre);


        },
        e => console.log(e),
        () => { });
      event.preventDefault();

    });


    cargarOrdenCompraDT();
    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges) {

  }

  habilitarEdicion(e) {
    this.toggleButton = false;
    $("#btnAgregarItemOC").removeClass('disabled');
    $("#btnEliminarItemOC").removeClass('disabled');
  }
}




function cargarOrdenCompraDT() {

  dtArticulos = $('#dtArticulos').DataTable({
    order: [[1,"asc"],[2,"asc"]],
     /*
     ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },
     */

    "ajax": function (data, callback, settings) {
      let result = {
        data: oGuiaCompradorFormularioComponent.guia.articulos
      };
      callback(
        result
      );
    },
    columns: [
      { data: 'nroitem' },
      { data: 'nrooc' },
      { data: 'nroitemoc' },
      { data: 'codproducto' },
      { data: 'descproducto' },
      { data: 'unidadmedida' },
      { data: 'cantidadpedido' },
      { data: 'cantidadrecibida' },
      { data: 'cantidadpedido' },
      { data: 'unidadmedidadespacho' },
      { data: 'estado' },
    ],
    columnDefs: [
      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    ]
  });






}