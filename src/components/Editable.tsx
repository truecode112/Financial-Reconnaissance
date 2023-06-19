import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Spinner from "./Spinner";
import { useMutate } from "../lib/fetch";
import Button from "./Button";
import Select from "./Select";
import { LoadMore } from "./Table";
import { cx, passwordify } from "../lib/utils";

export interface EdiTableProps {
  headers: _TableHeader[],
  mutationUrl: string,
  refetchKey: any[],
  data?: _Object[],
  isLoading?: boolean,
  method?: "get" | "post" | "put" | "delete"
  buttonText?: string,
  loadMore?: boolean,
  fetchMore?: boolean
  setOffset?: SetState<number>,
  hasConnect?: boolean,
}

export default function Editable({ fetchMore = true, ...props }: EdiTableProps) {
  return (
    <div className={`h-full bg-white border rounded-lg overflow-y-auto scrollbar shadow-lg`}>
      <table className="bg-white border-collapse min-w-full">
        <thead>
          <tr>
            {/* selected indicator and spacer ---> ghost */}
            <th className="w-2 bg-gray-50 h-full sticky top-0 left-0 z-20">
              <div className="h-full opacity-0"></div>
            </th>

            {
              props.headers.map((elem, i) => {
                let { key, label, orderBy, suffix = "", sticky = false } = elem
                label = (label ?? key).replace(/_/gi, " ") + ' ' + suffix

                return (
                  <th
                    key={i}
                    scope="col"
                    className={cx(
                      'h-11 px-4 py-3 text-left text-xs font-bold text-gray-400 bg-gray-50',
                      'tracking-wider whitespace-nowrap sticky top-0 uppercase',
                      sticky ? "left-0 z-30" : "z-20"
                    )}
                  >
                    <div className={`flex items-center space-x-2 ${orderBy && "cursor-pointer"}`}>
                      <span>{label}</span>
                      {orderBy && <span className="text-md text-gray-400"><FiArrowUp /></span>}
                    </div>
                  </th>
                )
              })
            }
            {/* Extra table head to accomodate the extra buttons columns*/}
            <th className="bg-gray-50 h-full sticky top-0 left-0 z-20"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {
            props.data?.map((entry, index) =>
              <TableRow
                data={entry}
                key={entry.id ?? index}
                headers={props.headers}
                buttonText={props.buttonText}
                mutationUrl={props.mutationUrl}
                method={props.method}
                hasConnect={props.hasConnect}
                refetchKey={props.refetchKey}
              // mockMutation={props.mockMutation}
              />
            )
          }
        </tbody>
      </table>
      {
        props.data &&
        <LoadMore
          data={props.data}
          loadMore={fetchMore}
          setOffset={props.setOffset}
          isLoading={props.isLoading}
        />
      }
    </div>
  )
}

function TableRow(props: Omit<EdiTableProps, 'data'> & { data: _Object }) {
  const [isEditing, setIsEditing] = useState(false)
  const [hasEdited, setHasEdited] = useState(false)
  const [defaultValues, setDefaultValues] = useState<_Object>({})

  console.log('TableRow >>> ', props.hasConnect);
  const { isLoading, mutate } = useMutate({
    method: props.method,
    url: props.mutationUrl,
    refetchKey: props.refetchKey,
    successMessage: "Request processed succesfully",
    onSuccessCallback: () => setIsEditing(false)
  })

  function handleChange(event: React.ChangeEvent<any>, modifier: _TableHeader['modifier']) {
    let { name, value } = event.target
    value = modifier?.(value) ?? value
    setDefaultValues(prev => ({ ...prev, [name]: value }))
    !hasEdited && setHasEdited(true)
  }

  function handlePost() {
    let postData = { ...props.data };
    // At the point of posting [defaultValues] has already been set by useEffect as [isEditing] is already true
    for (const key in defaultValues) {
      if (typeof defaultValues[key] === "number" || defaultValues[key]?.length) {
        postData[key] = defaultValues[key]
      } else postData[key] = null
      if (["undefined", "null"].includes(key)) delete postData[key]
    }

    if (!isLoading) {
      props.mutationUrl && mutate(postData as any)
      // props.mockMutation?.(postData)
    }
  }

  function handleConnect() {
    let postData = { ...props.data };
    console.log('postData >>> ', postData);
    //alert(postData.ipAddress);
    window.open(`/${postData.ipAddress}`, '_blank');
  }

  //When editing is enabled
  useEffect(() => {
    if (isEditing) {
      // Convert all the keys into state object with values from props, ready for editing
      const map: _Object = {}
      props.headers.forEach(elem => {
        const { elementType, key } = elem
        if (elementType?.name !== 'static' && key) {
          map[key] = elementType?.empty ? "" : props.data[key]
        }
      })
      setDefaultValues(map)
    } else {
      setDefaultValues({})
      setHasEdited(false)
    }
  }, [isEditing, props.headers, props.data])

  return (
    <tr className={`${isEditing ? 'bg-blue-50' : 'bg-white'} `}>
      <td className={`spacer ${isEditing ? "bg-red-500" : ""}`}></td>
      {
        props.headers.map((elem, index) => {
          const { elementType, placeholder, modifier, capitalize = true } = elem
          const label = elem.label ?? elem.key
          const _key = elem.key ?? elem.label
          const is_pwd = elem.password ?? false
          const value = elementType?.empty ? "" : props.data[_key]

          return (
            <td
              key={label + index}
              style={{ minWidth: 120 }}
              aria-label={label}
              onClick={() => !isEditing && !props.hasConnect && setIsEditing(true)}
              className={cx(
                'p-4 cursor-pointer text-sm',
                elem.sticky && "sticky left-0 z-10",
                value?.length <= 15 && "whitespace-nowrap"
              )}>
              {
                isEditing ? (
                  elementType?.name === "static" ?
                    <div className={`text-gray-600 ${capitalize && "capitalize"}`}>
                      {value}
                    </div>
                    : elementType?.name === "select" ?
                      <Select
                        name={_key}
                        initialValue={value}
                        options={elementType.initialOptions}
                        onChange={handleChange}
                        noLabel
                      />
                      :
                      <input
                        name={elem.key ?? label}
                        aria-label={label}
                        type={is_pwd ? 'password' : elementType?.inputType ?? 'text'}
                        placeholder={placeholder}
                        value={defaultValues?.[_key] ?? ''}
                        onChange={(e) => handleChange(e, modifier)}
                      />
                )
                  :
                  <div
                    className={cx(
                      'text-gray-600',
                      capitalize && "capitalize",
                      value?.length < 20 && "whitespace-nowrap"
                    )}
                  >
                    {is_pwd ? passwordify(value) : value}
                  </div>
              }
            </td>
          )
        })
      }
      <td>
        <div
          style={{ width: 160 }}
          className="grid grid-cols-2 gap-3 items-center ring-inset"
        >
          {
            isEditing ?
              <Button
                name="update"
                variant={!isEditing ? "light" : undefined}
                disabled={!isEditing || isLoading || !hasEdited}
                onClick={() => isEditing && handlePost()}
                fullWidth
              >
                {isLoading ? <Spinner color="text-white" /> : (props.buttonText ?? "Update")}
              </Button>
              : null
          }
          {
            !props.hasConnect &&
            <Button
              name="edit"
              variant={'transparent'}
              className={cx('col-start-2', isEditing ? '!px-2' : '')}
              onClick={() => setIsEditing(v => !v)}
            >
              {/* {props.hasConnect ? "Connect" : isEditing ? "Cancel" : "Edit"} */}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          }

          {
            props.hasConnect &&
              <Button
                name="connect"
                variant={'transparent'}
                className={cx('col-start-2 !px-0')}
                onClick={() => handleConnect()}
              >
                {"Connect"}
              </Button>
          }
        </div>
      </td>
    </tr>
  )
}