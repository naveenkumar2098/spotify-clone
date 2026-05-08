"use client";

import MediaItem from "@/components/mediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RemovePlaylistSongButton from "@/components/removePlaylistSongButton";

interface PlaylistContentProps {
    songs: Song[];
    playlistId: string;
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
    songs,
    playlistId
}) => {
    const onPlay = useOnPlay(songs);
    const { isLoading, user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No songs in this playlist. Add some songs!
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song) => (
                <div 
                    key={song.id} 
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem 
                            onClick={(id?: string) => { if (id) onPlay(id.toString()); }}
                            data={song}
                            hideAddButton
                        />
                    </div>
                    <RemovePlaylistSongButton 
                        songId={song.id.toString()} 
                        playlistId={playlistId} 
                    />
                </div>
            ))}
        </div>
    )
}

export default PlaylistContent;
