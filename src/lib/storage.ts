import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dnoajgtjvfkaabcuwkcp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRub2FqZ3RqdmZrYWFiY3V3a2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODk3ODYsImV4cCI6MjA3NzY2NTc4Nn0.Qe6X4dUMA_UCye3sgWo9zTWSonm-IYZY99eV2QtwSf0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = 'trogdor-images';

/**
 * Upload an image from a URL to Supabase Storage
 * @param imageUrl - The external URL to download from
 * @param fileName - The file name to save as
 * @returns The public URL of the uploaded image
 */
export async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<string> {
  try {
    // Download the image from Replicate
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType: 'image/png',
        cacheControl: '31536000', // 1 year cache
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param fileName - The file name to delete
 */
export async function deleteImage(fileName: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fileName]);

  if (error) {
    console.error('Error deleting image from Supabase:', error);
    throw error;
  }
}

