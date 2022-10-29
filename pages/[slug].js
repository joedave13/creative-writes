/* eslint-disable @next/next/no-img-element */
import { auth, db } from '../utils/firebase';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Post from '../components/post';
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Details() {
    const router = useRouter();
    const routeData = router.query;
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [user, loading] = useAuthState(auth);

    const submitComment = async () => {
        if (!auth.currentUser) return router.push('/auth/login');

        if (!comment) {
            toast.error("Don't leave an empty comment 😥", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }

        const docRef = doc(db, 'posts', routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                comment,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                timestamp: Timestamp.now(),
            }),
        });

        setComment('');

        toast.success('You successfully added a comment 💬😁', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });
    };

    const getComments = async () => {
        if (loading) return;
        if (!user) return router.push('/auth/login');

        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setComments(snapshot.data().comments);
        });
        return unsubscribe;
    };

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    }, [router.isReady, user, loading]);

    return (
        <div>
            <Head>
                <title>Post Details | Creative Writes</title>
            </Head>
            <Post {...routeData}></Post>
            <div className='my-4'>
                <div className='flex'>
                    <input
                        type='text'
                        value={comment}
                        placeholder='Send a comment 💬'
                        onChange={(e) => setComment(e.target.value)}
                        className='bg-gray-800 w-full py-2 px-4 text-white text-sm rounded-l-lg'
                    />
                    <button
                        onClick={submitComment}
                        className='bg-cyan-500 text-white py-2 px-4 text-sm rounded-r-lg'
                    >
                        Comment
                    </button>
                </div>
                <div className='py-6'>
                    <h2 className='font-bold'>Recent Comments</h2>
                    {comments?.map((cmt) => (
                        <div
                            key={cmt.timestamp}
                            className='bg-white p-4 my-4 border-2'
                        >
                            <div className='flex items-center gap-2 mb-4'>
                                <img
                                    src={cmt.avatar}
                                    alt='user-image-profile'
                                    className='w-10 rounded-full'
                                />
                                <h2>{cmt.userName}</h2>
                            </div>
                            <h2>{cmt.comment}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
