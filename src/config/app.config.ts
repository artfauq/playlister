export const config = {
  appName: 'Playlister',
  appUrl: process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000',
  env: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
};
