# Quick Start: Train Your Trogdor LoRA (15 minutes)

## TL;DR - Fastest Path to Perfect Trogdor

**Goal**: Train an AI model that knows exactly what Trogdor looks like

**Time**: 15 min setup + 15 min training (automatic)

**Cost**: $5-10 one-time

**Result**: Perfect Trogdor in every generation forever

---

## Option 1: Super Quick (Use Web Interface)

### Step 1: Prepare Images (5 minutes)

The easiest approach: **Use your current generator to create training data!**

1. Generate 15-20 images with your current system
2. Pick the **10 best** that look most like Trogdor
3. Download them all
4. Put them in a folder called `trogdor-training`
5. Zip the folder

### Step 2: Train (2 minutes + 15 min wait)

1. Go to: **https://replicate.com/ostris/flux-dev-lora-trainer**
2. Click the **"Train"** button (top right)
3. Fill in:
   - **Input images**: Upload your zip file
   - **Trigger word**: `TRGDR`
   - **Steps**: `1000`
   - **Learning rate**: `0.0004`
   - **Autocaption**: Check ✅
   - **Autocaption prefix**: `TRGDR, `
4. Click **"Start Training"**
5. Wait 15-20 minutes ☕

### Step 3: Use Your Model (1 minute)

Once training finishes, update your code:

```typescript
// In src/server/routers/generator.ts (line 26):
const GENERATION_MODEL = 'your-username/trogdor-lora';

// In the same file (line 58):
const enhancedPrompt = `TRGDR ${input.prompt}. ${STYLE_MODIFIERS}`;
```

**Done!** Now every generation will have perfect Trogdor consistency.

---

## Option 2: Better Quality (Use Real Trogdor Image)

If you want even better results using your actual reference image:

### Step 1: Prepare Better Training Data

1. Start with your reference: `public/images/trogdor/Trogdor the Burninator.png`

2. Create variations (if you can edit images):
   - Crop to different sizes
   - Mirror/flip the image
   - Different backgrounds
   - Slight rotations

3. Find more official Trogdor images:
   - Homestar Runner screenshots
   - Official merch images
   - HD versions

4. Aim for **15-20 total images**

5. Put all in a folder and zip it

### Step 2 & 3: Same as Option 1

Train on Replicate and update your code!

---

## What Each Approach Gives You

### Current System (Text Description Only)
```
Prompt: "burninating Wall Street"
→ "Trogdor the Burninator, a green S-shaped dragon with muscular arm..."
```
- ❌ Inconsistent appearance
- ❌ Sometimes wrong details
- ❌ Long prompts needed

### After LoRA Training
```
Prompt: "burninating Wall Street"  
→ "TRGDR burninating Wall Street"
```
- ✅ Perfect Trogdor every time
- ✅ Shorter, simpler prompts
- ✅ Matches your exact design

---

## FAQ

**Q: Can I use AI-generated images to train the LoRA?**  
A: Yes! Generate 20 images, pick the 10 best, train on those. This creates a "refinement loop."

**Q: Do I need to be a Replicate expert?**  
A: No! The web interface is point-and-click easy.

**Q: What if I don't like the results?**  
A: Just retrain! Try different training images or adjust settings.

**Q: Can I update it later?**  
A: Yes, retrain anytime with new/better images.

**Q: What about using the actual cartoon image I have?**  
A: Perfect! That should be image #1 in your training set.

---

## Recommended First Steps

### Best Approach for You:

1. **Today**: Generate 15-20 images with current system
2. **Today**: Pick best 10, zip them, train the LoRA ($5-10)
3. **Wait 15 min**: Let it train
4. **Test it**: Generate 5-10 test images
5. **If needed**: Retrain with your actual reference image + the best AI generations

This gives you:
- ✅ Quick results (under 30 minutes total)
- ✅ Learn the process
- ✅ Can refine later with better training data

---

## After Training Checklist

Once your model is ready:

- [ ] Update `GENERATION_MODEL` in `generator.ts`
- [ ] Update prompt to use `TRGDR` trigger word
- [ ] Test 5 different prompts
- [ ] Verify Trogdor looks consistent
- [ ] Share results with team
- [ ] Document your trigger word for users

---

## Need Help?

1. **Full Guide**: See `TRAIN_TROGDOR_LORA.md` for detailed instructions
2. **Technical Details**: See `AI_IMAGE_GENERATION_GUIDE.md`
3. **Replicate Docs**: https://replicate.com/docs/guides/fine-tune-an-image-model

---

## Ready to Start?

**Option 1 (Fastest):**
```bash
# 1. Generate & download 15 images from your generator
# 2. Go to https://replicate.com/ostris/flux-dev-lora-trainer
# 3. Click "Train" and upload
# 4. Wait 15 minutes
# 5. Update code
```

**Option 2 (Using Your Reference Image):**
```bash
# 1. Collect your best Trogdor images (including the reference)
# 2. Zip them
# 3. Follow same steps as Option 1
```

Let's burninate with perfect consistency! 🔥🐉

