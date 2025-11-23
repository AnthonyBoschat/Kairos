"use client"
import { getFolderList } from "@/app/actions/list"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import ListItem from "../ListItem"
import s from "./styles.module.scss"

type ListWithFolder = Prisma.ListGetPayload<{
    include: {
        folder: {
            select: {
                title: true
            }
        }
    }
}>

interface ListsProps{
    selectedFolderID:string
}

export default function Lists(props:ListsProps){


    const { data: lists = [], isLoading, error } = useQuery({
        queryKey: ['lists', props.selectedFolderID],
        queryFn: async () => {
            const result = await getFolderList(props.selectedFolderID!)
            if (!result.success) throw new Error('Erreur chargement')
            return result.lists as ListWithFolder[]
        },
        enabled: !!props.selectedFolderID,
    })

    const hasLists = useMemo(() => {
        return lists.length > 0
    }, [lists])


    if(!hasLists){
        return(
            <span>Ce dossier ne contient aucune liste</span>
        )
    }
    return(
        <ul className={s.container}>
            {lists.map(list => <ListItem key={list.id} list={list}/>)}
        </ul>
    )
}