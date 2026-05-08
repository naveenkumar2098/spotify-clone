import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types_db";

const getPlaylists = async (): Promise<Playlist[]> => {
    const supabase = createServerComponentClient<Database>({
        cookies: cookies
    });

    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();

    if (!user?.id) {
        return [];
    }

    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false});

    if(error) {
        console.log(error);
        return [];
    }

    return (data as any) || [];
};

export default getPlaylists;
