import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Post from '../components/post';
import { db } from '../utils/firebase';

export default function Home() {
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(
                snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        });

        return unsubscribe;
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div>
            <Head>
                <title>Creative Writes | Home</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='my-12 text-lg font-medium'>
                <h2>See what other people are saying</h2>

                {posts.map((post) => (
                    <Post key={post.id} {...post}></Post>
                ))}
            </div>
        </div>
    );
}
