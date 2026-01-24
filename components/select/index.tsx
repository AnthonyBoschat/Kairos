"use client"
import withClass from "@/utils/class";
import s from "./styles.module.scss"
import React, { useRef, useState } from "react";
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside";

interface SelectOption<T>{
    label: string
    value: T
}

interface SelectProps<T>{
    options: SelectOption<T>[]
    value: T
    onClick: (value: T) => void
    styles?: React.CSSProperties
}


export default function Select<T>(props:SelectProps<T>){

    const [open, setOpen] = useState(false)

    const selectRef = useRef(null)
    useCallbackOnClickOutside(selectRef, () => setOpen(false))

    return(
        <div style={{...props.styles}} ref={selectRef} className={s.container}>
            <button
                type="button"
                className={withClass(s.trigger, open && s.open, !props.value && s.placeholder)}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className={s.label}>
                    {props.options.find((option) => option.value === (props.value ?? null))?.label}
                </span>
            </button>

            {open && (
                <ul className={s.dropdown}>
                {props.options.map((option, index) => (
                    <li
                    key={index}
                    className={withClass(
                        s.option,
                        option.value === null && s.empty,
                        option.value === (props.value ?? "") && s.selected,
                        
                    )}
                    onClick={() => {
                        props.onClick(option.value);
                        setOpen(false);
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