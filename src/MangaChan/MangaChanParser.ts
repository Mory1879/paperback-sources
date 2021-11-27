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
    //SearchRequest,
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
            const chapterDate = chapterText[0]

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

export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
    const sections = [
        {
            sectionID: createHomeSection({ id: 'hot_release', title: 'Hot Manga Releases', view_more: true }),
            selector: $('div.manga-list-1').get(0)
        },
        {
            sectionID: createHomeSection({ id: 'being_read', title: 'Being Read Right Now' }),
            selector: $('div.manga-list-1').get(1)
        },
        {
            sectionID: createHomeSection({ id: 'recommended', title: 'Recommended' }),
            selector: $('div.manga-list-3')
        },
        {
            sectionID: createHomeSection({ id: 'new_manga', title: 'New Manga Releases', view_more: true }),
            selector: $('div.manga-list-1').get(2)
        }
    ]

    //Hot Release Manga
    //New Manga
    //Being Read Manga
    const collectedIds: string[] = []

    for (const section of sections) {
        const mangaArray: MangaTile[] = []

        for (const manga of $('li', section.selector).toArray()) {
            const id = $('a', manga).attr('href')?.split('/manga/')[1]?.replace(/\//g, '')
            const image: string = $('img', manga).first().attr('src') ?? ''
            const title: string = $('a', manga).first().attr('title')?.trim() ?? ''
            const subtitle: string = $('p.manga-list-1-item-subtitle', manga).text().trim()
            if (!id || !title || !image) continue

            if (collectedIds.includes(id)) continue
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
    //Latest Manga
    const latestSection = createHomeSection({ id: 'latest_updates', title: 'Latest Updates', view_more: true })
    const latestManga: MangaTile[] = []

    for (const manga of $('li', 'div.manga-list-4 ').toArray()) {
        const id = $('a', manga).attr('href')?.split('/manga/')[1]?.replace(/\//g, '')
        const image: string = $('img', manga).first().attr('src') ?? ''
        const title: string = $('a', manga).attr('title')?.trim() ?? ''
        const subtitle: string = $('ul.manga-list-4-item-part > li', manga).first().text().trim()
        if (!id || !title || !image) continue

        if (collectedIds.includes(id)) continue
        latestManga.push(createMangaTile({
            id: id,
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
    }
    latestSection.items = latestManga
    sectionCallback(latestSection)
}

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
    const allItems = $('.content_row').toArray()
    const manga: MangaTile[] = []
    for (const item of allItems) {
        const idHref = $('h2 > a', item).attr('href')
        const idMatch = /https:\/\/manga-chan\.me\/manga\/(.*)\.html/gm.exec(idHref || '')
        const id = (idMatch && idMatch[1]) ?? ''
        const title = $('h2 > a', item).text() 
        const subtitle = $('.tags > div', item).text()
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

export const parseViewMore = ($: CheerioStatic, homepageSectionId: string): MangaTile[] => {
    const mangaItems: MangaTile[] = []
    const collectedIds: string[] = []

    if (homepageSectionId === 'latest_updates') {
        for (const manga of $('ul.manga-list-4-list > li').toArray()) {
            const id = $('a', manga).attr('href')?.split('/manga/')[1]?.replace(/\//g, '')
            const image: string = $('img', manga).first().attr('src') ?? ''
            const title: string = $('a', manga).attr('title')?.trim() ?? ''
            const subtitle: string = $('ul.manga-list-4-item-part > li', manga).first().text().trim()
            if (!id || !title || !image) continue

            if (collectedIds.includes(id)) continue
            mangaItems.push(createMangaTile({
                id,
                image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({ text: title }),
                subtitleText: createIconText({ text: subtitle }),
            }))
            collectedIds.push(id)
        }

        return mangaItems
    }

    for (const manga of $('li', $.html()).toArray()) {
        const id = $('a', manga).attr('href')?.split('/manga/')[1]?.replace(/\//g, '')
        const image: string = $('img', manga).first().attr('src') ?? ''
        const title: string = $('img', manga).first().attr('alt')?.trim() ?? ''
        const subtitle: string = $('p.manga-list-1-item-subtitle', manga).text().trim()
        if (!id || !title || !image) continue

        if (collectedIds.includes(id)) continue
        mangaItems.push(createMangaTile({
            id,
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }))
        collectedIds.push(id)

    }

    return mangaItems

}

export const parseTags = ($: CheerioStatic): TagSection[] => {

    const arrayTags: Tag[] = []
    for (const tag of $('div.tag-box > a').toArray()) {
        const label = $(tag).text().trim()
        const id = $(tag).attr('data-val') ?? ''
        if (!id || !label) continue
        arrayTags.push({ id: id, label: label })
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
    for (const page of $('a', '.pager-list-left').toArray()) {
        const p = Number($(page).text().trim())
        if (isNaN(p)) continue
        pages.push(p)
    }
    const lastPage = Math.max(...pages)
    const currentPage = Number($('a.active', '.pager-list-left').text().trim())
    if (currentPage <= lastPage) isLast = false
    return isLast
}

export const generateSearch = (query: SearchRequest): string => {

    const keyword = (query.title ?? '').replace(/ /g, '+')
    const search = `${keyword}`

    return search
}