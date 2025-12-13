import { List } from "@prisma/client"
import s from "./styles.module.scss"
import LIST_COLOR from "@/constants/listColor"
import StarIcon from "@/components/ui/icons/Star"
import OptionsIcon from "@/components/ui/icons/Options"
import { Dispatch, useMemo, useState } from "react"
import handleResponse from "@/utils/handleResponse"
import { toggleListFavorite } from "@/app/actions/list"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import { ListWithTaskAndFolder } from "@/types/list"
import AddTaskButton from "../AddTaskButton"
import TaskList from "../TaskList"

interface ListItemProps{
    list: ListWithTaskAndFolder
    setSelectedListOptions: Dispatch<null|List>
}


export default function ListItem(props:ListItemProps){

    const queryClient = useQueryClient()

    const [isAddingTask, setIsAddingTask] = useState(false)
    const taskNumber = props.list.tasks.length

    const listColor = useMemo(() => {
        return props.list.customColor || LIST_COLOR[props.list.defaultColor ?? 0]
    }, [props])

    const handleToggleFavorite = async() => {
        if(props.list?.id){
            const listID = props.list.id
            handleResponse(async () => {
                const response = await toggleListFavorite(listID)
                queryClient.invalidateQueries({ queryKey: ['lists', props.list?.folderId] })
                toast.success(response.message)
            })
        }
    }
    

    return(
        <li className={s.container}>
            <div style={{backgroundColor: listColor}} className={s.color}/>
            <div className={s.header}>
                <div className={s.left}>
                    <span className={s.title}>{props.list.title}</span>
                    {props.list.countElement && (
                        <span className={s.tasksCount}>{taskNumber}</span>
                    )}
                </div>
                <div className={s.right}>
                    <button className={s.favorite} onClick={handleToggleFavorite}>
                        <StarIcon animate active={props.list.favorite} size={18}/>
                    </button>
                    <button className={s.options} onClick={() => props.setSelectedListOptions(props.list)}>
                        <OptionsIcon size={20}/>
                    </button>
                </div>
            </div>

            <AddTaskButton setIsAddingTask={setIsAddingTask}/>

            <TaskList listID={props.list.id} isAddingTask={isAddingTask} setIsAddingTask={setIsAddingTask} listColor={listColor} tasks={props.list.tasks}/>
        </li>
    )
}