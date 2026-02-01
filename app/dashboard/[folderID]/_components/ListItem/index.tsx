import s from "./styles.module.scss"
import LIST_COLOR from "@/constants/listColor"
import { useEffect, useMemo, useState } from "react"
import { ListWithTaskAndFolder } from "@/types/list"
import AddTaskButton from "../AddTaskButton"
import TaskList from "../TaskList"
import Highlight from "@/components/highlight"
import withClass from "@/utils/class"
import { useDashboardContext } from "@/context/DashboardContext"
import ListInlineAction from "../ListInlineAction"

interface ListItemProps{
    list: ListWithTaskAndFolder
    index:number
}


export default function ListItem(props:ListItemProps){

    const {selectedListID, selectedTaskID, setSelectedListID, searchContextValue}  = useDashboardContext()

    const [isAddingTask, setIsAddingTask] = useState(false)
    const taskNumber = props.list.tasks.length

    const listColor = useMemo(() => {
        return LIST_COLOR[props.list.color ?? 0]
    }, [props])

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
            style={{ animationDelay: `${props.index * 50}ms` }}
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
                    <ListInlineAction list={props.list}/>
                </div>
            </div>

            <AddTaskButton setIsAddingTask={setIsAddingTask}/>

            <TaskList  
                listID={props.list.id} 
                isAddingTask={isAddingTask} 
                setIsAddingTask={setIsAddingTask} 
                listColor={listColor} 
                listCheckable={props.list.checkable}
                tasks={props.list.tasks}
            />
        </li>
    )
}