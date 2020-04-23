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

}
