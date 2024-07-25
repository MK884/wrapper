import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/main.scss'
import { Layout } from './layout';
import { About, CreatNew, Help, Home, UserStart } from 'view';

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
                <Route path="/" element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="create-new" element={<CreatNew />} />
                    <Route path="help" element={<Help />} />
                    <Route path="about" element={<About />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
