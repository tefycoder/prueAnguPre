import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit,  OnChanges, AfterViewInit} from '@angular/core';
import {BASE_URL} from 'app/utils/app.constants';
import {Usuario} from 'app/model/administracion/usuario';
import {Recuperardatos} from 'app/model/administracion/recuperardatos';
declare var $:any;
declare var swal:any;

interface FileReaderEventTarget extends EventTarget {
  result:string
}
interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
var oRecuperarComponent: RecuperarComponent;
@Component({
  moduleId: module.id,
  selector: 'recuperarpassword-cmp',
  templateUrl: 'recuperarpassword.component.html',
})




export class RecuperarComponent implements OnInit, OnChanges, AfterViewInit {
  test : Date = new Date();
  public base_url: string;
  private activatedRoute: ActivatedRoute;
  public usuarios: Usuario[];
  public datoRecuperar: string;
  public viaRecuperacion: string;  

  readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e:FileReaderEvent) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }

}

constructor(private router: Router, private route: ActivatedRoute) {
       
    this.activatedRoute = route;
    this.datoRecuperar = 'contrasenia';
    this.viaRecuperacion = 'email';
  }

  ngOnInit(){
    /*this.checkFullPageBackgroundImage();

    setTimeout(function(){
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700)*/
    var $validator = $('.wizard-card form').validate({
      rules: {
        firstname: {
          required: true,
          minlength: 3
        },
        lastname: {
          required: true,
          minlength: 3
        },
        email: {
          required: true,
          minlength: 3,
        }
        },

        errorPlacement: function(error, element) {
            $(element).parent('div').addClass('has-error');
         }
      });

      // Wizard Initialization
      $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function(tab, navigation, index) {
          var $valid = $('.wizard-card form').valid();
          if(!$valid) {
            $validator.focusInvalid();
            return false;
          }
        },

        onInit : function(tab, navigation, index){

          //check number of tabs and fill the entire row
          var $total = navigation.find('li').length;
          var  $width = 100/$total;
          var $wizard = navigation.closest('.wizard-card');

          var $display_width = $(document).width();

          if($display_width < 600 && $total > 3){
              $width = 50;
          }

           navigation.find('li').css('width',$width + '%');
           var $first_li = navigation.find('li:first-child a').html();
           var $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
           $('.wizard-card .wizard-navigation').append($moving_div);

        //    this.refreshAnimation($wizard, index);
        var total_steps = $wizard.find('li').length;
        var move_distance = $wizard.width() / total_steps;
        var step_width = move_distance;
        move_distance *= index;

        var $current = index + 1;

        if($current == 1){
            move_distance -= 8;
        } else if($current == total_steps){
            move_distance += 8;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
            'transform':'translate3d(' + move_distance + 'px, 0, 0)',
            'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });

           $('.moving-tab').css('transition','transform 0s');
       },

        onTabClick : function(tab, navigation, index){

            var $valid = $('.wizard-card form').valid();

            if(!$valid){
                return false;
            } else{
                return true;
            }
        },

        onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            if($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            var button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function(){
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if( index !== 0 ){
                $(checkbox).css({
                    'opacity':'0',
                    'visibility':'hidden',
                    'position':'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity':'1',
                    'visibility':'visible'
                });
            }

            // this.refreshAnimation($wizard, index);
            var total_steps = $wizard.find('li').length;
            var move_distance = $wizard.width() / total_steps;
            var step_width = move_distance;
            move_distance *= index;

            var $current = index + 1;

            if($current == 1){
                move_distance -= 8;
            } else if($current == total_steps){
                move_distance += 8;
            }

            $wizard.find('.moving-tab').css('width', step_width);
            $('.moving-tab').css({
                'transform':'translate3d(' + move_distance + 'px, 0, 0)',
                'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

            });
        }
    });
  }

  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  ngOnChanges(){
    var input = $(this);
    var target:EventTarget;
    if (input.files && input.files[0]) {
        var reader:any = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}
async enviarDatos(event){
    //let nav= ['/login'];


    let nav = ['/login'];
          oRecuperarComponent.navigate(nav);
console.log('holaaaaaaaaaaaaaa')
}

ngAfterViewInit(){
    $('.wizard-card').each(function(){

        var $wizard = $(this);
        var index = $wizard.bootstrapWizard('currentIndex');
        // this.refreshAnimation($wizard, index);

        var total_steps = $wizard.find('li').length;
        var move_distance = $wizard.width() / total_steps;
        var step_width = move_distance;
        move_distance *= index;

        var $current = index + 1;

        if($current == 1){
            move_distance -= 8;
        } else if($current == total_steps){
            move_distance += 8;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
            'transform':'translate3d(' + move_distance + 'px, 0, 0)',
            'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });

        $('.moving-tab').css({
            'transition': 'transform 0s'
        });
    });
}

}
