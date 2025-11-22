'use server'

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getFolderList(id:string){
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Non autorisé");

    const lists = await prisma.list.findMany({
        where:{folderId:id},
        include:{
            folder:{
                select:{
                    title: true
                }
            }
        }
    })

    return {success:true, lists:lists}
}