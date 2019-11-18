import { Component } from '@angular/core';

@Component({
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss'],
  host: {
    class: 'router-flex'
  }
})

export class AboutComponent {
  openLinkedin() {
    const url = 'https://www.linkedin.com/in/richard-gergo-madarasz/';
    const win = window.open(url, '_blank');
    win.focus();
  }
}
