import { useState } from 'react'
import { differenceInCalendarDays, getHours, getMinutes, getSeconds } from "date-fns"
import { useInterval } from '../lib/utils'

export default function DemoCounter() {
   const [numberOfDemoDays] = useState(132)
   const [startDate] = useState("01/04/2021") //dd-mm-yy
   const [counter, setCounter] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

   function updateCountdown() {
      // const today = addDays(new Date(), 19)
      const dates = [new Date(startDate), new Date()] as const
      const diff = Math.abs(differenceInCalendarDays(...dates))

      const days = numberOfDemoDays - diff
      const hours = 24 - getHours(dates[1]) - 1
      const minutes = 60 - getMinutes(dates[1]) - 1
      const seconds = 60 - getSeconds(dates[1]) - 1
      setCounter({ days, hours, minutes, seconds })
   }

   useInterval(updateCountdown)
   const expired = counter.days < 1

   return (
      <div className="space-y-2">
         <p className="text-sm text-gray-400">Demo license {expired ? "expired" : "expires in"}</p>
         <div className="flex space-x-2">
            <Time number={counter.days} text={counter.days !== 1 ? "days" : "day"} />
            <Time number={counter.hours} text={counter.hours !== 1 ? "hrs" : "hr"} />
            <Time number={counter.minutes} text={counter.minutes !== 1 ? "mins" : "min"} />
            <Time number={counter.seconds} text="secs" />
         </div>
      </div>
   )
}

const Time = (args: { number: number, text: string }) => {
   return (
      <p className="text-red-600 font-bold border flex flex-col items-center px-2 py-1 rounded-md">
         <span>{args.number}</span>
         <span className="uppercase font-normal tracking-wider text-xs text-gray-500">
            {args.text}
         </span>
      </p>
   )
}
