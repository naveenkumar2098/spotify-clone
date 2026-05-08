"use client";

import uniqid from "uniqid"
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";
import Modal from "./modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./input";
import Button from "./button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const CreatePlaylistModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const createPlaylistModal = useCreatePlaylistModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            image: null,
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            if(!values.name || !user) {
                toast.error("Missing fields");
                return;
            }

            let imagePath = null;
            const imageFile = values.image?.[0];

            if (imageFile) {
                const uniqueId = uniqid();
                const {
                    data: imageData,
                    error: imageError
                } = await supabaseClient
                        .storage
                        .from('images')
                        .upload(`playlist-${values.name}-${uniqueId}`, imageFile, {
                            cacheControl: '3600',
                            upsert: false
                        });

                if(imageError) {
                    setIsLoading(false);
                    return toast.error("Image upload failed!")
                }
                imagePath = imageData.path;
            }

            const {
                error: supabaseError
            } = await supabaseClient
                    .from('playlists')
                    .insert({
                        user_id: user.id,
                        name: values.name,
                        image_path: imagePath
                    });

            if(supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message)
            }
            
            router.refresh();
            setIsLoading(false);
            toast.success('Playlist created!')
            reset();
            createPlaylistModal.onClose();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onChange = (open: boolean) => {
        if(!open) {
            reset();
            createPlaylistModal.onClose();
        }
    }

    return (
        <Modal
            title="Create a Playlist"
            description="Give your playlist a name and an optional cover."
            isOpen={createPlaylistModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="name"
                    disabled={isLoading}
                    {...register('name', {required: true})}
                    placeholder="Playlist name"
                />
                <div>
                    <div className="pb-1">
                        Select a cover image (optional)
                    </div>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        disabled={isLoading}
                        {...register('image', {required: false})}
                    />
                </div>
                <Button 
                    disabled={isLoading}
                    type="submit"
                >
                    Create
                </Button>
            </form>
        </Modal>
    )
};

export default CreatePlaylistModal;
