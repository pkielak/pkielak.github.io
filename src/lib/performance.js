// Simple performance detection - mobile vs desktop

export function detectPerformanceCapabilities() {
  if (typeof window === 'undefined') {
    return { 
      isMobile: false,
      recommendedQuality: 'high'
    };
  }

  // Simple mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Simple quality decision: mobile = low, desktop = high
  const recommendedQuality = isMobile ? 'low' : 'high';
  
  return { isMobile, recommendedQuality };
}