/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable linebreak-style */
import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    TagSection,
    ContentRating,
    LanguageCode,
    TagType
} from 'paperback-extensions-common'
import {
    isLastPage,
    parseTags,
    parseChapterDetails,
    parseChapters,
    // parseHomeSections,
    parseMangaDetails,
    parseSearch,
    parseViewMore,
    generateSearch
} from './ReadMangaParser'

const READMANGA_DOMAIN = 'https://readmanga.io/'
const READMANGA_MANGA = READMANGA_DOMAIN + '/manga/'
const method = 'GET'
const headers = {
    referer: READMANGA_DOMAIN
}

export const ReadMangaInfo: SourceInfo = {
    version: '1.0.0',
    name: 'ReadManga',
    icon: 'icon.png',
    author: 'Mory1879',
    authorWebsite: 'https://github.com/Mory1879',
    description: 'Extension that pulls manga from ReadManga',
    language: LanguageCode.RUSSIAN,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: READMANGA_DOMAIN,
    sourceTags: [
        {
            // eslint-disable-next-line quotes
            text: "Not all reader's features supported",
            type: TagType.YELLOW
        }
    ],
}

export class ReadManga extends Source {
    requestManager = createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 20000,
    })

    override getMangaShareUrl(mangaId: string): string { return `${READMANGA_MANGA}${mangaId}.html` }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${READMANGA_DOMAIN}${mangaId}`,
            method,
        })
    
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
    
        return parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${READMANGA_DOMAIN}${mangaId}`,
            method,
        })
    
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const requestForType = createRequestObject({
            url: `${READMANGA_DOMAIN}${mangaId}`,
            method,
        })
    
        const responseForType = await this.requestManager.schedule(requestForType, 1)
        const $ForType = this.cheerio.load(responseForType.data)
    
        const isManhwa = $ForType('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(6) > span.elem_category > a').text() === 'Манхва'
    
        const request = createRequestObject({
            url: `${READMANGA_DOMAIN}${mangaId}/${chapterId}`,
            method,
            headers,
        })
    
        const response = await this.requestManager.schedule(request, 1)


        // селектор для скрипт-тега, который хранит в себе ссылку на ТЕКУЩУЮ страницу
        // #wrap > div.reader-controller.pageBlock.container.reader-bottom.bordered-page-block > script
    
        // сам тег
        // <script type="text/javascript">
        // var prevLink = true;
        // var nextLink = true;
        // var nextChapterLink = "/plamennaia_brigada_pojarnyh_/vol34/295";
        
        // rm_h.initReader( [2,3], [['https://h111.rmr.rocks/','',"auto/54/11/79/181.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/182.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/183.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/184.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/185.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/186.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/187.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/188.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/189.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/190.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/191.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/192.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/193.jpg_res.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/194.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/195.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/196.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/197.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/198.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/199.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/200.jpg",1115,1600],['https://h111.rmr.rocks/','',"auto/54/11/79/300.jpg_res.jpg",1612,1600]], 0, false, [{"path":"https://h111.rmr.rocks/","res":true}], false);
        // </script>


        // поправить chapterId
        return parseChapterDetails(mangaId, chapterId, response.data, isManhwa)
    }

    // TODO: check if this is possible to do
    // override async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
    //     let page = 1
    //     let updatedManga: UpdatedManga = {
    //         ids: [],
    //         loadMore: true
    //     }

    //     while (updatedManga.loadMore) {
    //         const request = createRequestObject({
    //             url: `${FF_DOMAIN}/releases/${page++}`,
    //             method: 'GET',
    //         })

    //         const response = await this.requestManager.schedule(request, 1)
    //         const $ = this.cheerio.load(response.data)

    //         updatedManga = parseUpdatedManga($, time, ids)
    //         if (updatedManga.ids.length > 0) {
    //             mangaUpdatesFoundCallback(createMangaUpdates({
    //                 ids: updatedManga.ids
    //             }))
    //         }
    //     }
    // }

    override async getHomePageSections(_sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestHome = createRequestObject({
            url: `${READMANGA_DOMAIN}`,
            method: 'GET',
        })
        const responseHome = await this.requestManager.schedule(requestHome, 1)
        const $home = this.cheerio.load(responseHome.data)

        console.log({
            $home
        })

        // false && sectionCallback(section)
        // false && console.log(section)

        // const $popularNew = $home('#mangaBox > div.leftContent > div:nth-child(2) > div.tiles-row__scroller')
        // const $editorsChoice = $home('#mangaBox > div.leftContent > div:nth-child(4) > div.tiles-row__scroller')
        // const $newManga = $home('#mangaBox > div.leftContent > div:nth-child(6) > div.tiles-row__scroller')
        // const $popularWeekly = $home('#mangaBox > div.leftContent > div:nth-child(8) > div.tiles-row__scroller')

        // const sections = [
        //     {
        //         sectionID: createHomeSection({ id: 'popular_new', title: 'Обновление популярноего', view_more: false }),
        //         selector: $popularNew,
        //     },
        //     {
        //         sectionID: createHomeSection({ id: 'editors_choice', title: 'Выбор редакции', view_more: false }),
        //         selector: $editorsChoice,
        //     },
        //     {
        //         sectionID: createHomeSection({ id: 'new_manga', title: 'Горячие новинки', view_more: true }),
        //         selector: $newManga,
        //     },
        //     {
        //         sectionID: createHomeSection({ id: 'popular_weekly', title: 'Популярные на этой неделе', view_more: false }),
        //         selector: $popularWeekly,
        //     },

        // ]

        // for (const section of sections) {
        //     parseHomeSections(section.selector, section, sectionCallback)
        // }
    }

    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        // ?offset=20 = second page
        // ?offset=40 = third page
        const offset = page > 1 ? `?offset=${20 * (page - 1)}` : ''
        let param = ''
        switch (homepageSectionId) {
            case 'new_manga':
                param = '/mostfavorites' + offset
                break
            case 'popular':
                param = '/manga/new' + offset
                break
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }
        const request = createRequestObject({
            url: `${READMANGA_DOMAIN}`,
            method: 'GET',
            param,
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($)
        metadata = !isLastPage($) ? { page: page + 1 } : undefined
        return createPagedResults({
            results: manga,
            metadata
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page : number = metadata?.page ?? 1
        const search = encodeURI(generateSearch(query))
        // TODO: tags
        // let request
        // if (query.includedTags) {
        //     request = createRequestObject({
        //         url: `${READMANGA_DOMAIN}/tags/${query.includedTags.join('+')}`,
        //         method,
        //         headers,
        //     })
        // } else {
        // }
        const request = createRequestObject({
            url: `${READMANGA_DOMAIN}/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&result_num=40&story=${search}&need_sort_date=false`,
            method,
            headers,
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        const manga = parseSearch($)
        metadata = !isLastPage($) ? {page: page + 1} : undefined
        
        return createPagedResults({
            results: manga,
            metadata
        })
    }

    override async getTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${READMANGA_DOMAIN}/catalog?`,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseTags($)
    }
}