import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = ''

function App() {
  const [formData, setFormData] = useState({
    service_name: '',
    environment: 'development',
    instance_type: 't3.medium',
    replicas: 2,
    cpu_limit: '500m',
    memory_limit: '512Mi'
  })

  const [validationResult, setValidationResult] = useState(null)
  const [generatedYaml, setGeneratedYaml] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'replicas' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationResult(null)
    setGeneratedYaml(null)

    try {
      const response = await axios.post(`${API_URL}/api/validate`, formData)
      
      let validationText = response.data.validation
      validationText = validationText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      
      const validationData = JSON.parse(validationText)
      setValidationResult(validationData)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to validate request')
      console.error('Validation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateConfig = async () => {
    setGenerating(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/api/generate-config`, formData)
      setGeneratedYaml(response.data.yaml)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate configuration')
      console.error('Generation error:', err)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.service_name}-${formData.environment}.yaml`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setFormData({
      service_name: '',
      environment: 'development',
      instance_type: 't3.medium',
      replicas: 2,
      cpu_limit: '500m',
      memory_limit: '512Mi'
    })
    setValidationResult(null)
    setGeneratedYaml(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            AI Infrastructure Portal
          </h1>
          <p className="text-slate-300 text-lg">
            Kubernetes Self-Service with AI-Powered Validation
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Form */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Request Infrastructure
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  required
                  placeholder="my-api-service"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Environment */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Environment
                </label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>

              {/* Instance Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Instance Type
                </label>
                <select
                  name="instance_type"
                  value={formData.instance_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="t3.micro">t3.micro</option>
                  <option value="t3.small">t3.small</option>
                  <option value="t3.medium">t3.medium</option>
                  <option value="t3.large">t3.large</option>
                </select>
              </div>

              {/* Replicas */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Replicas
                </label>
                <input
                  type="number"
                  name="replicas"
                  value={formData.replicas}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CPU Limit */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CPU Limit
                </label>
                <input
                  type="text"
                  name="cpu_limit"
                  value={formData.cpu_limit}
                  onChange={handleInputChange}
                  placeholder="500m"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Memory Limit */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Memory Limit
                </label>
                <input
                  type="text"
                  name="memory_limit"
                  value={formData.memory_limit}
                  onChange={handleInputChange}
                  placeholder="512Mi"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  {loading ? 'Validating...' : 'Validate Request'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-md transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Generate Config Button - Shows after successful validation */}
              {validationResult && validationResult.valid && (
                <button
                  type="button"
                  onClick={handleGenerateConfig}
                  disabled={generating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-semibold py-3 px-4 rounded-md transition-colors"
                >
                  {generating ? 'Generating YAML...' : '🚀 Generate Kubernetes Config'}
                </button>
              )}
            </form>
          </div>

          {/* Right Panel - Validation Results or Generated YAML */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
            {!generatedYaml ? (
              <>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  AI Validation Results
                </h2>

                {!validationResult && !error && !loading && (
                  <div className="text-center py-12 text-slate-400">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Submit a request to see validation results</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-slate-300 mt-4">Analyzing your request...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-700 rounded-md p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-300 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {validationResult && (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      validationResult.valid 
                        ? 'bg-green-900/30 text-green-300 border border-green-700' 
                        : 'bg-red-900/30 text-red-300 border border-red-700'
                    }`}>
                      {validationResult.valid ? '✓ Valid Configuration' : '✗ Issues Found'}
                    </div>

                    {/* Issues */}
                    {validationResult.issues && validationResult.issues.length > 0 && (
                      <div className="bg-red-900/20 border border-red-700 rounded-md p-4">
                        <h3 className="text-red-300 font-semibold mb-2 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Critical Issues
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {validationResult.issues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {validationResult.warnings && validationResult.warnings.length > 0 && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded-md p-4">
                        <h3 className="text-yellow-300 font-semibold mb-2 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Warnings
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {validationResult.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {validationResult.suggestions && validationResult.suggestions.length > 0 && (
                      <div className="bg-blue-900/20 border border-blue-700 rounded-md p-4">
                        <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Suggestions
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {validationResult.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Generated Configuration
                  </h2>
                  <button
                    onClick={() => setGeneratedYaml(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ← Back to Validation
                  </button>
                </div>

                <div className="space-y-4">
                  {/* YAML Preview */}
                  <div className="bg-slate-900 rounded-md p-4 border border-slate-700 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">
                      {generatedYaml}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download YAML
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedYaml)
                        alert('Copied to clipboard!')
                      }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App