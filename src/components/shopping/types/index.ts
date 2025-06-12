// Type for valid hex color values (3 or 6 characters, with or without #)
type HexColor = `#${string}` | `#${string}${string}${string}${string}${string}${string}`;

// Type that allows both mutable and readonly arrays of HexColor
type HexColorArray = HexColor[] | readonly HexColor[];

// Product related stuff
export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  currency: string
  imageUrl: string
  productUrl: string
  retailer: string
  category: string
  inStock: boolean
  sizes?: string[]
  colors?: HexColorArray
  rating?: number
  reviewCount?: number
  description: string
}

// Shopping cart item extends product with extra fields
export interface ShoppingCartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

// Main cart interface
type ShoppingCart = {
  items: ShoppingCartItem[]
  subtotal: number
  itemCount: number
  currency: string
}

// Context type for shopping
export type ShoppingContextType = {
  cart: ShoppingCart
  
  addToCart: (
    product: Product, 
    quantity?: number, 
    size?: string, 
    color?: string
  ) => void
  
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
}