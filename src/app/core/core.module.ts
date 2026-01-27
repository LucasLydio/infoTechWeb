import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptorService } from './services/api.interceptor/api.interceptor.service'; // ajuste o path se necessário

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true }
    // Adicione outros serviços globais aqui, se necessário
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule já foi importado. Importe apenas no AppModule!');
    }
  }
}
