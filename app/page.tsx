"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Bitcoin, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  ChevronRight,
  Eye,
  Plus,
  Minus,
  ArrowUpRight,
  Coins,
  Leaf
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [showSmallValues, setShowSmallValues] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left/Center */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Section */}
            <Card className="picnic-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 picnic-text-light" />
                    <CardTitle className="text-lg font-semibold picnic-text-dark">Overview</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm picnic-text-light">
                  Total invested + Multicurrency Account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Balance */}
                <div className="text-center">
                  <div className="text-3xl font-bold picnic-green mb-2">€1,500.00</div>
                </div>

                {/* Balance Categories */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border-r picnic-border">
                    <div className="text-sm picnic-text-light mb-1">Cryptocurrencies</div>
                    <div className="text-lg font-semibold picnic-text-dark">€1,500.00</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-sm picnic-text-light mb-1">Easy Earn</div>
                    <div className="text-lg font-semibold picnic-text-dark">€0.00</div>
                  </div>
                  <div className="text-center p-4 border-r picnic-border border-t picnic-border">
                    <div className="text-sm picnic-text-light mb-1">Crypto Baskets</div>
                    <div className="text-lg font-semibold picnic-text-dark">€0.00</div>
                  </div>
                  <div className="text-center p-4 border-t picnic-border">
                    <div className="text-sm picnic-text-light mb-1">Multi-currency account</div>
                    <div className="text-lg font-semibold picnic-text-dark">€0.00</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="picnic-button">
                    Deposit
                  </Button>
                  <Button variant="outline" className="picnic-button-outline">
                    Withdraw funds
                  </Button>
                  <Button variant="outline" className="picnic-button-outline">
                    Buy
                  </Button>
                  <Button variant="outline" className="picnic-button-outline">
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Picnic Card Section */}
            <Card className="picnic-green-light">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 picnic-green" />
                    <div>
                      <CardTitle className="text-lg font-semibold picnic-text-dark">Picnic Card</CardTitle>
                      <div className="text-sm picnic-text-light">Card balance</div>
                      <div className="text-xl font-bold picnic-green">€ 4.68</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="link" className="picnic-green hover:text-green-700 p-0">
                      Add funds
                    </Button>
                    <div className="bg-black text-white text-xs px-2 py-1 rounded">
                      VISA
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cryptocurrencies Section */}
            <Card className="picnic-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="h-5 w-5 picnic-text-light" />
                    <CardTitle className="text-lg font-semibold picnic-text-dark">Cryptocurrencies</CardTitle>
                  </div>
                  <Link href="/cryptocurrencies" className="picnic-green hover:text-green-700 text-sm font-medium">
                    View more <ChevronRight className="h-4 w-4 inline" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Column Headers */}
                <div className="grid grid-cols-3 gap-4 text-sm font-medium picnic-text-light border-b picnic-border pb-2">
                  <div className="flex items-center space-x-1">
                    <span>Balance</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                  <div>Current Price</div>
                  <div>Change 24h</div>
                </div>

                {/* No data message */}
                <div className="text-center py-8 picnic-text-light">
                  <Bitcoin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No cryptocurrencies found</p>
                </div>

                {/* Display Options */}
                <div className="border-t picnic-border pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showSmallValues}
                          onChange={(e) => setShowSmallValues(e.target.checked)}
                          className="rounded border-gray-300 picnic-green focus:ring-green-500"
                        />
                        <span className="text-sm picnic-text">Show small values</span>
                      </label>
                    </div>
                  </div>
                  <p className="text-xs picnic-text-light mt-1">
                    Display 1 cryptocurrencies with a balance less than 1 dollar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            
            {/* Multi-currency account */}
            <Card className="picnic-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 picnic-text-light" />
                  <CardTitle className="text-lg font-semibold picnic-text-dark">Multi-currency account</CardTitle>
                </div>
                <CardDescription className="text-sm picnic-text-light">
                  Available to buy cryptocurrencies and fiat operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold picnic-green">R$</span>
                    </div>
                    <span className="text-sm picnic-text">Real</span>
                  </div>
                  <span className="text-sm font-semibold picnic-text-dark">R$ 0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">$</span>
                    </div>
                    <span className="text-sm picnic-text">Dollar</span>
                  </div>
                  <span className="text-sm font-semibold picnic-text-dark">US$ 0.00</span>
                </div>
              </CardContent>
            </Card>

            {/* Let your money work for you */}
            <Card className="picnic-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-6 w-6 picnic-green" />
                    <div>
                      <CardTitle className="text-lg font-semibold picnic-text-dark">
                        Let your money work for you
                      </CardTitle>
                      <p className="text-sm picnic-text-light">
                        Earn 4.64% annual yields investing on Simple Earn
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Bitcoin Withdrawal */}
            <Card className="picnic-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold picnic-text-dark mb-2">
                      Bitcoin Withdrawal
                    </CardTitle>
                    <p className="text-sm picnic-text-light mb-3">
                      Send Bitcoin to your native wallet at the lowest rate in the market.
                    </p>
                    <Button variant="link" className="picnic-green hover:text-green-700 p-0 h-auto">
                      earn more
                    </Button>
                  </div>
                  <div className="ml-4">
                    <div className="relative">
                      <Coins className="h-8 w-8 text-yellow-500" />
                      <Leaf className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Support */}
      <div className="fixed bottom-6 right-6">
        <Button className="picnic-button rounded-full w-12 h-12 p-0 shadow-lg">
          <Eye className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
