import { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import './charList.scss';
import './transition.css';
// import useMarvelService from '../../services/MarvelService'; для запросов данных напрямую у Marvel
import useMarvelServerService from '../../services/MarvelServerService'; // для запросов данных через промежуточный сервер
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const itemRefs = useRef([]);
    
    const duration = 500;

    const {getAllCharacters, process, setProcess} = useMarvelServerService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }


    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
               <li 
                   className="char__item"
                   tabIndex={0}
                   ref={el => itemRefs.current[i] = el}
                   key={item.id}
                   onClick={() => {
                       props.onCharSelected(item.id);
                       focusOnItem(i);
                   }}
                   onKeyPress={(e) => {
                       if (e.key === ' ' || e.key === "Enter") {
                           props.onCharSelected(item.id);
                           focusOnItem(i);
                       }
                   }}>
                       <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                       <div className="char__name">{item.name}</div>
               </li>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup className="char__grid">
                    {items.map((item, i) => (
                        <CSSTransition
                            key={item.key}
                            timeout={duration}
                            classNames={
                                (i + 1) % 3 === 0 ? 'animatedChar_3'
                                : (i + 1) % 2 === 0 ? 'animatedChar_2'
                                : 'animatedChar'
                            }>
                            {item}
                        </CSSTransition>
                    ))}
                </TransitionGroup>             
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
    }, [process]);
    // eslint-disable-next-line 

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;


