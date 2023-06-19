import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/Page404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComic = lazy(() => import('../pages/SingleComicPage'));
const SingleItem = lazy(() => import('../pages/SingleItemPage'));

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<div className="centerer"><Spinner/></div>}>
                        <Routes>
                            <Route path="marvel-react-app/" element={<MainPage/>}/>
                            <Route path="marvel-react-app/comics" element={<ComicsPage/>}/>
                            <Route path="marvel-react-app/comics/:itemId" element={<SingleItem itemType="comic"/>}/>
                            <Route path="marvel-react-app/character/:itemId" element={<SingleItem itemType="char"/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;



