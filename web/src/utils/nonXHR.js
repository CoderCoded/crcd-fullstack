import { BAD_REQUEST } from 'http-codes'

export default function nonXHR (res) {
  return res.status(BAD_REQUEST).send('Requests made with XMLHttpRequest only allowed.')
}
