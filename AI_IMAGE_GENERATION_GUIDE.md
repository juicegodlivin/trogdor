# Trogdor AI Image Generation Guide

## Current Implementation

We're using **Flux 1.1 Pro** with detailed character descriptions for consistent Trogdor generation.

### How It Works

**Every generation automatically includes:**
1. **Character Description**: Detailed Trogdor appearance (green S-shaped dragon, beefy arm, consummate V's, etc.)
2. **User's Prompt**: The scene/action they want (e.g., "burninating Wall Street")
3. **Style Modifiers**: Hand-drawn cartoon style, bold outlines, fire effects

**Example Final Prompt:**
```
Trogdor the Burninator, a green S-shaped dragon with a single muscular arm 
emerging from the back, consummate V-shaped spikes down the spine, sharp white 
teeth, breathing bright orange and yellow flames, burninating Wall Street. 
Hand-drawn cartoon style, bold black outlines, vibrant colors, simple shapes, 
comic book illustration, dynamic action scene, flames and fire effects
```

## Configuration

All settings are in `src/server/routers/generator.ts`:

```typescript
// Character description - edit for better consistency
const TROGDOR_CHARACTER_DESCRIPTION = `...`;

// Style modifiers - adjust for different looks
const STYLE_MODIFIERS = `...`;

// Switch models easily
const GENERATION_MODEL = 'black-forest-labs/flux-1.1-pro';
```

## Model Options

### 1. **Flux 1.1 Pro** (Current) ✅
- **Best for**: High quality, excellent prompt adherence
- **Cost**: ~$0.04 per image
- **Speed**: ~10-15 seconds
- **Pros**: Best results, understands complex prompts
- **When to use**: Production, when quality matters

### 2. **Flux Schnell** (Alternative)
- **Model**: `black-forest-labs/flux-schnell`
- **Best for**: Faster generations, lower cost
- **Cost**: ~$0.003 per image
- **Speed**: ~2-3 seconds
- **Pros**: 10x cheaper, much faster
- **Cons**: Slightly lower quality
- **When to use**: Testing, high volume, user doesn't want to wait

### 3. **SDXL** (Fallback)
- **Model**: `stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b`
- **Cost**: ~$0.008 per image
- **When to use**: If Flux has issues

## Advanced Options for Better Consistency

### Option A: Train a Custom LoRA (Recommended Long-Term)

**What it is**: Fine-tune a model specifically on Trogdor images

**Benefits:**
- Perfect character consistency
- Can type "trgdr" and it knows exactly what you mean
- Best quality for your specific character

**How to do it:**
1. Collect 10-20 high-quality Trogdor images (various poses, scenes)
2. Use Replicate's training: `replicate.trainings.create()`
3. Train a LoRA on Flux (costs ~$5-10)
4. Reference: `your-username/trogdor-lora:version`

**Cost**: $5-10 one-time training, same generation cost after

**Implementation:**
```typescript
const output = await replicate.run(
  'your-username/trogdor-lora:abc123',
  {
    input: {
      prompt: `trgdr ${input.prompt}`,
      // Much simpler prompt needed!
    }
  }
);
```

### Option B: Image-to-Image with Reference

**What it is**: Start with your Trogdor reference image, transform it

**Benefits:**
- Uses your exact character design
- Good for specific poses

**Limitations:**
- Less flexible for new scenes
- Character is "locked" to reference pose

**Models that support this:**
- `stability-ai/sdxl-img2img`
- `timothybrooks/instruct-pix2pix`

### Option C: IP-Adapter (Image Prompt Adapter)

**What it is**: Feed reference image + text prompt, model blends them

**Benefits:**
- Maintains character design from reference
- Flexible for new scenes

**How it works:**
```typescript
const output = await replicate.run(
  'model-with-ip-adapter',
  {
    input: {
      prompt: input.prompt,
      image: 'https://yoursite.com/trogdor.png', // Reference image
      ip_adapter_scale: 0.7, // How much to use reference
    }
  }
);
```

### Option D: ControlNet (Advanced)

**What it is**: Guide generation with edge detection, pose, depth maps

**Best for**: Precise control over composition and pose

## Prompt Engineering Tips

### Current Best Practices

1. **Always include character description first**
   - Ensures Trogdor appears prominently
   
2. **Be specific about actions**
   - Good: "breathing flames onto a skyscraper"
   - Bad: "with fire"

3. **Include style keywords**
   - "hand-drawn", "cartoon", "bold outlines"
   - Helps maintain consistent aesthetic

4. **Action words work well**
   - "burninating", "destroying", "towering over"

### Testing Different Styles

You can easily test variations by changing `STYLE_MODIFIERS`:

```typescript
// Current (Hand-drawn cartoon)
const STYLE_MODIFIERS = `Hand-drawn cartoon style, bold black outlines...`;

// Alternative: More epic/detailed
const STYLE_MODIFIERS = `Epic fantasy art style, highly detailed, 
dramatic lighting, volumetric flames, digital painting, 4K quality`;

// Alternative: Pixel art
const STYLE_MODIFIERS = `Pixel art style, 16-bit graphics, retro gaming, 
vibrant pixels, clear outlines`;

// Alternative: Photorealistic (for memes)
const STYLE_MODIFIERS = `Photorealistic, cinematic lighting, dramatic scene, 
rendered in Unreal Engine, 8K detail`;
```

## Cost Optimization

### Current Costs (Flux 1.1 Pro)
- $0.04 per image
- Rate limit: 10 images/hour per user
- Monthly estimate: ~$120 for 3,000 images

### Optimization Strategies

1. **Use Flux Schnell for testing**
   - Switch to Schnell during development
   - Use Pro for production only

2. **Implement caching**
   - Already implemented: 24-hour Redis cache
   - If same prompt requested, return cached image

3. **Train a LoRA** (long-term best option)
   - One-time $10 cost
   - Same quality, potentially better consistency
   - Can use cheaper base models after

## Monitoring & Iteration

### Check Generation Quality

Look at the saved metadata:
```typescript
// Each generation stores:
{
  model: 'black-forest-labs/flux-1.1-pro',
  parameters: {
    enhancedPrompt: 'full prompt used',
    characterDescription: 'Trogdor description',
    originalPrompt: 'user input'
  }
}
```

### A/B Testing Different Prompts

1. Save multiple character descriptions
2. Randomly select one
3. Track which gets better user engagement

### User Feedback Loop

Consider adding:
- 👍/👎 on generated images
- "Regenerate" button
- Save favorite generations to learn from

## Next Steps

### Immediate (Already Done ✅)
- [x] Switched to Flux 1.1 Pro
- [x] Added detailed Trogdor character description
- [x] Made configuration easy to modify
- [x] Added proper error handling

### Short-term (Optional)
- [ ] Test Flux Schnell for faster/cheaper generations
- [ ] Add style presets users can select from
- [ ] Collect user favorite generations

### Long-term (Recommended)
- [ ] Train custom Trogdor LoRA ($10 one-time)
- [ ] Implement IP-Adapter for reference image
- [ ] Add image-to-image editing features

## Example Prompts That Work Well

✅ **Good prompts:**
- "burninating the New York Stock Exchange"
- "towering over Silicon Valley, breathing flames"
- "destroying a medieval castle with fire"
- "in the countryside setting peasants ablaze"

❌ **Prompts that might not work as well:**
- "trogdor" (too vague, but we handle this by always adding description)
- "standing still" (boring, Trogdor needs action!)
- "sleeping peacefully" (contradicts the character)

## Troubleshooting

### Issue: Trogdor doesn't appear consistently
**Solution**: Make character description more specific, increase its weight in prompt

### Issue: Too expensive
**Solution**: Switch to Flux Schnell or train a custom LoRA

### Issue: Generations too slow
**Solution**: Use Flux Schnell (3 seconds vs 15 seconds)

### Issue: Wrong art style
**Solution**: Adjust `STYLE_MODIFIERS` constant

### Issue: NSFW content blocked
**Solution**: Adjust `safety_tolerance` parameter (currently at 2, range 0-6)

## Resources

- [Replicate Flux Documentation](https://replicate.com/black-forest-labs/flux-1.1-pro)
- [LoRA Training Guide](https://replicate.com/docs/guides/train-a-model)
- [Prompt Engineering Best Practices](https://replicate.com/docs/guides/prompt-engineering)

