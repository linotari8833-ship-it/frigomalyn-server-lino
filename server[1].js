const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Route principale — génère les recettes
app.post('/recipes', async (req, res) => {
  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt manquant' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    res.json(data)

  } catch (error) {
    console.error('Erreur API:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Route de test — pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ status: 'FrigoMalyn serveur actif ✓' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Serveur FrigoMalyn démarré sur le port ${PORT}`)
})
