import { VideoCard } from "@/components/video-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoResult {
  id: string
  title: string
  url: string
  thumbnail: string
  duration: string
  channel: string
  views: string
}

interface SearchResultsProps {
  results: VideoResult[]
  loading: boolean
  error: string
  query: string
}

export function SearchResults({ results, loading, error, query }: SearchResultsProps) {
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="h-48 md:h-32 w-full md:w-48" />
              <div className="flex-1 p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-2">
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="h-8 w-full sm:w-32" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground">We couldn't find any videos matching "{query}"</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
