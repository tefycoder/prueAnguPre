

export class Cotizacion {


    public nrocotizacion: string;
    public nroreq: number;
    public organizacioncompradora?: string;
    public atenciona: string;
    public preparadopor: string;
    public fechacreacion?: string;
    public moneda: string;
    public mensaje: string;
    public proveedor?: string;
    public estado?: string;


    public productos?: Producto[];

    public docadjuntos?: Archivo[];

}
export class Producto {
    codigoproducto?: string;
    posicion: number; /* posiscion */
    nombreproducto: string;
    cantidadbase: number;

    unidad: string;
    cantidad: number;
    precio: number;
    adjunto: string;
    fechaentrega: string;
    atributos?: Atributo[];
    objetocontrato?: string;
}

export class Atributo {
    nombre: string;
    operador: string;
    valor: string;
    unidad: string;
    obligatorio: string;
}

export class Archivo {
    id: number;
    descripcion: string;
    nombre: string;

}


export class ProductoEvaluar {
    codigoproducto:string;
    descripcion: string;
    cantidad: string;
    unidad: string;
    fechaentrega: string;
    cotizaciones?: CotizacionProducto[];
}

export class CotizacionProducto {
  codcotizacion: number;
    proveedor: string;
    cantidad: string;
    precio: string;
    preciototal: string;
    equivalencia: string;
    fechaentrega: string;
    cantidadasignada: string;
    cssclass?:string;
    mejorprecio:boolean;
    seleccionado:boolean;
}