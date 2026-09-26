import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './disclaimer.css',
  templateUrl: './disclaimer.html'
})
export class Disclaimer implements OnInit {
isVisible: boolean = false;
  dontShowAgain: boolean = false;

  ngOnInit(): void {
    const hasAccepted = localStorage.getItem('pageStack_disclaimer_accepted');
    if (!hasAccepted) {
      this.isVisible = true;
    }
  }

  acceptDisclaimer(): void {
    if (this.dontShowAgain) {
      localStorage.setItem('pageStack_disclaimer_accepted', 'true');
    }
    this.isVisible = false;
  }

  dismissModal(): void {
    this.isVisible = false;
  }
}
  