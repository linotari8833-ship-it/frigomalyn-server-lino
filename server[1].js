const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.post('/recipes', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Prompt manquant' })

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    // Reformater pour que l'app comprenne la réponse
    const text = data.choices?.[0]?.message?.content || ''
    res.json({ content: [{ type: 'text', text }] })

  } catch (error) {
    console.error('Erreur API:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/', (req, res) => {
  res.json({ status: 'FrigoMalyn serveur actif ✓' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Serveur FrigoMalyn démarré sur le port ${PORT}`)
})
