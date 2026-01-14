// Cloudflare Worker AI Image Generation
// Using your deployed worker at odd-haze-d576.hifzafatma16.workers.dev

const WORKER_URL = 'https://odd-haze-d576.hifzafatma16.workers.dev';

export async function generateImage(prompt: string): Promise<HTMLImageElement> {
  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Worker error: ${response.status}`);
  }

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  
  return loadImage(imageUrl);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    img.src = url;
  });
}
