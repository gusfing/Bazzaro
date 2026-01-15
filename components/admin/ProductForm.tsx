import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { supabase } from '../../lib/supabase';
import { GoogleGenAI, Type } from '@google/genai';
import {
    X, Upload, Sparkles, Loader2, Image as ImageIcon, Check,
    ChevronLeft, Save
} from 'lucide-react';

declare var process: {
    env: {
        API_KEY: string;
    }
};

interface ProductFormProps {
    initialData?: Product | null;
    onSave: (product: any) => Promise<void>;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image_url: '',
        category: 'Bags',
        stock: '10',
        tags: '',
        benefits: ''
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description || '',
                price: initialData.base_price.toString(),
                image_url: initialData.image_url,
                category: initialData.category_id || 'Bags',
                stock: initialData.variants?.[0]?.stock_quantity?.toString() || '10',
                tags: initialData.tags?.join(', ') || '',
                benefits: initialData.benefits?.join('\n') || ''
            });
            setPreviewUrl(initialData.image_url);
        }
    }, [initialData]);

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = formData.image_url;

            if (imageFile) {
                setUploading(true);
                finalImageUrl = await uploadImage(imageFile);
                setUploading(false);
            }

            await onSave({
                ...formData,
                price: parseFloat(formData.price),
                image_url: finalImageUrl,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                benefits: formData.benefits.split('\n').map(b => b.trim()).filter(Boolean),
                variants: [{
                    id: crypto.randomUUID(),
                    size: 'One Size',
                    color: 'Standard',
                    stock_quantity: parseInt(formData.stock) || 0
                }]
            });
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateWithAI = async () => {
        if (!imageFile && !previewUrl) return;
        setAiLoading(true);

        try {
            // Updated SDK usage for @google/genai
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY });

            // Convert image to base64
            let base64Image = '';
            if (imageFile) {
                base64Image = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                });
            }

            const prompt = `Analyze this product image for a luxury brand 'Bazzaro'. Generate a JSON with: title, description (2 sentences), price (estimate in INR number), tags (comma separated string), features (newline separated string).`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            ...(base64Image ? [{ inlineData: { mimeType: imageFile!.type, data: base64Image } }] : [])
                        ]
                    }
                ],
                config: {
                    responseMimeType: 'application/json'
                }
            });

            const text = response.text();

            // Basic cleaning if needed, though responseMimeType usually handles it
            const jsonStr = text?.replace(/```json|```/g, '').trim();
            const data = jsonStr ? JSON.parse(jsonStr) : {};

            setFormData(prev => ({
                ...prev,
                title: data.title || prev.title,
                description: data.description || prev.description,
                price: data.price?.toString() || prev.price,
                tags: data.tags || prev.tags,
                benefits: data.features || prev.benefits
            }));

        } catch (error) {
            console.error("AI Generation failed:", error);
            // Don't alert blocking errors, just log it
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || uploading}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {(loading || uploading) ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Product
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Left: Image Upload */}
                <div className="w-full lg:w-1/3 bg-gray-50 p-6 border-r border-gray-200 flex flex-col gap-6 overflow-y-auto">
                    <div className="aspect-square bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-900 transition-colors relative flex flex-col items-center justify-center overflow-hidden group">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                    Click to Change
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Upload size={20} className="text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Upload Image</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={generateWithAI}
                        disabled={!imageFile && !previewUrl || aiLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Autofill with AI
                    </button>
                </div>

                {/* Right: Details Form */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                                    placeholder="e.g. Minimalist Leather Tote"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none"
                                    placeholder="Detailed product description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Features (One per line)</label>
                                <textarea
                                    value={formData.benefits}
                                    onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none"
                                    placeholder="- 100% Genuine Leather&#10;- Handcrafted in Italy"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                                    placeholder="leather, bag, minimalist"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
