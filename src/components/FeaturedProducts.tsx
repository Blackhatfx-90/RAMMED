import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

// This would normally come from your database
const featuredProducts = [
  {
    id: 1,
    name: 'RAMMED Pro Endoscope HD',
    shortDesc: 'Professional HD endoscope with advanced imaging',
    price: 12500.00,
    currency: 'USD',
    imageUrl: '/images/products/endoscope-placeholder.jpg',
    slug: 'rammed-pro-endoscope-hd',
    rating: 4.9,
    inStock: true
  },
  {
    id: 2,
    name: 'RAMMED Digital X-Ray System',
    shortDesc: 'Advanced digital X-ray system with high resolution',
    price: 85000.00,
    currency: 'USD',
    imageUrl: '/images/products/xray-placeholder.jpg',
    slug: 'rammed-digital-xray-system',
    rating: 4.8,
    inStock: true
  },
  {
    id: 3,
    name: 'RAMMED Laparoscopic Camera System',
    shortDesc: '4K laparoscopic camera for minimally invasive surgery',
    price: 28500.00,
    currency: 'USD',
    imageUrl: '/images/products/laparoscope-placeholder.jpg',
    slug: 'rammed-laparoscopic-camera',
    rating: 4.9,
    inStock: true
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Medical Equipment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular and innovative surgical instruments trusted by healthcare professionals worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-primary-600 font-bold text-xl">R</span>
                    </div>
                    <p className="text-sm">Product Image</p>
                  </div>
                </div>
                {product.inStock && (
                  <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    In Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.shortDesc}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    ${product.price.toLocaleString()}
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors group"
                  >
                    View Details
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors group"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}