'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation";

export function JournalForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name, setName] = useState('')
  const [issn, setIssn] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const CreateJournal = (name: string, issn: string) => {
    let server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
    let token = window?.localStorage.getItem("@science.token")
    axios.post(server + "/journals", {
        "name": name,
        "issn": issn
    },
    {headers: {
            "Authorization": "Bearer " + token
    }})
    .then((res) => {
        let journalId = res.data.id
        let userId = parseInt(window?.localStorage.getItem("@science.id") || "", 10)
        axios.post(server + "/journals/editors", {
            "journalId": journalId,
            "userId": userId
        }, {
            headers: {
            "Authorization": "Bearer " + token
            },
        })
        .then((res) => {
            router.push("/home")
        })
        .catch((err) => {
            setError(true)
        })
    })
    .catch((err) => setError(true))
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        CreateJournal(name, issn)
        }}
      className={cn("flex flex-col gap-6", className)} 
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create a new journal</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" required onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="issn">ISSN</Label>
          </div>
          <Input id="issn" type="text" required onChange={(e) => setIssn(e.target.value)}/>
        </div>
        {error ? <p className="text-red-800">Something went wrong...</p> : null}
        <Button type="submit" className="w-full cursor-pointer">
          Create journal
        </Button>
      </div>
    </form>
  )
}
