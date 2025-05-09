import { ExternalLink, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VideoResult {
  id: string
  title: string
  url: string
  thumbnail: string
  duration: string
  channel: string
  views: string
}

export function VideoCard({ video }: { video: VideoResult }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-48 md:h-32 relative bg-muted">
          {video.thumbnail ? (
            <img
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No thumbnail</div>
          )}
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/70">{video.duration}</Badge>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg line-clamp-2">{video.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">{video.channel}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{video.views}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto" asChild>
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="ml-1">Watch on YouTube</span>
              </a>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
