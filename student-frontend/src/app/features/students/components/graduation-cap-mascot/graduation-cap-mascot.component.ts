// graduation-cap-mascot.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-graduation-cap-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cap-container" [@float]="floatState">
      <svg 
        class="cap-svg" 
        width="140" 
        height="140" 
        viewBox="0 0 140 140"
        (mouseenter)="onHover()"
        (mouseleave)="onLeave()">
        
        <!-- Modern Minimalist Graduation Cap -->
        <g class="graduation-cap">
          <!-- Main mortarboard (flat top) -->
          <path 
            d="M 25 50 L 70 35 L 115 50 L 70 65 Z" 
            fill="url(#capGradient)"
            stroke="#1f2937"
            stroke-width="1.5"/>
          
          <!-- 3D depth effect -->
          <path 
            d="M 70 65 L 115 50 L 115 52 L 70 67 Z" 
            fill="#000000"
            opacity="0.15"/>
          
          <!-- Cap cylinder -->
          <rect 
            x="60" 
            y="50" 
            width="20" 
            height="18" 
            rx="1"
            fill="#1f2937"
            stroke="#374151"
            stroke-width="1"/>
          
          <!-- Top rim -->
          <ellipse 
            cx="70" 
            cy="50" 
            rx="10" 
            ry="3" 
            fill="#111827"/>
          
          <!-- Bottom rim -->
          <ellipse 
            cx="70" 
            cy="68" 
            rx="10" 
            ry="3" 
            fill="#000000"
            opacity="0.2"/>
          
          <!-- Center button (gold accent) -->
          <circle 
            cx="70" 
            cy="50" 
            r="3" 
            fill="#facc15"
            stroke="#f59e0b"
            stroke-width="0.5"/>
          
          <!-- Elegant tassel -->
          <g class="tassel" [@tasselSwing]="tasselState">
            <line 
              x1="70" 
              y1="50" 
              x2="88" 
              y2="70" 
              stroke="#facc15" 
              stroke-width="2" 
              stroke-linecap="round"/>
            
            <circle 
              cx="88" 
              cy="72" 
              r="4" 
              fill="#facc15"
              stroke="#f59e0b"
              stroke-width="0.5"/>
            
            <!-- Tassel threads -->
            <line x1="88" y1="76" x2="86" y2="84" stroke="#facc15" stroke-width="1" opacity="0.6"/>
            <line x1="88" y1="76" x2="88" y2="85" stroke="#facc15" stroke-width="1" opacity="0.6"/>
            <line x1="88" y1="76" x2="90" y2="84" stroke="#facc15" stroke-width="1" opacity="0.6"/>
          </g>
        </g>

        <!-- Minimal Professional Eyes (simple dots) -->
        <g class="eyes" [@blink]="blinkState">
          <!-- Left eye - simple elegant dot -->
          <circle cx="55" cy="85" r="3" fill="#111827"/>
          <circle cx="56" cy="84" r="1" fill="white" opacity="0.8"/>
          
          <!-- Right eye - simple elegant dot -->
          <circle cx="85" cy="85" r="3" fill="#111827"/>
          <circle cx="86" cy="84" r="1" fill="white" opacity="0.8"/>
        </g>

        <!-- Subtle smile (minimal curve) -->
        <path 
          d="M 58 95 Q 70 100 82 95" 
          stroke="#374151" 
          stroke-width="2" 
          fill="none" 
          stroke-linecap="round"
          opacity="0.6"/>

        <!-- Open book below (knowledge symbol) -->
        <g class="book" [@bookOpen]="bookState">
          <path 
            d="M 45 110 L 45 125 L 68 122 L 68 107 Z" 
            fill="#ffffff"
            stroke="#d1d5db"
            stroke-width="1.5"/>
          
          <path 
            d="M 72 107 L 72 122 L 95 125 L 95 110 Z" 
            fill="#ffffff"
            stroke="#d1d5db"
            stroke-width="1.5"/>
          
          <!-- Book pages -->
          <line x1="50" y1="113" x2="63" y2="112" stroke="#e5e7eb" stroke-width="0.5"/>
          <line x1="50" y1="117" x2="63" y2="116" stroke="#e5e7eb" stroke-width="0.5"/>
          <line x1="50" y1="121" x2="63" y2="120" stroke="#e5e7eb" stroke-width="0.5"/>
          
          <line x1="77" y1="112" x2="90" y2="113" stroke="#e5e7eb" stroke-width="0.5"/>
          <line x1="77" y1="116" x2="90" y2="117" stroke="#e5e7eb" stroke-width="0.5"/>
          <line x1="77" y1="120" x2="90" y2="121" stroke="#e5e7eb" stroke-width="0.5"/>
          
          <!-- Center binding with gold accent -->
          <rect x="68" y="107" width="4" height="15" fill="#facc15" opacity="0.3"/>
        </g>

        <!-- Gradient Definitions -->
        <defs>
          <linearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#111827;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>

    </div>
  `,
  styles: [`
    .cap-container {
      position: relative;
      display: inline-block;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
    }

    .cap-svg {
      display: block;
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cap-svg:hover {
      transform: translateY(-4px);
    }

    .graduation-cap {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  `],
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
    // Subtle floating
    this.intervals.push(
      setInterval(() => {
        this.floatState = this.floatState === 'up' ? 'down' : 'up';
      }, 3000)
    );

    // Minimal blinking
    this.intervals.push(
      setInterval(() => {
        this.blinkState = 'closed';
        setTimeout(() => {
          this.blinkState = 'open';
        }, 100);
      }, 4000 + Math.random() * 2000)
    );

    // Gentle tassel movement
    this.intervals.push(
      setInterval(() => {
        this.tasselState = this.tasselState === 'left' ? 'right' : 'left';
      }, 2000)
    );

    // Book animation
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