//import { Archivo } from "app/model/archivo";
export class RFQCompradoBuscar {
    id: number;
    nrorfq: number;
    descripcion: string;
    estado: string;
    fechacreacion: Date;
    usuariocomprador: string;
    version: string;
    cotizaciones: string;
    tienerespuestas: string;

}
export class RFQFiltros{
    numeroseguimientorfq:string;
    estado:string;
    fechacreacioninicio:Date;
    fechacreacionfin:Date;
    tienerespuestas: string;
}


//DETALLE
export class RFQCompradorInsert {
    constructor() {
        /*this.docadjuntos=[];*/
        this.proveedores=[];
        this.proveedoresinvitados=[];
        this.productos=[];
        this.fechafin = null;
        this.fechainicio = null;
        this.atributos=[];
        this.proveedorDirigido=[];
    }

    public idrfq: string;    
    public nroreq: string;
    public prioridad: string;
    public observacion: string;
    public almacen: string;
    public propietario: string;
    public fechainicio: Date;
    public fechafin: Date;
    public moneda: string;
    public estado: string;

    public rucOrgCompradora: string;
    public logoOrgCompradora: string;

    public area: string;
    public mensaje: string;
    public notas: string;
    public comentarios: string;

    public codestado: string;

    public nomorgcompradora: string;
    /******PARA LA TABLA DE CONDICIONES GENERALES */
    public atributos: Atributo[];
    /******OTRAS TABLAS */
    public productos: Producto[];
    public proveedores: Proveedor[];
    public proveedoresinvitados: ProveedorInvitado[];
    public docadjuntos: Archivo[];
    public proveedorDirigido: ProveedorDirigido[];
}

export class Atributo{
    id: string;
    nombreatributo:string;
    valor:string;
    unidad:string;
    modificable:string;
    mandatorio:string;
    atributovalortipodato: string;
}

export class Producto {
    id: number;
    idproducto: string;
    posicion: string;
    codigoproducto:string;
    nombreproducto:string;
    descripcionproducto:string;
    atributos:AtributoxProducto[];
    /*nroparte:string;
    cantidad:string;
    unidad:string;*/
}

/***************POP-UP DE ARTICULOS DE PRODUCTO */
export class AtributoxProducto{
    nombreatributo:string;
    valorenviado:string;
    nombreunidad:string;
    modificable:string;
    mandatorio:string;
    atributovalortipodato: string;
    idproductoxrfq: string;
    idrfq: string;
    idatributo: string;
}

/************************* */
export class Proveedor {
    usuario:string;
    razonsocial:string;
    //rucproveedordirigido:string; 
    //rucproveedor:string;  
    estado:string;
}

export class ProveedorInvitado {
    razonsocial: string;
    ruc: string;
    email:string;
}

export class ProveedorDirigido {
    razonsocial: string;
    rucproveedordirigido: string;
    codigoorganizacion: string;
    rucproveedor: string;
    codestado: string;
    estado: string;
    codproveedor: string;

    /*usuario: string;*/
    /*idusuario: string;*/
}


export class Archivo{
    nombre:string;
    descripcion:string;
    url:string;
}

export class ProductoAux{
    constructor() {
        this.id = 0;
        this.idproducto = '';
        this.posicion = '';
        this.codigoproducto = '';
        this.nombreproducto = '';
        this.descripcionproducto = '';
        this.nroparte = '';
        this.cantidad = '';
        this.unidad = '';
        this.precio = '';
        this.fechaentrega = null;
        this.atributos = [];
    }

    id: number;
    idproducto: string;    
    posicion: string;
    codigoproducto:string;
    nombreproducto:string;
    descripcionproducto:string;
    nroparte:string;
    cantidad:string;
    unidad:string;
    precio:string;
    fechaentrega: Date;
    atributos: AtributoxProducto[];
}


export class CambioEstado {
    iddoc?: string;
    idorg?: string;
    accion?: string;
}
