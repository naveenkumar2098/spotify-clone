"use client";

import Skeleton from "./skeleton";

const MediaItemSkeleton = () => {
    return (
        <div className="flex items-center gap-x-3 w-full p-2 rounded-md">
            <Skeleton className="min-h-[48px] min-w-[48px] rounded-md" />
            <div className="flex flex-col gap-y-2 overflow-hidden flex-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
        </div>
    );
};

export default MediaItemSkeleton;
