"use client"
import { useEffect, useMemo, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"
import DragAndDrop from "@/components/dragAndDrop"
import { rectSortingStrategy } from "@dnd-kit/sortable"


// TaskDetail qui bug
// Message de deconnexion non visible
// Decalage des options si scroll

const simpleListWord = [
    "Anthony Boschat",
    "Maurane",
    "M ath ias",
    "Lorjou",
    "John Eevans",
    "Lucas Baros",
    "Cle mence",
    "Benoit M",
    "onteiro",
    "Beno i t",
    "Benoit Melo",
    "Jesahel Charpentier",
    "22 10 1994",
    "Lorem",
    "Ipsum",
]


const items = {
    folders:[
        {label:"Hello world", active:true, id:1},
        {label:"Lorem", active:false, id:2},
        {label:"lorem Lorem Ipsum", active:false, id:3},
    ],
    lists:{
        first:[
            {label:"A faire", tasks: Array.from({ length: 1 }, (_, i) => ({ id: i }))},
            {label:"En cours", tasks: Array.from({ length: 2 }, (_, i) => ({ id: i }))},
            {label:"Terminé", tasks:Array.from({ length: 3 }, (_, i) => ({ id: i }))},
            {label:"Si possible", tasks: Array.from({ length: 2 }, (_, i) => ({ id: i }))},
            {label:"lorem ipsum", tasks: Array.from({ length: 4 }, (_, i) => ({ id: i }))},
            {label:"En", tasks: Array.from({ length: 6 }, (_, i) => ({ id: i }))},
            {label:"En courss", tasks: Array.from({ length: 3 }, (_, i) => ({ id: i }))},
            {label:"Lor Ll a", tasks: Array.from({ length: 12 }, (_, i) => ({ id: i }))},
        ],
        second: Array.from({ length: 15 }, (_, i) => ({ id: i, type: i % 2 === 0 ? "even" : "odd", label:simpleListWord[i] })),
        third:[
            {label:"Anthony Boschat", tasks: Array.from({ length: 9 }, (_, i) => ({ id: i }))},
            {label:"Maurane", tasks: Array.from({ length: 6 }, (_, i) => ({ id: i }))},
            {label:"M ath ias", tasks: Array.from({ length: 3 }, (_, i) => ({ id: i }))},
            {label:"Lorjou", tasks: Array.from({ length: 6 }, (_, i) => ({ id: i }))},
            {label:"John Eevans", tasks: Array.from({ length: 4 }, (_, i) => ({ id: i }))},
            {label:"Een", tasks: Array.from({ length: 2 }, (_, i) => ({ id: i }))},
            {label:"En coursss", tasks: Array.from({ length: 3 }, (_, i) => ({ id: i }))},
            {label:"Lor L a", tasks: Array.from({ length: 2 }, (_, i) => ({ id: i }))},
            {label:"Lucas Baros", tasks: Array.from({ length: 1 }, (_, i) => ({ id: i }))},
            {label:"Benoit Monteiro", tasks: Array.from({ length: 4 }, (_, i) => ({ id: i }))},
        ],
    }
}



export default function Presentation(){
    const [activeFolderID, setActiveFolderID] = useState(1)
    const [folders, setFolders] = useState(items.folders)
    const [complexeLists, setComplexeLists] = useState<Record<number, typeof items.lists.first>>({
        1: items.lists.first,
        3: items.lists.third,
    })
    const [complexeListToRenderSelected, setComplexeListToRenderSelected] = useState(0)
    const [simpleListToRender, setSimpleListToRender] = useState(items.lists.second)
    const [hasAnimated, setHasAnimated] = useState(false)
    const [hasAlreadyPlayCompletionAnimation, setHasAlreayPlayCompletionAnimation] = useState(false)
    
    const currentComplexeList = complexeLists[activeFolderID]

    useEffect(() => {
        setHasAnimated(false); // <-- reset ici
        const timer = setTimeout(() => setHasAnimated(true), 1500);
        return () => clearTimeout(timer);
    }, [activeFolderID]);


    const listContainerClass = useMemo(() => {
        if(activeFolderID === 1 || activeFolderID === 3){
            return s.complex
        }
        return s.simple
    }, [activeFolderID])

    const isComplexeListToRender = useMemo(() => activeFolderID === 1 || activeFolderID === 3, [activeFolderID])

    const handleFolderClick = (folderId: number) => {
        setHasAnimated(false) // ← reset synchrone AVANT le changement
        setActiveFolderID(folderId)
    }

    const handleListReorder = (newList: typeof items.lists.first) => {
        setHasAnimated(true);
        setComplexeLists(prev => ({
            ...prev,
            [activeFolderID]: newList
        }))
    }

    const handleTaskReorder = (newTasks: any, listIndex: number) => {
        setHasAnimated(true);
        setComplexeLists(prev => ({
            ...prev,
            [activeFolderID]: prev[activeFolderID].map((list, index) => 
                index === listIndex ? { ...list, tasks: newTasks } : list
            )
        }))
    }

    const miniGameComplete = useMemo(() => {
        const slicedListEven = simpleListToRender.slice(0,8)
        const slicedListOdd = simpleListToRender.slice(0,7)
        if(slicedListEven.every(element => element.type === "even") || slicedListOdd.every(element => element.type === "odd")){
            return true
        }
        return false
    }, [simpleListToRender])

    useEffect(() => {
        if (!miniGameComplete) return
        const timer = setTimeout(() => {
            setHasAlreayPlayCompletionAnimation(true)
        }, 1100)

        return () => clearTimeout(timer)
    }, [miniGameComplete])



    return(
        <div className={s.container}>
            <div className={s.folders}>
                <DragAndDrop
                    items={folders}
                    getItemId={(folder) => folder.id}
                    onReorder={(newFolders) => setFolders(newFolders)}
                    renderItem={({ item: folder }, index) => (
                        <div 
                            style={{ animationDelay: `${index * 150}ms`}}
                            key={index} 
                            className={withClass(s.folder, activeFolderID === folder.id && s.active)}
                            onClick={() => handleFolderClick(folder.id)}
                        >
                            {folder.label}
                            {activeFolderID === folder.id && (
                                <div className={s.indicator}>
                                    <ArrowLeftIcon size={16}/>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>
            <div className={withClass(s.lists, listContainerClass)} >
                {(isComplexeListToRender && currentComplexeList) && (
                    <>
                        <DragAndDrop
                            items={currentComplexeList}
                            getItemId={(folder) => folder.label}
                            strategy={rectSortingStrategy}
                            onReorder={handleListReorder}
                            renderItem={({ item: list }, listIndex) => (
                                <div 
                                    style={{ animationDelay: `${listIndex * 50}ms` }}
                                    key={listIndex}
                                    className={withClass(s.list, hasAnimated && s.noAnimation)}
                                >
                                    <div className={s.header}>{list.label}</div>
                                    <div className={s.tasks}>
                                        <DragAndDrop
                                            items={list.tasks}
                                            getItemId={(task) => task.id}
                                            onReorder={(newTasks) => handleTaskReorder(newTasks, listIndex)}
                                            renderItem={({ item: folder }, taskIndex) => (
                                               <div 
                                                    style={{ animationDelay: `${listIndex * 50 + taskIndex * 50}ms` }}
                                                    key={taskIndex} 
                                                    className={withClass(s.task, hasAnimated && s.noAnimation)}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    </>
                )}
                {(!isComplexeListToRender && simpleListToRender) && (
                    <>
                        <DragAndDrop
                            items={simpleListToRender}
                            getItemId={(element) => element.id}
                            strategy={rectSortingStrategy}

                            onReorder={(newElements) => {
                                setHasAnimated(true)
                                setSimpleListToRender(newElements)
                            }}
                            renderItem={(element, elementIndex) => (
                                <div 
                                    style={{ animationDelay: `${elementIndex * 30}ms`}}
                                    className={withClass(
                                        s.element, 
                                        hasAnimated && s.noAnimation, 
                                        (element.item.type === "even") ? s.even : s.odd,
                                        (miniGameComplete && !hasAlreadyPlayCompletionAnimation) && s.completed
                                    )}
                                >
                                    {element.item.label}
                                </div>
                            )}
                        />
                    </>
                )}
            </div>
        </div>
    )
}