import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

// import useMarvelService from '../../services/MarvelService'; для запросов данных напрямую у Marvel
import useMarvelServerService from '../../services/MarvelServerService'; // для запросов данных через промежуточный сервер
import AppBanner from '../appBanner/AppBanner';
import setContent from '../../utils/setContent';

import './singleComicsPage.scss';

const ItemPage = (props) => {
    const {itemType} = props;
    const {itemId} = useParams();
    const [item, setItem] = useState(null);
    const {getComic, getCharacter, process, setProcess, clearError} = useMarvelServerService();
    let getItem;

    itemType === 'comic'
    ? getItem = getComic
    : getItem = getCharacter;

    useEffect(() => {
        onRequest(itemId);
    }, [itemId]);

    const onRequest = (itemId) => {
        clearError();
        getItem(itemId)
            .then(onItemLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onItemLoaded = (item) => {
        setItem(item);
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, item, View, itemType)}
        </>
    )

}

const View = ({data, itemType}) => {
    const {description, pageCount, language, price, thumbnail} = data;
    let backLink = itemType === 'comic' ? '/comics' : '/';

    const comicInfo = itemType === 'comic' ?
        <>
            <p className="single-comic__descr">{pageCount} pages</p>
            <p className="single-comic__descr">Language: {language}</p>
            <div className="single-comic__price">{price}</div>
        </>
        : null;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`Marvel Information Portal - ${data.title || data.name}`}
                />
                <title>{data.title || data.name}</title>
            </Helmet>
            <img src={thumbnail} alt={data.title || data.name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{data.title || data.name}</h2>
                <p className="single-comic__descr">{description}</p>
                {comicInfo}
            </div>
            <Link to={backLink} className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default ItemPage;