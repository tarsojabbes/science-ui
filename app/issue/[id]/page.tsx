'use client'
import { Button } from "@/components/ui/button"
import axios from "axios"
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Researcher = {
    id: number
    name: string
    email: string
    institution: string
    orcid: string
    roles: string[]
}

type Paper = {
    id: number
    name: string
    publishedDate: string
    submissionDate: string
    url: string
    journalId: number
    issueId: number
    researchers: Researcher[]
}

type Issue = {
    id: number
    number: number
    volume: number
    publishedDate: string
    journalId: number
    papers: Paper[]
}

type Journal = {
    id: number
    name: string
    issn: string
}

export default function IssuePage() {
    const { id } = useParams()
    const [issue, setIssue] = useState<Issue>()
    const [journal, setJournal] = useState<Journal>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    
    const goBackHome = () => {
        router.push("/home")
    }

    useEffect(() => {
        const fetchIssueData = async () => {
            try {
                setLoading(true)
                setError(null)
                const token = window?.localStorage.getItem("@science.token")
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN

                const issueResponse = await axios.get(`${server}/issues/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                setIssue(issueResponse.data)
                if (issueResponse.data.journalId) {
                    const journalResponse = await axios.get(`${server}/journals/${issueResponse.data.journalId}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    })
                    setJournal(journalResponse.data)
                }

            } catch (error) {
                console.error('Error fetching issue data:', error)
                setError('Error loading issue data')
            } finally {
                setLoading(false)
            }
        }

        fetchIssueData()
    }, [id])

    if (loading) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <div className="pb-4 w-1/4">
                    <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                        <ChevronLeftIcon /> Go back
                    </Button>
                </div>
                <p className="text-gray-500">Loading issue data...</p>
            </div>
        )
    }

    if (error || !issue) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <div className="pb-4 w-1/4">
                    <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                        <ChevronLeftIcon /> Go back
                    </Button>
                </div>
                <p className="text-red-500">{error || 'Issue not found'}</p>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-8 flex-col">
            <div className="pb-4 w-1/4">
                <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                    <ChevronLeftIcon /> Go back
                </Button>
            </div>
            
            <h1 className="text-gray-700 text-2xl font-semibold pb-4 pt-4">
                Volume {issue.volume}, Issue {issue.number}
            </h1>
            
            <div className="py-4">
                <p className="text-gray-600">
                    Published on {new Date(issue.publishedDate).toLocaleDateString()} in{' '}
                    {journal ? (
                        <a 
                            href={`/journal/${journal.id}`}
                            className="text-gray-700 hover:text-gray-900 underline cursor-pointer transition-colors duration-200"
                        >
                            {journal.name}
                        </a>
                    ) : (
                        'Unknown Journal'
                    )}
                </p>
            </div>

            <h2 className="text-gray-600 text-xl font-semibold pb-4">Papers</h2>
            <div className="pb-4">
                {issue.papers.length === 0 ? (
                    <p className="text-gray-500">No papers found in this issue.</p>
                ) : (
                    <div className="space-y-4">
                        {issue.papers.map((paper) => (
                            <div key={paper.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-lg mb-1">{paper.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Published: {new Date(paper.publishedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {paper.url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(paper.url, '_blank')}
                                            className="cursor-pointer flex items-center gap-2 ml-4"
                                        >
                                            <ExternalLinkIcon className="h-4 w-4" />
                                            View Paper
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Authors:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {paper.researchers.map((researcher) => (
                                            <div key={researcher.id} className="bg-gray-50 px-3 py-1 rounded-full text-sm">
                                                <span className="font-medium">{researcher.name}</span>
                                                <span className="text-gray-500 ml-1">({researcher.institution})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => router.push(`/paper/${paper.id}`)}
                                        className="cursor-pointer"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
