"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

const Greeting = () => {
    const { userDetails } = useUser();
    const [greeting, setGreeting] = useState("Welcome back");

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            setGreeting("Good morning");
        } else if (currentHour >= 12 && currentHour < 17) {
            setGreeting("Good afternoon");
        } else if (currentHour >= 17 && currentHour < 21) {
            setGreeting("Good evening");
        } else {
            setGreeting("Good night");
        }
    }, []);

    return (
        <h1 className="text-white text-3xl font-semibold">
            {greeting}{userDetails?.full_name ? `, ${userDetails.full_name.split(' ')[0]}` : ''}
        </h1>
    );
};

export default Greeting;
