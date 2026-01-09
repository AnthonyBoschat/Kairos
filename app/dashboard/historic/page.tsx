"use client"
import { Historic, HistoricItemType } from "@prisma/client";
import s from "./styles.module.scss"
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getHistory } from "@/app/actions/historic";
import { useMemo, useState } from "react";
import { HistoryEntry } from "@/types/history";
import historyBuilder from "./_components/historyBuilder";
import { buildPaginationTokens } from "./_components/buildPaginationTokens";
import HistoricNavigation from "./_components/pagination";
import useStorageState from "@/hooks/useStorageState";



function buildHistory(records: Historic[]): HistoryEntry[] {

    const history: HistoryEntry[] = []
    const previousByItem = new Map<string, Record<string, unknown>>()
    console.log(records)
    for (const record of [...records].reverse() ) {

        const current   = record.item as Record<string, unknown>
        const itemId    = current.id as string
        const previous  = previousByItem.get(itemId)

        if (!previous && !record.delete) {
            history.push({ action: "created", item: current, type: record.itemType, at: record.createdAt })
        } else if (record.delete) {
            history.push({ action: "deleted", item: current, type: record.itemType, at: record.createdAt })
        } else {
            for (const key of Object.keys(current)) {
                if (key === "updatedAt") continue
                if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) {
                    history.push({ 
                        action: "modified", 
                        item: current, 
                        type: record.itemType,
                        field: key,
                        from: previous[key],
                        to: current[key],
                        at: record.createdAt 
                    })
                }
            }
        }

        previousByItem.set(itemId, current)
    }

    return history.reverse()
}


export default function HistoricView(){

    const [page, setPage] = useStorageState(1, "pagination_historic")
    const limit = 10
    
    const { data, isLoading, error, isPlaceholderData  } = useQuery({
        queryKey: ["historic", page],
        queryFn: async () => {
            const result = await getHistory(page, limit)
            if (!result.success) throw new Error("Erreur chargement")
            return result
        },
        placeholderData: keepPreviousData,
    })

    const historic = useMemo(() => {
        if(data?.history && !isLoading) return buildHistory(data?.history as Historic[])
        return []
    } , [data, isLoading])

    const pagination = data?.pagination
    
    return(
        <div className={s.container}>
            <div className={s.title}>
                <h2>Historique</h2>
               <span className={s.count}>({pagination?.total})</span>
            </div>

            <div className={s.records}>
                {historic.map((record, index) => 
                    <div className={s.record} key={index}>
                        {historyBuilder(record)}
                    </div>
                )}
            </div>
            {pagination && (
                <HistoricNavigation page={page} pagination={pagination} setPage={setPage}/>
            )}

            
        </div>
    )
}