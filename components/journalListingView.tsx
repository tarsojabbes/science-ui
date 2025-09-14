'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"
import JournalWidget from "./ui/journalWidget"

type Journal = {
    name: string
    issn: string
    id: number
    assignedAt: string
}

export default function JournalListingView() {
    const router = useRouter()
    const [journals, setJournals] = useState<Journal[]>([])
    const [allJournals, setAllJournals] = useState<Journal[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                setLoading(true)
                const userId = parseInt(window?.localStorage.getItem("@science.id") || "", 10)
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")
                let response = await axios.get(server + "/users/" + userId + "/journals", 
                    {
                        headers: {
                        "Authorization": "Bearer " + token
                        },
                    }
                )
                setJournals(response.data)

                response = await axios.get(server + "/journals?limit=100", 
                    {
                        headers: {
                        "Authorization": "Bearer " + token
                        },
                    }
                )
                setAllJournals(response.data.data)
                setError(null)
            } catch (err) {
                setError('Error loading journals')
                console.error('Erro ao buscar journals:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchJournals()
    }, [])

    const handleCreateNewJournal = () => {
        router.push("/new-journal")
    }
    if (loading) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                    You are an editor on these journals
                </h1>
                <div className="pb-4">
                    <p className="text-gray-500">Loading journals...</p>
                </div>
                <Button className="cursor-pointer" onClick={handleCreateNewJournal}>Create a new journal</Button>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                    You are an editor on these journals
                </h1>
                <div className="pb-4">
                    <p className="text-red-500">{error}</p>
                </div>
                <Button className="cursor-pointer" onClick={handleCreateNewJournal}>Create a new journal</Button>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-8 flex-col">
            <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                You are an editor on these journals
            </h1>
            <div className="pb-4">
                <div className="inline-flex gap-6">
                    {journals && journals.length == 0 ? "Looks like you are not an editor on any journal!" : null}
                    {journals.map((journal) => 
                        <JournalWidget key={journal.id} journalId={journal.id} journalName={journal.name}/>
                    )}
                </div>
            </div>
            <Button className="cursor-pointer" onClick={handleCreateNewJournal}>Create a new journal</Button>
            <h1 className="text-gray-600 text-2xl font-semibold pt-6 pb-4">
                All journals
            </h1>
            <div className="pb-4">
                <div className="inline-flex gap-6">
                    {allJournals && allJournals.length == 0 ? "Looks like we don't have any journals yet!" : null}
                    {allJournals.map((journal) => 
                        <JournalWidget key={journal.id} journalId={journal.id} journalName={journal.name}/>
                    )}
                </div>
            </div>
        </div>
    )
}