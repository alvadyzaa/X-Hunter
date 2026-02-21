import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { analyzeRoute } from './routes/analyze'
import { generateRoutes } from './routes/generateRoutes'

const app = new Hono<{ Bindings: { GEMINI_API_KEY: string } }>()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Gemini-Key', 'X-Gemini-Model'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

app.get('/', (c) => c.text('Pre-Tweet API is running!'))

app.route('/api/analyze', analyzeRoute)
app.route('/api', generateRoutes)

export default app
