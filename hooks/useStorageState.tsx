import StorageService from "@/services/StorageService";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export default function useStorageState<T>(initialValue: T, localStorageKey: string): [T, Dispatch<SetStateAction<T>>] {
    
    const [value, setValue] = useState<T>(initialValue);

    // Hydrate depuis localStorage après le mount
    useEffect(() => {
        const stored = StorageService.get(localStorageKey);
        if (stored !== undefined && stored !== null) {
            setValue(stored);
        }
    }, [localStorageKey]);

    const handleSetValue: Dispatch<SetStateAction<T>> = (newValue) => {
        const valueToStore = typeof newValue === "function" 
            ? (newValue as (prevState: T) => T)(value) 
            : newValue;

        if (valueToStore === initialValue) {
            StorageService.remove(localStorageKey);
        } else {
            StorageService.set(localStorageKey, valueToStore);
        }
        setValue(valueToStore);
    };

    return [value, handleSetValue];
}