"use client"

import s from "./styles.module.scss"
import ListsActions from "./_components/ListActions"
import Lists from "./_components/Lists"

export default function FolderPage() {
    
    
    return (
        <div className={s.container}>
            <ListsActions />
            <Lists />
        </div>
    )
}