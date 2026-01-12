
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, Loader2, DollarSign, Edit3, Tag, Key, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { Product } from '../../types';

declare var process: {
    env: {
        API_KEY: string;
    }
};

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct: (newProduct: Omit<Product, 'id' | 'slug' | 'variants'>) => void;
}

const InputField = ({ label, value, onChange, placeholder, name, type = "text", icon: Icon, disabled = false, required = true }) => (
    <div>
        <label htmlFor={name} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gray-500 mb-2">
            <Icon size={14} />
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className="w-full bg-brand-gray-50 border border-brand-gray-200 rounded-lg py-3 px-4 text-sm text-brand-gray-900 focus:outline-none focus:border-brand-gray-900 focus:ring-1 focus:ring-brand-gray-900 transition-colors placeholder:text-brand-gray-400 disabled:opacity-50"
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, name, icon: Icon, disabled = false, rows = 3, required = true }) => (
    <div>
        <label htmlFor={name} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gray-500 mb-2">
            <Icon size={14} />
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className="w-full bg-brand-gray-50 border border-brand-gray-200 rounded-lg py-3 px-4 text-sm text-brand-gray-900 focus:outline-none focus:border-brand-gray-900 focus:ring-1 focus:ring-brand-gray-900 transition-colors placeholder:text-brand-gray-400 resize-none disabled:opacity-50"
        />
    </div>
);


const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // Form fields
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [seoTags, setSeoTags] = useState('');
    const [altText, setAltText] = useState('');
    
    // AI state
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setImageFile(null);
        setPreviewUrl(null);
        setTitle('');
        setPrice('');
        setDescription('');
        setKeyPoints('');
        setSeoTags('');
        setAltText('');
        setIsLoadingAi(false);
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };
    
    const handleGenerateDetails = async () => {
        if (!imageFile) return;
        setIsLoadingAi(true);
        setError('');
        
        try {
            const base64Image = await fileToBase64(imageFile);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `You are an expert e-commerce copywriter for BAZZARO, a luxury fashion brand with a minimalist, architectural, and timeless aesthetic. Analyze the following product image.
            
            Generate the following content in the brand's tone of voice:
            1.  'title': A short, evocative product title (e.g., "Sculptural Satchel").
            2.  'description': A compelling short description (2-3 sentences).
            3.  'key_points': An array of 3-4 key selling points or features.
            4.  'seo_tags': An array of 5-7 relevant SEO keywords.
            5.  'alt_text': A descriptive alt text for the image for accessibility and SEO.
            
            Return the response as a valid JSON object.`;

            const response = await ai.models.generateContent({
                model: 'gemini-flash-latest',
                contents: {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: imageFile.type, data: base64Image } }
                    ]
                },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
                            seo_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            alt_text: { type: Type.STRING }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text);
            
            setTitle(data.title || '');
            setDescription(data.description || '');
            setKeyPoints(data.key_points?.join('\n') || '');
            setSeoTags(data.seo_tags?.join(', ') || '');
            setAltText(data.alt_text || '');

        } catch (e) {
            console.error("AI Generation Error:", e);
            setError("Failed to generate details. Please try again.");
        } finally {
            setIsLoadingAi(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Omit<Product, 'id' | 'slug' | 'variants'> = {
            title,
            description,
            base_price: parseFloat(price) || 0,
            category_id: 'c1', // Placeholder category
            image_url: previewUrl || '', // In real app, this would be the uploaded URL from storage
            other_images: [],
            is_active: true,
            tags: seoTags.split(',').map(tag => tag.trim()),
            benefits: keyPoints.split('\n').map(point => point.trim()),
            // other fields can be added here
        };
        onAddProduct(newProduct);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-brand-gray-950/50 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                >
                    <div className="bg-brand-gray-100 w-full h-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-brand-gray-200">
                            <h2 className="font-bold uppercase text-brand-gray-900 text-sm">Add New Product</h2>
                            <button onClick={handleClose} className="p-2 text-brand-gray-500 hover:text-brand-gray-900 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </header>
                        
                        <form onSubmit={handleSubmit} className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
                            {/* Left Column: Image */}
                            <div className="flex flex-col gap-4">
                                <div className="aspect-square w-full bg-brand-gray-200 rounded-lg flex items-center justify-center relative">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Product preview" className="w-full h-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="text-center text-brand-gray-500">
                                            <Upload size={48} className="mx-auto" />
                                            <p className="mt-2 text-sm font-semibold">Upload Product Image</p>
                                        </div>
                                    )}
                                     <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <InputField label="Image Alt Text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g., a minimalist cream tote bag" name="altText" icon={ImageIcon} disabled={isLoadingAi} />
                            </div>

                            {/* Right Column: Details */}
                            <div className="space-y-4 relative">
                                {isLoadingAi && (
                                    <div className="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center gap-4 rounded-lg">
                                        <Loader2 size={32} className="animate-spin text-brand-gray-900" />
                                        <p className="text-sm font-bold text-brand-gray-800">Generating details...</p>
                                    </div>
                                )}
                                <button type="button" onClick={handleGenerateDetails} disabled={!imageFile || isLoadingAi} className="w-full bg-brand-gray-900 text-white h-12 rounded-lg font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-brand-gray-800 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Sparkles size={16} /> Generate with AI
                                </button>

                                {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                                
                                <InputField label="Product Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Minimalist Leather Tote" name="title" icon={Edit3} disabled={isLoadingAi} />
                                <InputField label="Price (INR)" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 22999" name="price" type="number" icon={DollarSign} disabled={isLoadingAi} />
                                <TextAreaField label="Short Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="A testament to simplicity..." name="description" icon={Edit3} disabled={isLoadingAi} />
                                <TextAreaField label="Key Points (one per line)" value={keyPoints} onChange={e => setKeyPoints(e.target.value)} placeholder="Made with vegetable-tanned leather..." name="keyPoints" icon={Key} disabled={isLoadingAi} rows={4} />
                                <InputField label="SEO Tags (comma-separated)" value={seoTags} onChange={e => setSeoTags(e.target.value)} placeholder="Leather, Handmade, Minimalist" name="seoTags" icon={Tag} disabled={isLoadingAi} />

                            </div>
                        </form>
                        
                        <footer className="flex-shrink-0 p-4 flex justify-end items-center gap-4 border-t border-brand-gray-200">
                            <button type="button" onClick={handleClose} className="px-6 py-2 text-sm font-bold text-brand-gray-600 hover:bg-brand-gray-200 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" onClick={handleSubmit} className="bg-brand-gray-900 text-brand-gray-50 px-6 py-2 text-sm font-bold uppercase rounded-lg hover:bg-brand-gray-800 transition-colors">Save Product</button>
                        </footer>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddProductModal;
