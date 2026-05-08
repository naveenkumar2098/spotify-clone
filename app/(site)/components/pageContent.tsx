"use client";

import SongItem from "@/components/songItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
    const onPlay = useOnPlay(songs);
    const gridRef = useRef<HTMLDivElement>(null);
    const animatedRef = useRef(false);

    useEffect(() => {
        if (!animatedRef.current && gridRef.current && songs.length > 0) {
            anime({
                targets: '.anime-song-item',
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                easing: 'easeOutElastic(1, .8)',
                duration: 1000
            });
            animatedRef.current = true;
        }
    }, [songs]);

    if(songs.length === 0) {
        return (
            <div 
                className="mt-4 text-neutral-400"
            >
                No Songs Available!
            </div>
        )
    }

    return (
        <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4"
        >
            {songs.map((song) => (
                <div key={song.id} className="anime-song-item" style={{ opacity: 0 }}>
                    <SongItem 
                        onClick={(id?: string) => {
                            if(id) {
                                onPlay(id.toString());
                            }
                        }}
                        data={song}
                    />
                </div>
            ))}
        </div>
    )
}

export default PageContent;