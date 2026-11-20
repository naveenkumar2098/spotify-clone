"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaPlay } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";

import Modal from "./modal";
import Button from "./button";
import ActionTooltip from "./actionTooltip";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { useSessionContext, useSupaUser } from "@/providers/SupabaseProviders";

interface PlaylistActionsProps {
    playlistId: string;
    playlistName: string;
    ownerId: string;
    imagePath?: string | null;
    songs: Song[];
}

const PlaylistActions: React.FC<PlaylistActionsProps> = ({
    playlistId,
    playlistName,
    ownerId,
    imagePath,
    songs
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const user = useSupaUser();
    const onPlay = useOnPlay(songs);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = !!user && user.id === ownerId;
    const hasSongs = songs.length > 0;

    const onPlayAll = () => {
        if (hasSongs) {
            onPlay(songs[0].id.toString());
        }
    };

    const onDelete = async () => {
        setIsDeleting(true);

        try {
            // Remove the playlist's songs first so the foreign key never blocks the delete.
            const { error: songsError } = await supabaseClient
                .from('playlist_songs')
                .delete()
                .eq('playlist_id', playlistId);

            if (songsError) {
                return toast.error(songsError.message);
            }

            // `.select()` returns the deleted rows, so an RLS-blocked delete
            // (zero rows, no error) is detected instead of reported as success.
            const { data: deleted, error: playlistError } = await supabaseClient
                .from('playlists')
                .delete()
                .eq('id', playlistId)
                .select('id');

            if (playlistError) {
                return toast.error(playlistError.message);
            }

            if (!deleted || deleted.length === 0) {
                return toast.error("You can't delete this playlist");
            }

            // The cover is best-effort: the playlist is already gone, so a
            // storage failure only leaves an orphaned image behind.
            if (imagePath) {
                const { error: imageError } = await supabaseClient
                    .storage
                    .from('images')
                    .remove([imagePath]);

                if (imageError) {
                    console.warn("Playlist deleted but its cover image was not:", imageError.message);
                }
            }

            toast.success("Playlist deleted");
            setIsDeleteOpen(false);
            router.replace('/');
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-x-6 px-6 pt-6">
            <ActionTooltip label={hasSongs ? `Play ${playlistName}` : "Add songs to play"}>
                <button
                    type="button"
                    aria-label={`Play ${playlistName}`}
                    onClick={onPlayAll}
                    disabled={!hasSongs}
                    className="
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-green-500
                        h-14
                        w-14
                        drop-shadow-md
                        transition
                        hover:scale-105
                        hover:bg-green-400
                        disabled:opacity-40
                        disabled:hover:scale-100
                        disabled:hover:bg-green-500
                        disabled:cursor-not-allowed
                    "
                >
                    <FaPlay className="text-black ml-1" size={20} />
                </button>
            </ActionTooltip>

            {isOwner && (
                <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            aria-label={`More options for ${playlistName}`}
                            className="
                                text-neutral-400
                                hover:text-white
                                transition
                                rounded-full
                                p-1
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-white/60
                                data-[state=open]:text-white
                            "
                        >
                            <HiOutlineDotsHorizontal size={32} />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            sideOffset={6}
                            className="
                                z-50
                                min-w-[200px]
                                rounded-md
                                border
                                border-neutral-700
                                bg-neutral-800
                                p-1
                                shadow-xl
                            "
                        >
                            <DropdownMenu.Item
                                onSelect={() => setIsDeleteOpen(true)}
                                className="
                                    flex
                                    items-center
                                    gap-x-3
                                    rounded-sm
                                    px-3
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-red-400
                                    outline-none
                                    cursor-pointer
                                    select-none
                                    data-[highlighted]:bg-neutral-700
                                    data-[highlighted]:text-red-300
                                "
                            >
                                <MdDeleteOutline size={18} />
                                Delete playlist
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            )}

            <Modal
                title="Delete playlist?"
                description={`"${playlistName}" and its song list will be permanently deleted. The songs themselves stay in the library.`}
                isOpen={isDeleteOpen}
                onChange={(open) => { if (!isDeleting) setIsDeleteOpen(open); }}
            >
                <div className="flex gap-x-3">
                    <Button
                        onClick={() => setIsDeleteOpen(false)}
                        disabled={isDeleting}
                        className="bg-neutral-700 text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="bg-red-500 text-white"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default PlaylistActions;
