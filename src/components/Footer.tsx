import Link from 'next/link';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">RAMMED</span>
                <div className="text-sm text-gray-300 -mt-1">Medical Equipment</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Leading provider of premium surgical equipment and medical instruments. 
              Trusted by healthcare professionals worldwide for quality, innovation, and reliability.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400" />
                <span className="text-gray-300">info@rammed.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-primary-400" />
                <span className="text-gray-300">123 Medical District, Healthcare City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe size={18} className="text-primary-400" />
                <span className="text-gray-300">www.rammed.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/endoscopy" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Endoscopy Equipment
                </Link>
              </li>
              <li>
                <Link href="/categories/surgical-instruments" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Surgical Instruments
                </Link>
              </li>
              <li>
                <Link href="/categories/medical-imaging" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Medical Imaging
                </Link>
              </li>
              <li>
                <Link href="/categories/diagnostic" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Diagnostic Equipment
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Featured Products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} RAMMED Medical Equipment. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/warranty" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Warranty
            </Link>
            <Link href="/admin" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}