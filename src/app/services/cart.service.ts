import { Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);


  constructor(private http: HttpClient) {}

  addItemToCart(product: Product) {
    const existingItem = this.cartItems().find(item => item.id === product.id);

    if (existingItem) {
      // Update quantity if item already exists
      this.cartItems.update(items =>
        items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Add new item with quantity 1 if it doesn't exist
      const newCartItem: CartItem = { ...product, purchasedDate: new Date(), quantity: 1 };
      this.cartItems.update(items => [...items, newCartItem]);
    }
    console.log(this.cartItems());
  }

  getRecentPurchases(): CartItem[] {
    return this.cartItems().filter(item =>
      (new Date().getTime() - item.purchasedDate.getTime()) / (1000 * 60 * 60 * 24) < 2
    );
  }

}
