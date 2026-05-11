import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ModalType = 'alert' | 'confirm';

interface ModalOptions {
  title?: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface ModalContextType {
  alert: (message: string, title?: string) => Promise<void>;
  confirm: (message: string, title?: string, confirmText?: string, isDestructive?: boolean) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const alert = useCallback((message: string, title = 'Alert') => {
    return new Promise<void>((resolve) => {
      setModal({
        type: 'alert',
        message,
        title,
        onConfirm: () => {
          setModal(null);
          resolve();
        },
      });
    });
  }, []);

  const confirm = useCallback((message: string, title = 'Confirm', confirmText = 'Confirm', isDestructive = false) => {
    return new Promise<boolean>((resolve) => {
      setModal({
        type: 'confirm',
        message,
        title,
        confirmText,
        isDestructive,
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
        onCancel: () => {
          setModal(null);
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <ModalContext.Provider value={{ alert, confirm }}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card text-card-foreground p-6 rounded-lg shadow-xl max-w-md w-full animate-slide-up border">
            {modal.title && <h3 className="text-xl font-bold mb-2">{modal.title}</h3>}
            <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{modal.message}</p>
            <div className="flex justify-end gap-3">
              {modal.type === 'confirm' && (
                <button
                  onClick={modal.onCancel}
                  className="px-4 py-2 rounded font-medium border border-input hover:bg-muted"
                >
                  {modal.cancelText || 'Cancel'}
                </button>
              )}
              <button
                onClick={modal.onConfirm}
                className={`px-4 py-2 rounded font-medium ${
                  modal.isDestructive
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {modal.type === 'confirm' ? modal.confirmText : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
