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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center">
        <div className="text-white text-2xl">Loading Masi Jewellers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            💎 Masi Jewellers
          </h1>
          <p className="text-xl text-yellow-100">
            Premium Gold & Silver Jewelry + Chit Funds
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
          {/* System Status */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              🏪 System Status
            </h2>
            {health && (
              <div className="space-y-2">
                <p className="text-green-300">✅ Status: {health.status}</p>
                <p className="text-blue-200">✅ Database: {health.database}</p>
                <p className="text-yellow-200 text-sm">{health.message}</p>
              </div>
            )}
          </div>

          {/* Current Rates */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              📈 Today's Rates
            </h2>
            <div className="space-y-3">
              {rates.map((rate) => (
                <div key={rate.id} className="bg-white/10 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-white capitalize font-semibold">
                      {rate.metal_type}
                    </span>
                    <span className="text-yellow-300 font-bold">
                      ₹{rate.rate_per_gram}/g
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              💎 Featured Products
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white/10 rounded-lg p-3">
                  <p className="text-white font-semibold text-sm">{product.name}</p>
                  <p className="text-yellow-200 text-xs">
                    {product.weight_grams}g {product.metal_type}
                  </p>
                  <div className="flex justify-between mt-2">
                    <span className="text-green-300 text-sm">₹{product.current_price}</span>
                    <span className="text-blue-200 text-sm">Stock: {product.stock_quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Services */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Our Services
        {/* Management Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Business Management
          </h3>
          <div className="text-center">
            <a href="/customers" className="bg-white/20 hover:bg-white/30 rounded-lg p-6 inline-block transition-all duration-300 border border-white/20">
              <div className="text-4xl mb-4">👥</div>
              <div className="text-white font-semibold text-lg">Customer Management</div>
              <div className="text-yellow-200 text-sm">Manage customer database and KYC records</div>
            </a>
          </div>
        </div>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-500/20 rounded-lg p-6">
              <div className="text-3xl mb-4">💍</div>
              <div className="text-white font-semibold text-lg">Gold & Silver Jewelry</div>
              <div className="text-amber-200 text-sm">Premium handcrafted jewelry with hallmarking</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-6">
              <div className="text-3xl mb-4">💰</div>
              <div className="text-white font-semibold text-lg">Chit Funds</div>
              <div className="text-blue-200 text-sm">Flexible savings schemes for your financial goals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
