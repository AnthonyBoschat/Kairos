'use server'

import { getCurrentUser } from "@/lib/auth"
import { getNextAvailableFolderColorIndex } from "@/lib/folder-colors"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import checkUser from "./utils"
import { TrashFilter } from "@/types/trashFilter"
import { withTrash } from "@/utils/trash"
import { responseError } from "@/utils/responseError"



const checkFolderExist = async(folderID:string) => {
    const folder = await prisma.folder.findUnique({
        where:{id:folderID}
    })
    if(!folder) return responseError("Le dossier que vous essayez de modifier n'existe pas")
}


// ------------------------------------
// getNextFolderColorIndexForCurrentUser
// ------------------------------------

export async function getNextFolderColorIndexForCurrentUser(){
    const user = await checkUser()
    const colorIndex = await getNextAvailableFolderColorIndex(user.id);
    return colorIndex;
}


// ------------------------------------
// getFolders
// ------------------------------------

export async function getFolders(userID: string, trashFilter: TrashFilter = "no"){
    await checkUser()

    const folders = await prisma.folder.findMany({
        where:{ userId: userID , ...withTrash(trashFilter, "folder") },
        include: {
            lists: trashFilter === "only" ? { where: withTrash(trashFilter, "list") } : true
        }
    })

    return {success: true, folders: folders}
}


// ------------------------------------
// deleteFolder
// ------------------------------------
export type deleteFolderResponse = Awaited<ReturnType<typeof deleteFolder>>;
export async function deleteFolder(id:string){
    await checkUser()

    const folder = await prisma.folder.findUnique({
        where:{id}}
    )

    if(!folder) return responseError("Le dossier que vous essayez de supprimer n'existe pas")

    const deletedFolder = await prisma.folder.delete({
        where:{id:id}
    })

    return {success:true, deletedAt:deletedFolder.deletedAt}
}


// ------------------------------------
// addFolder
// ------------------------------------

type addFolderProps = {title:string}
export type addFolderResponse = Awaited<ReturnType<typeof addFolder>>;

export async function addFolder({title}:addFolderProps) {
    const user = await checkUser()
    
    const maxOrder = await prisma.folder.aggregate({
        where: { userId: user.id },
        _max: { order: true }
    })

    const newFolder = await prisma.folder.create({
        data:{
            title: title,
            color: await getNextAvailableFolderColorIndex(user.id),
            order:(maxOrder._max.order ?? -1) + 1,
            userId:user.id
        }
    })

    
    const nextAvailableColor = await getNextAvailableFolderColorIndex(user.id)
    return {success:true, nextAvailableColor:nextAvailableColor, newFolder:newFolder}
}



// ------------------------------------
// updateFolder
// ------------------------------------

type updateFolderProps = {
    folderID:string|undefined, 
    title?:string|undefined
    listStandaloneID?: string|null
}
export type updateFolderResponse = Awaited<ReturnType<typeof updateFolder>>;

export async function updateFolder({
    folderID, 
    title,
    listStandaloneID
}:updateFolderProps){
    await checkUser()

    const folder = await prisma.folder.findUnique({
        where:{id:folderID}
    })

    if(!folder) return responseError("Le dossier que vous essayez de modifier n'existe pas")

    const updatedFolder = await prisma.folder.update({
        where:{id:folderID},
        data:{
            title:title,
            listStandaloneID:listStandaloneID
        }
    })

    return {success:true, updatedFolder:updatedFolder}
}


// ------------------------------------
// toggleFolderFavorite
// ------------------------------------
export type toggleFolderFavoriteResponse = Awaited<ReturnType<typeof toggleFolderFavorite>>;
export async function toggleFolderFavorite(folderID: string){
    await checkUser()

    const folder = await prisma.folder.findUnique({
        where:{id:folderID}
    })

    if(!folder) return responseError("Le dossier que vous essayez de modifier n'existe pas")

    const newFavoriteState = !folder.favorite
    const updatedFolder = await prisma.folder.update({
        where:{id:folderID},
        data:{
            favorite:newFavoriteState
        }
    }) 

    return {success:true, updatedFolder:updatedFolder}
}


// ------------------------------------
// updateFolderColor
// ------------------------------------

export type updateFolderColorResponse = Awaited<ReturnType<typeof updateFolderColor>>;
export async function updateFolderColor(folderID:string, colorIndex:number){

    await checkUser()
    await checkFolderExist(folderID)

    const updatedFolder = await prisma.folder.update({
        where:{id:folderID},
        data:{
            color:colorIndex
        }
    })

    return {success:true, updatedFolder:updatedFolder}
}


// ------------------------------------
// reorderFolders
// ------------------------------------

export async function reorderFolders(orderedFolderIds:string[]) {
    await checkUser()

    if (orderedFolderIds.length === 0) return { success: true }

    await Promise.all(
        orderedFolderIds.map((folderId, index) =>
            prisma.folder.update({
                where: { id: folderId },
                data: { order: index },
            })
        )
    )

    return { success: true }
}


// ------------------------------------
// restoreFolder
// ------------------------------------
export type restoreFolderResponse = Awaited<ReturnType<typeof restoreFolder>>;
export async function restoreFolder(folderID:string){
    await checkUser()

    const folder = await prisma.folder.findUnique({
        where:{
            id:folderID,
            deletedAt: {not: null}
        }
    })

    if(!folder) return responseError("Le dossier que vous essayez de restaurer n'existe pas")

    const updatedFolder = await prisma.folder.update({
        where:{id:folderID},
        data:{
            deletedAt: null
        }
    })

    return {success:true, updatedFolder:updatedFolder}
}