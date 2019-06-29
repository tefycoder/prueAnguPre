export class OrdenCompraBuscar {
    nroordencompra: number;
    estado: string;
    tipoorden: string;
    comprador: string;
    proveedor: string;
    empresacompradora?: string;
    atenciona: string;
    version: string;
    total: string;
    fecharegistro: string;

}
export class OrdenCompraFiltros {
    nroordencompra?: string;
    estado?: string;
    material?: boolean;
    servicio?: boolean;
    fechacreacioninicio?: Date;
    fechacreacionfin?: Date;
    constructor() {
        this.fechacreacioninicio = new Date();
        this.fechacreacionfin = new Date();
    }
}

export class CambioEstado {
    estadoactual?: string;
    accion?: string;
    comentario?: string;
    iddoc?: string;
    numeroseguimiento?: string;

}



export class OrdenCompra {
    constructor() {
        this.fecharegistro = new Date();
        this.fechainiciocontrato = new Date();
        this.fechafincontrato = new Date();

        this.aprobadopor = [];

        this.facturara = null;
        this.recepcionfactura = null;
        this.contactarcon_html = '';
        this.creadorpor_html = '';
        this.facturara_html = '';
        this.recepcionfactura_html = '';
        this.autorizadopor_html = '';
        this.atenciona_html = '';
        this.idorgcompradora = '';
        
    }
    id?: string;
    tipo?: string;
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
    atenciona_html?: string;
    contactarcon?: string;
    contactarcon_html?: string;
    creadorpor?: string;
    creadorpor_html?: string;
    prioridad?: string;
    nroofertaproveedor?: string;
    peticionofertarfq?: string;
    ocdirecta?: string;

    estadocomprador?: string;
    estadoproveedor?: string;

    estado_nombre?: string;
    facturara?: FacturarA;
    facturara_texto?: string;
    facturara_html?: string;
    recepcionfactura?: RecepcionFactura;
    recepcionfactura_texto?: string;
    recepcionfactura_html?: string;
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

    consultasdocumentos?: string;
    comentarios?: string;
    formapago?: string;
    autorizadopor?: string;
    autorizadopor_html?: string;
    fechaautorizacion?: string;
    subtotal?: string;
    utilidades?: string;
    valorventa?: string;
    gastosgenerales?: string;
    impuestos?: string;
    porcentaje_impuestos?: string;
    valortotal?: string;
    comentarioproveedor?: string;

    idorgcompradora: string;
    idorgproveedora?: string;
    fechainiciocontrato?: Date;
    fechafincontrato?: Date;

    grupocompra?: string;
    grupocompra_html?: string;
    condiciones?: boolean;
    direccionfactura?: string;
    aprobadopor?: AprobadoPor[];

    terminos?: Termino[];
    narrativa_html?: string;
    tiene_condiciones?: boolean;

    condiciones_generales:string;

}

export class Termino {
    id: number;
    nombre: string;
    valor: string;
}


export class AprobadoPor {
    id: number;
    nombre: string;
}

export class FacturarA {
    razonsocial: string;
    ruc: string;
    direccion: string;
}

export class RecepcionFactura {
    horario: string;
    telefono: string;
    direccion: string;
}
export class Producto {
    
    parentid?: number;
    id: number;
    posicion: string;
    micodigo: string;
    nombre: string;
    descripcion: string;
    cantidad: string;
    cantidadDespachada: string;
    cantidadRecibida: string;    
    preciounitario: string;
    total: string;
    igv: string;
    fechaentrega: string;
    IdProductoOrden: string;
    unidad?: string;
    IdTablaUnidadMedida?: string;
    IdRegistroUnidadMedida?: string;
    atributos?: Atributo[];
    centro?: string;
    solicitudpedido?: string;
    es_subitem: boolean;
    tienesubitem: boolean;
    estado?:string;
    desccorta?: string;
}

export class Atributo {

    nombre: string;
    operador: string;
    valor: string;
    unidad: string;
}

