"use client"

import withClass from "@/utils/class"
import s from "./styles.module.scss"
import React from "react"

interface EditorToolbarButtonProps {
  style?: React.CSSProperties
  label: string
  className?: string
  title?: string
  isActive?: boolean
  isDisabled?: boolean
  onClick: () => void
  Icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
  activeStyleMode?: "default" | "color"
}

export function EditorToolbarButton({
  style = {},
  className = "",
  label,
  title,
  isActive = false,
  isDisabled = false,
  onClick,
  Icon,
  children,
  activeStyleMode = "default"
}: EditorToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
      aria-pressed={isActive}
      title={title || label}
      className={withClass(
        className,
        s.toolbarButton,
        activeStyleMode === "color" && s.toolbarColorButton,
        isActive && activeStyleMode === "default" ? s.toolbarButtonActive : "",
        isActive && activeStyleMode === "color" ? s.toolbarColorButtonActive : "",
      )}
      style={{...style}}
    >
      {children ? children : Icon ? <Icon className={s.toolbarButtonIcon} /> : null}
    </button>
  )
}