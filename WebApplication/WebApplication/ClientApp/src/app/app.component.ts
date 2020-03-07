import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  isLoad: boolean = true;

  onActivate(event) {
    this.isLoad = false;
  }

  onDeactivate(event) {
    this.isLoad = true;
  }
}
