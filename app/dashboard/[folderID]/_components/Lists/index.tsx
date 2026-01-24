"use client";

import { getLists, reorderLists } from "@/app/actions/list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import ListItem from "../ListItem";
import s from "./styles.module.scss";
import ListOptions from "../ListOptions";
import { ListWithTaskAndFolder } from "@/types/list";
import DragAndDrop from "@/components/dragAndDrop";
import handleResponse from "@/utils/handleResponse";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { useDashboardContext } from "@/context/DashboardContext";
import withClass from "@/utils/class";
import TaskItem from "../TaskItem";
import LIST_COLOR from "@/constants/listColor";
import { Task } from "@prisma/client";
import { reorderTasks } from "@/app/actions/task";

export default function Lists() {

    const {
        taskDetail, 
        selectedFolderID, 
        standaloneListID, 
        lists,
        isLoadingLists,
        setOrderedTasks,
        orderedTasks
    } = useDashboardContext()

    const queryClient                       = useQueryClient()

    const [selectedListOptions, setSelectedListOptions] = useState<ListWithTaskAndFolder | null>(null)
    const [orderedLists, setOrderedLists]               = useState<ListWithTaskAndFolder[]>([])
    const [standaloneList, setStandalonelist]           = useState<null|ListWithTaskAndFolder>(null)

    const hasLists = lists.length > 0

    // Liste trier à afficher
    const sortedLists = useMemo(() => {
        if(!standaloneListID){
            return [...lists].sort((a, b) => a.order - b.order)
        }
        else{
            return [...lists].filter(list => list.id === standaloneListID)
        }
    }, 
    [lists, standaloneListID])



    const handleReorderList = (newLists: ListWithTaskAndFolder[]) => {
        handleResponse(() => {
            setOrderedLists(newLists)
            reorderLists(newLists.map((list) => list.id))
            queryClient.invalidateQueries({queryKey:["lists", selectedFolderID]})
        })
    }

    const handleReorderTasks = async(newTasks: Task[]) => {
        handleResponse(() => {
            if(setOrderedTasks){
                setOrderedTasks(newTasks)
                const orderedTasksIds = newTasks.map(task => task.id)
                reorderTasks(orderedTasksIds)
            }
        })
    }

    // Si vue liste unique -> Le setState
    useEffect(() => {
        if(standaloneListID && lists){
            const list =  lists.find(list => list.id === standaloneListID)
            if(list) setStandalonelist(list)
        }
    }, [lists, standaloneListID])


    // Si liste unique dans le state -> setState ses tasks
    useEffect(() => {
        if (standaloneList?.tasks && setOrderedTasks) {
            setOrderedTasks([...standaloneList.tasks].sort((a, b) => b.order - a.order))
        }
    }, [standaloneList])

    // Quand sortedLists est construit -> setState ces listes
    useEffect(() => {
        setOrderedLists(sortedLists)
    }, [sortedLists])

    if(!selectedFolderID) return
    if (!hasLists && !isLoadingLists) return <div className={s.noLists}>Ce dossier ne contient aucune liste</div>
    return (
        <div className={withClass(s.container, standaloneListID && s.standalone)}>
            {selectedListOptions && (
                <ListOptions
                    list={selectedListOptions}
                    setSelectedListOptions={setSelectedListOptions}
                />
            )}

            {(standaloneListID && orderedTasks && standaloneList) && 
                <div className={s.standaloneList}>
                    <DragAndDrop
                        items={orderedTasks}
                        onReorder={handleReorderTasks}
                        getItemId={(task) => task.id}
                        strategy={rectSortingStrategy}
                        disabled={taskDetail !== null}
                        renderItem={({item:task}) => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                listColor={LIST_COLOR[standaloneList.color ?? 0]} 
                            />
                        )}
                    />
                </div>
            }
            
            {!standaloneListID && (
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

            )}
        </div>
    );
}
