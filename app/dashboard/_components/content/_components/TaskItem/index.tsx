"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import { useState } from "react"
import StarIcon from "@/components/ui/icons/Star"
import handleResponse from "@/utils/handleResponse"
import { deleteTask, toggleTaskFavorite } from "@/app/actions/task"
import { useQueryClient } from "@tanstack/react-query"
import { useAppSelector } from "@/store/hooks"
import { toast } from "react-toastify"
import withClass from "@/utils/class"
import DeleteIcon from "@/components/ui/icons/delete"

interface TaskItemProps{
    listColor:string
    task:Task
}


export default function TaskItem(props:TaskItemProps){

    const [isHover, setIsHover] = useState(false)
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const queryClient = useQueryClient()
    const isFavorite = props.task.favorite

    const handleAddTaskToFavorite = () => {
        handleResponse(async() => {
            const response = await toggleTaskFavorite({taskID:props.task.id})
            queryClient.invalidateQueries({ queryKey: ['lists', selectedFolderID] })
            toast.dismiss()
            toast.success(response.message)
        })
    }

    const handleDeleteTask = () => {
        handleResponse(async() => {
            const response = await deleteTask({taskID:props.task.id})
            queryClient.invalidateQueries({queryKey: ["lists", selectedFolderID]})
            toast.dismiss()
            toast.success(response.message)
        })
    }

    return(
        <li onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} style={{backgroundColor:props.listColor}} className={s.container}>
            <div className={s.content}>
                <button className={withClass(s.favorite, isHover && s.visible, isFavorite && s.active)} onClick={handleAddTaskToFavorite}>
                    <StarIcon animate active={props.task.favorite} size={18}/>
                </button>

                <span className={s.title}>
                    {props.task.title}
                </span>
                
                <button className={withClass(s.delete, isHover && s.visible)} onClick={handleDeleteTask}>
                    <DeleteIcon size={20}/>
                </button>
            </div>
        </li>
    )
}