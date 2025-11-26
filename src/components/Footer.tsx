
import React from 'react';
import { Facebook, Instagram, Twitter, Send, ChevronRight, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-cupcake-pink to-cupcake-darkPink relative overflow-hidden">
      {/* Wave pattern */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-20 -mt-1 text-white"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-white">
          <div className="md:col-span-1 lg:col-span-1">
            <div className="mb-4">
              <Link to="/" className="flex flex-col items-start group">
                <span className="font-pacifico text-3xl text-white transition-transform group-hover:scale-105 duration-300">LaKeisha's</span>
                <span className="font-pacifico text-2xl text-white/90 transition-transform group-hover:scale-105 duration-300">Cupcakery</span>
              </Link>
            </div>
            <p className="text-white/80 mb-6">
              Handcrafted cupcakes and cakes made with love for every occasion.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors hover:scale-125 transform duration-300"
              >
                <Instagram size={20} className="hover:animate-spin" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors hover:scale-125 transform duration-300"
              >
                <Send size={20} className="hover:animate-pulse" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors hover:scale-125 transform duration-300"
              >
                <Facebook size={20} className="hover:animate-bounce" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors hover:scale-125 transform duration-300"
              >
                <Twitter size={20} className="hover:rotate-12 transform" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/cupcakes" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Cupcakes
                </Link>
              </li>
              <li>
                <Link to="/category/cakes" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Cakes
                </Link>
              </li>
              <li>
                <Link to="/category/cakesicles" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Cakesicles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-5 group-hover:ml-0" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-white/80 mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-md focus:outline-none text-gray-800"
              />
              <button
                type="submit"
                className="bg-cupcake-blue hover:bg-cupcake-darkBlue text-white px-4 py-2 rounded-r-md transition-colors hover:animate-pulse"
              >
                <Send size={18} />
              </button>
            </form>

            {/* Admin Button */}
            <a
              href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/admin/original/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors border border-white/40 px-3 py-1.5 rounded-md hover:bg-white/10"
            >
              <LockKeyhole size={16} /> Admin Login
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LaKeisha's Cupcakery. All rights reserved.
          </p>
          <p className="text-white/80 text-sm italic animate-pulse-light">
            Website by <span className="font-pacifico">Winston Jthinker</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
