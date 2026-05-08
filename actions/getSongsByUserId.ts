import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types_db";

const getSongsByUserId = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient<Database>({
        cookies: cookies
    });

    const { 
        data: { user },
        error: userError 
    } = await supabase.auth.getUser();

    if(userError) {
        console.log(userError.message);
        return [];
    }

    if (!user?.id) {
        return [];
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false});

    if(error) {
        console.log(error)
    }

    return (data as any) || [];
};

export default getSongsByUserId;