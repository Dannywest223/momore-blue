import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';



const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
    setFormData(prev => ({
      ...prev,
      images: Array.from(e.target.files)
    }));
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
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
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

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                featured: false,
                stockQuantity: '',
                images: []
              });
            }}
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="images">Product Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingProduct}
                  />
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
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                    }}
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
        <img
          src={
            product.images && product.images.length > 0
              ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.images[0]}`
              : 'https://via.placeholder.com/400x300?text=No+Image'
          }
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
          }}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
            Featured
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