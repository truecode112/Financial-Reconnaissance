import { useRef, useEffect } from 'react'

export default function ScrollContainer({ children, className }) {
    const ref = useRef()

    useEffect(() => {
        ref.current.scrollTo(0, 0)
    }, [ref]);

    return (
        <div ref={ref} className={`${className}`}>
            {children}
        </div>
    );
}
