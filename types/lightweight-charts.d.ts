declare module 'lightweight-charts' {
  export enum ColorType {
    Solid = 'solid'
  }

  export interface ChartOptions {
    width?: number;
    height?: number;
    layout?: {
      background?: {
        type?: ColorType;
        color?: string;
      };
      textColor?: string;
      fontFamily?: string;
    };
    grid?: {
      vertLines?: {
        color?: string;
      };
      horzLines?: {
        color?: string;
      };
    };
    crosshair?: {
      mode?: number;
      vertLine?: {
        width?: number;
        color?: string;
        style?: number;
        visible?: boolean;
        labelVisible?: boolean;
      };
      horzLine?: {
        visible?: boolean;
        labelVisible?: boolean;
      };
    };
    rightPriceScale?: {
      borderVisible?: boolean;
      scaleMargins?: {
        top?: number;
        bottom?: number;
      };
    };
    timeScale?: {
      borderVisible?: boolean;
      timeVisible?: boolean;
      secondsVisible?: boolean;
    };
  }

  export interface SeriesOptions {
    lineColor?: string;
    topColor?: string;
    bottomColor?: string;
    lineWidth?: number;
    priceFormat?: {
      type: string;
      precision?: number;
      minMove?: number;
    };
    color?: string;
    priceScaleId?: string;
    scaleMargins?: {
      top: number;
      bottom: number;
    };
  }

  export interface ISeriesApi<T> {
    setData: (data: T[]) => void;
  }

  export interface ITimeScaleApi {
    fitContent: () => void;
  }

  export interface IChartApi {
    addAreaSeries: (options?: SeriesOptions) => ISeriesApi<any>;
    addHistogramSeries: (options?: SeriesOptions) => ISeriesApi<any>;
    timeScale: () => ITimeScaleApi;
    applyOptions: (options: ChartOptions) => void;
    remove: () => void;
  }

  export function createChart(container: HTMLElement, options?: ChartOptions): IChartApi;
} 