'use server'

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Folder } from "@/types/folder"
import { revalidatePath } from "next/cache"


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
            color: "#CF1475",
            order:(maxOrder._max.order ?? -1) + 1,
            userId:user.id
        }
    })

    revalidatePath('/dashboard')
    return {success:true, folder:createdFolder}
        
}