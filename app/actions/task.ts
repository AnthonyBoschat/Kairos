'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import checkUser from "./utils"
import { responseError } from "@/utils/responseError"

interface addTaskProps{
    title: string
    listID: string
}

export type addTaskResponse = Awaited<ReturnType<typeof addTask>>;
export async function addTask({title, listID}: addTaskProps){
    const user = await checkUser()

    const list = await prisma.list.findUnique({
        where:{
            id:listID,
        },
        include:{
            folder:true
        }
    })

    if(!list) return responseError("Liste non trouvé")
    if(list.folder.userId !== user.id) return responseError("Non autorisé, cette liste ne vous appartient pas")

    const maxOrder = await prisma.task.aggregate({
        where:{listId: list.id},
        _max:{order:true}
    })

    const createdTask = await prisma.task.create({
        data:{
            listId:list.id,
            title:title,
            order: (maxOrder._max.order ?? -1) + 1
        }
    })

    revalidatePath("/dashboard")
    return {success:true, task:createdTask}
}

interface toggleTaskFavoriteProps{
    taskID:string
}
export async function toggleTaskFavorite({taskID}: toggleTaskFavoriteProps){
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) return responseError("Tâche non trouvé")

    const newFavoriteState = !task.favorite
    await prisma.task.update({
        where:{id:taskID},
        data:{
            favorite:newFavoriteState
        }
    })

    revalidatePath("/dashboard")
    return {success:true}
}

interface deleteTaskProps{
    taskID:string
}
export type deleteTaskResponse = Awaited<ReturnType<typeof deleteTask>>;
export async function deleteTask({taskID}: deleteTaskProps){
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) return responseError("Tâche non trouvé")

    const deletedTask = await prisma.task.delete({
        where:{id:taskID}
    })
    return{success:true, deletedAt:deletedTask.deletedAt}
}

type updateTaskContentProps = {
    taskID:string
    content:string
}
export async function updateTaskContent({taskID, content}: updateTaskContentProps){
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) return responseError("Tâche non trouvé")

    const nullContent = content.trim() === "" 
    await prisma.task.update({
        where:{id:taskID},
        data:{
            content:nullContent ? null : content
        }
    })

    return {success:true}
}

type updateTaskTitleProps = {
    taskID:string
    title:string
}
export async function updateTaskTitle({taskID, title}: updateTaskTitleProps){
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) return responseError("Tâche non trouvé")

    const nullTitle = title.trim() === "" 

    await prisma.task.update({
        where:{id:taskID},
        data:{
            title:nullTitle ? task.title : title
        }
    })
    
    return {success:true}
}

type toggleTaskDoneProps = {
    taskID:string
}
export async function toggleTaskDone({taskID}: toggleTaskDoneProps){
    await checkUser()

    const task = await prisma.task.findUnique({
        where:{id:taskID}
    })

    if(!task) return responseError("Tâche non trouvé")

    const currentTaskDone = task.done

    await prisma.task.update({
        where:{id:taskID},
        data:{
            done:!currentTaskDone
        }
    })
    
    return {success:true}
}




type reorderTasksType = string[]

export async function reorderTasks(orderedTasksIds:reorderTasksType) {
    await checkUser()

    if (orderedTasksIds.length === 0) return { success: true }
    const totalTasksCount = orderedTasksIds.length

    await Promise.all(
        orderedTasksIds.map((taskID, index) =>
            prisma.task.update({
                where: { id: taskID },
                data: { order: totalTasksCount - 1 - index },
            })
        )
    )

    revalidatePath("/dashboard")
    return { success: true }
}



export async function restoreTask(taskID:string){
    await checkUser()

    const folder = await prisma.task.findUnique({
        where:{
            id:taskID,
            deletedAt: {not: null}
        }
    })

    if(!folder) return responseError("L'élément que vous essayez de restaurer n'existe pas")

    await prisma.task.update({
        where:{id:taskID},
        data:{
            deletedAt: null
        }
    })

    return {success:true}
}