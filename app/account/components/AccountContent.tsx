"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Button from "@/components/button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/components/input";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useSessionContext } from "@supabase/auth-helpers-react";

const AccountContent = () => {
    const router = useRouter();
    const { isLoading, subscription, user, userDetails } = useUser();
    const { supabaseClient } = useSessionContext();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue
    } = useForm<FieldValues>({
        defaultValues: {
            full_name: '',
            avatar: null,
        }
    });

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        if (userDetails?.full_name) {
            setValue('full_name', userDetails.full_name);
        }
    }, [userDetails, setValue]);

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setLoading(true);
            let avatarUrl = userDetails?.avatar_url;

            const avatarFile = values.avatar?.[0];

            if (avatarFile && user) {
                const uniqueId = uniqid();
                const { data: imageData, error: imageError } = await supabaseClient
                    .storage
                    .from('images')
                    .upload(`avatar-${user.id}-${uniqueId}`, avatarFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (imageError) {
                    setLoading(false);
                    return toast.error("Avatar upload failed!");
                }

                avatarUrl = imageData.path;
            }

            if (user) {
                const { error: supabaseError } = await supabaseClient
                    .from('users')
                    .update({
                        full_name: values.full_name,
                        avatar_url: avatarUrl
                    })
                    .eq('id', user.id);

                if (supabaseError) {
                    setLoading(false);
                    return toast.error(supabaseError.message);
                }

                toast.success("Profile updated!");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-7 px-6">
            {!subscription && (
                <div className="flex flex-col gap-y-4">
                    <p>No active subscription.</p>
                    <Button 
                        onClick={() => {}}
                        className="w-[300px]"
                    >
                        Subscribe to Premium
                    </Button>
                </div>
            )}
            {subscription && (
                <div className="flex flex-col gap-y-4">
                    <p>
                        You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.
                    </p>
                    <Button 
                        disabled={loading || isLoading}
                        onClick={() => {}}
                        className="w-[300px]"
                    >
                        Open customer portal
                    </Button>
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
                <div className="flex flex-col gap-y-2 text-neutral-400 mb-6">
                    <p>Email: <span className="text-white">{user?.email}</span></p>
                    <p>User ID: <span className="text-white">{user?.id}</span></p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-[300px]">
                    <div>
                        <div className="pb-1 text-neutral-400">Display Name</div>
                        <Input
                            id="full_name"
                            disabled={loading || isLoading}
                            {...register('full_name')}
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <div className="pb-1 text-neutral-400">Profile Picture (Avatar)</div>
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            disabled={loading || isLoading}
                            {...register('avatar')}
                        />
                    </div>
                    <Button 
                        disabled={loading || isLoading}
                        type="submit"
                        className="mt-2"
                    >
                        Save Profile
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AccountContent;
