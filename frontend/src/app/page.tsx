'use client';
import { useEffect, useState } from 'react';
import { healthCheck, getProducts, getMetalRates } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  metal_type: string;
  weight_grams: number;
  making_charges: number;
  current_price: number;
  stock_quantity: number;
  hallmark_number: string;
}

interface MetalRate {
  id: number;
  metal_type: string;
  rate_per_gram: number;
  date: string;
}

interface HealthData {
  status: string;
  message: string;
  database: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthData, productsData, ratesData] = await Promise.all([
          healthCheck(),
          getProducts(),
          getMetalRates()
        ]);
        setHealth(healthData);
        setProducts(productsData);
        setRates(ratesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Spinner with luxury theming
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/sparkle-pattern.svg')] opacity-10 pointer-events-none" />
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <span className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-300 border-r-4 border-yellow-200 border-b-4 border-white shadow-xl" />
            <span className="absolute inset-0 flex items-center justify-center text-5xl select-none text-yellow-100">💎</span>
          </div>
          <div className="text-2xl md:text-3xl font-serif font-semibold text-amber-100 drop-shadow-lg animate-fadein">
            Loading Masi Jewellers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 relative overflow-hidden">
      {/* Subtle background shimmer pattern layer */}
      <div className="absolute inset-0 bg-[url('/sparkle-pattern.svg')] opacity-20 pointer-events-none z-0" />
      
      {/* HERO SECTION */}
      <section className="relative flex flex-col justify-center items-center min-h-screen md:py-24 py-16 text-center overflow-x-hidden z-10">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-amber-950/40 pointer-events-none z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center mb-4 justify-center">
            <span className="inline-block text-7xl md:text-8xl font-extrabold font-serif text-yellow-50 drop-shadow-[0_6px_16px_rgba(155,108,3,0.21)] select-none shimmer">
              Masi Jewellers
            </span>
            <span className="ml-3 text-yellow-200 text-4xl md:text-5xl">💎</span>
          </div>
          <div className="mb-5 text-xl md:text-2xl font-light text-amber-100 tracking-wide fadein delay-100">
            Premium Gold, Silver & Diamond Jewelry | Trusted Chit Funds
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-center mt-4 mb-8">
            <a
              href="#main"
              className="px-8 py-3 rounded-xl bg-amber-50/10 border border-yellow-300/30 backdrop-blur-md text-amber-100 font-semibold transition duration-300 hover:bg-amber-50/20 hover:scale-105 shadow-lg text-lg"
            >
              Explore Collection
            </a>
            <a
              href="#services"
              className="px-8 py-3 rounded-xl bg-white/10 border border-amber-100/20 backdrop-blur-md text-amber-100 font-semibold transition duration-300 hover:bg-amber-100/20 hover:scale-105 shadow-md text-lg"
            >
              Our Services
            </a>
          </div>
        </div>
        {/* Decorative gold sparkles */}
        <div className="absolute left-0 bottom-0 w-[100vw] h-12 pointer-events-none z-0 bg-gradient-to-t from-amber-100/10 to-transparent" />
      </section>
      
      {/* Main Content (3-column Dashboard) */}
      <main
        id="main"
        className="relative z-10 w-full max-w-6xl mx-auto -mt-24 md:-mt-40 pb-4 px-2 md:px-6 fadein"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {/* System Status */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl hover:bg-white/20 transition duration-300 p-7 group hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-300 text-2xl">🏪</span>
              <span className="text-xl font-serif text-white font-medium">System Status</span>
            </div>
            {health && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-300">●</span>
                  <span className="text-white text-base">Status:</span>
                  <span className="text-emerald-100 font-semibold">{health.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-200">🗄️</span>
                  <span className="text-white text-base">Database:</span>
                  <span className="text-blue-50 font-semibold">{health.database}</span>
                </div>
                <div className="text-amber-200/90 text-sm pt-2 font-sans">
                  {health.message}
                </div>
              </div>
            )}
          </div>

          {/* Current Rates */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl hover:bg-white/20 transition duration-300 p-7 group hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-200 text-2xl">📈</span>
              <span className="text-xl font-serif text-white font-medium">Today's Rates</span>
            </div>
            <div className="space-y-3">
              {rates.map((rate) => (
                <div key={rate.id} className="flex justify-between items-center bg-white/10 rounded-lg py-2 px-3 border border-yellow-50/10 shadow hover:bg-yellow-50/10 transition duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-200 text-lg">⭑</span>
                    <span className="capitalize text-white font-semibold tracking-wide">{rate.metal_type}</span>
                  </div>
                  <span className="text-yellow-300 font-bold text-lg">
                    ₹{rate.rate_per_gram}/g
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl hover:bg-white/20 transition duration-300 p-7 group hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-100 text-2xl">💎</span>
              <span className="text-xl font-serif text-white font-medium">Featured Products</span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-amber-100/30">
              {products.slice(0, 3).map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white/10 rounded-lg p-3 border border-white/20 shadow hover:bg-yellow-50/10 transition duration-300 flex flex-col gap-1"
                >
                  <p className="text-white font-semibold text-[1rem] flex items-center gap-2">
                    <span className="text-yellow-200">⭒</span>{product.name}
                  </p>
                  <p className="text-amber-100 text-xs">
                    {product.weight_grams}g {product.metal_type}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-emerald-300 text-sm font-mono">₹{product.current_price}</span>
                    <span className="text-blue-200 text-sm">Stock: {product.stock_quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Decorative divider */}
      <div className="mx-auto max-w-3xl my-12 relative z-10">
        <div className="w-full h-6 bg-gradient-to-r from-yellow-200/10 via-amber-100/5 to-yellow-200/10 rounded-full blur-[2px]" />
      </div>

      {/* SERVICES SECTION */}
      <section
        id="services"
        className="relative w-full max-w-4xl mx-auto px-2 md:px-6 py-8 md:py-16 z-10 fadein"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-10 flex items-center justify-center gap-2">
          <span className="text-yellow-300">🛍️</span> Our Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-amber-500/20 rounded-xl border border-yellow-100/30 p-7 shadow-xl hover:bg-amber-500/30 transition duration-300 group hover:scale-105 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💍</span>
              <span className="text-xl font-semibold text-white font-serif">Gold & Silver Jewelry</span>
            </div>
            <div className="text-amber-200 text-base mt-2 leading-relaxed">
              Exquisite, hand-crafted designs in gold, silver, and diamonds—each piece hallmarked for purity and excellence.
            </div>
          </div>
          <div className="bg-blue-500/20 rounded-xl border border-blue-200/20 p-7 shadow-xl hover:bg-blue-500/30 transition duration-300 group hover:scale-105 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💰</span>
              <span className="text-xl font-semibold text-white font-serif">Chit Fund Management</span>
            </div>
            <div className="text-blue-100 text-base mt-2 leading-relaxed">
              Secure, flexible chit fund plans—trusted by generations, designed for smart wealth-building and maximum transparency.
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="mx-auto max-w-3xl my-12 relative z-10">
        <div className="w-full h-6 bg-gradient-to-r from-orange-200/10 via-amber-100/5 to-orange-200/10 rounded-full blur-[2px]" />
      </div>

      {/* CUSTOMER MANAGEMENT CTA SECTION */}
      <section className="w-full max-w-4xl mx-auto px-2 md:px-6 py-8 md:py-12 fadein z-20">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-8 flex items-center justify-center gap-2">
          <span className="text-blue-200">👥</span> Business Management
        </h2>
        <div className="flex justify-center">
          <a
            href="/customers"
            className="bg-white/20 hover:bg-white/30 border border-white/30 shadow-xl rounded-xl px-10 py-8 flex flex-col items-center transition-all duration-300 group hover:scale-105"
          >
            <span className="text-5xl mb-4">👥</span>
            <span className="text-white font-semibold text-xl mb-1 tracking-wide font-serif">Customer Management</span>
            <span className="text-yellow-200 text-base">
              Manage customer database and KYC records
            </span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-30 mt-auto border-t border-amber-100/10 bg-gradient-to-r from-amber-900/30 via-yellow-900/10 to-yellow-900/30 text-amber-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div>
            <span className="font-serif text-lg font-bold text-yellow-300">Masi Jewellers</span>
            <span className="mx-2 text-amber-100">|</span>
            <span className="text-amber-100 text-base">
              123 Gold Street, Mumbai, India
            </span>
          </div>
          <div>
            <span className="text-base font-sans">Contact: </span>
            <span className="text-yellow-200 font-semibold">+91-9876543210</span>
            <span className="mx-2"></span>
            <span className="text-base font-sans">Email:</span>
            <span className="text-yellow-200 font-semibold">info@masijwellers.devforge.in</span>
          </div>
          <div className="flex gap-3 justify-center text-2xl">
            <a href="#" className="hover:text-amber-200 transition duration-300" aria-label="Instagram">📷</a>
            <a href="#" className="hover:text-amber-200 transition duration-300" aria-label="Facebook">👍</a>
            <a href="#" className="hover:text-amber-200 transition duration-300" aria-label="Twitter">🐦</a>
          </div>
        </div>
        <div className="mt-4 text-amber-200/70 text-sm text-center">
          &copy; {new Date().getFullYear()} Masi Jewellers. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
