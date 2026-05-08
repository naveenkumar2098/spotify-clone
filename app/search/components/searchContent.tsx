"use client";

import LikeButton from "@/components/likeButton";
import MediaItem from "@/components/mediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";
import { useSearchParams } from "next/navigation";

interface SearchContentProps {
    songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({
    songs
}) => {

    const onPlay = useOnPlay(songs);
    const listRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const title = searchParams.get('title');

    useEffect(() => {
        if (listRef.current && songs.length > 0) {
            anime({
                targets: '.anime-search-item',
                translateX: [-50, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                easing: 'easeOutQuint',
                duration: 800
            });
        }
    }, [title, songs]);
    
    if(songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No Songs Found.
            </div>
        )
    }

    return (
        <div ref={listRef} className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="anime-search-item flex items-center gap-x-4 w-full"
                    style={{ opacity: 0 }}
                >
                    <div
                        className="flex-1"
                    >
                        <MediaItem 
                            onClick={(id?: string) => {
                                if(id) {
                                    onPlay(id);
                                }
                            }}
                            data={song}
                        />
                    </div>
                    <LikeButton songId={song.id.toString()}/>
                </div>
            ))}
        </div>
    );
}

export default SearchContent;