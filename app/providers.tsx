'use client'

import ErrorIcon from '@/components/ui/icons/Error';
import SuccessIcon from '@/components/ui/icons/Success';
import WarningIcon from '@/components/ui/icons/Warning';
import { store } from '@/store/rootReducer';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {

    const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))
    return (
        <SessionProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
                <ToastContainer 
                    icon={({type}) => {
                        if(type === "success") return <SuccessIcon/>
                        if(type === "error") return <ErrorIcon/>
                        if(type === "warning") return <WarningIcon/>
                        return null
                    }}
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Provider>
        </SessionProvider>
    );
}