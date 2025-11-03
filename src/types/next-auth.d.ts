import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      walletAddress?: string;
      twitterId?: string;
      twitterUsername?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    walletAddress?: string;
    twitterId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    walletAddress?: string;
    twitterId?: string;
    twitterAccessToken?: string;
  }
}

