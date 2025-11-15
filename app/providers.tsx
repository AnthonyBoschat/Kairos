'use client'

import ErrorIcon from '@/components/ui/icons/Error';
import SuccessIcon from '@/components/ui/icons/Success';
import WarningIcon from '@/components/ui/icons/Warning';
import { store } from '@/store/rootReducer';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                {children}
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