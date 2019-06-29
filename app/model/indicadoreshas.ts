export class reporteHasBuscar {
  ruc: number;
  razonsocial: number;
}

export class reporteHasFiltros {
  ruc?: string;
  razonsocial?: string;
  fechacreacioninicio?: Date;
  fechacreacionfin?: Date;
  constructor() {
    this.fechacreacioninicio = new Date();
    this.fechacreacionfin = new Date();
  }
}

export class reporteBuscar {
  ruc: string;
  razonsocial: string;
  emitidas: number;
  facturadas: number;
}

export class reporteFiltros {
  ruc?: string;
  razonsocial?: string;
  fechacreacioninicio?: Date;
  fechacreacionfin?: Date;
  constructor() {
    this.fechacreacioninicio = new Date();
    this.fechacreacionfin = new Date();
  }
}