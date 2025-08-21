"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function IndexPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{symbol.toUpperCase()} Price Index</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Data</h2>
          <p className="text-gray-600">Detailed market information for {symbol.toUpperCase()} will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
