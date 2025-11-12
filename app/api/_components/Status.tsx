"use client"

import { Status } from "@prisma/client"
import s from "../../styles.module.scss"
import withClass from "@/utils/class"
// import { useEffect } from "react"
import { updateStatusState } from "@/app/actions/status"
import { useState } from "react"

export default function AppStatus({statuses}: {statuses: Status[]}){

    const [updating, setUpdating] = useState<string | null>(null);

    const handleToggle = async (id: string, currentState: boolean) => {
        setUpdating(id);
        await updateStatusState(id, !currentState);
        setTimeout(() => setUpdating(null), 300);
    };

    return(
        <ul className={s.status}>
            {statuses.map(status => (
                <li key={status.id}>
                    <span className={s.name}>{status.name}</span>
                    <button 
                        onClick={() => {handleToggle(status.id, status.state)}}
                        className={withClass(
                            s.state, 
                            status.state ? s.ok : s.notOk,
                            updating === status.id && s.updating
                        )}
                    >
                        {status.state ? "ON" : "OFF"}
                    </button>
                </li>
            ))}
        </ul>
    )
}