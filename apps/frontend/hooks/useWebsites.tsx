"use client"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_BACKEND_URL } from "@/config"

interface Website {
    id: string
    url: string
    ticks: {
        id: string
        createdAt: string
        status: string
        latencyy: number
    }[]
}

interface UseWebsitesReturn {
    websites: Website[]
    loading: boolean
    error: string | null
    refreshWebsites: () => Promise<void>
}

export function useWebsites(): UseWebsitesReturn {
    const { getToken, isLoaded } = useAuth()
    const [websites, setWebsites] = useState<Website[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function refreshWebsites() {
        if (!isLoaded) return

        try {
            setError(null)
            const token = await getToken()

            if (!token) {
                setError("Authentication required")
                setLoading(false)
                return
            }

            const res = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setWebsites(res.data.websites || [])
        } 
        catch (err: any) {
            console.error("Error fetching websites:", err)
            setError(err.response?.data?.message || "Failed to fetch websites")
            setWebsites([]) // Ensure we always have an array
        } 
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoaded) {
            refreshWebsites()
            const interval = setInterval(
                () => {
                    refreshWebsites()
                },
                1000 * 60 * 1,
            ) // 1 minute
            return () => clearInterval(interval)
        }
    }, [isLoaded])

    return {
        websites,
        loading,
        error,
        refreshWebsites,
    }
}
