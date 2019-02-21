import Home from './components/Home.vue'
import Checkout from './components/Checkout.vue'

export const routes = [
    { path: '', component: Home },
    { path: '/checkout', component: Checkout, name: 'checkout' }
]
