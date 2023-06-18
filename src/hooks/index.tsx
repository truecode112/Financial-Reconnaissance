import React, { useCallback, useEffect, useRef, useState } from "react";

export default function useMedia(
   queries: string[],
   values: string[],
   defaultValue: string
) {
   // Array containing a media query list for each query
   const mediaQueryLists = typeof window !== 'undefined' ? queries.map(q => window.matchMedia(q)) : []
   // Function that gets value based on matching media query
   function getValue() {
      // Get index of first media query that matches
      const index = mediaQueryLists?.findIndex(mql => mql.matches);
      // Return related value or defaultValue if none
      return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
   }

   // State and setter for matched value
   const [value, setValue] = useState(getValue);

   useEffect(() => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook only runs on mount/dismount).
      const handler = () => setValue(getValue);
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach(mql => mql.addListener(handler));
      // Remove listeners on cleanup
      return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
      //eslint-disable-next-line
   }, []) // Empty array ensures effect is only run on mount and unmount

   return value
}

type ScreenSize = "lg" | "md" | "sm" | "xs"
export function useScreenSize() {
   return useMedia(
      // Media queries
      ['(min-width: 1024px)', '(min-width: 768px)', '(min-width: 640px)', '(min-width: 360px)'],
      // Column counts (relates to above media queries by array index)
      ["lg", "md", "sm", "xs"],
      // Default column count
      "xs"
   ) as ScreenSize
}

export function useRefSize(ref: React.MutableRefObject<Element>) {
   const [size, setSize] = useState<{ [name: string]: undefined | number }>({ width: undefined, height: undefined })

   useEffect(() => {
      const compStyles = window.getComputedStyle(ref.current);
      const width = Number(compStyles.getPropertyValue('width').replace(/[^\d.-]/g, ''))
      const height = Number(compStyles.getPropertyValue('height').replace(/[^\d.-]/g, ''))
      setSize({ width, height })
      //eslint-disable-next-line
   }, [ref]);

   return size
}

export function useTimeout(callback: Function, delay: number) {
   // React hook for delaying calls with time
   // returns callback to use for cancelling
   const timeoutIdRef = useRef<NodeJS.Timeout | number>();
   const cancel = useCallback(() => {
      const timeoutId = timeoutIdRef.current;
      if (timeoutId) {
         timeoutIdRef.current = undefined;
         clearTimeout(timeoutId as number);
      }
   }, [timeoutIdRef])

   useEffect(() => {
      timeoutIdRef.current = setTimeout(callback, delay);
      return cancel;
   }, [callback, delay, cancel]);

   return cancel;
}