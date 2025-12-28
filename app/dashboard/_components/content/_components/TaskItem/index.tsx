"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import React, { useEffect, useRef, useState } from "react"
import StarIcon from "@/components/ui/icons/Star"
import handleResponse from "@/utils/handleResponse"
import { deleteTask, toggleTaskFavorite } from "@/app/actions/task"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import withClass from "@/utils/class"
import DeleteIcon from "@/components/ui/icons/delete"
import Confirmation from "@/components/confirm"
import COLOR from "@/constants/color"
import TaskDetail from "../TaskDetail"
import ListIcon from "@/components/ui/icons/list"
import { useDashboardContext } from "@/context/DashboardContext"
import Highlight from "@/components/highlight"

interface TaskItemProps{
    listColor:string
    task:Task
}


export default function TaskItem(props:TaskItemProps){

    const {taskDetail, setTaskDetail, selectedTaskID, setSelectedTaskID, selectedFolderID, searchContextValue} = useDashboardContext()
    const [isHover, setIsHover] = useState(false)
    const queryClient           = useQueryClient()
    const isFavorite            = props.task.favorite
    const hasContent            = props.task.content !== null
    const favoriteButtonRef     = useRef<HTMLButtonElement>(null)
    const deleteButtonRef       = useRef<HTMLButtonElement>(null)


    const canDeleteWithoutConfirmation = props.task.content === null

    const handleAddTaskToFavorite = () => {
        handleResponse(async() => {
            await toggleTaskFavorite({taskID:props.task.id})
            queryClient.invalidateQueries({ queryKey: ['lists', selectedFolderID] })
            toast.dismiss()
        })
    }

    const handleDeleteTask = () => {
        handleResponse(async() => {
            await deleteTask({taskID:props.task.id})
            queryClient.invalidateQueries({queryKey: ["lists", selectedFolderID]})
            toast.dismiss()
        })
    }

    const handleOpenTaskDetail = (event:React.MouseEvent) => {
        const target = event.target as Node
        const clickedFavorite = favoriteButtonRef.current?.contains(target)
        const clickedDelete = deleteButtonRef.current?.contains(target)

        if (!clickedFavorite && !clickedDelete) {
            setTaskDetail(props.task)
        }
    }

    useEffect(() => {
        if(selectedTaskID){
            const selectedList = document.getElementById(selectedTaskID)
            if(selectedList){
                selectedList.scrollIntoView({ block: "end", behavior:"smooth" })
                
            }
        }
    }, [selectedTaskID])

    useEffect(() => {
        if (selectedTaskID && props.task.id === selectedTaskID) {
            const handleClick = () => {
                setSelectedTaskID(null)
            }

            document.addEventListener('click', handleClick, { once: true })

            return () => {
                document.removeEventListener('click', handleClick)
            }
        }
    }, [selectedTaskID, props.task.id])

    return(
        <>
            <li 
                className={withClass(
                    s.container, 
                    (searchContextValue && selectedTaskID) && s.onSelect,
                    (searchContextValue && props.task.id === selectedTaskID) && s.select
                )}
                id={props.task.id} 
                title="Consulter le détail de l'élément" 
                onClick={handleOpenTaskDetail} 
                onMouseLeave={() => setIsHover(false)} 
                onMouseEnter={() => setIsHover(true)} 
                style={{backgroundColor:props.listColor}} 
            >
                <div className={s.content}>
                    <button title={isFavorite ? "Retirer l'élément des favoris" : "Ajouter l'élément aux favoris"} ref={favoriteButtonRef} className={withClass(s.button, s.favorite, isHover && s.visible, isFavorite && s.active)} onClick={handleAddTaskToFavorite}>
                        <StarIcon animate active={props.task.favorite} size={18}/>
                    </button>

                    <div className={s.detail}>
                        <span className={s.title}>
                            {searchContextValue 
                                ? <Highlight text={props.task.title} search={searchContextValue}/>
                                : props.task.title
                            }
                        </span>
                        {hasContent && <span title="L'élément contient du contenu supplémentaire" className={s.icon}><ListIcon size={18}/></span>}
                    </div>
                    
                    <Confirmation 
                        disabled={canDeleteWithoutConfirmation}
                        onClose={() => setIsHover(false)}
                        onClick={handleDeleteTask} 
                        content={
                            <div>
                                <span style={{fontWeight:700}}>Êtes vous sûres de vouloir <span style={{color:COLOR.state.error_dark}}>supprimer</span> cette tâche ?</span>
                                <div>Son contenu sera définitivement perdu.</div>
                            </div>
                        }
                    >
                        {(open, isClosing) => (
                            <button title="Supprimer l'élément" ref={deleteButtonRef} className={withClass(s.button, s.delete, isHover && s.visible, (open && !isClosing) && s.active)}>
                                <DeleteIcon size={20}/>
                            </button>
                        )}
                    </Confirmation>
                </div>
            </li>
            {taskDetail?.id === props.task.id && (
                <TaskDetail listColor={props.listColor} setTaskDetail={setTaskDetail} task={props.task}/>
            )}
        </>
    )
}