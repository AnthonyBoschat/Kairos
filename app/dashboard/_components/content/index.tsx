"use client"
import s from "./styles.module.scss"
import Lists from "./_components/Lists"
import ListsActions from "./_components/ListActions"
import Search from "./_components/Search"
import { useDashboardContext } from "@/context/DashboardContext"


export default function Content() {

    const {selectedFolderID} = useDashboardContext()

    return (
        <div className={s.container}>
            <div className={s.content}>
                <Search/>
                {selectedFolderID && 
                    <>
                        <ListsActions selectedFolderID={selectedFolderID}/>
                        <Lists selectedFolderID={selectedFolderID}/>
                    </>
                }
            </div>
        </div>
    )
}