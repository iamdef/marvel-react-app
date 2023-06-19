import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// import useMarvelService from '../../services/MarvelService'; для запросов данных напрямую у Marvel
import useMarvelServerService from '../../services/MarvelServerService'; // для запросов данных через промежуточный сервер
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharacter, process, clearError, setProcess} = useMarvelServerService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) return;
        clearError();
        getCharacter(charId)
            .then(onCharloaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharloaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, char, View)}
        </div>
    )


}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    let imgStyle;
    (thumbnail.includes('image_not_available')) ? imgStyle = {'objectFit': 'contain'} : imgStyle = {'objectFit': 'cover'};
    const content = () => {

        if (comics.length === 0) return 'There are no comics';

        return comics.map(item => {
            const comicsId = item.resourceURI.substring(43);
            return (
                <li key={comicsId} className="char__comics-item">
                    <NavLink to={`comics/${comicsId}`}>{item.name}</NavLink>
                </li>
            )
        })
    } 


    return (
        <>
        <div className="char__basics">
            <img src={thumbnail} alt={`${name}`} style={imgStyle}/>
            <div>
            <div className="char__info-name">{name}</div>
            <div className="char__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
            </div>
        </div>
        <div className="char__descr">
        {description}
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
            {content()}
        </ul>   
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;

