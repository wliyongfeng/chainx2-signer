import React, { useEffect, useRef, useState } from 'react'
import { useOutsideClick, useRedux } from '../shared'
import { useSelector, useDispatch } from 'react-redux'
import { setHomeLoading } from '../store/reducers/statusSlice'
import ClipboardJS from 'clipboard'
import { getToSign } from '../messaging'
import Icon from '../components/Icon'
import './index.scss'
import logo from '../assets/extension_logo.svg'
import { currentChainxAccountSelector } from '../store/reducers/accountSlice'

function Home(props) {
  const ref = useRef(null)
  const [showAccountAction, setShowAccountAction] = useState(false)
  const dispatch = useDispatch()
  const homeLoading = useSelector(state => state.status.homeLoading)
  const [{ isTestNet }] = useRedux('isTestNet')
  const [copySuccess, setCopySuccess] = useState('')
  const currentAccount = useSelector(currentChainxAccountSelector)

  useEffect(() => {
    setCopyEvent()
    getUnapprovedTxs()
    // eslint-disable-next-line
  }, [isTestNet])

  useOutsideClick(ref, () => {
    setShowAccountAction(false)
  })

  async function getUnapprovedTxs() {
    try {
      const toSign = await getToSign()
      if (toSign) {
        props.history.push({
          pathname: '/requestSign/' + toSign.id,
          query: toSign
        })
      }
    } catch (error) {
      console.log('sign request error occurs ', error)
    } finally {
      dispatch(setHomeLoading(false))
    }
  }

  function setCopyEvent() {
    const clipboard = new ClipboardJS('.copy')
    clipboard.on('success', function() {
      setCopySuccess('Copied!')
      setTimeout(() => {
        setCopySuccess('')
      }, 2000)
    })
  }

  async function operateAccount(type) {
    if (currentAccount.address) {
      props.history.push({
        pathname: '/enterPassword',
        query: {
          address: currentAccount.address,
          keystore: currentAccount.keystore,
          type: type
        }
      })
    }
    setShowAccountAction(false)
  }

  if (homeLoading) {
    return <></>
  }

  return (
    <>
      {currentAccount ? (
        <div className="container-account">
          <div className="account-title">
            <span className="name">{currentAccount.name}</span>
            <div
              ref={ref}
              className="arrow"
              onClick={() => {
                setShowAccountAction(!showAccountAction)
              }}
            >
              <Icon className="arrow-icon" name="Arrowdown" />
            </div>
            {showAccountAction ? (
              <div className="account-action">
                <span onClick={() => operateAccount('export')}>
                  Export PrivateKey
                </span>
                <span onClick={() => operateAccount('remove')}>
                  Forget Account
                </span>
              </div>
            ) : null}
          </div>
          <div className="account-address">
            <span>{currentAccount.address}</span>
          </div>
          <button className="copy" data-clipboard-text={currentAccount.address}>
            <Icon className="copy-icon" name="copy" />
            <span className="copy-text">Copy</span>
          </button>
          <span>{copySuccess}</span>
        </div>
      ) : (
        <div className="container container-column container-no-account">
          <div className="home-logo">
            <img src={logo} alt="logo" />
          </div>
          <button
            className="button button-white button-new-account"
            onClick={() => props.history.push('/createAccount')}
          >
            New Account
          </button>
          <button
            className="button button-white button-import-account"
            onClick={() => props.history.push('/importAccount')}
          >
            Import Account
          </button>
        </div>
      )}
    </>
  )
}

export default Home
