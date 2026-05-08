"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import { MdPlaylistAdd } from "react-icons/md";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";

interface MediaItemProps {
    data: Song;
    onClick?: (id?: string) => void;
    hideAddButton?: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({
    data,
    onClick,
    hideAddButton
}) => {
    const imageUrl = useLoadImage(data);
    const authModal = useAuthModal();
    const { user } = useUser();
    const addToPlaylistModal = useAddToPlaylistModal();

    const onAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(!user) return authModal.onOpen();
        addToPlaylistModal.onOpen(data.id.toString());
    };

    const handleClick = () => {
        if(onClick) {
            return onClick(data.id.toString())
        }
    }

    return (
        <div
            onClick={handleClick}
            className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
        >
            <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
                <Image
                    fill
                    src={imageUrl || '/images/liked.png'}
                    alt="Media Item"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden flex-1">
                <p className="text-white truncate">{data.title}</p>
                <p className="text-neutral-400 text-sm truncate">{data.author}</p>
            </div>
            {!hideAddButton && (
                <MdPlaylistAdd 
                    onClick={onAdd}
                    size={24}
                    className="text-neutral-400 hover:text-white transition"
                />
            )}
        </div>
    )
}

export default MediaItem;