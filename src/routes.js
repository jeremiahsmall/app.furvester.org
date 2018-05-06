import HomePage from './pages/home/HomePage';
import SchedulePage from './pages/schedule/SchedulePage';
import EventPage from './pages/schedule/EventPage';
import MapPage from './pages/map/MapPage';
import TeamPage from './pages/team/TeamPage';
import AboutPage from './pages/about/AboutPage';
import AchievementsPage from './pages/achievements/AchievementsPage';
import SignInPage from './pages/sign-in/SignInPage';

export default [
    {name: 'home', path: '/', component: HomePage},
    {name: 'schedule', path: '/schedule', component: SchedulePage, children: [
        {
            name: 'event',
            path: ':eventId',
            component: EventPage,
        }
    ]},
    {name: 'map', path: '/map', component: MapPage},
    {name: 'team', path: '/team', component: TeamPage},
    {name: 'about', path: '/about', component: AboutPage},
    {name: 'achievements', path: '/achievements', component: AchievementsPage},
    {name: 'sign-in', path: '/sign-in', component: SignInPage},
    {path: '*', redirect: {name: 'home'}},
];
