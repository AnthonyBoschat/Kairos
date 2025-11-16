import FOLDER_COLORS from "@/constants/folderColor"

export function getFolderColor(folder: { colorIndex: number | null, customColor: string | null }) {
  if (folder.customColor) return folder.customColor
  return FOLDER_COLORS[folder.colorIndex ?? 0]
}