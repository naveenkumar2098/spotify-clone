import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types_db";

const getPlaylistById = async (id: string): Promise<Playlist | null> => {
    const supabase = createServerComponentClient<Database>({
        cookies: cookies
    });

    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();

    if(error) {
        console.log(error);
        return null;
    }

    return (data as any) || null;
};

export default getPlaylistById;
