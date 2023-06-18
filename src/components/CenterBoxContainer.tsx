import { cx } from "@/lib/utils";
import React from "react";

interface Props extends React.PropsWithChildren {
   height?: string | number
   className?: ClassName
}
export default function CenterBoxContainer(props: Props) {
   return (
      <div
         style={{ height: props.height ?? `80%` }}
         className={cx(
            "flex-shrink-0 w-full flex-none grid place-items-center",
            props.className
         )}
      >
         {props.children}
      </div>
   )

}