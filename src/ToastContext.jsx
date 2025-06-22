import { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ message: '', type: 'success', show: false });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000); // 3 seconds
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, show: true });
    };

    return (
        <ToastContext.Provider value={showToast}>
            {toast.show && (
                <div className="position-fixed end-0" style={{ zIndex: 9999, padding:"20px 14px" }}>
                    <div className={`toast show text-white bg-${toast.type}`} role="alert">
                        <div className="toast-body">{toast.message}</div>
                    </div>
                </div>
            )}
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
