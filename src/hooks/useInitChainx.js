import { useEffect } from 'react'
import { setChainx, sleep } from '../shared'
import { paths } from '../constants'
import { setInitLoading } from '../store/reducers/statusSlice'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { currentNodeSelector } from '@store/reducers/nodeSlice'
import { CHAINX_MAIN, CHAINX_TEST } from '@store/reducers/constants'
import { networkSelector } from '@store/reducers/settingSlice'

export default function useInitChainx() {
  const history = useHistory()
  const { url: currentNodeUrl } = useSelector(currentNodeSelector) || {}
  const dispatch = useDispatch()
  const chain = useSelector(networkSelector)

  useEffect(() => {
    if (![CHAINX_MAIN, CHAINX_TEST].includes(chain)) {
      return
    }

    console.log('init chainx')
    dispatch(setInitLoading(true))
    Promise.race([setChainx(currentNodeUrl), sleep(10000)])
      .then(chainx => {
        if (!chainx) {
          history.push(paths.nodeError)
        } else if (history.location.pathname === paths.nodeError) {
          history.push('/')
        }
      })
      .catch(e => {
        console.log(`set Chainx catch error: ${e}`)
      })
      .finally(() => {
        dispatch(setInitLoading(false))
      })
  }, [chain, currentNodeUrl, dispatch, history])
}
