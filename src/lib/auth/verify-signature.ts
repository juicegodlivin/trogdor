import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Verifies a Solana wallet signature
 * @param publicKey - The wallet's public key as a string
 * @param signature - The signature in base58 format
 * @param message - The original message that was signed
 * @returns true if signature is valid, false otherwise
 */
export async function verifyWalletSignature(
  publicKey: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    // Decode the signature from base58
    const signatureUint8 = bs58.decode(signature);
    
    // Convert message to Uint8Array
    const messageUint8 = new TextEncoder().encode(message);
    
    // Get public key bytes
    const publicKeyObj = new PublicKey(publicKey);
    const publicKeyBytes = publicKeyObj.toBytes();
    
    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKeyBytes
    );
    
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Generates a random nonce for authentication
 * @returns A random nonce string
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

