'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import IssueWidget from "@/components/ui/issueWidget"
import axios from "axios"
import { ChevronLeftIcon, ChevronDownIcon, XIcon } from "lucide-react"
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

type User = {
    id: number
    name: string
    email: string
    institution: string
    orcid: string
}

type Editor = {
    id: number
    name: string
    email: string
    institution: string
    orcid: string
}

type Reviewer = {
    id: number
    name: string
    email: string
    institution: string
    orcid: string
}

export default function JournalPage() {
    const router = useRouter()
    const [journal, setJournal] = useState<Journal>()
    const [editors, setEditors] = useState<Editor[]>([])
    const [reviewers, setReviewers] = useState<Reviewer[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const goBackHome = () => {
        router.push("/home")
    }
    const {id} = useParams()

    useEffect(() => {
       const fetchJournalData = async () => {
            try {
                setLoading(true)
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")
                
                const journalResponse = await axios.get(server + "/journals/" + id, {
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                })
                setJournal(journalResponse.data)

                const editorsResponse = await axios.get(`${server}/journals/${id}/editors`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                })
                setEditors(editorsResponse.data)

                const reviewersResponse = await axios.get(`${server}/journals/${id}/reviewers`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                })
                setReviewers(reviewersResponse.data)
                const usersResponse = await axios.get(`${server}/users?limit=100`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                })
                setAllUsers(usersResponse.data)

            } catch (err) {
                setError(true)
                console.error('Erro ao buscar dados do journal:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchJournalData()
    }, [id])
    return (
        <div className="h-full w-full p-8 flex-col">
            <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                    <ChevronLeftIcon /> Go back
            </Button>
            <h1 className="text-gray-700 text-2xl font-semibold pb-4 pt-4">
                {journal?.name}
            </h1>

            <div className="flex justify-between items-center pb-4">
                <h2 className="text-gray-600 text-xl font-semibold">Issues</h2>
                <Button 
                    onClick={() => router.push(`/new-issue?journalId=${id}`)}
                    className="cursor-pointer"
                    variant="outline"
                >
                    Create New Issue
                </Button>
            </div>
            <div className="pb-4">
                            <div className="inline-flex gap-6">
                                {journal?.issues && journal.issues.length == 0 ? "Looks like this journal has no issues yet" : null}
                                {journal?.issues.map((issue) => 
                                    <IssueWidget key={issue.id} id={issue.id} volume={issue.volume} number={issue.number} publishedDate={issue.publishedDate}/>
                                )}
                            </div>
            </div>

            <h2 className="text-gray-600 text-xl font-semibold pb-4">Reviewers and Editors</h2>
            
            {loading ? (
                <p className="text-gray-500">Loading staff information...</p>
            ) : (
                <div className="space-y-6">
                    {/* Current Editors */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Current Editors</h3>
                        {editors.length === 0 ? (
                            <p className="text-gray-500 text-sm">No editors assigned yet</p>
                        ) : (
                            <div className="space-y-2">
                                {editors.map((editor) => (
                                    <div key={editor.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                        <div>
                                            <p className="font-medium">{editor.name}</p>
                                            <p className="text-sm text-gray-600">{editor.institution}</p>
                                            <p className="text-xs text-gray-500">{editor.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <AddEditor journalId={id as string} allUsers={allUsers} editors={editors} onEditorAdded={() => {
                            const fetchEditors = async () => {
                                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                                const token = window?.localStorage.getItem("@science.token")
                                const response = await axios.get(`${server}/journals/${id}/editors`, {
                                    headers: { "Authorization": "Bearer " + token }
                                })
                                setEditors(response.data)
                            }
                            fetchEditors()
                        }} />
                    </div>

                    {/* Current Reviewers */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Current Reviewers</h3>
                        {reviewers.length === 0 ? (
                            <p className="text-gray-500 text-sm">No reviewers assigned yet</p>
                        ) : (
                            <div className="space-y-2">
                                {reviewers.map((reviewer) => (
                                    <div key={reviewer.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                        <div>
                                            <p className="font-medium">{reviewer.name}</p>
                                            <p className="text-sm text-gray-600">{reviewer.institution}</p>
                                            <p className="text-xs text-gray-500">{reviewer.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <AddReviewer journalId={id as string} allUsers={allUsers} reviewers={reviewers} onReviewerAdded={() => {
                            const fetchReviewers = async () => {
                                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                                const token = window?.localStorage.getItem("@science.token")
                                const response = await axios.get(`${server}/journals/${id}/reviewers`, {
                                    headers: { "Authorization": "Bearer " + token }
                                })
                                setReviewers(response.data)
                            }
                            fetchReviewers()
                        }} />
                    </div>
                </div>
            )}
        </div>
    )
}

function AddReviewer({ journalId, allUsers, reviewers, onReviewerAdded }: {
    journalId: string
    allUsers: User[]
    reviewers: Reviewer[]
    onReviewerAdded: () => void
}) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const availableUsers = allUsers.filter(user => 
        !reviewers.some(reviewer => reviewer.id === user.id)
    )

    const handleAddReviewer = async () => {
        if (!selectedUser) {
            setError('Please select a user')
            return
        }

        try {
            setLoading(true)
            setError(null)
            const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
            const token = window?.localStorage.getItem("@science.token")

            await axios.post(`${server}/journals/reviewers`, {
                userId: selectedUser.id,
                journalId: journalId
            }, {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })

            setSelectedUser(null)
            onReviewerAdded()
        } catch (err) {
            console.error('Error adding reviewer:', err)
            setError('Error adding reviewer. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-4 p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3">Add New Reviewer</h4>
            <div className="flex flex-col sm:flex-row gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:flex-1 justify-between">
                            {selectedUser ? (
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium truncate">{selectedUser.name}</span>
                                    <span className="text-xs text-gray-500 truncate">{selectedUser.institution}</span>
                                </div>
                            ) : (
                                <span className="text-gray-500">Select a user</span>
                            )}
                            <ChevronDownIcon className="h-4 w-4 flex-shrink-0 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full max-w-[400px] max-h-60 overflow-y-auto">
                        {availableUsers.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 text-sm">
                                All users are already reviewers
                            </div>
                        ) : (
                            availableUsers.map((user) => (
                                <DropdownMenuItem 
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="flex flex-col items-start cursor-pointer p-3"
                                >
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-gray-500">{user.institution}</span>
                                    <span className="text-xs text-gray-400">{user.email}</span>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                    onClick={handleAddReviewer}
                    disabled={loading || !selectedUser}
                    className="w-full sm:w-auto whitespace-nowrap"
                >
                    {loading ? 'Adding...' : 'Add Reviewer'}
                </Button>
            </div>
            {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
        </div>
    )
}

function AddEditor({ journalId, allUsers, editors, onEditorAdded }: {
    journalId: string
    allUsers: User[]
    editors: Editor[]
    onEditorAdded: () => void
}) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const availableUsers = allUsers.filter(user => 
        !editors.some(editor => editor.id === user.id)
    )

    const handleAddEditor = async () => {
        if (!selectedUser) {
            setError('Please select a user')
            return
        }

        try {
            setLoading(true)
            setError(null)
            const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
            const token = window?.localStorage.getItem("@science.token")

            await axios.post(`${server}/journals/editors`, {
                journalId: journalId,
                userId: selectedUser.id
            }, {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })

            setSelectedUser(null)
            onEditorAdded()
        } catch (err) {
            console.error('Error adding editor:', err)
            setError('Error adding editor. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-4 p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3">Add New Editor</h4>
            <div className="flex flex-col sm:flex-row gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:flex-1 justify-between">
                            {selectedUser ? (
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium truncate">{selectedUser.name}</span>
                                    <span className="text-xs text-gray-500 truncate">{selectedUser.institution}</span>
                                </div>
                            ) : (
                                <span className="text-gray-500">Select a user</span>
                            )}
                            <ChevronDownIcon className="h-4 w-4 flex-shrink-0 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full max-w-[400px] max-h-60 overflow-y-auto">
                        {availableUsers.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 text-sm">
                                All users are already editors
                            </div>
                        ) : (
                            availableUsers.map((user) => (
                                <DropdownMenuItem 
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="flex flex-col items-start cursor-pointer p-3"
                                >
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-gray-500">{user.institution}</span>
                                    <span className="text-xs text-gray-400">{user.email}</span>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                    onClick={handleAddEditor}
                    disabled={loading || !selectedUser}
                    className="w-full sm:w-auto whitespace-nowrap"
                >
                    {loading ? 'Adding...' : 'Add Editor'}
                </Button>
            </div>
            {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
        </div>
    )
}

