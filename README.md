# AI Phone Call Demo

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/bland-ai-voice-demo)

**Experience the future of automated phone conversations** with real-time AI-powered calling, live transcription, and intelligent analysis.

🔗 **[Try the Live Demo](https://bland-ai-voice-demo.vercel.app)** | 🚀 **[Deploy Your Own](#-deployment)**

## 🚀 Features

- **🤖 Real AI Phone Calls**: Make actual phone calls to real numbers with AI handling conversations
- **💬 Live Transcription**: Watch conversations unfold in real-time with speech-to-text
- **🧠 AI Analysis**: Intelligent post-call analysis extracts structured data and insights
- **🎯 Voice Selection**: Choose from 10 premium AI voices with ratings for different conversation styles
- **⚙️ Advanced Configuration**: Full control over call parameters and AI behavior
- **📱 Modern UI**: Clean, responsive interface built with [SvelteKit](https://kit.svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/)

## 🎯 Quick Start

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

3. **Start the development server**:
   ```bash
   bun run dev
   ```

4. **Open the demo**: Visit [http://localhost:3000/demo](http://localhost:3000/demo)

## 🔧 Technology Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/) with runes
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 with custom design system
- **AI Services**: [Bland AI](https://www.bland.ai/) (voice calls) + [OpenAI](https://openai.com/) (analysis)
- **Runtime**: Bun/Node.js
- **Deployment**: [Vercel](https://vercel.com/) adapter included

## 📖 How It Works

1. **Configure**: Enter a phone number and customize the AI's conversation task
2. **Call**: AI makes a real phone call using [Bland AI](https://www.bland.ai/)'s voice technology
3. **Watch**: Live transcript shows the conversation in real-time
4. **Analyze**: [OpenAI](https://openai.com/) processes the conversation to extract structured information

## 🎨 Demo Use Case

The included demo shows AI ordering pizza from restaurants, demonstrating:
- Natural conversation flow with human-like responses
- Specific order placement (5 pizzas for 12 people)
- Information collection (prices, pickup times, addresses)
- Structured data extraction from voice conversations

## 🔑 Environment Variables

```bash
# Required API Keys
BLAND_AI_API_KEY=your_bland_ai_key_here
OPENAI_API_KEY=your_openai_key_here
```

## 📚 API Endpoints

- `GET /api/bland/calls` - List all calls
- `POST /api/bland/calls` - Create new call
- `GET /api/bland/calls/[id]` - Get call details
- `POST /api/bland/calls/[id]?action=stop` - Stop active call
- `POST /api/bland/calls/[id]/analyze` - Analyze completed call
- `GET /api/bland/calls/[id]/transcript` - Get call transcript

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStellar-Technology-Services%2Fbland-ai-voice-demo&env=BLAND_AI_API_KEY,OPENAI_API_KEY&envDescription=Required%20API%20keys%20for%20AI%20voice%20calling%20and%20conversation%20analysis.%20Get%20your%20Bland%20AI%20key%20from%20bland.ai%20and%20OpenAI%20key%20from%20platform.openai.com&envLink=https%3A%2F%2Fgithub.com%2FStellar-Technology-Services%2Fbland-ai-voice-demo%23-environment-variables&project-name=ai-phone-call-demo&repository-name=ai-phone-call-demo)

### Manual Deployment

The project includes [Vercel](https://vercel.com/) adapter configuration:

```bash
bun run build
# Deploy to Vercel or your preferred platform
```

**⚠️ Required Environment Variables:**

The deployment will automatically prompt you to enter these required API keys:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `BLAND_AI_API_KEY` | API key for AI voice calling service | [Get from Bland AI Dashboard](https://www.bland.ai/) |
| `OPENAI_API_KEY` | API key for conversation analysis | [Get from OpenAI Platform](https://platform.openai.com/api-keys) |

> 💡 **Tip**: Both API keys are **required** for the app to function. The deployment will fail without them.

## 🤝 Contributing

This is a demonstration project showcasing AI phone calling capabilities. Feel free to:
- Fork and customize for your use cases
- Report issues or suggest improvements
- Contribute enhancements via pull requests

## 📄 License

MIT License - feel free to use this code for your projects.
