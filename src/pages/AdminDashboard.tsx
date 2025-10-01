import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Edit, Trash2, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Image Preview Carousel Component for Admin
const AdminImageCarousel = ({ images, productName, onRemoveImage = null, isPreview = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1 && !isPreview) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [images.length, isPreview]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-amber-50 rounded-xl flex items-center justify-center border-2 border-dashed border-amber-200">
        <span className="text-amber-600 font-medium">No images</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 1) {
    return (
      <div className="relative w-full h-48 bg-amber-50 rounded-xl overflow-hidden border-2 border-amber-100">
        <img
          src={
            isPreview 
              ? (typeof images[0] === 'string' ? images[0] : URL.createObjectURL(images[0]))
              : `${import.meta.env.VITE_API_URL.replace('/api', '')}${images[0]}`
          }
          alt={productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
          }}
        />
        {onRemoveImage && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 w-7 h-7 rounded-full shadow-lg"
            onClick={() => onRemoveImage(0)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 bg-amber-50 rounded-xl overflow-hidden border-2 border-amber-100">
      {images.map((image, index) => (
        <img
          key={index}
          src={
            isPreview 
              ? (typeof image === 'string' ? image : URL.createObjectURL(image))
              : `${import.meta.env.VITE_API_URL.replace('/api', '')}${image}`
          }
          alt={`${productName} ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
            index === currentIndex 
              ? 'opacity-100 transform scale-100' 
              : 'opacity-0 transform scale-95'
          }`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
          }}
        />
      ))}
      
      {/* Navigation Arrows */}
      <Button
        onClick={prevImage}
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg w-9 h-9 rounded-full border-2 border-amber-200"
      >
        <ChevronLeft className="w-5 h-5 text-amber-700" />
      </Button>
      <Button
        onClick={nextImage}
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg w-9 h-9 rounded-full border-2 border-amber-200"
      >
        <ChevronRight className="w-5 h-5 text-amber-700" />
      </Button>

      {/* Remove button */}
      {onRemoveImage && (
        <Button
          size="icon"
          variant="destructive"
          className="absolute top-2 right-2 w-7 h-7 rounded-full shadow-lg"
          onClick={() => onRemoveImage(currentIndex)}
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-amber-600 shadow-lg w-6' : 'bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute bottom-2 right-2 bg-amber-900/80 text-white px-2 py-1 rounded-lg text-xs font-semibold">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    featured: false,
    stockQuantity: '',
    images: []
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products`
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    
    if (files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Please select maximum ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: files
    }));

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const removeImageFromPreview = (indexToRemove) => {
    const newImages = formData.images.filter((_, index) => index !== indexToRemove);
    const newPreviews = imagePreview.filter((_, index) => index !== indexToRemove);
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setImagePreview(newPreviews);

    if (imagePreview[indexToRemove]) {
      URL.revokeObjectURL(imagePreview[indexToRemove]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('featured', formData.featured.toString());
    formDataToSend.append('stockQuantity', formData.stockQuantity);
    
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const url = editingProduct
        ? `${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`
        : `${import.meta.env.VITE_API_URL}/products`;
    
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
        });
        
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          featured: false,
          stockQuantity: '',
          images: []
        });
        
        imagePreview.forEach(url => URL.revokeObjectURL(url));
        setImagePreview([]);
        
        setShowAddForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      featured: product.featured,
      stockQuantity: product.stockQuantity,
      images: []
    });
    setImagePreview([]);
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      featured: false,
      stockQuantity: '',
      images: []
    });
    imagePreview.forEach(url => URL.revokeObjectURL(url));
    setImagePreview([]);
    setShowAddForm(false);
    setEditingProduct(null);
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/30 py-12">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(217, 119, 6, 0.15);
        }
      `}</style>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-stone-600">Manage your premium product collection</p>
          </div>
          <Button
            onClick={resetForm}
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-xl rounded-2xl overflow-hidden animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-amber-700 to-amber-800 text-white pb-6">
              <CardTitle className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-bold text-stone-700 mb-2 block">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price" className="text-sm font-bold text-stone-700 mb-2 block">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-bold text-stone-700 mb-2 block">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stockQuantity" className="text-sm font-bold text-stone-700 mb-2 block">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-bold text-stone-700 mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="images" className="text-sm font-bold text-stone-700 mb-2 block">Product Images (Max 5)</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingProduct}
                    className="mb-4 h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-100 file:text-amber-700 file:font-semibold hover:file:bg-amber-200"
                  />
                  
                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-semibold mb-3 block text-amber-900">
                        Preview ({imagePreview.length} {imagePreview.length === 1 ? 'image' : 'images'})
                      </Label>
                      <AdminImageCarousel 
                        images={imagePreview} 
                        productName={formData.name || "Product"} 
                        onRemoveImage={removeImageFromPreview}
                        isPreview={true}
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-stone-600 mt-3 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                    Upload 1-5 high-quality images. Multiple images will display as an animated carousel.
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                  <Switch
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, featured: checked }))
                    }
                    className="data-[state=checked]:bg-amber-600"
                  />
                  <Label htmlFor="featured" className="text-sm font-bold text-stone-700 cursor-pointer">Featured Product (Show on homepage)</Label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="h-12 px-8 rounded-xl border-2 border-amber-200 hover:bg-amber-50 font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-amber-700 to-amber-800 text-white pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <Package className="h-6 w-6 mr-3" />
              Products Collection ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600 mb-4"></div>
                <p className="text-stone-600 font-medium">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-amber-50 rounded-xl border-2 border-dashed border-amber-200">
                <Package className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-stone-800 mb-2">No products yet</p>
                <p className="text-stone-600">Add your first product to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <Card 
                    key={product._id} 
                    className="border-0 shadow-lg rounded-2xl overflow-hidden card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <AdminImageCarousel 
                        images={product.images} 
                        productName={product.name} 
                      />
                      {product.featured && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 py-1.5 text-xs font-bold rounded-full shadow-lg">
                          ⭐ Featured
                        </span>
                      )}
                      {product.images && product.images.length > 1 && (
                        <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg">
                          {product.images.length} images
                        </span>
                      )}
                    </div>
                    <CardContent className="p-6 bg-white">
                      <div className="mb-2">
                        <span className="text-xs text-amber-700 font-bold uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-stone-800 line-clamp-2">{product.name}</h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent mb-2">
                        ${product.price}
                      </p>
                      <p className="text-sm text-stone-600 mb-4 bg-stone-50 px-3 py-1.5 rounded-lg inline-block">
                        Stock: <span className="font-bold">{product.stockQuantity}</span>
                      </p>

                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="flex-1 h-10 border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-400 rounded-lg font-semibold"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 h-10 rounded-lg font-semibold shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;