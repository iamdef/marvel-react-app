import { useHttp } from "../hooks/http.hook";

const useMarvelServerService = () => {

    const {process, request, clearError, setProcess} = useHttp();

    // функции приведения данных в удобный вид
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

    // запрашиваем данные

    const getAllCharacters = async () => {
        const res = await request('https://iamdef.ru/react-back/marvel-access.php?object=allCharacters');
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`https://iamdef.ru/react-back/marvel-access.php?object=character&id=${id}`);
		return _transformCharacter(res.data.results[0]);
	};

    const getCharacterByName = async (name) => {
        const res = await request(`https://iamdef.ru/react-back/marvel-access.php?object=characterByName&name=${name}`);
		return res.data.results.map(_transformCharacter);
	};

    const getAllComics = async () => {
        const res = await request(`https://iamdef.ru/react-back/marvel-access.php?object=allComics`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`https://iamdef.ru/react-back/marvel-access.php?object=comic&id=${id}`);
        return _transformComics(res.data.results[0]);
    }

    return {getAllCharacters,
            getCharacter,
            getCharacterByName,
            getAllComics,
            getComic,
            process,
            clearError,
            setProcess
        };
}

export default useMarvelServerService;



