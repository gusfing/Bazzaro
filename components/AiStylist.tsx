
import React, { useState, useEffect, useCallback } from 'react';
import { generateContent, parseJsonResponse } from '../lib/openrouter';
import { Product } from '../types';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import AiStylistCard from './AiStylistCard';

interface AiStylistProps {
  currentProduct: Product;
  allProducts: Product[];
}

const AiStylist: React.FC<AiStylistProps> = ({ currentProduct, allProducts }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const getRecommendations = useCallback(async () => {
    // Check if OpenRouter API key is configured
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      setError("AI recommendations are not available in this demo.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const availableProductsString = allProducts
        .map(p => `id: "${p.id}", title: "${p.title}", category: "${p.category_id}"`)
        .join('\n');

      const prompt = `You are an expert fashion stylist for a luxury, minimalist brand called BAZZARO. Your task is to recommend products that complete a look based on a primary item.

Primary Item:
- Title: ${currentProduct.title}
- Description: ${currentProduct.description}
- Category: ${currentProduct.category_id}
- Tags: ${currentProduct.tags?.join(', ')}

Available Products (do not recommend the primary item):
${availableProductsString}

From the list of available products, select 2 to 3 items that would stylistically complement the primary item. Consider creating a cohesive look for different occasions.

Return your response as a JSON object containing a single key "product_ids" with an array of the recommended product IDs. For example: {"product_ids": ["p3", "p8"]}. Return ONLY the JSON, no other text.`;

      const response = await generateContent(prompt);
      const responseJson = parseJsonResponse<{ product_ids: string[] }>(response);
      const recommendedIds = responseJson.product_ids;

      if (Array.isArray(recommendedIds)) {
        const foundProducts = recommendedIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => Boolean(p));
        setRecommendations(foundProducts);
      } else {
        throw new Error('Invalid response format from AI.');
      }
    } catch (e) {
      console.error("Error fetching AI recommendations:", e);
      
      // Provide fallback recommendations instead of showing error
      const fallbackRecommendations = allProducts
        .filter(p => p.id !== currentProduct.id && p.category_id === currentProduct.category_id)
        .slice(0, 3);
      
      if (fallbackRecommendations.length > 0) {
        setRecommendations(fallbackRecommendations);
        setError("Showing popular items from the same category.");
      } else {
        // Show random products as fallback
        const randomProducts = allProducts
          .filter(p => p.id !== currentProduct.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        setRecommendations(randomProducts);
        setError("AI styling is temporarily unavailable. Showing recommended items.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentProduct, allProducts, refreshKey]);

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const SkeletonLoader = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[3/4] bg-brand-gray-800 rounded-lg relative overflow-hidden shimmer"></div>
          <div className="h-3 bg-brand-gray-800 rounded w-3/4 relative overflow-hidden shimmer"></div>
          <div className="h-3 bg-brand-gray-800 rounded w-1/2 relative overflow-hidden shimmer"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="my-12 py-8 border-y border-brand-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400 flex items-center gap-3">
          <Sparkles size={16} className="text-brand-tan" />
          Styled by AI
        </h3>
        <button onClick={handleRefresh} disabled={isLoading} className="text-brand-gray-500 hover:text-brand-gray-50 transition-colors flex items-center gap-2 text-xs font-bold disabled:opacity-50">
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Generating...' : 'Refresh'}
        </button>
      </div>
      
      {isLoading && <SkeletonLoader />}
      
      {error && !isLoading && (
        <div className="text-center text-sm text-brand-gray-500 py-8 flex flex-col items-center gap-4">
          <AlertTriangle size={24} className="text-brand-warning" />
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && recommendations.length > 0 && (
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map(product => (
                <AiStylistCard key={product.id} product={product} />
            ))}
         </div>
      )}
    </div>
  );
};

export default AiStylist;
