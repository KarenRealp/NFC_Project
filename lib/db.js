import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || '';
const insforgeKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

export const db = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeKey
});

