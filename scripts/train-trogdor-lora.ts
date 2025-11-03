/**
 * Train a custom Trogdor LoRA for consistent character generation
 * 
 * Usage:
 * 1. Put your Trogdor training images in public/images/trogdor/training/
 * 2. Create a .zip file of those images
 * 3. Upload the .zip to a public URL or use Replicate's file upload
 * 4. Run: npx tsx scripts/train-trogdor-lora.ts
 */

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

async function trainTrogdorLoRA() {
  console.log('🐉 Starting Trogdor LoRA training...');

  try {
    // Create a training job
    const training = await replicate.trainings.create(
      'ostris',
      'flux-dev-lora-trainer',
      'e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497',
      {
        destination: `${process.env.REPLICATE_USERNAME}/trogdor-lora`,
        
        input: {
          // Your training data (zip file with Trogdor images)
          input_images: 'https://your-url.com/trogdor-training-images.zip',
          
          // Trigger word - when you use this in prompts, it generates Trogdor
          trigger_word: 'TRGDR',
          
          // Training settings
          steps: 1000, // More steps = better quality but longer training
          learning_rate: 0.0004,
          batch_size: 1,
          resolution: '512,768,1024', // Multiple resolutions for flexibility
          
          // Model settings
          autocaption: true, // Auto-generate captions for images
          autocaption_prefix: 'TRGDR, ', // Prefix all captions with trigger word
        },
      }
    );

    console.log('✅ Training started!');
    console.log('Training ID:', training.id);
    console.log('Status:', training.status);
    console.log('\nYou can monitor progress at:');
    console.log(`https://replicate.com/p/${training.id}`);
    
    console.log('\n⏱️  Training typically takes 10-20 minutes');
    console.log('💰 Cost: ~$5-10 one-time');
    
    console.log('\n📝 Once complete, update your generator.ts:');
    console.log(`const GENERATION_MODEL = '${process.env.REPLICATE_USERNAME}/trogdor-lora';`);
    
    return training;
  } catch (error) {
    console.error('❌ Training failed:', error);
    throw error;
  }
}

// Alternative: Quick setup with public dataset
async function quickTrainExample() {
  console.log('🔥 Quick training example (for testing)');
  console.log('\nTo train with your own images:');
  console.log('1. Create a folder with 10-20 Trogdor images');
  console.log('2. Zip the folder');
  console.log('3. Upload to Replicate or public URL');
  console.log('4. Replace the input_images URL above');
  console.log('\nExample image requirements:');
  console.log('- Format: JPG or PNG');
  console.log('- Resolution: 512px to 1024px (will be resized)');
  console.log('- File names: descriptive (e.g., "trogdor-breathing-fire.jpg")');
  console.log('- Optional: Add .txt files with same name for captions');
}

// Run the training
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    quickTrainExample();
  } else if (args.includes('--train')) {
    trainTrogdorLoRA();
  } else {
    console.log('Trogdor LoRA Training Script');
    console.log('\nUsage:');
    console.log('  npm run train-lora -- --train    # Start training');
    console.log('  npm run train-lora -- --help     # Show setup guide');
    console.log('\nMake sure to:');
    console.log('1. Set REPLICATE_API_TOKEN in .env.local');
    console.log('2. Set REPLICATE_USERNAME in .env.local');
    console.log('3. Prepare your training images');
    quickTrainExample();
  }
}

export { trainTrogdorLoRA };

