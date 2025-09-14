'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"

type Review = {
    id: number
    paperTitle: string
    status: string
    assignedAt: string
    dueDate: string
}

export default function ReviewsListingView() {
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                const userId = parseInt(window?.localStorage.getItem("@science.id") || "", 10)
                const server = process.env.NEXT_PUBLIC_SERVER_DOMAIN
                const token = window?.localStorage.getItem("@science.token")
                
                const response = await axios.get(`${server}/users/${userId}/reviews`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                })
                setReviews(response.data)
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

    return (
        <div className="h-full w-full p-8 flex-col">
            <h1 className="text-gray-600 text-2xl font-semibold pb-4">
                Your Reviews
            </h1>
            <div className="pb-4">
                {reviews && reviews.length === 0 ? (
                    <p className="text-gray-500">You don't have any reviews assigned yet!</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                <h3 className="font-semibold text-lg">{review.paperTitle}</h3>
                                <p className="text-sm text-gray-500 mt-1">Status: {review.status}</p>
                                <p className="text-xs text-gray-400 mt-1">Assigned: {new Date(review.assignedAt).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400">Due: {new Date(review.dueDate).toLocaleDateString()}</p>
                                <Button size="sm" className="mt-2">Start Review</Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
