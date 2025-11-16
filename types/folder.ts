// types/index.ts ou components/Divider/types.ts
export interface Folder {
    id: string
    title: string
    defaultColor: number | null
    customColor: string | null
    order: number
    favorite: Boolean
    showProgression: Boolean

}