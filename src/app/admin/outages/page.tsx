"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getOutages, postOutage, updateOutage, type Outage } from "@/lib/api/shards"
import { AlertTriangle, CheckCircle, Info, Loader2, Edit, X } from "lucide-react"

export default function OutagesAdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [outages, setOutages] = useState<Outage[]>([])
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingKey, setIsValidatingKey] = useState(false)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Outage["status"]>("investigating")
  const [components, setComponents] = useState("")
  const [editingOutageId, setEditingOutageId] = useState<string | null>(null)
  
  // Check for inactivity and log out
  useEffect(() => {
    const checkActivity = () => {
      if (isAuthenticated && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        handleLogout()
      }
    }

    const interval = setInterval(checkActivity, 60000) // Check every minute
    const updateActivity = () => setLastActivity(Date.now())

    // Update last activity on user interactions
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('click', updateActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('click', updateActivity)
    }
  }, [isAuthenticated, lastActivity])

  // Sanitize input
  const sanitizeInput = (input: string): string => {
    return input.replace(/<[^>]*>/g, '') // Remove HTML tags
  }
  
  useEffect(() => {
    const validateAndLoad = async () => {
      const storedApiKey = localStorage.getItem("admin_api_key")
      if (storedApiKey) {
        setApiKey(storedApiKey)
        try {
          const response = await fetch("https://api.greed.rocks/validate-key", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ api_key: storedApiKey }),
          })
          
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          
          const data = await response.json()
          
          if (data.valid) {
            setIsAuthenticated(true)
            try {
              const outagesData = await getOutages()
              setOutages(outagesData)
            } catch (error) {
              console.error("Failed to load outages:", error)
              setError("Failed to load outages. Please try again.")
            }
          } else {
            handleLogout()
          }
        } catch (error) {
          console.error("Failed to validate API key:", error)
          handleLogout()
        }
      }
      setIsLoading(false)
    }
    
    validateAndLoad()
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("admin_api_key")
    setApiKey("")
    setIsAuthenticated(false)
    setOutages([])
    router.push("/admin")
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsValidatingKey(true)
    
    const sanitizedApiKey = sanitizeInput(apiKey.trim())
    if (!sanitizedApiKey) {
      setError("API key is required")
      setIsValidatingKey(false)
      return
    }
    
    try {
      const response = await fetch("https://api.greed.rocks/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api_key: sanitizedApiKey }),
      })
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      const data = await response.json()
      
      if (data.valid) {
        localStorage.setItem("admin_api_key", sanitizedApiKey)
        setIsAuthenticated(true)
        try {
          const outagesData = await getOutages()
          setOutages(outagesData)
        } catch (error) {
          console.error("Failed to load outages:", error)
          setError("Failed to load outages. Please try again.")
        }
      } else {
        setError("Invalid API key")
        setApiKey("")
      }
    } catch (error) {
      setError("Failed to validate API key. Please try again.")
      console.error("Failed to validate API key:", error)
    } finally {
      setIsValidatingKey(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    
    try {
      const sanitizedTitle = sanitizeInput(title.trim())
      const sanitizedDescription = sanitizeInput(description.trim())
      const sanitizedComponents = components
        .split(",")
        .map(c => sanitizeInput(c.trim()))
        .filter(c => c)
      
      if (!sanitizedTitle || !sanitizedDescription) {
        throw new Error("Title and description are required")
      }
      
      if (sanitizedTitle.length > 200) {
        throw new Error("Title is too long (maximum 200 characters)")
      }
      
      if (sanitizedDescription.length > 5000) {
        throw new Error("Description is too long (maximum 5000 characters)")
      }
      
      if (sanitizedComponents.length > 20) {
        throw new Error("Too many components (maximum 20)")
      }
      
      const outageData = {
        title: sanitizedTitle,
        description: sanitizedDescription,
        status,
        affectedComponents: sanitizedComponents
      }
      
      if (editingOutageId) {
        await updateOutage(editingOutageId, outageData, apiKey)
        setSuccess("Outage updated successfully")
      } else {
        await postOutage(outageData, apiKey)
        setSuccess("Outage posted successfully")
      }
      
      resetForm()
      
      const updatedOutages = await getOutages(true)
      setOutages(updatedOutages)
    } catch (error) {
      console.error("Failed to save outage:", error)
      setError(error instanceof Error ? error.message : "Failed to save outage")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleEdit = (outage: Outage) => {
    setTitle(outage.title)
    setDescription(outage.description)
    setStatus(outage.status)
    setComponents(outage.affectedComponents.join(", "))
    setEditingOutageId(outage.id)
    
    document.getElementById("outage-form")?.scrollIntoView({ behavior: "smooth" })
  }
  
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus("investigating")
    setComponents("")
    setEditingOutageId(null)
  }
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch (error) {
      console.error("Invalid date:", error)
      return "Invalid date"
    }
  }
  
  const getStatusBadgeClass = (status: Outage["status"]) => {
    switch (status) {
      case "investigating":
        return "bg-yellow-500/20 text-yellow-500";
      case "identified":
        return "bg-orange-500/20 text-orange-500";
      case "monitoring":
        return "bg-blue-500/20 text-blue-500";
      case "resolved":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-white/20 text-white";
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-md mx-auto bg-secondary/10 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Authentication</h1>
          
          {error && (
            <div className="bg-red-500/20 rounded-lg p-3 mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your API key"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isValidatingKey}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isValidatingKey ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Outages Management</h1>
          <button
            onClick={() => router.push("/status")}
            className="text-sm bg-secondary/20 hover:bg-secondary/30 px-3 py-1 rounded-md transition-colors"
          >
            View Status Page
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 rounded-lg p-3 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/20 rounded-lg p-3 mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}
        
        <div id="outage-form" className="bg-secondary/10 rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingOutageId ? "Edit Outage" : "Post New Outage"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., API Latency Issues"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                placeholder="Describe the outage in detail..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Outage["status"])}
                className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="investigating">Investigating</option>
                <option value="identified">Identified</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="components" className="block text-sm font-medium mb-1">
                Affected Components
              </label>
              <input
                type="text"
                id="components"
                value={components}
                onChange={(e) => setComponents(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="API, Bot, Database (comma separated)"
              />
              <p className="text-xs text-white/60 mt-1">
                Comma-separated list of affected components
              </p>
            </div>
            
            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingOutageId ? "Updating..." : "Posting..."}
                  </>
                ) : (
                  editingOutageId ? "Update Outage" : "Post Outage"
                )}
              </button>
              
              {editingOutageId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-secondary/20 text-white py-2 px-4 rounded-md hover:bg-secondary/30 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="bg-secondary/10 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Current Outages</h2>
          
          {outages.length === 0 ? (
            <p className="text-white/70">No outages reported.</p>
          ) : (
            <div className="space-y-4">
              {outages.map((outage) => (
                <div key={outage.id} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{outage.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(outage.status)}`}>
                          {outage.status.charAt(0).toUpperCase() + outage.status.slice(1)}
                        </span>
                        <span className="text-xs text-white/60">
                          Updated: {formatDate(outage.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(outage)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      title="Edit outage"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-white/80 text-sm whitespace-pre-line">{outage.description}</p>
                  
                  {outage.affectedComponents.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-white/60 mb-1">Affected Components:</p>
                      <div className="flex flex-wrap gap-1">
                        {outage.affectedComponents.map((component, i) => (
                          <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 