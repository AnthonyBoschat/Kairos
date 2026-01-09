"use client";

import { getLists, reorderLists } from "@/app/actions/list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import ListItem from "../ListItem";
import s from "./styles.module.scss";
import ListOptions from "../ListOptions";
import { ListWithTaskAndFolder } from "@/types/list";
import DragAndDrop from "@/components/dragAndDrop";
import handleResponse from "@/utils/handleResponse";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { useDashboardContext } from "@/context/DashboardContext";



const EMPTY_LISTS: ListWithTaskAndFolder[] = []

export default function Lists() {

    const queryClient = useQueryClient()
    const [selectedListOptions, setSelectedListOptions] = useState<ListWithTaskAndFolder | null>(null)
    const [orderedLists, setOrderedLists] = useState<ListWithTaskAndFolder[]>([])

    const {taskDetail, selectedFolderID} = useDashboardContext()

    const { data, isLoading, error } = useQuery({
        queryKey: ["lists", selectedFolderID],
        queryFn: async () => {
            const result = await getLists(selectedFolderID!)
            if (!result.success) throw new Error("Erreur chargement")
            return result.lists as ListWithTaskAndFolder[]
        },
        staleTime: Infinity,
        enabled: !!selectedFolderID,
        gcTime: 1000 * 60 * 30,
    })
    
    const lists = data ?? EMPTY_LISTS
    const sortedLists = useMemo(() => [...lists].sort((a, b) => a.order - b.order), [lists])

    useEffect(() => {
        setOrderedLists(sortedLists)
    }, [sortedLists])

    const hasLists = lists.length > 0

    const handleReorderList = (newLists: ListWithTaskAndFolder[]) => {
        handleResponse(() => {
            setOrderedLists(newLists)
            reorderLists(newLists.map((list) => list.id))
            queryClient.invalidateQueries({queryKey:["lists", selectedFolderID]})
        })
    }


    if (!hasLists && !isLoading) return <div className={s.noLists}>Ce dossier ne contient aucune liste</div>
    return (
        <div className={s.container}>
            {selectedListOptions && (
                <ListOptions
                    list={selectedListOptions}
                    setSelectedListOptions={setSelectedListOptions}
                />
            )}

            <DragAndDrop
                items={orderedLists}
                getItemId={(list) => list.id}
                onReorder={handleReorderList}
                strategy={rectSortingStrategy}
                disabled={taskDetail !== null}
                renderItem={({ item: list }, index) => (
                    <ListItem
                        setSelectedListOptions={setSelectedListOptions}
                        key={list.id}
                        list={list}
                        index={index}
                    />
            )}
            />
        </div>
    );
}
