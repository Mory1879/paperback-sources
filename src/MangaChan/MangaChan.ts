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
    MangaUpdates,
    TagSection,
    ContentRating,
    LanguageCode
} from 'paperback-extensions-common'
import {
    parseUpdatedManga,
    isLastPage,
    parseTags,
    parseChapterDetails,
    parseChapters,
    parseHomeSections,
    parseMangaDetails,
    parseSearch,
    parseViewMore,
    UpdatedManga,
    generateSearch
} from './MangaChanParser'

const MANGACHAN_DOMAIN = 'https://manga-chan.me'
const MANGACHAN_MANGA = MANGACHAN_DOMAIN + '/manga/'
const method = 'GET'
const headers = {
    referer: MANGACHAN_DOMAIN
}

const FF_DOMAIN = 'https://fanfox.net'

export const MangaChanInfo: SourceInfo = {
    version: '1.0.0',
    name: 'MangaChan',
    icon: 'icon.png',
    author: 'Mory1879',
    authorWebsite: 'https://github.com/Mory1879',
    description: 'Extension that pulls manga from MangaChan',
    language: LanguageCode.RUSSIAN,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: MANGACHAN_DOMAIN,
    sourceTags: [],
}

export class MangaChan extends Source {
    readonly cookies = [createCookie({ name: 'isAdult', value: '1', domain: 'www.mangahere.cc' })];

    requestManager = createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 20000,
    })

    override getMangaShareUrl(mangaId: string): string { return `${MANGACHAN_MANGA}${mangaId}.html` }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${MANGACHAN_MANGA}${mangaId}.html`,
            method,
        })
    
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
    
        return parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${MANGACHAN_MANGA}`,
            method,
            param: `${mangaId}.html`
        })
    
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const requestForType = createRequestObject({
            url: `${MANGACHAN_MANGA}${mangaId}.html`,
            method,
            headers,
        })
    
        const responseForType = await this.requestManager.schedule(requestForType, 1)
        const $ForType = this.cheerio.load(responseForType.data)
    
        const isManhwa = $ForType('#info_wrap > table > tbody > tr:nth-child(2) > td.item2 > h2 > span > a').text() === 'Манхва'
    
        const request = createRequestObject({
            url: `${MANGACHAN_DOMAIN}/online/${chapterId}.html`,
            method,
            headers,
        })
    
        const response = await this.requestManager.schedule(request, 1)
    
        return parseChapterDetails(mangaId, chapterId, response.data, isManhwa)
    }

    // TODO
    override async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        let page = 1
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${FF_DOMAIN}/releases/${page++}`,
                method: 'GET',
                cookies: this.cookies
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            updatedManga = parseUpdatedManga($, time, ids)
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }))
            }
        }

    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {

        const requestNew = createRequestObject({
            url: `${MANGACHAN_DOMAIN}/manga/new`,
            method: 'GET',
            cookies: this.cookies
        })
        const responseNew = await this.requestManager.schedule(requestNew, 1)
        const $new = this.cheerio.load(responseNew.data)

        const requestPopular = createRequestObject({
            url: `${MANGACHAN_DOMAIN}/mostfavorites`,
            method: 'GET',
            cookies: this.cookies
        })
        const responsePopular = await this.requestManager.schedule(requestPopular, 1)
        const $popular = this.cheerio.load(responsePopular.data)

        const sections = [
            {
                sectionID: createHomeSection({ id: 'new_manga', title: 'Новинки', view_more: true }),
                selector: $new,
            },
            {
                sectionID: createHomeSection({ id: 'popular', title: 'Популярное', view_more: true }),
                selector: $popular,
            },
        ]

        for (const section of sections) {
            parseHomeSections(section.selector, section, sectionCallback)
        }
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
            url: `${MANGACHAN_DOMAIN}`,
            method: 'GET',
            param,
            cookies: this.cookies
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
        // let request
        // if (query.includedTags) {
        //     request = createRequestObject({
        //         url: `${MANGACHAN_DOMAIN}/tags/${query.includedTags.join('+')}`,
        //         method,
        //         headers,
        //     })
        // } else {
        // }
        const request = createRequestObject({
            url: `${MANGACHAN_DOMAIN}/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&result_num=40&story=${search}&need_sort_date=false`,
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
            url: `${MANGACHAN_DOMAIN}/catalog?`,
            method: 'GET',
            cookies: this.cookies,
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseTags($)
    }
}