"use client";

import React, { useState } from "react";
import Modal from "./modal";
import Input from "./input";
import Button from "./button";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useResetPasswordModal from "@/hooks/useResetPasswordModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const ResetPasswordModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const resetPasswordModal = useResetPasswordModal();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            if (values.password.length < 6) {
                toast.error("Password must be at least 6 characters.");
                return;
            }

            const { error } = await supabaseClient.auth.updateUser({
                password: values.password
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Password updated successfully!");
            reset();
            resetPasswordModal.onClose();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            resetPasswordModal.onClose();
        }
    };

    return (
        <Modal
            title="Reset Password"
            description="Please enter your new password below."
            isOpen={resetPasswordModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    {...register('password', { required: true })}
                    placeholder="New Password"
                />
                <Button disabled={isLoading} type="submit">
                    Update Password
                </Button>
            </form>
        </Modal>
    );
};

export default ResetPasswordModal;
