import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import {A2Edatetimepicker} from './directives/datepicker.module';

import { ServiceModule } from './service/service.module';
import { BaseComponent } from './base/base.component';
import { UtilsModule } from './utils/utils.module';
// import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastrModule } from 'ngx-toastr';
import {AuthGuardService} from 'app/service/auth-guard.service';
import { PersistenceModule } from 'angular-persistence';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LoadingModule ,ANIMATION_TYPES} from 'ngx-loading';
import {SpinnerService} from './service/spinner.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    imports: [
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        A2Edatetimepicker,
        ServiceModule,
        UtilsModule,
        PersistenceModule,
        HttpClientModule,
        LoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        })
    ],
    declarations: [
        AppComponent,
        BaseComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
    ],
    bootstrap:    [ AppComponent ],
    providers: [AuthGuardService,SpinnerService
    ]
})
export class AppModule { }
