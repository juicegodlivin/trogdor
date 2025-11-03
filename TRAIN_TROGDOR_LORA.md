# Train Your Custom Trogdor LoRA

## Why Train a LoRA?

**Perfect character consistency** - The model will know exactly what "TRGDR" looks like and generate it consistently every time.

**Better results** - Instead of describing Trogdor in every prompt, just type "TRGDR" and it knows.

**Cost effective** - $5-10 one-time training cost, then same generation costs as before.

## Step-by-Step Guide

### 1. Prepare Training Images (15-30 minutes)

You need **10-20 high-quality images** of Trogdor.

#### Option A: Use Your Existing Image + Variations
1. Start with your reference image (`public/images/trogdor/Trogdor the Burninator.png`)
2. Create variations:
   - Different backgrounds (transparent, white, colored)
   - Different poses (if you can draw/edit)
   - Mirrored versions
   - Slightly different angles/crops

#### Option B: Collect from Original Source
- Download Trogdor images from Homestar Runner (if available)
- Use official merchandise images
- Use fan art you have rights to

#### Option C: Generate Initial Set with Current AI
1. Generate 10-15 images with current system
2. Pick the best ones that look most like Trogdor
3. Use those to train the LoRA
4. This creates a "refinement loop"

#### Image Requirements:
- **Format**: JPG or PNG
- **Size**: 512px - 1024px (will be auto-resized)
- **Quality**: Clear, not blurry
- **Variety**: Different poses, angles, backgrounds
- **Consistency**: All images should show the same character design

### 2. Organize Your Training Data

Create this structure:
```
training-data/
├── trogdor-breathing-fire.jpg
├── trogdor-side-view.jpg
├── trogdor-flying.jpg
├── trogdor-standing.jpg
├── trogdor-angry.jpg
└── ... (10-20 total images)
```

**Optional but recommended**: Add caption files:
```
training-data/
├── trogdor-breathing-fire.jpg
├── trogdor-breathing-fire.txt  → "TRGDR breathing fire"
├── trogdor-side-view.jpg
├── trogdor-side-view.txt       → "TRGDR side view, green dragon"
```

### 3. Create a Zip File

```bash
# On Windows
Right-click folder → Send to → Compressed (zipped) folder

# Or use command line
tar -czf trogdor-training.zip training-data/
```

### 4. Upload Training Data

#### Option A: Use Replicate's Web Interface (Easiest)
1. Go to https://replicate.com/ostris/flux-dev-lora-trainer
2. Click "Train a new version"
3. Upload your zip file directly

#### Option B: Upload to Your Own URL
1. Upload zip to Cloudflare R2, S3, or Dropbox
2. Get public URL
3. Use in training script

### 5. Run the Training

#### Method 1: Via Replicate Web Interface (Recommended for first time)

1. Go to: https://replicate.com/ostris/flux-dev-lora-trainer
2. Click **"Train"** button
3. Fill in the form:

```
Input images: [Upload your zip file]
Trigger word: TRGDR
Steps: 1000
Learning rate: 0.0004
Resolution: 512,768,1024
Autocaption: true
Autocaption prefix: TRGDR,
```

4. Click **"Start Training"**
5. Wait 10-20 minutes

#### Method 2: Via API (For automation)

```bash
# Add to package.json scripts:
"train-lora": "tsx scripts/train-trogdor-lora.ts"

# Add to .env.local:
REPLICATE_USERNAME=your-username

# Run:
npm run train-lora -- --train
```

### 6. Monitor Training Progress

- You'll get a URL like: `https://replicate.com/p/abc123xyz`
- Watch the progress bar
- Training typically takes **10-20 minutes**
- Cost: **~$5-10 one-time**

### 7. Use Your Trained Model

Once training completes, update your generator:

```typescript
// In src/server/routers/generator.ts

// Change this line:
const GENERATION_MODEL = 'your-username/trogdor-lora';

// Simplify the prompt:
const enhancedPrompt = `TRGDR ${input.prompt}. ${STYLE_MODIFIERS}`;

// Remove the detailed character description - not needed anymore!
```

Now when users type **"burninating Wall Street"**, the system generates:
```
TRGDR burninating Wall Street. Hand-drawn cartoon style, bold black outlines...
```

And the model **knows exactly what TRGDR looks like** from your training images!

## Expected Results

### Before LoRA:
- ❌ Inconsistent Trogdor appearance
- ❌ Sometimes wrong number of arms
- ❌ Color variations
- ❌ Style inconsistency

### After LoRA:
- ✅ Perfect Trogdor every time
- ✅ Consistent green color, beefy arm, V-spikes
- ✅ Maintains your exact character design
- ✅ Just type "TRGDR" instead of long description

## Training Tips

### For Best Results:

1. **Quality over Quantity**
   - 10 great images > 30 mediocre images
   - Use your best, clearest images

2. **Variety Matters**
   - Different poses
   - Different angles
   - Different backgrounds
   - But always the same character design!

3. **Consistent Style**
   - All training images should be same art style
   - If using hand-drawn, all should be hand-drawn
   - Mix of styles can confuse the model

4. **Use Captions** (optional but helpful)
   - Describe what makes Trogdor unique
   - "TRGDR green dragon with beefy arm"
   - "TRGDR breathing flames"

### Common Issues & Solutions:

**Issue**: Model forgets Trogdor's details
- **Solution**: Train longer (1500 steps instead of 1000)
- **Solution**: Add more training images

**Issue**: Model generates blurry images
- **Solution**: Use higher resolution training images
- **Solution**: Reduce learning rate to 0.0002

**Issue**: Model overfits (only copies training images exactly)
- **Solution**: Add more variety to training set
- **Solution**: Reduce training steps to 800

## Alternative: Quick Test with Existing LoRA

If you want to test before training:

Try using an existing cartoon LoRA to see how it works:
```typescript
const GENERATION_MODEL = 'artificialguybr/ps1redmond-ps1-style-lora';
const enhancedPrompt = `ps1 ${input.prompt}`;
```

This lets you understand the workflow before investing in custom training.

## Cost Breakdown

| Item | Cost |
|------|------|
| Training (one-time) | $5-10 |
| Generation after training | $0.04 per image (same as before) |
| **Total first month** | $15-20 + (number of generations × $0.04) |
| **Ongoing** | Same as before |

**Worth it?** Absolutely - one-time cost for perfect consistency forever!

## Next Steps After Training

1. **Test Your Model**
   - Generate 10 test images
   - Verify consistency
   - Check different scenes/prompts

2. **Fine-tune if Needed**
   - If results not perfect, retrain with adjusted settings
   - Add more training images
   - Adjust learning rate or steps

3. **Update Documentation**
   - Document your trigger word
   - Share example prompts
   - Create prompt templates

4. **Share with Community**
   - Post example generations
   - Get feedback
   - Iterate on training data

## Resources

- [Replicate Training Docs](https://replicate.com/docs/guides/fine-tune-an-image-model)
- [LoRA Training Best Practices](https://replicate.com/blog/lora-faster-fine-tuning-of-stable-diffusion)
- [Flux LoRA Trainer](https://replicate.com/ostris/flux-dev-lora-trainer)

## Questions?

Common questions answered in `AI_IMAGE_GENERATION_GUIDE.md`

Ready to train? Let's burninate! 🔥🐉

