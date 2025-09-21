'use client'
import { IssueForm } from "../../components/issue-form"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateNewIssuePage() {
    const router = useRouter()
    const goBackHome = () => {
        router.push("/home")
    }
    
    return (
        <div className="w-screen h-screen flex flex-col px-96 py-20">
            <div className="pb-4 w-1/4">
                <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                    <ChevronLeftIcon /> Go back
                </Button>
            </div>
            <div className="max-w-2xl">
                <IssueForm />
            </div>
        </div>
    )
}
