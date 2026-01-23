import { Task } from "@prisma/client"
import { useState } from "react"
import ListsActions from "../ListActions"
import Lists from "../Lists"

// StandaloneListView - encapsule tout ce qui concerne une liste unique
function StandaloneListView({ listId }: { listId: string }) {

    const [orderedTasks, setOrderedTasks] = useState<Task[]>([])
    
    return (
        <>
            <ListsActions standaloneID={listId} setOrderedTasks={setOrderedTasks} />
            <Lists standaloneID={listId} orderedTasks={orderedTasks} setOrderedTasks={setOrderedTasks} />
        </>
    )
}

export default StandaloneListView