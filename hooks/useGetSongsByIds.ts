import { useEffect, useState, useMemo } from "react";
import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";

const useGetSongsByIds = (ids: string[]) => {
    const [isLoading, setIsLoading] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const { supabaseClient } = useSessionContext();

    const idsString = ids ? ids.join(',') : '';

    useEffect(() => {
        if (!idsString) {
            setSongs([]);
            return;
        }

        const currentIds = idsString.split(',');

        const fetchSongs = async () => {
            setIsLoading(true);

            const { data, error } = await supabaseClient
                .from('songs')
                .select('*')
                .in('id', currentIds);

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            const sortedSongs = currentIds.map(id => data.find((song: Song) => song.id.toString() === id.toString())).filter(Boolean) as Song[];
            
            setSongs(sortedSongs);
            setIsLoading(false);
        }

        fetchSongs();
    }, [idsString, supabaseClient]);

    return useMemo(() => ({
        isLoading,
        songs
    }), [isLoading, songs]);
};

export default useGetSongsByIds;
