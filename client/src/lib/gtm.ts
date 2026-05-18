declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function gtmPush(event: string, params?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
