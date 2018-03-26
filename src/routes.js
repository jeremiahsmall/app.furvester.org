import HomePage from './pages/home/HomePage';
import SchedulePage from './pages/schedule/SchedulePage';
import MapPage from './pages/map/MapPage';
import AchievementsPage from './pages/achievements/AchievementsPage';
import SignInPage from './pages/sign-in/SignInPage';

export default [
    {name: 'home', path: '/', component: HomePage},
    {name: 'schedule', path: '/schedule', component: SchedulePage},
    {name: 'map', path: '/map', component: MapPage},
    {name: 'achievements', path: '/achievements', component: AchievementsPage},
    {name: 'sign-in', path: '/sign-in', component: SignInPage},
];
