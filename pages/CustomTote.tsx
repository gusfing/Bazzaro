import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateContent } from '../lib/openrouter';
import { generateImage } from '../lib/imageGen';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Type, Palette, Sparkles, Loader2, ShoppingBag, Wand2 } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { CartItem } from '../types';

interface CustomToteProps {
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
}

const toteColors = [
    { name: 'Onyx', hex: '#111111', baseImage: 'https://i.imgur.com/9q2y2nE.png' },
    { name: 'Cream', hex: '#F5F5DC', baseImage: 'https://i.imgur.com/w3Ii2VE.png' },
    { name: 'Olive', hex: '#556B2F', baseImage: 'https://i.imgur.com/zJzL8iF.png' },
];

const toteBasePrice = 65.00;

// Fallback ideas when AI API is unavailable
const getFallbackIdeas = (concept: string): string[] => {
    const conceptLower = concept.toLowerCase();
    
    if (conceptLower.includes('ocean') || conceptLower.includes('sea') || conceptLower.includes('water')) {
        return ['Tidal Lines', 'Salt Spray & Sun', 'Cerulean Depth', 'Wave Whispers', 'Coastal Breeze'];
    } else if (conceptLower.includes('mountain') || conceptLower.includes('peak') || conceptLower.includes('summit')) {
        return ['Alpine Silhouette', 'Peak Serenity', 'Mountain Mist', 'Summit Dreams', 'Stone & Sky'];
    } else if (conceptLower.includes('flower') || conceptLower.includes('floral') || conceptLower.includes('bloom')) {
        return ['Petal Poetry', 'Bloom & Fade', 'Garden Whispers', 'Floral Essence', 'Botanical Grace'];
    } else if (conceptLower.includes('sun') || conceptLower.includes('solar') || conceptLower.includes('light')) {
        return ['Golden Hour', 'Solar Radiance', 'Light & Shadow', 'Dawn Embrace', 'Sunlit Path'];
    } else if (conceptLower.includes('moon') || conceptLower.includes('lunar') || conceptLower.includes('night')) {
        return ['Lunar Glow', 'Midnight Serenity', 'Crescent Dreams', 'Starlit Night', 'Moon Phase'];
    } else {
        return ['Minimalist Lines', 'Abstract Form', 'Geometric Grace', 'Simple Elegance', 'Modern Art'];
    }
};

const CustomTote: React.FC<CustomToteProps> = ({ onAddToCart }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedColor, setSelectedColor] = useState(toteColors[0]);
    const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [customText, setCustomText] = useState('');
    const [font, setFont] = useState('serif');

    const [ideaPrompt, setIdeaPrompt] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
    
    // AI Image Generation state
    const [aiImagePrompt, setAiImagePrompt] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [aiImageError, setAiImageError] = useState('');

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const baseImage = new Image();
        baseImage.crossOrigin = 'anonymous';
        baseImage.src = selectedColor.baseImage;
        
        const draw = () => {
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseImage, 0, 0);

            // Define printable area (example values, adjust as needed)
            const printArea = { x: 200, y: 150, width: 200, height: 250 };
            
            // Draw uploaded image
            if (uploadedImage) {
                const hRatio = printArea.width / uploadedImage.width;
                const vRatio = printArea.height / uploadedImage.height;
                const ratio = Math.min(hRatio, vRatio);
                const centerShiftX = (printArea.width - uploadedImage.width * ratio) / 2;
                const centerShiftY = (printArea.height - uploadedImage.height * ratio) / 2;
                
                ctx.drawImage(uploadedImage, 0, 0, uploadedImage.width, uploadedImage.height,
                    printArea.x + centerShiftX, printArea.y + centerShiftY, uploadedImage.width * ratio, uploadedImage.height * ratio);
            }

            // Draw custom text
            if (customText) {
                ctx.font = `bold 24px ${font === 'serif' ? '"Playfair Display", serif' : 'Inter, sans-serif'}`;
                ctx.fillStyle = font === 'serif' ? '#222222' : '#333333';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textX = printArea.x + printArea.width / 2;
                const textY = uploadedImage ? printArea.y + printArea.height - 15 : printArea.y + printArea.height / 2;
                ctx.fillText(customText, textX, textY);
            }
        };
        
        if (baseImage.complete) {
            draw();
        } else {
            baseImage.onload = draw;
        }
    }, [selectedColor, uploadedImage, customText, font]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);
    
    useEffect(() => {
        const pageTitle = 'Design Your Own Tote | BAZZARO';
        const pageDescription = 'Unleash your creativity at the BAZZARO Atelier. Design a custom tote bag with your own graphics and text.';
        document.title = pageTitle;
        document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setUploadedImage(img);
                };
                img.src = event.target.result as string;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleGetIdeas = async () => {
        if (!ideaPrompt) return;
        setIsLoadingIdeas(true);
        setIdeas([]);
        try {
            const result = await generateContent(
                `Generate 5 short, creative, and evocative text prompts for a minimalist design on a tote bag based on the following concept: "${ideaPrompt}". The prompts should be suitable for a luxury, artistic fashion brand. For example, if the concept is "ocean", you could suggest "Tidal Lines", "Salt Spray & Sun", "Cerulean Depth". Return only the prompts, separated by newlines.`
            );
            const text = result.trim();
            setIdeas(text.split('\n').map(idea => idea.replace(/^- /, '').replace(/^\d+\.\s*/, '').trim()).filter(Boolean));
        } catch (error) {
            console.error("Error fetching design ideas:", error);
            // Provide fallback ideas when API is unavailable
            const fallbackIdeas = getFallbackIdeas(ideaPrompt);
            setIdeas(fallbackIdeas);
        } finally {
            setIsLoadingIdeas(false);
        }
    };
    
    const handleGenerateAiImage = async () => {
        if (!aiImagePrompt) return;
        setIsGeneratingImage(true);
        setAiImageError('');
        
        try {
            // Enhance prompt for better tote bag design results
            const enhancedPrompt = `Minimalist artistic design for luxury tote bag print: ${aiImagePrompt}, clean elegant style, white background, centered composition, high quality illustration`;
            
            console.log('Generating image with prompt:', enhancedPrompt);
            const img = await generateImage(enhancedPrompt);
            console.log('Image generated successfully:', img.width, 'x', img.height);
            setGeneratedImageUrl(img.src);
            setUploadedImage(img);
        } catch (error) {
            console.error("Error generating AI image:", error);
            setAiImageError('Failed to generate image. Please try again.');
        } finally {
            setIsGeneratingImage(false);
        }
    };
    
    const handleAddToCart = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const previewImage = canvas.toDataURL('image/png');

        const customItem: Omit<CartItem, 'quantity'> = {
            variantId: `custom-${Date.now()}`,
            productId: `custom-tote-${selectedColor.name.toLowerCase()}`,
            title: 'Custom Designed Tote',
            price: toteBasePrice,
            size: 'OS',
            color: selectedColor.name,
            image: previewImage,
        };
        onAddToCart(customItem);
    };

    return (
        <div className="min-h-screen bg-brand-gray-100 text-brand-gray-900 pt-24">
            <Breadcrumbs />
            <div className="px-8 py-12 max-w-7xl mx-auto">
                <header className="mb-12 text-center animate-reveal">
                    <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block">The Atelier</span>
                    <h1 className="font-serif text-5xl text-brand-gray-900 italic">Design Your Own Tote</h1>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Preview */}
                    <div className="lg:sticky lg:top-32 animate-reveal" style={{ animationDelay: '0.2s' }}>
                        <canvas ref={canvasRef} className="w-full h-auto rounded-2xl shadow-2xl bg-white"></canvas>
                        {generatedImageUrl && (
                            <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
                                <p className="text-xs font-bold text-brand-gray-500 mb-2">Generated Design:</p>
                                <img src={generatedImageUrl} alt="Generated design" className="w-full max-w-[200px] mx-auto rounded-lg" />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="space-y-8 animate-reveal" style={{ animationDelay: '0.4s' }}>
                        {/* 1. Color */}
                        <ControlSection title="1. Choose Color" icon={<Palette size={18}/>}>
                             <div className="flex gap-4">
                                {toteColors.map(color => (
                                    <button key={color.name} onClick={() => setSelectedColor(color)} className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor.name === color.name ? 'border-brand-tan scale-110' : 'border-transparent hover:scale-105'}`} style={{backgroundColor: color.hex}}/>
                                ))}
                             </div>
                        </ControlSection>
                        
                        {/* 2. Graphic */}
                        <ControlSection title="2. Add Graphic" icon={<Upload size={18}/>}>
                            <input type="file" id="imageUpload" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
                            <label htmlFor="imageUpload" className="w-full text-center cursor-pointer bg-brand-gray-200/50 text-brand-gray-800 h-14 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-brand-gray-200 flex items-center justify-center">
                                Upload Design
                            </label>
                            <p className="text-xs text-brand-gray-500 mt-2 text-center">Recommended: Transparent PNG, 500x500px</p>
                        </ControlSection>

                        {/* 2.5 AI Image Generation */}
                        <ControlSection title="Or Generate with AI" icon={<Wand2 size={18}/>}>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                <p className="text-xs text-purple-700 mb-3 font-semibold">Describe your design and AI will create it for you!</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={aiImagePrompt} 
                                        onChange={(e) => setAiImagePrompt(e.target.value)} 
                                        placeholder="e.g., abstract mountain landscape" 
                                        className="flex-grow bg-white border border-purple-200 rounded-lg h-12 px-4 text-sm font-bold text-brand-gray-900 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-brand-gray-400" 
                                    />
                                    <button 
                                        onClick={handleGenerateAiImage} 
                                        disabled={isGeneratingImage || !aiImagePrompt} 
                                        className="px-4 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm"
                                    >
                                        {isGeneratingImage ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span className="hidden sm:inline">Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 size={16} />
                                                <span className="hidden sm:inline">Generate</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                {isGeneratingImage && (
                                    <p className="text-xs text-purple-600 mt-2 text-center animate-pulse">
                                        Creating your design... This may take 10-20 seconds
                                    </p>
                                )}
                                {aiImageError && (
                                    <p className="text-xs text-red-600 mt-2 text-center">{aiImageError}</p>
                                )}
                            </div>
                        </ControlSection>

                        {/* 3. Text */}
                        <ControlSection title="3. Add Text" icon={<Type size={18}/>}>
                            <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Your Text Here" maxLength={25} className="w-full bg-white border border-brand-gray-200 rounded-lg h-14 px-4 text-sm font-bold text-brand-gray-900 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-400" />
                            <div className="flex gap-4 mt-2">
                                <button onClick={() => setFont('serif')} className={`px-4 py-2 rounded-lg text-sm ${font === 'serif' ? 'bg-brand-gray-900 text-white' : 'bg-brand-gray-200'}`}>Serif</button>
                                <button onClick={() => setFont('sans-serif')} className={`px-4 py-2 rounded-lg text-sm ${font === 'sans-serif' ? 'bg-brand-gray-900 text-white' : 'bg-brand-gray-200'}`}>Sans-Serif</button>
                            </div>
                        </ControlSection>

                        {/* AI Text Ideas */}
                        <ControlSection title="Need text inspiration?" icon={<Sparkles size={18}/>}>
                             <div className="bg-brand-tan/10 p-4 rounded-xl border border-brand-tan/20">
                                <p className="text-xs text-brand-sepia mb-3 font-semibold">Describe a concept and let our AI generate text ideas for you.</p>
                                <div className="flex gap-2">
                                    <input type="text" value={ideaPrompt} onChange={(e) => setIdeaPrompt(e.target.value)} placeholder="e.g., minimalist wave logo" className="flex-grow bg-white border border-brand-gray-200 rounded-lg h-12 px-4 text-sm font-bold text-brand-gray-900 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-400" />
                                    <button onClick={handleGetIdeas} disabled={isLoadingIdeas} className="w-12 h-12 bg-brand-tan text-brand-gray-950 rounded-lg flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50">
                                        {isLoadingIdeas ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                    </button>
                                </div>
                                <AnimatePresence>
                                {ideas.length > 0 && (
                                    <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="mt-4 space-y-2">
                                        {ideas.map((idea, i) => (
                                            <button key={i} onClick={() => setCustomText(idea)} className="block w-full text-left p-2 rounded-md hover:bg-brand-tan/20 text-xs font-bold text-brand-sepia transition-colors">
                                                - "{idea}"
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                             </div>
                        </ControlSection>
                        
                        {/* Add to Cart */}
                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-bold text-brand-gray-500">Total Price</span>
                                <span className="font-serif text-3xl italic">${toteBasePrice.toFixed(2)}</span>
                            </div>
                            <button onClick={handleAddToCart} className="w-full bg-brand-gray-900 text-brand-gray-50 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-brand-gray-800 flex items-center justify-center gap-3">
                                <ShoppingBag size={18} />
                                Add to Bag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ControlSection: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({title, icon, children}) => (
    <section>
        <h2 className="text-sm font-bold text-brand-gray-900 mb-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-brand-gray-200/80 flex items-center justify-center">{icon}</div>{title}</h2>
        <div className="pl-11">{children}</div>
    </section>
);

export default CustomTote;
