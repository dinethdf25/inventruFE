import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { ProductService } from '@/services/product.service';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (productData: Partial<Product>) => {
    try {
      const newProduct = await ProductService.create(productData);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product created successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create product');
      return false;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await ProductService.update(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast.success('Product updated successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update product');
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await ProductService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete product');
      return false;
    }
  };

  const searchProducts = async (name: string) => {
    setLoading(true);
    try {
      const data = await ProductService.search(name);
      setProducts(data);
    } catch (err: any) {
      toast.error('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (category: string) => {
    setLoading(true);
    try {
      const data = await ProductService.getByCategory(category);
      setProducts(data);
    } catch (err: any) {
      toast.error('Failed to fetch category');
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (id: string, stock: number) => {
    try {
      await ProductService.updateStock(id, stock);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock } : p));
      toast.success('Stock updated');
      return true;
    } catch (err: any) {
      toast.error('Failed to update stock');
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    fetchByCategory,
    updateProductStock
  };
};
