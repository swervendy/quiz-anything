# Quiz Anything API Documentation

## Overview

The Quiz Anything API provides endpoints for generating quizzes from various content sources, managing user sessions, and handling quiz interactions. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API uses session-based authentication with UUIDs. No API keys are required for public endpoints.

## Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Endpoints

### Session Management

#### Store UUID
Creates a new user session with a unique UUID.

```http
POST /api/storeUUID
```

**Response:**
```json
{
  "success": true,
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to store UUID in database"
}
```

### Question Generation

#### Generate Questions from Topic
Generates quiz questions from a given topic using OpenAI.

```http
POST /api/generateQuestions
Content-Type: application/json

{
  "topic": "JavaScript Fundamentals",
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "question": "What is the difference between let and var in JavaScript?",
      "options": [
        "let is block-scoped, var is function-scoped",
        "var is block-scoped, let is function-scoped",
        "There is no difference",
        "let is deprecated, var is modern"
      ],
      "correctAnswer": "let is block-scoped, var is function-scoped",
      "explanation": "let creates block-scoped variables while var creates function-scoped variables."
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to generate questions",
  "message": "OpenAI API rate limit exceeded"
}
```

#### Generate Questions from YouTube
Extracts transcript from YouTube video and generates questions.

```http
POST /api/getYoutubeTranscript
Content-Type: application/json

{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transcript extracted successfully"
}
```

Then generate questions:

```http
POST /api/generateYoutubeQuestions
Content-Type: application/json

{
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Generate Questions from URL
Scrapes content from a URL and generates questions.

```http
POST /api/generateUrlQuestions
Content-Type: application/json

{
  "url": "https://en.wikipedia.org/wiki/JavaScript",
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Quiz Management

#### Store User Answers
Saves user quiz answers and calculates scores.

```http
POST /api/storeUserAnswers
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000-1234567890",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "let is block-scoped, var is function-scoped",
      "isCorrect": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 1,
    "totalQuestions": 1,
    "percentage": 100
  }
}
```

#### Get User Answers
Retrieves stored answers for a session.

```http
GET /api/getUserAnswers?sessionId=550e8400-e29b-41d4-a716-446655440000-1234567890
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answers": [
      {
        "questionId": "q1",
        "selectedAnswer": "let is block-scoped, var is function-scoped",
        "isCorrect": true,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "score": 1,
    "totalQuestions": 1
  }
}
```

#### Get Questions
Retrieves questions for a session.

```http
GET /api/getQuestions?sessionId=550e8400-e29b-41d4-a716-446655440000-1234567890
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "question": "What is the difference between let and var in JavaScript?",
      "options": [
        "let is block-scoped, var is function-scoped",
        "var is block-scoped, let is function-scoped",
        "There is no difference",
        "let is deprecated, var is modern"
      ],
      "correctAnswer": "let is block-scoped, var is function-scoped",
      "explanation": "let creates block-scoped variables while var creates function-scoped variables."
    }
  ]
}
```

## Error Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid input parameters |
| 404 | Not Found | Resource not found |
| 429 | Rate Limited | Too many requests |
| 500 | Internal Server Error | Server error |

## Rate Limits

- **Question Generation**: 10 requests per minute per IP
- **YouTube Transcript**: 5 requests per minute per IP
- **URL Scraping**: 20 requests per minute per IP

## Usage Examples

### JavaScript/TypeScript

```javascript
// Generate questions from topic
const response = await fetch('/api/generateQuestions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'React Hooks',
    uuid: 'user-uuid-123'
  })
});

const data = await response.json();
console.log(data.questions);
```

### cURL

```bash
# Generate questions
curl -X POST http://localhost:3000/api/generateQuestions \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "uuid": "user-uuid-123"
  }'

# Get YouTube transcript
curl -X POST http://localhost:3000/api/getYoutubeTranscript \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrl": "https://www.youtube.com/watch?v=example",
    "uuid": "user-uuid-123"
  }'
```

### Python

```python
import requests

# Generate questions
response = requests.post('http://localhost:3000/api/generateQuestions', 
  json={
    'topic': 'Python Programming',
    'uuid': 'user-uuid-123'
  }
)

data = response.json()
print(data['questions'])
```

## Data Models

### Question
```typescript
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}
```

### User Answer
```typescript
interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}
```

### Quiz Session
```typescript
interface QuizSession {
  uuid: string;
  sessionId: string;
  topic?: string;
  youtubeUrl?: string;
  url?: string;
  questions: Question[];
  createdAt: Date;
}
```

## Best Practices

1. **Error Handling**: Always check the `success` field in responses
2. **Session Management**: Store and reuse UUIDs for consistent user experience
3. **Rate Limiting**: Implement exponential backoff for rate-limited requests
4. **Input Validation**: Validate URLs and topics before sending requests
5. **Caching**: Cache questions and answers when appropriate

## Support

For API support, please:
- Check the [GitHub Issues](https://github.com/yourusername/quiz-anything/issues)
- Review the [FAQ](https://github.com/yourusername/quiz-anything/wiki/FAQ)
- Contact: your-email@example.com 