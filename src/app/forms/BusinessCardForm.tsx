'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ContactType } from '@/models/enums/ContactType';
import { PrivacyStatus } from '@/models/enums/PrivacyStatus';
import { RefObject, useCallback, useEffect } from 'react';
import { fetchAllBusinesCards, fetchBusinessCardById, saveNewBusinessCardByUsername, updateBusinessCardById } from '@/lib/businessCard';
import { toast } from 'react-toastify';
import { BusinessCardRequest } from '@/models/requests/BusinessCardRequest';
import { mapBusinessCardResponseToFormData } from '../mapper/BusinessCardMapper';
import { GeneralModalRef } from '../modal/GeneralModal';
import { useDispatch } from 'react-redux';
import { setBusinessCards } from '@/store/businessCardSlice';

type Props = {
    businessCardId: number | null;
    modalRef: RefObject<GeneralModalRef | null>;
};

const privacyOptions: PrivacyStatus[] = [
    PrivacyStatus.PUBLIC,
    PrivacyStatus.PRIVATE,
    PrivacyStatus.RESTRICTED,
];

const contactTypeOptions: ContactType[] = [
    ContactType.PHONE,
    ContactType.EMAIL,
    ContactType.WEBSITE,
    ContactType.ADDRESS,
    ContactType.SOCIAL,
];

const contactSchema = yup.object({
    id: yup.number(),
    contactType: yup.mixed<ContactType>().oneOf(contactTypeOptions).required('ContactType is required'),
    label: yup.string().required('Label is required').max(255),
    contactValue: yup.string().required('Value is required').max(255),
});

const schema = yup.object({
    fullName: yup.string().required('Fullname is required').max(255),
    company: yup.string().max(255).required().default(''),
    jobTitle: yup.string().max(255).required().default(''),
    aboutIt: yup.string().required().default(''),
    privacy: yup.mixed<PrivacyStatus>().oneOf(privacyOptions).required('Privacy is required'),
    contactsRequests: yup.array().of(contactSchema).required(),
});

type BusinessCardFormData = yup.InferType<typeof schema>;

export default function BusinessCardForm({ businessCardId, modalRef }: Props) {
    const {
        register,
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<BusinessCardFormData>({
        mode: "all",
        resolver: yupResolver(schema),
        defaultValues: {
            contactsRequests: [],
        }
    });

    const dispatch = useDispatch();


    const loadBusinessCards = useCallback(async () => {
        try {
            const response = await fetchAllBusinesCards();
            dispatch(setBusinessCards(response));
        } catch (err) {
            toast.error(err as string);
        }
    }, [dispatch]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contactsRequests',
    });

    const onSubmit = async (data: BusinessCardFormData) => {
        if (businessCardId === null) {
            await saveNewBusinessCard(data as BusinessCardRequest);
            return;
        }
        await updateBusinessCard(data as BusinessCardRequest);
    };

    const saveNewBusinessCard = async (data: BusinessCardRequest) => {
        try {
            await saveNewBusinessCardByUsername(data);
            modalRef.current?.close();
            await loadBusinessCards();
            toast.success('Business card saved successfully');
        } catch (error) {
            if (typeof error === "string") {
                toast.error(error);
                return;
            }
            setErrors(error as object);
        }
    }

    const updateBusinessCard = async (data: BusinessCardRequest) => {
        try {
            await updateBusinessCardById(businessCardId!, data);
            modalRef.current?.close();
            await loadBusinessCards();
            toast.success('Business card saved successfully');
        } catch (error) {
            if (typeof error === "string") {
                toast.error(error);
                return;
            }
            setErrors(error as object);
        }
    }

    const setErrors = (error: object) => {
        for (const [key, value] of Object.entries(error)) {
            setError(key as keyof BusinessCardFormData, {
                type: "server",
                message: value.join(" \n "),
            });
        }
    }

    const loadBusinessCardById = useCallback(
        async (id: number | null) => {
            if (id === null) {
                reset({});
                return;
            }
            try {
                const response = await fetchBusinessCardById(id);
                reset(mapBusinessCardResponseToFormData(response));
            } catch (error) {
                toast.error(error as string);
            }
        },
        [reset]);

    useEffect(() => {
        loadBusinessCardById(businessCardId);
    }, [businessCardId, loadBusinessCardById]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control {...register('fullName')} isInvalid={!!errors.fullName} />
                <Form.Control.Feedback type="invalid">
                    {errors.fullName?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control {...register('company')} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Job Title</Form.Label>
                <Form.Control {...register('jobTitle')} /* isInvalid={!!errors.jobTitle} */ />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>About</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('aboutIt')} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Privacy</Form.Label>
                <Form.Select {...register('privacy')} isInvalid={!!errors.privacy}>
                    <option value="">Select</option>
                    {privacyOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.privacy?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <hr />
            <h5>Contacts</h5>

            {fields.map((field, index) => (
                <div key={field.id} className="border rounded p-3 mb-3">
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    {...register(`contactsRequests.${index}.contactType`)}
                                    isInvalid={!!errors.contactsRequests?.[index]?.contactType}
                                >
                                    <option value="">Select</option>
                                    {contactTypeOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.contactsRequests?.[index]?.contactType?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Label</Form.Label>
                                <Form.Control
                                    {...register(`contactsRequests.${index}.label`)}
                                    isInvalid={!!errors.contactsRequests?.[index]?.label}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.contactsRequests?.[index]?.label?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Value</Form.Label>
                                <Form.Control
                                    {...register(`contactsRequests.${index}.contactValue`)}
                                    isInvalid={!!errors.contactsRequests?.[index]?.contactValue}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.contactsRequests?.[index]?.contactValue?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={1} className="d-flex align-items-end">
                            <Button variant="danger" onClick={() => remove(index)}>
                                <i className="fas fa-times" />
                            </Button>
                        </Col>
                    </Row>
                </div>
            ))}

            <Button variant="outline-primary" onClick={() => append({ contactType: ContactType.PHONE, label: '', contactValue: '' })}>
                Yeni İletişim Ekle
            </Button>

            <hr />

            <Button type="submit" className="mt-3" variant="primary">
                Gönder
            </Button>
        </Form>
    );
}
