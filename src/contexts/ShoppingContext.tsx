import React from 'react'
import type { ShoppingContextType, Product, ShoppingCartItem } from '@/components/shopping/types'

// Define cart type locally to avoid import issues
type ShoppingCart = {
  items: ShoppingCartItem[]
  subtotal: number
  itemCount: number
  currency: string
}

type CartAction =
  | { type: 'ADD_ITEM', payload: ShoppingCartItem }
  | { type: 'REMOVE_ITEM', payload: string }
  | { type: 'UPDATE_QTY', payload: { id: string, qty: number } }
  | { type: 'CLEAR' }

const CartContext = React.createContext<ShoppingContextType | null>(null)

// Handle cart state updates
function cartReducer(state: ShoppingCart, action: CartAction) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload
      const exists = state.items.find(i => i.id === item.id)
      
      if (exists) {
        const updated = state.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
            : i
        )
        
        return {
          ...state,
          items: updated,
          itemCount: state.itemCount + (item.quantity || 1),
          subtotal: state.subtotal + (item.price * (item.quantity || 1))
        }
      }
      
      const newItem = { ...item, quantity: item.quantity || 1 }
      return {
        ...state,
        items: [...state.items, newItem],
        itemCount: state.itemCount + 1,
        subtotal: state.subtotal + (item.price * (item.quantity || 1))
      }
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(x => x.id === action.payload)
      if (!item) return state
      
      return {
        ...state,
        items: state.items.filter(x => x.id !== action.payload),
        itemCount: state.itemCount - item.quantity,
        subtotal: state.subtotal - (item.price * item.quantity)
      }
    }
    
    case 'UPDATE_QTY': {
      const item = state.items.find(x => x.id === action.payload.id)
      if (!item) return state
      
      const diff = action.payload.qty - item.quantity
      const updated = state.items.map(i => 
        i.id === action.payload.id 
          ? { ...i, quantity: action.payload.qty } 
          : i
      )
      
      return {
        ...state,
        items: updated,
        itemCount: state.itemCount + diff,
        subtotal: state.subtotal + (item.price * diff)
      }
    }
    
    case 'CLEAR':
      return { items: [], subtotal: 0, itemCount: 0, currency: 'USD' }
      
    default:
      return state
  }
}

export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = React.useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    itemCount: 0,
    currency: 'USD'
  })

  // Add item to cart
  function addToCart(product: Product, qty = 1, size?: string, color?: string) {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        quantity: qty,
        selectedSize: size,
        selectedColor: color
      }
    })
  }

  // Remove item from cart
  function removeFromCart(id: string) {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  // Update item quantity
  function updateQuantity(id: string, qty: number) {
    if (qty < 1) {
      removeFromCart(id)
      return
    }
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
  }

  // Clear entire cart
  function clearCart() {
    dispatch({ type: 'CLEAR' })
  }

  // Check if item is in cart
  function isInCart(id: string) {
    return cart.items.some(x => x.id === id)
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook for using cart
// Throws if used outside provider
export function useShoppingCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error('useShoppingCart must be used within ShoppingProvider')
  }
  return context
}