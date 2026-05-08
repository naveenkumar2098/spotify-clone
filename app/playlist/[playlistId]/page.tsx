import getPlaylistById from "@/actions/getPlaylistById";
import getPlaylistSongs from "@/actions/getPlaylistSongs";
import Header from "@/components/header";
import { MdOutlineLibraryMusic } from "react-icons/md";
import PlaylistContent from "./components/PlaylistContent";
import Image from "next/image";

export const revalidate = 0;

interface PlaylistProps {
    params: {
        playlistId: string;
    }
}

const Playlist = async ({ params }: PlaylistProps) => {
    const playlist = await getPlaylistById(params.playlistId);
    const songs = await getPlaylistSongs(params.playlistId);

    if (!playlist) {
        return (
            <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
                <Header>
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-neutral-400">Playlist not found.</p>
                    </div>
                </Header>
            </div>
        )
    }

    // We construct the image URL. Supabase storage public URL for 'images' bucket.
    const imagePath = playlist.image_path 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${playlist.image_path}`
        : null;

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header>
                <div className="mt-20">
                    <div className="flex flex-col md:flex-row items-center gap-x-5">
                        <div className="relative h-32 w-32 lg:h-44 lg:w-44 bg-neutral-800 flex flex-col items-center justify-center drop-shadow-2xl">
                            {imagePath ? (
                                <Image
                                    fill
                                    src={imagePath}
                                    alt="Playlist"
                                    className="object-cover"
                                />
                            ) : (
                                <MdOutlineLibraryMusic size={50} className="text-neutral-400" />
                            )}
                        </div>
                        <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
                            <p className="hidden md:block font-semibold text-sm">
                                Playlist
                            </p>
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                                {playlist.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </Header>
            <PlaylistContent songs={songs} playlistId={playlist.id} />
        </div>
    )
}

export default Playlist;
