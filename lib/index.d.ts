export declare type ProcessFunction = Function & {
  id: string
}
export declare type ProcessFunctions = {
  id: string
} & Function[]
export declare type ProcessorCore = ProcessFunction | ProcessFunctions
export declare type Processor = string | ProcessorCore | [string, any]
declare type ComOptions = {
  parallel?: boolean
}
export declare type Options = ComOptions & {
  cwd?: string
  userc?: boolean
}
export declare type RCOptions = ComOptions & {
  processors: Processor[]
}
export declare const explorer: any
export default function tranz(input: any, processors?: Processor[], opts?: Options): Promise<any>
export {}
