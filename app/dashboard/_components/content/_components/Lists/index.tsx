"use client"
import { getLists } from "@/app/actions/list"
import { List } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import ListItem from "../ListItem"
import s from "./styles.module.scss"
import ListOptions from "../ListOptions"
import { ListWithTaskAndFolder } from "@/types/list"

interface ListsProps{
    selectedFolderID:string
}

export default function Lists(props:ListsProps){

    const [selectedListOptions, setSelectedListOptions] = useState<null|ListWithTaskAndFolder>(null)

    const { data: lists = [], isLoading, error } = useQuery({
        queryKey: ['lists', props.selectedFolderID],
        queryFn: async () => {
            const result = await getLists(props.selectedFolderID!)
            if (!result.success) throw new Error('Erreur chargement')
            return result.lists as ListWithTaskAndFolder[]
        },
        enabled: !!props.selectedFolderID,
    })

    const sortedList = useMemo(() => {
        return lists.sort((a, b) => {
            if (a.favorite !== b.favorite) {
                return b.favorite ? 1 : -1;
            }
            return a.order - b.order;
        });
    }, [lists])

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
            {selectedListOptions && <ListOptions list={selectedListOptions} setSelectedListOptions={setSelectedListOptions} />}
            {sortedList.map(list => <ListItem setSelectedListOptions={setSelectedListOptions} key={list.id} list={list}/>)}
        </ul>
    )
}