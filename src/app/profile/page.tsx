"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { fetchAllBusinesCardsByUsername } from "@/lib/businessCard";
import { BusinessCardResponse } from "@/models/response/BusinessCardResponse";
import { useEffect, useState } from "react";

export default function Profile() {
    const { loading } = useAuthGuard();
    const [businessCards, setBusinessCards] = useState<BusinessCardResponse[]>([]);


    useEffect(() => {
        const loadBusinessCards = async () => {
            if (localStorage.getItem("jwtToken")) {
                try {
                    const response = await fetchAllBusinesCardsByUsername();
                    setBusinessCards(response);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        loadBusinessCards();
    }, []);

    if (loading) {
        return <p>Yonlendiriliyor...</p>;
    }

    return (<h1>
        Hello Profile!!!
    </h1>);
}