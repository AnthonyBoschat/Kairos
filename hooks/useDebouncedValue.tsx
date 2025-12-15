import { useEffect, useState } from "react";


export default function useDebouncedValue<T>(value: T, delay = 800) {

    const [debouncedValue, setDebouncedValue] = useState(value);
        

    useEffect(() => {
        const id = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);


    return debouncedValue;
}

