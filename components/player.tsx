"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./playerContent";
import { useEffect, useRef } from "react";
// @ts-ignore
import anime from "animejs";

const Player = () => {

    const player = usePlayer();
    const { song } = useGetSongById(player.activeId);
    const playerRef = useRef<HTMLDivElement>(null);

    const songUrl = useLoadSongUrl(song!);

    useEffect(() => {
        if (playerRef.current) {
            anime({
                targets: playerRef.current,
                translateY: ['100%', 0],
                easing: 'easeOutExpo',
                duration: 600
            });
        }
    }, []);

    if(!song || !songUrl || !player.activeId) {
        return null;
    }
    
    return (
        <div
            ref={playerRef}
            className="
                fixed
                bottom-0
                bg-black
                w-full
                py-2
                h-auto
                md:h-[80px]
                px-4
                z-50
            "
        >
            <PlayerContent 
                song={song}
                key={songUrl}
                songUrl={songUrl}
            />
        </div>
    )
};

export default Player;