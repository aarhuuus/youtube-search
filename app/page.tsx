"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/search-bar"
import { SearchResults } from "@/components/search-results"
import { YoutubeIcon } from "lucide-react"

interface VideoResult {
  id: string
  title: string
  url: string
  thumbnail: string
  duration: string
  channel: string
  views: string
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<VideoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setLoading(true)
    setError("")
    setResults([])

    try {
      console.log("Fetching results for:", searchQuery)
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error:", response.status, errorData)
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received data:", data)

      if (!data || !Array.isArray(data.results)) {
        console.error("Invalid data structure:", data)
        throw new Error("Invalid data received from server")
      }

      setResults(data.results)
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch results. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <YoutubeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            <h1 className="text-lg sm:text-xl font-semibold">YouTube Search</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="py-8 sm:py-12 bg-muted/40">
          <div className="container flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6">
              Find the perfect YouTube video
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-[600px] mb-6 sm:mb-8">
              Search through millions of videos with our fast and responsive search tool.
            </p>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </section>

        <section className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <SearchResults results={results} loading={loading} error={error} query={query} />
        </section>
      </main>

      <footer className="border-t py-4 sm:py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-2 sm:gap-4 md:h-16 md:flex-row px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} YouTube Search. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Not affiliated with YouTube</p>
        </div>
      </footer>
    </div>
  )
}
