(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    getTags() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return (_a = this.getSearchTags) === null || _a === void 0 ? void 0 : _a.call(this);
        });
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    var _a;
    let time;
    let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":2,"./Tracker":3}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":4,"./models":47}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],7:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],8:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],9:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],10:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],13:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],14:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],15:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],16:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],17:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],18:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],19:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],20:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],21:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],22:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],23:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],24:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);
__exportStar(require("./Stepper"), exports);

},{"./Button":9,"./Form":10,"./FormRow":11,"./Header":12,"./InputField":13,"./Label":14,"./Link":15,"./MultilineLabel":16,"./NavigationButton":17,"./OAuthButton":18,"./Section":19,"./Select":20,"./Stepper":21,"./Switch":22,"./WebViewButton":23}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],28:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],29:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],32:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],33:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],34:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],35:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],36:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],37:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],40:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],41:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],43:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],44:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],45:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],46:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],47:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);
__exportStar(require("./SearchField"), exports);
__exportStar(require("./RawData"), exports);

},{"./Chapter":6,"./ChapterDetails":7,"./Constants":8,"./DynamicUI":24,"./HomeSection":25,"./Languages":26,"./Manga":27,"./MangaTile":28,"./MangaUpdate":29,"./PagedResults":30,"./RawData":31,"./RequestHeaders":32,"./RequestInterceptor":33,"./RequestManager":34,"./RequestObject":35,"./ResponseObject":36,"./SearchField":37,"./SearchRequest":38,"./SourceInfo":39,"./SourceManga":40,"./SourceStateManager":41,"./SourceTag":42,"./TagSection":43,"./TrackedManga":44,"./TrackedMangaChapterReadAction":45,"./TrackerActionQueue":46}],48:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadManga = exports.ReadMangaInfo = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable linebreak-style */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const ReadMangaParser_1 = require("./ReadMangaParser");
const READMANGA_DOMAIN = 'https://readmanga.io/';
const READMANGA_MANGA = READMANGA_DOMAIN + '/manga/';
const method = 'GET';
const headers = {
    referer: READMANGA_DOMAIN
};
exports.ReadMangaInfo = {
    version: '1.0.0',
    name: 'ReadManga',
    icon: 'icon.png',
    author: 'Mory1879',
    authorWebsite: 'https://github.com/Mory1879',
    description: 'Extension that pulls manga from ReadManga',
    language: paperback_extensions_common_1.LanguageCode.RUSSIAN,
    contentRating: paperback_extensions_common_1.ContentRating.MATURE,
    websiteBaseURL: READMANGA_DOMAIN,
    sourceTags: [
        {
            // eslint-disable-next-line quotes
            text: "Not all reader's features supported",
            type: paperback_extensions_common_1.TagType.YELLOW
        }
    ],
};
class ReadManga extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 5,
            requestTimeout: 20000,
        });
    }
    getMangaShareUrl(mangaId) { return `${READMANGA_MANGA}${mangaId}.html`; }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${READMANGA_DOMAIN}${mangaId}`,
                method,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return ReadMangaParser_1.parseMangaDetails($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${READMANGA_DOMAIN}${mangaId}`,
                method,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return ReadMangaParser_1.parseChapters($, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestForType = createRequestObject({
                url: `${READMANGA_DOMAIN}${mangaId}`,
                method,
            });
            const responseForType = yield this.requestManager.schedule(requestForType, 1);
            const $ForType = this.cheerio.load(responseForType.data);
            const isManhwa = $ForType('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(6) > span.elem_category > a').text() === 'Манхва';
            const request = createRequestObject({
                url: `${READMANGA_DOMAIN}${mangaId}/${chapterId}`,
                method,
                headers,
            });
            const response = yield this.requestManager.schedule(request, 1);
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
            return ReadMangaParser_1.parseChapterDetails(mangaId, chapterId, response.data, isManhwa);
        });
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
    getHomePageSections(_sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestHome = createRequestObject({
                url: `${READMANGA_DOMAIN}`,
                method: 'GET',
            });
            const responseHome = yield this.requestManager.schedule(requestHome, 1);
            const $home = this.cheerio.load(responseHome.data);
            console.log({
                $home
            });
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
        });
    }
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            // ?offset=20 = second page
            // ?offset=40 = third page
            const offset = page > 1 ? `?offset=${20 * (page - 1)}` : '';
            let param = '';
            switch (homepageSectionId) {
                case 'new_manga':
                    param = '/mostfavorites' + offset;
                    break;
                case 'popular':
                    param = '/manga/new' + offset;
                    break;
                default:
                    throw new Error(`Invalid homeSectionId | ${homepageSectionId}`);
            }
            const request = createRequestObject({
                url: `${READMANGA_DOMAIN}`,
                method: 'GET',
                param,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            const manga = ReadMangaParser_1.parseViewMore($);
            metadata = !ReadMangaParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            return createPagedResults({
                results: manga,
                metadata
            });
        });
    }
    getSearchResults(query, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            const search = encodeURI(ReadMangaParser_1.generateSearch(query));
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
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            const manga = ReadMangaParser_1.parseSearch($);
            metadata = !ReadMangaParser_1.isLastPage($) ? { page: page + 1 } : undefined;
            return createPagedResults({
                results: manga,
                metadata
            });
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${READMANGA_DOMAIN}/catalog?`,
                method: 'GET',
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return ReadMangaParser_1.parseTags($);
        });
    }
}
exports.ReadManga = ReadManga;

},{"./ReadMangaParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSearch = exports.isLastPage = exports.parseTags = exports.parseViewMore = exports.parseSearch = exports.parseUpdatedManga = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const parseMangaDetails = ($, mangaId) => {
    var _a, _b, _c, _d, _e;
    const title = $('#mangaBox > div.leftContent > h1 > span').text();
    const image = (_a = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.subject-cover.col-sm-5 > div > img:nth-child(1)').attr('src')) !== null && _a !== void 0 ? _a : '';
    const author = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(7) a.person-link').toArray()
        .filter(author => author.name === 'a')
        .map(author => { var _a; return (_a = author.children[0]) === null || _a === void 0 ? void 0 : _a.data; })
        .join(', ');
    const artist = $('.elem_illustrator').children('a').toArray()
        .map(artist => { var _a; return (_a = artist.children[0]) === null || _a === void 0 ? void 0 : _a.data; })
        .join(', ');
    const rating = 0;
    const statusStr = (_e = (_d = (_c = (_b = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(2)')) === null || _b === void 0 ? void 0 : _b.children()) === null || _c === void 0 ? void 0 : _c.toArray()[0]) === null || _d === void 0 ? void 0 : _d.next) === null || _e === void 0 ? void 0 : _e.data;
    const status = /выпуск продолжается/ig.test(statusStr !== null && statusStr !== void 0 ? statusStr : '') ? paperback_extensions_common_1.MangaStatus.ONGOING : paperback_extensions_common_1.MangaStatus.COMPLETED;
    const otherTitles = $('div.expandable-text.another-names').text().replace('\n', '').replace('\n', '').trim();
    const titles = [title, otherTitles];
    const follows = 0;
    const views = 0;
    const hentai = false;
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: [] })];
    const tags = $('#mangaBox > div.leftContent > div:nth-child(5) > div.flex-row > div.col-sm-7 > div.subject-meta > p:nth-child(13) a')
        .toArray()
        .map(tag => {
        var _a, _b;
        return ({
            url: (_a = tag.attribs.href) === null || _a === void 0 ? void 0 : _a.slice(10),
            title: (_b = tag.children[0]) === null || _b === void 0 ? void 0 : _b.data
        });
    });
    if (tagSections[0])
        tagSections[0].tags = tags.map((tag) => { var _a, _b; return createTag({ id: (_a = tag === null || tag === void 0 ? void 0 : tag.url) !== null && _a !== void 0 ? _a : '', label: (_b = tag === null || tag === void 0 ? void 0 : tag.title) !== null && _b !== void 0 ? _b : '' }); });
    const summary = $('#tab-description > div > div:nth-child(1)').children()
        .toArray().map(elem => { var _a; return (_a = elem.children[0]) === null || _a === void 0 ? void 0 : _a.data; }).join('\n');
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
    });
};
exports.parseMangaDetails = parseMangaDetails;
const parseChapters = ($, mangaId) => {
    var _a, _b;
    const chapters = [];
    const chaptersData = $('#chapters-list > table > tbody').children().toArray()
        .filter(row => {
        const chapterDate = row.children[1];
        const isHeaterCell = $(chapterDate).text() === 'Название' || $(chapterDate).text() === '';
        return !isHeaterCell;
    })
        .map(chapterRow => {
        var _a, _b, _c;
        const chapter = $(chapterRow).children().children().toArray();
        const chapterHref = $(chapter).attr('href');
        const chapterMatch = /\/.*(\/.*\/.*)/g.exec(chapterHref !== null && chapterHref !== void 0 ? chapterHref : '');
        const chapterId = chapterMatch ? chapterMatch[1] : '';
        const trimmedChaptedTitle = $(chapter).text().replace('\n', '').trim();
        const chapterTitleMatch = /\d+ - \d+ (.*)/g.exec(trimmedChaptedTitle !== null && trimmedChaptedTitle !== void 0 ? trimmedChaptedTitle : '');
        const chapterTitle = chapterTitleMatch ? chapterTitleMatch[1] : '';
        const chapterDate = (_c = (_b = (_a = $(chapterRow).children().toArray()[1]) === null || _a === void 0 ? void 0 : _a.children[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.replace(/(\r\n|\n|\r)/gm, '').trim().replace(/(\d+\.\d+)\.(\d+)/gmi, '$1.20$2').split('.');
        return { chapterName: chapterTitle, chapterDate: new Date(chapterDate && chapterDate[2] ? parseInt(chapterDate[2]) : 0, chapterDate && chapterDate[1] ? parseInt(chapterDate[1]) - 1 : 0, chapterDate && chapterDate[0] ? parseInt(chapterDate[0]) : 1), chapterId };
    })
        .reverse();
    for (const chapter of chaptersData) {
        chapters.push(createChapter({
            id: (_a = chapter.chapterId) !== null && _a !== void 0 ? _a : '',
            mangaId,
            name: chapter.chapterName,
            langCode: paperback_extensions_common_1.LanguageCode.RUSSIAN,
            chapNum: parseInt((_b = chapter.chapterId) !== null && _b !== void 0 ? _b : ''),
            time: chapter.chapterDate
        }));
    }
    return chapters;
};
exports.parseChapters = parseChapters;
const parseChapterDetails = (mangaId, chapterId, data, longStrip) => {
    var _a;
    const linksStringMatch = /"fullimg":(\[.*\])/gim.exec(data);
    const linksStrings = linksStringMatch && ((_a = linksStringMatch[1]) !== null && _a !== void 0 ? _a : '').split(',');
    // https://h111.rmr.rocks/auto/22/42/45/02.jpg_res.jpg
    // https://h11.rmr.rocks/auto/55/62/70/001.png
    // #wrap > div.reader-controller.pageBlock.container.reader-bottom.bordered-page-block > script
    // const links = linksStrings?.map(link => {
    //     const linkMatch = /(https?:\/\/.*\.(?:png|jpg))/gmi.exec(link)
    //     return linkMatch && linkMatch[1]
    // }).filter(link => !!link && link !== null)
    const pages = [];
    if (links) {
        links.forEach(link => {
            if (link !== null)
                pages.push(link !== null && link !== void 0 ? link : '');
        });
    }
    return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip
    });
};
exports.parseChapterDetails = parseChapterDetails;
const parseUpdatedManga = ($, time, ids) => {
    var _a, _b;
    let loadMore = true;
    const updatedManga = [];
    for (const manga of $('li', 'div.manga-list-4 ').toArray()) {
        const id = (_b = (_a = $('a', manga).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/manga/')[1]) === null || _b === void 0 ? void 0 : _b.replace(/\//g, '');
        if (!id)
            continue;
        const date = $('.manga-list-4-item-subtitle > span', $(manga)).text().trim();
        const mangaDate = parseDate(date);
        if (!mangaDate || !id)
            continue;
        if (mangaDate > time) {
            if (ids.includes(id)) {
                updatedManga.push(id);
            }
        }
        else {
            loadMore = false;
        }
    }
    return {
        ids: updatedManga,
        loadMore,
    };
};
exports.parseUpdatedManga = parseUpdatedManga;
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
const parseSearch = ($) => {
    var _a, _b, _c;
    const allItems = $('.content_row').toArray();
    const manga = [];
    for (const item of allItems) {
        const idHref = $('h2 > a', item).attr('href');
        const idMatch = /https:\/\/manga-chan\.me\/manga\/(.*)\.html/gm.exec(idHref || '');
        const id = (_a = (idMatch && idMatch[1])) !== null && _a !== void 0 ? _a : '';
        const title = $('h2 > a', item).text();
        const subtitle = (_b = $('div.row3_left > div > span > b', item).text()) !== null && _b !== void 0 ? _b : ' Нет глав';
        const image = (_c = $('.manga_images img', item).attr('src')) !== null && _c !== void 0 ? _c : '';
        manga.push(createMangaTile({
            id: id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }));
    }
    return manga;
};
exports.parseSearch = parseSearch;
const parseViewMore = ($) => {
    var _a, _b, _c;
    const allItems = $('.content_row').toArray();
    const manga = [];
    for (const item of allItems) {
        const idHref = $('h2 > a', item).attr('href');
        const idMatch = /https:\/\/manga-chan\.me\/manga\/(.*)\.html/gm.exec(idHref || '');
        const id = (_a = (idMatch && idMatch[1])) !== null && _a !== void 0 ? _a : '';
        const title = $('h2 > a', item).text();
        const subtitle = (_b = $('div.row3_left > div > span > b', item).text()) !== null && _b !== void 0 ? _b : ' Нет глав';
        const image = (_c = $('.manga_images img', item).attr('src')) !== null && _c !== void 0 ? _c : '';
        manga.push(createMangaTile({
            id: id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle }),
        }));
    }
    return manga;
};
exports.parseViewMore = parseViewMore;
const parseTags = ($) => {
    const arrayTags = [];
    for (const tag of $('#side > div > div > ul > li').toArray()) {
        const tagLabel = $('> a:nth-child(3)', tag).text().trim();
        if (!tagLabel)
            continue;
        arrayTags.push({ id: tagLabel, label: tagLabel });
    }
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
    return tagSections;
};
exports.parseTags = parseTags;
const parseDate = (date) => {
    var _a;
    date = date.toUpperCase();
    let time;
    const number = Number(((_a = /\d*/.exec(date)) !== null && _a !== void 0 ? _a : [])[0]);
    if (date.includes('LESS THAN AN HOUR') || date.includes('JUST NOW')) {
        time = new Date(Date.now());
    }
    else if (date.includes('YEAR') || date.includes('YEARS')) {
        time = new Date(Date.now() - (number * 31556952000));
    }
    else if (date.includes('MONTH') || date.includes('MONTHS')) {
        time = new Date(Date.now() - (number * 2592000000));
    }
    else if (date.includes('WEEK') || date.includes('WEEKS')) {
        time = new Date(Date.now() - (number * 604800000));
    }
    else if (date.includes('YESTERDAY')) {
        time = new Date(Date.now() - 86400000);
    }
    else if (date.includes('DAY') || date.includes('DAYS')) {
        time = new Date(Date.now() - (number * 86400000));
    }
    else if (date.includes('HOUR') || date.includes('HOURS')) {
        time = new Date(Date.now() - (number * 3600000));
    }
    else if (date.includes('MINUTE') || date.includes('MINUTES')) {
        time = new Date(Date.now() - (number * 60000));
    }
    else if (date.includes('SECOND') || date.includes('SECONDS')) {
        time = new Date(Date.now() - (number * 1000));
    }
    else {
        time = new Date(date);
    }
    return time;
};
const isLastPage = ($) => {
    let isLast = true;
    const pages = [];
    for (const page of $('#pagination > span > a').toArray()) {
        const p = Number($(page).text().trim());
        if (isNaN(p))
            continue;
        pages.push(p);
    }
    const lastPage = Math.max(...pages);
    const currentPage = Number($('#pagination > span > b').text().trim());
    if (currentPage <= lastPage)
        isLast = false;
    return isLast;
};
exports.isLastPage = isLastPage;
const generateSearch = (query) => {
    var _a;
    const keyword = ((_a = query.title) !== null && _a !== void 0 ? _a : '').replace(/ /g, '+');
    const search = `${keyword}`;
    return search;
};
exports.generateSearch = generateSearch;

},{"paperback-extensions-common":5}]},{},[48])(48)
});
