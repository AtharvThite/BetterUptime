"use client"

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import {
    Activity,
    Menu,
    Moon,
    Sun,
    X,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState } from "react"

export function Appbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">Better UpTime</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Documentation
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Support
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div>
                            <Button variant="outline" size="icon" onClick={toggleTheme}>
                                <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
                                <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </div>

                        {/* Auth Buttons - Desktop */}
                        <div className="hidden md:flex items-center space-x-2">
                            <SignedOut>
                                <SignInButton>
                                    <Button variant="ghost">Sign In</Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button variant="ghost">Sign Up</Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            aria-label="Toggle mobile menu"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col space-y-4">
                            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                                Features
                            </Link>
                            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                                Pricing
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Documentation
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                Support
                            </Link>

                            {/* Auth Buttons - Mobile */}
                            <SignedOut>
                                <SignInButton>
                                    <Button className="w-full">Sign In</Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button className="w-full">Sign Up</Button>
                                </SignUpButton>
                            </SignedOut>

                            <SignedIn>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <UserButton />
                                </div>
                            </SignedIn>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
