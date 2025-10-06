import { useState, useEffect } from "react";
import { Button, Card, Body } from "../../design-system";
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
}

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

export const ProductForm = ({ product, onSubmit, onCancel, loading }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    currency: 'GHS',
    tags: [] as string[],
    impactStatement: '',
    description: '',
    images: [] as string[],
    availability: 'in_stock',
    inventory: 0,
    variations: [] as ProductVariation[],
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        currency: product.currency,
        tags: product.tags || [],
        impactStatement: product.impactStatement || '',
        description: product.description,
        images: product.images || [],
        availability: product.availability,
        inventory: product.inventory,
        variations: product.variations || [],
      });
    }
  }, [product]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: product ? prev.slug : generateSlug(name)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  const handleAddVariation = () => {
    const newVariation: ProductVariation = {
      type: 'color',
      name: 'New Variation',
      options: []
    };
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, newVariation]
    }));
  };

  const handleUpdateVariation = (index: number, variation: ProductVariation) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => i === index ? variation : v)
    }));
  };

  const handleRemoveVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded border border-ink-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
              className="w-full rounded border border-ink-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              className="w-full rounded border border-ink-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <div className="flex gap-2">
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="rounded border border-ink-300 px-3 py-2"
              >
                <option value="GHS">GHS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                className="flex-1 rounded border border-ink-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inventory *</label>
            <input
              type="number"
              value={formData.inventory}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory: parseInt(e.target.value) || 0 }))}
              required
              min="0"
              className="w-full rounded border border-ink-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full rounded border border-ink-300 px-3 py-2"
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="pre_order">Pre Order</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            rows={4}
            className="w-full rounded border border-ink-300 px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Impact Statement</label>
          <textarea
            value={formData.impactStatement}
            onChange={(e) => setFormData(prev => ({ ...prev, impactStatement: e.target.value }))}
            rows={2}
            className="w-full rounded border border-ink-300 px-3 py-2"
            placeholder="How does purchasing this product create impact?"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Tags</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            className="flex-1 rounded border border-ink-300 px-3 py-2"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" onClick={handleAddTag} variant="secondary">
            Add Tag
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-brand-600 hover:text-brand-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Images</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Add image URL"
            className="flex-1 rounded border border-ink-300 px-3 py-2"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
          />
          <Button type="button" onClick={handleAddImage} variant="secondary">
            Add Image
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="h-32 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(image)}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Card>

      <VariationManager
        variations={formData.variations}
        onAddVariation={handleAddVariation}
        onUpdateVariation={handleUpdateVariation}
        onRemoveVariation={handleRemoveVariation}
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

interface VariationManagerProps {
  variations: ProductVariation[];
  onAddVariation: () => void;
  onUpdateVariation: (index: number, variation: ProductVariation) => void;
  onRemoveVariation: (index: number) => void;
}

const VariationManager = ({ variations, onAddVariation, onUpdateVariation, onRemoveVariation }: VariationManagerProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Product Variations</h3>
        <Button type="button" onClick={onAddVariation} variant="secondary">
          Add Variation
        </Button>
      </div>
      
      {variations.length === 0 && (
        <Body variant="muted">No variations added. Add variations like color, size, or style options.</Body>
      )}

      <div className="space-y-6">
        {variations.map((variation, index) => (
          <VariationEditor
            key={index}
            variation={variation}
            onUpdate={(updatedVariation) => onUpdateVariation(index, updatedVariation)}
            onRemove={() => onRemoveVariation(index)}
          />
        ))}
      </div>
    </Card>
  );
};

interface VariationEditorProps {
  variation: ProductVariation;
  onUpdate: (variation: ProductVariation) => void;
  onRemove: () => void;
}

const VariationEditor = ({ variation, onUpdate, onRemove }: VariationEditorProps) => {
  const [optionInput, setOptionInput] = useState({ value: '', label: '', priceModifier: 0, inventory: 0 });

  const handleAddOption = () => {
    if (optionInput.value.trim() && optionInput.label.trim()) {
      const newOption: VariationOption = {
        value: optionInput.value.trim(),
        label: optionInput.label.trim(),
        priceModifier: optionInput.priceModifier || undefined,
        inventory: optionInput.inventory || undefined,
      };
      
      onUpdate({
        ...variation,
        options: [...variation.options, newOption]
      });
      
      setOptionInput({ value: '', label: '', priceModifier: 0, inventory: 0 });
    }
  };

  const handleRemoveOption = (optionIndex: number) => {
    onUpdate({
      ...variation,
      options: variation.options.filter((_: any, i: number) => i !== optionIndex)
    });
  };

  return (
    <div className="border border-ink-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={variation.type}
              onChange={(e) => onUpdate({ ...variation, type: e.target.value as 'color' | 'size' | 'style' })}
              className="rounded border border-ink-300 px-3 py-2"
            >
              <option value="color">Color</option>
              <option value="size">Size</option>
              <option value="style">Style</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={variation.name}
              onChange={(e) => onUpdate({ ...variation, name: e.target.value })}
              className="w-full rounded border border-ink-300 px-3 py-2"
              placeholder="e.g., Color, Size, Style"
            />
          </div>
        </div>
        <Button type="button" variant="ghost" onClick={onRemove} className="text-red-600">
          Remove
        </Button>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Add Option</h4>
        <div className="grid gap-2 md:grid-cols-5">
          <input
            type="text"
            value={optionInput.value}
            onChange={(e) => setOptionInput(prev => ({ ...prev, value: e.target.value }))}
            placeholder="Value (e.g., red)"
            className="rounded border border-ink-300 px-3 py-2"
          />
          <input
            type="text"
            value={optionInput.label}
            onChange={(e) => setOptionInput(prev => ({ ...prev, label: e.target.value }))}
            placeholder="Label (e.g., Red)"
            className="rounded border border-ink-300 px-3 py-2"
          />
          <input
            type="number"
            step="0.01"
            value={optionInput.priceModifier}
            onChange={(e) => setOptionInput(prev => ({ ...prev, priceModifier: parseFloat(e.target.value) || 0 }))}
            placeholder="Price modifier"
            className="rounded border border-ink-300 px-3 py-2"
          />
          <input
            type="number"
            value={optionInput.inventory}
            onChange={(e) => setOptionInput(prev => ({ ...prev, inventory: parseInt(e.target.value) || 0 }))}
            placeholder="Inventory"
            className="rounded border border-ink-300 px-3 py-2"
          />
          <Button type="button" onClick={handleAddOption} variant="secondary" size="sm">
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Options ({variation.options.length})</h4>
        {variation.options.map((option: any, optionIndex: number) => (
          <div key={optionIndex} className="flex items-center justify-between bg-ink-50 rounded p-2">
            <div className="flex gap-4 text-sm">
              <span><strong>Value:</strong> {option.value}</span>
              <span><strong>Label:</strong> {option.label}</span>
              {option.priceModifier && <span><strong>Price:</strong> +{option.priceModifier}</span>}
              {option.inventory && <span><strong>Stock:</strong> {option.inventory}</span>}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveOption(optionIndex)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {variation.options.length === 0 && (
          <Body variant="muted" className="text-sm">No options added yet</Body>
        )}
      </div>
    </div>
  );
};