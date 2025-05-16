'use client';

import { fetchPrivacyUsersByBusinessCardId } from "@/lib/businessCardPrivacy";
import { PrivacyUser } from "@/models/response/PrivacyUser";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import debounce from 'lodash.debounce';
import { searchUser } from "@/lib/user";
import { Container, Form, Spinner, ListGroup, Button } from "react-bootstrap";

type Props = {
    businessCardId: number;
    closeModal: () => void;
};

export default function PrivacyUserForm({ businessCardId, closeModal }: Props) {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<PrivacyUser[]>([]);
    const [privacyUsers, setPrivacyUsers] = useState<PrivacyUser[]>([]);
    const [loading, setLoading] = useState(false);

    const loadPrivacyUsers = useCallback(async (id: number) => {
        if (!id) return;
        try {
            const response = await fetchPrivacyUsersByBusinessCardId(id);
            setPrivacyUsers(response);
        } catch (error) {
            toast.error(error as string);
        }
    }, []);

    const search = useMemo(() =>
        debounce(async (term: string) => {
            if (!term.trim()) {
                setResults([]);
                return;
            }

            try {
                setLoading(true);
                const res = await searchUser(term);
                setResults(res);
            } catch (err) {
                console.error('Arama hatası:', err);
            } finally {
                setLoading(false);
            }
        }, 400), []);

    useEffect(() => {
        loadPrivacyUsers(businessCardId);
    }, [businessCardId, loadPrivacyUsers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        search(value);
    };

    const handleSelectUser = (user: PrivacyUser) => {
        const alreadyExists = privacyUsers.some(u => u.id === user.id);
        if (!alreadyExists) {
            setPrivacyUsers(prev => [...prev, user]);
            setKeyword('');
            setResults([]);
        } else {
            toast.info("Bu kullanıcı zaten eklendi.");
        }
    };

    const handleRemoveUser = (id: number) => {
        setPrivacyUsers(prev => prev.filter(user => user.id !== id));
    };

    return (
        <Container className="p-4">
            <Form.Control
                type="text"
                placeholder="Kullanıcı ara..."
                className="p-3 rounded-4 shadow-sm border-0"
                style={{
                    backgroundColor: '#f0f2f5',
                    fontSize: '1rem',
                }}
                value={keyword}
                onChange={handleChange}
            />

            {loading && (
                <div className="text-center mt-3">
                    <Spinner animation="border" variant="secondary" />
                </div>
            )}

            <ListGroup className="mt-4 shadow-sm rounded-4 overflow-hidden">
                {results.map((user: PrivacyUser) => (
                    <ListGroup.Item
                        key={user.id}
                        className="py-2 px-3 d-flex justify-content-between align-items-center"
                        style={{
                            backgroundColor: '#ffffff',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleSelectUser(user)}
                    >
                        <span style={{ fontSize: '0.95rem' }}>{user.username}</span>
                        <i className="fas fa-plus-circle text-primary" style={{ fontSize: '1.2rem' }}></i>
                    </ListGroup.Item>

                ))}
            </ListGroup>

            {!loading && keyword && results.length === 0 && (
                <div className="text-muted text-center mt-3">Sonuç bulunamadı</div>
            )}

            {privacyUsers.length > 0 && (
                <div className="mt-5">
                    <h6 className="fw-semibold text-muted mb-3">Seçilen Kullanıcılar</h6>
                    <ListGroup className="shadow-sm rounded-4 overflow-hidden mb-3">
                        {privacyUsers.map((user: PrivacyUser) => (
                            <ListGroup.Item
                                key={user.id}
                                className="py-2 px-3 d-flex justify-content-between align-items-center"
                            >
                                <span style={{ fontSize: '0.95rem' }}>{user.username}</span>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemoveUser(user.id)}
                                >
                                    <i className="fas fa-trash-alt text-danger" style={{ fontSize: '1rem' }}></i>

                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}

            <Button
                className="w-100 mt-3 py-3 rounded-4 shadow-sm"
                variant="primary"
                onClick={() => closeModal()}
            >
                Kaydet
            </Button>
        </Container>

    );
}
