import { useCallback, useEffect, useState } from "react";
import type { Connection } from "./api";

const STORAGE_KEY = "cs-agent-console-connection";

export function useConnection() {
  const [connection, setConnectionState] = useState<Connection | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const setConnection = useCallback((conn: Connection | null) => {
    setConnectionState(conn);
    if (conn) localStorage.setItem(STORAGE_KEY, JSON.stringify(conn));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    // keep other tabs in sync if the key changes
    const listener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setConnectionState(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  return { connection, setConnection };
}
