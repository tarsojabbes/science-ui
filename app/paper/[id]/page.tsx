'use client'
import { Button } from "@/components/ui/button"
import axios from "axios"
import { ChevronLeftIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Paper = {
    id: number
    name: string
    journalId: number
    status: string
    publishedDate: string
    submissionDate: string
}

export default function PaperPage() {
    const { id } = useParams()
    const [paper, setPaper] = useState<Paper>()
    const router = useRouter()
    const goBackHome = () => {
        router.push("/home")
    }
    useEffect(() => {
        const fetchPaper = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/papers/${id}`, {
                headers: {
                    "Authorization": "Bearer " + window?.localStorage.getItem("@science.token")
                }
            })
            setPaper(response.data)
        }
        fetchPaper()
    }, [])
    return (
        <div>
            <div className="pb-4 w-1/4">
                <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                    <ChevronLeftIcon /> Go back
                </Button>
            </div>
            <h1 className="text-gray-700 text-2xl font-semibold pb-4 pt-4">{paper?.name}</h1> 
            <h2>{paper?.status}</h2>
            <h3>{paper?.publishedDate}</h3>
            <h4>{paper?.submissionDate}</h4>
            <h5>{paper?.journalId}</h5>
        </div>
    )
}