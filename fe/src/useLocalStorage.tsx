import { useCallback, useEffect, useState } from "react";
import { UserSession } from "./types";

const STORAGE_EVENT_NAME = "cc-local-storage-update";

export const useLocalStorage = (key: string = "session") => {
  const [session, setSession] = useState<UserSession>(initUserSession());

  useEffect(() => {
    setSession(getOrCreateSession(key));
  }, [key]);

  const setStorageSession = useCallback(
    (session: UserSession) => {
      window.localStorage.setItem(key, JSON.stringify(session));
      setSession(session);
      const customEvent = new CustomEvent(STORAGE_EVENT_NAME, {
        detail: { key, session },
      });
      window.dispatchEvent(customEvent);
    },
    [key]
  );

  useEffect(() => {
    const listener = (
      event: CustomEvent<{ key: string; session: UserSession }>
    ) => {
      if (event.detail.key == key) {
        setSession(getOrCreateSession(key));
      }
    };

    window.addEventListener(STORAGE_EVENT_NAME, listener as EventListener);
    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, listener as EventListener);
    };
  }, [key]);

  return [session, setStorageSession] as const;
};

const getOrCreateSession = (key: string): UserSession => {
  const sessionAsString = window.localStorage.getItem(key);
  try {
    return sessionAsString ? JSON.parse(sessionAsString) : initUserSession();
  } catch {
    return initUserSession();
  }
};

const initUserSession = (): UserSession => ({
  userName: "Guest",
});
