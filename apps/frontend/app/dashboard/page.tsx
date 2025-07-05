"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    SignedIn,
    UserButton,
} from "@clerk/nextjs"
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Globe,
    Plus,
    Settings,
    TrendingUp,
    User,
    Bell,
    Moon,
    Sun,
    RefreshCw,
    Loader2,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useWebsites } from "@/hooks/useWebsites"

interface UptimeTicksProps {
    ticks: boolean[]
    timestamps?: string[]
}

function UptimeTicks({ ticks, timestamps }: UptimeTicksProps) {
    return (
        <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground mr-2">Last 30 min:</span>
            <div className="flex space-x-1">
                {ticks.map((isUp, index) => {
                    const timeAgo =
                        timestamps && timestamps[index]
                            ? formatLastCheck(timestamps[index])
                            : `${30 - index * 3}-${27 - index * 3} minutes ago`
                    return (
                        <div
                            key={index}
                            className={`w-3 h-6 rounded-sm cursor-help ${isUp ? "bg-green-500" : "bg-red-500"}`}
                            title={`${timeAgo}: ${isUp ? "Up" : "Down"}`}
                        />
                    )
                })}
            </div>
        </div>
    )
}

interface StatusCircleProps {
    status: "up" | "down"
    size?: "sm" | "md" | "lg"
}

function StatusCircle({ status, size = "md" }: StatusCircleProps) {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-6 h-6",
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-full ${status === "up" ? "bg-green-500" : "bg-red-500"
                } flex items-center justify-center`}
        >
            {size === "lg" &&
                (status === "up" ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                    <AlertCircle className="w-4 h-4 text-white" />
                ))}
        </div>
    )
}

// Helper function to format last check time
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

// Helper function to extract domain name from URL
function extractDomainName(url: string): string {
    try {
        const domain = new URL(url).hostname
        return domain.replace("www.", "")
    } catch {
        return url
    }
}

export default function Dashboard() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const { websites: rawWebsites, loading, error, refreshWebsites } = useWebsites()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Show loading state
    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                    <p>Loading dashboard...</p>
                </div>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-2">
                                <Activity className="h-8 w-8 text-primary" />
                                <span className="text-2xl font-bold">Better UpTime</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>{error}</span>
                            <Button variant="outline" size="sm" onClick={refreshWebsites}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </main>
            </div>
        )
    }

    // Ensure rawWebsites is always an array
    const safeWebsites = Array.isArray(rawWebsites) ? rawWebsites : []

    // Transform raw website data to match UI expectations
    const websites = safeWebsites.map((website) => {
        // Ensure ticks is always an array
        const ticks = Array.isArray(website.ticks) ? website.ticks : []

        // Get last 10 ticks (30 minutes worth)
        const recentTicks = ticks
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10)

        // Create uptimeTicks array (true for up, false for down)
        const uptimeTicks = recentTicks.map(
            (tick) => tick.status === "up" || tick.status === "online" || tick.status === "success",
        )

        // Pad with true if we have fewer than 10 ticks
        while (uptimeTicks.length < 10) {
            uptimeTicks.unshift(true)
        }

        // Calculate overall status from most recent tick
        const currentStatus =
            recentTicks.length > 0
                ? recentTicks[0].status === "up" || recentTicks[0].status === "online" || recentTicks[0].status === "success"
                    ? "up"
                    : "down"
                : "up"

        // Calculate uptime percentage from recent ticks
        const upTicks = uptimeTicks.filter(Boolean).length
        const uptimePercentage = uptimeTicks.length > 0 ? (upTicks / uptimeTicks.length) * 100 : 100

        // Get average response time from recent ticks
        const avgResponseTime =
            recentTicks.length > 0
                ? Math.round(recentTicks.reduce((sum, tick) => sum + (tick.latencyy || 0), 0) / recentTicks.length)
                : 0

        // Count incidents (down ticks)
        const incidents = uptimeTicks.filter((tick) => !tick).length

        // Get last check time
        const lastCheck = recentTicks.length > 0 ? formatLastCheck(recentTicks[0].createdAt) : "Never"

        return {
            id: website.id,
            name: extractDomainName(website.url),
            url: website.url,
            status: currentStatus,
            uptime: Math.round(uptimePercentage * 10) / 10, // Round to 1 decimal
            responseTime: avgResponseTime,
            lastCheck,
            uptimeTicks,
            incidents,
            rawTicks: recentTicks,
        }
    })

    // Show empty state if no websites
    if (websites.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-2">
                                <Activity className="h-8 w-8 text-primary" />
                                <span className="text-2xl font-bold">Better UpTime</span>
                            </div>

                            <nav className="hidden md:flex items-center space-x-8">
                                <Link href="/dashboard" className="text-foreground font-medium">
                                    Dashboard
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Monitors
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Status Pages
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Incidents
                                </Link>
                            </nav>

                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Settings className="h-5 w-5" />
                                </Button>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No monitors yet</h2>
                        <p className="text-muted-foreground mb-6">Start monitoring your websites by adding your first monitor.</p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Monitor
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    const upSites = websites.filter((site) => site.status === "up").length
    const downSites = websites.filter((site) => site.status === "down").length
    const totalIncidents = websites.reduce((sum, site) => sum + site.incidents, 0)
    const avgUptime = websites.length > 0 ? websites.reduce((sum, site) => sum + site.uptime, 0) / websites.length : 0

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">Better UpTime</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/dashboard" className="text-foreground font-medium">
                                Dashboard
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Monitors
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Status Pages
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Incidents
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5" />
                            </Button>
                            <Avatar>
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Monitor
                        </Button>
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
                                {upSites} up, {downSites} down
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
                        <CardTitle>Your Monitors</CardTitle>
                        <CardDescription>Click on any monitor to view detailed uptime information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {websites.map((website) => (
                                <AccordionItem key={website.id} value={website.id}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full mr-4">
                                            <div className="flex items-center space-x-4">
                                                <StatusCircle status={website.status as "up" | "down"} size="lg" />
                                                <div className="text-left">
                                                    <div className="font-semibold">{website.name}</div>
                                                    <div className="text-sm text-muted-foreground">{website.url}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Badge variant={website.status === "up" ? "default" : "destructive"}>
                                                    {website.status === "up" ? "Online" : "Offline"}
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
                                            {/* Uptime Visualization */}
                                            <div className="bg-muted/50 rounded-lg p-4">
                                                <h4 className="font-semibold mb-3">Uptime History</h4>
                                                <UptimeTicks
                                                    ticks={website.uptimeTicks}
                                                    timestamps={website.rawTicks.map((tick) => tick.createdAt)}
                                                />
                                            </div>

                                            {/* Detailed Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-muted/50 rounded-lg p-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <StatusCircle status={website.status as "up" | "down"} />
                                                        <span className="font-medium">Current Status</span>
                                                    </div>
                                                    <p className="text-2xl font-bold">{website.status === "up" ? "Online" : "Offline"}</p>
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

                                            {/* Action Buttons */}
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
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
