const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.post('/recipes', async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt manquant' })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const text = data.choices && data.choices[0] ? data.choices[0].message.content : ''
    res.json({ content: [{ type: 'text', text: text }] })

  } catch (error) {
    console.error('Erreur:', error.message)
    res.status(500).json({ error: 'Erreur serveur: ' + error.message })
  }
})

app.get('/', function(req, res) {
  res.json({ status: 'FrigoMalyn serveur actif ✓' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', function() {
  console.log('Serveur FrigoMalyn démarré sur le port ' + PORT)
})
