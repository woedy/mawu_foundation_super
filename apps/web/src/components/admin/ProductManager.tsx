import { useState } from "react";
import { api } from "../../lib/api";
import { Button, Card, Heading, Body } from "../../design-system";
import { ProductForm } from "./ProductForm";
// Define types locally since we can't import from shared in frontend
interface VariationOption {
  value: string;
  label: string;
  priceModifier?: number;
  inventory?: number;
  images?: string[];
}

interface ProductVariation {
  type: 'color' | 'size' | 'style';
  name: string;
  options: VariationOption[];
}

interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  currency: string;
  tags: string[];
  impactStatement?: string;
  description: string;
  images: string[];
  availability: string;
  inventory: number;
  variations?: ProductVariation[];
  createdAt: string;
  updatedAt: string;
}

interface ProductManagerProps {
  products: Product[];
  onRefresh: () => void;
}

export const ProductManager = ({ products, onRefresh }: ProductManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/admin/products/${productId}`);
      onRefresh();
    } catch (error: any) {
      alert(`Failed to delete product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (productData: any) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/api/admin/products/${editingProduct.id}`, productData);
      } else {
        await api.post('/api/admin/products', productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      onRefresh();
    } catch (error: any) {
      alert(`Failed to save product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const formatVariations = (variations?: ProductVariation[]) => {
    if (!variations || variations.length === 0) return 'No variations';
    return variations.map(v => `${v.name} (${v.options.length} options)`).join(', ');
  };

  if (showForm) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Heading level={2}>
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </Heading>
          <Button variant="ghost" onClick={handleFormCancel}>
            Cancel
          </Button>
        </div>
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Heading level={2}>Product Management</Heading>
        <Button onClick={handleCreateProduct}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  {product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <Body variant="muted" className="mt-1">
                      {product.category} • {product.currency} {product.price}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      Stock: {product.inventory} • Status: {product.availability}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      Variations: {formatVariations(product.variations)}
                    </Body>
                    {product.impactStatement && (
                      <Body variant="muted" className="mt-2 italic">
                        "{product.impactStatement}"
                      </Body>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  disabled={loading}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {products.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <Body variant="muted">No products found</Body>
              <Button className="mt-4" onClick={handleCreateProduct}>
                Create Your First Product
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};