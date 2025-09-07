'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('')
  const [orcid, setOrcid] = useState('')
  const [name, setName] = useState('')
  
  const [error, setError] = useState(false)
  const router = useRouter()

  const SignUp = (email: string, password: string, institution: string, orcid: string, name: string) => {
    let server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
    axios.post(server + "/users/", {
      "email": email,
      "password": password,
      "institution": institution,
      "orcid": orcid,
      "name": name,
      "roles": ["AUTHOR"]
    })
    .then((res) => {
      axios.post(server + "/users/login", {
        "email": email,
        "password": password
        })
        .then((res) => {
          localStorage.setItem('@science.username', res.data.user.name)
          localStorage.setItem('@science.email', res.data.user.email)
          localStorage.setItem('@science.id', res.data.user.id)
          localStorage.setItem('@science.institution', res.data.user.institution)
          localStorage.setItem('@science.orcid', res.data.user.orcid)
          localStorage.setItem('@science.token', res.data.token)
          router.push("/home")
        })
        .catch((err) => setError(true))
    })
    .catch((err) => setError(true))
  }
  return (
    <form
        onSubmit={(e) => {
          e.preventDefault()
          SignUp(email, password, institution, orcid, name)
        }}
      className={cn("flex flex-col gap-6", className)} 
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up to Science</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" required onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="maria@ccc.ufcg.edu.br" required onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="institution">Institution</Label>
          <Input id="institution" type="text" required onChange={(e) => setInstitution(e.target.value)}/>
        </div>  
        <div className="grid gap-3">
          <Label htmlFor="orcid">ORCID</Label>
          <Input id="orcid" type="text" required onChange={(e) => setOrcid(e.target.value)}/>
        </div>
        {error ? <p className="text-red-800">Something went wrong...</p> : null}
        <Button type="submit" className="w-full cursor-pointer">
          Sign up
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
