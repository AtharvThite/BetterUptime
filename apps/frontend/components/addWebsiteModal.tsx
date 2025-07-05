"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { API_BACKEND_URL } from "@/config"
import { useWebsites } from "@/hooks/useWebsites"

interface AddWebsiteModalProps {
    onWebsiteAdded: () => void
}

export function AddWebsiteModal({ onWebsiteAdded }: AddWebsiteModalProps) {
    const { getToken } = useAuth()
    const {refreshWebsites} = useWebsites();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [url, setUrl] = useState("")

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // Validation
        if (!url.trim()) {
            setError("Website URL is required")
            setLoading(false)
            return
        }

        if (!validateUrl(url)) {
            setError("Please enter a valid URL (including http:// or https://)")
            setLoading(false)
            return
        }

        try {
            const token = await getToken()
            if (!token) {
                setError("Authentication required")
                setLoading(false)
                return
            }

            await axios.post(`${API_BACKEND_URL}/api/v1/website`, {
                url, 
            }, {
                headers: {
                    Authorization: token,
                },
            }).then(() => {
                refreshWebsites();
            });

            setSuccess(true)
            setTimeout(() => {
                setOpen(false)
                setSuccess(false)
                resetForm()
                onWebsiteAdded()
            }, 1500)
        } catch (err: any) {
            console.error("Error adding website:", err)
            setError(err.response?.data?.message || "Failed to add website monitor")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setUrl("")
        setError(null)
        setSuccess(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            resetForm()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Monitor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Website Monitor</DialogTitle>
                    <DialogDescription>
                        Enter the URL of the website you want to monitor. We'll start checking it immediately.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Website Added Successfully!</h3>
                            <p className="text-muted-foreground">Your website monitor has been created and monitoring has started.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="url">Website URL</Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                                required
                                autoFocus
                            />
                            <p className="text-sm text-muted-foreground">Include the full URL with http:// or https://</p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Adding Monitor...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Monitor
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
