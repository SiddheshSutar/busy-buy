import { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { useRouter } from 'next/navigation'
import { albumsStatic } from '../../../../helpers';
import AlbumForm from '../AlbumForm';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../../fireStore';
import { ALBUM_DB_NAME } from '../../../../constants';
import { CircularProgress } from '@mui/material';

const AlbumList = ({
    list = albumsStatic
}) => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [albums, setAlbums] = useState([])
    const [isCrudSuccess, setIsCrudSuccess] = useState(false)

    const handleAlbumClick = (e, albumObj) => {
        albumObj.name && router.push(`album/${albumObj.name}`)
    }

    const fetchAlbums = async () => {

        /** Kept for  reference, to delete unwanted albums when component loads */
        // const res = await deleteDoc(doc(db, ALBUM_DB_NAME, "DIJez1JezTyiJhbWtXhv"))

        setLoading(true)
        const snapshot = await getDocs(collection(db, ALBUM_DB_NAME));
        const albums = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log('hex: ', albums)
        setLoading(false)
        setAlbums(albums)
    }

    useEffect(() => {
        
        fetchAlbums()
    }, [])

    useEffect(() => {
        if (isCrudSuccess) {
            fetchAlbums()
            setIsCrudSuccess(false)
        }
    }, [isCrudSuccess])

    return (
        <div className={styles['album-container']}>
            <AlbumForm setIsCrudSuccess={setIsCrudSuccess}/>
            {
                loading ?
                    <CircularProgress color="secondary" /> :
                    !albums || albums.length === 0 ?
                        <h1>No albums found</h1> :
                        <div className={styles['album-list-container']}>
                            {

                                albums.map((albumObj, index) => {
                                    return <div key={index} className={styles['album-card']}
                                        onClick={e => handleAlbumClick(e, albumObj)}
                                    >
                                        <div className={styles['name']}>
                                            {albumObj.name}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
            }

        </div>
    );
}

export default AlbumList;