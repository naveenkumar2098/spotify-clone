"use client";

import LikeButton from "@/components/likeButton";
import MediaItem from "@/components/mediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LikedContentProps {
    songs: Song[]
};

const LikedContent: React.FC<LikedContentProps> = ({
    songs
}) => {
    const onPlay = useOnPlay(songs);
    const router = useRouter();
    const {user, isLoading} = useUser();

    useEffect(() => {
        if(!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    if(songs.length === 0) {
        return (
            <div
                className="
                    flex
                    flex-col
                    gap-y-2
                    w-full
                    px-6
                    text-neutral-400
                "
            >
                No Liked Songs
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
                            onClick={(id?: string) => {
                                if(id) {
                                    onPlay(id);
                                }
                            }}
                            data={song}
                        />
                    </div>
                    <LikeButton songId={song.id}/>
                </div>
            ))}
        </div>
    )
}

export default LikedContent;