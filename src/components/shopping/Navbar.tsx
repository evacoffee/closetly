import Link from 'next/link'
import { useShoppingCart } from '@/contexts/ShoppingContext'

export function Navbar() {
  const { cart } = useShoppingCart()
  
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-serif font-bold text-amber-900 hover:text-amber-700 transition-colors">
            Closetly
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/products" 
              className="nav-link text-amber-900 hover:text-amber-700"
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="nav-link text-amber-900 hover:text-amber-700"
            >
              Our Story
            </Link>
            <Link 
              href="/blog" 
              className="nav-link text-amber-900 hover:text-amber-700"
            >
              Journal
            </Link>
            <Link 
              href="/contact" 
              className="nav-link text-amber-900 hover:text-amber-700"
            >
              Contact
            </Link>
            <Link 
              href="/outfits/recommendations" 
              className="nav-link bg-amber-900 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors font-medium"
            >
              Get Dressed
            </Link>
            
            <div className="relative group">
              <Link 
                href="/cart" 
                className="flex items-center p-2 rounded-full hover:bg-amber-50 transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-amber-900" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
              {cart.itemCount > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-amber-900">
                    {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart
                  </div>
                  <div className="border-t border-amber-50 mt-2 pt-2">
                    <Link 
                      href="/cart" 
                      className="block text-center px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                    >
                      View Cart & Checkout
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-6 w-px bg-amber-100 mx-2"></div>
            
            <Link 
              href="/account" 
              className="p-2 rounded-full hover:bg-amber-50 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-amber-900" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
