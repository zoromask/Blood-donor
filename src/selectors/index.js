import { createSelector } from 'reselect'

const receiveIsLoggedIn = state => state.login.isLoggedIn

export const getIsLoggedIn = createSelector(
	[receiveIsLoggedIn],
	(isLoggedIn) => isLoggedIn
)
const receiveUser = state => state.login.user
export const getUser = createSelector(
	[receiveUser],
	(user) => user
)