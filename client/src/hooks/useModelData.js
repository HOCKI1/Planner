import { useState, useEffect } from 'react'
import modelsData from '../assets/models/data.json'

export function useModelData(modelPath) {
  const [modelConfig, setModelConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const config = modelsData.models.find(m => m.path === modelPath)
      if (config) {
        setModelConfig(config)
      } else {
        setError(new Error(`Model configuration not found for path: ${modelPath}`))
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [modelPath])

  return { modelConfig, loading, error }
}