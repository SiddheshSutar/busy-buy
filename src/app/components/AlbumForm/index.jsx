import { useRef, useState } from 'react'
import formStyles from '../../assets/scss/form.module.scss'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../../../fireStore'
import { ALBUM_DB_NAME, DEFAULT_SNACKBAR_OBJECT } from '../../../../constants'
import CustomSnackbar from '@/app/components/Snackbar'

const AlbumForm = ({
    setIsCrudSuccess
}) => {

    const [albumName, setAlbumName] = useState('')
    const [snackbarObj, setSnackbarObj] = useState(DEFAULT_SNACKBAR_OBJECT)

    const inp = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!albumName) {
            setSnackbarObj({
                open: true,
                severity: 'error',
                message: 'Please enter album name'
            })
            inp.current.focus()
            return
        }

        const albumRef = collection(db, ALBUM_DB_NAME);
        const docRef = await addDoc(albumRef, {
            name: albumName
        });
        setSnackbarObj({
            open: true,
            severity: 'success',
            message: 'Album added successfully'
        })
        setIsCrudSuccess(true)

        inp.current.focus()
    }
    return (
        <div className={formStyles['container']}>
            <form onSubmit={handleSubmit}>
                <input ref={inp} type='text' name="albumname" value={albumName}
                    onChange={e => {
                        setAlbumName(e.target.value)
                    }}
                />
                <button type='submit' className={formStyles['btn-submit']}>Create</button>
                {
                    albumName &&
                    <button type='button' className={formStyles['btn-clear']}
                        onClick={e => {
                            setAlbumName('')
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
    );
}

export default AlbumForm;