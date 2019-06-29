import { Routes } from '@angular/router';

import { LoginComponent } from './login.component';

export const LoginRoutes: Routes = [

  /*
  {
    path: 'login',
    component: LoginComponent
  
  },
  */
  {
    path: 'login',
    //component: LoginComponent
    children: [ 
        {
            path: '',
            component: LoginComponent
        },
        /*
        {
            path: ':id',
            component: LoginComponent
        }
        */
    ],
  }
 
];
