import { ProductCard } from '@/components/shopping/ProductCard'

// Mock data - replace with actual API call in a real app
const mockProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    brand: 'Closetly',
    price: 24.99,
    originalPrice: 29.99,
    currency: '$',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    productUrl: '#',
    retailer: 'Closetly Store',
    category: 'Tops',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffffff', '#000000', '#9ca3af'] as const,
    rating: 4.5,
    reviewCount: 128,
    description: 'A classic white t-shirt made from 100% organic cotton. Perfect for any casual occasion.'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    brand: 'Closetly Denim',
    price: 59.99,
    currency: '$',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    productUrl: '#',
    retailer: 'Closetly Store',
    category: 'Bottoms',
    inStock: true,
    sizes: ['28', '30', '32', '34'],
    colors: ['#1e40af', '#1c1917'] as const,
    rating: 4.2,
    reviewCount: 89,
    description: 'Comfortable slim fit jeans with stretch technology. Perfect for everyday wear.'
  },
  {
    id: '3',
    name: 'Oversized Knit Sweater',
    brand: 'Closetly Knitwear',
    price: 45.99,
    originalPrice: 59.99,
    currency: '$',
    imageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    productUrl: '#',
    retailer: 'Closetly Store',
    category: 'Tops',
    inStock: true,
    sizes: ['S/M', 'L/XL'],
    colors: ['#78350f', '#1e40af', '#1e3a8a'] as const,
    rating: 4.7,
    reviewCount: 156,
    description: 'Cozy oversized knit sweater perfect for chilly days. Made from sustainable materials.'
  },
  {
    id: '4',
    name: 'Classic Denim Jacket',
    brand: 'Closetly Denim',
    price: 79.99,
    currency: '$',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-001e4a0f2a61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    productUrl: '#',
    retailer: 'Closetly Store',
    category: 'Outerwear',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1e40af', '#1c1917', '#3f6212'] as const,
    rating: 4.8,
    reviewCount: 203,
    description: 'A timeless denim jacket that pairs with everything. Perfect for layering.'
  },
  {
    id: '5',
    name: 'Linen Button-Up Shirt',
    brand: 'Closetly',
    price: 49.99,
    originalPrice: 64.99,
    currency: '$',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    productUrl: '#',
    retailer: 'Closetly Store',
    category: 'Tops',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#fef3c7', '#f5f5f4', '#1c1917'] as const,
    rating: 4.6,
    reviewCount: 97,
    description: 'Breathable linen shirt perfect for warm weather. Wrinkle-resistant fabric.'
  },
  {
    id: '6',
    name: 'Wide-Leg Trousers',
    brand: 'Closetly',
    price: 54.99,
    currency: '$',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    productUrl: '#',
    retailer: 'Closetly Store',
    category: 'Bottoms',
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#1c1917', '#44403c', '#292524'] as const,
    rating: 4.4,
    reviewCount: 67,
    description: 'Elegant wide-leg trousers with a high waist. Perfect for both office and casual wear.'
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* Hero Section */}
      <div className="relative bg-amber-900 text-amber-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-800/90">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] opacity-10 bg-cover bg-center"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Discover Your Style</span>
              <span className="block text-amber-200 mt-2">Shop Our Collection</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-amber-100 text-lg md:text-xl">
              Handpicked essentials for your wardrobe. Ethically made, designed to last.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="#featured"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                Shop Now
              </a>
              <a
                href="#new-arrivals"
                className="inline-flex items-center px-6 py-3 border border-amber-200 text-base font-medium rounded-full text-amber-100 bg-transparent hover:bg-amber-800/50 transition-colors"
              >
                New Arrivals
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="featured" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-amber-900">Featured Collection</h2>
          <p className="mt-4 max-w-2xl text-amber-900/80 mx-auto">
            Discover our handpicked selection of premium clothing and accessories
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onViewDetails={(p) => {
                // Navigate to product detail page
                console.log('View details for:', p.name)
              }}
            />
          ))}
        </div>
      </div>

      {/* Categories Banner */}
      <div className="bg-amber-900/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-amber-900">Shop by Category</h2>
            <p className="mt-4 max-w-2xl text-amber-900/80 mx-auto">
              Find exactly what you're looking for in our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Tops', count: 124, image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
              { name: 'Bottoms', count: 89, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
              { name: 'Dresses', count: 67, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
              { name: 'Accessories', count: 112, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
            ].map((category, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg aspect-square">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                     style={{ backgroundImage: `url(${category.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent"></div>
                </div>
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-medium text-white">{category.name}</h3>
                  <p className="text-amber-100 text-sm">{category.count} items</p>
                  <a 
                    href={`/category/${category.name.toLowerCase()}`}
                    className="mt-2 inline-flex items-center text-amber-200 text-sm font-medium group-hover:underline"
                  >
                    Shop now
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div id="new-arrivals" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-amber-900">New Arrivals</h2>
          <p className="mt-4 max-w-2xl text-amber-900/80 mx-auto">
            Discover our latest additions to the collection
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...mockProducts].reverse().slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onViewDetails={(p) => {
                // Navigate to product detail page
                console.log('View details for:', p.name)
              }}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-amber-900 text-base font-medium rounded-full text-amber-900 bg-transparent hover:bg-amber-900/5 transition-colors"
          >
            View All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-amber-900/5 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-amber-900">Stay Updated</h2>
          <p className="mt-4 text-amber-900/80">
            Subscribe to our newsletter for the latest updates, exclusive offers, and style inspiration.
          </p>
          <form className="mt-8 sm:flex">
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-5 py-3 border border-amber-300 rounded-full shadow-sm placeholder-amber-400 focus:ring-amber-500 focus:border-amber-500 sm:max-w-xs"
              placeholder="Enter your email"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          <p className="mt-3 text-sm text-amber-900/60">
            We care about your data. Read our{' '}
            <a href="/privacy" className="font-medium text-amber-900 hover:text-amber-700 underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
