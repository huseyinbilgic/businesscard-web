"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { deleteBusinessCardById, fetchAllBusinesCards } from "@/lib/businessCard";
import { RootState } from "@/store";
import { setBusinessCards } from "@/store/businessCardSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Redirecting from "../components/Redirecting";
import GeneralModal, { GeneralModalRef } from "../modal/GeneralModal";
import BusinessCardForm from "../forms/BusinessCardForm";
import Confirm from "../modal/Confirm";

export default function Profile() {
    useAuthGuard()
    const businessCards = useSelector((state: RootState) => state.businessCard.businessCards);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const editSaveModalRef = useRef<GeneralModalRef>(null);
    const confirmModalRef = useRef<GeneralModalRef>(null);
    const dispatch = useDispatch();
    const [selectedBusinessCardId, setSelectedBusinessCardId] = useState<number | null>(null);

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

    const addOrEditBusinessCard = (id: number | null) => {
        setSelectedBusinessCardId(id);
        editSaveModalRef.current?.open();
    }

    const handleDelete = (id: number) => {
        setSelectedBusinessCardId(id);
        confirmModalRef.current?.open();

    };

    const applyDelete = async () => {
        try {
            await deleteBusinessCardById(selectedBusinessCardId!)
            loadBusinessCards();
            toast.success('Business Card deleted');
        } catch (error) {
            toast.error(error as string);
        } finally {
            closeConfirmModal();
        }
    }

    const closeConfirmModal = () => {
        setSelectedBusinessCardId(null);
        confirmModalRef.current?.close();
    }

    const closeBusinessCardFormModal = () => {
        editSaveModalRef.current?.close();
        loadBusinessCards();
    }

    if (!isLoggedIn) {
        return (<Redirecting></Redirecting>);
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-semibold">My Business Cards</h3>
                <button className="btn btn-primary rounded-pill px-4" onClick={() => addOrEditBusinessCard(null)}>
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
                                        <button className="btn btn-sm btn-light border" title="Edit" onClick={() => addOrEditBusinessCard(card.id)}>
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
            <GeneralModal ref={editSaveModalRef} title="Edit/Add Business Card">
                <BusinessCardForm businessCardId={selectedBusinessCardId} closeModal={closeBusinessCardFormModal}></BusinessCardForm>
            </GeneralModal>
            <GeneralModal ref={confirmModalRef} title="Confirm">
                <Confirm apply={applyDelete} close={closeConfirmModal}></Confirm>
            </GeneralModal>
        </div>);
}