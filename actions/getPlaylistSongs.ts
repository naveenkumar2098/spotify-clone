import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types_db";

const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
    const supabase = createServerComponentClient<Database>({
        cookies: cookies
    });

    const { data, error } = await supabase
        .from('playlist_songs')
        .select('*, songs(*)')
        .eq('playlist_id', playlistId)
        .order('added_at', {ascending: false});

    if(error) {
        console.log(error);
        return [];
    }

    if(!data) {
        return [];
    }

    return data.map((item: any) => ({
        ...item.songs
    })) as any;
};

export default getPlaylistSongs;
