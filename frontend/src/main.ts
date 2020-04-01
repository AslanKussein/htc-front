import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Keycloak from 'keycloak-js'

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

//
// //keycloak init options
// let initOptions = {
//   url: 'https://idp-htc.dilau.kz/auth/realms/master/protocol/openid-connect/auth?client_id=security-admin-console&state=78ccb4eb-e78f-4d03-8f3f-d8ec432ba7c2&response_mode=fragment&response_type=code&scope=openid&nonce=a0cf359b-60cf-4c9b-a26b-950483709287', realm: 'htc', clientId: 'htc'
// }
//
// let keycloak = Keycloak(initOptions);
//
// keycloak.redirectUri = 'http://localhost:4200/ ';
// // keycloak.redirectUri = 'https://idp-htc.dilau.kz/auth/admin/master/console/';
//
// keycloak.init({ onLoad: "login-required" }).success((auth) => {
//
//   if (!auth) {
//     window.location.reload();
//   } else {
//     console.log("Authenticated");
//   }
//
//   //bootstrap after authentication is successful.
//   platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch(err => console.error(err));
//
//
//   localStorage.setItem("ang-token", keycloak.token);
//   localStorage.setItem("ang-refresh-token", keycloak.refreshToken);
//
//   setTimeout(() => {
//     keycloak.updateToken(70).success((refreshed) => {
//       if (refreshed) {
//         console.debug('Token refreshed' + refreshed);
//       } else {
//         console.warn('Token not refreshed, valid for '
//           + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
//       }
//     }).error(() => {
//       console.error('Failed to refresh token');
//     });
//
//
//   }, 60000)
//
// }).error(() => {
//   console.error("Authenticated Failed");
// });
