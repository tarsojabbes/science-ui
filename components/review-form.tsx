'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter, useParams } from "next/navigation"
import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react"

type Review = {
    id: number
    requestDate: string
    status: string
    paperId: number
    requesterId: number
    firstReviewerId: number
    secondReviewerId: number
    assignedDate: string
    completedDate: string
    finalDecision: string
    editorNotes: string
}

type Paper = {
    id: number
    name: string
    journalId: number
    status: string
    publishedDate: string
    submissionDate: string
    url: string
}

type Journal = {
    id: number
    name: string
    issn: string
}

const RECOMMENDATION_OPTIONS = [
    { value: "approve", label: "Approve", description: "Paper is ready for publication" },
    { value: "minor_revision", label: "Minor Revision", description: "Small changes needed before publication" },
    { value: "major_revision", label: "Major Revision", description: "Significant changes required" },
    { value: "reject", label: "Reject", description: "Paper is not suitable for publication" }
]

export function ReviewForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [recommendation, setRecommendation] = useState<string>('')
    const [comments, setComments] = useState('')
    const [overallScore, setOverallScore] = useState<number>(3)
    const [review, setReview] = useState<Review | null>(null)
    const [paper, setPaper] = useState<Paper | null>(null)
    const [journal, setJournal] = useState<Journal | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dataLoading, setDataLoading] = useState(true)
    const router = useRouter()
    const { reviewId } = useParams()

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                setDataLoading(true)
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")

                const reviewResponse = await axios.get(`${server}/reviews/${reviewId}`, {
                    headers: { "Authorization": "Bearer " + token }
                })
                setReview(reviewResponse.data)

                const paperResponse = await axios.get(`${server}/papers/${reviewResponse.data.paperId}`, {
                    headers: { "Authorization": "Bearer " + token }
                })
                setPaper(paperResponse.data)
                const journalResponse = await axios.get(`${server}/journals/${paperResponse.data.journalId}`, {
                    headers: { "Authorization": "Bearer " + token }
                })
                setJournal(journalResponse.data)

            } catch (err) {
                console.error('Erro ao buscar dados do review:', err)
                setError('Erro ao carregar dados do review')
            } finally {
                setDataLoading(false)
            }
        }

        fetchReviewData()
    }, [reviewId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!recommendation) {
            setError('Please select a recommendation')
            return
        }
        
        if (!comments.trim()) {
            setError('Please provide comments')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
            const token = window?.localStorage.getItem("@science.token")

            const reviewData = {
                recommendation,
                comments: comments.trim(),
                overallScore
            }

            await axios.post(`${server}/reviews/${reviewId}/submit`, reviewData, {
                headers: { 
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })

            router.push("/home")
        } catch (err) {
            console.error('Erro ao submeter review:', err)
            setError('Erro ao submeter o review')
        } finally {
            setLoading(false)
        }
    }

    const selectedRecommendation = RECOMMENDATION_OPTIONS.find(opt => opt.value === recommendation)

    if (dataLoading) {
        return (
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Loading review data...</h1>
                <p className="text-gray-500">Please wait while we load the review information.</p>
            </div>
        )
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className={cn("flex flex-col gap-6", className)} 
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Submit Review</h1>
                <p className="text-gray-600">Review ID: #{reviewId}</p>
            </div>

            {/* Paper Information */}
            {paper && journal && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">Paper Information</h3>
                        {paper.url && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(paper.url, '_blank')}
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <ExternalLinkIcon className="h-4 w-4" />
                                View Paper
                            </Button>
                        )}
                    </div>
                    <div className="space-y-1 text-sm">
                        <p><strong>Title:</strong> {paper.name}</p>
                        <p><strong>Journal:</strong> {journal.name}</p>
                        <p><strong>ISSN:</strong> {journal.issn}</p>
                        <p><strong>Submitted:</strong> {new Date(paper.submissionDate).toLocaleDateString()}</p>
                        {paper.url && (
                            <p className="text-xs text-gray-500 mt-2">
                                <strong>URL:</strong> {paper.url}
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            <div className="grid gap-6">
                {/* Recommendation */}
                <div className="grid gap-3">
                    <Label>Recommendation *</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {selectedRecommendation ? (
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{selectedRecommendation.label}</span>
                                        <span className="text-xs text-gray-500">{selectedRecommendation.description}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500">Select a recommendation</span>
                                )}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full min-w-[400px]">
                            {RECOMMENDATION_OPTIONS.map((option) => (
                                <DropdownMenuItem 
                                    key={option.value}
                                    onClick={() => setRecommendation(option.value)}
                                    className="flex flex-col items-start cursor-pointer p-3"
                                >
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-gray-500">{option.description}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Overall Score */}
                <div className="grid gap-3">
                    <Label htmlFor="score">Overall Score: {overallScore}/5</Label>
                    <div className="space-y-2">
                        <input
                            id="score"
                            type="range"
                            min="1"
                            max="5"
                            value={overallScore}
                            onChange={(e) => setOverallScore(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>1 - Poor</span>
                            <span>2 - Fair</span>
                            <span>3 - Good</span>
                            <span>4 - Very Good</span>
                            <span>5 - Excellent</span>
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div className="grid gap-3">
                    <Label htmlFor="comments">Comments *</Label>
                    <textarea
                        id="comments"
                        required
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Provide detailed feedback about the paper..."
                        className="min-h-[120px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    />
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
                    {loading ? 'Submitting Review...' : 'Submit Review'}
                </Button>
            </div>
        </form>
    )
}
