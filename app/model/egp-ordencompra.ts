export class OrdenCompraBuscar {
    nroordencompra2: number;
    estado: string;
    tipoorden: string;
    //organizacioncompradora: string;
    //organizacionproveedora: string;
    comprador: string;
    proveedor: string;
    atenciona: string;
    version: string;    
    total: string;
  //  moneda: string;
    fecharegistro: string;

}

export class OrdenCompraFiltros {
    nroordencompra?: string;
    estado?: string;
    tipoorden: string;  

    /*
    nrorequerimiento?:string;
    bien: boolean;    
    servicio: boolean;    
    obra: boolean;    
    proveedor?: string;
    rucproveedor?: string;
    fechacreacioninicio: Date;
    fechacreacionfin: Date;
    comprador?: string;
    ruccomprador?: string;
  */
}

export class Archivo{
    id:number;
    descripcion:string;

}

export class OrdenCompra {
    constructor(){
        this.fecharegistro= new Date();
    }
    tipo?:string
    comprador?: string;
    ruccomprador?: string;

    proveedor?: string;
    rucproveedor?: string;
    codigoproveedor?: string;


    nroordencompra?: string;
    fecharegistro?: Date;
    flagcambio?: string;
    version?: string;
    moneda?: string;

    atenciona?: string;
    contactarcon?: string;
    preparadapor?: string;
    prioridad?: string;
    nroofertaproveedor?: string;
    peticionofertarfq?: string;
    ocdirecta?: string;
    estadoweb?: string;
    facturara?: string;
    enviarfacturaa?: string;
    lugardeentrega?: string;
    terminosdeentrega?: string;
    consignara?: string;
    nroasignacionpresupuestal?: string;


    mediotransporte?: string;
    fechaenvio?: string;
    paisembarque?: string;
    regionembarque?: string;
    puertodesembarque?: string;
    fechaentrega?: string;
    embarcador?: string;
    embarquesparciales?: string;
    condicionesembarque?: string;
    aduanas?: string;
    polizaseguro?: string;
    formato?: string;
    empresaproveedora?: string;
    productos?: Producto[];
    consultasdocumentos?:string;
    comentarios?:string;
    formapago?:string;
    autorizadopor?:string;
    fechaautorizacion?:string;
    subtotal?:string;
    descuentos?:string;
    valorventa?:string;
    otroscostos?:string;
    impuestos?:string;
    valortotal?:string;
    comentarioproveedor?:string;

    
    fechainiciocontrato?:string;
    fechafincontrato?:string;

     grupocompra?:string;


}


export class Producto {
   
    posicion: string;
    micodigo: string;
    nombre: string;
    cantidad: string;
    preciounitario: string;
    total: string;
    fechaentrega: string;
    unidad?:string

}

