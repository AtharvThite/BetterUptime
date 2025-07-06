"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Globe,
    TrendingUp,
    Bell,
    Moon,
    Sun,
    RefreshCw,
    Loader2,
    Trash2,
} from "lucide-react"
import { SignedIn, UserButton, useAuth } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useWebsites } from "@/hooks/useWebsites"
import { AddWebsiteModal } from "@/components/addWebsiteModal"
import axios from "axios"
import { API_BACKEND_URL } from "@/config"

// Delete confirmation dialog component
function DeleteWebsiteDialog({
    website,
    open,
    onOpenChange,
    onConfirm,
    loading,
}: {
    website: { id: string; name: string; url: string } | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    loading: boolean
}) {
    if (!website) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Website Monitor</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the monitor for <strong>{website.name}</strong>?
                        <br />
                        <span className="text-sm text-muted-foreground mt-2 block">{website.url}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-4">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-destructive">This action cannot be undone</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                All monitoring data and history for this website will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Monitor
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface UptimeTicksProps {
    ticks: ("up" | "down" | "unknown")[]
    timestamps?: string[]
}

function UptimeTicks({ ticks, timestamps }: UptimeTicksProps) {
    const getTickColor = (status: "up" | "down" | "unknown") => {
        switch (status) {
            case "up":
                return "bg-green-500"
            case "down":
                return "bg-red-500"
            case "unknown":
            default:
                return "bg-gray-400"
        }
    }

    const getTickLabel = (status: "up" | "down" | "unknown") => {
        switch (status) {
            case "up":
                return "Up"
            case "down":
                return "Down"
            case "unknown":
            default:
                return "Unknown"
        }
    }

    return (
        <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground mr-2">Last 30 min:</span>
            <div className="flex space-x-1">
                {ticks.map((status, index) => {
                    const timeAgo =
                        timestamps && timestamps[index]
                            ? formatLastCheck(timestamps[index])
                            : `${30 - index * 3}-${27 - index * 3} min ago`
                    return (
                        <div
                            key={index}
                            className={`w-3 h-6 rounded-sm cursor-help ${getTickColor(status)}`}
                            title={`${timeAgo}: ${getTickLabel(status)}`}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function StatusCircle({ status, size = "md" }: { status: "up" | "down" | "unknown"; size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-6 h-6",
    }

    const getStatusColor = (status: "up" | "down" | "unknown") => {
        switch (status) {
            case "up":
                return "bg-green-500"
            case "down":
                return "bg-red-500"
            case "unknown":
            default:
                return "bg-gray-400"
        }
    }

    const getStatusIcon = (status: "up" | "down" | "unknown") => {
        switch (status) {
            case "up":
                return <CheckCircle className="w-4 h-4 text-white" />
            case "down":
                return <AlertCircle className="w-4 h-4 text-white" />
            case "unknown":
            default:
                return <Clock className="w-4 h-4 text-white" />
        }
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full ${getStatusColor(status)} flex items-center justify-center`}>
            {size === "lg" && getStatusIcon(status)}
        </div>
    )
}

function formatLastCheck(createdAt: string): string {
    const now = new Date()
    const checkTime = new Date(createdAt)
    const diffMs = now.getTime() - checkTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

function extractDomainName(url: string): string {
    try {
        const domain = new URL(url).hostname
        return domain.replace("www.", "")
    } catch {
        return url
    }
}

// Function to map your API status to our three states
function mapTickStatus(status: string): "up" | "down" | "unknown" {
    const statusLower = status.toLowerCase()

    // Map your API statuses
    if (statusLower === "good" || statusLower === "up" || statusLower === "online" || statusLower === "success") {
        return "up"
    } else if (
        statusLower === "bad" ||
        statusLower === "down" ||
        statusLower === "offline" ||
        statusLower === "error" ||
        statusLower === "failed"
    ) {
        return "down"
    } else {
        return "unknown"
    }
}

export default function Dashboard() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const { isSignedIn, isLoaded, getToken } = useAuth()
    const { websites: rawWebsites, loading, error, refreshWebsites } = useWebsites()

    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        website: { id: string; name: string; url: string } | null
        loading: boolean
    }>({
        open: false,
        website: null,
        loading: false,
    })

    // Delete website function
    const handleDeleteWebsite = async () => {
        if (!deleteDialog.website) return

        setDeleteDialog((prev) => ({ ...prev, loading: true }))

        try {
            const token = await getToken()
            if (!token) {
                throw new Error("Authentication required")
            }

            await axios.delete(`${API_BACKEND_URL}/api/v1/website/?websiteId=${deleteDialog.website.id}`, {
                headers: {
                    Authorization: token,
                },
            })

            // Close dialog and refresh data
            setDeleteDialog({ open: false, website: null, loading: false })
            await refreshWebsites()
        } catch (err: any) {
            console.error("Error deleting website:", err)
            // You could add a toast notification here for better UX
            alert(err.response?.data?.message || "Failed to delete website monitor")
            setDeleteDialog((prev) => ({ ...prev, loading: false }))
        }
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    // Wait for everything to load
    if (!mounted || !isLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                    <p>Loading application...</p>
                </div>
            </div>
        )
    }

    // Check authentication
    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
                    <p className="text-muted-foreground mb-6">Please sign in to view your dashboard.</p>
                    <Button asChild>
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">Better UpTime</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                            <p>Loading your monitors...</p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">Better UpTime</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="flex justify-between items-start">
                                <div>
                                    <strong>Error loading monitors:</strong>
                                    <br />
                                    {error}
                                </div>
                                <Button variant="outline" size="sm" onClick={refreshWebsites}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <div className="text-center py-8">
                        <h2 className="text-xl font-semibold mb-4">Try adding a monitor to test the connection</h2>
                        <AddWebsiteModal onWebsiteAdded={refreshWebsites} />
                    </div>
                </main>
            </div>
        )
    }

    const safeWebsites = Array.isArray(rawWebsites) ? rawWebsites : []

    // Show empty state
    if (safeWebsites.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">Better UpTime</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No monitors yet</h2>
                        <p className="text-muted-foreground mb-6">Start monitoring your websites by adding your first monitor.</p>
                        <AddWebsiteModal onWebsiteAdded={refreshWebsites} />
                    </div>
                </main>
            </div>
        )
    }

    // Process websites data with correct mapping
    const websites = safeWebsites.map((website) => {
        const ticks = Array.isArray(website.ticks) ? website.ticks : []
        const recentTicks = ticks
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10)

        // Map tick statuses using your API format
        const uptimeTicks: ("up" | "down" | "unknown")[] =
            recentTicks.length > 0
                ? recentTicks.map((tick) => mapTickStatus(tick.status))
                : Array(10).fill("unknown" as const)

        // Pad with unknown if we have fewer than 10 ticks
        while (uptimeTicks.length < 10) {
            uptimeTicks.unshift("unknown")
        }

        // Determine current status from most recent tick
        const currentStatus: "up" | "down" | "unknown" =
            recentTicks.length > 0 ? mapTickStatus(recentTicks[0].status) : "unknown"

        // Calculate uptime percentage (excluding unknown states)
        const knownTicks = uptimeTicks.filter((tick) => tick !== "unknown")
        const upTicks = uptimeTicks.filter((tick) => tick === "up").length
        const uptimePercentage = knownTicks.length > 0 ? (upTicks / knownTicks.length) * 100 : 0

        // Calculate average response time using correct field name
        const avgResponseTime =
            recentTicks.length > 0
                ? Math.round(recentTicks.reduce((sum, tick) => sum + (tick.latency || 0), 0) / recentTicks.length)
                : 0

        const incidents = uptimeTicks.filter((tick) => tick === "down").length
        const lastCheck = recentTicks.length > 0 ? formatLastCheck(recentTicks[0].createdAt) : "Never"

        return {
            id: website.id,
            name: extractDomainName(website.url),
            url: website.url,
            status: currentStatus,
            uptime: Math.round(uptimePercentage * 10) / 10,
            responseTime: avgResponseTime,
            lastCheck,
            uptimeTicks,
            incidents,
            rawTicks: recentTicks,
        }
    })

    const upSites = websites.filter((site) => site.status === "up").length
    const downSites = websites.filter((site) => site.status === "down").length
    const unknownSites = websites.filter((site) => site.status === "unknown").length
    const totalIncidents = websites.reduce((sum, site) => sum + site.incidents, 0)
    const avgUptime = websites.length > 0 ? websites.reduce((sum, site) => sum + site.uptime, 0) / websites.length : 0

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">Better UpTime</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">

                {/* Page Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Monitor your websites and services</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={refreshWebsites}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <AddWebsiteModal onWebsiteAdded={refreshWebsites} />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{websites.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {upSites} up, {downSites} down{unknownSites > 0 && `, ${unknownSites} unknown`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">Last 30 minutes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{downSites}</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalIncidents}</div>
                            <p className="text-xs text-muted-foreground">Recent period</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Monitors List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Monitors ({websites.length})</CardTitle>
                        <CardDescription>Click on a monitor to view detailed uptime information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {websites.map((website) => (
                                <AccordionItem key={website.id} value={website.id}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full mr-4">
                                            <div className="flex items-center space-x-4">
                                                <StatusCircle status={website.status as "up" | "down" | "unknown"} size="lg" />
                                                <div className="text-left">
                                                    <div className="font-semibold">{website.name}</div>
                                                    <div className="text-sm text-muted-foreground">{website.url}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Badge
                                                    variant={
                                                        website.status === "up"
                                                            ? "default"
                                                            : website.status === "down"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {website.status === "up" ? "Online" : website.status === "down" ? "Offline" : "Unknown"}
                                                </Badge>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">{website.uptime}%</div>
                                                    <div className="text-xs text-muted-foreground">uptime</div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="pt-4 space-y-6">
                                            <div className="bg-muted/50 rounded-lg p-4">
                                                <h4 className="font-semibold mb-3">Uptime History</h4>
                                                <UptimeTicks
                                                    ticks={website.uptimeTicks}
                                                    timestamps={website.rawTicks.map((tick) => tick.createdAt)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-muted/50 rounded-lg p-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <StatusCircle status={website.status as "up" | "down" | "unknown"} />
                                                        <span className="font-medium">Current Status</span>
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {website.status === "up" ? "Online" : website.status === "down" ? "Offline" : "Unknown"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Last checked {website.lastCheck}</p>
                                                </div>

                                                <div className="bg-muted/50 rounded-lg p-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="font-medium">Response Time</span>
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {website.responseTime > 0 ? `${website.responseTime}ms` : "N/A"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Average response</p>
                                                </div>

                                                <div className="bg-muted/50 rounded-lg p-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span className="font-medium">Incidents</span>
                                                    </div>
                                                    <p className="text-2xl font-bold">{website.incidents}</p>
                                                    <p className="text-sm text-muted-foreground">Recent period</p>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2 pt-2">
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Edit Monitor
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Test Now
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                                                    onClick={() =>
                                                        setDeleteDialog({
                                                            open: true,
                                                            website: {
                                                                id: website.id,
                                                                name: website.name,
                                                                url: website.url,
                                                            },
                                                            loading: false,
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <DeleteWebsiteDialog
                    website={deleteDialog.website}
                    open={deleteDialog.open}
                    onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
                    onConfirm={handleDeleteWebsite}
                    loading={deleteDialog.loading}
                />
            </main>
        </div>
    )
}
