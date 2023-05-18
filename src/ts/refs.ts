import { IRefs } from "./appTypes"


export default function getRefs():IRefs {
    return {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('div.gallery'),
    loadMore: document.querySelector('.load-more')
}
}

