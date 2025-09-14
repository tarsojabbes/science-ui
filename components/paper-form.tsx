'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ChevronDownIcon, XIcon } from "lucide-react"

type Researcher = {
  id: number
  name: string
  institution: string
  orcid: string
}

type Journal = {
  id: number
  name: string
  issn: string
}

export function PaperForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null)
  const [selectedResearchers, setSelectedResearchers] = useState<Researcher[]>([])
  const [availableResearchers, setAvailableResearchers] = useState<Researcher[]>([])
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
        const token = window?.localStorage.getItem("@science.token")
        const userId = parseInt(window?.localStorage.getItem("@science.id") || "", 10)

        const journalsResponse = await axios.get(`${server}/journals?limit=100`, {
          headers: { "Authorization": "Bearer " + token }
        })
        setJournals(journalsResponse.data.data || [])

        const researchersResponse = await axios.get(`${server}/users?limit=100`, {
          headers: { "Authorization": "Bearer " + token }
        })
        setAvailableResearchers(researchersResponse.data || [])

        const currentUserResponse = await axios.get(`${server}/users/${userId}`, {
          headers: { "Authorization": "Bearer " + token }
        })
        
        const currentUser = currentUserResponse.data
        if (currentUser) {
          const currentResearcher: Researcher = {
            id: currentUser.id,
            name: currentUser.name,
            institution: currentUser.institution || 'N/A',
            orcid: currentUser.orcid || 'N/A'
          }
          setSelectedResearchers([currentResearcher])
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError('Erro ao carregar dados')
      }
    }

    fetchData()
  }, [])

  const handleAddResearcher = (researcher: Researcher) => {
    if (!selectedResearchers.find(r => r.id === researcher.id)) {
      setSelectedResearchers(prev => [...prev, researcher])
    }
  }

  const handleRemoveResearcher = (researcherId: number) => {
    setSelectedResearchers(prev => prev.filter(r => r.id !== researcherId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedJournal) {
      setError('Please select a journal')
      return
    }
    
    if (selectedResearchers.length === 0) {
      setError('At least one researcher must be selected')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
      const token = window?.localStorage.getItem("@science.token")

      const paperData = {
        name,
        url,
        journalId: selectedJournal.id,
        researchers: selectedResearchers.map(r => r.id)
      }

      await axios.post(`${server}/papers`, paperData, {
        headers: { "Authorization": "Bearer " + token }
      })

      router.push("/home")
    } catch (err) {
      console.error('Erro ao submeter paper:', err)
      setError('Erro ao submeter o paper')
    } finally {
      setLoading(false)
    }
  }

  const availableToAdd = availableResearchers.filter(
    researcher => !selectedResearchers.find(selected => selected.id === researcher.id)
  )

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Submit a new paper</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Paper Name */}
        <div className="grid gap-3">
          <Label htmlFor="name">Paper Title *</Label>
          <Input 
            id="name" 
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the paper title"
          />
        </div>

        {/* Paper URL */}
        <div className="grid gap-3">
          <Label htmlFor="url">Paper URL *</Label>
          <Input 
            id="url" 
            type="url" 
            required 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/paper.pdf"
          />
        </div>

        {/* Journal Selection */}
        <div className="grid gap-3">
          <Label>Journal *</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedJournal ? (
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{selectedJournal.name}</span>
                    <span className="text-xs text-gray-500">ISSN: {selectedJournal.issn}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select a journal</span>
                )}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[400px]">
              {journals.map((journal) => (
                <DropdownMenuItem 
                  key={journal.id}
                  onClick={() => setSelectedJournal(journal)}
                  className="flex flex-col items-start cursor-pointer"
                >
                  <span className="font-medium">{journal.name}</span>
                  <span className="text-xs text-gray-500">ISSN: {journal.issn}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected Researchers */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label>Researchers *</Label>
            <span className="text-xs text-gray-500">
              {selectedResearchers.length} researcher{selectedResearchers.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          {/* Display selected researchers */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedResearchers.map((researcher) => (
              <div key={researcher.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col flex-grow">
                  <span className="font-medium text-sm">{researcher.name}</span>
                  <span className="text-xs text-gray-500">{researcher.institution}</span>
                  <span className="text-xs text-gray-400">ORCID: {researcher.orcid}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveResearcher(researcher.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add researcher dropdown */}
          {availableToAdd.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-dashed border-2 hover:border-solid">
                  <span className="text-gray-500">+ Add another researcher</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[400px] max-h-60 overflow-y-auto">
                {availableToAdd.map((researcher) => (
                  <DropdownMenuItem 
                    key={researcher.id}
                    onClick={() => handleAddResearcher(researcher)}
                    className="flex flex-col items-start cursor-pointer p-3"
                  >
                    <span className="font-medium">{researcher.name}</span>
                    <span className="text-xs text-gray-500">{researcher.institution}</span>
                    <span className="text-xs text-gray-400">ORCID: {researcher.orcid}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              All available researchers have been added
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full cursor-pointer" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit paper'}
        </Button>
      </div>
    </form>
  )
}
