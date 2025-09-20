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
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images</span>
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
      <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
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
            className="absolute top-2 right-2 w-6 h-6 rounded-full"
            onClick={() => onRemoveImage(0)}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
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
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg w-8 h-8"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        onClick={nextImage}
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg w-8 h-8"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Remove button */}
      {onRemoveImage && (
        <Button
          size="icon"
          variant="destructive"
          className="absolute top-2 right-2 w-6 h-6 rounded-full"
          onClick={() => onRemoveImage(currentIndex)}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
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
    const maxImages = 5; // Maximum 5 images
    
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

    // Create preview URLs
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

    // Clean up the URL object
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
        
        // Reset form and previews
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          featured: false,
          stockQuantity: '',
          images: []
        });
        
        // Clean up preview URLs
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            onClick={resetForm}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="images">Product Images (Max 5)</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingProduct}
                    className="mb-4"
                  />
                  
                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium mb-2 block">Image Preview ({imagePreview.length} images):</Label>
                      <AdminImageCarousel 
                        images={imagePreview} 
                        productName={formData.name || "Product"} 
                        onRemoveImage={removeImageFromPreview}
                        isPreview={true}
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    You can upload 1-5 images. Multiple images will display as an animated carousel.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, featured: checked }))
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Upload className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Products ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products found. Add your first product!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product._id} className="border">
                    <div className="relative">
                      <AdminImageCarousel 
                        images={product.images} 
                        productName={product.name} 
                      />
                      {product.featured && (
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                          Featured
                        </span>
                      )}
                      {product.images && product.images.length > 1 && (
                        <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                          {product.images.length} images
                        </span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                      <p className="text-primary font-bold text-xl mb-2">${product.price}</p>
                      <p className="text-sm text-gray-500 mb-4">Stock: {product.stockQuantity}</p>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
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