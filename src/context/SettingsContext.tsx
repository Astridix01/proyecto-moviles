import { createContext, ReactNode, useState } from "react";

type SettingsContextType = {
    pageSize: number;
    setPageSize: (n: number) => void;
    theme: "light" | "dark";
    setTheme: (t: "light" | "dark") => void;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export function SettingsProvider({ children }: { children: ReactNode }) {

    const [pageSize, setPageSize] = useState(6);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    return (
        <SettingsContext.Provider value={{ pageSize, setPageSize, theme, setTheme }}>
            {children}
        </SettingsContext.Provider>
    );
}
