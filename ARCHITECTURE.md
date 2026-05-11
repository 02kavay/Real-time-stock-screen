# ProScreener Architecture

This document details the architecture and technical decisions made for the ProScreener application.

## High-Level Overview
ProScreener is a Next.js 14 application leveraging the App Router paradigm. The front end acts as a Single Page Application (SPA) driven by React 18, tailored specifically for high-throughput financial data streaming.

### 1. State Management (Zustand)
We chose **Zustand** over Redux or Context API because:
- It eliminates the boilerplate of Redux.
- It prevents unnecessary re-renders (unlike Context API) by allowing components to subscribe to specific slices of state.
- It is fast enough to execute synchronous filtering operations across 5,000 items in under 10ms.

### 2. Component Structure
- **Compound Components**: The Filter and DataTable are logically separated but communicate via the shared Zustand store.
- **Custom Hooks**: The `useWebSocket.ts` hook isolates the live data feed logic. This keeps our view components (`page.tsx`) completely declarative.

### 3. Rendering Strategy
- Next.js is configured for Client-Side Rendering (CSR) for the primary dashboard by using the `"use client"` directive. This is because real-time stock ticking and canvas charting rely heavily on browser APIs (`window`, `HTMLCanvasElement`).

### 4. Financial Charts
We utilized TradingView's `lightweight-charts`.
- **Canvas over SVG**: Financial charts can have thousands of data points. SVG nodes would choke the DOM. HTML5 Canvas solves this by rendering pixels, resulting in superior performance.

### 5. Virtualization
`@tanstack/react-virtual` handles our large dataset display. Instead of rendering 5,000 `<tr>` elements, it only renders the ~20 that fit within the viewport's height, dynamically swapping the content out as the user scrolls.
