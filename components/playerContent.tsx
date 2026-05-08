"use client";

import { Song } from "@/types";
import MediaItem from "./mediaItem";
import LikeButton from "./likeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { FiRepeat, FiShuffle } from "react-icons/fi";
import { TbMicrophone2 } from "react-icons/tb";
import { HiOutlineQueueList } from "react-icons/hi2";
import Slider from "./slider";
import PlaybackProgress from "./playbackProgress";
import usePlayer from "@/hooks/usePlayer";
import useLyricsModal from "@/hooks/useLyricsModal";
import useQueueModal from "@/hooks/useQueueModal";
import ActionTooltip from "./actionTooltip";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const lyricsModal = useLyricsModal();
    const queueModal = useQueueModal();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const activeList = player.isShuffle ? player.shuffledIds : player.ids;

    // Load volume from local storage on mount
    useEffect(() => {
        const savedVolume = localStorage.getItem("spotify-clone-volume");
        if (savedVolume !== null) {
            setVolume(parseFloat(savedVolume));
        }
    }, []);

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        localStorage.setItem("spotify-clone-volume", value.toString());
    };

    const onPlayNext = () => {
        if(activeList.length === 0) return;

        const currentIndex = activeList.findIndex((id) => id.toString() === player.activeId?.toString());
        const nextSong = activeList[currentIndex + 1];

        if(!nextSong) {
            if (player.repeatMode === 1) {
                return player.setId(activeList[0].toString());
            } else {
                return;
            }
        }

        player.setId(nextSong.toString());
    }

    const onPlayPrevious = () => {
        if(activeList.length === 0) return;

        const currentIndex = activeList.findIndex((id) => id.toString() === player.activeId?.toString());
        const previousSong = activeList[currentIndex - 1];

        if(!previousSong) {
            return player.setId(activeList[activeList.length - 1].toString());
        }

        player.setId(previousSong.toString());
    };

    const [play, { pause, sound, duration }] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    );

    useEffect(() => {
        if (sound) {
            sound.loop(player.repeatMode === 2);
        }
    }, [sound, player.repeatMode]);

    useEffect(() => {
        sound?.play();
        return () => {
            sound?.unload();
        }
    }, [sound]);

    useEffect(() => {
        if (isPlaying && sound) {
            const interval = setInterval(() => {
                setProgress(sound.seek() as number);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isPlaying, sound]);

    const handleSeek = (value: number) => {
        if (sound) {
            sound.seek(value);
            setProgress(value);
        }
    };

    const handlePlay = () => {
        if(!isPlaying) {
            play();
        } else {
            pause();
        }
    }

    const toggleMute = () => {
        if(volume === 0) {
            handleVolumeChange(1);
        } else {
            handleVolumeChange(0);
        }
    }

    const toggleRepeat = () => {
        const nextMode = (player.repeatMode + 1) % 3;
        player.setRepeatMode(nextMode);
    }

    return (
        <div className="flex flex-col md:grid md:grid-cols-3 h-full gap-y-2 md:gap-y-0 w-full relative">
            {/* Absolute positioning for progress bar on mobile to span the top edge */}
            <div className="md:hidden absolute -top-2 left-0 right-0 w-[calc(100%+2rem)] -ml-4 px-2 bg-black z-10">
                <PlaybackProgress 
                    progress={progress} 
                    duration={duration ? duration / 1000 : 0} 
                    onSeek={handleSeek} 
                />
            </div>

            <div className="flex w-full justify-between md:justify-start items-center pt-4 md:pt-0">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id.toString()} />
                </div>
                
                {/* Mobile top-right controls */}
                <div className="flex md:hidden items-center gap-x-3">
                    <TbMicrophone2 
                        onClick={lyricsModal.onOpen}
                        size={22} 
                        className="text-neutral-400 cursor-pointer hover:text-white transition"
                    />
                    <HiOutlineQueueList 
                        onClick={queueModal.onOpen}
                        size={22} 
                        className="text-neutral-400 cursor-pointer hover:text-white transition"
                    />
                </div>
            </div>

            {/* Mobile primary controls row */}
            <div className="flex md:hidden w-full justify-center items-center gap-x-6 pb-2">
                <FiShuffle 
                    onClick={player.toggleShuffle}
                    size={20}
                    className={`cursor-pointer transition ${player.isShuffle ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
                />
                <AiFillStepBackward 
                    onClick={onPlayPrevious}
                    size={28}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
                <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                    <Icon size={30} className="text-black"/>
                </div>
                <AiFillStepForward 
                    onClick={onPlayNext}
                    size={28}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
                <FiRepeat 
                    onClick={toggleRepeat}
                    size={20}
                    className={`cursor-pointer transition ${player.repeatMode !== 0 ? 'text-green-500' : 'text-neutral-400 hover:text-white'} ${player.repeatMode === 2 && 'animate-pulse'}`}
                />
            </div>
            
            {/* Desktop Center controls */}
            <div className="hidden h-full md:flex flex-col justify-center items-center w-full max-w-[722px] gap-y-1">
                <div className="flex justify-center items-center gap-x-6 w-full">
                    <ActionTooltip label="Shuffle">
                        <button>
                            <FiShuffle 
                                onClick={player.toggleShuffle}
                                size={20}
                                className={`cursor-pointer transition ${player.isShuffle ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
                            />
                        </button>
                    </ActionTooltip>
                    <ActionTooltip label="Previous">
                        <button>
                            <AiFillStepBackward 
                                onClick={onPlayPrevious}
                                size={30}
                                className="text-neutral-400 cursor-pointer hover:text-white transition"
                            />
                        </button>
                    </ActionTooltip>
                    <ActionTooltip label={isPlaying ? "Pause" : "Play"}>
                        <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
                            <Icon size={30} className="text-black"/>
                        </div>
                    </ActionTooltip>
                    <ActionTooltip label="Next">
                        <button>
                            <AiFillStepForward 
                                onClick={onPlayNext}
                                size={30}
                                className="text-neutral-400 cursor-pointer hover:text-white transition"
                            />
                        </button>
                    </ActionTooltip>
                    <ActionTooltip label={player.repeatMode === 0 ? "Enable repeat" : player.repeatMode === 1 ? "Enable repeat one" : "Disable repeat"}>
                        <button>
                            <FiRepeat 
                                onClick={toggleRepeat}
                                size={20}
                                className={`cursor-pointer transition ${player.repeatMode !== 0 ? 'text-green-500' : 'text-neutral-400 hover:text-white'} ${player.repeatMode === 2 && 'animate-pulse'}`}
                            />
                        </button>
                    </ActionTooltip>
                </div>
                <PlaybackProgress 
                    progress={progress} 
                    duration={duration ? duration / 1000 : 0} 
                    onSeek={handleSeek} 
                />
            </div>

            {/* Desktop Right controls */}
            <div className="hidden md:flex w-full justify-end pr-2 h-full items-center">
                <div className="flex items-center gap-x-4">
                    <ActionTooltip label="Lyrics">
                        <button>
                            <TbMicrophone2 
                                onClick={lyricsModal.onOpen}
                                size={20} 
                                className="text-neutral-400 cursor-pointer hover:text-white transition"
                            />
                        </button>
                    </ActionTooltip>
                    <ActionTooltip label="Queue">
                        <button>
                            <HiOutlineQueueList 
                                onClick={queueModal.onOpen}
                                size={20} 
                                className="text-neutral-400 cursor-pointer hover:text-white transition"
                            />
                        </button>
                    </ActionTooltip>
                    <div className="flex items-center gap-x-2 w-[120px]">
                        <ActionTooltip label={volume === 0 ? "Unmute" : "Mute"}>
                            <button>
                                <VolumeIcon 
                                    onClick={toggleMute}
                                    className="cursor-pointer text-neutral-400 hover:text-white transition"
                                    size={24}
                                />
                            </button>
                        </ActionTooltip>
                        <Slider 
                            value={volume}
                            onChange={(value) => handleVolumeChange(value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerContent;