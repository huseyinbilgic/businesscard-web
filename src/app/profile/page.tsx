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
                try {
                    const response = await fetchAllBusinesCardsByUsername();
                    setBusinessCards(response);
                } catch (err) {
                    console.error(err);
                }
        };

        loadBusinessCards();
    }, []);

    const handleEdit = (id: number) => {
        console.log("Edit", id);

    };

    const handleDelete = (id: number) => {
        console.log("Delete", id);

    };

    if (loading) {
        return <p>Yonlendiriliyor...</p>;
    }

    return (<div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-semibold">My Business Cards</h3>
            <button className="btn btn-primary rounded-pill px-4">
                <i className="fas fa-plus me-2"></i>
                Add New Card
            </button>
        </div>

        <div className="row g-4">
            {businessCards.map((card) => (
                <div className="col-12 col-sm-6 col-lg-4" key={card.id}>
                    <div className="card border-0 shadow-sm rounded-4 card-fixed-height">
                        <div className="card-body card-content">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 className="fw-bold mb-0">{card.fullName}</h5>
                                    <small className="text-muted">{card.jobTitle}</small><br />
                                    <small className="text-muted">{card.company}</small>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-light border" title="Edit">
                                        <i className="fas fa-edit text-primary"></i>
                                    </button>
                                    <button className="btn btn-sm btn-light border" title="Delete">
                                        <i className="fas fa-trash text-danger"></i>
                                    </button>
                                </div>
                            </div>

                            <p className="about-preview">{card.aboutIt}</p>
                            <hr />

                            <div className="small">
                                {card.contacts.map((c, i) => (
                                    <div key={i}>
                                        <strong>{c.label}: </strong>{c.contactValue}
                                    </div>
                                ))}
                            </div>

                            <div className="text-end mt-auto small text-muted">
                                {new Date(card.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>);
}