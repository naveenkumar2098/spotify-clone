import { Song } from "@/types";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/server";

const getSongsByUserId = async (): Promise<Song[]> => {
    const supabase = await createClient();

    const { 
        data: { user },
        error: userError 
    } = await supabase.auth.getUser();

    if(userError) {
        // A missing session just means a logged-out visitor; only log real failures.
        if (!isAuthSessionMissingError(userError)) {
            console.error(userError.message);
        }
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