import { NextResponse } from "next/server"

// YouTube search results interface
interface YouTubeSearchResult {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
    }
    description: string
  }
}

export async function GET(request: Request) {
  try {
    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Missing search query", results: [] }, { status: 400 })
    }

    console.log(`Searching for: ${query}`)

    // Use a simple approach to get YouTube search results
    // This uses YouTube's search page and extracts JSON data
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`

    const response = await fetch(searchUrl)
    const html = await response.text()

    // Extract the initial data from the YouTube page
    const videos = extractVideosFromHTML(html)

    console.log(`Found ${videos.length} results`)

    // Return the results
    return NextResponse.json({ results: videos })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      {
        error: "Failed to search videos",
        message: error instanceof Error ? error.message : "Unknown error",
        results: [],
      },
      { status: 500 },
    )
  }
}

function extractVideosFromHTML(html: string) {
  try {
    // YouTube stores its initial data in a variable called ytInitialData
    const ytInitialDataMatch = html.match(/var ytInitialData = (.+?);<\/script>/)

    if (!ytInitialDataMatch || !ytInitialDataMatch[1]) {
      console.error("Could not find ytInitialData in the HTML")
      return []
    }

    // Parse the JSON data
    const ytInitialData = JSON.parse(ytInitialDataMatch[1])

    // Navigate through the complex YouTube data structure to find videos
    const contents =
      ytInitialData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || []

    // Find the item list renderer which contains the videos
    const itemSectionRenderer = contents.find((content: any) =>
      content.itemSectionRenderer?.contents?.some((item: any) => item.videoRenderer),
    )

    if (!itemSectionRenderer) {
      console.error("Could not find itemSectionRenderer in the data")
      return []
    }

    // Extract video data
    const videoItems = itemSectionRenderer.itemSectionRenderer.contents.filter((item: any) => item.videoRenderer)

    // Map the video data to our format
    return videoItems.slice(0, 10).map((item: any) => {
      const videoRenderer = item.videoRenderer
      const videoId = videoRenderer.videoId
      const title = videoRenderer.title?.runs?.[0]?.text || "No title"
      const url = `https://www.youtube.com/watch?v=${videoId}`

      // Get thumbnail
      const thumbnails = videoRenderer.thumbnail?.thumbnails || []
      const thumbnail = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : ""

      // Get duration
      const duration = videoRenderer.lengthText?.simpleText || "Unknown"

      // Get channel
      const channel = videoRenderer.ownerText?.runs?.[0]?.text || "Unknown"

      // Get views
      const views = videoRenderer.viewCountText?.simpleText || "Unknown views"

      return {
        id: videoId,
        title,
        url,
        thumbnail,
        duration,
        channel,
        views,
      }
    })
  } catch (error) {
    console.error("Error extracting videos from HTML:", error)
    return []
  }
}
