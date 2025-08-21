"use client"

import { useEffect } from "react"

export default function PreloadLinks() {
  useEffect(() => {
    // Preload das páginas mais importantes
    const preloadPages = [
      "/admin",
      "/indices", 
      "/card",
      "/admin/plugins",
      "/admin/indices"
    ]

    preloadPages.forEach(page => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = page
      document.head.appendChild(link)
    })

    // Preload das APIs mais usadas
    const preloadAPIs = [
      "/api/market-data",
      "/api/coinmarketcap",
      "/api/indices"
    ]

    preloadAPIs.forEach(api => {
      fetch(api, { method: "HEAD" })
    })
  }, [])

  return null
}
