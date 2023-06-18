import { useState } from 'react';
import { useInterval } from '../lib/utils';

export default function ClearCache() {
   const [interval] = useState(1000 * 60 * 60 * 6)

   const handleClear = () => {
      const caches = window.caches
      if (caches) {
         caches.keys?.().then(async (names) => {
            if (names?.length > 0) {
               await Promise.all(names.map(name => caches.delete?.(name)))
               console.log(names.length, "cache entries have been cleared");
            } else {
               console.log("No entries in cache")
            }
         })
      }
      window.location.reload()
   }

   useInterval(() => handleClear(), interval)

   return null
}