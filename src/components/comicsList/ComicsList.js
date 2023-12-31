import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// import useMarvelService from '../../services/MarvelService'; для запросов данных напрямую у Marvel
import useMarvelServerService from '../../services/MarvelServerService'; // для запросов данных через промежуточный сервер
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';


const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <div className='centerer'><Spinner/></div>;
        case 'loading':
            return newItemLoading ? <Component/> : <div className='centerer'><Spinner/></div>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelServerService();


    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
            initial ? setNewItemLoading(false) : setNewItemLoading(true);
            getAllComics(offset)
                .then(onComicsListLoaded)
                .then(() => setProcess('confirmed'));
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            let imgStyle;
            (item.thumbnail.includes('image_not_available')) ? imgStyle = {'objectFit': 'unset'} : imgStyle = {'objectFit': 'cover'};
            return (
                <li className="comics__item" key={i} tabIndex={0}>
                    <NavLink to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" style={imgStyle}/>
                        <div className="comics__item-name" title={item.title}>{item.title.length < 40 ? item.title : `${item.title.slice(0,30)}...`}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </NavLink>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;

