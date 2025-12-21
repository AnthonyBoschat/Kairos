'use server'

import { getCurrentUser } from "@/lib/auth"
import { getNextAvailableFolderColorIndex } from "@/lib/folder-colors"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const checkUser = async() => {
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")
}

const checkFolderExist = async(folderID:string) => {
    const folder = await prisma.folder.findUnique({
        where:{id:folderID}
    })
    if(!folder) throw new Error("Le dossier que vous essayez de modifier n'existe pas")
}

export async function getNextFolderColorIndexForCurrentUser(){
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Non autorisé");
    const colorIndex = await getNextAvailableFolderColorIndex(user.id);
    return colorIndex;
}

export async function deleteFolder(id:string){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")

    const folder = await prisma.folder.findUnique({
        where:{id}}
    )

    if(!folder) throw new Error("Le dossier que vous essayez de supprimer n'existe pas")

    const deletedFolder = await prisma.folder.delete({
        where:{id:id}
    })

    revalidatePath("/dashboard")
    return {success:true, message:`Le dossier ${deletedFolder.title} a été supprimer avec succès`}
}

export async function addFolder({title}:{title:string}) {
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")
    
    const maxOrder = await prisma.folder.aggregate({
        where: { userId: user.id },
        _max: { order: true }
    })

    const createdFolder = await prisma.folder.create({
        data:{
            title: title,
            color: await getNextAvailableFolderColorIndex(user.id),
            order:(maxOrder._max.order ?? -1) + 1,
            userId:user.id
        }
    })

    revalidatePath('/dashboard')
    const nextAvailableColor = await getNextAvailableFolderColorIndex(user.id)
    return {success:true, message:`Le dossier ${createdFolder.title} a été ajouter`, nextAvailableColor:nextAvailableColor}
}


export async function updateFolder({
    folderID, 
    title,
    showProgression
}:{
    folderID:string|undefined, 
    title:string|undefined,
    showProgression:boolean|undefined
}){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")

    const folder = await prisma.folder.findUnique({
        where:{id:folderID}
    })

    if(!folder) throw new Error("Le dossier que vous essayez de modifier n'existe pas")

    await prisma.folder.update({
        where:{id:folderID},
        data:{
            title:title,
            showProgression:showProgression
        }
    })

    revalidatePath("/dashboard")
    return {success:true, message:`Le dossier a été correctement modifier`}
}

export async function toggleFolderFavorite(folderID: string){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")

    const folder = await prisma.folder.findUnique({
        where:{id:folderID}
    })

    if(!folder) throw new Error("Le dossier que vous essayez de modifier n'existe pas")

    const newFavoriteState = !folder.favorite
    await prisma.folder.update({
        where:{id:folderID},
        data:{
            favorite:newFavoriteState
        }
    }) 

    const message = newFavoriteState ? "Dossier ajouter aux favoris" : "Dossier retirer des favoris"
    revalidatePath("/dashboard")
    return {success:true, message:message}
}

export async function updateFolderColor(folderID:string, colorIndex:number){

    await checkUser()
    await checkFolderExist(folderID)

    await prisma.folder.update({
        where:{id:folderID},
        data:{
            color:colorIndex
        }
    })

    revalidatePath("/dashboard")
    const message = "Couleur du dossier modifier avec succès"
    return {success:true, message:message}
}