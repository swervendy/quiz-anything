import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDB } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check database connection
    const db = await connectToDB()
    await db.admin().ping()

    // Check environment variables
    const requiredEnvVars = ['OPENAI_API_KEY', 'MONGODB_URI']
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingEnvVars.length > 0) {
      return res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        checks: {
          database: 'connected',
          environment: 'incomplete'
        }
      })
    }

    // All checks passed
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'connected',
        environment: 'complete',
        api: 'operational'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: 'disconnected',
        environment: 'unknown',
        api: 'error'
      }
    })
  }
} 