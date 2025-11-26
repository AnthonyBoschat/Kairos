import { useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import Overlay from "@/components/overlay"




export default function ListsActions(){

    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState("")
    const handleClickAddList = () => {
        setIsAddingList(true)
    }

    return(
        <div className={s.container}>
            <div className={s.buttonContainer}>
                <button onClick={handleClickAddList} className={withClass(s.add, isAddingList && s.active)}>
                    Ajouter une liste
                </button>
                {isAddingList && (
                    <Overlay onClose={() => setIsAddingList(false)}>
                        {(isClosing) => (
                            <form className={withClass(isClosing && s.closing)}>
                                <input onChange={(e) => setNewListTitle(e.currentTarget.value)} type="text" value={newListTitle} />
                            </form>
                        )}
                    </Overlay>
                )}
            </div>
        </div>
    )
}