import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { DirectivesModule } from '../../directives/directives.module';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent, DirectivesModule,ToastrModule]  // Import the module here
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  limit = 20;
  isLoading = signal<boolean>(false);

  cartId = '11';
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadMoreProducts();
  }

  // Function to load products from the API
  loadMoreProducts() {
    if (this.isLoading()) return; // Prevent multiple simultaneous calls
    this.isLoading.update(() => true);

    this.productService.getProducts(this.page, this.limit).subscribe(
      (data: Product[]) => {
        const updatedProducts = data.map(product => {
          const cartItem = this.cartService.cartItems().find(item => item.id === product.id);
          return {
            ...product,
            quantity: cartItem ? cartItem.quantity : 0  // Set quantity if exists in cart
          };
        });
        this.products = [...this.products, ...updatedProducts];
        this.page++;
        this.isLoading.update(() => false); // Reset loading state
      },
      (error) => {
        console.error('Error loading products', error);
        this.isLoading.update(() => false);
      }
    );
  }

  // Function to add product to cart
  addToCart(product: Product) {
    this.toastr.success('Added to cart!', product.title, {timeOut: 1000});
    this.cartService.addItemToCart(product);
  }
}
