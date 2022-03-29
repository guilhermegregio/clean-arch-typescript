export interface EventSchema {
  category?: string
  event?: string
  path?: string
  action?: string
  label?: string
}

export type DispatchEvent = (eventData: EventSchema) => EventSchema

