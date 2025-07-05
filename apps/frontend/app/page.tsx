"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Activity,
    BarChart3,
    Bell,
    CheckCircle,
    Globe,
    Mail,
    Shield,
    Users,
    Zap,
} from "lucide-react"
import { SignUpButton } from "@clerk/nextjs"
import Link from "next/link"
import { Appbar } from "@/components/Appbar"

export default function LandingPage() {
    const [mounted, setMounted] = useState(false)
    const router = useRouter();

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const features = [
        {
            icon: Activity,
            title: "Real-time Monitoring",
            description:
                "Monitor your websites, APIs, and services 24/7 with sub-minute checks from multiple global locations.",
        },
        {
            icon: Bell,
            title: "Instant Alerts",
            description: "Get notified immediately via email, SMS, Slack, or webhook when your services go down.",
        },
        {
            icon: BarChart3,
            title: "Detailed Analytics",
            description: "Comprehensive uptime reports, response time analytics, and performance insights.",
        },
        {
            icon: Globe,
            title: "Global Monitoring",
            description: "Monitor from 15+ locations worldwide to ensure your site is accessible everywhere.",
        },
        {
            icon: Shield,
            title: "SSL Monitoring",
            description: "Track SSL certificate expiration and get alerts before certificates expire.",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Share status pages, collaborate on incidents, and keep your team informed.",
        },
    ]

    const pricingPlans = [
        {
            name: "Starter",
            price: "$9",
            period: "/month",
            description: "Perfect for small websites and personal projects",
            features: ["Up to 10 monitors", "1-minute checks", "Email alerts", "30-day data retention", "Basic status page"],
            popular: false,
        },
        {
            name: "Professional",
            price: "$29",
            period: "/month",
            description: "Ideal for growing businesses and teams",
            features: [
                "Up to 50 monitors",
                "30-second checks",
                "SMS + Email alerts",
                "1-year data retention",
                "Custom status page",
                "API access",
                "Team collaboration",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "/month",
            description: "For large organizations with complex needs",
            features: [
                "Unlimited monitors",
                "10-second checks",
                "All alert channels",
                "Unlimited data retention",
                "White-label status pages",
                "Priority support",
                "Custom integrations",
            ],
            popular: false,
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Appbar></Appbar>
            {/* Hero Section */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge variant="secondary" className="mb-4">
                            <Zap className="h-4 w-4 mr-1" />
                            99.9% Uptime Guaranteed
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Never Miss a Downtime
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Monitor your websites, APIs, and services with our powerful uptime monitoring platform. Get instant alerts and detailed analytics to keep your business running smoothly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <div className="flex items-center space-x-2">
                                <Button onClick={() => router.push("/dashboard")} size="lg">Start Monitoring <Activity className="h-6 w-6" /></Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99.9%</div>
                            <div className="text-muted-foreground">Uptime SLA</div>
                        </div>
                        <div>
                            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{"<30s"}</div>
                            <div className="text-muted-foreground">Alert Speed</div>
                        </div>
                        <div>
                            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">15+</div>
                            <div className="text-muted-foreground">Global Locations</div>
                        </div>
                        <div>
                            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">10k+</div>
                            <div className="text-muted-foreground">Happy Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Monitor Your Services</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive monitoring tools to keep your websites and APIs running smoothly
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-0 shadow-lg">
                                <CardHeader>
                                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose the plan that fits your monitoring needs. All plans include our core features.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="flex items-baseline justify-center space-x-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                        Start Free Trial
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary rounded-2xl p-8 lg:p-16 text-center text-primary-foreground">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Monitor Your Uptime?</h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Join thousands of businesses that trust Better UpTime to keep their services running smoothly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <SignUpButton>
                                <Button size="lg" variant="secondary" className="text-primary">
                                    Start Free Trial
                                </Button>
                            </SignUpButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Activity className="h-6 w-6 text-primary" />
                                <span className="text-xl font-bold">Better UpTime</span>
                            </div>
                            <p className="text-muted-foreground">Professional uptime monitoring for websites, APIs, and services.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Status Page
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        API
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        System Status
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-muted-foreground">© {new Date().getFullYear()} Better UpTime. All rights reserved.</p>
                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
