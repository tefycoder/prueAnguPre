import { Component, OnInit, Injector, HostListener, AfterViewInit } from '@angular/core';
import { BASE_URL, OCP_APIM_SUBSCRIPTION_KEY, URL_CONSUMER, TIME_INACTIVE } from 'app/utils/app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario, Organizacion } from 'app/model/usuario';
import { Archivo } from 'app/model/archivo';

import { BaseComponent } from 'app/base/base.component';
import { LoginService } from 'app/service/login.service';
import { AdjuntoService } from 'app/service/adjuntoservice';

import { Login } from 'app/model/login';
import { EntidadService } from 'app/facturacion-electronica/general/services/organizacion/entidad.service';
declare var $, DatatableFunctions: any, GlobalFunctions: any;
declare var swal: any;
var oLoginComponent: LoginComponent;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html',
    providers: [LoginService, AdjuntoService]
})

export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit {
    test: Date;
    public base_url: string;
    public usuarios: Usuario[];
    public organizaciones: Organizacion[];
    public usuario: Usuario;
    loading: boolean;
    loginModel: Login;

    id: number;
    private sub: any;
    public logoOrganizacion: string;
    public fondoOrganizacion: string;
    public enabledBtnIniciarSesion: boolean;
    public nombreportal: string;


    constructor(injector: Injector, private router: Router, private route: ActivatedRoute,
               private loginService: LoginService, private adjuntoService: AdjuntoService) {
        super(injector);

        this.loading = false;

        this.test = new Date();
        this.organizaciones = [];
        this.usuario = new Usuario();
        loginService.logout();
        this.base_url = BASE_URL;
        oLoginComponent = this;
        this.enabledBtnIniciarSesion = true;

        this.loginModel = new Login();
        this.loginModel.username = '';
        this.loginModel.password = '';

        // this.nombreportal = 'e-GP';
        this.nombreportal = 'B2MINING 3.0';
        //  this.fondoOrganizacion= './assets/img/logos/default/login.jpg';
    }


    iniciarSesion() {

        if (this.loginModel.username === '') {
            swal({
                text: 'El usuario es un campo requerido.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
        }
        if (this.loginModel.password === '') {
            swal({
                text: 'El password es un campo requerido.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            return false;
        }
        this.loading = true;
        this.uiUtils.showOrHideLoadingScreen(this.loading);
        // let usuario = this.usuarios.find(a=> a.nombreusuario===$("#txtUsuario").val()&& a.contrasenha===$("#txtClave").val());

        this.loginService.login(this.loginModel.username, this.loginModel.password)
            // this.loginService.login(usuario.nombreusuario, usuario.contrasenha)
            .subscribe(
            response => {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                var expireDate = new Date(new Date().getTime() + (1000 * response.expires_in));
                localStorage.setItem('expires', expireDate.getTime().toString());
                localStorage.setItem('expires_in', response.expires_in);

                // window.setup(true);
                // GlobalFunctions.setup(true , TIME_INACTIVE);
                this.loginService.RefreshToken()
                    .subscribe(
                            response => {
                                const obj_response = JSON.parse(response._body);
                                localStorage.setItem('access_token', obj_response.access_token);
                                localStorage.setItem('refresh_token', obj_response.refresh_token);
                                var expireDate = new Date(new Date().getTime() + (1000 * obj_response.expires_in));
                                localStorage.setItem('expires', expireDate.getTime().toString());
                                localStorage.setItem('expires_in', obj_response.expires_in);

                                console.log('response  en REFRESH TOKEN', response);

                                this.ObtenerUsuario();
                            },
                            error => {
                                console.error('error en REFRESH TOKEN', error);
                            },
                            () => { }
                    );

               // this.ObtenerUsuario();
                // this.appUtils.redirect('/home');
            },
            error => {
                this.finishLoading();
                this.messageUtils.showError(error);
                swal({
                    text: 'El usuario o contraseña ingresados no son correctos.',
                    type: 'warning',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-warning'
                });
                console.log('El usuario o contraseña ingresados no son correctos.');
            },
            () => { }
            );

    }



    async ObtenerUsuario() {
        this.usuario = await this.loginService.obtenerUser().toPromise();
        if (this.usuario.url_image && this.usuario.url_image !== '') {
            const archivo = new Archivo();
            archivo.url = this.usuario.url_image;
            this.usuario.avatar_blob = this.adjuntoService.DescargarArchivo(archivo).toPromise();
        }

        const orgComp = this.usuario.dameOrgComp();
        const orgProv = this.usuario.dameOrgProv();
        const orgFinan = this.usuario.dameOrgFinan();


        if ( orgComp.length > 0 && orgProv.length > 0 && orgFinan.length > 0 ) {
            this.finishLoading();
            $('#mdlTipoOrganizacion').modal('show');
        } else if ( orgComp.length > 0 ) {
            this.organizaciones = orgComp;
            this.usuario.tipo_empresa = 'C';

            if (this.organizaciones.length  == 1) {
                let org = this.organizaciones[0];
                this.usuario.org_id = org.id;
                this.usuario.isopais_org = org.isoPais;
                this.usuario.org_url_image = org.url_image;

                this.usuario.keySuscripcion = org.keySuscripcion;
                this.usuario.nombreOrgActiva = org.nombre;
                this.usuario.ruc_org = org.ruc;

                setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            }else {
                this.finishLoading();
                $('#mdlOrganizacion').modal('show');
            }

        } else if ( orgProv.length > 0 ) {
            this.organizaciones = orgProv;
            this.usuario.tipo_empresa = 'P';
            if (this.organizaciones.length == 1) {
                let org = this.organizaciones[0];
                this.usuario.org_id = org.id;
                this.usuario.isopais_org = org.isoPais;
                this.usuario.org_url_image = org.url_image;

                this.usuario.keySuscripcion = org.keySuscripcion;
                this.usuario.nombreOrgActiva = org.nombre;
                this.usuario.ruc_org = org.ruc;

                setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            }else {
                this.finishLoading();
                $('#mdlOrganizacion').modal('show');
            }

        } else if ( orgFinan.length > 0 ) {
            this.organizaciones = orgFinan;
            this.usuario.tipo_empresa = 'F';
            if (this.organizaciones.length == 1) {
                let org = this.organizaciones[0];
                this.usuario.org_id = org.id;
                this.usuario.isopais_org = org.isoPais;
                this.usuario.org_url_image = org.url_image;

                this.usuario.keySuscripcion = org.keySuscripcion;
                this.usuario.nombreOrgActiva = org.nombre;
                this.usuario.ruc_org = org.ruc;

                setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            }else {
                this.finishLoading();
                $('#mdlOrganizacion').modal('show');
            }


/*
            let org = this.organizaciones[0];

            this.usuario.org_id = org.id;
            this.usuario.isopais_org = org.isoPais;
            this.usuario.org_url_image = org.url_image;

            this.usuario.keySuscripcion = org.keySuscripcion;
            this.usuario.nombreOrgActiva = org.nombre;
            this.usuario.ruc_org = org.ruc;

            if(org.tipo_empresa.split(',').length>1){
                this.finishLoading();
                $('#mdlTipoOrganizacion').modal('show');
            }else{
                this.usuario.tipo_empresa = org.tipo_empresa;
                setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);
            }
*/


        } else {
            this.finishLoading();
            swal({
                text: 'El usuario o contraseña ingresados no son correctos.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            console.log('El usuario debe tener al menos una organización asignada');
            return false;
        }

        return false;

        this.organizaciones = this.usuario.organizaciones;

        if (this.organizaciones.length <= 0) {
            this.finishLoading();
            swal({
                text: 'El usuario o contraseña ingresados no son correctos.',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning'
            });
            console.log('El usuario debe tener al menos una organización asignada');
            return false;
        }
        if (this.organizaciones.length > 1) {
            /*setTimeout(function () {
                $("select").each(function () {
                    $(this).keydown();
                    if (!$(this).val() && $(this).val() == '')
                        $(this.parentElement).addClass("is-empty");
                });
            }, 100);*/

            // alert();
            this.finishLoading();
            $('#mdlOrganizacion').modal('show');
        } else {
            let org = this.organizaciones[0];

            /*if (org.nombre.toLowerCase().indexOf("wong") > -1) {
                org.url_image = "wong.png";
            } else if (org.nombre.toLowerCase().indexOf("centenario") > -1) {
                org.url_image = "centenario.png";
            } else if (org.nombre.toLowerCase().indexOf("abinbev") > -1) {
                org.url_image = "abinbev.png";
            }*/

            this.usuario.org_id = org.id;
            this.usuario.isopais_org = org.isoPais;
            this.usuario.org_url_image = org.url_image;

            this.usuario.keySuscripcion = org.keySuscripcion;
            this.usuario.nombreOrgActiva = org.nombre;
            this.usuario.ruc_org = org.ruc;

            /*
            this.usuario.tipo_empresa = 'C';
            this.GuardarSession();
            this.finishLoading();
            */

            if(org.tipo_empresa.split(',').length > 1) {
                this.finishLoading();
                $('#mdlTipoOrganizacion').modal('show');
            }else {
                this.usuario.tipo_empresa = org.tipo_empresa;
               // this.GuardarSession();
                 setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            //    this.finishLoading();
            }
        }
        /*
        if (usuario.perfil == "comprador")
            this.router.navigate(["/ordencompra/comprador/buscar"], { relativeTo: this.route });
        else
            this.router.navigate(["/ordencompra/proveedor/buscar"], { relativeTo: this.route });

        this.finishLoading();
        */
    }



    AceptarOrganizacion(event) {
        this.enabledBtnIniciarSesion= false;

        if (event) {
            event.preventDefault();
        }

        // this.GuardarSession();
        $('#mdlOrganizacion').modal('toggle');
        this.uiUtils.showOrHideLoadingScreen(true);

        let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id) as Organizacion;

        /*
        if (org.nombre.toLowerCase().indexOf("wong") > -1) {
             org.url_image = "wong.png";
         } else if (org.nombre.toLowerCase().indexOf("centenario") > -1) {
             org.url_image = "centenario.png";
         } else if (org.nombre.toLowerCase().indexOf("abinbev") > -1) {
             org.url_image = "abinbev.png";
         }
        */

        this.usuario.isopais_org = org.isoPais;
        this.usuario.org_url_image = org.url_image;

        this.usuario.keySuscripcion = org.keySuscripcion;
        this.usuario.nombreOrgActiva = org.nombre;
        this.usuario.ruc_org = org.ruc;

        setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

        return null;

        //    this.usuario.tipo_empresa = org.tipo_empresa;   

        if (org.tipo_empresa.split(',').length > 1) {
            /// this.finishLoading();
            $('#mdlTipoOrganizacion').modal('show');
        }else {
            this.usuario.tipo_empresa = org.tipo_empresa;
            // this.GuardarSession();
            setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            //    this.finishLoading();
        }

       // setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);
    }

    AceptarTipoOrganizacion(event) {

        if (event) {
            event.preventDefault();
        }

        console.log('AceptarTipoOrganizacion');

       // this.GuardarSession();
            // let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id) as Organizacion;
            // this.usuario.tipo_empresa = org.tipo_empresa;
            // console.log(org);

        $('#mdlTipoOrganizacion').modal('toggle');
        if (this.usuario.tipo_empresa === 'C') {
            this.organizaciones = this.usuario.dameOrgComp();
            if (this.organizaciones.length == 1) {
                let org = this.organizaciones[0];
                this.usuario.org_id = org.id;
                this.usuario.isopais_org = org.isoPais;
                this.usuario.org_url_image = org.url_image;

                this.usuario.keySuscripcion = org.keySuscripcion;
                this.usuario.nombreOrgActiva = org.nombre;
                this.usuario.ruc_org = org.ruc;

                this.usuario.tipo_empresa = 'C';
                setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            }else {
               // this.finishLoading();
                $('#mdlOrganizacion').modal('show');
            }

        } else if (this.usuario.tipo_empresa === 'P') {
            this.organizaciones = this.usuario.dameOrgProv();
            if (this.organizaciones.length == 1) {
                let org = this.organizaciones[0];
                this.usuario.org_id = org.id;
                this.usuario.isopais_org = org.isoPais;
                this.usuario.org_url_image = org.url_image;

                this.usuario.keySuscripcion = org.keySuscripcion;
                this.usuario.nombreOrgActiva = org.nombre;
                this.usuario.ruc_org = org.ruc;

                this.usuario.tipo_empresa = 'P';
                setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

            }else {
                //   this.finishLoading();
                $('#mdlOrganizacion').modal('show');
            }
        }

        // if (this.usuario.organizaciones.length){}
        // setTimeout(function () { oLoginComponent.GuardarSession(); }, 100);

    }



    GuardarSession() {

        localStorage.setItem('usuarioActual', JSON.stringify(this.usuario));

        localStorage.setItem('username', this.usuario.nombreusuario);
        localStorage.setItem('org_id', this.usuario.org_id);        

        /*
        let org = this.usuario.organizaciones.find(a => a.id == this.usuario.org_id);
        localStorage.setItem('Ocp_Apim_Subscription_Key', org.keySuscripcion);
        localStorage.setItem('org_nombre', org.nombre);
        localStorage.setItem('org_ruc', org.ruc);
        localStorage.setItem('tipo_empresa', this.usuario.tipo_empresa);
        */

        localStorage.setItem('Ocp_Apim_Subscription_Key', this.usuario.keySuscripcion);
        localStorage.setItem('org_nombre', this.usuario.nombreOrgActiva);
        localStorage.setItem('org_ruc', this.usuario.ruc_org);
        localStorage.setItem('tipo_empresa', this.usuario.tipo_empresa);


        // DatatableFunctions.ConnectWebsockets(); // No Borrar se  usara cuando se habilite websocket
        console.log('--------consume------');
        this.loginService.obtenerIdEntidad(localStorage.getItem('org_ruc'));


        /******* INICIO Usuarios en duro *******/

            const usuarioAutenticado = this.usuario.nombreusuario.trim().toUpperCase();

            if(usuarioAutenticado === 'CEGP'){
                let menuLateral = '[{"front":"PEB2M","logoFront":"https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png","icon":"assignment","title":"Comprador","modulos":[{"idModulo":"03797780-2568-4da5-92a1-0ef545bf8290","moduloUri":"/egp-requerimiento/comprador/buscar","moduloDesc":"Requerimiento","mini":"RFQ","default":true,"botones":[{"habilitado":true,"visible":true,"idBoton":"43fee381-4cd8-4a57-b5d8-ae074f3cec0a","nombre":"registrarguia","Desc":"Botón de registro de guia","Titulo":"REGISTRAR GUÍA"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa1-9cb1989c7654","nombre":"imprimir","Desc":"Botón de impresión","Titulo":"IMPRIMIR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa2-9cb1989c7654","nombre":"detalle","Desc":"Botón de ver detalle","Titulo":"DETALLE"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa5-9cb1989c7654","nombre":"habilitaredicion","Desc":"Botón de edición","Titulo":"HABILITAR EDICIÓN"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa6-9cb1989c7654","nombre":"guardar","Desc":"Botón de guardado","Titulo":"GUARDAR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa7-9cb1989c7654","nombre":"enviar","Desc":"Botón de envío","Titulo":"ENVIAR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa8-9cb1989c7654","nombre":"descartarborrador","Desc":"Botón de descarte de borrador","Titulo":"DESCARTAR BORRADOR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaaa-9cb1989c7654","nombre":"buscar","Desc":"Botón de búsqueda","Titulo":"BUSCAR"}]},{"idModulo":"5f57907e-d343-415b-820b-18219986219f","moduloUri":"/egp-ordencompra/comprador/buscar","moduloDesc":"Orden de Compra","mini":"OC","default":false},{"idModulo":"080a018f-b407-40cd-91ab-408f5d0fc069","moduloUri":"/egp-calificacion/proveedor/buscar","moduloDesc":"Calificación","mini":"CA","default":false}]}]';
                let moduloUriDefault = '/egp-requerimiento/comprador/buscar';
                console.log('************************* Comprador e-GP ***************');
                localStorage.setItem('menuLateral', menuLateral);
                this.router.navigate([moduloUriDefault], { relativeTo: this.route });
                //   this.uiUtils.showOrHideLoadingScreen(false);
            } else

            if(usuarioAutenticado === 'PEGP'){
                let menuLateral = '[{"front":"PEB2M","logoFront":"https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png","icon":"assignment","title":"Proveedor","modulos":[{"idModulo":"080a018f-b407-40cd-91ab-408f5d0fc069","moduloUri":"/egp-requerimiento/proveedor/buscar","moduloDesc":"Requerimiento","mini":"RFQ","default":true,"botones":[{"habilitado":true,"visible":true,"idBoton":"43fee381-4cd8-4a57-b5d8-ae074f3cec0a","nombre":"registrarguia","Desc":"Botón de registro de guia","Titulo":"REGISTRAR GUÍA"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa1-9cb1989c7654","nombre":"imprimir","Desc":"Botón de impresión","Titulo":"IMPRIMIR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa2-9cb1989c7654","nombre":"detalle","Desc":"Botón de ver detalle","Titulo":"DETALLE"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa5-9cb1989c7654","nombre":"habilitaredicion","Desc":"Botón de edición","Titulo":"HABILITAR EDICIÓN"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa6-9cb1989c7654","nombre":"guardar","Desc":"Botón de guardado","Titulo":"GUARDAR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa7-9cb1989c7654","nombre":"enviar","Desc":"Botón de envío","Titulo":"ENVIAR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaa8-9cb1989c7654","nombre":"descartarborrador","Desc":"Botón de descarte de borrador","Titulo":"DESCARTAR BORRADOR"},{"habilitado":true,"visible":true,"idBoton":"5a5e3e43-73db-457e-aaaa-9cb1989c7654","nombre":"buscar","Desc":"Botón de búsqueda","Titulo":"BUSCAR"}]},{"idModulo":"03797780-2568-4da5-92a1-0ef545bf8290","moduloUri":"/egp-cotizacion/proveedor/buscar","moduloDesc":"Cotización","mini":"CO","default":false},{"idModulo":"5f57907e-d343-415b-820b-18219986219f","moduloUri":"/egp-ordencompra/proveedor/buscar","moduloDesc":"Orden de Compra","mini":"OC","default":false}]}]';
                let moduloUriDefault = '/egp-requerimiento/proveedor/buscar';
                console.log('************************* Proveedor e-GP ***************');                    
                localStorage.setItem('menuLateral', menuLateral);
                this.router.navigate([moduloUriDefault], { relativeTo: this.route });

                //    this.uiUtils.showOrHideLoadingScreen(false);
            } else
/*
            if(usuarioAutenticado=='MSANTACRUZC'){
                //menuLateral = '[{"front":"PEB2M","logoFront":"https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png","icon":"assignment","title":"Proveedor", "modulos" : [] }]';
                let menuLateral = '[{"front":"PEB2M","logoFront":"https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png","icon":"assignment","title":"Comprador", "modulos" : "modulos" : [  { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc001", "moduloUri" : "/sm-requerimiento/comprador/buscar", "moduloDesc" : "Solicitud Cotización", "mini" : "S", "default" : true, "botones" : [ { "idBoton" : "43fee381-4cd8-6a57-b5d8-ae074f3cec0a", "nombre" : "registrarsolicitudcotiza", "Desc" : "Botón de registro de solicitud de cotización", "habilitado" : 1, "visible": true, "Titulo" : "REGISTRAR COTIZACIÓN" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc002", "moduloUri" : "/sm-cotizacion/comprador/buscar", "moduloDesc" : "Cotizaciones", "mini" : "C", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc005", "moduloUri" : "/sm-ordencompra/comprador/buscar", "moduloDesc" : "Orden de Compra", "mini" : "OC", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaa3-9cb1989c7654", "nombre" : "aceptar", "Desc" : "Botón de aceptación", "habilitado" : 1, "visible": true, "Titulo" : "ACEPTAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa4-9cb1989c7654", "nombre" : "rechazar", "Desc" : "Botón de rechazo", "habilitado" : 1, "visible": true, "Titulo" : "RECHAZAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa9-9cb1989c7654", "nombre" : "limpiar", "Desc" : "Botón de limpiar", "habilitado" : 1, "visible": true, "Titulo" : "LIMPIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc006", "moduloUri" : "/sm-guia/comprador/buscar", "moduloDesc" : "Guías", "mini" : "G", "default" : false, "botones" : [ { "idBoton" : "43fee381-4cd8-4a57-b5d8-ae074f3cec0a", "nombre" : "registrarguia", "Desc" : "Botón de registro de guia", "habilitado" : 1, "visible": true, "Titulo" : "REGISTRAR GUÍA" }, { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaa5-9cb1989c7654", "nombre" : "habilitaredicion", "Desc" : "Botón de edición", "habilitado" : 1, "visible": true, "Titulo" : "HABILITAR EDICIÓN" }, { "idBoton" : "5a5e3e43-73db-457e-aaa6-9cb1989c7654", "nombre" : "guardar", "Desc" : "Botón de guardado", "habilitado" : 1, "visible": true, "Titulo" : "GUARDAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa7-9cb1989c7654", "nombre" : "enviar", "Desc" : "Botón de envío", "habilitado" : 1, "visible": true, "Titulo" : "ENVIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa8-9cb1989c7654", "nombre" : "descartarborrador", "Desc" : "Botón de descarte de borrador", "habilitado" : 1, "visible": true, "Titulo" : "DESCARTAR BORRADOR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa9-9cb1989c7654", "nombre" : "limpiar", "Desc" : "Botón de limpiar", "habilitado" : 1, "visible": true, "Titulo" : "LIMPIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "5f57907e-d343-415b-820b-18219986219f", "moduloUri" : "/conformidadservicio/comprador/buscar", "moduloDesc" : "Hoja de Aceptación", "mini" : "HAS", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaa9-9cb1989c7654", "nombre" : "limpiar", "Desc" : "Botón de limpiar", "habilitado" : 1, "visible": true, "Titulo" : "LIMPIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc007", "moduloUri" : "/sm-factura/comprador/buscar", "moduloDesc" : "Comprobante de Pago", "mini" : "CP", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" }, { "idBoton" : "d5f78ab9-a8c6-4191-bdee-c4d7f84835b8", "nombre" : "registrarcomprobante", "Desc" : "Botón de registro de comprobante", "habilitado" : 1, "visible": true, "Titulo" : "REGISTRAR COMPROBANTE" } ] },{ "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc003", "moduloUri" : "/sm-retencion/comprador/buscar", "moduloDesc" : "Retenciones", "mini" : "R", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc004", "moduloUri" : "/sm-detraccion/comprador/buscar", "moduloDesc" : "Detracciones", "mini" : "D", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }] }]';
                let moduloUriDefault = '/sm-requerimiento/comprador/buscar';

                console.log('************************* Comprador MSANTACRUZ ***************');  
                localStorage.setItem("RootMenu",'{"menus":'+menuLateral+',"moduloUriDefault":"'+moduloUriDefault+'"}');
                localStorage.setItem('menuLateral', menuLateral);
                this.router.navigate([moduloUriDefault], { relativeTo: this.route });
            } else
*/
            if ( usuarioAutenticado === '20268214527' || usuarioAutenticado === '20537358433' ||
                usuarioAutenticado === '20111740438' || usuarioAutenticado === '20100202396' ||
                /*usuarioAutenticado === '20100028698' ||*/ usuarioAutenticado === '20100049181') {
                const menuLateral = '[{"front":"PEB2M","logoFront":"https://sab2md.blob.core.windows.net/public-dev/org/logos/b2mining-ico.png","icon":"assignment","title":"Proveedor", "modulos" : [  { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc001", "moduloUri" : "/sm-requerimiento/proveedor/buscar", "moduloDesc" : "Solicitud Cotización", "mini" : "S", "default" : true, "botones" : [ { "idBoton" : "43fee381-4cd8-6a57-b5d8-ae074f3cec0a", "nombre" : "registrarsolicitudcotiza", "Desc" : "Botón de registro de solicitud de cotización", "habilitado" : 1, "visible": true, "Titulo" : "REGISTRAR COTIZACIÓN" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc002", "moduloUri" : "/sm-cotizacion/proveedor/buscar", "moduloDesc" : "Cotizaciones", "mini" : "C", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc005", "moduloUri" : "/sm-ordencompra/proveedor/buscar", "moduloDesc" : "Orden de Compra", "mini" : "OC", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaa3-9cb1989c7654", "nombre" : "aceptar", "Desc" : "Botón de aceptación", "habilitado" : 1, "visible": true, "Titulo" : "ACEPTAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa4-9cb1989c7654", "nombre" : "rechazar", "Desc" : "Botón de rechazo", "habilitado" : 1, "visible": true, "Titulo" : "RECHAZAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa9-9cb1989c7654", "nombre" : "limpiar", "Desc" : "Botón de limpiar", "habilitado" : 1, "visible": true, "Titulo" : "LIMPIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc006", "moduloUri" : "/sm-guia/proveedor/buscar", "moduloDesc" : "Guías", "mini" : "G", "default" : false, "botones" : [ { "idBoton" : "43fee381-4cd8-4a57-b5d8-ae074f3cec0a", "nombre" : "registrarguia", "Desc" : "Botón de registro de guia", "habilitado" : 1, "visible": true, "Titulo" : "REGISTRAR GUÍA" }, { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaa5-9cb1989c7654", "nombre" : "habilitaredicion", "Desc" : "Botón de edición", "habilitado" : 1, "visible": true, "Titulo" : "HABILITAR EDICIÓN" }, { "idBoton" : "5a5e3e43-73db-457e-aaa6-9cb1989c7654", "nombre" : "guardar", "Desc" : "Botón de guardado", "habilitado" : 1, "visible": true, "Titulo" : "GUARDAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa7-9cb1989c7654", "nombre" : "enviar", "Desc" : "Botón de envío", "habilitado" : 1, "visible": true, "Titulo" : "ENVIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa8-9cb1989c7654", "nombre" : "descartarborrador", "Desc" : "Botón de descarte de borrador", "habilitado" : 1, "visible": true, "Titulo" : "DESCARTAR BORRADOR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa9-9cb1989c7654", "nombre" : "limpiar", "Desc" : "Botón de limpiar", "habilitado" : 1, "visible": true, "Titulo" : "LIMPIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "5f57907e-d343-415b-820b-18219986219f", "moduloUri" : "/conformidadservicio/proveedor/buscar", "moduloDesc" : "Hoja de Aceptación", "mini" : "HAS", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaa9-9cb1989c7654", "nombre" : "limpiar", "Desc" : "Botón de limpiar", "habilitado" : 1, "visible": true, "Titulo" : "LIMPIAR" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc007", "moduloUri" : "/sm-factura/proveedor/buscar", "moduloDesc" : "Comprobante de Pago", "mini" : "CP", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa1-9cb1989c7654", "nombre" : "imprimir", "Desc" : "Botón de impresión", "habilitado" : 1, "visible": true, "Titulo" : "IMPRIMIR" }, { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" }, { "idBoton" : "d5f78ab9-a8c6-4191-bdee-c4d7f84835b8", "nombre" : "registrarcomprobante", "Desc" : "Botón de registro de comprobante", "habilitado" : 1, "visible": true, "Titulo" : "REGISTRAR COMPROBANTE" } ] },{ "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc003", "moduloUri" : "/sm-retencion/proveedor/buscar", "moduloDesc" : "Retenciones", "mini" : "R", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }, { "idModulo" : "01134ee2-c8e3-4f3d-a4c7-aaabbbccc004", "moduloUri" : "/sm-detraccion/proveedor/buscar", "moduloDesc" : "Detracciones", "mini" : "D", "default" : false, "botones" : [ { "idBoton" : "5a5e3e43-73db-457e-aaa2-9cb1989c7654", "nombre" : "detalle", "Desc" : "Botón de ver detalle", "habilitado" : 1, "visible": true, "Titulo" : "DETALLE" }, { "idBoton" : "5a5e3e43-73db-457e-aaaa-9cb1989c7654", "nombre" : "buscar", "Desc" : "Botón de búsqueda", "habilitado" : 1, "visible": true, "Titulo" : "BUSCAR" } ] }]  }]';
                const moduloUriDefault = '/sm-requerimiento/proveedor/buscar';

                console.log('************************* Proveedor '+usuarioAutenticado+' ***************');
                localStorage.setItem('RootMenu', '{"menus":' + menuLateral + ',"moduloUriDefault":"' + moduloUriDefault + '"}');   
                localStorage.setItem('menuLateral', menuLateral);
                this.router.navigate([moduloUriDefault], { relativeTo: this.route });
         //       this.uiUtils.showOrHideLoadingScreen(false);
            } else {

        /******* FIN Usuarios en duro *******/


                this.loginService.obtenerMenu()
                // this.loginService.login(usuario.nombreusuario, usuario.contrasenha)
                .subscribe(
                data => {

                    if ( usuarioAutenticado === 'ADMINEBIZ' ) {
                        data.menus[0].title = 'Admin. del Sistema';
                    }

                    GlobalFunctions.setup(true, TIME_INACTIVE);
                    DatatableFunctions.ConnectWebsockets(URL_CONSUMER);

                    const menuLateral = JSON.stringify(data.menus);
                    const moduloUriDefault = data.moduloUriDefault;

                    localStorage.setItem('menuLateral', menuLateral);
                    this.router.navigate([moduloUriDefault], { relativeTo: this.route });
                    // this.uiUtils.showOrHideLoadingScreen(false);

                },
                error => {
                    this.messageUtils.showError(error);
                },
                () => { }
                );

            //    this.uiUtils.showOrHideLoadingScreen(false);
        /******* INICIO QUITAR LLAVE Usuarios en duro *******/
            }
        /******* FIN QUITAR LLAVE Usuarios en duro *******/

    }



    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    }



    olvidoCuentas(){
        this.router.navigate(['/recuperarpassword'], { relativeTo: this.route });
    }


    ngOnInit() {
        GlobalFunctions.StopTimer();
        DatatableFunctions.DisconnectWebsockets();

        this.logoOrganizacion = './assets/img/logos/default/logo.jpg';
        this.fondoOrganizacion = 'cunamas';

        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number

            console.log(this.id);
           // alert(params);
            // In a real app: dispatch action to load the details here.
        });

        this.checkFullPageBackgroundImage();
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)

        setTimeout(function () {
            $('select').each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() === '') {
                    $(this.parentElement).addClass('is-empty');
                }
            });
        }, 100);
    }

    ngAfterViewInit() {

      //  $('#fondoLogin').attr('data-image','./assets/img/logos/panamericanos/login.jpg')

        DatatableFunctions.ModalSettings();
        this.uiUtils.addOrRemoveBodyBackGround(true, 'bckgrd-50percent-login');
        this.uiUtils.addOrRemoveStyleFooter(true, 'fixed_full');
        $('#txtUsuario').focus();

        // this.usuario.tipo_empresa='C';
        // $('select[name*=tipo_org] option[value=C]').prop('selected',true);
        // $("#tipo_org").prop('checked', true);

        setTimeout(function () {
            $('input').each(function () {
                $(this).keydown();
                if (!$(this).val() && $(this).val() === '') {
                    $(this.parentElement).addClass('is-empty');
                }
            });
            $('select').each(function () {
                $(this).val('');
                $(this).keydown();
                $(this.parentElement).addClass('is-empty');

                /*
                $(this).keydown();
                if (!$(this).val() && $(this).val() == '')
                    $(this.parentElement).addClass("is-empty");
                */

            });
            $('textarea').each(function () {
            $(this).keydown();
            if (!$(this).val() && $(this).val() === '') {
                $(this.parentElement).addClass('is-empty');
            }
            });
        }, 100);

    }

    ngOnDestroy() {
        this.uiUtils.addOrRemoveBodyBackGround(false, 'bckgrd-50percent-login');
        this.uiUtils.addOrRemoveStyleFooter(false, 'fixed_full');

        this.sub.unsubscribe();
    }

    finishLoading() {
        this.loading = false;
        this.uiUtils.showOrHideLoadingScreen(this.loading);
    }

    @HostListener('document:keydown', ['$event'])
    public manejador(event: KeyboardEvent): void {
        if (event.keyCode == 13) {
            if ($("#txtUsuario").is(":focus") || $("#txtClave").is(":focus")) {
                $("#btnLogin").focus();
            }
        }
    }
}
