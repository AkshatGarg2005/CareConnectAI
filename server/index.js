import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { openai } from './openaiClient.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'careconnectai', model: 'gpt-5-nano' });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { message } = req.body;
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Invalid "message" payload' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: 'You are CareConnectAI, an advanced healthcare intelligence system designed to support community health initiatives. You provide guidance across four core areas:\n\n1. **Smart Health Assistant**\n- AI-powered clinical decision support for community health workers\n- Real-time symptom analysis and health assessments\n- Multi-language, culturally sensitive patient care guidance\n- Automated medication management and follow-up recommendations\n\n2. **Mental Health Guardian**\n- 24/7 crisis detection and intervention system\n- Automated connection to mental health professionals\n- Community support network activation\n- Preventive mental health education\n\n3. **Disaster Response Network**\n- Multi-hazard early warning with AI analysis\n- Inclusive alerts for people with disabilities\n- Real-time resource coordination\n- Multi-channel communication (SMS, voice, social media)\n\n4. **Community Intelligence Hub**\n- Population health analytics and trend prediction\n- Resource optimization recommendations\n- Performance dashboards for health systems\n- Evidence-based policy insights\n\nProvide comprehensive guidance, recommendations, and support while maintaining professional healthcare standards. Always emphasize the importance of professional medical consultation for serious health concerns.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    });

    const text = response.choices[0]?.message?.content ?? '';
    res.json({ reply: text || 'Sorry, I could not generate a response.' });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Server error while generating response.' });
  }
});

app.listen(PORT, () => {
  console.log(`CareConnectAI server running on http://localhost:${PORT}`);
});