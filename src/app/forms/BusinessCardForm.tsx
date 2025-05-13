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
import FormInput from '../login/components/FormInput';
import { OptionModel } from './common/OptionModel';


const privacyOptions: OptionModel[] = [
    { label: PrivacyStatus.PUBLIC, value: PrivacyStatus.PUBLIC },
    { label: PrivacyStatus.PRIVATE, value: PrivacyStatus.PRIVATE },
    { label: PrivacyStatus.RESTRICTED, value: PrivacyStatus.RESTRICTED }
];

const contactTypeOptions: OptionModel[] = [
    { label: ContactType.PHONE, value: ContactType.PHONE },
    { label: ContactType.EMAIL, value: ContactType.EMAIL },
    { label: ContactType.WEBSITE, value: ContactType.WEBSITE },
    { label: ContactType.ADDRESS, value: ContactType.ADDRESS },
    { label: ContactType.SOCIAL, value: ContactType.SOCIAL },
];

const contactSchema = yup.object({
    id: yup.number(),
    contactType: yup.mixed<ContactType>().oneOf(contactTypeOptions.map(p => p.label as ContactType)).required('ContactType is required'),
    label: yup.string().required('Label is required').max(255),
    contactValue: yup.string().required('Value is required').max(255),
});

const schema = yup.object({
    fullName: yup.string().required('Fullname is required').max(255),
    company: yup.string().max(255).required().default(''),
    jobTitle: yup.string().max(255).required().default(''),
    aboutIt: yup.string().required().default(''),
    privacy: yup.mixed<PrivacyStatus>().oneOf(privacyOptions.map(p => p.label as PrivacyStatus)).required('Privacy is required'),
    contactsRequests: yup.array().of(contactSchema).required(),
});

type BusinessCardFormData = yup.InferType<typeof schema>;

type Props = {
    businessCardId: number | null;
    modalRef: RefObject<GeneralModalRef | null>;
};

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
        defaultValues: { contactsRequests: [] },
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

    const { fields, append, remove } = useFieldArray({ control, name: 'contactsRequests' });

    const onSubmit = async (data: BusinessCardFormData) => {
        if (businessCardId === null) {
            await saveNewBusinessCard(data as BusinessCardRequest);
        } else {
            await updateBusinessCard(data as BusinessCardRequest);
        }
    };

    const saveNewBusinessCard = async (data: BusinessCardRequest) => {
        try {
            await saveNewBusinessCardByUsername(data);
            modalRef.current?.close();
            await loadBusinessCards();
            toast.success('Business card saved successfully');
        } catch (error) {
            handleError(error);
        }
    };

    const updateBusinessCard = async (data: BusinessCardRequest) => {
        try {
            await updateBusinessCardById(businessCardId!, data);
            modalRef.current?.close();
            await loadBusinessCards();
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
                Yeni İletişim Ekle
            </Button>

            <hr />
            <Button type="submit" className="mt-3" variant="primary">
                Gönder
            </Button>
        </Form>
    );
}
