import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable()
export class UsabilitiesService {

  constructor(

  ) {

  }

  public touchForm(form: FormGroup) {
    (<any>Object).values(form.controls).forEach(control => {
      if (control.controls) this.touchForm(control);
      else control.markAsTouched();
    });
  }

  public extractHostname(url: string) {
    let hostname: string;

    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    }
    else {
      hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
  }


}
