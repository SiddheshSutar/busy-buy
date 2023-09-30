'use client'
import React, { useEffect, useRef, useState } from 'react';
import formStyles from '../../assets/scss/form.module.scss'
import { ref } from 'firebase/storage';
import { db, storage } from '../../../../fireStore';
import CustomSnackbar from '../Snackbar';
import { DEFAULT_SNACKBAR_OBJECT, IMAGE_DB_NAME } from '../../../../constants';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

const ImageForm = ({
    album,
    editObj,
    setEditObj,
    setIsCrudSuccess,
    deleteSuccess,
    setDeleteSuccess
}) => {

    const [imagePath, setImagePath] = useState('')
    const [snackbarObj, setSnackbarObj] = useState(DEFAULT_SNACKBAR_OBJECT)

    const inp = useRef(null)

    const listRef = ref(storage, 'images');

    useEffect(() => {
        editObj && setImagePath(editObj.url)
    }, [editObj])

    useEffect(() => {
        if (deleteSuccess) {
            setSnackbarObj({
                open: true,
                severity: 'success',
                message: 'Image deleted successfully'
            })
            setIsCrudSuccess(true)
            setDeleteSuccess(false)
        } 
    }, [deleteSuccess])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!imagePath) {
            setSnackbarObj({
                open: true,
                severity: 'error',
                message: 'Please enter image path'
            })
            inp.current.focus()
            return
        }

        if(editObj) {
            if(!editObj.id) {
                setSnackbarObj({
                    open: true,
                    severity: 'success',
                    message: 'Some error occured while editing'
                })
                return
            }
            //edit flow
            const imageEditref = doc(db, IMAGE_DB_NAME, editObj.id);

            const newObj = {
                ...editObj,
                url: imagePath
            }
            const editres = await updateDoc(imageEditref, newObj);

            setIsCrudSuccess(true)
            setEditObj(null)
            setSnackbarObj({
                open: true,
                severity: 'success',
                message: 'Image edited successfully'
            })
        } else {
            // create flow
            const imageref = collection(db, IMAGE_DB_NAME);
            const docRef = await addDoc(imageref, {
                url: imagePath,
                album
            });
            setIsCrudSuccess(true)

            setSnackbarObj({
                open: true,
                severity: 'success',
                message: 'Image added successfully'
            })
        }
        setImagePath('')
        inp.current.focus()
    }


    return (
        <div className={`container ${formStyles['container']}`}>
            <div className={'styles.form'}>
                <form onSubmit={handleSubmit}>
                    {/* POC: to work on firebase upload - download later */}
                    {/* <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    {
                        // previewOpen && <img id="preview-img" alt="img" style={{ width: '100%' }} src={previewImage} />
                        true && <img id="preview-img" alt="img" width={100} height={100} src={previewImage} />
                    } */}
                    <input ref={inp} type='text' name="imagePath" value={imagePath}
                        onChange={e => {
                            setImagePath(e.target.value)
                        }}
                    />
                    <button type='submit' className={formStyles['btn-submit']}>
                        {editObj ? 'Update' : 'Create'}
                    </button>
                    {
                        imagePath && <button type='button'
                            className={formStyles['btn-clear']}
                            onClick={e => {
                                setImagePath('')
                                setEditObj && setEditObj(null)
                                inp.current.focus()
                            }}
                        >Clear</button>
                    }

                </form>
                <CustomSnackbar
                    open={snackbarObj.open}
                    onClose={() => setSnackbarObj(DEFAULT_SNACKBAR_OBJECT)}
                    message={snackbarObj.message}
                    severity={snackbarObj.severity}
                />
            </div>
        </div>
    )
}

export default ImageForm;