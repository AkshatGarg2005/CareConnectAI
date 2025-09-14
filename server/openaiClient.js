import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.trim()) {
  console.error('Missing OPENAI_API_KEY in .env');
  process.exit(1);
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});