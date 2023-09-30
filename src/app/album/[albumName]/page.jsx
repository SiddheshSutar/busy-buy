'use client'

import { collection, getDocs } from "firebase/firestore";
import { ALBUM_DB_NAME } from "../../../../constants";
import { db } from "../../../../fireStore";
import RootLayout from "@/app/layout";
import ImageList from "../../components/ImageList";

// export async function generateStaticParams() {
//     // const posts = await fetch('https://.../posts').then((res) => res.json())

//     const snapshot = await getDocs(collection(db, ALBUM_DB_NAME));
//     const albums = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data()
//     }));

//     return albums.map((album) => ({
//         name: album.name,
//     }))
// }

export default function Page({ params }) {
    return <>
        {/* <div>My Album: {params.albumName}</div> */}
        <ImageList album={params.albumName}/>
    </>
}