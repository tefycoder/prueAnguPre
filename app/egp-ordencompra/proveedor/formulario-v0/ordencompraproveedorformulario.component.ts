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
var oOrdenCompraProveedorFormularioComponent;
@Component({
  moduleId: module.id,
  selector: 'ordencompraproveedorformulario-cmp',
  templateUrl: 'ordencompraproveedorformulario.component.html',
  providers: [MasterService]
})

export class OrdenCompraProveedorFormularioComponent implements OnInit, AfterViewInit {

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


    $("div#print-section").printArea({ popTitle: 'OC/OS', mode: "iframe", popClose: false });
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
      nroordencompra: "4510648635",
      proveedor: "INVERSIONES CYS S.A.",
      rucproveedor: "PE20215528791",
      fecharegistro: "Noviembre 28,2017",
      codigoproveedor: '0000000000145',
      flagcambio: 'SI',
      version: '1',
      moneda: 'PEN/SOL', //'0000008'

      atenciona: 'Sr. Reyles Villalobos',
      preparadapor: 'Srta. Katia Leon, Telef: 3150800, email:klean@alicorp.com.pe',
      prioridad: 'Alta',
      nroofertaproveedor: '1',
      peticionofertarfq: '0001212',
      ocdirecta: 'SI',
      estadoweb: 'Aceptada',
      facturara: 'ALICORP RUC: PE20100055237 Av. Argentina Nro. 4793 Carmen de la Legua Reynoso Callao \nTEL:(511) 3150800 Fax:(511) 3150858 / 3150859',
      enviarfacturaa: 'Av. Argentina Nro. 4793 Carmen de la Legua Reynoso Callao TEL:(511) 3150800 \n Fax:(511) 3150858 / 3150859',
      lugardeentrega: 'CENTRO: CD Central & Copsa CD Central & Copsa Av. Argentina # 5027 LIMA',
      terminosdeentrega: 'terminos de entrega',
      consignara: 'ALICORP',
      nroasignacionpresupuestal: '0000012',
      mediotransporte: '',
      fechaenvio: '',
      paisembarque: '',
      regionembarque: '',
      puertodesembarque: '',
      fechaentrega: '',
      embarcador: '',
      embarquesparciales: '',
      condicionesembarque: '',
      aduanas: '',
      polizaseguro: '',

      formato: 'ALI-R-CO-00-002',
      empresaproveedora: 'INVERSIONES CYS SA AV. LA MOLINA 473 ATE 4373344 4373388',
      productos: [
        {
          posicion: '00010',
          micodigo: '00010-4510648635',
          nombre: 'PISO METROPOLIS GRIS MEDIO MATE 60X60',
          cantidad: '4.3200 m2',
          preciounitario: '59.4189',
          total: '256.6900',
          fechaentrega: '31/12/2016',
        },
        {
          posicion: '00020',
          micodigo: '00020-4510648635',
          nombre: 'PISO GEMS PLATA MAT 60X60',
          cantidad: '4.3200 m2',
          preciounitario: '60.9398',
          total: '263.2600',
          fechaentrega: '31/12/2016',
        },
        {
          posicion: '00030',
          micodigo: '00030-4510648635',
          nombre: 'WHITE PLAIN MATTE BO 29.8X60.1',
          cantidad: '193.5000 m2',
          preciounitario: '33.8100',
          total: '6,542.2400',
          fechaentrega: '31/12/2016',
        },
        {
          posicion: '00040',
          micodigo: '00040-4510648635',
          nombre: 'PISO METROPOLIS GRIS MEDIO MATE 60X60',
          cantidad: '299.5200 m2',
          preciounitario: '59.4200',
          total: '17,797.4800',
          fechaentrega: '31/12/2016',
        },
      ],

      consultasdocumentos: '0-800-12542 (desde telefonos fijos)',
      comentarios: '',
      formapago: '',
      autorizadopor: '',
      fechaautorizacion: '',
      subtotal: '24,859.6700',
      descuentos: '0.0000',
      valorventa: '24,859.6700',
      otroscostos: '0.0000',
      impuestos: '4,474.7400',
      valortotal: '29,334.4100',
      comentarioproveedor: '',
    };

    if (this.id != 4510833093) {
      this.item.productos = [
        {
          posicion: '10',
          micodigo: '',
          nombre: '54848 PAGO SRV MES JUNIO 2017',
          cantidad: '',
          preciounitario: '',
          total: '105.3600',
          fechaentrega: '',
        },
        {
          posicion: '10.10',
          micodigo: '10-10',
          nombre: 'RC 201396175',
          cantidad: '1.0000 Serv.',
          preciounitario: '52.6800',
          total: '52.6800',
          fechaentrega: '12/07/2017',
        },
        {
          posicion: '10.20',
          micodigo: '10-20',
          nombre: 'RC 201396176',
          cantidad: '1.0000 Serv.',
          preciounitario: '52.6800',
          total: '52.6800',
          fechaentrega: '12/07/2017',
        },
        {
          posicion: '20',
          micodigo: '',
          nombre: '54848 No AFECTO',
          cantidad: '',
          preciounitario: '',
          total: '1.6400',
          fechaentrega: '',
        },
        {
          posicion: '20.10',
          micodigo: '20-10',
          nombre: 'NO AFECTO',
          cantidad: '1.0000 Serv.',
          preciounitario: '0.8200',
          total: '0.8200',
          fechaentrega: '17/07/2017',
        },
        {
          posicion: '20.20',
          micodigo: '20-20',
          nombre: 'NO AFECTO',
          cantidad: '1.0000 Serv.',
          preciounitario: '0.8200',
          total: '0.8200',
          fechaentrega: '17/07/2017',
        },
      ];


      this.item.subtotal = '107.0000';
      this.item.descuentos = '0.0000';
      this.item.valorventa = '107.0000';
      this.item.otroscostos = '0.0000';
      this.item.impuestos = '0.0000';
      this.item.valortotal = '107.0000';
    }




    oOrdenCompraProveedorFormularioComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listUnidades(function (data: ComboItem[]) {
      oOrdenCompraProveedorFormularioComponent.listUnidadCombo = data;
    });

  }


  ngAfterViewInit() {




    var dtArticulos = $('#dtArticulos').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
      responsive: true,
      language: {
        sUrl: "assets/media/language/Spanish.json",
        search: "_INPUT_",
        searchPlaceholder: "Buscar Registros",
      },
      /* ajax: {
         "url": "https://jsonplaceholder.typicode.com/posts",
         "dataSrc": ""
       },*/

      "ajax": function (data, callback, settings) {
        let result = {
          data: oOrdenCompraProveedorFormularioComponent.item.productos

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
        { data: 'micodigo' },
        { data: 'nombre' },
        { data: 'cantidad' },
        { data: 'preciounitario' },
        { data: 'total' },
        { data: 'fechaentrega' }
      ],
      columnDefs: [


        {
          // The `data` parameter refers to the data for the cell (defined by the
          // `data` option, which defaults to the column being worked with, in
          // this case `data: 0`.
          render: function (data, type, row) {


            return '<a class="mi-codigo-producto" href="javascript:void(0)">' + row.micodigo + '</a>';
          },
          targets: 1
        }
      ]
    });


    swal({
      text: "La Orden de Compra ha sido Visualizada. Se informará al Comprador de la Visualización. Si dentro de un periodo de 24 horas la Orden de Compra no ha sido aceptada o rechazada, esta pasará a ser aceptada de manera automática. ",
      type: 'warning',
      buttonsStyling: false,
      confirmButtonClass: "btn btn-warning"
    });


   


  }


}
