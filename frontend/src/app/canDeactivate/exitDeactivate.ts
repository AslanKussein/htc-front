import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "./componentCanDeactivate";
import {CanDeactivate} from "@angular/router";

export class ExitDeactivate implements CanDeactivate<ComponentCanDeactivate>{

  canDeactivate(component: ComponentCanDeactivate) : Observable<boolean> | boolean{
    console.log(1, component.canDeactivate)
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
