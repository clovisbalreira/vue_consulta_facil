import { createRouter, createWebHistory } from 'vue-router';
import Profissional from '../pages/Profissional.vue'
import Attendance from '../pages/Attendance.vue'
import Review from '../pages/Review.vue'
import Registration from '../pages/Registration.vue'

const routes = [
    {
        path: '/',
        name: 'profissional',
        component: Profissional
    },
    {
        path: '/attendance',
        name: 'attendance',
        component: Attendance
    },
    {
        path: '/review',
        name: 'review',
        component: Review
    },
    {
        path: '/registration',
        name: 'registration',
        component: Registration
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
)

export default router
