import s from "./styles.module.scss"
import LIST_COLOR from "@/constants/listColor"
import StarIcon from "@/components/ui/icons/Star"
import OptionsIcon from "@/components/ui/icons/Options"
import { Dispatch, useEffect, useMemo, useState } from "react"
import handleResponse from "@/utils/handleResponse"
import { toggleListFavorite } from "@/app/actions/list"
import { useQueryClient } from "@tanstack/react-query"
import { ListWithTaskAndFolder } from "@/types/list"
import AddTaskButton from "../AddTaskButton"
import TaskList from "../TaskList"
import Highlight from "@/components/highlight"
import withClass from "@/utils/class"
import { useDashboardContext } from "@/context/DashboardContext"

interface ListItemProps{
    list: ListWithTaskAndFolder
    setSelectedListOptions: Dispatch<null|ListWithTaskAndFolder>
}


export default function ListItem(props:ListItemProps){

    const {selectedListID, selectedTaskID, setSelectedListID, searchContextValue}  = useDashboardContext()
    const queryClient       = useQueryClient()

    const [isAddingTask, setIsAddingTask] = useState(false)
    const taskNumber = props.list.tasks.length
    const isFavorite = props.list.favorite

    const listColor = useMemo(() => {
        return LIST_COLOR[props.list.color ?? 0]
    }, [props])

    const handleToggleFavorite = async() => {
        if(props.list?.id){
            const listID = props.list.id
            handleResponse(async () => {
                await toggleListFavorite(listID)
                queryClient.invalidateQueries({ queryKey: ['lists', props.list?.folderId] })
            })
        }
    }

    useEffect(() => {
        if (selectedListID && props.list.id === selectedListID) {
            requestAnimationFrame(() => {
                const selectedList = document.getElementById(selectedListID)
                if (selectedList) {
                    selectedList.scrollIntoView({ block: "end", behavior: "smooth" })
                }
            })
        }
    }, [selectedListID, props.list.id])

    useEffect(() => {
        if (selectedListID && props.list.id === selectedListID) {
            const handleClick = () => {
                setSelectedListID(null)
            }

            document.addEventListener('click', handleClick, { once: true })

            return () => {
                document.removeEventListener('click', handleClick)
            }
        }
    }, [selectedListID, props.list.id])
    

    return(
        <li 
            id={props.list.id} 
            className={withClass(
                s.container, 
                (searchContextValue && (selectedListID || selectedTaskID)) && s.onSelect,
                (searchContextValue && props.list.id === selectedListID) && s.select,
                ((searchContextValue && props.list.tasks.find(task => task.id === selectedTaskID)) && s.select)
            )}
        >
            <div style={{backgroundColor: listColor}} className={s.color}/>
            
            <div className={s.header}>
                <div className={s.left}>
                    <span className={s.title}>
                        {searchContextValue 
                            ? <Highlight text={props.list.title} search={searchContextValue}/>
                            : props.list.title
                        }
                    </span>
                    {props.list.countElement && (
                        <span className={s.tasksCount}>{taskNumber}</span>
                    )}
                </div>
                <div className={s.right}>
                    <button title={isFavorite ? "Retirer la liste des favoris" : "Ajouter la liste aux favoris"} className={s.favorite} onClick={handleToggleFavorite}>
                        <StarIcon animate active={isFavorite} size={18}/>
                    </button>
                    <button title="Afficher les options de la liste" className={s.options} onClick={() => props.setSelectedListOptions(props.list)}>
                        <OptionsIcon size={20}/>
                    </button>
                </div>
            </div>

            <AddTaskButton setIsAddingTask={setIsAddingTask}/>

            <TaskList  
                listID={props.list.id} 
                isAddingTask={isAddingTask} 
                setIsAddingTask={setIsAddingTask} 
                listColor={listColor} 
                tasks={props.list.tasks}
            />
        </li>
    )
}