'use client'

import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store'
import { PersistGate } from 'redux-persist/integration/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
