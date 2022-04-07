/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */
import {
    Chapter,
    ChapterDetails,
    Tag,
    // HomeSection,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    TagSection,
    SearchRequest
} from 'paperback-extensions-common'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const title = $('#mangaBox > div.leftContent > h1 > span').text()
    const image = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.subject-cover.col-sm-5 > div > img:nth-child(1)').attr('src') ?? ''
    const author = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(7) a.person-link').toArray()
        .filter(author => author.name === 'a')
        .map(author => author.children[0]?.data)
        .join(', ')
    const artist = $('.elem_illustrator').children('a').toArray()
        .map(artist => artist.children[0]?.data)
        .join(', ')
    const rating = 0
    const statusStr = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(2)')
        ?.children()
        ?.toArray()[0]?.next
        ?.data
    const status = /выпуск продолжается/ig.test(statusStr ?? '') ? MangaStatus.ONGOING : MangaStatus.COMPLETED
    const otherTitles = $('div.expandable-text.another-names').text().replace('\n','').replace('\n', '').trim()
    const titles = [title, otherTitles]
    const follows = 0
    const views = 0
    const hentai = false
    
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] })]
    
    const tags = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(13) a')
        .toArray()
        .map(tag => ({
            url: tag.attribs.href?.slice(10),
            title: tag.children[0]?.data
        }))

    if(tagSections[0]) tagSections[0].tags = tags.map((tag) => createTag({ id: tag?.url ?? '', label: tag?.title ?? '' }))

    const summary = $('#tab-description > div > div:nth-child(1)').children()
        .toArray().map(elem => elem.children[0]?.data).join('\n')


    return createManga({
        id: mangaId,
        titles,
        image,
        rating: Number(rating),
        status,
        artist,
        author,
        tags: tagSections,
        views,
        follows,
        desc: summary,
        hentai
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []
    const chaptersData = $('#chapters-list > table > tbody').children().toArray()
        .filter(row => {
            const chapterDate = row.children[1]
            const isHeaterCell = $(chapterDate).text() === 'Название' || $(chapterDate).text() === ''
            return !isHeaterCell
        })
        .map(chapterRow => {
            const chapter = $(chapterRow).children().children().toArray()
            const chapterHref = $(chapter).attr('href')
            const chapterMatch = /\/.*(\/.*\/.*)/g.exec(chapterHref ?? '')
            const chapterId = chapterMatch ? chapterMatch[1] : ''
            const trimmedChaptedTitle = $(chapter).text().replace('\n', '').trim()
            const chapterTitleMatch =/\d+ - \d+ (.*)/g.exec(trimmedChaptedTitle ?? '')
            const chapterTitle = chapterTitleMatch ? chapterTitleMatch[1] : ''
            const chapterDate = $(chapterRow).children().toArray()[1]?.children[0]?.data?.replace(/(\r\n|\n|\r)/gm, '')
                .trim()
                .replace(/(\d+\.\d+)\.(\d+)/gmi, '$1.20$2')
                .split('.')
                
            return {chapterName: chapterTitle, chapterDate: new Date(
                chapterDate && chapterDate[2] ? parseInt(chapterDate[2]) : 0, 
                chapterDate && chapterDate[1] ? parseInt(chapterDate[1]) - 1 :  0, 
                chapterDate && chapterDate[0] ? parseInt(chapterDate[0]) : 1
            ), chapterId}
        })
        .reverse()

    for(const chapter of chaptersData) {
        chapters.push(createChapter({
            id: chapter.chapterId ?? '',
            mangaId,
            name: chapter.chapterName,
            langCode: LanguageCode.RUSSIAN,
            chapNum: parseInt(chapter.chapterId ?? ''),
            time: chapter.chapterDate
        }))
    }
    return chapters
}

export const parseChapterDetails = (mangaId: string, chapterId: string, urls: string[] | null | undefined, longStrip: boolean): ChapterDetails => {
    false && console.log({
        mangaId,
        chapterId,
        longStrip
    })
    // const linksStringMatch = /"fullimg":(\[.*\])/gim.exec(data)
    // const linksStrings = linksStringMatch && (linksStringMatch[1] ?? '').split(',')


    // https://h111.rmr.rocks/auto/22/42/45/02.jpg_res.jpg
    // https://h11.rmr.rocks/auto/55/62/70/001.png

    // #wrap > div.reader-controller.pageBlock.container.reader-bottom.bordered-page-block > script

    // const links = linksStrings?.map(link => {
    //     const linkMatch = /(https?:\/\/.*\.(?:png|jpg))/gmi.exec(link)
    //     return linkMatch && linkMatch[1]
    // }).filter(link => !!link && link !== null)

    const pages : string[] = []
    if (urls && urls.length) {
        urls.forEach(link => {
            if (link !== null) pages.push(link ?? '')
        })
    }

    return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip
    })
}

export interface UpdatedManga {
    ids: string[]
    loadMore: boolean
}

export const parseUpdatedManga = ($: CheerioStatic, time: Date, ids: string[]): UpdatedManga => {
    let loadMore = true

    const updatedManga: string[] = []

    for (const manga of $('li', 'div.manga-list-4 ').toArray()) {
        const id = $('a', manga).attr('href')?.split('/manga/')[1]?.replace(/\//g, '')
        if (!id) continue

        const date = $('.manga-list-4-item-subtitle > span', $(manga)).text().trim()
        const mangaDate = parseDate(date)
        if (!mangaDate || !id) continue

        if (mangaDate > time) {
            if (ids.includes(id)) {
                updatedManga.push(id)
            }
        } else {
            loadMore = false
        }
    }

    return {
        ids: updatedManga,
        loadMore,
    }
}

// export const parseHomeSections = ($: Cheerio, section: {sectionID: HomeSection, selector: CheerioStatic}, sectionCallback: (section: HomeSection) => void): void => {
//     const mangaArray = []

//     for (const manga of $('div.tiles-row__scroller > div:nth-child(1) > a').toArray()) {
//         console.log(JSON.stringify(manga))
//         // const idHref = $('h2 > a', manga).attr('href')
//         // const idMatch = /\/manga\/(.*)\.html/gm.exec(idHref || '')
//         // const id = (idMatch && idMatch[1]) ?? ''
//         // const title = $('h2 > a', manga).text() 
//         // const subtitle = $('div.row3_left > div > span > b', manga).text() ?? ' Нет глав'
//         // const image = $('.manga_images img', manga).attr('src') ?? ''

//         mangaArray.push(createMangaTile({
//             id: id,
//             image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
//             title: createIconText({ text: title }),
//             subtitleText: createIconText({ text: subtitle }),
//         }))
//     }
//     section.sectionID.items = mangaArray
//     sectionCallback(section.sectionID)
// }

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
    const allItems = $('.content_row').toArray()
    const manga: MangaTile[] = []
    for (const item of allItems) {
        const idHref = $('h2 > a', item).attr('href')
        const idMatch = /https:\/\/manga-chan\.me\/manga\/(.*)\.html/gm.exec(idHref || '')
        const id = (idMatch && idMatch[1]) ?? ''
        const title = $('h2 > a', item).text() 
        const subtitle = $('div.row3_left > div > span > b', item).text() ?? ' Нет глав'
        const image = $('.manga_images img', item).attr('src') ?? ''

        manga.push(createMangaTile({
            id: id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
    return manga
}

export const parseViewMore = ($: CheerioStatic): MangaTile[] => {
    const allItems = $('.content_row').toArray()
    const manga: MangaTile[] = []
    for (const item of allItems) {
        const idHref = $('h2 > a', item).attr('href')
        const idMatch = /https:\/\/manga-chan\.me\/manga\/(.*)\.html/gm.exec(idHref || '')
        const id = (idMatch && idMatch[1]) ?? ''
        const title = $('h2 > a', item).text() 
        const subtitle = $('div.row3_left > div > span > b', item).text() ?? ' Нет глав'
        const image = $('.manga_images img', item).attr('src') ?? ''

        manga.push(createMangaTile({
            id: id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
    return manga
}

export const parseTags = ($: CheerioStatic): TagSection[] => {
    const arrayTags: Tag[] = []
    for (const tag of $('#side > div > div > ul > li').toArray()) {
        const tagLabel = $('> a:nth-child(3)', tag).text().trim()
        if (!tagLabel) continue
        arrayTags.push({ id: tagLabel, label: tagLabel })
    }

    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]
    return tagSections
}

const parseDate = (date: string): Date => {
    date = date.toUpperCase()
    let time: Date
    const number = Number((/\d*/.exec(date) ?? [])[0])
    if (date.includes('LESS THAN AN HOUR') || date.includes('JUST NOW')) {
        time = new Date(Date.now())
    } else if (date.includes('YEAR') || date.includes('YEARS')) {
        time = new Date(Date.now() - (number * 31556952000))
    } else if (date.includes('MONTH') || date.includes('MONTHS')) {
        time = new Date(Date.now() - (number * 2592000000))
    } else if (date.includes('WEEK') || date.includes('WEEKS')) {
        time = new Date(Date.now() - (number * 604800000))
    } else if (date.includes('YESTERDAY')) {
        time = new Date(Date.now() - 86400000)
    } else if (date.includes('DAY') || date.includes('DAYS')) {
        time = new Date(Date.now() - (number * 86400000))
    } else if (date.includes('HOUR') || date.includes('HOURS')) {
        time = new Date(Date.now() - (number * 3600000))
    } else if (date.includes('MINUTE') || date.includes('MINUTES')) {
        time = new Date(Date.now() - (number * 60000))
    } else if (date.includes('SECOND') || date.includes('SECONDS')) {
        time = new Date(Date.now() - (number * 1000))
    } else {
        time = new Date(date)
    }
    return time
}

export const isLastPage = ($: CheerioStatic): boolean => {
    let isLast = true
    const pages = []
    for (const page of $('#pagination > span > a').toArray()) {
        const p = Number($(page).text().trim())
        if (isNaN(p)) continue
        pages.push(p)
    }
    const lastPage = Math.max(...pages)
    const currentPage = Number($('#pagination > span > b').text().trim())
    if (currentPage <= lastPage) isLast = false
    return isLast
}

export const generateSearch = (query: SearchRequest): string => {

    const keyword = (query.title ?? '').replace(/ /g, '+')
    const search = `${keyword}`

    return search
}