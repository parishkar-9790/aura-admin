import { AuthProvider, useAuthenticated, useLogout } from '@pankod/refine-core';
import { useNavigate } from "react-router-dom"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import { checkAccess } from 'utils/utils';

interface IUser {
    name: string;
    email: string;
    avatar: string;
}

export const AuthUser = () => {
    const { mutate: logout } = useLogout();
    const { isSuccess, isLoading, isError } = useAuthenticated();

    const [user, setUser] = useState<IUser | null>(null);
    const [access, setAccess] = useState<boolean>(true);
    const email = user?.email;

    const navigate = useNavigate();

    useEffect(() => {
        console.log("use effect");

        const userJson = localStorage.getItem('user');
        if (userJson) {
            const userObj: IUser = JSON.parse(userJson);

            if (!checkAccess(userObj.email)) {
                // Access denied
                setAccess(false);
            } else
                setUser(userObj);
        }
    }, []);

    if (!access && isSuccess) {
        console.log("Here!");

        toast.error("Sorry! You are not authorized to use the Aura Admin Dashboard.", {
            position: toast.POSITION.TOP_RIGHT
        });

        logout();
        navigate("/login");

        return <div></div>;
    }

    return (
        <div>
            {user && (
                <div>
                    {/*<h1>{username}</h1>*/}
                    <h2>User Profile</h2>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.avatar} alt="User Avatar" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                </div>
            )}
        </div>
    );
};
