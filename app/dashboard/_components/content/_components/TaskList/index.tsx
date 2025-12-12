"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import TaskItem from "../TaskItem"
import { Dispatch, SetStateAction } from "react"
import NewTaskItem from "../NewTaskItem"

interface TaskListProps{
    listColor:string
    listID:string
    tasks: Task[]
    isAddingTask: Boolean
    setIsAddingTask:Dispatch<SetStateAction<boolean>>
}


export default function TaskList(props:TaskListProps){


    const sortedTask = props.tasks.sort((a,b) => {
        if (a.favorite !== b.favorite) {
            return b.favorite ? 1 : -1;
        }
        return b.order - a.order;
    })

    return(
        <ul className={s.container}>
            {props.isAddingTask && (
                <NewTaskItem setIsAddingTask={props.setIsAddingTask} listID={props.listID} listColor={props.listColor} />
            )}
            {sortedTask.map(task => (
                <TaskItem key={task.id} listColor={props.listColor} task={task}/>
            ))}
        </ul>
    )
}