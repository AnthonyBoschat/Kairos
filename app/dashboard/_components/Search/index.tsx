// Search.tsx
"use client"

import React, { useEffect, useMemo, useRef, useState, useId } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import SearchIcon from "@/components/ui/icons/search"
import useDebouncedValue from "@/hooks/useDebouncedValue"
import handleResponse from "@/utils/handleResponse"
import { search } from "@/app/actions/search"
import Highlight from "@/components/highlight"
import { useDashboardContext } from "@/context/DashboardContext"
import StorageService from "@/services/StorageService"
import { useRouter } from "next/navigation"

type SearchResultType = {
  success: boolean
  folders: { 
    id: string 
    title: string 
  }[]
  lists: { 
    id: string
    title: string
    folderId: string 
    folderTitle: string 
  }[]
  tasks: {
    id: string
    title: string
    listId: string
    listTitle: string
    folderId: string
    folderTitle: string
    listStandaloneID: null|string
  }[]
}

type ResultKind = "folder" | "list" | "task"

export default function Search() {

  const {setSelectedListID, setSelectedTaskID, setSearchContextValue, trashFilter} = useDashboardContext()
  const containerRef        = useRef<HTMLDivElement | null>(null)
  const inputRef            = useRef<HTMLInputElement | null>(null)
  const latestRequestIdRef  = useRef(0)
  const resultInnerRef      = useRef<HTMLDivElement | null>(null)
  const reactId             = useId()
  const listboxId           = `search-results-${reactId}`
  const router              = useRouter()

  const [searchValue, setSearchValue]       = useState("")
  const [isPopoverOpen, setIsPopoverOpen]   = useState(false)
  const [isLoading, setIsLoading]           = useState(false)
  const [searchResult, setSearchResult]     = useState<SearchResultType | null>(null)
  const [activeItemKey, setActiveItemKey]   = useState<string | null>(null)

  const debouncedSearchValue    = useDebouncedValue(searchValue)
  const hasValue                = searchValue.trim().length > 0
  const canSendRequest          = debouncedSearchValue.trim().length > 0

  const folders = searchResult?.folders ?? []
  const lists   = searchResult?.lists ?? []
  const tasks   = searchResult?.tasks ?? []

  const hasAnyResult = folders.length > 0 || lists.length > 0 || tasks.length > 0

  const shouldShowSkeleton   = isPopoverOpen && hasValue && ((!canSendRequest || isLoading) || (searchValue !== debouncedSearchValue))
  const shouldShowEmptyState = isPopoverOpen && hasValue && canSendRequest && !isLoading && !hasAnyResult
  const shouldShowResults    = isPopoverOpen && hasValue && canSendRequest && !isLoading && hasAnyResult
  const shouldShowPopover    = shouldShowSkeleton || shouldShowEmptyState || shouldShowResults

  const folderItems   = useMemo(() => folders.map((folder) => ({ key: `folder:${folder.id}`, folder })), [folders])
  const listItems     = useMemo(() => lists.map((list) => ({ key: `list:${list.id}`, list })), [lists])
  const taskItems     = useMemo(() => tasks.map((task) => ({ key: `task:${task.id}`, task })),[tasks])

  // Une seule liste de keys pour la navigation clavier (ordre visuel)
  const allKeys = useMemo(() => {
    return [
      ...folderItems.map((x) => x.key),
      ...listItems.map((x) => x.key),
      ...taskItems.map((x) => x.key),
    ]
  }, [folderItems, listItems, taskItems])

  const activeIndex = useMemo(() => {
    if (!activeItemKey) return -1
    return allKeys.indexOf(activeItemKey)
  }, [activeItemKey, allKeys])

  const handleUpdateSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    setSearchContextValue(event.target.value)
    setIsPopoverOpen(true)
  }

  const closePopover = () => {
    setIsPopoverOpen(false)
    setActiveItemKey(null)
  }

  const handleSelectFolder = (folderID:string) => {
    router.push(`/dashboard/${folderID}`)
    StorageService.set("selectedFolderID", folderID)
    closePopover()
  }

  const handleSelectList = (folderID: string, listID: string) => {
    router.push(`/dashboard/${folderID}`)
    setSelectedListID(listID)
    StorageService.set("selectedFolderID", folderID)
    closePopover()
  }

  const handleSelectTask = (folderID: string, taskID: string, listStandaloneID: null|string, taskListID:string) => {
    let route = `/dashboard/${folderID}`
    if(listStandaloneID && taskListID === listStandaloneID){
      route += `?standaloneID=${listStandaloneID}`
    }
    router.push(route)
    setSelectedTaskID(taskID)
    StorageService.set("selectedFolderID", folderID)
    closePopover()
  }

  const handleSelect = (kind: ResultKind, id: string) => {
    if(kind === "folder"){
      handleSelectFolder(id)
    }
    else if(kind === "list"){
      const item = listItems.find(item => item.list.id === id)
      if(item){
        handleSelectList(item?.list.folderId, item?.list.id)
      }
    }
    else if(kind === "task"){
      const item = taskItems.find(item => item.task.id === id)
      if(item){
        handleSelectTask(item.task.folderId, item.task.id, item.task.listStandaloneID, item.task.listId)
      }
    }
  }

  const ensureActiveItem = () => {
    if (!shouldShowResults) return
    if (allKeys.length === 0) return
    if (activeItemKey && allKeys.includes(activeItemKey)) return
    setActiveItemKey(allKeys[0])
  }

  const moveActiveItem = (direction: 1 | -1) => {
    if (!shouldShowResults) return
    if (allKeys.length === 0) return

    const currentIndex = activeIndex === -1 ? (direction === 1 ? -1 : 0) : activeIndex
    const nextIndex    = (currentIndex + direction + allKeys.length) % allKeys.length
    const nextKey      = allKeys[nextIndex]

    setActiveItemKey(nextKey)

    requestAnimationFrame(() => scrollActiveIntoViewIfNeeded(nextKey))
  }

  const selectActive = () => {
    if (!shouldShowResults) return
    if (activeIndex === -1) return

    const key = allKeys[activeIndex]
    const [kind, id] = key.split(":") as [ResultKind, string]
    handleSelect(kind, id)
  }

  const handleSearch = (value: string) => {
    const requestId = ++latestRequestIdRef.current
    setIsLoading(true)
    handleResponse({
        request: () => search(value, trashFilter),
        onSuccess: (response:any) => {
          if (requestId !== latestRequestIdRef.current) return
          setSearchResult(response)
          setIsLoading(false)
        }
    })
  }

  useEffect(() => {
    if (!hasValue) {
      setSearchResult(null)
      setIsLoading(false)
      closePopover()
      return
    }

    setIsPopoverOpen(true)
  }, [hasValue])

  useEffect(() => {
    if (!canSendRequest) return
    handleSearch(debouncedSearchValue.trim())
  }, [debouncedSearchValue])

  useEffect(() => {
    ensureActiveItem()
  }, [shouldShowResults, allKeys.length])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const targetNode = event.target as Node | null
      if (!targetNode) return
      if (!containerRef.current?.contains(targetNode)) closePopover()
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasValue) return

    if (event.key === "Escape") {
      event.preventDefault()
      closePopover()
      inputRef.current?.blur()
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setIsPopoverOpen(true)
      moveActiveItem(1)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setIsPopoverOpen(true)
      moveActiveItem(-1)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      selectActive()
    }
  }

  const scrollActiveIntoViewIfNeeded = (key: string) => {
    const container = resultInnerRef.current
    if (!container) return

    const element = document.getElementById(`${listboxId}-${key}`)
    if (!element) return

    const containerRect = container.getBoundingClientRect()
    const elementRect   = element.getBoundingClientRect()

    const isAbove = elementRect.top < containerRect.top
    const isBelow = elementRect.bottom > containerRect.bottom

    if (isAbove || isBelow) {
        element.scrollIntoView({ block: "center", behavior:"smooth" })
    }
  }

  const kindLabel: Record<ResultKind, string> = {
    folder: "Dossiers",
    list: "Listes",
    task: "Éléments",
  }

  const kindIcon: Record<ResultKind, string> = {
    folder: "📁",
    list: "🧾",
    task: "✅",
  }

  const activeDescendantId = activeItemKey ? `${listboxId}-${activeItemKey}` : undefined

  return (
    <div ref={containerRef} className={s.container}>
      <div className={s.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          className={withClass(s.input, hasValue && s.active)}
          onChange={handleUpdateSearchValue}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setIsPopoverOpen(true)}
          placeholder="Rechercher"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={shouldShowPopover}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
        />

        <button
          type="button"
          className={s.iconButton}
          onClick={() => inputRef.current?.focus()}
          aria-label={hasValue ? "Effacer la recherche" : "Rechercher"}
        >
          <SearchIcon size={"auto"} />
        </button>
      </div>

      {shouldShowPopover && (
        <div className={s.result} role="dialog" aria-label="Résultats de recherche">
          <div ref={resultInnerRef} className={s.resultInner}>


            {shouldShowSkeleton && (
              <div className={s.loadingBlock} aria-live="polite">
                <div className={s.loadingSection}>
                  <div className={s.loadingSectionTitle} />
                  <div className={s.loadingRow} />
                  <div className={s.loadingRow} />
                </div>

                <div className={s.loadingSection}>
                  <div className={s.loadingSectionTitle} />
                  <div className={s.loadingRow} />
                </div>

                <div className={s.loadingSection}>
                  <div className={s.loadingSectionTitle} />
                  <div className={s.loadingRow} />
                  <div className={s.loadingRow} />
                </div>
              </div>
            )}

            {shouldShowEmptyState && (
              <div className={s.emptyState} aria-live="polite">
                <div className={s.emptyTitle}>Aucun résultat</div>
                <div className={s.emptySubtitle}>
                  Essayez avec un autre mot-clé, ou tapez plus de caractères.
                </div>
              </div>
            )}

            {shouldShowResults && (
              <div id={listboxId} role="listbox" className={s.sections}>

                {folderItems.length > 0 && (
                  <section className={s.section} aria-label={kindLabel.folder}>
                    <div className={s.sectionTitle}>{kindLabel.folder}</div>
                    <ul className={s.sectionList}>
                      {folderItems.map(({ key, folder }) => {
                        const isActive = key === activeItemKey

                        return (
                          <li key={key} className={s.item}>
                            <button
                              id={`${listboxId}-${key}`}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              className={withClass(s.itemButton, isActive && s.itemButtonActive)}
                              // onMouseEnter={() => setActiveItemKey(key)}
                              onClick={() => handleSelectFolder(folder.id)}
                              onKeyDown={() => console.log("debug")}
                            >
                              <span className={s.itemIcon} aria-hidden="true">
                                {kindIcon.folder}
                              </span>

                              <span className={s.itemText}>
                                <span className={s.itemTitle}>
                                  <Highlight text={folder.title} search={searchValue} />
                                </span>
                              </span>

                              <span className={s.itemHint} aria-hidden="true">
                                ↵
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )}

                {listItems.length > 0 && (
                  <section className={s.section} aria-label={kindLabel.list}>
                    <div className={s.sectionTitle}>{kindLabel.list}</div>
                    <ul className={s.sectionList}>
                      {listItems.map(({ key, list }) => {
                        const isActive = key === activeItemKey

                        return (
                          <li key={key} className={s.item}>
                            <button
                              id={`${listboxId}-${key}`}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              className={withClass(s.itemButton, isActive && s.itemButtonActive)}
                              onClick={() => handleSelectList(list.folderId, list.id)}
                            >
                              <span className={s.itemIcon} aria-hidden="true">
                                {kindIcon.list}
                              </span>

                              <span className={s.itemText}>
                                <span className={s.itemTitle}>
                                  <Highlight text={list.title} search={searchValue} />
                                </span>

                                <span className={s.itemSubtitle}>
                                  <span className={s.metaLabel}>📁 Dossier</span>{" "}
                                  <span className={s.metaValue}>{list.folderTitle}</span>
                                </span>
                              </span>

                              <span className={s.itemHint} aria-hidden="true">
                                ↵
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )}

                {taskItems.length > 0 && (
                  <section className={s.section} aria-label={kindLabel.task}>
                    <div className={s.sectionTitle}>{kindLabel.task}</div>
                    <ul className={s.sectionList}>
                      {taskItems.map(({ key, task }) => {
                        const isActive = key === activeItemKey

                        return (
                          <li key={key} className={s.item}>
                            <button
                              id={`${listboxId}-${key}`}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              className={withClass(s.itemButton, isActive && s.itemButtonActive)}
                              onMouseEnter={() => setActiveItemKey(key)}
                              onClick={() => handleSelectTask(task.folderId, task.id, task.listStandaloneID, task.listId)}
                            >
                              <span className={s.itemIcon} aria-hidden="true">
                                {kindIcon.task}
                              </span>

                              <span className={s.itemText}>
                                <span className={s.itemTitle}>
                                  <Highlight text={task.title} search={searchValue} />
                                </span>

                                <span className={s.itemSubtitle}>
                                  <span className={s.metaLabel}>📁 Dossier</span>{" "}
                                  <span className={s.metaValue}>{task.folderTitle}</span>
                                  <span className={s.metaSeparator}>·</span>
                                  <span className={s.metaLabel}>🧾 Liste</span>{" "}
                                  <span className={s.metaValue}>{task.listTitle}</span>
                                </span>
                              </span>

                              <span className={s.itemHint} aria-hidden="true">
                                ↵
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
