/**
 * Debug script to check what's actually in the generated_images table
 */

import { db } from '../src/lib/db';
import { generatedImages } from '../src/lib/db/schema';
import { desc } from 'drizzle-orm';

async function checkImages() {
  console.log('🔍 Checking generated images in database...\n');

  try {
    const images = await db
      .select()
      .from(generatedImages)
      .orderBy(desc(generatedImages.generatedAt))
      .limit(5);

    console.log(`Found ${images.length} images:\n`);

    images.forEach((img, idx) => {
      console.log(`Image ${idx + 1}:`);
      console.log(`  ID: ${img.id}`);
      console.log(`  Prompt: ${img.prompt}`);
      console.log(`  Image URL: ${img.imageUrl}`);
      console.log(`  Status: ${img.status}`);
      console.log(`  Replicate ID: ${img.replicateId}`);
      console.log(`  Generated At: ${img.generatedAt}`);
      console.log(`  User ID: ${img.userId}`);
      console.log('  ---');
    });

    // Check if URLs are valid
    console.log('\n🔗 Checking if URLs are accessible...');
    for (const img of images.slice(0, 3)) {
      try {
        const response = await fetch(img.imageUrl, { method: 'HEAD' });
        console.log(`${img.prompt}: ${response.status} ${response.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`${img.prompt}: ❌ Error - ${error}`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }

  process.exit(0);
}

checkImages();

