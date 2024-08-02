// login, register, logout, updateDetails, updateavatar, deleteUser
import publicAxios from '../api';
import { AxiosError, AxiosInstance } from 'axios';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    userDetails: {
        accessToken: string;
        email: string;
        avatar?: string;
        fullName: string;
    };
}

const login = async ({
    email,
    password,
}: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await publicAxios.post('/user/login', {
            email,
            password,
        });
        return response.data?.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const serverError = error.response.data;

            console.error('Server error of Login: ', serverError?.message);

            throw new Error(serverError?.message || 'Server Error');
        }
        console.error('Login error', error);
        throw new Error('Login Error due to some reasone');
    }
};

interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    avatar?: File;
}

interface RegisterResponse {
    email: string;
    fullName: string;
    avatar?: string;
}

const register = async ({
    email,
    fullName,
    password,
    avatar,
}: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('fullName', fullName);
        formData.append('password', password);
        if (avatar) formData.append('avatar', avatar);

        const response = await publicAxios.post('/user/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            const serverError = error?.response?.data;

            console.error('Server error of Register: ', serverError);

            throw new Error(serverError?.message || 'Register failed');
        }
        console.error('Register error', error);

        throw new Error('Unexpected RegisterError');
    }
};

const logout = async (axios: AxiosInstance) => {
    try {
        const respnse = await axios.get('/user/logout');
        return respnse.data;
    } catch (error) {
        console.error('Logout error', error);
        throw error;
    }
};

const updateAvatar = async (file: File, axios: AxiosInstance) => {

    if (!file) return "No file specified";

    const formData = new FormData();

    formData.append('avatar', file);

    try {
        const response = await axios.patch('/user/update-avatar', formData, {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;
            console.error(
                'server error for updateAvatar',
                serverError
            );

            throw new Error(serverError?.message || 'Avatar failed to update');
        }

        console.error('UpdateAvatar error', error);

        throw new Error('Unexpected error in updateAvatar');
    }
};

interface updateDetailsProps {
    email?: string;
    fullName?: string;
}

const updateDetails = async (
    { email, fullName }: updateDetailsProps,
    axios: AxiosInstance
): Promise<updateDetailsProps | any> => {
    if (!(email || fullName)) return 'No email or full name';

    let userData: { [key: string]: string } = {};

    if (email) userData.email = email;
    if (fullName) userData.fullName = fullName;
    try {
        const response = await axios.patch('/user/update-user', userData);

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;

            console.error(
                'Server error for updateDetails',
                serverError?.message
            );
            throw new Error(serverError?.message || 'Failed to update details');
        }

        console.error('updateDetails error', error);
        throw new Error('Unexpected error in updateDetails');
    }
};

const deleteUser = async (axios: AxiosInstance) => {
    try {
        const response = await axios.delete('/user/delete');

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;
            console.error('Server error for deleteUser', serverError?.message);
            throw new Error(serverError?.message || 'Failed to delete Account');
        }
        console.error('Deleteuser  Error', error);
        throw new Error('Unexpected error in deleting..');
    }
};

export { login, register, logout, updateAvatar, updateDetails, deleteUser };
