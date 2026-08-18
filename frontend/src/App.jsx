import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendData, setBackendData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => {
        setBackendData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error connecting to backend:", err)
        setLoading(false)
      })
  }, [])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setAiLoading(true)
    setAiResponse('')

    try {
      const res = await fetch('/api/generate',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (res.ok) {
        setAiResponse(data.response)
      } else {
        setAiResponse(`Error: ${data.detail || 'Failed to generate'}`)
      }
    } catch (err) {
      setAiResponse('Error connecting to backend server.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Offline Buildathon Session</h1>
      
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Backend Status:</h3>
        {loading ? (
          <p>Connecting to FastAPI backend...</p>
        ) : backendData ? (
          <div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{backendData.message}</p>
            <p><strong>OpenAI Key Loaded:</strong> {backendData.openai_key_detected ? "Yes ✅" : "No ❌"}</p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>Failed to connect to backend.</p>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Test AI Agent:</h3>
        <form onSubmit={handleGenerate}>
          <textarea
            rows="3"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          <button type="submit" disabled={aiLoading} style={{ padding: '8px 16px' }}>
            {aiLoading ? 'Generating...' : 'Ask AI'}
          </button>
        </form>

        {aiResponse && (
          <div style={{ marginTop: '1rem', padding: '10px', background: '#f4f4f4', borderRadius: '4px' }}>
            <strong>Response:</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App