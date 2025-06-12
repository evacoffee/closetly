import { ShoppingCart } from '@/components/shopping/ShoppingCart'

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      <ShoppingCart />
    </div>
  )
}
