import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { LOGOUT_USER_REQUEST } from '../../../_sagas/types';

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <h2>시작 페이지</h2>
      {userAuthentication && userAuthentication.isAuth && <button onClick={handleLogout}>로그아웃</button>}
    </div>
  )
}

export default withRouter(LandingPage);
 