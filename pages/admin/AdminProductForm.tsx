import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, updateProduct, getProductById } from '../../lib/productsService';
import { Product } from '../../types';
import { Save, X, Upload } from 'lucide-react';

const AdminProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        slug: '',
        description: '',
        base_price: 0,
        category_id: '',
        stock_quantity: 0,
        is_active: true,
        image_url: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (isEditMode && id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        setIsLoading(true);
        try {
            const data = await getProductById(productId);
            if (data) {
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    base_price: data.base_price,
                    category_id: data.category_id,
                    stock_quantity: data.stock_quantity || 0,
                    is_active: data.is_active,
                    image_url: data.image_url
                });
                if (data.image_url) {
                    setImagePreview(data.image_url);
                }
            }
        } catch (err) {
            console.error('Failed to fetch product', err);
            alert('Failed to fetch product details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Auto-generate slug from title if slug is empty or user is typing title
        if (name === 'title' && !isEditMode) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditMode && id) {
                await updateProduct(id, formData, imageFile || undefined);
                alert('Product updated successfully');
            } else {
                await addProduct(formData as Omit<Product, 'id'>, imageFile || undefined);
                alert('Product created successfully');
            }
            navigate('/admin/products');
        } catch (err) {
            console.error(err);
            alert('Failed to save product. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-xl-12 col-lg-12">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">{isEditMode ? 'Edit Product' : 'Add New Product'}</h4>
                    </div>
                    <div className="card-body">
                        <div className="basic-form">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Product Name</label>
                                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required placeholder="Product Title" />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Slug</label>
                                        <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required placeholder="product-slug" />
                                    </div>
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Product Description"></textarea>
                                    </div>
                                    <div className="mb-3 col-md-4">
                                        <label className="form-label">Price ($)</label>
                                        <input type="number" className="form-control" name="base_price" value={formData.base_price} onChange={handleChange} required min="0" step="0.01" />
                                    </div>
                                    <div className="mb-3 col-md-4">
                                        <label className="form-label">Quantity</label>
                                        <input type="number" className="form-control" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} min="0" />
                                    </div>
                                    <div className="mb-3 col-md-4">
                                        <label className="form-label">Category</label>
                                        <select className="form-control" name="category_id" value={formData.category_id} onChange={handleChange}>
                                            <option value="">Select Category</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="fashion">Fashion</option>
                                            <option value="home">Home & Garden</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Status</label>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="is_active" checked={!!formData.is_active} onChange={handleChange} />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                {formData.is_active ? 'Active' : 'Inactive'}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Product Image</label>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Upload</span>
                                            <div className="form-file">
                                                <input type="file" className="form-file-input form-control" onChange={handleImageChange} accept="image/*" />
                                            </div>
                                        </div>
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary me-2" disabled={isLoading}>
                                    <Save size={16} className="me-1" /> {isLoading ? 'Saving...' : 'Save Product'}
                                </button>
                                <button type="button" className="btn btn-danger light" onClick={() => navigate('/admin/products')}>
                                    <X size={16} className="me-1" /> Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductForm;
