"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import TaskItem from "../TaskItem"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import NewTaskItem from "../NewTaskItem"
import DragAndDrop from "@/components/dragAndDrop"
import handleResponse from "@/utils/handleResponse"
import { reorderTasks } from "@/app/actions/task"
import { useDashboardContext } from "@/context/DashboardContext"
import withClass from "@/utils/class"
import { rectSortingStrategy } from "@dnd-kit/sortable"

interface TaskListProps{
    listColor:string
    listID:string
    tasks: Task[]
    isAddingTask: Boolean
    setIsAddingTask:Dispatch<SetStateAction<boolean>>
}


export default function TaskList(props:TaskListProps){

    const {taskDetail} = useDashboardContext()
    const sortedTasks = useMemo(() => {
        return props.tasks.sort((a,b) => b.order - a.order)
    }, [props.tasks])

    const [orderedTasks, setOrderedTasks]   = useState(sortedTasks)

    useEffect(() => setOrderedTasks(sortedTasks) ,[sortedTasks])

    const handleReorderTasks = async(newTasks:Task[]) => {
        handleResponse(() => {
            setOrderedTasks(newTasks)
            const orderedTasksIds = newTasks.map(task => task.id)
            reorderTasks(orderedTasksIds)
        })
    }
        

    return(
        <ul className={withClass(s.container)}>
            {props.isAddingTask && (
                <NewTaskItem setIsAddingTask={props.setIsAddingTask} listID={props.listID} listColor={props.listColor} />
            )}
            <DragAndDrop
                strategy={rectSortingStrategy}
                items={orderedTasks}
                getItemId={(task) => task.id}
                onReorder={handleReorderTasks}
                disabled={taskDetail !== null}
                renderItem={({item: task}, index) => (
                    <TaskItem 
                        index={index}
                        key={task.id} 
                        listColor={props.listColor} task={task}
                    />
                )}
            />
        </ul>
    )
}