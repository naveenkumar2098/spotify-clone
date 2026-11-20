"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";

type SupabaseContextType = {
    // Loosely typed on purpose: the existing app types (types.ts) differ from
    // the generated Database types (e.g. Song.id is string vs number).
    supabaseClient: SupabaseClient;
    session: Session | null;
    isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

interface SupabaseProviderProps {
    children: React.ReactNode;
};

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children
}) => {
    const [supabaseClient] = useState<SupabaseClient>(() => createClient());
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        supabaseClient.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            (_event, newSession) => {
                if (!mounted) return;
                setSession(newSession);
                setIsLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabaseClient]);

    return (
        <SupabaseContext.Provider value={{ supabaseClient, session, isLoading }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSessionContext = () => {
    const context = useContext(SupabaseContext);

    if (context === undefined) {
        throw new Error("useSessionContext must be used within SupabaseProvider");
    }

    return context;
};

export const useSupabaseClient = () => useSessionContext().supabaseClient;

export const useSupaUser = (): User | null => useSessionContext().session?.user ?? null;

export default SupabaseProvider;
