"use client";

import Box from "@/components/box";
import SongItemSkeleton from "@/components/songItemSkeleton";

const Loading = () => {
    return (
        <Box className="h-full w-full">
            <div className="mt-2 mb-7 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-white text-2xl font-semibold">
                        Loading...
                    </h1>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 px-6">
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
                <SongItemSkeleton />
            </div>
        </Box>
    )
};

export default Loading;