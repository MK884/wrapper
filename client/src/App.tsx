import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/main.scss';
import { Layout, RequireAuth } from './layout';
import {
    About,
    CreateShortLink,
    CreatNew,
    Analytics,
    Help,
    Home,
    Redirect,
    Setting,
    ShortLink,
    UserStart,
    Wrapper,
} from './view';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Test from './view/Test';
import { Loader } from './ui';

const App = () => {
    return (
        <Suspense fallback={<Loader />}>
            <RouteApp />
        </Suspense>
    );
};

const RouteApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/get-start" element={<UserStart />} />
                <Route path="/:shortUrl" element={<Redirect />} />
                <Route path="/test" element={<Test />} />

                {/* protected route */}
                <Route element={<Layout />}>
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/p/:projectId" element={<Analytics />} />
                        <Route path="/create-new" element={<CreatNew />} />
                        <Route path="/sl" element={<ShortLink />} />
                        <Route path="/create-sl" element={<CreateShortLink />}  />
                        <Route path="/help" element={<Help />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/setting" element={<Setting />} />
                        <Route path="/create-wrapper" element={<Wrapper />} />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer position="bottom-right" />
        </BrowserRouter>
    );
};

export default App;
