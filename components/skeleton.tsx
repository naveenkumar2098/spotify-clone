"use client";

import { twMerge } from "tailwind-merge";

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={twMerge("animate-pulse bg-neutral-800 rounded-md", className)} />
    );
};

export default Skeleton;
