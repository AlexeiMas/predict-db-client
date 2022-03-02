export const routes = {
  default: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: {
    base: "/dashboard",
    extended: ["/dashboard", "/model(\\?Model_ID=.*)?"]
  },
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  notFound: '/not-found',
  modelID: "/dashboard(\\?Model_ID=.*)?",
  analytics: '/analytics'
}