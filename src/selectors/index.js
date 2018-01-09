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

const receiveUserInfo = state => state.app.userInfo
export const getUserInfo = createSelector(
	[receiveUserInfo],
	(userInfo) => userInfo
)
const receiveDonors = state => state.app.donors
export const getDonors = createSelector(
	[receiveDonors],
	(donors) => donors
)