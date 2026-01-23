"use client"
import withClass from "@/utils/class";
import s from "./styles.module.scss"
import { SetStateAction, useEffect, useRef } from "react";
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside";

export interface ListStandaloneOption {
  label: string
  value: string // "" = Aucun
}

export interface ListStandaloneSelectProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedListId: string | null
  setSelectedListId: React.Dispatch<React.SetStateAction<string | null>>
  listOptions: ListStandaloneOption[]
}

export default function ListStandaloneSelect(props:ListStandaloneSelectProps){

    const selectRef = useRef(null)

    useCallbackOnClickOutside(selectRef, () => props.setIsOpen(false))

    return(
         <div ref={selectRef} className={s.customSelect}>
                <button
                    type="button"
                    className={withClass(s.trigger, props.isOpen && s.open, !props.selectedListId && s.placeholder)}
                    onClick={() => props.setIsOpen((prev) => !prev)}
                >
                    <span className={s.label}>
                    {props.listOptions.find((o) => o.value === (props.selectedListId ?? ""))?.label}
                    </span>
                </button>

                {props.isOpen && (
                    <ul className={s.dropdown}>
                    {props.listOptions.map((option) => (
                        <li
                        key={option.value}
                        className={withClass(
                            s.option,
                            option.value === "" && s.empty,
                            option.value === (props.selectedListId ?? "") && s.selected
                        )}
                        onClick={() => {
                            props.setSelectedListId(option.value || null);
                            props.setIsOpen(false);
                        }}
                        >
                        {option.label}
                        </li>
                    ))}
                    </ul>
                )}
        </div>
    )
}