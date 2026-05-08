"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdPlaylistRemove } from "react-icons/md";

interface RemovePlaylistSongButtonProps {
    songId: string;
    playlistId: string;
}

const RemovePlaylistSongButton: React.FC<RemovePlaylistSongButtonProps> = ({
    songId,
    playlistId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        setIsLoading(true);

        const { error } = await supabaseClient
            .from('playlist_songs')
            .delete()
            .eq('playlist_id', playlistId)
            .eq('song_id', songId);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Removed from playlist");
            router.refresh();
        }

        setIsLoading(false);
    }

    return (
        <MdPlaylistRemove 
            onClick={handleRemove}
            size={24}
            className={`
                cursor-pointer
                text-neutral-400 
                hover:text-red-500 
                transition
                ${isLoading && 'opacity-50 cursor-not-allowed'}
            `}
        />
    )
}

export default RemovePlaylistSongButton;
