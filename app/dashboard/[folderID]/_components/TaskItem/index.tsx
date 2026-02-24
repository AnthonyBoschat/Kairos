"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import React, { useEffect, useRef, useState } from "react"
import StarIcon from "@/components/ui/icons/Star"
import handleResponse from "@/utils/handleResponse"
import { deleteTask, deleteTaskResponse, restoreTask, toggleTaskDone, toggleTaskFavorite } from "@/app/actions/task"
import { useQueryClient } from "@tanstack/react-query"
import withClass from "@/utils/class"
import DeleteIcon from "@/components/ui/icons/delete"
import Confirmation from "@/components/confirm"
import COLOR from "@/constants/color"
import TaskDetail from "../TaskDetail"
import ListIcon from "@/components/ui/icons/list"
import { useDashboardContext } from "@/context/DashboardContext"
import Highlight from "@/components/highlight"
import CheckIcon from "@/components/ui/icons/check"
import RestoreIcon from "@/components/ui/icons/restore"
import { ListWithTaskAndFolder } from "@/types/list"

interface TaskItemProps{
    listCheckable:boolean
    listColor:string
    task:Task
    standalone?: boolean
    index?: number
}


export default function TaskItem(props:TaskItemProps){

    const {user, taskDetail, setTaskDetail, selectedTaskID, setSelectedTaskID, selectedFolderID, searchContextValue, trashFilter} = useDashboardContext()
    const [isHover, setIsHover]         = useState(false)
    const [isTruncated, setIsTruncated] = useState(false)
    const queryClient           = useQueryClient()
    const isFavorite            = props.task.favorite
    const isDone                = props.task.done
    const isListCheckable       = props.listCheckable
    const hasContent            = props.task.content !== null
    const favoriteButtonRef     = useRef<HTMLButtonElement>(null)
    const deleteButtonRef       = useRef<HTMLButtonElement>(null)
    const titleRef              = useRef<HTMLSpanElement>(null)


    const canDeleteWithoutConfirmation = props.task.content === null
    const isTaskDeleted = props.task.deletedAt !== null

    const handleAddTaskToFavorite = () => {
        handleResponse({
            request: () => toggleTaskFavorite({ taskID: props.task.id }),
            onSuccess: () => {
                queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                    previousLists?.map(list => ({
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === props.task.id ? { ...task, favorite: !task.favorite } : task
                        )
                    }))
                )
            }
        })
    }

    const handleDeleteTask = () => {
        handleResponse({
            request: () => deleteTask({ taskID: props.task.id }),
            onSuccess: (response: deleteTaskResponse) => {
                if(response.success){
                    queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) => {
                        if(!previousLists) return previousLists
                        if(trashFilter === "yes" || trashFilter === "only"){
                            return previousLists?.map(list => ({
                                ...list,
                                tasks: list.tasks.map(task => task.id === props.task.id ? {...task, deletedAt:response.deletedAt} : task)
                            }))
                        }else{
                            return previousLists?.map(list => ({
                                ...list,
                                tasks: list.tasks.filter(task => task.id !== props.task.id)
                            }))
                        }
                        
                    })
                    queryClient.invalidateQueries({queryKey: ["lists", selectedFolderID]})
                }
            }
        })
    }

    const handleToggleDone = (event: React.MouseEvent) => {
        event.stopPropagation()
        handleResponse({
            request: () => toggleTaskDone({ taskID: props.task.id }),
            onSuccess: () => {
                queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                    previousLists?.map(list => ({
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === props.task.id ? { ...task, done: !task.done } : task
                        )
                    }))
                )
            }
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

    const handleRestoreTask = (event: React.MouseEvent) => {
        if(props.task?.id){
            event.stopPropagation()
            handleResponse({
                request: () => restoreTask(props.task.id),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['lists', selectedFolderID] })
                    queryClient.invalidateQueries({queryKey: ["folders", user.id]})
                }
            })
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
    


    useEffect(() => {
        const checkTruncation = () => {
            if (titleRef.current) {
                setIsTruncated(titleRef.current.scrollHeight  > titleRef.current.clientHeight)
            }
        }
        
        checkTruncation()
        window.addEventListener('resize', checkTruncation)
        return () => window.removeEventListener('resize', checkTruncation)
    }, [props.task.title])

    return(
        <>
            <li 
                className={withClass(
                    s.container, 
                    props.standalone && s.animation,
                    props.standalone && s.standalone,
                    (searchContextValue && selectedTaskID) && s.onSelect,
                    (searchContextValue && props.task.id === selectedTaskID) && s.select,
                    (isDone && isListCheckable) && s.done,
                    isTaskDeleted && s.deleted
                )}
                id={props.task.id} 
                title="Consulter le détail de l'élément" 
                onClick={handleOpenTaskDetail} 
                onMouseLeave={() => setIsHover(false)} 
                onMouseEnter={() => setIsHover(true)} 
                style={{
                    animationDelay: props.index ? `${props.index * 10}ms` : "0ms"
                }} 
            >
                <div style={{ backgroundColor:props.listColor}} className={s.background}></div>
                <div className={s.content}>
                    
                    {/* Check de l'élément */}
                    <div className={s.check}>
                        <button onClick={handleToggleDone}>
                            <CheckIcon active={props.task.done} hidden={(!props.listCheckable || isTaskDeleted)} size={16}/>
                        </button>
                    </div>

                    {/* Icone de contenu supplémentaire */}
                    <div className={s.detail}>
                        <span ref={titleRef} className={withClass(s.title, (isDone && isListCheckable) && s.done)}>
                            {searchContextValue 
                                ? <Highlight text={props.task.title} search={searchContextValue}/>
                                : props.task.title
                            }
                        </span>
                        {(hasContent || props.standalone) && <span title="L'élément contient du contenu supplémentaire" className={withClass(s.icon, (props.standalone && !hasContent) && s.hiddenIcon)}><ListIcon size={18}/></span>}
                    </div>

                    {/* En vue liste unique, si le titre ne tient pas dans l'espace requis, affiche une popup au survol */}
                    {props.standalone && isTruncated && (
                        <div style={{ '--list-color': props.listColor } as React.CSSProperties} className={s.tooltip}>
                            {props.task.title}
                        </div>
                    )}
                    

                    {/* Options d'un élémént (Favori, suppression), si non supprimé */}

                        <div className={s.buttons}>
                        
                            {!isTaskDeleted && (
                                <>
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
                                                <DeleteIcon size={18}/>
                                            </button>
                                        )}
                                    </Confirmation>
                                    <button title={isFavorite ? "Retirer l'élément des favoris" : "Ajouter l'élément aux favoris"} ref={favoriteButtonRef} className={withClass(s.button, s.favorite, isHover && s.visible, isFavorite && s.active)} onClick={handleAddTaskToFavorite}>
                                        <StarIcon animate active={props.task.favorite} size={16}/>
                                    </button>
                                </>
                            )}
                            {isTaskDeleted && (
                                <div 
                                    className={s.restore}
                                    title={`Restaurer l'élément "${props.task.title}"` }
                                    onClick={handleRestoreTask}
                                >
                                    <RestoreIcon size={20}/>
                                </div>
                            )}
                        </div>


                </div>
            </li>
            {(taskDetail?.id === props.task.id) && (
                <TaskDetail listColor={props.listColor} setTaskDetail={setTaskDetail} task={props.task}/>
            )}
        </>
    )
}