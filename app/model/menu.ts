export class RootMenu{
  moduloUriDefault:string;
  menus: Menu[]
}
export class Menu {

  front: string;
  logoFront: string;
  icon: string;
  title: string;
  modulos: Modulo[];
  
}

export class Modulo {
  idModulo: string;
  logoFront: string;
  moduloUri: string;
  moduloDesc: string;
  mini: string;
  default: boolean;
  botones?: Boton[];
}

export class Boton {
  constructor(){
    this.habilitado=false;
    this.visible= true;
  }
  idBoton: string;
  nombre: string;
  Desc: string;
  habilitado: boolean;
  visible: boolean;
  Titulo?: string;
}