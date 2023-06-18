import { useHttp } from "../hooks/http.hook";

const useMarvelServerService = () => {

    const {process, request, clearError, setProcess} = useHttp();

    // функция приведения данных в удобный вид
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


    const getAllCharacters = async () => {
        const res = await request('https://iamdef.ru/react-back/marvel-access.php');
        return res.data.results.map(_transformCharacter);
    }

    return {getAllCharacters};
}

export default useMarvelServerService;



