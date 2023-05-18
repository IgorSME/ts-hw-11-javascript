import axios, { AxiosResponse } from 'axios';
export { fetchImages }


async function fetchImages(search:string, page:number):Promise<AxiosResponse> {
    const res = await axios(`https://pixabay.com/api/?key=28071781-459ddb4c5fc455b50beadddbb&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)

    return res.data;
}

