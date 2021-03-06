import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { paths } from '@constants'
import { chainx2ToSignSelector } from '@store/reducers/txSlice'

export default function useListenSignRequest() {
  const toSign = useSelector(state => state.tx.toSign)
  const chainx2ToSign = useSelector(chainx2ToSignSelector)
  const history = useHistory()

  useEffect(() => {
    try {
      if (chainx2ToSign) {
        history.push({ pathname: paths.chainx2Sign })
      } else if (toSign) {
        history.push({ pathname: paths.chainxSign })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    }
  }, [toSign, history, chainx2ToSign])
}
