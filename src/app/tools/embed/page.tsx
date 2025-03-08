"use client"

import type React from "react"

import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { RotatingMoonLogo } from "@/components/rotating-moon-logo"
import { MobileMenu } from "@/components/mobile-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Minus, Copy, Clock, Trash, AlertCircle, Check, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

// Types and Interfaces
interface EmbedField {
  name: string
  value: string
  inline: boolean
}

interface EmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
}

interface EmbedFooter {
  text?: string
  icon_url?: string
}

interface EmbedImage {
  url?: string
}

interface EmbedButton {
  label: string
  url: string
}

interface EmbedData {
  title?: string
  description?: string
  url?: string
  color?: string
  timestamp?: string
  footer?: EmbedFooter
  thumbnail?: EmbedImage
  image?: EmbedImage
  author?: EmbedAuthor
  fields: EmbedField[]
  buttons: EmbedButton[]
}

// Add new interface for the full message data
interface MessageData {
  content?: string
  embed: EmbedData
}

interface Variable {
  name: string
  description: string
  category: 'user' | 'lastfm'
}

// Custom Hooks
const useEmbedBuilder = (initialColor: string = "#1e3f58") => {
  const [messageData, setMessageData] = useState<MessageData>({
    embed: {
      color: initialColor,
      fields: [],
      buttons: [],
    }
  })

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageData((prev) => ({
      ...prev,
      content: e.target.value
    }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    field?: string,
  ) => {
    const { name, value } = e.target

    if (section && field) {
      setMessageData((prev) => {
        const sectionKey = section as keyof EmbedData
        const sectionData = prev.embed[sectionKey]
        
        if (sectionData && typeof sectionData === 'object') {
          return {
            ...prev,
            embed: {
              ...prev.embed,
              [section]: {
                ...sectionData,
                [field]: value,
              },
            }
          }
        }
        
        return {
          ...prev,
          embed: {
            ...prev.embed,
            [section]: { [field]: value },
          }
        }
      })
    } else {
      setMessageData((prev) => ({
        ...prev,
        embed: {
          ...prev.embed,
          [name]: value,
        }
      }))
    }
  }

  const handleFieldChange = (index: number, key: keyof EmbedField, value: string | boolean) => {
    setMessageData((prev) => {
      const newFields = [...prev.embed.fields]
      newFields[index] = {
        ...newFields[index],
        [key]: value,
      }
      return {
        ...prev,
        embed: {
          ...prev.embed,
          fields: newFields,
        }
      }
    })
  }

  const handleButtonChange = (index: number, field: keyof EmbedButton, value: string) => {
    setMessageData((prev) => {
      const newButtons = [...prev.embed.buttons]
      newButtons[index] = {
        ...newButtons[index],
        [field]: value,
      }
      return {
        ...prev,
        embed: {
          ...prev.embed,
          buttons: newButtons,
        }
      }
    })
  }

  const addField = () => {
    setMessageData((prev) => ({
      ...prev,
      embed: {
        ...prev.embed,
        fields: [...prev.embed.fields, { name: "", value: "", inline: false }],
      }
    }))
  }

  const removeField = (index: number) => {
    setMessageData((prev) => {
      const newFields = [...prev.embed.fields]
      newFields.splice(index, 1)
      return {
        ...prev,
        embed: {
          ...prev.embed,
          fields: newFields,
        }
      }
    })
  }

  const addTimestamp = () => {
    setMessageData((prev) => ({
      ...prev,
      embed: {
        ...prev.embed,
        timestamp: "{timestamp}",
      }
    }))
  }

  const removeTimestamp = () => {
    setMessageData((prev) => {
      const newData = { ...prev }
      delete newData.embed.timestamp
      return newData
    })
  }

  const addButton = () => {
    setMessageData((prev) => ({
      ...prev,
      embed: {
        ...prev.embed,
        buttons: [...prev.embed.buttons, { label: "", url: "" }],
      }
    }))
  }

  const removeButton = (index: number) => {
    setMessageData((prev) => {
      const newButtons = [...prev.embed.buttons]
      newButtons.splice(index, 1)
      return {
        ...prev,
        embed: {
          ...prev.embed,
          buttons: newButtons,
        }
      }
    })
  }

  return {
    messageData,
    handleContentChange,
    handleInputChange,
    handleFieldChange,
    handleButtonChange,
    addField,
    removeField,
    addTimestamp,
    removeTimestamp,
    addButton,
    removeButton,
  }
}

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false)

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Embed code copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return { copied, copy }
}

const useVariablesModal = () => {
  const [showVariablesModal, setShowVariablesModal] = useState(false)
  
  const variables: Variable[] = [
    { name: "{user}", description: "The user's name", category: 'user' },
    { name: "{user.mention}", description: "Mentions the user", category: 'user' },
    { name: "{user.name}", description: "The user's display name", category: 'user' },
    { name: "{user.avatar}", description: "The user's avatar URL", category: 'user' },
    { name: "{user.created_at}", description: "When the user created their account", category: 'user' },
    { name: "{user.joined_at}", description: "When the user joined the server", category: 'user' },
    { name: "{guild.name}", description: "The server's name", category: 'user' },
    { name: "{guild.count}", description: "Number of members in the server", category: 'user' },
    { name: "{guild.count.format}", description: "Formatted number of members (e.g. '1st')", category: 'user' },
    { name: "{guild.id}", description: "The server's ID", category: 'user' },
    { name: "{guild.created_at}", description: "When the server was created", category: 'user' },
    { name: "{guild.boost_count}", description: "Number of boosts in the server", category: 'user' },
    { name: "{guild.booster_count}", description: "Number of boosters in the server", category: 'user' },
    { name: "{guild.boost_tier}", description: "The server's boost tier", category: 'user' },
    { name: "{guild.icon}", description: "The server's icon URL", category: 'user' },
    { name: "{guild.vanity}", description: "The server's vanity URL code", category: 'user' },
    { name: "{whitespace}", description: "Invisible character for spacing", category: 'user' },
    { name: "{timestamp}", description: "Current time", category: 'user' },
    { name: "{track}", description: "Current/last played track name (LastFM)", category: 'lastfm' },
    { name: "{track.duration}", description: "Track duration (LastFM)", category: 'lastfm' },
    { name: "{artist}", description: "Track artist (LastFM)", category: 'lastfm' },
    { name: "{track.url}", description: "URL to the track (LastFM)", category: 'lastfm' },
    { name: "{artist.url}", description: "URL to the artist (LastFM)", category: 'lastfm' },
    { name: "{scrobbles}", description: "User's total scrobbles (LastFM)", category: 'lastfm' },
    { name: "{track.image}", description: "Track album art (LastFM)", category: 'lastfm' },
    { name: "{username}", description: "LastFM username", category: 'lastfm' },
    { name: "{artist.plays}", description: "Number of plays for the artist (LastFM)", category: 'lastfm' },
    { name: "{track.plays}", description: "Number of plays for the track (LastFM)", category: 'lastfm' },
    { name: "{track.hyperlink}", description: "Track name as a hyperlink (LastFM)", category: 'lastfm' },
    { name: "{artist.hyperlink}", description: "Artist name as a hyperlink (LastFM)", category: 'lastfm' },
    { name: "{date}", description: "Current date (LastFM)", category: 'lastfm' },
  ]

  return {
    showVariablesModal,
    setShowVariablesModal,
    variables,
  }
}

// Utility Functions
const generateEmbedCode = (messageData: MessageData): string => {
  // Filter out empty fields
  const cleanedData = { ...messageData.embed }

  // Remove empty fields
  if (cleanedData.fields) {
    cleanedData.fields = cleanedData.fields.filter((field) => field.name.trim() !== "" && field.value.trim() !== "")
  }

  // Remove empty sections
  Object.keys(cleanedData).forEach((key) => {
    const k = key as keyof EmbedData
    if (typeof cleanedData[k] === "object" && cleanedData[k] !== null) {
      const obj = cleanedData[k] as Record<string, any>
      const isEmpty = Object.values(obj).every((val) => val === undefined || val === "" || val === null)
      if (isEmpty) {
        delete cleanedData[k]
      }
    } else if (cleanedData[k] === "" || cleanedData[k] === undefined) {
      delete cleanedData[k]
    }
  })

  // Start with content if it exists
  let code = messageData.content ? `{content: ${messageData.content}}` : ""
  
  // Add embed code
  code += "{embed}"
  
  // Add basic properties
  if (cleanedData.title) code += `{title: ${cleanedData.title}}`
  if (cleanedData.description) code += `{description: ${cleanedData.description.replace(/\n/g, "\\n")}}`
  if (cleanedData.url) code += `{url: ${cleanedData.url}}`
  if (cleanedData.color) code += `{color: ${cleanedData.color.replace("#", "")}}`
  if (cleanedData.timestamp) code += `{timestamp}`
  
  // Add thumbnail and image
  if (cleanedData.thumbnail?.url) code += `{thumbnail: ${cleanedData.thumbnail.url}}`
  if (cleanedData.image?.url) code += `{image: ${cleanedData.image.url}}`
  
  // Add footer with && separator
  if (cleanedData.footer) {
    let footerText = cleanedData.footer.text || ""
    let footerIconUrl = cleanedData.footer.icon_url || ""
    
    if (footerText || footerIconUrl) {
      code += `{footer: ${footerText}`
      if (footerIconUrl) code += ` && ${footerIconUrl}`
      code += "}"
    }
  }
  
  // Add author with && separator
  if (cleanedData.author) {
    let authorName = cleanedData.author.name || ""
    let authorUrl = cleanedData.author.url || ""
    let authorIconUrl = cleanedData.author.icon_url || ""
    
    if (authorName) {
      code += `{author: ${authorName}`
      if (authorUrl) code += ` && ${authorUrl}`
      if (authorIconUrl) code += ` && ${authorIconUrl}`
      code += "}"
    }
  }
  
  // Add fields
  if (cleanedData.fields && cleanedData.fields.length > 0) {
    cleanedData.fields.forEach(field => {
      code += `{field: ${field.name} && ${field.value.replace(/\n/g, "\\n")}`
      if (field.inline) code += ` && inline true`
      code += "}"
    })
  }
  
  // Add buttons
  if (cleanedData.buttons && cleanedData.buttons.length > 0) {
    cleanedData.buttons.forEach((button, index) => {
      code += `{button: ${button.label} && ${button.url}}`
    })
  }
  
  return code
}

// Components
const EmbedPreview: React.FC<{ messageData: MessageData }> = ({ messageData }) => {
  return (
    <div className="bg-secondary/10 rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-medium mb-4">Preview</h2>
      <div className="bg-[#36393f] rounded-md overflow-hidden">
        <div className="p-4 max-w-[520px]">
          {/* Message Content */}
          {messageData.content && (
            <div className="text-white mb-2 break-words">
              {messageData.content}
            </div>
          )}
          
          {/* Embed */}
          <div
            className="rounded-md overflow-hidden border-l-4"
            style={{ borderLeftColor: messageData.embed.color || "#1e3f58" }}
          >
            <div className="bg-[#2f3136] p-3 space-y-2">
              {/* Author */}
              {(messageData.embed.author?.name || messageData.embed.author?.icon_url) && (
                <div className="flex items-center gap-2">
                  {messageData.embed.author.icon_url && (
                    <img
                      src={messageData.embed.author.icon_url}
                      alt="Author"
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=24&width=24"
                      }}
                    />
                  )}
                  <div className="flex items-center gap-1">
                    {messageData.embed.author.name && (
                      <span className="text-white/90 text-sm font-medium">
                        {messageData.embed.author.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Title and Description */}
              {messageData.embed.title && (
                <div className="text-white/90 font-medium">
                  {messageData.embed.url ? (
                    <a href={messageData.embed.url} className="hover:underline">
                      {messageData.embed.title}
                    </a>
                  ) : (
                    messageData.embed.title
                  )}
                </div>
              )}
              {messageData.embed.description && (
                <div className="text-white/70 text-sm whitespace-pre-wrap">{messageData.embed.description}</div>
              )}

              {/* Fields */}
              {messageData.embed.fields.length > 0 && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {messageData.embed.fields.map((field, index) => (
                    <div key={index} className={field.inline ? "col-span-1" : ""}>
                      <div className="text-white/90 text-sm font-medium">{field.name}</div>
                      <div className="text-white/70 text-sm whitespace-pre-wrap">{field.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Image */}
              {messageData.embed.image?.url && (
                <div className="pt-2">
                  <img
                    src={messageData.embed.image.url}
                    alt="Embed"
                    className="max-w-full rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                </div>
              )}

              {/* Footer */}
              {(messageData.embed.footer?.text || messageData.embed.footer?.icon_url || messageData.embed.timestamp) && (
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-[#40444b]">
                  {messageData.embed.footer?.icon_url && (
                    <img
                      src={messageData.embed.footer.icon_url}
                      alt="Footer"
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=20&width=20"
                      }}
                    />
                  )}
                  <div className="text-xs text-white/70 flex items-center gap-1">
                    {messageData.embed.footer?.text && <span>{messageData.embed.footer.text}</span>}
                    {messageData.embed.footer?.text && messageData.embed.timestamp && <span>•</span>}
                    {messageData.embed.timestamp && <span>Current Time</span>}
                  </div>
                </div>
              )}

              {/* Buttons */}
              {messageData.embed.buttons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {messageData.embed.buttons.map((button, index) => (
                    <a
                      key={index}
                      href={button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#4752C4] hover:bg-[#3C45A5] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    >
                      {button.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContentSection: React.FC<{
  content?: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}> = ({ content, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/70 mb-1">
          Message Content <span className="text-blue-400">(supports variables)</span>
        </label>
        <textarea
          value={content || ""}
          onChange={onChange}
          className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm min-h-[80px] custom-scrollbar"
          placeholder="Add a message that will appear above the embed"
        />
      </div>
    </div>
  )
}

const EmbedForm: React.FC<{
  messageData: MessageData
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string, field?: string) => void
  handleFieldChange: (index: number, key: keyof EmbedField, value: string | boolean) => void
  handleButtonChange: (index: number, field: keyof EmbedButton, value: string) => void
  addField: () => void
  removeField: (index: number) => void
  addTimestamp: () => void
  removeTimestamp: () => void
  addButton: () => void
  removeButton: (index: number) => void
}> = ({
  messageData,
  handleContentChange,
  handleInputChange,
  handleFieldChange,
  handleButtonChange,
  addField,
  removeField,
  addTimestamp,
  removeTimestamp,
  addButton,
  removeButton,
}) => {
  return (
    <div className="space-y-6">
      {/* Content Section */}
      <ContentSection
        content={messageData.content}
        onChange={handleContentChange}
      />

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Embed Sections */}
      <div className="space-y-4">
        {/* Author Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Author</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/70 mb-1">Author Name</label>
              <input
                type="text"
                value={messageData.embed.author?.name || ""}
                onChange={(e) => handleInputChange(e, "author", "name")}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Author URL</label>
              <input
                type="text"
                value={messageData.embed.author?.url || ""}
                onChange={(e) => handleInputChange(e, "author", "url")}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Author Icon URL</label>
              <input
                type="text"
                name="icon_url"
                value={messageData.embed.author?.icon_url || ""}
                onChange={(e) => handleInputChange(e, "author", "icon_url")}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                placeholder="https://example.com/icon.png"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={messageData.embed.title || ""}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
              placeholder="Embed Title"
            />
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">URL</label>
            <input
              type="text"
              name="url"
              value={messageData.embed.url || ""}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">
              Description <span className="text-blue-400">(supports variables)</span>
            </label>
            <textarea
              name="description"
              value={messageData.embed.description || ""}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm min-h-[100px] custom-scrollbar"
              placeholder="Embed description text"
            />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Fields</h3>
            <div className="flex gap-2">
              <Button
                onClick={addField}
                size="sm"
                variant="outline"
                className="h-8 px-2 flex items-center gap-1 text-xs"
              >
                <Plus className="h-3 w-3" /> Add Field
              </Button>
            </div>
          </div>

          {messageData.embed.fields.length === 0 && (
            <div className="text-center py-3 text-white/50 text-sm bg-black/20 rounded-md">
              No fields added yet
            </div>
          )}

          {messageData.embed.fields.map((field, index) => (
            <div key={index} className="bg-black/20 rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Field {index + 1}</h4>
                <Button onClick={() => removeField(index)} size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Trash className="h-3 w-3 text-white/70" />
                </Button>
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Name</label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                  placeholder="Field Name"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Field Value <span className="text-blue-400">(supports variables)</span>
                </label>
                <textarea
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm custom-scrollbar"
                  placeholder="Field Value"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`inline-${index}`}
                  checked={field.inline}
                  onChange={(e) => handleFieldChange(index, "inline", e.target.checked)}
                  className="rounded border-white/30"
                />
                <label htmlFor={`inline-${index}`} className="text-xs text-white/70">
                  Inline
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Buttons</h3>
            <div className="flex gap-2">
              <Button
                onClick={addButton}
                size="sm"
                variant="outline"
                className="h-8 px-2 flex items-center gap-1 text-xs"
              >
                <Plus className="h-3 w-3" /> Add Button
              </Button>
            </div>
          </div>

          {messageData.embed.buttons.length === 0 && (
            <div className="text-center py-3 text-white/50 text-sm bg-black/20 rounded-md">
              No buttons added yet
            </div>
          )}

          {messageData.embed.buttons.map((button, index) => (
            <div key={index} className="bg-black/20 rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Button {index + 1}</h4>
                <Button onClick={() => removeButton(index)} size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Trash className="h-3 w-3 text-white/70" />
                </Button>
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Label</label>
                <input
                  type="text"
                  value={button.label}
                  onChange={(e) => handleButtonChange(index, "label", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                  placeholder="Click me!"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">URL</label>
                <input
                  type="text"
                  value={button.url}
                  onChange={(e) => handleButtonChange(index, "url", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Images</h3>
          <div>
            <label className="block text-xs text-white/70 mb-1">Thumbnail URL</label>
            <input
              type="text"
              name="url"
              value={messageData.embed.thumbnail?.url || ""}
              onChange={(e) => handleInputChange(e, "thumbnail", "url")}
              className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
              placeholder="https://example.com/thumbnail.png"
            />
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">Image URL</label>
            <input
              type="text"
              name="url"
              value={messageData.embed.image?.url || ""}
              onChange={(e) => handleInputChange(e, "image", "url")}
              className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Footer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/70 mb-1">
                Footer Text <span className="text-blue-400">(supports variables)</span>
              </label>
              <input
                type="text"
                value={messageData.embed.footer?.text || ""}
                onChange={(e) => handleInputChange(e, "footer", "text")}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                placeholder="Footer text"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Footer Icon URL</label>
              <input
                type="text"
                name="icon_url"
                value={messageData.embed.footer?.icon_url || ""}
                onChange={(e) => handleInputChange(e, "footer", "icon_url")}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                placeholder="https://example.com/footer-icon.png"
              />
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="pt-2">
          {messageData.embed.timestamp ? (
            <Button
              onClick={removeTimestamp}
              variant="destructive"
              size="sm"
              className="h-8 px-3 flex items-center gap-1 text-xs"
            >
              <Minus className="h-3 w-3" /> Remove Timestamp
            </Button>
          ) : (
            <Button
              onClick={addTimestamp}
              variant="outline"
              size="sm"
              className="h-8 px-3 flex items-center gap-1 text-xs"
            >
              <Clock className="h-3 w-3" /> Add Timestamp
            </Button>
          )}
          {messageData.embed.timestamp && (
            <p className="text-xs text-white/50 mt-1">
              Timestamp: Current Time
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const VariablesModal: React.FC<{
  showModal: boolean
  setShowModal: (show: boolean) => void
  variables: Variable[]
}> = ({ showModal, setShowModal, variables }) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-3xl max-h-[80vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Available Variables</DialogTitle>
          <DialogDescription className="text-gray-400">
            These variables can be used in your embed content and will be replaced with actual values when the embed is displayed.
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pr-2">
          <div className="space-y-2 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-gray-900 py-1">User & Server Variables</h3>
            <div className="space-y-2">
              {variables.filter(v => v.category === 'user').map((variable) => (
                <div key={variable.name} className="p-2 bg-gray-800 rounded-md">
                  <code className="text-blue-400 font-mono">{variable.name}</code>
                  <p className="text-sm text-gray-300">{variable.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-gray-900 py-1">LastFM Variables</h3>
            <div className="space-y-2">
              {variables.filter(v => v.category === 'lastfm').map((variable) => (
                <div key={variable.name} className="p-2 bg-gray-800 rounded-md">
                  <code className="text-blue-400 font-mono">{variable.name}</code>
                  <p className="text-sm text-gray-300">{variable.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Note: Some variables may only work in specific contexts or commands.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const CodeOutput: React.FC<{
  messageData: MessageData
  copied: boolean
  onCopy: () => void
  onShowVariables: () => void
}> = ({ messageData, copied, onCopy, onShowVariables }) => {
  return (
    <div className="bg-secondary/10 rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Embed Code</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={onCopy}
            size="sm"
            className="h-8 px-3 flex items-center gap-1 text-xs"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy Embed Code
              </>
            )}
          </Button>
          <Button
            onClick={onShowVariables}
            size="sm"
            variant="outline"
            className="h-8 px-3 flex items-center gap-1 text-xs"
          >
            <Info className="h-3 w-3" /> Available Variables
          </Button>
        </div>
      </div>
      <div className="bg-black/50 rounded-md p-3 overflow-x-auto custom-scrollbar">
        <pre className="text-xs text-white/90 font-mono whitespace-pre-wrap break-all">
          {generateEmbedCode(messageData)}
        </pre>
      </div>
      <div className="mt-4 bg-blue-900/20 border border-blue-500/20 rounded-md p-3 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-blue-300">
          <p>Use this code with Greed bot commands that support embeds, such as:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>
              <code className="bg-blue-900/30 px-1 py-0.5 rounded">,embed {"{embed_code}"}</code>
            </li>
            <li>
              <code className="bg-blue-900/30 px-1 py-0.5 rounded">,welcome message {"{embed_code}"}</code>
            </li>
            <li>
              <code className="bg-blue-900/30 px-1 py-0.5 rounded">,boost message {"{embed_code}"}</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function EmbedBuilderPage() {
  const pathname = usePathname()
  const {
    messageData,
    handleContentChange,
    handleInputChange,
    handleFieldChange,
    handleButtonChange,
    addField,
    removeField,
    addTimestamp,
    removeTimestamp,
    addButton,
    removeButton,
  } = useEmbedBuilder()
  
  const { copied, copy } = useCopyToClipboard()
  const { showVariablesModal, setShowVariablesModal, variables } = useVariablesModal()

  const copyEmbedCode = () => {
    const code = generateEmbedCode(messageData)
    copy(code)
  }

  // Custom scrollbar styles
  const scrollbarStyles = `
    /* Custom scrollbar for webkit browsers */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #1a1a1a;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #444;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    
    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: #444 #1a1a1a;
    }
    
    /* Custom scrollbar class for specific elements */
    .custom-scrollbar::-webkit-scrollbar {
      height: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0a0a0a;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #444;
    }
  `

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands" },
    { href: "/docs", label: "Documentation" },
    { href: "/tools/embed", label: "Embed Builder", isActive: pathname === "/tools/embed" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Apply custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      <header className="border-b border-white/10 p-4 sticky top-0 bg-black/90 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <RotatingMoonLogo size={24} />
            <span className="font-bold text-xl">Greed</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-white/80 transition-colors ${item.isActive ? 'text-primary' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Link href="/invite" className="nav-button">
              Add to Discord
            </Link>
          </div>
          <MobileMenu items={navItems} />
        </div>
      </header>

      <PageTransition>
        <main className="container mx-auto py-4 md:py-8 px-4">
          <div className="flex items-center gap-2 mb-4 md:mb-8">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <span className="text-white/60">/</span>
            <Link href="/tools" className="text-white/60 hover:text-white transition-colors">
              Tools
            </Link>
            <span className="text-white/60">/</span>
            <span>Embed Builder</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-6">Discord Embed Builder</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Form */}
            <div className="bg-secondary/10 rounded-lg p-4 md:p-6 space-y-4">
              <EmbedForm
                messageData={messageData}
                handleContentChange={handleContentChange}
                handleInputChange={handleInputChange}
                handleFieldChange={handleFieldChange}
                handleButtonChange={handleButtonChange}
                addField={addField}
                removeField={removeField}
                addTimestamp={addTimestamp}
                removeTimestamp={removeTimestamp}
                addButton={addButton}
                removeButton={removeButton}
              />
            </div>

            {/* Right side - Preview and Code */}
            <div className="space-y-6">
              <EmbedPreview messageData={messageData} />
              <CodeOutput
                messageData={messageData}
                copied={copied}
                onCopy={copyEmbedCode}
                onShowVariables={() => setShowVariablesModal(true)}
              />
            </div>
          </div>
        </main>
      </PageTransition>

      <VariablesModal
        showModal={showVariablesModal}
        setShowModal={setShowVariablesModal}
        variables={variables}
      />
    </div>
  )
}

