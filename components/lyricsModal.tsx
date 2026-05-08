"use client";

import React, { useEffect, useState } from "react";
import Modal from "./modal";
import useLyricsModal from "@/hooks/useLyricsModal";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";

const LyricsModal = () => {
    const { isOpen, onClose } = useLyricsModal();
    const player = usePlayer();
    const { song } = useGetSongById(player.activeId);
    
    const [lyrics, setLyrics] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !song) return;

        const fetchLyrics = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.author)}/${encodeURIComponent(song.title)}`);
                const data = await response.json();
                
                if (data.lyrics) {
                    // Remove "Paroles de la chanson" text that sometimes precedes the lyrics
                    let cleanLyrics = data.lyrics as string;
                    cleanLyrics = cleanLyrics.replace(/Paroles de la chanson.*\n/, '');
                    setLyrics(cleanLyrics);
                } else {
                    setLyrics("Lyrics not found for this track.");
                }
            } catch (error) {
                setLyrics("Failed to load lyrics.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLyrics();
    }, [isOpen, song]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Modal
            title={`Lyrics: ${song?.title || ''}`}
            description={`By ${song?.author || ''}`}
            isOpen={isOpen}
            onChange={onChange}
        >
            <div className="flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {isLoading ? (
                    <div className="animate-pulse flex flex-col gap-y-3">
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                        <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
                        <div className="h-4 bg-neutral-800 rounded w-2/3 mt-4"></div>
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap text-neutral-300 font-medium leading-relaxed text-lg text-center">
                        {lyrics || "No lyrics available."}
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default LyricsModal;
