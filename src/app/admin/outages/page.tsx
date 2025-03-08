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
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Outage["status"]>("investigating")
  const [components, setComponents] = useState("")
  const [editingOutageId, setEditingOutageId] = useState<string | null>(null)
  
  useEffect(() => {
    // Check if user is authenticated
    const storedApiKey = localStorage.getItem("admin_api_key")
    if (storedApiKey) {
      setApiKey(storedApiKey)
      setIsAuthenticated(true)
    }
    
    // Load outages
    const loadOutages = async () => {
      try {
        const data = await getOutages()
        setOutages(data)
      } catch (error) {
        console.error("Failed to load outages:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadOutages()
  }, [])
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      localStorage.setItem("admin_api_key", apiKey)
      setIsAuthenticated(true)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    
    try {
      if (!title || !description) {
        throw new Error("Title and description are required")
      }
      
      const outageData = {
        title,
        description,
        status,
        affectedComponents: components.split(",").map(c => c.trim()).filter(c => c)
      }
      
      if (editingOutageId) {
        // Update existing outage
        await updateOutage(editingOutageId, outageData, apiKey)
        setSuccess("Outage updated successfully")
      } else {
        // Create new outage
        await postOutage(outageData, apiKey)
        setSuccess("Outage posted successfully")
      }
      
      // Reset form
      resetForm()
      
      // Refresh outages list
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
    
    // Scroll to form
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
    return new Date(dateString).toLocaleString()
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
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors"
            >
              Login
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