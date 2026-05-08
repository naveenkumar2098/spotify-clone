"use client";

import Box from "@/components/box";
import MediaItemSkeleton from "@/components/mediaItemSkeleton";

const Loading = () => {
    return (
        <Box className="h-full w-full">
            <div className="mt-2 mb-7 px-6">
                <div className="flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        Loading Search...
                    </h1>
                </div>
            </div>
            <div className="flex flex-col gap-y-2 w-full px-6">
                <MediaItemSkeleton />
                <MediaItemSkeleton />
                <MediaItemSkeleton />
                <MediaItemSkeleton />
                <MediaItemSkeleton />
            </div>
        </Box>
    )
};

export default Loading;