import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { OrdenCompra } from "app/model/egp-ordencompra";
import '../../../../assets/js/plugins/jquery.PrintArea.js';


declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oOrdenCompraCompradorFormularioComponent;
@Component({
  moduleId: module.id,
  selector: 'ordencompracompradorformulario-cmp',
  templateUrl: 'ordencompracompradorformulario.component.html',
  providers: [MasterService]
})

export class OrdenCompraCompradorFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: number = 0;

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];
  public item: OrdenCompra;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, ) {
    this.util = new AppUtils(this.router, this._masterService);

  }

  print(event): void {
    if (this.id != 4590015491) {
      $("div#print-section-servicio").printArea({ popTitle: 'Orden de Servicio', mode: "iframe", popClose: false });
    }
    else
       $("div#print-section-material").printArea({ popTitle: 'Orden de Compra', mode: "iframe", popClose: false });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id > 0) {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }


    this.item = {
    
      comprador: "PROYECTO ESPECIAL DE INFRAESTRUCTURA DE TRANSPORTE NACIONAL - PROVIAS NACIONAL",
      ruccomprador: "20503503639 ",
      tipo:"Compra",
      nroordencompra: "4590015491",
      proveedor: "Pintado de Edifico S.A",
      rucproveedor: "20100016681",
      fecharegistro: "26-02-2018",
      codigoproveedor: '120',
      flagcambio: 'SI',
      version: '1',
      moneda: 'SOLES', //'0000008'

      atenciona: 'Sr. Jose Rojas \n01-0001 / 945119162 \jrojas@ebizlatin.com ',
      contactarcon: "CABANILLAS HORNA CAROLINA \n01-4001\ccabanillas@proviasnac.gob.pe   ",
      preparadapor: 'Sr. Renzo Montoya',
      
      estadoweb: 'Aceptada',
      facturara: 'PROYECTO ESPECIAL DE INFRAESTRUCTURA DE TRANSPORTE NACIONAL - PROVIAS NACIONAL.\n20503503639 ',
      enviarfacturaa: 'Lunes a viernes de 9 am. a 3pm.',
      
      formapago: 'Dentro de 30 días',
      fechainiciocontrato: '26-02-2018',
      fechafincontrato: '26-03-2017',
      grupocompra:'F01 ',
      productos: [
        {
          posicion: '00001',
          micodigo: '00010-4510648635',
          nombre: 'Pintado de Edificio<br/><b>Centro:</b> JR. ZORRITOS NRO. 1203 LIMA CERCADO LIMA <br/><b>Solicitud de pedido</b>: 001	',
          cantidad: '1.0000',
          unidad:'UND',
          preciounitario: '32.000',
          total: '32.000',
          fechaentrega: '26-03-2018',
        },
        
      ],

      
     // autorizadopor: 'Aprobado Nivel 1: GMENDEZG\nAprobado Nivel 2: CVAZQUEG\nAprobado Nivel 3: CCHAVEZ\nAprobado Nivel 4: VPORTILLO',
      autorizadopor: 'Aprobado Nivel 1: GMENDEZG',
      
      subtotal: '32.000',
      descuentos: '0.000',
      valorventa: '32.000',
      otroscostos: '0.0000',
      impuestos: '0.000',
      valortotal: '32.000',
      
    };

    if (this.id != 4590015491) {
      this.item.nroordencompra="001";
      this.item.proveedor="Pintado de Edificio S.A";
      this.item.rucproveedor="20143229816";
      this.item.codigoproveedor="0001";
      this.item.moneda='SOLES';
      this.item.tipo="Servicio";
      this.item.productos = [
        {
          posicion: '01',
          micodigo: '',
          nombre: 'SRV SUSCRIPCION DIARIOS<br/>SRV SUSCRIPCION DIARIOS',
          cantidad: '',
          unidad:'',
          preciounitario: '',
          total: '32.000',
          fechaentrega: '',
        },
        {
          posicion: '01.01',
          micodigo: '',
          nombre: 'PROVIAS<br/><b>Centro:</b> JR. ZORRITOS NRO. 1203 LIMA CERCADO LIMA - LIMA - LIMA<br/><b>Solicitud de pedido:</b> 0010534244',
          cantidad: '1.0000 ',
          unidad:'',
          preciounitario: '32.000',
          total: '32.000',
          fechaentrega: '26/03-2018',
        },
       
      ];


      this.item.subtotal = '32.000';
      this.item.descuentos = '0.0000';
      this.item.valorventa = '32.000';
      this.item.otroscostos = '0.0000';
      this.item.impuestos = '0.000';
      this.item.valortotal = '32.000';
    }

    oOrdenCompraCompradorFormularioComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listUnidades(function (data: ComboItem[]) {
      oOrdenCompraCompradorFormularioComponent.listUnidadCombo = data;
    });

  }


  ngAfterViewInit() {




    var dtArticulos = $('#dtArticulos').DataTable({
      /*"pagingType": "full_numbers",
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
      responsive: true,
      language: {
        sUrl: "assets/media/language/Spanish.json",
        search: "_INPUT_",
        searchPlaceholder: "Buscar Registros",
      },*/
      /* ajax: {
         "url": "https://jsonplaceholder.typicode.com/posts",
         "dataSrc": ""
       },*/

      "ajax": function (data, callback, settings) {
        let result = {
          data: oOrdenCompraCompradorFormularioComponent.item.productos

        };
        callback(
          result
        );
      },
      "createdRow": function (row, data, index) {


        if (data.posicion === "10" || data.posicion === "20") {
          $(row).addClass('highlight');
          //$('td', row).eq(1).addClass('parent');
        }
        else {
          //$(row).addClass('child');
          $('td', row).eq(0).addClass('text-center');
        }

      },
      columns: [

        { data: 'posicion' },

        { data: 'nombre' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'preciounitario' },
        { data: 'total' },
        { data: 'fechaentrega' }
      ],

    });









  }


}
