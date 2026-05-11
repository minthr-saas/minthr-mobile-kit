import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MainSheet } from './BottomSheet';

export interface SheetBodyProps<P = unknown> {
  params: P;
  // Undefined during MainSheet's hidden measurement render — bodies should
  // either default it (`handleClose = () => {}`) or call it with optional chaining.
  handleClose?: () => void;
  onHeightUpdate?: (height: number) => void;
}

export interface SheetHeaderProps<P = unknown> {
  params: P;
  handleClose: () => void;
}

export interface SheetFooterProps<P = unknown> {
  params: P;
  handleClose: () => void;
}

export interface OpenSheetOptions<P = unknown> {
  body: ComponentType<SheetBodyProps<P>>;
  header?: ComponentType<SheetHeaderProps<P>>;
  footer?: ComponentType<SheetFooterProps<P>>;
  isScrollable?: boolean;
  params?: P;
}

export interface SheetHandle<P = unknown> {
  id: string;
  close: () => void;
  update: (params: P) => void;
}

interface SheetContextValue {
  open: <P>(opts: OpenSheetOptions<P>) => SheetHandle<P>;
  closeAll: () => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

interface OpenedSheetEntry {
  bodyComponent: ComponentType<any>;
  headerComponent?: ComponentType<any>;
  footerComponent?: ComponentType<any>;
  isScrollable?: boolean;
  params?: any;
  sheetId: string;
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<OpenedSheetEntry[]>([]);
  const idCounter = useRef(0);

  const closeById = useCallback((id: string) => {
    setOpened((prev) => prev.filter((s) => s.sheetId !== id));
  }, []);

  // MainSheet hands us the bodyComponent reference; remove the most recently
  // opened entry whose body matches (LIFO — supports nested stacks of the same body).
  const closeByComponent = useCallback((component: React.FC) => {
    setOpened((prev) => {
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].bodyComponent === component) {
          const next = prev.slice();
          next.splice(i, 1);
          return next;
        }
      }
      return prev;
    });
  }, []);

  const updateById = useCallback((id: string, params: any) => {
    setOpened((prev) =>
      prev.map((s) => (s.sheetId === id ? { ...s, params } : s)),
    );
  }, []);

  const open = useCallback(
    <P,>(opts: OpenSheetOptions<P>): SheetHandle<P> => {
      idCounter.current += 1;
      const id = `sheet-${Date.now()}-${idCounter.current}`;
      setOpened((prev) => [
        ...prev,
        {
          bodyComponent: opts.body,
          headerComponent: opts.header,
          footerComponent: opts.footer,
          isScrollable: opts.isScrollable,
          params: opts.params,
          sheetId: id,
        },
      ]);
      return {
        id,
        close: () => closeById(id),
        update: (params: P) => updateById(id, params),
      };
    },
    [closeById, updateById],
  );

  const closeAll = useCallback(() => setOpened([]), []);

  const value = useMemo<SheetContextValue>(
    () => ({ open, closeAll }),
    [open, closeAll],
  );

  return (
    <SheetContext.Provider value={value}>
      {children}
      <MainSheet openedSheets={opened} closeSheet={closeByComponent} />
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return ctx;
}
