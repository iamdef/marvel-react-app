import { useHttp } from "../hooks/http.hook";


const useMarvelService = () => {

    const {process, request, clearError, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=';
    const _baseOffset = 210;


	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(
			`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformCharacter);
	};

	const getCharacter = async (id) => {
		const res = await request(
            `${_apiBase}characters/${id}?${_apiKey}`
        );
		return _transformCharacter(res.data.results[0]);
	};

    const getCharacterByName = async (name) => {
		const res = await request(
            `${_apiBase}characters?name=${name}&${_apiKey}`
        );
		return res.data.results.map(_transformCharacter);
	};


    const getAllComics = async (offset = 0) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(
            `${_apiBase}comics/${id}?${_apiKey}`
        );
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 180)}...` : 'There is no description for this character, so you can tell us all you know about him!',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0,10)
        }
    }

    const prepareDesc = (desc) => {
        return desc.replace('<ul><li>', '').replace('</li></ul>', '').replace('</li><li>', ' ').replace('&rsquo;', '`');
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description
            ? prepareDesc(comics.description)
            : "There is no description",
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            price: comics.prices[0].price
                ? `${comics.prices[0].price}$`
                : 'NOT AVAILABLE',
            language: comics.textObjects[0]?.language || "en-us",
            pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",

        }
    }

    return {
            process,
            getAllCharacters,
            getCharacter,
            getCharacterByName,
            getAllComics,
            getComic,
            clearError,
            setProcess
            };

}

export default useMarvelService;

