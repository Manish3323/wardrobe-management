import React, { useState, useEffect } from 'react';
import { Upload, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ClothingItem } from '../types';
import toast from 'react-hot-toast';

export default function Wardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    style: ''
  });
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadWardrobe();
    }
  }, [session]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email for the confirmation link!');
    }
    setIsLoading(false);
  }

  async function loadWardrobe() {
    const { data, error } = await supabase
      .from('clothing_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load wardrobe');
      return;
    }

    setItems(data || []);
  }

  async function uploadImage(file: File) {
    if (!session) {
      toast.error('Please sign in to upload images');
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('clothing-images')
      .upload(filePath, file, {
        upsert: false
      });

    if (uploadError) {
      toast.error('Error uploading image');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('clothing-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!session) {
      toast.error('Please sign in to upload images');
      return;
    }

    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await uploadImage(file);
    
    if (!imageUrl) return;

    const { error } = await supabase
      .from('clothing_items')
      .insert([{
        name: file.name,
        image_url: imageUrl,
        category: 'uncategorized',
        color: '',
        style: '',
        tags: []
      }]);

    if (error) {
      toast.error('Failed to save item');
      return;
    }

    toast.success('Item added successfully');
    loadWardrobe();
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome to Digital Wardrobe</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Wardrobe</h1>
        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 text-sm sm:text-base">
          <Upload size={18} className="sm:size-20" />
          Add Item
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
          <select
            className="px-3 py-2 sm:px-4 border rounded-lg text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
            <option value="outerwear">Outerwear</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
          <select
            className="px-3 py-2 sm:px-4 border rounded-lg text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
            value={filters.style}
            onChange={(e) => setFilters({ ...filters, style: e.target.value })}
          >
            <option value="">All Styles</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="traditional">Traditional</option>
            <option value="beachwear">Beachwear</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-square">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">{item.name}</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {item.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs sm:text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}