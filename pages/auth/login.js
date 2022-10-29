import { FcGoogle } from 'react-icons/fc';
import { AiFillFacebook } from 'react-icons/ai';
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import Head from 'next/head';

export default function Login() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);

    const googleProvider = new GoogleAuthProvider();

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    const facebookProvider = new FacebookAuthProvider();

    const facebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const credential = await FacebookAuthProvider.credentialFromResult(
                result
            );
            const token = credential.accessToken;
            let photoUrl =
                result.user.photoURL + '?height=500&access_token=' + token;
            await updateProfile(auth.currentUser, { photoURL: photoUrl });
            route.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            route.push('/');
        } else {
            console.log('Login');
        }
    }, [user]);

    return (
        <>
            <Head>
                <title>Login Page | Creative Writes</title>
            </Head>
            <div className='shadow-xl mt-32 p-10 text-gray-700 rounded-lg'>
                <h2 className='text-2xl font-medium'>Join Today</h2>
                <div className='py-4'>
                    <h3 className='py-4'>Sign in with one of the providers</h3>
                </div>
                <div className='flex flex-col gap-4'>
                    <button
                        onClick={googleLogin}
                        className='text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2'
                    >
                        <FcGoogle className='text-2xl' />
                        Sign In with Google
                    </button>
                    <button
                        onClick={facebookLogin}
                        className='text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2'
                    >
                        <AiFillFacebook className='text-2xl text-blue-400' />
                        Sign In with Facebook
                    </button>
                </div>
            </div>
        </>
    );
}
