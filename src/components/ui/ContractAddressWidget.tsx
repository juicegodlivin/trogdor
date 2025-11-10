'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface ContractAddressWidgetProps {
  className?: string;
  variant?: 'header' | 'hero';
}

export function ContractAddressWidget({ className = '', variant = 'header' }: ContractAddressWidgetProps) {
  const [copied, setCopied] = useState(false);
  const contractAddress = 'Soon...'; // Replace with actual CA when launching

  const handleCopy = async () => {
    // Only copy if it's an actual address, not the placeholder
    if (contractAddress !== 'Soon...') {
      try {
        await navigator.clipboard.writeText(contractAddress);
        setCopied(true);
        toast.success('Contract address copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy address');
      }
    } else {
      toast('Coming soon!', {
        icon: '🔥',
      });
    }
  };

  const baseClasses = "flex items-center gap-2 px-3 py-2 border-2 border-pencil rounded-sketch bg-white hover:bg-sketch transition-all duration-150 hover:shadow-sketch-lg active:translate-y-0.5 group";
  
  // Hero variant is centered and slightly larger
  const variantClasses = variant === 'hero' 
    ? 'justify-center text-base' 
    : '';

  return (
    <button
      onClick={handleCopy}
      className={`${baseClasses} ${variantClasses} ${className}`}
      title={contractAddress === 'Soon...' ? 'Coming soon!' : 'Click to copy contract address'}
    >
      <span className="font-mono text-sm font-semibold text-pencil">
        CA: {contractAddress}
      </span>
      
      {/* Copy Icon */}
      <svg 
        className={`w-4 h-4 transition-all duration-200 ${copied ? 'text-green-600 scale-110' : 'text-pencil group-hover:scale-110'}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {copied ? (
          <path d="M5 13l4 4L19 7" />
        ) : (
          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        )}
      </svg>
    </button>
  );
}

