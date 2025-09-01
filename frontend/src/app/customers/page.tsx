'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCustomers } from '@/lib/api';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  customer_type: string;
  kyc_verified: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        setError('Failed to load customers');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center">
        <div className="text-white text-2xl">Loading Customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-700">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Customer Management</h1>
              <p className="text-yellow-100">Manage customer information and purchase history</p>
            </div>
            <Link href="/" className="text-yellow-200 hover:text-white">
              ← Back to Home
            </Link>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Customer Database ({customers.length} customers)</h2>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold">
              Add New Customer
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">KYC Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-yellow-300 font-mono">#{customer.id}</td>
                    <td className="py-3 px-4 font-semibold">{customer.name}</td>
                    <td className="py-3 px-4">{customer.phone}</td>
                    <td className="py-3 px-4 text-sm">{customer.email || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        customer.customer_type === 'premium' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {customer.customer_type || 'regular'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        customer.kyc_verified 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {customer.kyc_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-yellow-300 hover:text-yellow-100 mr-3 text-sm">
                        View
                      </button>
                      <button className="text-blue-300 hover:text-blue-100 mr-3 text-sm">
                        Edit
                      </button>
                      <button className="text-green-300 hover:text-green-100 text-sm">
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
