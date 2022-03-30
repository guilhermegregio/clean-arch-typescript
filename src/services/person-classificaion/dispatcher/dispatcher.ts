import {pipe} from 'ramda'
import {DispatchEvent} from './types'
import {setCategory, setEvent} from './utils'

const dispatchEvent: DispatchEvent = event => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)

  return event
}

const dispatchPersonClassificationEvent: DispatchEvent = pipe(
  setCategory('person_classification'),
  setEvent('TODO'), // TODO: verificar qual o event name devemos enviar
  dispatchEvent,
)

export {dispatchEvent, dispatchPersonClassificationEvent}
