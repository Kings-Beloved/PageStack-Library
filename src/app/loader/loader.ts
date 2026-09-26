import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './loader.css',
  templateUrl: './loader.html',
})
export class Loader implements OnInit, OnDestroy {
  @Input() targetRoute: string = '/';
  @Input() subtitleText: string = 'Connecting to library space...';

  private timeoutId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Navigate automatically after 4 seconds (4000ms)
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['dashboard'], {replaceUrl:true})
    }, 10000);
  
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}