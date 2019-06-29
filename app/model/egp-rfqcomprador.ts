
export class RFQCompradoBuscar {
    id: number;
    nroreq: number;
    descripcion: string;
    estado: string;
    fechacreacion: Date;
    usuariocomprador: string;
    version: string;
    cotizaciones: string;
    tienerespuestas: string;

}

export class RFQCompradorInsert {
 constructor() {

    this.docadjuntos=[];
    this.proveedores=[];
    this.proveedoresinvitados=[];
    this.productos=[];
 }
    public description: string;
    public nroreq: number;

    public prioridad: string;
    public observacion: string;
    public almacen: string;
    public propietario: string;
    public fechainicio: string;
    public fechafin: string;
    public fechainiciod: string;
    public fechafind: string;
    public fechainiciot: string;
    public fechafint: string;
    public moneda: string;
    public estado: string;
    public descuento: string;
    public impuesto: string;
    public otroscostos: string;
    public direcciondeentrega: string;
    public terminosdepago: string;
    public tipodeprecio: string;
    public productos: Producto[];//productos arreglo
    public area: string;
    public mensaje: string;
    public notas: string;
    public comentarios: string;
    public docadjuntos: Archivo[];
    public proveedores: Proveedor[];
    public proveedoresinvitados: ProveedorInvitado[];

  


/*    id: number;*/

}
export class Archivo{
    id:number;
    descripcion:string;

}

export class ProveedorInvitado {
    id:number;
    razonsocial: string;
    ruc: string;
    movil:string;
    email:string;

    
}

export class Proveedor {
    id:number;
    razonsocial: string;
    ruc: string;
    usuario:string;

    
}



export class Producto {
    description: string;
    in_codigoproductoxrfq: number; /* posiscion */
    codigoproducto: number;
    id_rfq: number;
    in_idrfq: number;
    nombreproducto: string;
    descripcionproducto: string;
    nroparte: string;
    cantidad: string;
    unidad: string;
    objetocontrato?: string;
    atributos?:Atributo[];
}

export class Atributo{
    nombre:string;
    operador:string;
    valor:string;
    unidad:string;
    obligatorio:string;
}


