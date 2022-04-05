/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */
import {
    Chapter,
    ChapterDetails,
    Tag,
    HomeSection,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    TagSection,
    SearchRequest
} from 'paperback-extensions-common'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const title = $('#info_wrap > div > div > h1 > a').text()
    const image = $('#cover').attr('src') ?? ''
    const author = $('#info_wrap > table > tbody > tr:nth-child(3) > td.item2 > span').children('a').toArray().map(author => {
        if(author.children) {
            return author.children[0]?.data
        }
        return null
    }).filter(author => !!author).join(', ')
    const artist = ''
    const rating = 0
    const status = $('#info_wrap > table > tbody > tr:nth-child(4) > td.item2 > h2').text().split(', ')[1]  == 'выпуск продолжается' ? MangaStatus.ONGOING : MangaStatus.COMPLETED
    const otherTitles = $('#info_wrap > table > tbody > tr:nth-child(1) > td.item2 > h2').text().split(' ')
    const titles = [title, ...otherTitles]
    const follows = 0
    const views = 0
    const hentai = false
    
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] })]
    
    const elems = $('#info_wrap > table > tbody > tr:nth-child(6) > td.item2 > span').find('a').toArray()
    if(tagSections[0]) tagSections[0].tags = elems.map((elem) => createTag({ id: $(elem).text(), label: $(elem).text() }))
    

    const summary = $('#description').text()

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
    const chaptersData = $('.table_cha').children().children().toArray()
        .filter(row => {
            const chapterDate = row.children[1]
            const isHeaterCell = $(chapterDate).text() === 'Название' || $(chapterDate).text() === ''
            return !isHeaterCell
        }).map(chapter => {
            const chapterField = $(chapter).children().children().toArray()
            const chapterHref = $(chapterField[0]).children().attr('href')
            const chapterMatch = /\/online\/(.+)\.html/g.exec(chapterHref ?? '')
            const chapterId = chapterMatch ? chapterMatch[1] : ''
            const chapterText = $(chapter).children().children().toArray().map(a => $(a).text())
            const chapterName = chapterText[0] && chapterText[0].trim()
            const chapterDate = chapterText[1]

            return {chapterName, chapterDate, chapterId}
        }).reverse()

    for(const chapter of chaptersData) {
        const match = /Том .*Глава ([\d.]*)+/g.exec(chapter.chapterName ?? '')
        const chapterNum = parseFloat((match && match[1]) ?? '')

        chapters.push(createChapter({
            id: chapter.chapterId ?? '',
            mangaId,
            name: chapter.chapterName,
            langCode: LanguageCode.RUSSIAN,
            chapNum: chapterNum,
            time: new Date(chapter.chapterDate ?? '')
        }))
    }
    return chapters
}

export const parseChapterDetails = (mangaId: string, chapterId: string, data: any, longStrip: boolean): ChapterDetails => {
    const linksStringMatch = /"fullimg":(\[.*\])/gim.exec(data)
    const linksStrings = linksStringMatch && (linksStringMatch[1] ?? '').split(',')

    const links = linksStrings?.map(link => {
        const linkMatch = /(https?:\/\/.*\.(?:png|jpg))/gmi.exec(link)
        return linkMatch && linkMatch[1]
    }).filter(link => !!link && link !== null)

    const pages : string[] = []
    if (links) {
        links.forEach(link => {
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

export const parseHomeSections = ($: CheerioStatic, section: {sectionID: HomeSection, selector: CheerioStatic}, sectionCallback: (section: HomeSection) => void): void => {
    const mangaArray = []

    for (const manga of $('.content_row').toArray()) {
        const idHref = $('h2 > a', manga).attr('href')
        const idMatch = /\/manga\/(.*)\.html/gm.exec(idHref || '')
        const id = (idMatch && idMatch[1]) ?? ''
        const title = $('h2 > a', manga).text() 
        const subtitle = $('div.row3_left > div > span > b', manga).text() ?? ' Нет глав'
        const image = $('.manga_images img', manga).attr('src') ?? ''

        mangaArray.push(createMangaTile({
            id: id,
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
    section.sectionID.items = mangaArray
    sectionCallback(section.sectionID)
}

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