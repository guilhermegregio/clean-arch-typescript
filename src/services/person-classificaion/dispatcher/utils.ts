import {EventSchema} from './types'

const setFixedPipedEvent =
  (event: EventSchema) => (pipedEvent: EventSchema) => ({
    ...pipedEvent,
    ...event,
  })

const setEvent = (event: string) => setFixedPipedEvent({event})
const setCategory = (category: string) => setFixedPipedEvent({category})
const setAction = (action: string) => setFixedPipedEvent({action})
const setLabel = (label: string) => setFixedPipedEvent({label})

const setParamEvent = (event: EventSchema) => ({...event})

const setReceivedLabel = (label: string) => setParamEvent({label})
const setReceivedPath = (path: string) => setParamEvent({path})

export {
  setEvent,
  setCategory,
  setAction,
  setLabel,
  setReceivedLabel,
  setReceivedPath,
}
