"use server"

import { prisma } from "@/lib/prisma"
import checkUser from "./utils"
import { Prisma, HistoricItemType } from "@prisma/client"



export default async function logHistory(jsonItem: Prisma.InputJsonValue, itemType:HistoricItemType, deleted = false) {
    const user = await checkUser()

    await prisma.historic.create({
        data: {
            userId: user.id,
            item: jsonItem,
            itemType: itemType,
            ...(deleted && { delete: true })
        }
    })
}

export async function getHistory(page: number = 1, limit: number = 10){

    const skip = (page - 1) * limit

    const user = await checkUser()

    const history = await prisma.historic.findMany({
        where:{userId: user.id},
        skip:skip,
        take:limit,
        orderBy: {createdAt:"desc"}
    })
    const total = await prisma.historic.count({where:{userId: user.id}})

    return {
        success:true, 
        history:history, 
        pagination:{
            page:page,
            limit:limit,
            total:total,
            totalPages: Math.ceil(total / limit)
        }
    }
}