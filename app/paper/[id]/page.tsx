'use client'
import { Button } from "@/components/ui/button"
import axios from "axios"
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

type ReviewResult = {
    id: number
    firstReviewerNote: string
    secondReviewerNote: string
    resultDate: string
    approval: boolean
    reviewId: number
    reviewerId: number
    recommendation: string
    comments: string
    overallScore: number
    isSubmitted: boolean
}

export default function PaperPage() {
    const { id } = useParams()
    const [paper, setPaper] = useState<Paper>()
    const [journal, setJournal] = useState<Journal>()
    const [reviews, setReviews] = useState<Review[]>([])
    const [reviewResults, setReviewResults] = useState<{ [key: number]: ReviewResult[] }>({})
    const [loading, setLoading] = useState(true)
    const [requestingReview, setRequestingReview] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const router = useRouter()
    
    const goBackHome = () => {
        router.push("/home")
    }

    const requestReview = async () => {
        try {
            setRequestingReview(true)
            const token = window?.localStorage.getItem("@science.token")
            const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN

            await axios.post(`${server}/reviews/request`, {
                paperId: parseInt(id as string)
            }, {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })

            const reviewsResponse = await axios.get(`${server}/reviews/paper/${id}`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            setReviews(reviewsResponse.data)

            setNotification({ type: 'success', message: 'Review request submitted successfully!' })
            // Auto-hide notification after 5 seconds
            setTimeout(() => setNotification(null), 5000)
        } catch (error) {
            console.error('Error requesting review:', error)
            setNotification({ type: 'error', message: 'Error requesting review. Please try again.' })
            // Auto-hide notification after 5 seconds
            setTimeout(() => setNotification(null), 5000)
        } finally {
            setRequestingReview(false)
        }
    }

    useEffect(() => {
        const fetchPaperData = async () => {
            try {
                setLoading(true)
                const token = window?.localStorage.getItem("@science.token")
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN

                const paperResponse = await axios.get(`${server}/papers/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                setPaper(paperResponse.data)

                if (paperResponse.data.journalId) {
                    const journalResponse = await axios.get(`${server}/journals/${paperResponse.data.journalId}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    })
                    setJournal(journalResponse.data)
                }

                const reviewsResponse = await axios.get(`${server}/reviews/paper/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                setReviews(reviewsResponse.data)
                const resultsPromises = reviewsResponse.data.map(async (review: Review) => {
                    try {
                        const resultResponse = await axios.get(`${server}/review-results/review/${review.id}`, {
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        })
                        return { reviewId: review.id, results: resultResponse.data }
                    } catch (error) {
                        console.error(`Error fetching results for review ${review.id}:`, error)
                        return { reviewId: review.id, results: [] }
                    }
                })

                const results = await Promise.all(resultsPromises)
                const resultsMap: { [key: number]: ReviewResult[] } = {}
                results.forEach(({ reviewId, results }) => {
                    resultsMap[reviewId] = results
                })
                setReviewResults(resultsMap)

            } catch (error) {
                console.error('Error fetching paper data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPaperData()
    }, [id])
    if (loading) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <div className="pb-4 w-1/4">
                    <Button variant="outline" size="sm" onClick={goBackHome} className="cursor-pointer">
                        <ChevronLeftIcon /> Go back
                    </Button>
                </div>
                <p className="text-gray-500">Loading paper data...</p>
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
            
            {/* Notification Banner */}
            {notification && (
                <div className={`mb-4 p-4 rounded-lg border-l-4 ${
                    notification.type === 'success' 
                        ? 'bg-green-50 border-green-400 text-green-800' 
                        : 'bg-red-50 border-red-400 text-red-800'
                }`}>
                    <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.message}</p>
                        <button 
                            onClick={() => setNotification(null)}
                            className="ml-4 text-sm underline hover:no-underline"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            
            <h1 className="text-gray-700 text-2xl font-semibold pb-4 pt-4">{paper?.name}</h1>
            <div className="flex items-center gap-4 pb-4">
                <Button className="cursor-pointer" variant={"secondary"}>
                    Status: {paper?.status.toUpperCase()}
                </Button>
                {paper?.url && (
                    <Button
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
            <div className="py-4">
                <p className="text-gray-600">
                    Submitted on {new Date(paper?.submissionDate || '').toLocaleDateString()} to{' '}
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

            <h2 className="text-gray-600 text-xl font-semibold">Reviews</h2>
            <div className="pb-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews found for this paper.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">Review</h3>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        review.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {review.status.toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p><strong>Request Date:</strong> {new Date(review.requestDate).toLocaleDateString()}</p>
                                        <p><strong>Assigned Date:</strong> {new Date(review.assignedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {review.finalDecision && (
                                    <div className="mb-4">
                                        <p><strong>Final Decision:</strong> 
                                            <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                                review.finalDecision === 'approved' ? 'bg-green-100 text-green-800' :
                                                review.finalDecision === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {review.finalDecision.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {review.editorNotes && (
                                    <div className="mb-4">
                                        <p><strong>Editor Notes:</strong></p>
                                        <p className="text-gray-600 italic">{review.editorNotes}</p>
                                    </div>
                                )}

                                {reviewResults[review.id] && reviewResults[review.id].length > 0 && reviewResults[review.id].some(result => result.isSubmitted === true) && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Review Results:</h4>
                                        <div className="space-y-3">
                                            {reviewResults[review.id].map((result) => (
                                                <div key={result.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                                                    <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                                                        <div>
                                                            <p><strong>Overall Score:</strong> {result.isSubmitted ? `${result.overallScore}/5` : 'Not Submitted'}</p>
                                                        </div>
                                                        <div>
                                                            <p><strong>Recommendation:</strong> 
                                                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                                                    result.recommendation === 'approve' ? 'bg-green-100 text-green-800' :
                                                                    result.recommendation === 'reject' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {result.recommendation.toUpperCase()}
                                                                </span>
                                                            </p>
                                                            <p><strong>Submitted:</strong> {result.isSubmitted ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {result.firstReviewerNote && (
                                                        <div className="mb-2">
                                                            <p><strong>First Reviewer Note:</strong></p>
                                                            <p className="text-gray-600 text-sm">{result.firstReviewerNote}</p>
                                                        </div>
                                                    )}
                                                    
                                                    {result.secondReviewerNote && (
                                                        <div className="mb-2">
                                                            <p><strong>Second Reviewer Note:</strong></p>
                                                            <p className="text-gray-600 text-sm">{result.secondReviewerNote}</p>
                                                        </div>
                                                    )}
                                                    
                                                    {result.comments && (
                                                        <div>
                                                            <p><strong>Comments:</strong></p>
                                                            <p className="text-gray-600 text-sm">{result.comments}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Button 
                    onClick={requestReview} 
                    disabled={requestingReview}
                    className="cursor-pointer"
                    variant="outline"
                >
                    {requestingReview ? 'Requesting...' : 'Request Review Round'}
            </Button>
        </div>
    )
}