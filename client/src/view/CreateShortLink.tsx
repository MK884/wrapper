import React from 'react';
import style from '../styles/create-new/shortLink.module.scss';
import Container from '../ui/Container';
import { CiGlobe } from 'react-icons/ci';
import { Avatar, Button, TextArea, TextInput } from '../ui';
import { FaRegImage } from 'react-icons/fa6';
import { MdOutlineContentCopy } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { getMetaData } from '../services/urls';
import { usePrivateAxios } from '../services/api';
import { IoMdClose } from "react-icons/io";


const isValidUrl = (url: string): boolean => {
    // taken from chatgpt https://chatgpt.com/share/09f9b7b1-dced-4f69-9e65-9e9399adf93b
    // const regExForValidUrl = new RegExp(
    //     '^https://(?!localhost)([a-zA-Z0-9-]+.)+[a-zA-Z]{2,}(/[^s]*)?$'
    // );

    try {
        const regExForValidUrl = new RegExp(
            '^https://(?!localhost)([a-zA-Z0-9-]+.)+[a-zA-Z]{2,}(/[^s]*)?$'
        );

        return regExForValidUrl.test(url);
    } catch (error) {
        return false;
    }
};

interface Formfields {
    title?: string;
    description?: string;
    image?: string;
    avatar?: string;
    domain?: string;
}

const CreateShortLink = () => {
    const privateAxios = usePrivateAxios();

    const fileRef = React.useRef<HTMLInputElement | null>(null);

    const [ShowCopy, setShowCopy] = React.useState<boolean>(true);

    const [formFields, setFormFields] = React.useState<Formfields>({});

    const [originalUrlError, setOriginalUrlError] = React.useState<string>();
    const [originalUrl, setOriginalUrl] = React.useState<string>();
    const [imageUrl, setImageUrl] = React.useState<string>();

    const handleOriginalUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        let url = e?.target?.value;
        setOriginalUrlError('');
        setOriginalUrl(e?.target?.value);

        let trimeUrl = url?.trim();

        if (trimeUrl.length > 4) {
            if (!isValidUrl(url)) {
                let error = !url.startsWith('https')
                    ? 'Url must start with https'
                    : url.includes('localhost')
                      ? 'Cannot procced with localhost'
                      : 'Invalid URL';
                setOriginalUrlError(error);
            }
        }
    };

    React.useEffect(() => {
        const getMeta = async () => {
            if (!originalUrl || originalUrlError) return;
            console.log('fetch data');

            try {
                const { data } = await getMetaData(originalUrl, privateAxios);
                console.log(data);

                let metaData = {
                    avatar: data?.domainIcon,
                    description: data?.description,
                    image: data?.banner || data?.domainIcon,
                    title: data?.title,
                    domain: data?.domain,
                };

                setFormFields(metaData);
            } catch (error) {
                console.error(error);
            }
        };
        const getData = setTimeout(() => {
            getMeta();
        }, 2000);

        return () => clearTimeout(getData);
    }, [originalUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;

        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setImage = (imagePath: string) => {
        if (imagePath.length < 4) {
            setFormFields((prev) => ({
                ...prev,
                image: "",
            }));
        } else {
            setFormFields((prev) => ({
                ...prev,
                image: imagePath,
            }));
        }
    };

    const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        let imageUrl = e?.target?.value;
        setImageUrl(imageUrl);
        setImage(imageUrl);
    };

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => [setImage(reader?.result as string)];

        reader.readAsDataURL(file);
    };

    const clearImage = () =>{
        setFormFields(prev=>({
            ...prev,
            image: ""
        }));
        setImageUrl("")
    }

    // const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     let image = e.target.value;
    //     setImageUrl(image);
    //     setFormFields((prev) => ({
    //         ...prev,
    //         coverImage: image,
    //     }));
    //     if (e?.target?.value === '') {
    //         setIsDisable(false);
    //     } else {
    //         setIsDisable(true);
    //     }
    // };

    // const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target?.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setFormFields((prev) => ({
    //                 ...prev,
    //                 coverImage: reader?.result as string,
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value, name } = e?.target;

    //     setFormFields((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    // const handleOriginalUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormFields((prev) => ({
    //         ...prev,
    //         originalUrl: e?.target?.value,
    //     }));

    //     const { error } = schema.safeParse(formFields);

    //     setOriginalUrlError('');

    //     if (error) {
    //         let urlError = error?.formErrors?.fieldErrors?.originalUrl?.[0];
    //         setOriginalUrlError(urlError || '');
    //     }
    // };

    // const takeMetaData = async () => {
    //     if (originalUrlError?.length) return;

    //     let url = formFields?.originalUrl;

    //     if (!url) return;

    //     try {
    //         const response = await getMetaData(url, privateAxios);
    //         console.log(response);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const updatePreview = () => {
    //     console.log('update preview');

    //     if (formFields?.originalUrl?.includes('localhost')) {
    //         setOriginalUrlError('Url can not contain localhost');
    //         return;
    //     }
    //     if (originalUrlError?.length) return;

    //     takeMetaData();
    //     console.log(formFields);
    // };

    return (
        <div className={style['main']}>
            <Button
                label="Back"
                styles={{
                    marginBottom: '1rem',
                }}
                Icon={IoMdArrowRoundBack}
                onclick={() => history.back()}
            />
            <Container
                hoverEffect={false}
                className={style['tool-container']}
                styles={{
                    overflowY: 'auto',
                }}
            >
                <div className={style['inputs']}>
                    <div className={style['header']}>
                        <div className={style['icon']}>
                            {formFields?.avatar ? (
                                <Avatar src={formFields?.avatar} />
                            ) : (
                                <CiGlobe size="1.4rem" />
                            )}
                        </div>
                        <h4>Create New Link</h4>
                    </div>
                    <div className={style['body']}>
                        <div className={style['link-redirect']}>
                            <h5>Redirect URL</h5>
                            <TextInput
                                fullWidth
                                styles={{
                                    marginTop: '1rem',
                                }}
                                name="originalUrl"
                                placeholder="https://example.com"
                                onChange={handleOriginalUrl}
                                value={originalUrl}
                            />
                            {originalUrlError && (
                                <p className="error">{originalUrlError}</p>
                            )}
                        </div>
                        <div className={style['link-title']}>
                            <h5>Title</h5>
                            <TextInput
                                fullWidth
                                styles={{
                                    marginTop: '1rem',
                                }}
                                placeholder="Enter Link Title"
                                name="title"
                                value={formFields?.title ?? ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={style['link-desc']}>
                            <h5>Description</h5>
                            <TextArea
                                fullWidth
                                placeholder="Enter Link Description"
                                styles={{
                                    marginTop: '1rem',
                                }}
                                name="description"
                                value={formFields?.description ?? ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <h5
                                style={{
                                    marginBottom: '1rem',
                                }}
                            >
                                Image
                            </h5>
                            <div className={style['link-image']}>
                                <TextInput
                                    fullWidth
                                    placeholder="Enter Image URL"
                                    onChange={handleImageUrl}
                                    value={imageUrl}
                                />
                                <p>OR</p>
                                <Button
                                    label="Select Image"
                                    styles={{
                                        minWidth: 'max-content',
                                    }}
                                    onclick={() => fileRef?.current?.click()}
                                    disabled={imageUrl ? true : false}
                                />
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={fileRef}
                                    onChange={handleImageFile}
                                />
                            </div>
                        </div>
                        {false && (
                            <div className={style['short-link']}>
                                <h5>Your Short Link</h5>
                                <TextInput
                                    fullWidth
                                    styles={{
                                        marginTop: '1rem',
                                    }}
                                    placeholder="short Link"
                                    readOnly
                                    name="shortUrl"
                                />
                                <div
                                    className={style['tool']}
                                    // onClick={() => {
                                    //     setShowCopy(false);
                                    //     navigator.clipboard.writeText(
                                    //         formFields?.shortUrl as string
                                    //     );

                                    //     setTimeout(
                                    //         () => setShowCopy(true),
                                    //         1000
                                    //     );
                                    // }}
                                >
                                    {ShowCopy ? (
                                        <MdOutlineContentCopy />
                                    ) : (
                                        <IoMdDoneAll color="green" />
                                    )}
                                </div>
                            </div>
                        )}
                        <Button
                            label="Generate Link"
                            fullWidth
                            onclick={() => {}}
                            disabled={
                                originalUrl && originalUrl?.length > 4
                                    ? false
                                    : true
                            }
                        />
                    </div>
                </div>

                <div className={style['preview']}>
                    <div className={style['header']}>
                        <h4>Preview</h4>
                    </div>
                    <div className={style['preview-box']}>
                        <div className={`${style['preview-image']}`}>
                            {formFields?.image ? (
                                <>
                                <img
                                    src={formFields?.image}
                                    alt="Cover Image"
                                />
                                <div className={style['cross-icon']} onClick={clearImage}>
                                    <IoMdClose />
                                </div>
                                </>
                            ) : (
                                <>
                                    <FaRegImage />
                                    <p>Enter a link to generate preview</p>
                                </>
                            )}
                        </div>
                        <div className={style['preview-meta']}>
                            <div
                                className={`${style['domain']} ${formFields?.domain && style['active']}`}
                            >
                                {formFields?.domain}
                            </div>
                            <div
                                className={`${style['title']} ${formFields?.title && style['active']}`}
                            >
                                {formFields?.title}
                            </div>
                            <div
                                className={`${style['desc']} ${formFields?.description && style['active']}`}
                            >
                                {formFields?.description}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default CreateShortLink;
