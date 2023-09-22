import { NextWebVitalsMetric } from 'next/app';

export const handleMetric = (metric: NextWebVitalsMetric) => {
  // console.log(metric);

  if (metric.label === 'web-vital') {
    switch (metric.name) {
      case 'FCP':
        // handle FCP results
        break;

      case 'LCP':
        // handle LCP results
        break;

      case 'CLS':
        // handle CLS results
        break;

      case 'FID':
        // handle FID results
        break;

      case 'TTFB':
        // handle TTFB results
        break;

      case 'INP':
        // handle INP results (note: INP is still an experimental metric)
        break;

      default:
        break;
    }
  }
};
