"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// Sample data for currency values
const markers = [
  { name: "United States", coordinates: [-95.7129, 37.0902], value: "$2,876.54", code: "USD" },
  { name: "European Union", coordinates: [9.1815, 48.7775], value: "€2,464.32", code: "EUR" },
  { name: "United Kingdom", coordinates: [-0.1278, 51.5074], value: "£2,123.76", code: "GBP" },
  { name: "Japan", coordinates: [139.6917, 35.6895], value: "¥321,543.21", code: "JPY" },
  { name: "Switzerland", coordinates: [8.2275, 46.8182], value: "CHF 2,654.87", code: "CHF" },
  { name: "Australia", coordinates: [133.7751, -25.2744], value: "A$3,765.43", code: "AUD" },
  { name: "Canada", coordinates: [-106.3468, 56.1304], value: "C$3,432.12", code: "CAD" },
  { name: "China", coordinates: [104.1954, 35.8617], value: "¥18,765.32", code: "CNY" },
]

export default function DashboardMap() {
  const [tooltipContent, setTooltipContent] = useState("")

  return (
    <div className="relative h-full">
      <TooltipProvider>
        <ComposableMap>
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e6e6e6"
                  stroke="#D6D6DA"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#d6d6d6", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map(({ name, coordinates, value, code }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <Marker coordinates={coordinates}>
                  <circle r={8} fill="hsl(var(--primary))" opacity={0.8} />
                  <text
                    textAnchor="middle"
                    y={-12}
                    style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px" }}
                  >
                    {code}
                  </text>
                </Marker>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{name}</p>
                  <p>{value}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </ComposableMap>
      </TooltipProvider>
    </div>
  )
}
