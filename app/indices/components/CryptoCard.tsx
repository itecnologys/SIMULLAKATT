'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  name: string;
  symbol: string;
  price: string;
  change24h: number;
  volume24h: string;
  icon: string;
  iconColor?: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  name,
  symbol,
  price,
  change24h,
  volume24h,
  icon,
  iconColor = 'bg-gray-100 text-gray-700'
}) => {
  const isPositive = change24h >= 0;
  const changeColor = isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const changeIcon = isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-3">
        {/* Ícone da criptomoeda */}
        <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center text-lg font-bold`}>
          {icon}
        </div>
        
        {/* Badge de variação */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${changeColor}`}>
          {changeIcon}
          <span>{Math.abs(change24h).toFixed(2)}%</span>
        </div>
      </div>

      {/* Nome da criptomoeda */}
      <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight">{name}</h3>
      
      {/* Preço */}
      <div className="text-xl font-bold text-gray-900 mb-3">
        R$ {price}
      </div>

      {/* Volume 24h */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Volume (24h):</span>
        <span className="font-medium text-gray-700">{volume24h} {symbol}</span>
      </div>
    </div>
  );
};

export default CryptoCard;
