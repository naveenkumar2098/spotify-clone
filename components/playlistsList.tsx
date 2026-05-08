"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";
import { useUser } from "@/hooks/useUser";
import { Playlist } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { useRouter } from "next/navigation";

interface PlaylistsListProps {
    playlists: Playlist[];
}

const PlaylistsList: React.FC<PlaylistsListProps> = ({
    playlists
}) => {
    const authModal = useAuthModal();
    const createPlaylistModal = useCreatePlaylistModal();
    const { user } = useUser();
    const router = useRouter();

    const onClick = () => {
        if(!user) {
            return authModal.onOpen();
        }

        return createPlaylistModal.onOpen();
    };

    return (
        <div className="flex flex-col mt-4">
            <div
                className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-4
                "
            >
                <div
                    className="
                        inline-flex
                        items-center
                        gap-x-2
                    "
                >
                    <MdOutlineLibraryMusic className="text-neutral-400" size={26}/>
                    <p className="text-neutral-400 font-medium text-md">
                        Your Playlists
                    </p>
                </div>
                <AiOutlinePlus
                    onClick={onClick}
                    size={20}
                    className="
                    text-neutral-400
                    cursor-pointer
                    hover:text-white
                    transition
                    "
                />
            </div>
            <div
                className="
                    flex
                    flex-col
                    gap-y-2
                    mt-2
                    px-3
                "
            >
                {playlists.map((playlist) => (
                    <div
                        key={playlist.id}
                        onClick={() => router.push(`/playlist/${playlist.id}`)}
                        className="
                            flex 
                            items-center 
                            gap-x-3 
                            cursor-pointer 
                            hover:bg-neutral-800/50 
                            w-full 
                            p-2 
                            rounded-md
                        "
                    >
                        {/* We could use next/image here if we fetch the image URL from Supabase, but since image_path is just the path, we can either use a generic icon or build a custom hook to load the image like useLoadImage.ts */}
                        <div className="
                            relative 
                            rounded-md 
                            min-h-[48px] 
                            min-w-[48px] 
                            overflow-hidden 
                            bg-neutral-800
                            flex
                            items-center
                            justify-center
                        ">
                            <MdOutlineLibraryMusic className="text-neutral-400" size={24}/>
                        </div>
                        <div className="flex flex-col gap-y-1 overflow-hidden">
                            <p className="text-white truncate">
                                {playlist.name}
                            </p>
                            <p className="text-neutral-400 text-sm truncate">
                                Playlist
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlaylistsList;
