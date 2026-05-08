"use client";

import AuthModal from "@/components/authModal";
import UploadModal from "@/components/uploadModal";
import CreatePlaylistModal from "@/components/createPlaylistModal";
import AddToPlaylistModal from "@/components/addToPlaylistModal";
import LyricsModal from "@/components/lyricsModal";
import QueueModal from "@/components/queueModal";
import ResetPasswordModal from "@/components/resetPasswordModal";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useResetPasswordModal from "@/hooks/useResetPasswordModal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    const supabaseClient = useSupabaseClient();
    const resetPasswordModal = useResetPasswordModal();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                resetPasswordModal.onOpen();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabaseClient, resetPasswordModal]);

    if(!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal/>
            <UploadModal/>
            <CreatePlaylistModal/>
            <AddToPlaylistModal/>
            <LyricsModal />
            <QueueModal />
            <ResetPasswordModal />
        </>
    );
}

export default ModalProvider;