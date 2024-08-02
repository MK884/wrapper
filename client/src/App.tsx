import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/main.scss'
import { Layout, RequireAuth } from './layout';
import { About, CreateShortLink, CreatNew, Help, Home, Setting, UserStart } from './view';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <Suspense fallback={<div>Loading....</div>}>
            <RouteApp />
        </Suspense>
    );
};

const RouteApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/get-start' element={<UserStart />}/>


                {/* protected route */}
                <Route element={<Layout />}>
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-new" element={<CreatNew />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/sl" element={<CreateShortLink />} />
                </Route>
                </Route>
            </Routes>
        <ToastContainer position='bottom-right'/>
        </BrowserRouter>
    );
};

export default App;
