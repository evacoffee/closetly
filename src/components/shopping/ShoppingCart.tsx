import React from 'react'
import { useShoppingCart } from '@/contexts/ShoppingContext'
import Image from 'next/image'

export function ShoppingCart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useShoppingCart()

  if (cart.itemCount === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some items to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Shopping Cart ({cart.itemCount})</h2>
        <button 
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear all
        </button>
      </div>

      <div className="divide-y">
        {cart.items.map((item) => (
          <div key={item.id} className="p-4 flex gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{item.name}</h3>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {item.selectedSize && (
                <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
              )}
              {item.selectedColor && (
                <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
              )}
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <span className="font-medium">
                  {item.currency}
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">
            {cart.currency}
            {cart.subtotal.toFixed(2)}
          </span>
        </div>
        
        <button className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Proceed to Checkout
        </button>
        
        <p className="mt-2 text-center text-sm text-gray-500">
          or <a href="/" className="text-black hover:underline">Continue Shopping</a>
        </p>
      </div>
    </div>
  )
}
