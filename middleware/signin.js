export default ({ store, redirect }) => {
  if (store.state.auth.loggedIn) return redirect('/')
}
