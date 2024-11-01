import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [CommonModule],

  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('buttonHover', [
      state('hover', style({ backgroundColor: '#45a049', transform: 'scale(1.1)' })),
      transition('* => hover', animate('200ms ease-in')),
      transition('hover => *', animate('200ms ease-out'))
    ]),
    // Bounce animation for the "Buy" button
    trigger('bounce', [
      transition('inactive => active', [
        animate('500ms ease', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-10px)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 1.0 }),
        ]))
      ])
    ]),

    // Fade-in animation for the "Added to cart" message
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class ProductCardComponent {
  @Input() product!: Product;
  isHovered = false;
  @Output() addedToCart = new EventEmitter<Product>();
  isBouncing: boolean = false;

  constructor() { }

  addToCart() {
    this.isBouncing = true;
    this.product.quantity = (this.product.quantity || 0) + 1;
    this.addedToCart.emit(this.product);
  }

  toggleHover(state: boolean) {
    this.isHovered = state;
  }
}
