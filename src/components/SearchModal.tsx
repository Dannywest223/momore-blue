import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/contexts/ProductContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { searchProducts, searchResults, clearSearch } = useProducts();

  useEffect(() => {
    if (!query.trim()) return; // Do nothing if query is empty

    const debounceTimer = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchProducts]);

  // Clear search only when modal closes
  const handleClose = () => {
    setQuery('');
    clearSearch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {query.trim() && searchResults.length === 0 && (
            <p className="text-center text-gray-500 py-8">No products found</p>
          )}

          {searchResults.map((product) => (
           <Link
           key={product._id}
           to={`/product/${product._id}`}
           onClick={handleClose}
           className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
         >
           <img
             src={
               product.images && product.images.length > 0
                 ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.images[0]}`
                 : 'https://via.placeholder.com/48x48?text=No+Image'
             }
             alt={product.name}
             className="w-12 h-12 object-cover rounded"
             onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
               const target = e.target as HTMLImageElement;
               target.src = 'https://via.placeholder.com/48x48?text=Image+Error';
             }}
           />
           <div className="flex-1">
             <h3 className="font-medium text-gray-900">{product.name}</h3>
             <p className="text-sm text-gray-500">${product.price}</p>
           </div>
         </Link>
         
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
