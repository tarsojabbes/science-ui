'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import IssueWidget from "@/components/ui/issueWidget"
import axios from "axios"
import { ChevronLeftIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Issue = {
    id: number,
    number: number,
    volume: number,
    publishedDate: string,
    journalId: number
}
type Journal = {
    name: string
    issn: string
    id: number
    assignedAt: string
    issues: Issue[]
}

export default function JournalPage() {
    const router = useRouter()
    const [journal, setJournal] = useState<Journal>()
    const [error, setError] = useState(false)
    const goBackHome = () => {
        router.push("/home")
    }
    const {id} = useParams()

    useEffect(() => {
       const fetchJournals = async () => {
            try {
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")
                const response = await axios.get(server + "/journals/" + id, 
                    {
                        headers: {
                        "Authorization": "Bearer " + token
                        },
                    }
                )
                setJournal(response.data)
            } catch (err) {
                setError(true)
                console.error('Erro ao buscar journals:', err)
            }
        }

        fetchJournals()
    }, [])
    return (
        <div className="h-full w-full p-8 flex-col">
            <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                    <ChevronLeftIcon /> Go back
            </Button>
            <h1 className="text-gray-700 text-2xl font-semibold pb-4 pt-4">
                {journal?.name}
            </h1>

            <h2 className="text-gray-600 text-xl font-semibold pb-4">Issues</h2>
            <div className="pb-4">
                            <div className="inline-flex gap-6">
                                {journal?.issues && journal.issues.length == 0 ? "Looks like this journal has no issues yet" : null}
                                {journal?.issues.map((issue) => 
                                    <IssueWidget key={issue.id} id={issue.id} volume={issue.volume} number={issue.number} publishedDate={issue.publishedDate}/>
                                )}
                            </div>
            </div>

            <h2 className="text-gray-600 text-xl font-semibold pb-4">Reviewers and Editor</h2>
            <div className="flex-col">
            <AddReviewer />
            <AddEditor />
            </div>
        </div>
    )
}

function AddReviewer() {
    return (
        <div className="flex w-full max-w-sm items-center gap-2 pb-2">
            <Input type="text" placeholder="Reviewer ID" />
            <Button type="submit" className="w-30">
                Add Reviewer
            </Button>
        </div>
    )
}

function AddEditor() {
    return (
        <div className="flex w-full max-w-sm items-center gap-2">
            <Input type="text" placeholder="Editor ID" />
            <Button type="submit" className="w-30">
                Add Editor
            </Button>
        </div>
    )
}

