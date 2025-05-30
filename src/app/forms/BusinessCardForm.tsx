'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ContactType } from '@/models/enums/ContactType';
import { useCallback, useEffect } from 'react';
import { fetchBusinessCardById, saveNewBusinessCardByUsername, updateBusinessCardById } from '@/lib/businessCard';
import { toast } from 'react-toastify';
import { BusinessCardRequest } from '@/models/requests/BusinessCardRequest';
import { mapBusinessCardFormDataToBusinessCardRequest, mapBusinessCardResponseToFormData } from '../mapper/BusinessCardMapper';
import FormInput from '../login/components/FormInput';
import { BusinessCardFormData, businessCardSchema, contactTypeOptions, privacyOptions } from './form-data/BusinessCardFormData';

type Props = {
    businessCardId: number | null;
    closeModal: () => void;
};

export default function BusinessCardForm({ businessCardId, closeModal }: Props) {
    const {
        register,
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<BusinessCardFormData>({
        mode: "all",
        resolver: yupResolver(businessCardSchema),
        defaultValues: { contactsRequests: [] },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'contactsRequests' });

    const onSubmit = async (data: BusinessCardFormData) => {
        const request = mapBusinessCardFormDataToBusinessCardRequest(data)
        if (businessCardId === null) {
            await saveNewBusinessCard(request);
        } else {
            await updateBusinessCard(request);
        }
    };

    const saveNewBusinessCard = async (data: BusinessCardRequest) => {
        try {
            await saveNewBusinessCardByUsername(data);
            closeModal();
            toast.success('Business card saved successfully');
        } catch (error) {
            handleError(error);
        }
    };

    const updateBusinessCard = async (data: BusinessCardRequest) => {
        try {
            await updateBusinessCardById(businessCardId!, data);
            closeModal()
            toast.success('Business card saved successfully');
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error: unknown) => {
        if (typeof error === 'string') {
            toast.error(error);
            return;
        }
        for (const [key, value] of Object.entries(error as Record<string, string[]>)) {
            setError(key as keyof BusinessCardFormData, {
                type: 'server',
                message: value.join(' \n '),
            });
        }
    };

    const loadBusinessCardById = useCallback(async (id: number | null) => {
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
    }, [reset]);

    useEffect(() => {
        loadBusinessCardById(businessCardId);
    }, [businessCardId, loadBusinessCardById]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormInput label="Full Name" name="fullName" type="text" register={register} error={errors.fullName} isInvalid={!!errors.fullName} />
            <FormInput label="Company" name="company" type="text" register={register} error={errors.company} isInvalid={!!errors.company} />
            <FormInput label="Job Title" name="jobTitle" type="text" register={register} error={errors.jobTitle} isInvalid={!!errors.jobTitle} />
            <FormInput label="About" name="aboutIt" type="textarea" as='textarea' register={register} error={errors.aboutIt} isInvalid={!!errors.aboutIt} />
            <FormInput label="Privacy" name="privacy" type="select" as='select' options={privacyOptions} register={register} error={errors.privacy} isInvalid={!!errors.privacy} />

            <hr />
            <h5>Contacts</h5>

            {fields.map((field, index) => (
                <div key={field.id} className="border rounded p-3 mb-3">
                    <Row>
                        <Col md={4}>
                            <FormInput
                                label="Type"
                                name={`contactsRequests.${index}.contactType`}
                                type="select"
                                as='select'
                                options={contactTypeOptions}
                                register={register}
                                error={errors.contactsRequests?.[index]?.contactType}
                                isInvalid={!!errors.contactsRequests?.[index]?.contactType}
                            />
                        </Col>
                        <Col md={4}>
                            <FormInput
                                label="Label"
                                name={`contactsRequests.${index}.label`}
                                type="text"
                                register={register}
                                error={errors.contactsRequests?.[index]?.label}
                                isInvalid={!!errors.contactsRequests?.[index]?.label}
                            />
                        </Col>
                        <Col md={3}>
                            <FormInput
                                label="Value"
                                name={`contactsRequests.${index}.contactValue`}
                                type="text"
                                register={register}
                                error={errors.contactsRequests?.[index]?.contactValue}
                                isInvalid={!!errors.contactsRequests?.[index]?.contactValue}
                            />
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
                Add New Contact
            </Button>

            <hr />
            <div className='d-flex justify-content-end'>
                <Button type="submit" variant="primary">
                    Save
                </Button>
            </div>
        </Form>
    );
}
