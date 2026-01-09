"use client"
import { Dispatch, SetStateAction, useMemo } from "react"
import s from "../styles.module.scss"
import { buildPaginationTokens } from "./buildPaginationTokens"

interface HistoricNavigationProps{
    page: number
    setPage : Dispatch<SetStateAction<number>>
    pagination : any
}


export default function HistoricNavigation(props:HistoricNavigationProps){

    const {page, setPage, pagination} = props

    const paginationTokens = useMemo(() => {
        if (!pagination) return [];

        return buildPaginationTokens({
            currentPage: page,
            totalPages: pagination.totalPages,
            siblingCount: 1,   // autour de la page courante
            boundaryCount: 1,  // toujours 1ère + dernière
            maxVisible: 7,     // si <= 7 pages => toutes les pages
        });
    }, [pagination, page]);

    return(
        <nav className={s.pagination} aria-label="Pagination">
            <button
                className={s.pageButton}
                onClick={() => setPage(1)}
                disabled={page === 1}
            >
            «
            </button>

            <button
                className={s.pageButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
            >
            Précédent
            </button>

            <div className={s.pageList}>
                {paginationTokens.map((token, index) => {
                    if (token === "ellipsis") {
                    return (
                        <span key={`ellipsis-${index}`} className={s.ellipsis}>
                        …
                        </span>
                    )
                    }

                    const pageNumber = token;
                    const isActive = pageNumber === page;

                    return (
                        <button
                            key={pageNumber}
                            className={`${s.pageNumber} ${isActive ? s.isActive : ""}`}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    )
                })}
            </div>

            <button
            className={s.pageButton}
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages}
            >
            Suivant
            </button>

            <button
            className={s.pageButton}
            onClick={() => setPage(pagination.totalPages)}
            disabled={page >= pagination.totalPages}
            >
            »
            </button>
        </nav>
    )
}