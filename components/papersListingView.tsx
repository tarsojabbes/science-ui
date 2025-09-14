'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"
import { ChevronRightIcon, ScrollText, ScrollTextIcon } from "lucide-react"

type Paper = {
    id: number
    name: string
    journalId: number
    status: string
    publishedDate: string
    submissionDate: string
}

type Journal = {
    name: string
    issn: string
    id: number
}

export default function PapersListingView() {
    const router = useRouter()
    const [papers, setPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [journals, setJournals] = useState<Journal[]>([])

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                setLoading(true)
                const userId = parseInt(window?.localStorage.getItem("@science.id") || "", 10)
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")
                
                const response = await axios.get(`${server}/papers/researchers/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                })
                setPapers(response.data.data)
                setError(null)
            } catch (err) {
                setError('Error loading papers')
                console.error('Erro ao buscar papers:', err)
            } finally {
                setLoading(false)
            }
        }

        const fetchJournals = async () => {
            const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
            const token = window?.localStorage.getItem("@science.token")
            const response = await axios.get(`${server}/journals?limit=100`, {
                headers: {
                    "Authorization": "Bearer " + token
                },
            })
            setJournals(response.data.data)
        }

        fetchJournals()
        fetchPapers()
    }, [])

    const handleCreateNewPaper = () => {
        router.push("/new-paper")
    }

    if (loading) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                    Your Papers
                </h1>
                <div className="pb-4">
                    <p className="text-gray-500">Loading papers...</p>
                </div>
                <Button className="cursor-pointer" onClick={handleCreateNewPaper}>Submit a new paper</Button>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                    Your Papers
                </h1>
                <div className="pb-4">
                    <p className="text-red-500">{error}</p>
                </div>
                <Button className="cursor-pointer" onClick={handleCreateNewPaper}>Submit a new paper</Button>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-8 flex-col">
            <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                Your Papers
            </h1>
            <div className="pb-4">
                {papers && papers.length === 0 ? (
                    <p className="text-gray-500">You haven't submitted any papers yet!</p>
                ) : (
                    <div className="space-y-4">
                        {papers.map((paper) => (
                            <div key={paper.id} className="border rounded-lg p-4 bg-white w-3/4 flex flex-row gap-4">
                                <div className="flex items-start justify-center w-8 pt-2 flex-shrink-0">
                                    <ScrollTextIcon size={26} className="text-gray-600" />
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <h3 className="font-semibold text-lg"><a href={`/paper/${paper.id}`}>{paper.name}</a></h3>
                                    <a className="text-xs text-gray-700 mt-1" href={`/journal/${paper.journalId}`}>{journals.find((journal) => journal.id === paper.journalId)?.name}</a>
                                    <p className="text-xs text-gray-400 mt-1 mb-4">Submitted: {new Date(paper.submissionDate).toLocaleDateString()}</p>
                                    <a href={`/paper/${paper.id}`}>
                                        <Button className="cursor-pointer" variant={"secondary"}>
                                            Status: {paper.status}
                                            <ChevronRightIcon />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Button className="cursor-pointer" onClick={handleCreateNewPaper}>Submit a new paper</Button>
        </div>
    )
}
