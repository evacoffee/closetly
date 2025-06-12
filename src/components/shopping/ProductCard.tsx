import React from 'react'
import Image from 'next/image'
import type { Product } from './types'
import { useShoppingCart } from '@/contexts/ShoppingContext'

// Helper function to ensure color is in correct format
const formatColor = (color: string): string => {
  if (!color) return '#cccccc';
  // If it's already a valid hex color with #, return as is
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) return color.toLowerCase();
  // If it's a valid hex color without #, add #
  if (/^([A-Fa-f0-9]{3}){1,2}$/.test(color)) return `#${color}`.toLowerCase();
  // For named colors or invalid values, return a default
  return '#cccccc';
};

type Props = {
  product: Product
  onViewDetails?: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: Props) {
  const { addToCart, isInCart } = useShoppingCart()
  const [size, setSize] = React.useState(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = React.useState<string>(product.colors?.[0] || '')
  const isOnSale = product.originalPrice && product.originalPrice > product.price
  
  function handleAdd() {
    addToCart(product, 1, size, selectedColor)
  }

  function handleViewDetails(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (onViewDetails) {
      onViewDetails(product)
    }
  }

  return (
    <article className="group card overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-600 text-white">
                {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="flex space-x-2">
              <button 
                onClick={handleAdd}
                disabled={isInCart(product.id)}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isInCart(product.id)
                    ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                    : 'bg-amber-700 text-white hover:bg-amber-800 hover:scale-105 transform'
                }`}
              >
                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
              {onViewDetails && (
                <button
                  onClick={handleViewDetails}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium text-amber-900 bg-white/90 hover:bg-white hover:scale-105 transform transition-all"
                >
                  Quick View
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-medium text-amber-900 line-clamp-2">{product.name}</h3>
          <div className="text-right whitespace-nowrap">
            {isOnSale ? (
              <>
                <span className="text-amber-700 font-bold">
                  {product.currency}
                  {product.price.toFixed(2)}
                </span>
                <span className="line-through text-amber-900/60 text-sm ml-1">
                  {product.currency}
                  {product.originalPrice?.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-amber-900">
                {product.currency}
                {product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {product.brand && (
          <p className="text-xs text-amber-800/80 mb-1">{product.brand}</p>
        )}

        {product.description && (
          <p className="text-sm text-amber-900/80 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {product.sizes?.length ? (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-2 py-1 text-xs rounded-full border ${
                    size === s 
                      ? 'bg-amber-100 border-amber-300 text-amber-900' 
                      : 'border-amber-200 text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {product.colors?.length ? (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {product.colors.map(c => {
                // Ensure we have a valid color value
                const colorValue = c.startsWith('#') ? c : `#${c}`;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedColor === c ? 'border-amber-600' : 'border-transparent'
                    }`}
                    style={{ 
                      backgroundColor: colorValue,
                      // Add a subtle white border for light colors
                      boxShadow: colorValue.toLowerCase() === '#ffffff' ? '0 0 0 1px rgba(0,0,0,0.1) inset' : 'none'
                    }}
                    title={c}
                    aria-label={`Color: ${c}`}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100">
          <div className="flex items-center">
            {product.rating && (
              <div className="flex items-center mr-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-amber-700 ml-1">{product.rating}</span>
              </div>
            )}
            {product.reviewCount && (
              <span className="text-xs text-amber-700/70">({product.reviewCount})</span>
            )}
          </div>
          <button
            className="text-amber-700 hover:text-amber-900 transition-colors"
            aria-label="Add to favorites"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </article>