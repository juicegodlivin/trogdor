'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MedievalIcon } from '@/components/ui/MedievalIcon';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function GeneratorPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill prompt from URL parameter (for reprompting)
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setPrompt(promptParam);
      // Show a toast to let user know they can edit
      toast('✏️ Editing previous prompt - make your changes and burninate!', {
        duration: 4000,
        icon: '🔥',
      });
    }
  }, [searchParams]);

  const generateMutation = trpc.generator.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedImage(data.imageUrl);
      setIsGenerating(false);
      setError(null);
      toast.dismiss('generating');
      toast.success('🔥 Trogdor has been summoned! Your masterpiece is ready!', {
        duration: 5000,
      });
    },
    onError: (error) => {
      setError(error.message);
      setIsGenerating(false);
      toast.dismiss('generating');
      toast.error(`Burnination failed: ${error.message}`, {
        duration: 6000,
      });
    },
  });

  const handleGenerate = () => {
    if (!session) {
      setError('Please connect your wallet to generate images');
      toast.error('Please connect your wallet first!');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      toast.error('Please enter a prompt to burninate!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    toast.loading('Summoning Trogdor from the digital realm...', {
      id: 'generating',
    });

    generateMutation.mutate({ prompt });
  };

  return (
    <div className="min-h-screen notebook-paper">
      <Header />
      <ComponentErrorBoundary componentName="Image Generator">
        <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <MedievalIcon name="torch" size={64} />
            <h1 className="font-hand text-6xl flame-text">
              Trogdor Art Generator
            </h1>
          </div>
          <p className="text-xl text-pencil max-w-2xl mx-auto">
            Invoke the ancient powers of AI to create your own Trogdor masterpiece.
            The more creative your prompt, the greater your offering to the cult.
          </p>
        </div>

        {/* Generator Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="border-sketch border-pencil p-8 notebook-paper mb-8">
            {/* Prompt Input */}
            <div className="mb-6">
              <label className="flex items-center gap-3 font-hand text-2xl mb-4">
                <MedievalIcon name="quill" size={32} />
                Describe Your Vision
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="burninating Wall Street... towering over the countryside... destroying a castle with flames..."
                className="w-full h-32 p-4 bg-white border-2 border-pencil rounded-none font-mono resize-none focus:outline-none focus:border-accent-red"
                disabled={isGenerating}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-pencil-light">
                  {prompt.length} / 500 characters
                </span>
                {!session && (
                  <span className="text-sm text-accent-red flex items-center gap-2">
                    <MedievalIcon name="flag" size={16} />
                    Connect wallet to generate
                  </span>
                )}
              </div>
            </div>

            {/* Enhancement Options */}
            <div className="mb-6 p-4 bg-sketch-light border-2 border-dashed border-pencil-light">
              <div className="flex items-center gap-3 mb-3">
                <MedievalIcon name="scroll" size={28} />
                <h3 className="font-hand text-xl">Style Enhancements</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'Hand-drawn',
                  'Epic flames',
                  'Medieval scene',
                  'Night time',
                  'Action pose',
                  'Majestic',
                  'Dramatic lighting',
                  'Ancient scroll',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setPrompt((p) => p + ' ' + tag)}
                    className="text-sm px-3 py-2 bg-white border border-pencil hover:bg-accent-yellow/30 transition-colors"
                    disabled={isGenerating}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !session || !prompt.trim()}
              className="w-full btn-sketch text-xl px-8 py-4 bg-accent-red text-white hover:bg-accent-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin">
                    <MedievalIcon name="torch" size={28} />
                  </span>
                  Summoning Trogdor...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <MedievalIcon name="torch" size={28} />
                  BURNINATE!
                </span>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 border-2 border-accent-red bg-red-50">
              <div className="flex items-start gap-3">
                <MedievalIcon name="flag" size={32} />
                <div>
                  <h3 className="font-hand text-xl text-accent-red mb-1">
                    Burnination Failed!
                  </h3>
                  <p className="text-pencil">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="border-sketch border-pencil p-6 notebook-paper">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MedievalIcon name="scroll" size={40} />
                <h2 className="font-hand text-3xl text-center">
                  Your Masterpiece
                </h2>
              </div>
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={generatedImage}
                  alt="Generated Trogdor art"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = 'trogdor-burnination.png';
                    link.click();
                  }}
                  className="flex-1 btn-sketch px-4 py-3 bg-accent-green text-white hover:bg-accent-green/90 flex items-center justify-center gap-2"
                >
                  <MedievalIcon name="chest" size={24} />
                  Download
                </button>
                <button
                  onClick={() => {
                    setGeneratedImage(null);
                    setPrompt('');
                  }}
                  className="flex-1 btn-sketch px-4 py-3 bg-white hover:bg-sketch-light flex items-center justify-center gap-2"
                >
                  <MedievalIcon name="target" size={24} />
                  Generate Another
                </button>
              </div>
            </div>
          )}

          {/* Example Prompts */}
          <div className="mt-12 p-6 bg-white border-2 border-pencil">
            <div className="flex items-center gap-3 mb-4">
              <MedievalIcon name="torch" size={32} />
              <h3 className="font-hand text-2xl">Prompt Ideas</h3>
            </div>
            <p className="text-pencil mb-4">
              Just describe what you want Trogdor to burninate! The AI automatically adds Trogdor&apos;s 
              character details and style. Focus on the <strong>scene and action</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'burninating the New York Stock Exchange',
                'towering over Wall Street with flames',
                'destroying a medieval castle',
                'setting fire to the countryside at sunset',
                'breathing flames onto Bitcoin logos',
                'burninating a pile of fiat currency',
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 border border-pencil-light hover:border-accent-red hover:bg-accent-yellow/10 transition-colors text-sm flex items-start gap-2"
                  disabled={isGenerating}
                >
                  <MedievalIcon name="spellbook" size={20} className="flex-shrink-0 mt-0.5" />
                  <span>{example}</span>
                </button>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-8 p-6 bg-sketch-light border-2 border-dashed border-pencil-light">
            <div className="flex items-center gap-3 mb-4">
              <MedievalIcon name="scroll" size={32} />
              <h3 className="font-hand text-2xl">How It Works</h3>
            </div>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="font-hand text-xl mr-3">1.</span>
                <span>
                  <strong>Connect your Solana wallet</strong> to prove you&apos;re a true cult member
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-hand text-xl mr-3">2.</span>
                <span>
                  <strong>Describe your vision</strong> of Trogdor burninating the countryside
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-hand text-xl mr-3">3.</span>
                <span>
                  <strong>Our AI overlords</strong> summon Trogdor from the digital realm
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-hand text-xl mr-3">4.</span>
                <span>
                  <strong>Tweet your creation</strong> with <code className="bg-yellow-50 px-2 py-1">@trogdorcult</code> to enter the leaderboard
                </span>
              </li>
            </ol>
          </div>
        </div>
      </main>
      </ComponentErrorBoundary>
      <Footer />
    </div>
  );
}

