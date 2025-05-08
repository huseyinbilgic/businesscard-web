"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { fetchAllBusinesCards } from "@/lib/businessCard";
import { RootState } from "@/store";
import { setBusinessCards } from "@/store/businessCardSlice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Redirecting from "../components/Redirecting";

export default function Profile() {
    useAuthGuard()
    const businessCards = useSelector((state: RootState) => state.businessCard.businessCards);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const dispatch = useDispatch();

    const loadBusinessCards = useCallback(async () => {
        try {
            const response = await fetchAllBusinesCards();
            dispatch(setBusinessCards(response));
        } catch (err) {
            toast.error(err as string);
        }
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            loadBusinessCards();
        }
    }, [isLoggedIn, loadBusinessCards]);

    const handleEdit = (id: number) => {
        console.log("Edit", id);

    };

    const handleDelete = (id: number) => {
        console.log("Delete", id);

    };

    if (!isLoggedIn) {
        return (<Redirecting></Redirecting>);
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
                                    <button className="btn btn-sm btn-light border" title="Edit" onClick={() => handleEdit(card.id)}>
                                        <i className="fas fa-edit text-primary"></i>
                                    </button>
                                    <button className="btn btn-sm btn-light border" title="Delete" onClick={() => handleDelete(card.id)}>
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