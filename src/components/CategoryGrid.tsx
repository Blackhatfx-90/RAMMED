import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Endoscopy Equipment',
    slug: 'endoscopy',
    description: 'Advanced endoscopic systems and accessories',
    productCount: 25,
    color: 'bg-primary-500'
  },
  {
    name: 'Surgical Instruments',
    slug: 'surgical-instruments', 
    description: 'Precision surgical tools and instruments',
    productCount: 42,
    color: 'bg-secondary-500'
  },
  {
    name: 'Medical Imaging',
    slug: 'medical-imaging',
    description: 'State-of-the-art imaging solutions',
    productCount: 18,
    color: 'bg-accent-500'
  }
];

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the right medical equipment for your specific needs across our comprehensive product categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`h-32 ${category.color} flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.productCount} products</span>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}