'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"
import { ChevronRightIcon } from "lucide-react"

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
}

type Journal = {
    id: number
    name: string
    issn: string
}

type ReviewWithDetails = Review & {
    paper?: Paper
    journal?: Journal
}

export default function ReviewsListingView() {
    const router = useRouter()
    const [pendingReviews, setPendingReviews] = useState<ReviewWithDetails[]>([])
    const [allReviews, setAllReviews] = useState<ReviewWithDetails[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")
                
                const pendingResponse = await axios.get(`${server}/reviews/pending`, {
                    headers: {  
                        "Authorization": "Bearer " + token
                    },
                })
                const pendingReviewsData = pendingResponse.data

                const allReviewsResponse = await axios.get(`${server}/reviews/my-reviews`, {
                    headers: {  
                        "Authorization": "Bearer " + token
                    },
                })
                const allReviewsData = allReviewsResponse.data

                const userId = parseInt(window?.localStorage.getItem("@science.id") || "", 10)
                
                const submittedReviewIds = new Set<number>()
                for (const review of pendingReviewsData) {
                    try {
                        const reviewDetailResponse = await axios.get(`${server}/reviews/${review.id}`, {
                            headers: { "Authorization": "Bearer " + token }
                        })
                        
                        const reviewResultsResponse = await axios.get(`${server}/review-results/review/${review.id}`, {
                            headers: { "Authorization": "Bearer " + token }
                        })
                        
                        const userResult = reviewResultsResponse.data.find((result: any) => 
                            result.reviewerId === userId && result.isSubmitted
                        )
                        
                        if (userResult) {
                            submittedReviewIds.add(review.id)
                        }
                    } catch (error) {
                        console.error(`Error checking review ${review.id}:`, error)
                    }
                }
                const allPaperIds = [...new Set([
                    ...pendingReviewsData.map((review: Review) => review.paperId),
                    ...allReviewsData.map((review: Review) => review.paperId)
                ])]

                const papersMap: { [key: number]: Paper } = {}
                const papersPromises = allPaperIds.map(async (paperId: number) => {
                    try {
                        const paperResponse = await axios.get(`${server}/papers/${paperId}`, {
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        })
                        papersMap[paperId] = paperResponse.data
                    } catch (error) {
                        console.error(`Error fetching paper ${paperId}:`, error)
                    }
                })
                await Promise.all(papersPromises)

                const journalIds = [...new Set(Object.values(papersMap).map(paper => paper.journalId))]
                
                const journalsMap: { [key: number]: Journal } = {}
                const journalsPromises = journalIds.map(async (journalId: number) => {
                    try {
                        const journalResponse = await axios.get(`${server}/journals/${journalId}`, {
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        })
                        journalsMap[journalId] = journalResponse.data
                    } catch (error) {
                        console.error(`Error fetching journal ${journalId}:`, error)
                    }
                })
                await Promise.all(journalsPromises)

                const enrichReviews = (reviews: Review[]): ReviewWithDetails[] => {
                    return reviews.map(review => ({
                        ...review,
                        paper: papersMap[review.paperId],
                        journal: papersMap[review.paperId] ? journalsMap[papersMap[review.paperId].journalId] : undefined
                    }))
                }

                const actualPendingReviews = pendingReviewsData.filter((review: Review) => 
                    !submittedReviewIds.has(review.id)
                )
                const pendingIds = new Set(actualPendingReviews.map((review: Review) => review.id))
                const nonPendingReviews = allReviewsData.filter((review: Review) => !pendingIds.has(review.id))

                setPendingReviews(enrichReviews(actualPendingReviews))
                setAllReviews(enrichReviews(nonPendingReviews))
                setError(null)
            } catch (err) {
                setError('Error loading reviews')
                console.error('Erro ao buscar reviews:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    if (loading) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                    Your Reviews
                </h1>
                <div className="pb-4">
                    <p className="text-gray-500">Loading reviews...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-full w-full p-8 flex-col">
                <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                    Your Reviews
                </h1>
                <div className="pb-4">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        )
    }

    const renderReviewCard = (review: ReviewWithDetails, isPending: boolean = false) => (
        <div key={review.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{review.paper?.name || `Paper #${review.paperId}`}</h3>
                    <p className="text-sm text-gray-600">{review.journal?.name || 'Unknown Journal'}</p>
                </div>
                
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                    <p><strong>Assigned Date:</strong> {new Date(review.assignedDate).toLocaleDateString()}</p>
                </div>
                <div>
                    {review.finalDecision && (
                        <p><strong>Decision:</strong> 
                            <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                                review.finalDecision === 'approved' ? 'bg-green-100 text-green-800' :
                                review.finalDecision === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {review.finalDecision.toUpperCase()}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            {isPending ? (
                <Button 
                    size="sm" 
                    className="cursor-pointer"
                    onClick={() => router.push(`/submit-review/${review.id}`)}
                >
                    Start Review <ChevronRightIcon />
                </Button>
            ) : (
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => router.push(`/paper/${review.paperId}`)}
                >
                    View Paper <ChevronRightIcon />
                </Button>
            )}
        </div>
    )

    return (
        <div className="h-full w-full p-8 flex-col">
            <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                Your Reviews
            </h1>
            
            <div className="pb-6">
                <h2 className="text-gray-700 text-lg font-semibold pb-3">Pending Reviews</h2>
                {pendingReviews.length === 0 ? (
                    <p className="text-gray-500">You don't have any pending reviews!</p>
                ) : (
                    <div className="space-y-4">
                        {pendingReviews.map((review) => renderReviewCard(review, true))}
                    </div>
                )}
            </div>

            {/* All Reviews Section */}
            <div className="pb-4">
                <h2 className="text-gray-700 text-lg font-semibold pb-3">All Reviews</h2>
                {allReviews.length === 0 ? (
                    <p className="text-gray-500">You haven't completed any reviews yet!</p>
                ) : (
                    <div className="space-y-4">
                        {allReviews.map((review) => renderReviewCard(review, false))}
                    </div>
                )}
            </div>
        </div>
    )
}
