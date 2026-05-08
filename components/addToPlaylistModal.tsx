"use client";

import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";
import Modal from "./modal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Playlist } from "@/types";

const AddToPlaylistModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const addToPlaylistModal = useAddToPlaylistModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        if (addToPlaylistModal.isOpen && user) {
            const fetchPlaylists = async () => {
                const { data, error } = await supabaseClient
                    .from('playlists')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (data && !error) {
                    setPlaylists(data as any);
                }
            };
            fetchPlaylists();
        }
    }, [addToPlaylistModal.isOpen, user, supabaseClient]);

    const handleAddToPlaylist = async (playlistId: string) => {
        if (!addToPlaylistModal.songId) return;

        try {
            setIsLoading(true);

            const { error } = await supabaseClient
                .from('playlist_songs')
                .insert({
                    playlist_id: playlistId,
                    song_id: Number(addToPlaylistModal.songId)
                });

            if (error) {
                // If it's a unique violation, the song is already in the playlist
                if (error.code === '23505') {
                    toast.error('Song already in playlist');
                } else {
                    toast.error(error.message);
                }
                return;
            }

            toast.success('Added to playlist!');
            router.refresh();
            addToPlaylistModal.onClose();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onChange = (open: boolean) => {
        if(!open) {
            addToPlaylistModal.onClose();
        }
    }

    return (
        <Modal
            title="Add to Playlist"
            description="Select a playlist to add this song to."
            isOpen={addToPlaylistModal.isOpen}
            onChange={onChange}
        >
            <div className="flex flex-col gap-y-2 mt-4">
                {playlists.length === 0 ? (
                    <div className="text-neutral-400 text-sm">
                        No playlists available. Create one first!
                    </div>
                ) : (
                    playlists.map((playlist) => (
                        <div 
                            key={playlist.id} 
                            onClick={() => !isLoading && handleAddToPlaylist(playlist.id)}
                            className="
                                flex 
                                items-center 
                                gap-x-3 
                                cursor-pointer 
                                hover:bg-neutral-800/50 
                                w-full 
                                p-2 
                                rounded-md
                            "
                        >
                            <p className="text-white truncate">{playlist.name}</p>
                        </div>
                    ))
                )}
            </div>
        </Modal>
    )
};

export default AddToPlaylistModal;
