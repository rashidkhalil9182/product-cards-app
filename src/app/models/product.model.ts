// models/product.model.ts
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
  quantity: number
}

export interface Rating {
  rate: number
  count: number
}

export interface CartItem extends Product {
  purchasedDate: Date;
}
