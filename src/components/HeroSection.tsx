import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block">Precision</span>
              <span className="block text-secondary-400">Medical</span>
              <span className="block">Equipment</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Advanced surgical instruments and medical technology designed for healthcare professionals 
              who demand excellence in patient care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors group"
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="inline-flex items-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-colors group">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-secondary-400">5000+</div>
                <div className="text-sm text-gray-400">Healthcare Facilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-400">50+</div>
                <div className="text-sm text-gray-400">Countries Served</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-400">25+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative">
            {/* Main Equipment Showcase */}
            <div className="relative">
              {/* Placeholder for hero image */}
              <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center">
                <div className="text-center text-white/70">
                  <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 bg-primary-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">R</span>
                    </div>
                  </div>
                  <p className="text-sm">Premium Surgical Equipment</p>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 top-8 bg-white rounded-lg shadow-xl p-4 max-w-xs">
                <h3 className="font-semibold text-gray-900 text-sm">Endoscopy Systems</h3>
                <p className="text-gray-600 text-xs mt-1">4K HD imaging technology</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mr-2"></div>
                  <span className="text-xs text-accent-600 font-medium">In Stock</span>
                </div>
              </div>

              <div className="absolute -right-4 bottom-8 bg-white rounded-lg shadow-xl p-4 max-w-xs">
                <h3 className="font-semibold text-gray-900 text-sm">Digital X-Ray</h3>
                <p className="text-gray-600 text-xs mt-1">Low radiation, high precision</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></div>
                  <span className="text-xs text-secondary-600 font-medium">FDA Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-auto">
          <path
            d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}