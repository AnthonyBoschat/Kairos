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

interface ListsProps {
  selectedFolderID: string
}

const EMPTY_LISTS: ListWithTaskAndFolder[] = []

export default function Lists(props: ListsProps) {

    const [selectedListOptions, setSelectedListOptions] =
        useState<ListWithTaskAndFolder | null>(null)

    const [orderedLists, setOrderedLists] = useState<ListWithTaskAndFolder[]>([])

    const { data, isLoading, error } = useQuery({
        queryKey: ["lists", props.selectedFolderID],
        queryFn: async () => {
        const result = await getLists(props.selectedFolderID)
        if (!result.success) throw new Error("Erreur chargement")
        return result.lists as ListWithTaskAndFolder[]
        },
        enabled: !!props.selectedFolderID,
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
        })
    }

    if (!hasLists) return <span>Ce dossier ne contient aucune liste</span>

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
                renderItem={({ item: list }) => (
                    <ListItem
                        setSelectedListOptions={setSelectedListOptions}
                        key={list.id}
                        list={list}
                    />
            )}
            />
        </div>
    );
}
