"use client"

import { Button } from "@/components/ui/button"
import { SavedSetupsTable } from "@/components/saved-setups-table"
import { RefreshMarketDataButton } from "@/components/refresh-market-data-button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function SavedSetupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Configurações Salvas</h2>
        <div className="flex items-center gap-2">
          <RefreshMarketDataButton />
          <Button asChild>
            <Link href="/dashboard/setup">
              <Plus className="mr-2 h-4 w-4" />
              Nova Configuração
            </Link>
          </Button>
        </div>
      </div>

      <SavedSetupsTable />
    </div>
  )
}
