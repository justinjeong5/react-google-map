import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { LOGOUT_USER_REQUEST } from '../../../_sagas/types';
import GoogleMaps from '../GoogleMaps/GoogleMaps'

function LandingPage(props) {
  const dispatch = useDispatch();
  const { logoutUserDone, userAuthentication } = useSelector(state => state.user)

  useEffect(() => {
    if (logoutUserDone) {
      props.history.push('/login');
    }
  }, [logoutUserDone])

  const handleLogout = () => {
    dispatch({ type: LOGOUT_USER_REQUEST })
  }

  return (
    <>
      <div >
        <h2>시작 페이지</h2>
        {userAuthentication && userAuthentication.isAuth && <button onClick={handleLogout}>로그아웃</button>}
        <GoogleMaps />
      </div>
    </>
  )
}

export default withRouter(LandingPage);
