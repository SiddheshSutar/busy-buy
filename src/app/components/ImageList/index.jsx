"use client";
import styles from './index.module.scss'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ImageForm from '../ImageForm';
import { imagesStatic } from '../../../../helpers';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { IMAGE_DB_NAME } from '../../../../constants';
import { db } from '../../../../fireStore';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const ImageList = ({
    list = imagesStatic,
    album
}) => {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [openImage, setOpenImage] = useState('')
    const [editObj, setEditObj] = useState(null)
    const [isCrudSuccess, setIsCrudSuccess] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const router = useRouter()

    const fetchImages = async () => {
        setLoading(true)
        const snapshot = await getDocs(collection(db, IMAGE_DB_NAME));
        const images = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        setLoading(false)
        setImages(images)
    }

    useEffect(() => {
        fetchImages()
    }, [])

    useEffect(() => {
        if (isCrudSuccess) {
            fetchImages()
            setIsCrudSuccess(false)
        }
    }, [isCrudSuccess])

    const handleEdit = (e, obj) => {
        setEditObj(obj)
    }

    const handleDelete = async (id) => {
        const res = await deleteDoc(doc(db, IMAGE_DB_NAME, id))
        setDeleteSuccess(true)
    }

    const handleImageLoad = (e, imageSrc) => {
        console.log('hex; ', Object.keys(e.target))
        fetch(imageSrc)
            .then(res => res.blob())
            .then(res => console.log('hex; ', res))
    }

    return (
        <div className={styles['img-container']}>
            <ArrowBackIosNewIcon
                sx={{
                    color: '#d153fb',
                    cursor: 'pointer'
                }}
                titleAccess='Back'
                fontSize='large'
                onClick={e => {
                    router.back()
                }}
            />
            <ImageForm album={album}
                editObj={editObj} setEditObj={setEditObj}
                setIsCrudSuccess={setIsCrudSuccess}
                deleteSuccess={deleteSuccess}
                setDeleteSuccess={setDeleteSuccess}
            />
            {
                loading ?
                    <CircularProgress color="secondary" /> :
                    !images || images.length === 0 ?
                        <h1>No images found</h1> :
                        <div className={styles['img-list-container']}>
                            {
                                images
                                    .map(item => ({ ...item, url: item.url ?? item.name }))
                                    .map((imageObj, index) => {

                                        return <div key={index} className={styles['img-card']}>
                                            <img className={styles['img']} src={imageObj.url}
                                                alt={imageObj.url?.substring(0, 10)}
                                                onClick={e => {
                                                    setOpenImage(imageObj.url)
                                                }}
                                            />
                                            <div className={styles['icons']}>
                                                <ModeEditIcon className={styles['icon']} color="primary" fontSize='large'
                                                    onClick={e => handleEdit(e, imageObj)}
                                                />
                                                <DeleteForeverIcon className={styles['icon']} color="error" fontSize='large'
                                                    onClick={e => handleDelete(imageObj.id)}
                                                />
                                            </div>
                                        </div>
                                    })
                            }
                        </div>
            }
            <Dialog
                // selectedValue={selectedValue}
                maxWidth="lg"
                open={openImage}
                onClose={() => {
                    setOpenImage('')
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        setOpenImage('')
                    }}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent className={styles['dialog']}>
                    <img className={styles['img-open']} src={openImage}
                    // onLoad={(e) => handleImageLoad(e, openImage)}
                        alt={openImage}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ImageList;