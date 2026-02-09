// graduation-cap-mascot.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-graduation-cap-mascot',
  standalone: true,
  imports: [],
  templateUrl: './graduation-cap-mascot.component.html',
  styleUrls: ['./graduation-cap-mascot.component.scss'],
  animations: [
    trigger('float', [
      state('up', style({ transform: 'translateY(-6px)' })),
      state('down', style({ transform: 'translateY(6px)' })),
      transition('up <=> down', animate('3s ease-in-out'))
    ]),
    trigger('blink', [
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0.1 })),
      transition('open => closed', animate('100ms')),
      transition('closed => open', animate('100ms'))
    ]),
    trigger('tasselSwing', [
      state('left', style({ transform: 'rotate(-6deg)', transformOrigin: '70px 50px' })),
      state('right', style({ transform: 'rotate(6deg)', transformOrigin: '70px 50px' })),
      transition('left <=> right', animate('2s ease-in-out'))
    ]),
    trigger('bookOpen', [
      state('closed', style({ transform: 'perspective(400px) rotateX(0deg)' })),
      state('open', style({ transform: 'perspective(400px) rotateX(-5deg)' })),
      transition('closed <=> open', animate('800ms ease-in-out'))
    ])
  ]
})
export class GraduationCapMascotComponent implements OnInit, OnDestroy {
  floatState: 'up' | 'down' = 'up';
  blinkState: 'open' | 'closed' = 'open';
  tasselState: 'left' | 'right' = 'left';
  bookState: 'closed' | 'open' = 'closed';
  
  private intervals: any[] = [];
  private timeouts: any[] = [];

  ngOnInit() {
    this.intervals.push(
      setInterval(() => {
        this.floatState = this.floatState === 'up' ? 'down' : 'up';
      }, 3000)
    );

    this.intervals.push(
      setInterval(() => {
        this.blinkState = 'closed';
        setTimeout(() => {
          this.blinkState = 'open';
        }, 100);
      }, 4000 + Math.random() * 2000)
    );

    this.intervals.push(
      setInterval(() => {
        this.tasselState = this.tasselState === 'left' ? 'right' : 'left';
      }, 2000)
    );

    this.intervals.push(
      setInterval(() => {
        this.bookState = 'open';
        setTimeout(() => {
          this.bookState = 'closed';
        }, 800);
      }, 6000)
    );
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

  onHover() {
    this.bookState = 'open';
  }

  onLeave() {
    this.timeouts.push(
      setTimeout(() => {
        this.bookState = 'closed';
      }, 500)
    );
  }
}