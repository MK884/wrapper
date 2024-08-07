import React from 'react';
import style from '../styles/create-new/shortLink.module.scss';
import Container from '../ui/Container';
import { CiGlobe } from 'react-icons/ci';
import { Avatar, Button, TextArea, TextInput } from '../ui';
import { FaRegImage } from 'react-icons/fa6';
import { MdOutlineContentCopy } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { getMetaData, getShortUrl } from '../services/urls';
import { usePrivateAxios } from '../services/api';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config';


function isValidHttpsUrl(url:string) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' && (!parsedUrl.hostname.includes('localhost') && parsedUrl.hostname !== '127.0.0.1');
    } catch (error) {
      return false;
    }
  }

interface Formfields {
    title?: string;
    description?: string;
    image?: string;
    avatar?: string;
    domain?: string;
}

let fetchData: { [key: string]: any } = {};

const CreateShortLink = () => {
    const privateAxios = usePrivateAxios();
    const navigate = useNavigate();

    const fileRef = React.useRef<HTMLInputElement | null>(null);

    const [ShowCopy, setShowCopy] = React.useState<boolean>(true);

    const [formFields, setFormFields] = React.useState<Formfields>({});

    const [originalUrlError, setOriginalUrlError] = React.useState<string>();
    const [originalUrl, setOriginalUrl] = React.useState<string>();
    const [shortUrl, setShortUrl] = React.useState<string>();
    const [imageUrl, setImageUrl] = React.useState<string>();
    const [imageFile, setImageFile] = React.useState<File>();

    const handleOriginalUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        let url = e?.target?.value;
        setOriginalUrlError('');
        setOriginalUrl(e?.target?.value);

        let trimeUrl = url?.trim();

        if (trimeUrl.length > 4) {
            if (!isValidHttpsUrl(url)) {
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
            console.log(originalUrl === fetchData?.originalUrl)
            if(fetchData?.originalUrl && originalUrl === fetchData?.originalUrl) return;
            console.log('fetch data');

            try {
                const { data } = await getMetaData(originalUrl, privateAxios);

                setImageFile(undefined);
                setImageUrl('');

                let metaData = {
                    avatar: data?.domainIcon,
                    description: data?.description,
                    image: data?.banner || data?.domainIcon,
                    title: data?.title,
                    domain: data?.domain,
                    originalUrl: data?.originalUrl
                };
                console.log(metaData);
                
                fetchData = metaData;

                setFormFields(fetchData);
            } catch (error) {
                console.error(error);
            }
        };
        const getData = setTimeout(() => {
            getMeta();
        }, 2000);

        return () => {
            clearTimeout(getData);
            fetchData = {}
        };
    }, [originalUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;

        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setImage = (imagePath: string) => {
        if (imagePath.length > 4) {
            clearImage();
            setFormFields((prev) => ({
                ...prev,
                image: imagePath,
            }));
        } else {
            clearImage();
        }
    };

    const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        let targetImageUrl = e?.target?.value;
        setImageUrl(targetImageUrl);
        setImageFile(undefined)
        if (isValidHttpsUrl(targetImageUrl)) {
            setImage(targetImageUrl);
        }
    };

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader?.result as string);
        };
        setImageFile(file);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setFormFields((prev) => ({
            ...prev,
            image: undefined,
        }));
    };

    const handleClearImageClick = () =>{
        setImageUrl("");
        setImageFile(undefined);
        clearImage();
    }

    const submitData = async () => {
        const Data: { [key: string]: any } = {};

        Data.originalUrl = originalUrl;

        if (
            formFields?.title !== fetchData?.title ||
            formFields?.description !== fetchData?.description ||
            formFields?.image !== fetchData?.image
        ) {
            Data.title = formFields.title;
            Data.description = formFields.description;
            Data.image = formFields.image ?? fetchData.image;
        }

        if(imageFile) Data.imageFile = imageFile && imageFile
        
        // console.log(Data);
        try {
            const response = await getShortUrl(Data, privateAxios);

            console.log(response?.data);
            let shortUrl = `${config.appURL}/${response.data.shortUrl}`

            setShortUrl(shortUrl);

            navigator.clipboard.writeText(shortUrl);
            toast.success("Copied short url to clipboard",{ autoClose: 3000})
            navigate(`/sl`, { replace: true });
            
        } catch (error) {
            console.error(error);
            
        }
    };
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
                                <Avatar src={formFields?.avatar} styles={{
                                    background:'white',
                                    border: 'none'
                                }}/>
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
                        {shortUrl && (
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
                                    value={shortUrl}
                                />
                                <div
                                    className={style['tool']}
                                    onClick={() => {
                                        setShowCopy(false);
                                        navigator.clipboard.writeText(
                                            shortUrl
                                        );
                                        setTimeout(
                                            () => setShowCopy(true),
                                            1000
                                        );
                                    }}
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
                            onclick={submitData}
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
                                    <div
                                        className={style['cross-icon']}
                                        onClick={handleClearImageClick}
                                        title="clear image"
                                    >
                                        <IoMdClose size="1.2rem" />
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
