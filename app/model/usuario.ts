export class Usuario {
    id: string;
    nombreusuario: string;
    nombrecompleto: string;   
    perfil:string;
    url_image:string;
    org_url_image?:string;
    token:string;
    ruc_org?:string;
    isopais_org?: string;

    org_id:string;
    tipo_empresa:string;
    avatar_blob?:any;
    nombreOrgActiva: string;
    keySuscripcion: string;

    organizaciones?: Organizacion[];

    setearDatosDeObjJ(obj){
        this.id=obj.id;
        this.nombreusuario=obj.nombreusuario;
        this.nombrecompleto=obj.nombrecompleto;
        this.perfil=obj.perfil;
        this.url_image=obj.url_image;
        this.org_url_image=obj.org_url_image;
        this.token=obj.token;
        this.ruc_org=obj.ruc_org;                                

        this.isopais_org=obj.isopais_org;
        this.org_id=obj.org_id;
        this.tipo_empresa=obj.tipo_empresa;
        this.avatar_blob=obj.avatar_blob;
        this.nombreOrgActiva=obj.nombreOrgActiva;
        this.keySuscripcion=obj.keySuscripcion;

        this.organizaciones=[];
        for (var i=0; i<obj.organizaciones.length; i++){
            let item = new Organizacion(obj.organizaciones[i].id,
                                        obj.organizaciones[i].nombre ? obj.organizaciones[i].nombre : '',
                                        obj.organizaciones[i].tipo_empresa ? obj.organizaciones[i].tipo_empresa : '',
                                        obj.organizaciones[i].keySuscripcion ? obj.organizaciones[i].keySuscripcion : '',
                                        obj.organizaciones[i].ruc ? obj.organizaciones[i].ruc : '',
                                        obj.organizaciones[i].isoPais ? obj.organizaciones[i].isoPais : '',
                                        obj.organizaciones[i].url_image ? obj.organizaciones[i].url_image:null
                                        );
            this.organizaciones.push(item);
        }

    }

    estaRelacionadoOrgComp(){
        for (var i=0; i<this.organizaciones.length; i++){
            if(this.organizaciones[i].esCompradora()){ return true };
        }
        return false;
    };

    estaRelacionadoOrgProv(){
        for (var i=0; i<this.organizaciones.length; i++){
            if(this.organizaciones[i].esProveedora()){ return true };
        }
        return false;
    };

    estaRelacionadoOrgFinan(){
        for (var i=0; i<this.organizaciones.length; i++){
            if(this.organizaciones[i].esFinanciera()){ return true };
        }
        return false;
    };


    dameOrgComp(){
        var orgArr : Organizacion[] = [];
        for (var i=0; i<this.organizaciones.length; i++){
            if(this.organizaciones[i].esCompradora()){ 
                let org = null;
                org=this.organizaciones[i];
                orgArr.push(org);
            };
        }
        return orgArr;
    };

    dameOrgProv(){
        var orgArr: Organizacion[] = [];
        for (var i=0; i<this.organizaciones.length; i++){
            if(this.organizaciones[i].esProveedora()){ 
                let org = null;
                org=this.organizaciones[i];
                orgArr.push(org);
            };
        }
        return orgArr;
    };

    dameOrgFinan(){
        var orgArr: Organizacion[] = [];
        for (var i=0; i<this.organizaciones.length; i++){
            if(this.organizaciones[i].esFinanciera()){ 
                let org = null;
                org=this.organizaciones[i];
                orgArr.push(org);
            };
        }
        return orgArr;
    };
};


export class Organizacion {
    id: string;
    nombre: string;
    tipo_empresa: string;
    keySuscripcion:string;
    ruc:string;
    isoPais?:string;    
    url_image?:string;

    constructor(id, nombre, tipo_empresa, keySuscripcion, ruc, isoPais, url_image){
        this.id=id;
        this.nombre=nombre;
        this.tipo_empresa=tipo_empresa;
        this.keySuscripcion=keySuscripcion;
        this.ruc=ruc;
        this.url_image=url_image;
        this.isoPais=isoPais;
    };

    esProveedora(){
        let tipos = this.tipo_empresa.split(',');
        for (var i=0; i<tipos.length; i++){
            if(tipos[i].trim().toUpperCase()=='P'){ 
                return true;
            };
        }
        return false;
    };

    esCompradora(){
        let tipos = this.tipo_empresa.split(',');
        for (var i=0; i<tipos.length; i++){
            if(tipos[i].trim().toUpperCase()=='C'){ 
                return true;
            };
        }
        return false;
    };

    esFinanciera(){
        let tipos = this.tipo_empresa.split(',');
        for (var i=0; i<tipos.length; i++){
            if(tipos[i].trim().toUpperCase()=='F'){ 
                return true;
            };
        }
        return false;
    };
};