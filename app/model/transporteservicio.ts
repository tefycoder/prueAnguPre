export class TransporteServicioBuscar {
	documentoERP: string;
	estado: string;
	ruccliente: string;
	razonsocialcliente: string;
	fecharecepcion: string;
}

export class TransporteServicioFiltros {
	documentoERP?: string;
	estado?: string;
	fechacreacioninicio?: Date;
	fechacreacionfin?: Date;
	nroguia?: string;
    constructor() {
        this.fechacreacioninicio = new Date();
        this.fechacreacionfin = new Date();
    }
}

export class TransporteServicio {
	documentoERP: string;
	ruccliente: string;
	razonsocialcliente: string;
	rucproveedor: string;
	razonsocialproveedor: string;
	fechaaceptacion: string;
	subtotal: string;
	impuesto: string;
	total: string;
	moneda: string;
	moneda_txt?: string;
	detraccion: string;

	productos: Transporte[];
	
	constructor() {
		this.fechaaceptacion = null;
		this.productos = [];
	}
}

export class Transporte {
	constructor() {
		this.numerotransporte = '';
	}
	idtransporte: string;
	numerotransporte: string;
	fechainicio: string;
	costoproveedor: string;
	costoreferencial: string;
	placa: string;
	pesototal: string;
	unidadpesototal: string;
	confvehiculo: string;
	
	entregas?: Entrega[];
}


export class Entrega {
	numeroguia: string;
	numeroentrega: string;
	peso: string;
	unidadpeso: string;
	costoproveedor: string;
	costoreferencial: string;
}