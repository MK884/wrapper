import { toast } from 'react-toastify';
import { useAppSelector } from '../app/hook';
import { isLoggedIn } from '../features/auth/authSlice';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const RequireAuth = () => {
    const userLoggedIn = useAppSelector(isLoggedIn);
    const location = useLocation();

    return (
        <>
            {userLoggedIn ? (
                <Outlet />
            ) : (
                <>
                    {toast.loading('Redirecting to Login ...', {
                        autoClose: 100,
                        isLoading: false,
                        toastId: 'unautherized',
                    })}
                    <Navigate
                        to="/get-start"
                        state={{ from: location }}
                        replace
                    />
                </>
            )}
        </>
    );
};

export default RequireAuth;
