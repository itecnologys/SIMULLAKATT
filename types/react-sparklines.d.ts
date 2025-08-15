declare module 'react-sparklines' {
  import { ReactNode } from 'react';

  export interface SparklinesProps {
    data: number[];
    limit?: number;
    width?: number;
    height?: number;
    margin?: number;
    min?: number;
    max?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface SparklinesLineProps {
    color?: string;
    style?: React.CSSProperties;
  }

  export interface SparklinesSpotsProps {
    size?: number;
    style?: React.CSSProperties;
    spotColors?: {
      [key: string]: string;
    };
  }

  export const Sparklines: React.FC<SparklinesProps>;
  export const SparklinesLine: React.FC<SparklinesLineProps>;
  export const SparklinesSpots: React.FC<SparklinesSpotsProps>;
} 