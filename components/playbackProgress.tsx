"use client";

import Slider from "./slider";

interface PlaybackProgressProps {
    progress: number;
    duration: number;
    onSeek: (value: number) => void;
}

const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
        const minutes = Math.floor(time / 60);
        const formatMinutes = `${minutes}`;
        const seconds = Math.floor(time % 60);
        const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${formatMinutes}:${formatSeconds}`;
    }
    return "0:00";
};

const PlaybackProgress: React.FC<PlaybackProgressProps> = ({
    progress,
    duration,
    onSeek
}) => {
    return (
        <div className="flex w-full items-center gap-x-2 text-xs text-neutral-400">
            <span className="w-10 text-right">{formatTime(progress)}</span>
            <div className="flex-1 mt-[-10px]">
                <Slider 
                    value={progress}
                    max={duration || 100}
                    step={1}
                    onChange={(val) => onSeek(val)}
                />
            </div>
            <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
    )
}

export default PlaybackProgress;
