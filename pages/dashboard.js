import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Head from 'next/head';
import Post from '../components/post';

export default function Dashboard() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    const getData = async () => {
        if (loading) return;
        if (!user) return route.push('/auth/login');

        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(
                snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        });

        return unsubscribe;
    };

    useEffect(() => {
        getData();
    }, [user, loading]);

    return (
        <div>
            <Head>
                <title>Creative Writes | My Dashboard</title>
            </Head>
            <h1>Your Post</h1>
            <div>
                {posts.map((post) => (
                    <Post key={post.id} {...post}>
                        <div className='flex gap-4'>
                            <button className='text-teal-600 flex items-center justify-center gap-2 py-2 text-sm'>
                                <AiFillEdit className='text-2xl' />
                                Edit
                            </button>
                            <button className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'>
                                <BsTrash2Fill className='text-2xl' />
                                Delete
                            </button>
                        </div>
                    </Post>
                ))}
            </div>
            <button
                className='font-medium text-white bg-gray-800 py-2 px-4 rounded-lg my-6'
                onClick={() => auth.signOut()}
            >
                Sign Out
            </button>
        </div>
    );
}