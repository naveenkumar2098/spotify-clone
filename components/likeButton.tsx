"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// @ts-ignore
import anime from "animejs";

interface LikeButtonProps {
    songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
    songId
}) => {

    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModal = useAuthModal();
    const { user } = useUser();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if(!user?.id) {
            return;
        }

        const fetchData = async () => {
            const {data, error} = await supabaseClient
                .from('liked_songs')
                .select('*')
                .eq('user_id', user.id)
                .eq('song_id', songId)
                .single();

            if(!error && data) {
                setIsLiked(true);
            }
        };

        fetchData();
    }, [songId, supabaseClient, user?.id]);

    useEffect(() => {
        const handleStatusChange = (e: CustomEvent) => {
            if (String(e.detail.songId) === String(songId)) {
                setIsLiked(e.detail.isLiked);
            }
        };

        window.addEventListener('liked-status-changed', handleStatusChange as EventListener);
        return () => window.removeEventListener('liked-status-changed', handleStatusChange as EventListener);
    }, [songId]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if(!user) {
            return authModal.onOpen();
        }

        // Trigger pop animation
        if (buttonRef.current) {
            anime({
                targets: buttonRef.current,
                scale: [1.4, 1],
                duration: 600,
                easing: 'easeOutElastic(1, .5)'
            });
        }

        if(isLiked) {
            const { error } = await supabaseClient
                .from('liked_songs')
                .delete()
                .eq('user_id', user.id)
                .eq('song_id', songId);
            
            if(error) {
                toast.error(error.message);
            } else {
                setIsLiked(false);
                window.dispatchEvent(new CustomEvent('liked-status-changed', { detail: { songId, isLiked: false } }));
            }
        } else {
            const { error } = await supabaseClient
                .from('liked_songs')
                .insert({
                    song_id: songId,
                    user_id: user.id
                });

            if(error) {
                toast.error(error.message);
            } else {
                setIsLiked(true);
                window.dispatchEvent(new CustomEvent('liked-status-changed', { detail: { songId, isLiked: true } }));
                toast.success('Liked!');
            }
        }
        
        router.refresh();
    } 

    return (
        <button
            ref={buttonRef}
            onClick={handleLike} 
            className="hover:opacity-75 transition"
        >
            <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
        </button>
    );
}

export default LikeButton;