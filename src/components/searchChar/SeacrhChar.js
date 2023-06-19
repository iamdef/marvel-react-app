import { useState } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
// import useMarvelService from '../../services/MarvelService'; для запросов данных напрямую у Marvel
import useMarvelServerService from '../../services/MarvelServerService'; // для запросов данных через промежуточный сервер

import './searchChar.scss';

const SearchChar = () => {
    const [char, setChar] = useState(null);
    const [seacrhError, setSearchError] = useState(false);

    const {getCharacterByName, process, setProcess, clearError} = useMarvelServerService();

    const onRequest = (name) => {
        clearError();
        getCharacterByName(name)
            .then(onCharloaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharloaded = (char) => {
        if(char.length === 0) {
            setChar(null);
            setSearchError(true)
        } else {
            setChar(char);
            setSearchError(false);
        } 
    }

    const errorMessage =
        <div className='searchChar__row' style={{'color': '#9F0013'}}>
            {process === 'error' ? 'Something went wrong... Try again later'
            : seacrhError ? 'A character with that name was not found. Check the name and try again!' : null}
        </div>;

    const success = char ?
        <div className='searchChar__row'>
            <div className='searchChar__status'>{`There is! Visit ${char[0].name} page?`}</div>
            <Link
                to={char ? `character/${char[0].id}` : ''}
                className="button button__secondary"
                style={{"visibility": char ? "visible" : "hidden"}}>
                <div className="inner">TO PAGE</div>
            </Link> 
        </div>
        : null;

    return (
        <div className='searchChar__wrapper'>
            <Formik
                initialValues= {{
                    name: '',
                }}
                validationSchema={
                    Yup.object({
                        name: Yup.string()
                                    .min(3, 'Too short! Minimum 2 symbols.')
                                    .required('Required field!')
                    })
                }
                onSubmit={values => onRequest(values.name)}
            >
                <Form className="searchChar__form">
                    <label className='searchChar__formname' htmlFor="name">Or find a character by name:</label>
                    <Field
                        className="searchChar__input"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter name"
                    />
                    <button
                        className="button button__main"
                        type="submit"
                        disabled={process === 'loading'}>
                        <div className="inner">FIND</div>
                    </button>
                    <ErrorMessage
                        className="searchChar__status"
                        style={{'color': '#9F0013', 'fontSize': '12px'}}
                        name="name"
                        component="div"
                    />
                </Form>
            </Formik>
            {errorMessage}
            {success}
        </div>
    )
}

export default SearchChar;

