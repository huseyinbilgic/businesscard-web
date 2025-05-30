'use client';

import { fetchPrivacyUsersByBusinessCardId, savePrivacyUsersByBusinessCardId } from "@/lib/businessCardPrivacy";
import { PrivacyUser } from "@/models/response/PrivacyUser";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import debounce from 'lodash.debounce';
import { searchUser } from "@/lib/user";
import { Form, Spinner, ListGroup, Button } from "react-bootstrap";

type Props = {
    businessCardId: number;
    closeModal: () => void;
};

export default function PrivacyUserForm({ businessCardId, closeModal }: Props) {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<PrivacyUser[]>([]);
    const [privacyUsers, setPrivacyUsers] = useState<PrivacyUser[]>([]);
    const [loading, setLoading] = useState(false);

    const loadPrivacyUsers = useCallback(async () => {
        try {
            const response = await fetchPrivacyUsersByBusinessCardId(businessCardId);
            setPrivacyUsers(response);
        } catch (error) {
            toast.error(error as string);
            closeModal();
        }
    }, [businessCardId, closeModal]);

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
                console.error('Error during searching:', err);
            } finally {
                setLoading(false);
            }
        }, 400), []);

    useEffect(() => {
        loadPrivacyUsers();
    }, [loadPrivacyUsers]);

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
            toast.info("This user has already added.");
        }
    };

    const handleRemoveUser = (id: number) => {
        setPrivacyUsers(prev => prev.filter(user => user.id !== id));
    };

    const save = async () => {
        try {
            const userIds: number[] = privacyUsers.map(p => p.id)
            const response = await savePrivacyUsersByBusinessCardId(businessCardId, userIds);
            toast.success(response);
        } catch (error) {
            toast.error(error as string);
        }
        finally {
            closeModal();
        }
    }

    return (
        <div>
            <Form.Control
                type="text"
                placeholder="Search user..."
                className="p-3 rounded-4 shadow-sm border-0"
                style={{
                    backgroundColor: '#f0f2f5',
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
                        <span>{user.username}</span>
                        <i className="fas fa-plus-circle text-primary"></i>
                    </ListGroup.Item>

                ))}
            </ListGroup>

            {!loading && keyword && results.length === 0 && (
                <div className="text-muted text-center mt-3">No result found</div>
            )}

            {privacyUsers.length > 0 && (
                <div className="mt-4">
                    <h6 className="fw-semibold text-muted mb-3">Added users</h6>
                    <div className="d-flex flex-wrap gap-2">
                        {privacyUsers.map((user: PrivacyUser) => (
                            <div
                                key={user.id}
                                className="d-flex align-items-center border rounded-pill px-3 py-2"
                            >
                                <span className="me-2">{user.username}</span>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 m-0"
                                    onClick={() => handleRemoveUser(user.id)}
                                    style={{ lineHeight: 1 }}
                                >
                                    <i className="fas fa-times text-danger"></i>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Button
                className="w-100 mt-3 py-3 rounded-4 shadow-sm"
                variant="primary"
                onClick={save}
            >
                Save
            </Button>
        </div>

    );
}
