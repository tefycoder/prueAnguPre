

export class OrdenCompra {
    index: number;
    tipo?: string
    ruccontratista?: string;
    nroordencompra?: string;

    fecharegistro?: Date;
    fechanotificacion?: Date;
    fechacomprimisopresupuestal?: Date;
    nroexpedientesiaf?: string;
    tipocontratacion?: string;
    objetocontratacion?: string;
    unidadesorganicascontratacion?: string;
    unidadinformante?: string;
    decripcioncontratacion?: string;
    informacioncomplementaria?: string;
    moneda?: string;
    tipocambio?: string;
    estado?: string;
    comentarioproveedor?: string;
    productos?: Producto[];
    subtotal?: string;
    descuentos?: string;
    valorventa?: string;
    otroscostos?: string;
    impuestos?: string;
    valortotal?: string;

    constructor() {
        this.productos = [];
        this.fecharegistro=null;
        this.fechanotificacion=null;
        this.fechacomprimisopresupuestal=null;
    }

}

export class CambioEstado {
  estadoactual: string;
  accion: string;
}

export class Producto {

    posicion: string;
    micodigo: string;
    nombre: string;
    cantidad: string;
    preciounitario: string;
    total: string;
    fechaentrega: string;
    unidad?: string

}

