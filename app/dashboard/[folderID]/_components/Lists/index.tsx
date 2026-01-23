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

interface ListsProps{
    standaloneID?: undefined|String
    setOrderedTasks?: Dispatch<SetStateAction<Task[]>>
    orderedTasks?: Task[]
}

const EMPTY_LISTS: ListWithTaskAndFolder[] = []

export default function Lists(props: ListsProps) {

    const {taskDetail, selectedFolderID}    = useDashboardContext()
    const queryClient                       = useQueryClient()

    const [selectedListOptions, setSelectedListOptions] = useState<ListWithTaskAndFolder | null>(null)
    const [orderedLists, setOrderedLists]               = useState<ListWithTaskAndFolder[]>([])
    const [standaloneList, setStandalonelist]           = useState<null|ListWithTaskAndFolder>(null)

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

    const hasLists = lists.length > 0

    // Liste trier à afficher
    const sortedLists = useMemo(() => {
        if(!props.standaloneID){
            return [...lists].sort((a, b) => a.order - b.order)
        }
        else{
            return [...lists].filter(list => list.id === props.standaloneID)
        }
    }, 
    [lists, props.standaloneID])



    const handleReorderList = (newLists: ListWithTaskAndFolder[]) => {
        handleResponse(() => {
            setOrderedLists(newLists)
            reorderLists(newLists.map((list) => list.id))
            queryClient.invalidateQueries({queryKey:["lists", selectedFolderID]})
        })
    }

    const handleReorderTasks = async(newTasks: Task[]) => {
        handleResponse(() => {
            if(props.setOrderedTasks){
                props.setOrderedTasks(newTasks)
                const orderedTasksIds = newTasks.map(task => task.id)
                reorderTasks(orderedTasksIds)
            }
        })
    }

    // Si vue liste unique -> Le setState
    useEffect(() => {
        if(props.standaloneID && lists){
            const list =  lists.find(list => list.id === props.standaloneID)
            if(list) setStandalonelist(list)
        }
    }, [lists, props.standaloneID])


    // Si liste unique dans le state -> setState ses tasks
    useEffect(() => {
        if (standaloneList?.tasks && props.setOrderedTasks) {
            props.setOrderedTasks([...standaloneList.tasks].sort((a, b) => b.order - a.order))
        }
    }, [standaloneList])

    // Quand sortedLists est construit -> setState ces listes
    useEffect(() => {
        setOrderedLists(sortedLists)
    }, [sortedLists])

     

    if (!hasLists && !isLoading) return <div className={s.noLists}>Ce dossier ne contient aucune liste</div>
    return (
        <div className={withClass(s.container, props.standaloneID && s.standalone)}>
            {selectedListOptions && (
                <ListOptions
                    list={selectedListOptions}
                    setSelectedListOptions={setSelectedListOptions}
                />
            )}

            {(props.standaloneID && props.orderedTasks && standaloneList) && 
                <div className={s.standaloneList}>
                    <DragAndDrop
                        items={props.orderedTasks}
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
            {!props.standaloneID && (
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
