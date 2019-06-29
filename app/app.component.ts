import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd  } from '@angular/router';
import { UIUtils } from './utils/ui.utils';
import {TranslateService} from '@ngx-translate/core';
import * as Idiomas from './facturacion-electronica/general/models/configuracionDocumento/idioma';
import {SpinnerService} from './service/spinner.service';

declare var $:any;
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit{
    public loading = false;
    constructor(private elRef:ElementRef, private router: Router, private uiUtils: UIUtils,public traduccion: TranslateService ,public spinnerService:SpinnerService ) {
        this.traduccion.setDefaultLang(Idiomas.IDIOMA_ES.descripcionCorta.toLowerCase());
       // this.loading=spinnerService.loading;
      this.spinnerService.set(false).subscribe(
        data=>{
          this.loading=data;
        }, err => {
            this.loading = false;
            //...
        });
    }
//, private router: Router
    ngOnInit(){
        let body = document.getElementsByTagName('body')[0];
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows){
           // if we are on windows OS we activate the perfectScrollbar function
            body.classList.add("perfect-scrollbar-on");
        } else {
            body.classList.add("perfect-scrollbar-off");
        }
        $.material.init();

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
            if (isWindows){
             var $main_panel = $('.main-panel');

                //$main_panel.scrollTop=0;
                $main_panel.perfectScrollbar().animate({scrollTop: 0});

                $main_panel.perfectScrollbar('update');
            }
            $("div.modal.fade").each(function () {
                $(this).on('shown.bs.modal', function () {
                    $(window).resize();
                })
            });
        });
    }

    ngAfterViewInit() {
        this.uiUtils.showOrHideLoadingScreen(false);

        // Run correctHeight function on load and resize window event
        this.uiUtils.correctHeightOnResize();

        // Correct height of wrapper after metisMenu animation.
        this.uiUtils.correctHeightOnMenuAnimation();
    }

}
