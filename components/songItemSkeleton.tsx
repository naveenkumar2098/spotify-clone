"use client";

import Skeleton from "./skeleton";

const SongItemSkeleton = () => {
    return (
        <div className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 p-3">
            <Skeleton className="relative aspect-square w-full h-full rounded-md" />
            <div className="flex flex-col items-start w-full pt-4 gap-y-2">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md mb-4" />
            </div>
        </div>
    );
};

export default SongItemSkeleton;
