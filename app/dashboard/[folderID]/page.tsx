"use client"


import { use, useEffect } from "react"
import s from "./styles.module.scss"
import { useDashboardContext } from "@/context/DashboardContext"
import StandaloneListView from "./_components/StandaloneListView"
import AllListsView from "./_components/AllListsView"


export default function FolderPage({ params, searchParams }: { 
    params: Promise<{ folderID: string }> 
    searchParams: Promise<{ stantaloneID?: string }>
}) {
    
    const { folderID } = use(params)
    const { stantaloneID } = use(searchParams)
    const { setSelectedFolderID } = useDashboardContext()

    useEffect(() => {
        if (folderID) setSelectedFolderID(folderID)
    }, [folderID])

    return (
        <div className={s.container}>
            {stantaloneID 
                ? <StandaloneListView listId={stantaloneID} />
                : <AllListsView />
            }
        </div>
    )
}