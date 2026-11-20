import { Song } from "@/types";
import { createClient } from "@/libs/supabase/server";

const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
    const supabase = await createClient();

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
