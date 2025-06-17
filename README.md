# Quiz Anything

A modern, full-stack quiz application that generates interactive quizzes from any topic, YouTube video, or URL using AI.

**Note:** This project was originally built in 2023 and uses older technologies like GPT-3.5-turbo. It has since been refactored to showcase senior-level development practices, including full TypeScript conversion, comprehensive testing, and modern deployment configurations.

## 🚀 Features

- **AI-Powered Quiz Generation**: Generate quizzes from any topic using OpenAI's GPT-3.5-turbo
- **YouTube Integration**: Extract transcripts and create quizzes from YouTube videos
- **Web Scraping**: Generate quizzes from any URL content
- **Interactive Tutoring**: Get explanations and tutoring based on your answers
- **Session Management**: Persistent user sessions with UUID tracking
- **Responsive Design**: Mobile-first design with dark mode support
- **Real-time Feedback**: Immediate scoring and detailed explanations

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI**: OpenAI GPT-3.5-turbo
- **External APIs**: YouTube Transcript API, Web Scraping
- **State Management**: React Hooks + Custom Hooks
- **Error Handling**: Custom API error classes

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TabSelector.tsx  # Tab navigation component
│   ├── LoadingSpinner.tsx # Loading states
│   └── ...
├── hooks/              # Custom React hooks
│   └── useSession.ts   # Session management
├── pages/              # Next.js pages and API routes
│   ├── api/            # Backend API endpoints
│   ├── index.tsx       # Home page
│   ├── quiz.tsx        # Quiz interface
│   └── ...
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── utils/              # Utility functions
│   ├── api.ts          # API client with error handling
│   └── ...
└── lib/                # Database and core utilities
    ├── db.js           # MongoDB connection
    └── util.js         # Helper functions
```

### Data Flow

1. **User Input** → Home page accepts topic, YouTube URL, or website URL
2. **Session Creation** → Unique UUID generated and stored in MongoDB
3. **Content Processing**:
   - Topic: Direct AI generation
   - YouTube: Transcript extraction → AI processing
   - URL: Web scraping → AI processing
4. **Quiz Generation** → OpenAI API generates questions and answers
5. **User Interaction** → Quiz taking with real-time feedback
6. **Results & Tutoring** → Score calculation and AI-powered explanations

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quiz-anything.git
   cd quiz-anything
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. **Database Setup**
   Ensure your MongoDB instance is running and accessible. The app will automatically create necessary collections.

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Core Endpoints

#### Generate Questions
```http
POST /api/generateQuestions
Content-Type: application/json

{
  "topic": "string",
  "uuid": "string"
}
```

#### YouTube Transcript
```http
POST /api/getYoutubeTranscript
Content-Type: application/json

{
  "youtubeUrl": "string",
  "uuid": "string"
}
```

#### Store User Answers
```http
POST /api/storeUserAnswers
Content-Type: application/json

{
  "sessionId": "string",
  "answers": [
    {
      "questionId": "string",
      "selectedAnswer": "string",
      "isCorrect": "boolean"
    }
  ]
}
```

### Error Handling

All API endpoints return consistent error responses:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### API Testing
```bash
# Test question generation
curl -X POST http://localhost:3000/api/generateQuestions \
  -H "Content-Type: application/json" \
  -d '{"topic": "JavaScript", "uuid": "test-uuid"}'
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**
   - Add `OPENAI_API_KEY` and `MONGODB_URI` in Vercel dashboard

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t quiz-anything .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e OPENAI_API_KEY=your_key \
     -e MONGODB_URI=your_uri \
     quiz-anything
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for question generation | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `NEXT_PUBLIC_API_URL` | Custom API base URL | No |

## 🔧 Development

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Adding New Features

1. **Create Types** - Add interfaces in `src/types/`
2. **API Endpoint** - Create route in `src/pages/api/`
3. **Frontend Component** - Add UI in `src/components/`
4. **Tests** - Write tests for new functionality

### Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js
- **Caching**: API responses cached appropriately
- **Bundle Analysis**: `npm run analyze`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow existing code style
- Add proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-3.5-turbo API
- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database solution

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/quiz-anything/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/quiz-anything/discussions)
- **Email**: your-email@example.com

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI**
