# Deployment Guide

This guide covers deploying Quiz Anything to various platforms with production-ready configurations.

## Prerequisites

Before deploying, ensure you have:

- [ ] OpenAI API key
- [ ] MongoDB connection string
- [ ] Domain name (optional but recommended)
- [ ] Git repository set up

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_connection_string

# Optional
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_TELEMETRY_DISABLED=1
```

## Platform-Specific Deployment

### 1. Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments.

#### Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required environment variables

4. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

#### Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_TELEMETRY_DISABLED": "1"
  },
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. Netlify

Netlify is another excellent option for static and serverless deployments.

#### Setup

1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

4. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### 3. Docker Deployment

For containerized deployments on any platform.

#### Build Image
```bash
docker build -t quiz-anything .
```

#### Run Container
```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e MONGODB_URI=your_uri \
  -e NODE_ENV=production \
  quiz-anything
```

#### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MONGODB_URI=${MONGODB_URI}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 4. AWS Deployment

#### AWS Elastic Beanstalk

1. **Create Application**
   ```bash
   eb init quiz-anything --platform node.js
   ```

2. **Configure Environment**
   ```bash
   eb create production
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv OPENAI_API_KEY=your_key MONGODB_URI=your_uri
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### AWS ECS with Fargate

1. **Create Task Definition**
   ```json
   {
     "family": "quiz-anything",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "quiz-anything",
         "image": "your-registry/quiz-anything:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "OPENAI_API_KEY",
             "value": "your_key"
           },
           {
             "name": "MONGODB_URI",
             "value": "your_uri"
           }
         ]
       }
     ]
   }
   ```

### 5. Google Cloud Platform

#### Cloud Run

1. **Build and Push**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/quiz-anything
   ```

2. **Deploy**
   ```bash
   gcloud run deploy quiz-anything \
     --image gcr.io/PROJECT_ID/quiz-anything \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OPENAI_API_KEY=your_key,MONGODB_URI=your_uri
   ```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Choose your preferred cloud provider and region

2. **Configure Network Access**
   - Add your IP address or `0.0.0.0/0` for all IPs
   - Create database user with read/write permissions

3. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password

### Local MongoDB

For development or self-hosted deployments:

```bash
# Install MongoDB
brew install mongodb-community  # macOS
sudo apt-get install mongodb    # Ubuntu

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb          # Ubuntu
```

## SSL/HTTPS Configuration

### Vercel/Netlify
SSL certificates are automatically provisioned.

### Custom Domain with Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Monitoring and Logging

### Application Monitoring

1. **Add Health Check Endpoint**
   ```typescript
   // src/pages/api/health.ts
   export default function handler(req, res) {
     res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() })
   }
   ```

2. **Error Tracking**
   - [Sentry](https://sentry.io) for error monitoring
   - [LogRocket](https://logrocket.com) for session replay

3. **Performance Monitoring**
   - [Vercel Analytics](https://vercel.com/analytics)
   - [Google Analytics](https://analytics.google.com)

### Logging

Configure structured logging:

```typescript
// src/utils/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for development/production
   - Rotate keys regularly

2. **CORS Configuration**
   ```typescript
   // next.config.js
   async headers() {
     return [
       {
         source: '/api/(.*)',
         headers: [
           { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
           { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
         ]
       }
     ]
   }
   ```

3. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Use Redis or in-memory storage for rate limiting

4. **Input Validation**
   - Validate all user inputs
   - Sanitize URLs and topics
   - Implement proper error handling

## Performance Optimization

1. **Caching**
   - Cache API responses
   - Use Redis for session storage
   - Implement CDN for static assets

2. **Database Optimization**
   - Create indexes on frequently queried fields
   - Use connection pooling
   - Monitor query performance

3. **Bundle Optimization**
   - Enable tree shaking
   - Use dynamic imports for large components
   - Optimize images and assets

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Environment Variables Not Loading**
   - Ensure variables are set in deployment platform
   - Check variable names match exactly
   - Restart application after adding variables

3. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network access and firewall rules
   - Ensure database user has correct permissions

4. **API Rate Limiting**
   - Implement exponential backoff
   - Add retry logic for failed requests
   - Monitor API usage and limits

### Debug Commands

```bash
# Check application status
curl -f http://localhost:3000/api/health

# View logs
docker logs container-name
vercel logs
netlify logs

# Test database connection
node -e "require('./src/lib/db.js').connect()"
```

## Support

For deployment issues:
- Check platform-specific documentation
- Review [GitHub Issues](https://github.com/yourusername/quiz-anything/issues)
- Contact platform support teams 