"use client"
import s from "./styles.module.scss"
import { useAppSelector } from "@/store/hooks"
import Lists from "./_components/Lists"
import ListsActions from "./_components/ListActions"


export default function Content() {

    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)

    return (
        <div className={s.container}>
            <div className={s.content}>
                {selectedFolderID && 
                <>
                    <ListsActions selectedFolderID={selectedFolderID}/>
                    <Lists selectedFolderID={selectedFolderID}/>
                </>}
            </div>
        </div>
    )
}