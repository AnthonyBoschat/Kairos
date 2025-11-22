"use client"
import s from "./styles.module.scss"
import { useAppSelector } from "@/store/hooks"
import { useEffect, useState } from "react"
import { getFolderList } from "@/app/actions/list"
import handleResponse from "@/utils/handleResponse"
import { Folder, List, Prisma } from "@prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface ContentProps{

}

type ListWithFolder = Prisma.ListGetPayload<{
    include: {
        folder: {
            select: {
                title: true
            }
        }
    }
}>

export default function Content() {
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const queryClient = useQueryClient()

    const { data: lists = [], isLoading, error } = useQuery({
        queryKey: ['lists', selectedFolderID],
        queryFn: async () => {
            const result = await getFolderList(selectedFolderID!)
            if (!result.success) throw new Error('Erreur chargement')
            return result.lists as ListWithFolder[]
        },
        enabled: !!selectedFolderID,
    })

    useEffect(() => {
        if(selectedFolderID){
            queryClient.invalidateQueries({ 
                queryKey: ['lists', selectedFolderID] 
            })
        }
    }, [selectedFolderID])

    if (!selectedFolderID) {
        return <div className={s.container}>Sélectionnez un dossier</div>
    }

    if (isLoading) {
        return <div className={s.container}>Chargement...</div>
    }

    if (error) {
        return <div className={s.container}>Erreur de chargement</div>
    }

    return (
        <div className={s.container}>
            {lists.length === 0 ? (
                <p>Aucune liste</p>
            ) : (
                <ul>
                    {lists.map(list => (
                        <li key={list.id}>
                            <div>Titre : {list.title}</div>
                            <div>Dossier : {list.folder.title}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}