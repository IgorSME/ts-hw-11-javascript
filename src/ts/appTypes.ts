export interface IRefs{
    searchForm: HTMLFormElement | null,
    gallery: HTMLDivElement | null,
    loadMore: HTMLDivElement | null
}

export interface ICard{
    webformatURL: string;
  largeImageURL: string;
  tags: string;
  likes: number;
  views: number;
  comments: number;
  downloads: number;
}