/**
 * Image utility functions for processing and compression
 */

export const compressBase64Image = async (
  base64: string,
  maxWidth = 512,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    
    img.onload = () => {
      // Create canvas for image manipulation
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Draw and compress image
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not found");
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };
    
    img.onerror = reject;
  });
};