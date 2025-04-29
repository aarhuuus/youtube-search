import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the video ID from URL parameters
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("id")

    if (!videoId) {
      return NextResponse.json({ error: "Missing video ID" }, { status: 400 })
    }

    // Fetch video info from YouTube's oEmbed endpoint
    // This is a public API that doesn't require an API key
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`

    const response = await fetch(oembedUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch video info: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching video info:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch video info",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
