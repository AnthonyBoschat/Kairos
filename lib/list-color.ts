import { prisma } from "./prisma"

const DEFAULT_COLORS_COUNT = 11

export async function getNextAvailableListColorIndexForThisFolder(folderID: string) {
    const lists = await prisma.list.findMany({
        where: { 
            folderId: folderID 
        },
        select: { color: true }
    })
    
    const usedIndexes = new Set(lists.map(list => list.color!))
    
    for (let i = 0; i < DEFAULT_COLORS_COUNT; i++) {
        if (!usedIndexes.has(i)) return i
    }
    
    const indexCounts = Array.from({ length: DEFAULT_COLORS_COUNT }, (_, i) => ({
        index: i,
        count: lists.filter(list => list.color === i).length
    }))
    
    return indexCounts.sort((a, b) => a.count - b.count)[0].index
}