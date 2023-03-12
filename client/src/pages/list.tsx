import { useEffect, useState } from 'react';

interface IUser {
    name: string;
    email: string;
    avatar: string;
}

export const PostList = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const email = user?.email;
    const username = email?.split("@")[0];

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const userObj: IUser = JSON.parse(userJson);
            setUser(userObj);
        }
    }, []);

    return (
        <div>
            {user && (
                <div>
                    <h1>{username}</h1>
                    <h2>User Profile</h2>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.avatar} alt="User Avatar" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                </div>
            )}
        </div>
    );
};
