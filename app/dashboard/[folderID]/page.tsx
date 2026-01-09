"use client"


import { use, useEffect } from "react"
import ListsActions from "./_components/ListActions"
import Lists from "./_components/Lists"
import Search from "../_components/Search"
import s from "./styles.module.scss"
import { useDashboardContext } from "@/context/DashboardContext"


export default function FolderPage({ params }: { params: Promise<{ folderID: string }> }) {


    const {folderID} = use(params)
    const {setSelectedFolderID} = useDashboardContext()

    useEffect(() => {
        if(folderID){
            setSelectedFolderID(folderID)
        }
    }, [folderID])

    return (
        <div className={s.container}>
            <ListsActions/>
            <Lists/>
        </div>
    )
}