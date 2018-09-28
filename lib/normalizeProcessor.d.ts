import { Processor, ProcessorCore } from './index'
export declare function normalizeProcessorPath(
  processor: Processor,
  {
    cwd
  }?: {
    cwd: string
  }
): [string, any] | ProcessorCore
export default function normalizeProcessor(
  processor: Processor,
  {
    cwd
  }?: {
    cwd: string
  }
): ProcessorCore
