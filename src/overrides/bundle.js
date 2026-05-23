
/*!
 * Germsfox
 *
 * @author      pc31754 <https://github.com/procrarast>
 * @version     1.1
 * @description Deobfuscated client code created with explicit permission by pc31754.
 *              Please be respectful of the original license and make changes in good faith.
 *              Do your part in upholding the social contract!
 */

/*!
 * Germs.io
 *
 * @author      Stas Darevskiy <stas@stas.gg> (https://stas.gg)
 * @license     Copyright (c) 2015 - 2025 SDG Limited
 * @version     5.2.2-live-2179
 */

var moduleRegistry = {
    badwords: badwordsArray => { // https://github.com/MauriceButler/badwords/blob/master/array.js
        badwordsArray.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
    }
    ,
    moreBadwords: moreBadwordsArray => { // I have no idea where this comes from and I'm too afraid to keyword search
        moreBadwordsArray.exports = ["ahole","anus","ash0le","ash0les","asholes","ass","Ass Monkey","Assface","assh0le","assh0lez","asshole","assholes","assholz","asswipe","azzhole","bassterds","bastard","bastards","bastardz","basterds","basterdz","Biatch","bitch","bitches","Blow Job","boffing","butthole","buttwipe","c0ck","c0cks","c0k","Carpet Muncher","cawk","cawks","Clit","cnts","cntz","cock","cockhead","cock-head","cocks","CockSucker","cock-sucker","crap","cum","cunt","cunts","cuntz","dick","dild0","dild0s","dildo","dildos","dilld0","dilld0s","dominatricks","dominatrics","dominatrix","dyke","enema","f u c k","f u c k e r","fag","fag1t","faget","fagg1t","faggit","faggot","fagg0t","fagit","fags","fagz","faig","faigs","fart","flipping the bird","fuck","fucker","fuckin","fucking","fucks","Fudge Packer","fuk","Fukah","Fuken","fuker","Fukin","Fukk","Fukkah","Fukken","Fukker","Fukkin","g00k","God-damned","h00r","h0ar","h0re","hells","hoar","hoor","hoore","jackoff","jap","japs","jerk-off","jisim","jiss","jizm","jizz","knob","knobs","knobz","kunt","kunts","kuntz","Lezzian","Lipshits","Lipshitz","masochist","masokist","massterbait","masstrbait","masstrbate","masterbaiter","masterbate","masterbates","Motha Fucker","Motha Fuker","Motha Fukkah","Motha Fukker","Mother Fucker","Mother Fukah","Mother Fuker","Mother Fukkah","Mother Fukker","mother-fucker","Mutha Fucker","Mutha Fukah","Mutha Fuker","Mutha Fukkah","Mutha Fukker","n1gr","nastt","nigger;","nigur;","niiger;","niigr;","orafis","orgasim;","orgasm","orgasum","oriface","orifice","orifiss","packi","packie","packy","paki","pakie","paky","pecker","peeenus","peeenusss","peenus","peinus","pen1s","penas","penis","penis-breath","penus","penuus","Phuc","Phuck","Phuk","Phuker","Phukker","polac","polack","polak","Poonani","pr1c","pr1ck","pr1k","pusse","pussee","pussy","puuke","puuker","qweir","recktum","rectum","retard","sadist","scank","schlong","screwing","semen","sex","sexy","Sh!t","sh1t","sh1ter","sh1ts","sh1tter","sh1tz","shit","shits","shitter","Shitty","Shity","shitz","Shyt","Shyte","Shytty","Shyty","skanck","skank","skankee","skankey","skanks","Skanky","slag","slut","sluts","Slutty","slutz","son-of-a-bitch","tit","turd","va1jina","vag1na","vagiina","vagina","vaj1na","vajina","vullva","vulva","w0p","wh00r","wh0re","whore","xrated","xxx","b!+ch","bitch","blowjob","clit","arschloch","fuck","shit","ass","asshole","b!tch","b17ch","b1tch","bastard","bi+ch","boiolas","buceta","c0ck","cawk","chink","cipa","clits","cock","cum","cunt","dildo","dirsa","ejakulate","fatass","fcuk","fuk","fux0r","hoer","hore","jism","kawk","l3itch","l3i+ch","masturbate","masterbat*","masterbat3","motherfucker","s.o.b.","mofo","nazi","nigga","nigger","nutsack","phuck","pimpis","pusse","pussy","scrotum","sh!t","shemale","shi+","sh!+","slut","smut","teets","tits","boobs","b00bs","teez","testical","testicle","titt","w00se","jackoff","wank","whoar","whore","*damn","*dyke","*fuck*","*shit*","@$$","amcik","andskota","arse*","assrammer","ayir","bi7ch","bitch*","bollock*","breasts","butt-pirate","cabron","cazzo","chraa","chuj","Cock*","cunt*","d4mn","daygo","dego","dick*","dike*","dupa","dziwka","ejackulate","Ekrem*","Ekto","enculer","faen","fag*","fanculo","fanny","feces","feg","Felcher","ficken","fitt*","Flikker","foreskin","Fotze","Fu(*","fuk*","futkretzn","gook","guiena","h0r","h4x0r","hell","helvete","hoer*","honkey","Huevon","hui","injun","jizz","kanker*","kike","klootzak","kraut","knulle","kuk","kuksuger","Kurac","kurwa","kusi*","kyrpa*","lesbo","mamhoon","masturbat*","merd*","mibun","monkleigh","mouliewop","muie","mulkku","muschi","nazis","nepesaurio","nigger*","orospu","paska*","perse","picka","pierdol*","pillu*","pimmel","piss*","pizda","poontsee","poop","porn","p0rn","pr0n","preteen","pula","pule","puta","puto","qahbeh","queef*","rautenberg","schaffer","scheiss*","schlampe","schmuck","screw","sh!t*","sharmuta","sharmute","shipal","shiz","skribz","skurwysyn","sphencter","spic","spierdalaj","splooge","suka","b00b*","testicle*","titt*","twat","vittu","wank*","wetback*","wichser","wop*","yed","zabourah"];
    }
    ,
    badwordsFilter: (filter, W, require) => {
        const badwords = require('badwords');
        const moreBadwords = require('moreBadwords');
        class a0 {
            constructor(a1={}) {
                Object.assign(this, {
                    'list': a1.emptyList && [] || Array.prototype.concat.apply(badwords, [moreBadwords, a1.list || []]),
                    'exclude': a1.exclude || [],
                    'splitRegex': a1.splitRegex || /\b/,
                    'placeHolder': a1.placeHolder || '*',
                    'regex': a1.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                    'replaceRegex': a1.replaceRegex || /\w/g
                });
            }
            isProfane(a2) {
                return this.list.filter(a3 => {
                    const a4 = new RegExp('\\b' + a3.replace(/(\W)/g, '\\$1') + '\\b','gi');
                    return !this.exclude.includes(a3.toLowerCase()) && a4.test(a2);
                }
                ).length > 0 || false;
            }
            replaceWord(a5) {
                return a5.replace(this.regex, '').replace(this.replaceRegex, this.placeHolder);
            }
            clean(a6) {
                return a6.split(this.splitRegex).map(a7 => {
                    return this.isProfane(a7) ? this.replaceWord(a7) : a7;
                }
                ).join(this.splitRegex.exec(a6)?.[0] ?? '');
            }
            addWords() {
                let a8 = Array.from(arguments);
                this.list.push(...a8);
                a8.map(a9 => a9.toLowerCase()).forEach(aa => {
                    if (this.exclude.includes(aa)) {
                        this.exclude.splice(this.exclude.indexOf(aa), 1);
                    }
                }
                );
            }
            removeWords() {
                this.exclude.push(...Array.from(arguments).map(ab => ab.toLowerCase()));
            }
        }
        filter.exports = a0;
    }
    ,
    base64: (ai, exports) => { // https://github.com/beatgammit/base64-js
        'use strict'

        exports.byteLength = byteLength;
        exports.toByteArray = toByteArray;
        exports.fromByteArray = fromByteArray;

        var lookup = [];
        var revLookup = [];
        var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for (var i = 0, len = code.length; i < len; ++i) {
            lookup[i] = code[i];
            revLookup[code.charCodeAt(i)] = i;
        }

        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        revLookup['-'.charCodeAt(0)] = 62;
        revLookup['_'.charCodeAt(0)] = 63;

        function getLens(b64) {
            var len = b64.length;

            if (len % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4');
            }

            // Trim off extra bytes after placeholder bytes are found
            // See: https://github.com/beatgammit/base64-js/issues/42
            var validLen = b64.indexOf('=');
            if (validLen === -1)
                validLen = len;

            var placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);

            return [validLen, placeHoldersLen];
        }

        // base64 is 4/3 + up to two characters of the original data
        function byteLength(b64) {
            var lens = getLens(b64);
            var validLen = lens[0];
            var placeHoldersLen = lens[1];
            return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen;
        }

        function _byteLength(b64, validLen, placeHoldersLen) {
            return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen;
        }

        function toByteArray(b64) {
            var tmp;
            var lens = getLens(b64);
            var validLen = lens[0];
            var placeHoldersLen = lens[1];

            var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

            var curByte = 0;

            // if there are placeholders, only get up to the last complete 4 chars
            var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

            var i;
            for (i = 0; i < len; i += 4) {
                tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
                arr[curByte++] = (tmp >> 16) & 0xFF;
                arr[curByte++] = (tmp >> 8) & 0xFF;
                arr[curByte++] = tmp & 0xFF;
            }

            if (placeHoldersLen === 2) {
                tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
                arr[curByte++] = tmp & 0xFF;
            }

            if (placeHoldersLen === 1) {
                tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
                arr[curByte++] = (tmp >> 8) & 0xFF;
                arr[curByte++] = tmp & 0xFF;
            }

            return arr;
        }

        function tripletToBase64(num) {
            return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
        }

        function encodeChunk(uint8, start, end) {
            var tmp;
            var output = [];
            for (var i = start; i < end; i += 3) {
                tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF);
                output.push(tripletToBase64(tmp));
            }
            return output.join('');
        }

        function fromByteArray(uint8) {
            var tmp;
            var len = uint8.length;
            var extraBytes = len % 3;
            // if we have 1 byte left, pad 2 bytes
            var parts = [];
            var maxChunkLength = 16383;
            // must be multiple of 3

            // go through the array every three bytes, we'll deal with trailing stuff later
            for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
            }

            // pad the end with zeros, but make sure to not forget the extra bytes
            if (extraBytes === 1) {
                tmp = uint8[len - 1]
                parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3F] + '==');
            } else if (extraBytes === 2) {
                tmp = (uint8[len - 2] << 8) + uint8[len - 1]
                parts.push(lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3F] + lookup[(tmp << 2) & 0x3F] + '=');
            }

            return parts.join('');
        }
    }
    ,
    buffer: (b6, exports, require) => {
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <https://feross.org>
         * @license  MIT
         */
        /* eslint-disable no-proto */

        'use strict'

        const base64 = require('base64')
        const ieee754 = require('ieee754')
        const customInspectSymbol = (typeof Symbol === 'function' && typeof Symbol.for === 'function')// eslint-disable-line dot-notation
        ? Symbol.for('nodejs.util.inspect.custom')// eslint-disable-line dot-notation
        : null

        exports.Buffer = Buffer
        exports.SlowBuffer = SlowBuffer
        exports.INSPECT_MAX_BYTES = 50

        const K_MAX_LENGTH = 0x7fffffff
        exports.kMaxLength = K_MAX_LENGTH

        /**
         * Not used internally, but exported to maintain api compatability
         * Uses 32-bit implementation value from Node defined in String:kMaxLength
         *
         * @see https://github.com/nodejs/node/blob/main/deps/v8/include/v8-primitive.h#L126
         * @see https://github.com/nodejs/node/blob/main/src/node_buffer.cc#L1298
         * @see https://github.com/nodejs/node/blob/main/lib/buffer.js#L142
         */
        const K_STRING_MAX_LENGTH = (1 << 28) - 16
        exports.kStringMaxLength = K_STRING_MAX_LENGTH

        exports.constants = {
            MAX_LENGTH: K_MAX_LENGTH,
            MAX_STRING_LENGTH: K_STRING_MAX_LENGTH
        }

        exports.Blob = typeof Blob !== 'undefined' ? Blob : undefined
        exports.File = typeof File !== 'undefined' ? File : undefined
        exports.atob = typeof atob !== 'undefined' ? atob : undefined
        exports.btoa = typeof btoa !== 'undefined' ? btoa : undefined

        /**
         * If `Buffer.TYPED_ARRAY_SUPPORT`:
         *   === true    Use Uint8Array implementation (fastest)
         *   === false   Print warning and recommend using `buffer` v4.x which has an Object
         *               implementation (most compatible, even IE6)
         *
         * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
         * Opera 11.6+, iOS 4.2+.
         *
         * We report that the browser does not support typed arrays if the are not subclassable
         * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
         * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
         * for __proto__ and has a buggy typed array implementation.
         */
        Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

        if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.')
        }

        function typedArraySupport() {
            // Can typed array instances be augmented?
            try {
                const arr = new Uint8Array(1)
                const proto = {
                    foo: function() {
                        return 42
                    }
                }
                Object.setPrototypeOf(proto, Uint8Array.prototype)
                Object.setPrototypeOf(arr, proto)
                return arr.foo() === 42
            } catch (e) {
                return false
            }
        }

        Object.defineProperty(Buffer.prototype, 'parent', {
            enumerable: true,
            get: function() {
                if (!Buffer.isBuffer(this))
                    return undefined
                return this.buffer
            }
        })

        Object.defineProperty(Buffer.prototype, 'offset', {
            enumerable: true,
            get: function() {
                if (!Buffer.isBuffer(this))
                    return undefined
                return this.byteOffset
            }
        })

        function createBuffer(length) {
            if (length > K_MAX_LENGTH) {
                throw new RangeError('The value "' + length + '" is invalid for option "size"')
            }
            // Return an augmented `Uint8Array` instance
            const buf = new Uint8Array(length)
            Object.setPrototypeOf(buf, Buffer.prototype)
            return buf
        }

        /**
         * The Buffer constructor returns instances of `Uint8Array` that have their
         * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
         * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
         * and the `Uint8Array` methods. Square bracket notation works as expected -- it
         * returns a single octet.
         *
         * The `Uint8Array` prototype remains unmodified.
         */

        function Buffer(arg, encodingOrOffset, length) {
            // Common case.
            if (typeof arg === 'number') {
                if (typeof encodingOrOffset === 'string') {
                    throw new TypeError('The "string" argument must be of type string. Received type number')
                }
                return allocUnsafe(arg)
            }
            return from(arg, encodingOrOffset, length)
        }

        Buffer.poolSize = 8192
        // not used by this implementation

        function from(value, encodingOrOffset, length) {
            if (typeof value === 'string') {
                return fromString(value, encodingOrOffset)
            }

            if (ArrayBuffer.isView(value)) {
                return fromArrayView(value)
            }

            if (value == null) {
                throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + (typeof value))
            }

            if (isInstance(value, ArrayBuffer) || (value && isInstance(value.buffer, ArrayBuffer))) {
                return fromArrayBuffer(value, encodingOrOffset, length)
            }

            if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || (value && isInstance(value.buffer, SharedArrayBuffer)))) {
                return fromArrayBuffer(value, encodingOrOffset, length)
            }

            if (typeof value === 'number') {
                throw new TypeError('The "value" argument must not be of type number. Received type number')
            }

            const valueOf = value.valueOf && value.valueOf()
            if (valueOf != null && valueOf !== value) {
                return Buffer.from(valueOf, encodingOrOffset, length)
            }

            const b = fromObject(value)
            if (b)
                return b

            if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
                return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
            }

            throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + (typeof value))
        }

        /**
         * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
         * if value is a number.
         * Buffer.from(str[, encoding])
         * Buffer.from(array)
         * Buffer.from(buffer)
         * Buffer.from(arrayBuffer[, byteOffset[, length]])
         **/
        Buffer.from = function(value, encodingOrOffset, length) {
            return from(value, encodingOrOffset, length)
        }

        // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
        // https://github.com/feross/buffer/pull/148
        Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
        Object.setPrototypeOf(Buffer, Uint8Array)

        function assertSize(size) {
            if (typeof size !== 'number') {
                throw new TypeError('"size" argument must be of type number')
            } else if (size < 0) {
                throw new RangeError('The value "' + size + '" is invalid for option "size"')
            }
        }

        function alloc(size, fill, encoding) {
            assertSize(size)
            if (size <= 0) {
                return createBuffer(size)
            }
            if (fill !== undefined) {
                // Only pay attention to encoding if it's a string. This
                // prevents accidentally sending in a number that would
                // be interpreted as a start offset.
                return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill)
            }
            return createBuffer(size)
        }

        /**
         * Creates a new filled Buffer instance.
         * alloc(size[, fill[, encoding]])
         **/
        Buffer.alloc = function(size, fill, encoding) {
            return alloc(size, fill, encoding)
        }

        function allocUnsafe(size) {
            assertSize(size)
            return createBuffer(size < 0 ? 0 : checked(size) | 0)
        }

        /**
         * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
         * */
        Buffer.allocUnsafe = function(size) {
            return allocUnsafe(size)
        }
        /**
         * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
         */
        Buffer.allocUnsafeSlow = function(size) {
            return allocUnsafe(size)
        }

        function fromString(string, encoding) {
            if (typeof encoding !== 'string' || encoding === '') {
                encoding = 'utf8'
            }

            if (!Buffer.isEncoding(encoding)) {
                throw new TypeError('Unknown encoding: ' + encoding)
            }

            const length = byteLength(string, encoding) | 0
            let buf = createBuffer(length)

            const actual = buf.write(string, encoding)

            if (actual !== length) {
                // Writing a hex string, for example, that contains invalid characters will
                // cause everything after the first invalid character to be ignored. (e.g.
                // 'abxxcd' will be treated as 'ab')
                buf = buf.slice(0, actual)
            }

            return buf
        }

        function fromArrayLike(array) {
            const length = array.length < 0 ? 0 : checked(array.length) | 0
            const buf = createBuffer(length)
            for (let i = 0; i < length; i += 1) {
                buf[i] = array[i] & 255
            }
            return buf
        }

        function fromArrayView(arrayView) {
            if (isInstance(arrayView, Uint8Array)) {
                const copy = new Uint8Array(arrayView)
                return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
            }
            return fromArrayLike(arrayView)
        }

        function fromArrayBuffer(array, byteOffset, length) {
            if (byteOffset < 0 || array.byteLength < byteOffset) {
                throw new RangeError('"offset" is outside of buffer bounds')
            }

            if (array.byteLength < byteOffset + (length || 0)) {
                throw new RangeError('"length" is outside of buffer bounds')
            }

            let buf
            if (byteOffset === undefined && length === undefined) {
                buf = new Uint8Array(array)
            } else if (length === undefined) {
                buf = new Uint8Array(array,byteOffset)
            } else {
                buf = new Uint8Array(array,byteOffset,length)
            }

            // Return an augmented `Uint8Array` instance
            Object.setPrototypeOf(buf, Buffer.prototype)

            return buf
        }

        function fromObject(obj) {
            if (Buffer.isBuffer(obj)) {
                // Note: Probably not necessary anymore.
                const len = checked(obj.length) | 0
                const buf = createBuffer(len)

                if (buf.length === 0) {
                    return buf
                }

                obj.copy(buf, 0, 0, len)
                return buf
            }

            if (obj.length !== undefined) {
                if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
                    return createBuffer(0)
                }
                return fromArrayLike(obj)
            }

            if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
                return fromArrayLike(obj.data)
            }
        }

        function checked(length) {
            // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
            // length is NaN (which is otherwise coerced to zero.)
            if (length >= K_MAX_LENGTH) {
                throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
            }
            return length | 0
        }

        function SlowBuffer(length) {
            if (+length != length) {
                // eslint-disable-line eqeqeq
                length = 0
            }
            return Buffer.alloc(+length)
        }

        Buffer.isBuffer = function isBuffer(b) {
            return b != null && b._isBuffer === true && b !== Buffer.prototype
            // so Buffer.isBuffer(Buffer.prototype) will be false
        }

        Buffer.compare = function compare(a, b) {
            if (!isInstance(a, Uint8Array) || !isInstance(b, Uint8Array)) {
                throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')
            }

            if (a === b)
                return 0

            let x = a.length
            let y = b.length

            for (let i = 0, len = Math.min(x, y); i < len; ++i) {
                if (a[i] !== b[i]) {
                    x = a[i]
                    y = b[i]
                    break
                }
            }

            if (x < y)
                return -1
            if (y < x)
                return 1
            return 0
        }

        Buffer.isEncoding = function isEncoding(encoding) {
            switch (String(encoding).toLowerCase()) {
            case 'hex':
            case 'utf8':
            case 'utf-8':
            case 'ascii':
            case 'latin1':
            case 'binary':
            case 'base64':
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return true
            default:
                return false
            }
        }

        Buffer.concat = function concat(list, length) {
            if (!Array.isArray(list)) {
                throw new TypeError('"list" argument must be an Array of Buffers')
            }

            if (list.length === 0) {
                return Buffer.alloc(0)
            }

            let i
            if (length === undefined) {
                length = 0
                for (i = 0; i < list.length; ++i) {
                    length += list[i].length
                }
            }

            const buffer = Buffer.allocUnsafe(length)
            let pos = 0
            for (i = 0; i < list.length; ++i) {
                const buf = list[i]
                if (!isInstance(buf, Uint8Array)) {
                    throw new TypeError('"list" argument must be an Array of Buffers')
                }
                if (pos + buf.length > buffer.length) {
                    buffer.set(buf.subarray(0, buffer.length - pos), pos)
                    break
                }
                buffer.set(buf, pos)
                pos += buf.length
            }
            return buffer
        }

        function byteLength(string, encoding) {
            if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
                return string.byteLength
            }
            if (typeof SharedArrayBuffer !== 'undefined' && isInstance(string, SharedArrayBuffer)) {
                return string.byteLength
            }
            if (typeof string !== 'string') {
                throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + typeof string)
            }

            const len = string.length
            const mustMatch = (arguments.length > 2 && arguments[2] === true)
            if (!mustMatch && len === 0)
                return 0

            // Use a for loop to avoid recursion
            let loweredCase = false
            for (; ; ) {
                switch (encoding) {
                case 'ascii':
                case 'latin1':
                case 'binary':
                    return len
                case 'utf8':
                case 'utf-8':
                    return utf8ToBytes(string).length
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return len * 2
                case 'hex':
                    return len >>> 1
                case 'base64':
                    return base64ToBytes(string).length
                default:
                    if (loweredCase) {
                        return mustMatch ? -1 : utf8ToBytes(string).length
                        // assume utf8
                    }
                    encoding = ('' + encoding).toLowerCase()
                    loweredCase = true
                }
            }
        }
        Buffer.byteLength = byteLength

        function slowToString(encoding, start, end) {
            let loweredCase = false

            // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
            // property of a typed array.

            // This behaves neither like String nor Uint8Array in that we set start/end
            // to their upper/lower bounds if the value passed is out of range.
            // undefined is handled specially as per ECMA-262 6th Edition,
            // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
            if (start === undefined || start < 0) {
                start = 0
            }
            // Return early if start > this.length. Done here to prevent potential uint32
            // coercion fail below.
            if (start > this.length) {
                return ''
            }

            if (end === undefined || end > this.length) {
                end = this.length
            }

            if (end <= 0) {
                return ''
            }

            // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
            end >>>= 0
            start >>>= 0

            if (end <= start) {
                return ''
            }

            if (!encoding)
                encoding = 'utf8'

            while (true) {
                switch (encoding) {
                case 'hex':
                    return hexSlice(this, start, end)

                case 'utf8':
                case 'utf-8':
                    return utf8Slice(this, start, end)

                case 'ascii':
                    return asciiSlice(this, start, end)

                case 'latin1':
                case 'binary':
                    return latin1Slice(this, start, end)

                case 'base64':
                    return base64Slice(this, start, end)

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return utf16leSlice(this, start, end)

                default:
                    if (loweredCase)
                        throw new TypeError('Unknown encoding: ' + encoding)
                    encoding = (encoding + '').toLowerCase()
                    loweredCase = true
                }
            }
        }

        // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
        // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
        // reliably in a browserify context because there could be multiple different
        // copies of the 'buffer' package in use. This method works even for Buffer
        // instances that were created from another copy of the `buffer` package.
        // See: https://github.com/feross/buffer/issues/154
        Buffer.prototype._isBuffer = true

        function swap(b, n, m) {
            const i = b[n]
            b[n] = b[m]
            b[m] = i
        }

        Buffer.prototype.swap16 = function swap16() {
            const len = this.length
            if (len % 2 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 16-bits')
            }
            for (let i = 0; i < len; i += 2) {
                swap(this, i, i + 1)
            }
            return this
        }

        Buffer.prototype.swap32 = function swap32() {
            const len = this.length
            if (len % 4 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 32-bits')
            }
            for (let i = 0; i < len; i += 4) {
                swap(this, i, i + 3)
                swap(this, i + 1, i + 2)
            }
            return this
        }

        Buffer.prototype.swap64 = function swap64() {
            const len = this.length
            if (len % 8 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 64-bits')
            }
            for (let i = 0; i < len; i += 8) {
                swap(this, i, i + 7)
                swap(this, i + 1, i + 6)
                swap(this, i + 2, i + 5)
                swap(this, i + 3, i + 4)
            }
            return this
        }

        Buffer.prototype.toString = function toString() {
            const length = this.length
            if (length === 0)
                return ''
            if (arguments.length === 0)
                return utf8Slice(this, 0, length)
            return slowToString.apply(this, arguments)
        }

        Buffer.prototype.toLocaleString = Buffer.prototype.toString

        Buffer.prototype.equals = function equals(b) {
            if (this === b)
                return true
            return Buffer.compare(this, b) === 0
        }

        Buffer.prototype.inspect = function inspect() {
            let str = ''
            const max = exports.INSPECT_MAX_BYTES
            str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
            if (this.length > max)
                str += ' ... '
            return '<Buffer ' + str + '>'
        }
        if (customInspectSymbol) {
            Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
        }

        Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
            if (!isInstance(target, Uint8Array)) {
                throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + (typeof target))
            }

            if (start === undefined) {
                start = 0
            }
            if (end === undefined) {
                end = target ? target.length : 0
            }
            if (thisStart === undefined) {
                thisStart = 0
            }
            if (thisEnd === undefined) {
                thisEnd = this.length
            }

            if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                throw new RangeError('out of range index')
            }

            if (thisStart >= thisEnd && start >= end) {
                return 0
            }
            if (thisStart >= thisEnd) {
                return -1
            }
            if (start >= end) {
                return 1
            }

            start >>>= 0
            end >>>= 0
            thisStart >>>= 0
            thisEnd >>>= 0

            if (this === target)
                return 0

            let x = thisEnd - thisStart
            let y = end - start
            const len = Math.min(x, y)

            for (let i = 0; i < len; ++i) {
                if (this[thisStart + i] !== target[start + i]) {
                    x = this[thisStart + i]
                    y = target[start + i]
                    break
                }
            }

            if (x < y)
                return -1
            if (y < x)
                return 1
            return 0
        }

        // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
        // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
        //
        // Arguments:
        // - buffer - a Buffer to search
        // - val - a string, Buffer, or number
        // - byteOffset - an index into `buffer`; will be clamped to an int32
        // - encoding - an optional encoding, relevant is val is a string
        // - dir - true for indexOf, false for lastIndexOf
        function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
            // Empty buffer means no match
            if (buffer.length === 0)
                return -1

            // Normalize byteOffset
            if (typeof byteOffset === 'string') {
                encoding = byteOffset
                byteOffset = 0
            } else if (byteOffset > 0x7fffffff) {
                byteOffset = 0x7fffffff
            } else if (byteOffset < -0x80000000) {
                byteOffset = -0x80000000
            }
            byteOffset = +byteOffset
            // Coerce to Number.
            if (numberIsNaN(byteOffset)) {
                // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                byteOffset = dir ? 0 : (buffer.length - 1)
            }

            // Normalize byteOffset: negative offsets start from the end of the buffer
            if (byteOffset < 0)
                byteOffset = buffer.length + byteOffset
            if (byteOffset >= buffer.length) {
                if (dir)
                    return -1
                else
                    byteOffset = buffer.length - 1
            } else if (byteOffset < 0) {
                if (dir)
                    byteOffset = 0
                else
                    return -1
            }

            // Normalize val
            if (typeof val === 'string') {
                val = Buffer.from(val, encoding)
            }

            // Finally, search either indexOf (if dir is true) or lastIndexOf
            if (Buffer.isBuffer(val)) {
                // Special case: looking for empty string/buffer always fails
                if (val.length === 0) {
                    return -1
                }
                return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
            } else if (typeof val === 'number') {
                val = val & 0xFF
                // Search for a byte value [0-255]
                if (typeof Uint8Array.prototype.indexOf === 'function') {
                    if (dir) {
                        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                    } else {
                        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                    }
                }
                return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
            }

            throw new TypeError('val must be string, number or Buffer')
        }

        function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
            let indexSize = 1
            let arrLength = arr.length
            let valLength = val.length

            if (encoding !== undefined) {
                encoding = String(encoding).toLowerCase()
                if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
                    if (arr.length < 2 || val.length < 2) {
                        return -1
                    }
                    indexSize = 2
                    arrLength /= 2
                    valLength /= 2
                    byteOffset /= 2
                }
            }

            function read(buf, i) {
                if (indexSize === 1) {
                    return buf[i]
                } else {
                    return buf.readUInt16BE(i * indexSize)
                }
            }

            let i
            if (dir) {
                let foundIndex = -1
                for (i = byteOffset; i < arrLength; i++) {
                    if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                        if (foundIndex === -1)
                            foundIndex = i
                        if (i - foundIndex + 1 === valLength)
                            return foundIndex * indexSize
                    } else {
                        if (foundIndex !== -1)
                            i -= i - foundIndex
                        foundIndex = -1
                    }
                }
            } else {
                if (byteOffset + valLength > arrLength)
                    byteOffset = arrLength - valLength
                for (i = byteOffset; i >= 0; i--) {
                    let found = true
                    for (let j = 0; j < valLength; j++) {
                        if (read(arr, i + j) !== read(val, j)) {
                            found = false
                            break
                        }
                    }
                    if (found)
                        return i
                }
            }

            return -1
        }

        Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
            return this.indexOf(val, byteOffset, encoding) !== -1
        }

        Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
        }

        Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
        }

        function hexWrite(buf, string, offset, length) {
            offset = Number(offset) || 0
            const remaining = buf.length - offset
            if (!length) {
                length = remaining
            } else {
                length = Number(length)
                if (length > remaining) {
                    length = remaining
                }
            }

            const strLen = string.length

            if (length > (strLen >>> 1)) {
                length = strLen >>> 1
            }

            for (let i = 0; i < length; ++i) {
                const a = string.charCodeAt(i * 2 + 0)
                const b = string.charCodeAt(i * 2 + 1)
                const hi = hexCharValueTable[a & 0x7f]
                const lo = hexCharValueTable[b & 0x7f]

                if ((a | b | hi | lo) & ~0x7f) {
                    return i
                }

                buf[offset + i] = (hi << 4) | lo
            }

            return length
        }

        function utf8Write(buf, string, offset, length) {
            return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
        }

        function asciiWrite(buf, string, offset, length) {
            return blitBuffer(asciiToBytes(string), buf, offset, length)
        }

        function base64Write(buf, string, offset, length) {
            return blitBuffer(base64ToBytes(string), buf, offset, length)
        }

        function ucs2Write(buf, string, offset, length) {
            return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
        }

        Buffer.prototype.write = function write(string, offset, length, encoding) {
            // Buffer#write(string)
            if (offset === undefined) {
                encoding = 'utf8'
                length = this.length
                offset = 0
                // Buffer#write(string, encoding)
            } else if (length === undefined && typeof offset === 'string') {
                encoding = offset
                length = this.length
                offset = 0
                // Buffer#write(string, offset[, length][, encoding])
            } else if (isFinite(offset)) {
                offset = offset >>> 0
                if (isFinite(length)) {
                    length = length >>> 0
                    if (encoding === undefined)
                        encoding = 'utf8'
                } else {
                    encoding = length
                    length = undefined
                }
            } else {
                throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported')
            }

            const remaining = this.length - offset
            if (length === undefined || length > remaining)
                length = remaining

            if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                throw new RangeError('Attempt to write outside buffer bounds')
            }

            if (!encoding)
                encoding = 'utf8'

            let loweredCase = false
            for (; ; ) {
                switch (encoding) {
                case 'hex':
                    return hexWrite(this, string, offset, length)

                case 'utf8':
                case 'utf-8':
                    return utf8Write(this, string, offset, length)

                case 'ascii':
                case 'latin1':
                case 'binary':
                    return asciiWrite(this, string, offset, length)

                case 'base64':
                    // Warning: maxLength not taken into account in base64Write
                    return base64Write(this, string, offset, length)

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return ucs2Write(this, string, offset, length)

                default:
                    if (loweredCase)
                        throw new TypeError('Unknown encoding: ' + encoding)
                    encoding = ('' + encoding).toLowerCase()
                    loweredCase = true
                }
            }
        }

        Buffer.prototype.toJSON = function toJSON() {
            return {
                type: 'Buffer',
                data: Array.prototype.slice.call(this, 0)
            }
        }

        function base64Slice(buf, start, end) {
            if (start === 0 && end === buf.length) {
                return base64.fromByteArray(buf)
            } else {
                return base64.fromByteArray(buf.slice(start, end))
            }
        }

        function utf8Slice(buf, start, end) {
            end = Math.min(buf.length, end)
            const res = []

            let i = start
            while (i < end) {
                const firstByte = buf[i]
                let codePoint = null
                let bytesPerSequence = (firstByte > 0xEF) ? 4 : (firstByte > 0xDF) ? 3 : (firstByte > 0xBF) ? 2 : 1

                if (i + bytesPerSequence <= end) {
                    let secondByte, thirdByte, fourthByte, tempCodePoint

                    switch (bytesPerSequence) {
                    case 1:
                        if (firstByte < 128) {
                            codePoint = firstByte
                        }
                        break
                    case 2:
                        secondByte = buf[i + 1]
                        if ((secondByte & 0xC0) === 128) {
                            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                            if (tempCodePoint > 0x7F) {
                                codePoint = tempCodePoint
                            }
                        }
                        break
                    case 3:
                        secondByte = buf[i + 1]
                        thirdByte = buf[i + 2]
                        if ((secondByte & 0xC0) === 128 && (thirdByte & 0xC0) === 128) {
                            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                                codePoint = tempCodePoint
                            }
                        }
                        break
                    case 4:
                        secondByte = buf[i + 1]
                        thirdByte = buf[i + 2]
                        fourthByte = buf[i + 3]
                        if ((secondByte & 0xC0) === 128 && (thirdByte & 0xC0) === 128 && (fourthByte & 0xC0) === 128) {
                            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                                codePoint = tempCodePoint
                            }
                        }
                    }
                }

                if (codePoint === null) {
                    // we did not generate a valid codePoint so insert a
                    // replacement char (U+FFFD) and advance only 1 byte
                    codePoint = 0xFFFD
                    bytesPerSequence = 1
                } else if (codePoint > 0xFFFF) {
                    // encode to utf16 (surrogate pair dance)
                    codePoint -= 0x10000
                    res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                    codePoint = 0xDC00 | codePoint & 0x3FF
                }

                res.push(codePoint)
                i += bytesPerSequence
            }

            return decodeCodePointsArray(res)
        }

        // Based on http://stackoverflow.com/a/22747272/680742, the browser with
        // the lowest limit is Chrome, with 0x10000 args.
        // We go 1 magnitude less, for safety
        const MAX_ARGUMENTS_LENGTH = 0x1000

        function decodeCodePointsArray(codePoints) {
            const len = codePoints.length
            if (len <= MAX_ARGUMENTS_LENGTH) {
                return String.fromCharCode.apply(String, codePoints)
                // avoid extra slice()
            }

            // Decode in chunks to avoid "call stack size exceeded".
            let res = ''
            let i = 0
            while (i < len) {
                res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH))
            }
            return res
        }

        function asciiSlice(buf, start, end) {
            let ret = ''
            end = Math.min(buf.length, end)

            for (let i = start; i < end; ++i) {
                ret += String.fromCharCode(buf[i] & 0x7F)
            }
            return ret
        }

        function latin1Slice(buf, start, end) {
            let ret = ''
            end = Math.min(buf.length, end)

            for (let i = start; i < end; ++i) {
                ret += String.fromCharCode(buf[i])
            }
            return ret
        }

        function hexSlice(buf, start, end) {
            const len = buf.length

            if (!start || start < 0)
                start = 0
            if (!end || end < 0 || end > len)
                end = len

            let out = ''
            for (let i = start; i < end; ++i) {
                out += hexSliceLookupTable[buf[i]]
            }
            return out
        }

        function utf16leSlice(buf, start, end) {
            const bytes = buf.slice(start, end)
            let res = ''
            // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
            for (let i = 0; i < bytes.length - 1; i += 2) {
                res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
            }
            return res
        }

        Buffer.prototype.slice = function slice(start, end) {
            const len = this.length
            start = ~~start
            end = end === undefined ? len : ~~end

            if (start < 0) {
                start += len
                if (start < 0)
                    start = 0
            } else if (start > len) {
                start = len
            }

            if (end < 0) {
                end += len
                if (end < 0)
                    end = 0
            } else if (end > len) {
                end = len
            }

            if (end < start)
                end = start

            const newBuf = this.subarray(start, end)
            // Return an augmented `Uint8Array` instance
            Object.setPrototypeOf(newBuf, Buffer.prototype)

            return newBuf
        }

        /*
         * Need to make sure that buffer isn't trying to write out of bounds.
         */
        function checkOffset(offset, ext, length) {
            if ((offset % 1) !== 0 || offset < 0)
                throw new RangeError('offset is not uint')
            if (offset + ext > length)
                throw new RangeError('Trying to access beyond buffer length')
        }

        Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert)
                checkOffset(offset, byteLength, this.length)

            let val = this[offset]
            let mul = 1
            let i = 0
            while (++i < byteLength && (mul *= 256)) {
                val += this[offset + i] * mul
            }

            return val
        }

        Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) {
                checkOffset(offset, byteLength, this.length)
            }

            let val = this[offset + --byteLength]
            let mul = 1
            while (byteLength > 0 && (mul *= 256)) {
                val += this[offset + --byteLength] * mul
            }

            return val
        }

        Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 1, this.length)
            return this[offset]
        }

        Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 2, this.length)
            return this[offset] | (this[offset + 1] << 8)
        }

        Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 2, this.length)
            return (this[offset] << 8) | this[offset + 1]
        }

        Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 4, this.length)

            return ((this[offset]) | (this[offset + 1] << 8) | (this[offset + 2] << 16)) + (this[offset + 3] * 0x1000000)
        }

        Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 4, this.length)

            return (this[offset] * 0x1000000) + ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
        }

        Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
            offset = offset >>> 0
            validateNumber(offset, 'offset')
            const first = this[offset]
            const last = this[offset + 7]
            if (first === undefined || last === undefined) {
                boundsError(offset, this.length - 8)
            }

            const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24

            const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24

            return BigInt(lo) + (BigInt(hi) << BigInt(32))
        })

        Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
            offset = offset >>> 0
            validateNumber(offset, 'offset')
            const first = this[offset]
            const last = this[offset + 7]
            if (first === undefined || last === undefined) {
                boundsError(offset, this.length - 8)
            }

            const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset]

            const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last

            return (BigInt(hi) << BigInt(32)) + BigInt(lo)
        })

        Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert)
                checkOffset(offset, byteLength, this.length)

            let val = this[offset]
            let mul = 1
            let i = 0
            while (++i < byteLength && (mul *= 256)) {
                val += this[offset + i] * mul
            }
            mul *= 128

            if (val >= mul)
                val -= Math.pow(2, 8 * byteLength)

            return val
        }

        Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert)
                checkOffset(offset, byteLength, this.length)

            let i = byteLength
            let mul = 1
            let val = this[offset + --i]
            while (i > 0 && (mul *= 256)) {
                val += this[offset + --i] * mul
            }
            mul *= 128

            if (val >= mul)
                val -= Math.pow(2, 8 * byteLength)

            return val
        }

        Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 1, this.length)
            if (!(this[offset] & 128))
                return (this[offset])
            return ((0xff - this[offset] + 1) * -1)
        }

        Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 2, this.length)
            const val = this[offset] | (this[offset + 1] << 8)
            return (val & 0x8000) ? val | 0xFFFF0000 : val
        }

        Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 2, this.length)
            const val = this[offset + 1] | (this[offset] << 8)
            return (val & 0x8000) ? val | 0xFFFF0000 : val
        }

        Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 4, this.length)

            return (this[offset]) | (this[offset + 1] << 8) | (this[offset + 2] << 16) | (this[offset + 3] << 24)
        }

        Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 4, this.length)

            return (this[offset] << 24) | (this[offset + 1] << 16) | (this[offset + 2] << 8) | (this[offset + 3])
        }

        Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
            offset = offset >>> 0
            validateNumber(offset, 'offset')
            const first = this[offset]
            const last = this[offset + 7]
            if (first === undefined || last === undefined) {
                boundsError(offset, this.length - 8)
            }

            const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24)
            // Overflow

            return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24)
        })

        Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
            offset = offset >>> 0
            validateNumber(offset, 'offset')
            const first = this[offset]
            const last = this[offset + 7]
            if (first === undefined || last === undefined) {
                boundsError(offset, this.length - 8)
            }

            const val = (first << 24) + // Overflow
            this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset]

            return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last)
        })

        Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 4, this.length)
            return ieee754.read(this, offset, true, 23, 4)
        }

        Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 4, this.length)
            return ieee754.read(this, offset, false, 23, 4)
        }

        Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 8, this.length)
            return ieee754.read(this, offset, true, 52, 8)
        }

        Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert)
                checkOffset(offset, 8, this.length)
            return ieee754.read(this, offset, false, 52, 8)
        }

        function checkInt(buf, value, offset, ext, max, min) {
            if (!Buffer.isBuffer(buf))
                throw new TypeError('"buffer" argument must be a Buffer instance')
            if (value > max || value < min)
                throw new RangeError('"value" argument is out of bounds')
            if (offset + ext > buf.length)
                throw new RangeError('Index out of range')
        }

        Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) {
                const maxBytes = Math.pow(2, 8 * byteLength) - 1
                checkInt(this, value, offset, byteLength, maxBytes, 0)
            }

            let mul = 1
            let i = 0
            this[offset] = value & 0xFF
            while (++i < byteLength && (mul *= 256)) {
                this[offset + i] = (value / mul) & 0xFF
            }

            return offset + byteLength
        }

        Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) {
                const maxBytes = Math.pow(2, 8 * byteLength) - 1
                checkInt(this, value, offset, byteLength, maxBytes, 0)
            }

            let i = byteLength - 1
            let mul = 1
            this[offset + i] = value & 0xFF
            while (--i >= 0 && (mul *= 256)) {
                this[offset + i] = (value / mul) & 0xFF
            }

            return offset + byteLength
        }

        Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 1, 0xff, 0)
            this[offset] = (value & 0xff)
            return offset + 1
        }

        Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 2, 0xffff, 0)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            return offset + 2
        }

        Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 2, 0xffff, 0)
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
            return offset + 2
        }

        Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 4, 0xffffffff, 0)
            this[offset + 3] = (value >>> 24)
            this[offset + 2] = (value >>> 16)
            this[offset + 1] = (value >>> 8)
            this[offset] = (value & 0xff)
            return offset + 4
        }

        Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 4, 0xffffffff, 0)
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
            return offset + 4
        }

        function wrtBigUInt64LE(buf, value, offset, min, max) {
            checkIntBI(value, min, max, buf, offset, 7)

            let lo = Number(value & BigInt(0xffffffff))
            buf[offset++] = lo
            lo = lo >> 8
            buf[offset++] = lo
            lo = lo >> 8
            buf[offset++] = lo
            lo = lo >> 8
            buf[offset++] = lo
            let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
            buf[offset++] = hi
            hi = hi >> 8
            buf[offset++] = hi
            hi = hi >> 8
            buf[offset++] = hi
            hi = hi >> 8
            buf[offset++] = hi
            return offset
        }

        function wrtBigUInt64BE(buf, value, offset, min, max) {
            checkIntBI(value, min, max, buf, offset, 7)

            let lo = Number(value & BigInt(0xffffffff))
            buf[offset + 7] = lo
            lo = lo >> 8
            buf[offset + 6] = lo
            lo = lo >> 8
            buf[offset + 5] = lo
            lo = lo >> 8
            buf[offset + 4] = lo
            let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
            buf[offset + 3] = hi
            hi = hi >> 8
            buf[offset + 2] = hi
            hi = hi >> 8
            buf[offset + 1] = hi
            hi = hi >> 8
            buf[offset] = hi
            return offset + 8
        }

        Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset=0) {
            return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
        })

        Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset=0) {
            return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
        })

        Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
                const limit = Math.pow(2, (8 * byteLength) - 1)

                checkInt(this, value, offset, byteLength, limit - 1, -limit)
            }

            let i = 0
            let mul = 1
            let sub = 0
            this[offset] = value & 0xFF
            while (++i < byteLength && (mul *= 256)) {
                if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                    sub = 1
                }
                this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
            }

            return offset + byteLength
        }

        Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
                const limit = Math.pow(2, (8 * byteLength) - 1)

                checkInt(this, value, offset, byteLength, limit - 1, -limit)
            }

            let i = byteLength - 1
            let mul = 1
            let sub = 0
            this[offset + i] = value & 0xFF
            while (--i >= 0 && (mul *= 256)) {
                if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                    sub = 1
                }
                this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
            }

            return offset + byteLength
        }

        Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 1, 0x7f, -128)
            if (value < 0)
                value = 0xff + value + 1
            this[offset] = (value & 0xff)
            return offset + 1
        }

        Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 2, 0x7fff, -0x8000)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            return offset + 2
        }

        Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 2, 0x7fff, -0x8000)
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
            return offset + 2
        }

        Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            this[offset + 2] = (value >>> 16)
            this[offset + 3] = (value >>> 24)
            return offset + 4
        }

        Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert)
                checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
            if (value < 0)
                value = 0xffffffff + value + 1
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
            return offset + 4
        }

        Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset=0) {
            return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
        })

        Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset=0) {
            return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
        })

        function checkIEEE754(buf, value, offset, ext, max, min) {
            if (offset + ext > buf.length)
                throw new RangeError('Index out of range')
            if (offset < 0)
                throw new RangeError('Index out of range')
        }

        function writeFloat(buf, value, offset, littleEndian, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
                checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
            }
            ieee754.write(buf, value, offset, littleEndian, 23, 4)
            return offset + 4
        }

        Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
            return writeFloat(this, value, offset, true, noAssert)
        }

        Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
            return writeFloat(this, value, offset, false, noAssert)
        }

        function writeDouble(buf, value, offset, littleEndian, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
                checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
            }
            ieee754.write(buf, value, offset, littleEndian, 52, 8)
            return offset + 8
        }

        Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
            return writeDouble(this, value, offset, true, noAssert)
        }

        Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
            return writeDouble(this, value, offset, false, noAssert)
        }

        // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
        Buffer.prototype.copy = function copy(target, targetStart, start, end) {
            if (!isInstance(target, Uint8Array))
                throw new TypeError('argument should be a Buffer')
            if (!start)
                start = 0
            if (!end && end !== 0)
                end = this.length
            if (targetStart >= target.length)
                targetStart = target.length
            if (!targetStart)
                targetStart = 0
            if (end > 0 && end < start)
                end = start

            // Copy 0 bytes; we're done
            if (end === start)
                return 0
            if (target.length === 0 || this.length === 0)
                return 0

            // Fatal error conditions
            if (targetStart < 0) {
                throw new RangeError('targetStart out of bounds')
            }
            if (start < 0 || start >= this.length)
                throw new RangeError('Index out of range')
            if (end < 0)
                throw new RangeError('sourceEnd out of bounds')

            // Are we oob?
            if (end > this.length)
                end = this.length
            if (target.length - targetStart < end - start) {
                end = target.length - targetStart + start
            }

            const len = end - start

            if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
                // Use built-in when available, missing from IE11
                this.copyWithin(targetStart, start, end)
            } else {
                Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart)
            }

            return len
        }

        // Usage:
        //    buffer.fill(number[, offset[, end]])
        //    buffer.fill(buffer[, offset[, end]])
        //    buffer.fill(string[, offset[, end]][, encoding])
        Buffer.prototype.fill = function fill(val, start, end, encoding) {
            // Handle string cases:
            if (typeof val === 'string') {
                if (typeof start === 'string') {
                    encoding = start
                    start = 0
                    end = this.length
                } else if (typeof end === 'string') {
                    encoding = end
                    end = this.length
                }
                if (encoding !== undefined && typeof encoding !== 'string') {
                    throw new TypeError('encoding must be a string')
                }
                if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                    throw new TypeError('Unknown encoding: ' + encoding)
                }
                if (val.length === 1) {
                    const code = val.charCodeAt(0)
                    if ((encoding === 'utf8' && code < 128) || encoding === 'latin1') {
                        // Fast path: If `val` fits into a single byte, use that numeric value.
                        val = code
                    }
                }
            } else if (typeof val === 'number') {
                val = val & 255
            } else if (typeof val === 'boolean') {
                val = Number(val)
            }

            // Invalid ranges are not set to a default, so can range check early.
            if (start < 0 || this.length < start || this.length < end) {
                throw new RangeError('Out of range index')
            }

            if (end <= start) {
                return this
            }

            start = start >>> 0
            end = end === undefined ? this.length : end >>> 0

            if (!val)
                val = 0

            let i
            if (typeof val === 'number') {
                for (i = start; i < end; ++i) {
                    this[i] = val
                }
            } else {
                const bytes = isInstance(val, Uint8Array) ? val : Buffer.from(val, encoding)
                const len = bytes.length
                if (len === 0) {
                    throw new TypeError('The value "' + val + '" is invalid for argument "value"')
                }
                for (i = 0; i < end - start; ++i) {
                    this[i + start] = bytes[i % len]
                }
            }

            return this
        }

        // CUSTOM ERRORS
        // =============

        // Simplified versions from Node, changed for Buffer-only usage
        const errors = {}
        function E(sym, getMessage, Base) {
            function NodeError() {
                const err = new Base(getMessage.apply(null, arguments))

                Object.setPrototypeOf(err, NodeError.prototype)

                // Node.js `err.code` properties are own/enumerable properties.
                err.code = sym
                // Add the error code to the name to include it in the stack trace.
                err.name = `${err.name} [${sym}]`
                // Remove NodeError from the stack trace.
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(err, NodeError)
                }
                // Access the stack to generate the error message including the error code
                // from the name.
                err.stack
                // eslint-disable-line no-unused-expressions
                // Reset the name to the actual name.
                delete err.name

                return err
            }

            Object.setPrototypeOf(NodeError.prototype, Base.prototype)
            Object.setPrototypeOf(NodeError, Base)

            NodeError.prototype.toString = function toString() {
                return `${this.name} [${sym}]: ${this.message}`
            }

            errors[sym] = NodeError
        }

        E('ERR_BUFFER_OUT_OF_BOUNDS', function(name) {
            if (name) {
                return `${name} is outside of buffer bounds`
            }

            return 'Attempt to access memory outside buffer bounds'
        }, RangeError)
        E('ERR_INVALID_ARG_TYPE', function(name, actual) {
            return `The "${name}" argument must be of type number. Received type ${typeof actual}`
        }, TypeError)
        E('ERR_OUT_OF_RANGE', function(str, range, input) {
            let msg = `The value of "${str}" is out of range.`
            let received = input
            if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
                received = addNumericalSeparator(String(input))
            } else if (typeof input === 'bigint') {
                received = String(input)
                if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
                    received = addNumericalSeparator(received)
                }
                received += 'n'
            }
            msg += ` It must be ${range}. Received ${received}`
            return msg
        }, RangeError)

        function addNumericalSeparator(val) {
            let res = ''
            let i = val.length
            const start = val[0] === '-' ? 1 : 0
            for (; i >= start + 4; i -= 3) {
                res = `_${val.slice(i - 3, i)}${res}`
            }
            return `${val.slice(0, i)}${res}`
        }

        // CHECK FUNCTIONS
        // ===============

        function checkBounds(buf, offset, byteLength) {
            validateNumber(offset, 'offset')
            if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
                boundsError(offset, buf.length - (byteLength + 1))
            }
        }

        function checkIntBI(value, min, max, buf, offset, byteLength) {
            if (value > max || value < min) {
                const n = typeof min === 'bigint' ? 'n' : ''
                let range
                if (byteLength > 3) {
                    if (min === 0 || min === BigInt(0)) {
                        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
                    } else {
                        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` + `${(byteLength + 1) * 8 - 1}${n}`
                    }
                } else {
                    range = `>= ${min}${n} and <= ${max}${n}`
                }
                throw new errors.ERR_OUT_OF_RANGE('value',range,value)
            }
            checkBounds(buf, offset, byteLength)
        }

        function validateNumber(value, name) {
            if (typeof value !== 'number') {
                throw new errors.ERR_INVALID_ARG_TYPE(name,'number',value)
            }
        }

        function boundsError(value, length, type) {
            if (Math.floor(value) !== value) {
                validateNumber(value, type)
                throw new errors.ERR_OUT_OF_RANGE(type || 'offset','an integer',value)
            }

            if (length < 0) {
                throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
            }

            throw new errors.ERR_OUT_OF_RANGE(type || 'offset',`>= ${type ? 1 : 0} and <= ${length}`,value)
        }

        // HELPER FUNCTIONS
        // ================

        const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

        function base64clean(str) {
            // Node takes equal signs as end of the Base64 encoding
            str = str.split('=')[0]
            // Node strips out invalid characters like \n and \t from the string, base64-js does not
            str = str.trim().replace(INVALID_BASE64_RE, '')
            // Node converts strings with length < 2 to ''
            if (str.length < 2)
                return ''
            // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
            while (str.length % 4 !== 0) {
                str = str + '='
            }
            return str
        }

        function utf8ToBytes(string, units) {
            units = units || Infinity
            let codePoint
            const length = string.length
            let leadSurrogate = null
            const bytes = []

            for (let i = 0; i < length; ++i) {
                codePoint = string.charCodeAt(i)

                // is surrogate component
                if (codePoint > 0xD7FF && codePoint < 0xE000) {
                    // last char was a lead
                    if (!leadSurrogate) {
                        // no lead yet
                        if (codePoint > 0xDBFF) {
                            // unexpected trail
                            if ((units -= 3) > -1)
                                bytes.push(0xEF, 0xBF, 0xBD)
                            continue
                        } else if (i + 1 === length) {
                            // unpaired lead
                            if ((units -= 3) > -1)
                                bytes.push(0xEF, 0xBF, 0xBD)
                            continue
                        }

                        // valid lead
                        leadSurrogate = codePoint

                        continue
                    }

                    // 2 leads in a row
                    if (codePoint < 0xDC00) {
                        if ((units -= 3) > -1)
                            bytes.push(0xEF, 0xBF, 0xBD)
                        leadSurrogate = codePoint
                        continue
                    }

                    // valid surrogate pair
                    codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
                } else if (leadSurrogate) {
                    // valid bmp char, but last char was a lead
                    if ((units -= 3) > -1)
                        bytes.push(0xEF, 0xBF, 0xBD)
                }

                leadSurrogate = null

                // encode utf8
                if (codePoint < 128) {
                    if ((units -= 1) < 0)
                        break
                    bytes.push(codePoint)
                } else if (codePoint < 0x800) {
                    if ((units -= 2) < 0)
                        break
                    bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 128)
                } else if (codePoint < 0x10000) {
                    if ((units -= 3) < 0)
                        break
                    bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 128, codePoint & 0x3F | 128)
                } else if (codePoint < 0x110000) {
                    if ((units -= 4) < 0)
                        break
                    bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 128, codePoint >> 0x6 & 0x3F | 128, codePoint & 0x3F | 128)
                } else {
                    throw new Error('Invalid code point')
                }
            }

            return bytes
        }

        function asciiToBytes(str) {
            const byteArray = []
            for (let i = 0; i < str.length; ++i) {
                // Node's code seems to be doing this and not & 0x7F..
                byteArray.push(str.charCodeAt(i) & 0xFF)
            }
            return byteArray
        }

        function utf16leToBytes(str, units) {
            let c, hi, lo
            const byteArray = []
            for (let i = 0; i < str.length; ++i) {
                if ((units -= 2) < 0)
                    break

                c = str.charCodeAt(i)
                hi = c >> 8
                lo = c % 256
                byteArray.push(lo)
                byteArray.push(hi)
            }

            return byteArray
        }

        function base64ToBytes(str) {
            return base64.toByteArray(base64clean(str))
        }

        function blitBuffer(src, dst, offset, length) {
            let i
            for (i = 0; i < length; ++i) {
                if ((i + offset >= dst.length) || (i >= src.length))
                    break
                dst[i + offset] = src[i]
            }
            return i
        }

        // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
        // the `instanceof` check but they should be treated as of that type.
        // See: https://github.com/feross/buffer/issues/166
        function isInstance(obj, type) {
            return obj instanceof type || (obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name) || (type === Uint8Array && Buffer.isBuffer(obj))
        }
        function numberIsNaN(obj) {
            // For IE11 support
            return obj !== obj
            // eslint-disable-line no-self-compare
        }

        // Create lookup table for `toString('hex')`
        // See: https://github.com/feross/buffer/issues/219
        const hexSliceLookupTable = (function() {
            const alphabet = '0123456789abcdef'
            const table = new Array(256)
            for (let i = 0; i < 16; ++i) {
                const i16 = i * 16
                for (let j = 0; j < 16; ++j) {
                    table[i16 + j] = alphabet[i] + alphabet[j]
                }
            }
            return table
        }
        )()

        // hex lookup table for Buffer.from(x, 'hex')
        /* eslint-disable no-multi-spaces, indent */
        const hexCharValueTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        /* eslint-enable no-multi-spaces, indent */

        // Return not function with Error if BigInt not supported
        function defineBigIntMethod(fn) {
            return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
        }

        function BufferBigIntNotDefined() {
            throw new Error('BigInt not supported')
        }
    }
    ,
    ieee754: (jO, jP) => {
        jP.read = function(jQ, jR, jS, jT, jU) {
            var jV, jW;
            var jX = jU * 8 - jT - 1;
            var jY = (1 << jX) - 1;
            var jZ = jY >> 1;
            var k0 = -7;
            var k1 = jS ? jU - 1 : 0;
            var k2 = jS ? -1 : 1;
            var k3 = jQ[jR + k1];
            k1 += k2;
            jV = k3 & (1 << -k0) - 1;
            k3 >>= -k0;
            k0 += jX;
            for (; k0 > 0; jV = jV * 256 + jQ[jR + k1],
            k1 += k2,
            k0 -= 8) {}
            jW = jV & (1 << -k0) - 1;
            jV >>= -k0;
            k0 += jT;
            for (; k0 > 0; jW = jW * 256 + jQ[jR + k1],
            k1 += k2,
            k0 -= 8) {}
            if (jV === 0) {
                jV = 1 - jZ;
            } else if (jV === jY) {
                return jW ? NaN : (k3 ? -1 : 1) * Infinity;
            } else {
                jW = jW + Math.pow(2, jT);
                jV = jV - jZ;
            }
            return (k3 ? -1 : 1) * jW * Math.pow(2, jV - jT);
        }
        ;
        jP.write = function(k4, k5, k6, k7, k8, k9) {
            var ka, kb, h;
            var kd = k9 * 8 - k8 - 1;
            var ke = (1 << kd) - 1;
            var kf = ke >> 1;
            var kg = k8 === 0x17 ? Math.pow(0x2, -0x18) - Math.pow(0x2, -0x4d) : 0;
            var kh = k7 ? 0 : k9 - 1;
            var ki = k7 ? 0x1 : -0x1;
            var kj = k5 < 0 || k5 === 0 && 1 / k5 < 0 ? 1 : 0;
            k5 = Math.abs(k5);
            if (isNaN(k5) || k5 === Infinity) {
                kb = isNaN(k5) ? 0x1 : 0;
                ka = ke;
            } else {
                ka = Math.floor(Math.log(k5) / Math['LN2']);
                if (k5 * (h = Math.pow(2, -ka)) < 0x1) {
                    ka--;
                    h *= 2;
                }
                if (ka + kf >= 1) {
                    k5 += kg / h;
                } else {
                    k5 += kg * Math.pow(2, 1 - kf);
                }
                if (k5 * h >= 2) {
                    ka++;
                    h /= 2;
                }
                if (ka + kf >= ke) {
                    kb = 0;
                    ka = ke;
                } else if (ka + kf >= 1) {
                    kb = (k5 * h - 1) * Math.pow(2, k8);
                    ka = ka + kf;
                } else {
                    kb = k5 * Math.pow(2, kf - 1) * Math.pow(2, k8);
                    ka = 0;
                }
            }
            for (; k8 >= 8; k4[k6 + kh] = kb & 0xff,
            kh += ki,
            kb /= 256,
            k8 -= 8) {}
            ka = ka << k8 | kb;
            kd += k8;
            for (; kd > 0; k4[k6 + kh] = ka & 0xff,
            kh += ki,
            ka /= 256,
            kd -= 8) {}
            k4[k6 + kh - ki] |= kj * 128;
        }
        ;
    }
    ,
    lerp: kk => {
        function kl(km, kn, ko) {
            return km * (1 - ko) + kn * ko;
        }
        kk.exports = kl;
    }
    ,
};
var kq = {};
function modules(ks) {
    var kt = kq[ks];
    if (kt !== undefined) {
        return kt.exports;
    }
    var ku = kq[ks] = {
        'exports': {}
    };
    moduleRegistry[ks](ku, ku.exports, modules);
    return ku.exports;
}
( () => {
    ( () => { // Webpack runtime helpers
        modules.n = kv => {
            var kw = kv && kv.__exModule ? () => kv.default : () => kv;
            modules.d(kw, {
                'a': kw
            });
            return kw;
        }
        ;
    }
    )();
    ( () => {
        modules.d = (kx, ky) => {
            for (var kz in ky) {
                if (modules.o(ky, kz) && !modules.o(kx, kz)) {
                    Object.defineProperty(kx, kz, {
                        'enumerable': true,
                        'get': ky[kz]
                    });
                }
            }
        }
        ;
    }
    )();
    ( () => {
        modules.o = (kA, kB) => Object.prototype.hasOwnProperty.call(kA, kB);
    }
    )();
    var kC = {};
    ( () => {
        'use strict';
        var kD = modules('buffer');
        ;/*
         * Simple BinaryReader is a minimal tool to read binary stream.
         * Useful for binary deserialization.
         *
         * Copyright (c) 2016 Barbosik
         * 
         * Licensed under the Apache License, Version 2.0 (the "License");
         * you may not use this file except in compliance with the License.
         * You may obtain a copy of the License at
         * 
         *     http://www.apache.org/licenses/LICENSE-2.0
         * 
         * Unless required by applicable law or agreed to in writing, software
         * distributed under the License is distributed on an "AS IS" BASIS,
         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         * See the License for the specific language governing permissions and
         * limitations under the License.
         */
        class BinaryReader {
            constructor(buffer) {
                this._offset = 0;
                this._buffer = new kD.Buffer(buffer);
            }
            ;readUInt8() {
                var value = this._buffer.readUInt8(this._offset);
                this._offset += 1;
                return value;
            }
            ;readInt8() {
                var value = this._buffer.readInt8(this._offset);
                this._offset += 1;
                return value;
            }
            ;readUInt16() {
                var value = this._buffer.readUInt16LE(this._offset);
                this._offset += 2;
                return value;
            }
            ;readInt16() {
                var value = this._buffer.readInt16LE(this._offset);
                this._offset += 2;
                return value;
            }
            ;readUInt32() {
                var value = this._buffer.readUInt32LE(this._offset);
                this._offset += 4;
                return value;
            }
            ;readInt32() {
                var value = this._buffer.readInt32LE(this._offset);
                this._offset += 4;
                return value;
            }
            ;readFloat() {
                var value = this._buffer.readFloatLE(this._offset);
                this._offset += 4;
                return value;
            }
            ;readDouble() {
                var value = this._buffer.readDoubleLE(this._offset);
                this._offset += 8;
                return value;
            }
            ;readBytes(length) {
                var value = this._buffer.slice(this._offset, this._offset + length);
                this._offset += length;
                return value;
            }
            ;skipBytes(length) {
                this._offset += length;
            }
            ;readStringUtf8(length) {
                if (length == null)
                    length = this._buffer.length - this._offset;
                length = Math.max(0, length);
                var value = this._buffer.toString('utf8', this._offset, this._offset + length);
                this._offset += length;
                return value;
            }
            ;readStringUnicode(length) {
                if (length == null)
                    length = this._buffer.length - this._offset;
                length = Math.max(0, length);
                var safeLength = length - (length % 2);
                safeLength = Math.max(0, safeLength);
                var value = this._buffer.toString('ucs2', this._offset, this._offset + safeLength);
                this._offset += length;
                return value;
            }
            ;readStringZeroUtf8() {
                var length = 0;
                var terminatorLength = 0;
                for (var i = this._offset; i < this._buffer.length; i++) {
                    if (this._buffer.readUInt8(i) == 0) {
                        terminatorLength = 1;
                        break;
                    }
                    length++;
                }
                var value = this.readStringUtf8(length);
                this._offset += terminatorLength;
                return value;
            }
            ;readStringZeroUnicode() {
                var length = 0;
                var terminatorLength = ((this._buffer.length - this._offset) & 1) != 0 ? 1 : 0;
                for (var i = this._offset; i + 1 < this._buffer.length; i += 2) {
                    if (this._buffer.readUInt16LE(i) == 0) {
                        terminatorLength = 2;
                        break;
                    }
                    length += 2;
                }
                var value = this.readStringUnicode(length);
                this._offset += terminatorLength;
                return value;
            }
            ;
        }
        const reader = BinaryReader;
        var l5 = modules('badwordsFilter');
        var l6 = modules.n(l5); // module wrapper
        ;class l7 {
            constructor(l8) {
                this.game = l8;
                this.channel = -1;
                // chat channel (party, world)
                this.filter = new (l6())({
                    'regex': /[^a-zA-z0-9:alnum:|\$|\@]|^/gi,
                    'list': modules('badwords').exports, // badwords array of, well, bad words of course
                });
                this.emotes = {};
                this.getEmotes();
            }
            getEmotes() {
                $.getJSON('php/Emotes.php', l9 => {
                    if (l9) {
                        this.emotes = l9;
                        for (var la in l9) {
                            var lb = l9[la];
                            var lc = `<li class="emotesEmote" onclick="addEmote('` + la + `');"><img name="` + la + '" title="' + la + '" src="res/emotes/' + lb + '"></li>';
                            $('#emotesList').append(lc);
                        }
                    }
                }
                );
            }
            addEmote(ld) {
                var le = $('#chat_input').val();
                var lf = le + (le == '' ? '' : ' ') + ld + ' ';
                lf = lf.substr(0, $('#chat_input').attr('maxlength'));
                $('#chat_input').val(lf);
                $('#chat_input').focus();
            }
            send(lg) {
                this.game.network.sendChat(lg, this.channel);
            }
            onMessage(sender, rgb, message, parent, ll) {
                // on incoming chat sender
                var color = 'white';
                if (this.game.blocked.indexOf(parent) > -1)
                    return;
                if (sender.indexOf('[Console]') > -1) {
                    ll = -99;
                }
                if (ll == -99) {
                    $('#tabs').children().each(function() {
                        var ll = $(this);
                        var lo = sender.indexOf('[Console]') > -1 ? '' : ':';
                        var lp = sender.indexOf('[Console]') > -1 ? '' : "<p class='nowrap' style='color: " + li + "'>" + sender + '</p>';
                        var lq = $("<div class='adminMessage' style='color: " + color + "'>" + lp + '<p>' + lo + ' ' + message + '</p></div>');
                        $(lq).appendTo(ll).hide().fadeIn(500);
                    });
                } else {
                    var ll = $('#tabs').find("[value='" + ll + "']");
                    if (ll) {
                        var notDefault = false;
                        var isAdmin = false;
                        if (sender.indexOf('[VIP]') > -1 || sender.indexOf('[Mod]') > -1 || sender.indexOf('[Admin]') > -1) {
                            notDefault = true;
                            isAdmin = sender.indexOf('[Admin]') > -1;
                            sender = sender.replace('[VIP]', '').replace('[Mod]', '').replace('[Admin]', '');
                            sender = sender.replace("font-weight: 900;", "font-weight: 300;");
                        } else {
                            sender = sender.replace(/<(?:.|\n)*?>/gm, '').trim();
                            var lu = document.createElement('div');
                            lu.textContent = sender.replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                            sender = lu.innerHTML;
                            lu.textContent = message.replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                            message = lu.innerHTML;
                            if (this.game.settings.getItem('disableProfanityFilter') != true) {
                                message = this.filter.clean(message);
                            }
                        }
                        var lv = {
                            'skinSprite': null,
                            'name': sender.replaceAllPoly("'", ''),
                            'rgb': rgb,
                            'parent': parent
                        };
                        for (var lw in this.emotes) {
                            var lx = this.emotes[lw];
                            message = message.replaceAllPoly(lw, '<img class="chatEmote" src="res/emotes/' + lx + '">');
                        }
                        var ly = $("<div class='" + (isAdmin ? 'adminMessage noshadow' : 'chatMessage') + "' style='color: " + color + "'><p><b oncontextmenu='openUserMenu(" + JSON.stringify(lv) + "); return false;' style='display:inline-block;pointer-events: all;white-space: nowrap;height:20px;color: " + rgb + "'>" + sender + '</b>: ' + message + '</p></p></div>');
                        $(ly).appendTo(ll).hide().fadeIn(500);
                        if (notDefault) {
                            $('[data-toggle="tooltip"]').tooltip();
                        }
                    }
                }
                $('.chatTab').each(function() {
                    if ($(this).children().length > 50) {
                        var lz = $(this).children().first();
                        $(lz).fadeOut(500, function() {
                            $(lz).remove();
                        });
                    }
                    $(this).scrollTop($(this).prop('scrollHeight'));
                });
            }
            clear() {
                $('.chatTab').each(function() {
                    $(this).children().remove();
                });
                $('#tabs').children().slice(2).remove();
                $('#channels').children().slice(2).remove();
            }
            setChannel(lA) {
                this.channel = lA;
                switch (lA) {
                case -2:
                    $('#btnChannel').html('<i class="fas fa-users"></i>');
                    break;
                case -1:
                    $('#btnChannel').html('<i class="fas fa-globe"></i>');
                    break;
                }
                $('#channels').hide();
                $('#tabs').children().hide();
                var lB = $('#tabs').find("[value='" + lA + "']");
                if (lB) {
                    $(lB).show();
                }
                $("[value='").each(function() {
                    $(this).scrollTop($(this).prop('scrollHeight'));
                });
            }
        }
        ;class lC {
            constructor(lD) {
                this.game = lD;
                this.mapParty = document.getElementById('mapParty');
                this.debugText = document.getElementById('debugText');
                this.partyText = document.getElementById('partyText');
                this.resetText = document.getElementById('resetText');
                this.lbList = document.getElementById('leaderboardList');
                this.mapPlayer = $('#mapPlayer');
                this.leaderboard = $('#leaderboard');
                this.mapSize = $('#map').width();
                this.nodeX = 0;
                this.nodeY = 0;
                setInterval(this.updateDebug.bind(this), 500);
            }
            loop() {
                this.nodeX = this.game.camera.x / (this.game.border[3] * 2) * this.mapSize;
                this.nodeY = this.game.camera.y / (this.game.border[3] * 2) * this.mapSize;
                this.mapPlayer.css({
                    'top': this.nodeY + this.mapSize / 2,
                    'left': this.nodeX + this.mapSize / 2
                });
                if (this.game.playerCells.length > 0) {
                    if (this.game.playerCells[0].skinSprite) {
                        this.mapPlayer.css('background-image', 'url(' + this.game.getSkinURL(this.game.playerCells[0].skin) + ')');
                        this.mapPlayer.css('border', '1px solid ' + this.game.playerCells[0].rgb);
                    } else {
                        this.mapPlayer.css('background-color', this.game.playerCells[0].rgb);
                    }
                }
            }
            onDeath() {
                this.score = 0;
                this.mapPlayer.css('background-color', 'rgba(255, 255, 255, 0.5)');
                this.mapPlayer.css('background-image', 'none');
                this.mapPlayer.css('border', '2px solid rgba(0,0,0, 0.2);');
            }
            update() {
                var lE = '';
                var lF = 0;
                for (var lG = 0; lG < this.game.leaderboard.length; lG++) {
                    var lH = this.game.leaderboard[lG];
                    var lI = '<li %style%>\n                                <p class="leaderboardRank">%rank%</p>\n                                <p class="leaderboardName">%name%</p>\n                            </li>';
                    var lJ = lH.rank <= 2 ? '<i class="fas fa-crown lbCrown lbCrown-' + (lH.rank + 1) + '"></i>' : lH.rank + 1;
                    var lK = '';
                    if (this.game.party) {
                        if (this.game.party.hasOwnProperty(lH.id) == true) {
                            var lL = this.game.party[lH.id];
                            lJ = '<i class="fas fa-user-friends lbFriend" style="color:' + lL.color + '"></i>';
                        }
                    }
                    if (lH.name.includes('[YT]')) {
                        lH.name = lH.name.replace('[YT]', '');
                        lJ = '<b class="lbYT">YT</b>';
                        if (this.game.pID == lH.id) {
                            if (this.game.playerCells.length > 0) {
                                this.game.topPosition = Math.min(this.game.topPosition, lH.rank);
                                lK = 'style="color: ' + this.game.playerCells[0].rgb + '; font-weight: bold;"';
                                if (lH.rank < 10) {
                                    this.game.onLeaderboard = true;
                                }
                            }
                        }
                    } else {
                        if (this.game.pID == lH.id) {
                            if (this.game.playerCells.length > 0) {
                                this.game.topPosition = Math.min(this.game.topPosition, lH.rank);
                                lK = 'style="color: ' + this.game.playerCells[0].rgb + '; font-weight: bold;"';
                                if (lH.rank > 2 && lH.rank < 10) {
                                    var lM = 'background-color: ' + this.game.playerCells[0].rgb + ';';
                                    if (this.game.playerCells[0].skinSprite) {
                                        lM += 'background-image: url(' + this.game.getSkinURL(this.game.playerCells[0].skin) + ');';
                                        lM += 'border: 1px solid ' + this.game.playerCells[0].rgb + ';';
                                    }
                                    lJ = '<span class="lbCell" style="' + lM + '"></span>';
                                }
                                if (lH.rank < 10) {
                                    this.game.onLeaderboard = true;
                                }
                            } else {
                                continue;
                            }
                        }
                    }
                    var lN = document.createElement('div');
                    lN.textContent = lH.name.trim().replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                    var lO = lN.innerHTML;
                    lE += lI.replace('%style%', lK).replace('%rank%', lJ).replace('%name%', lO.trim() == '' ? 'An unnamed cell' : lO).replace('%mass%', '500');
                    lF++;
                }
                this.leaderboard.css('height', 55 + lF * 20 + 'px');
                this.lbList.innerHTML = lE;
            }
            exitParty() {
                this.partyText.innerHTML = '';
                this.mapParty.innerHTML = '';
            }
            updateDebug() {
                var lP = '<b>Mass:</b> ' + this.getMass();
                lP += '<br><b>Score:</b> ' + this.getScore();
                lP += '<br><b>FPS:</b> ' + this.getFPS();
                lP += '<br><b>PING:</b> ' + this.getPING();
                if (this.game.vertical) lP += '<br><b style="color:red">[ LINESPLITTING ]</b>'; // gota haha remember that game
                else if (this.game.freeze) lP += '<br><b style="color:red">[ MOUSE FROZEN ]</b>';
                this.debugText.innerHTML = lP;
                if (this.game.network.restart) {
                    var lQ = '<b>' + this.game.network.server + '</b>';
                    if (this.game.network.restart.indexOf('[console]') > -1) {
                        lQ = '<b>' + this.getRestart() + '</b>';
                    } else {
                        lQ += ' - <b>' + this.getRestart() + '</b>';
                    }
                    this.resetText.innerHTML = lQ;
                }
                if (this.game.party && this.game.inParty) {
                    var lR = '';
                    var lS = '<b>Party Members</b><br>';
                    var lT = 1;
                    if (this.game.playerCells.length > 0) {
                        var lU = document.createElement('div');
                        lU.textContent = (this.game.playerCells[0].name || 'An unnamed cell').trim().replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                        var lV = lU.innerHTML;
                        lS += '<div style="color:' + this.game.playerCells[0].rgb + ';white-space: nowrap;"><p style="max-width: 150px;overflow:hidden;text-overflow: ellipsis;display:inline-block;">' + lT + '. ' + lV + '</p> <p style="display:inline-block;margin-left: 5px;float:right;">' + this.getMass() + '</p></div>';
                        lT++;
                    }
                    for (var lX in this.game.party) {
                        var lY = this.game.party[lX];
                        var lU = document.createElement('div');
                        lU.textContent = (lY.name || 'An unnamed cell').trim().replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                        var lV = lU.innerHTML;
                        lS += '<div style="white-space: nowrap;"><p style="max-width: 150px;overflow:hidden;text-overflow: ellipsis;display:inline-block;">' + lT + '. ' + lV + '</p> <p style="display:inline-block;margin-left: 5px;float:right;">' + lY.mass + '</p></div>';
                        lT++;
                        var m1 = lY.x / (this.game.border[3] * 2) * this.mapSize;
                        var m2 = lY.y / (this.game.border[3] * 2) * this.mapSize;
                        lR += '<div class="mapPartyMember" style="background-color: ' + lY.color + '; top: ' + (m2 + this.mapSize / 0x2) + 'px; left: ' + (m1 + this.mapSize / 0x2) + 'px;"><p>' + lV + '</p></div>';
                    }
                    this.partyText.innerHTML = lS;
                    this.game.partyMove();
                    this.mapParty.innerHTML = lR;
                }
                
            }
            getID() {
                return '<font color="#fff">' + this.game.pID + '</font>';
            }
            getRestart() {
                if (this.game.network.restart.indexOf('[console]') > -1) {
                    var m3 = new Date(this.game.network.restart.split('[console]')[1]);
                    var m4 = this.game.network.restart.split('[console]')[0];
                    var m5 = document.createElement('div');
                    m5.textContent = m4.replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                    m4 = m5.innerHTML;
                    if (m3.getTime() - Date.now() <= 5 * 1000 * 60) {
                        return m4 + ('<font color="#ff0000">' + this.timeUntil(m3) + '</font>');
                    } else {
                        return m4 + this.timeUntil(m3);
                    }
                }
                if (this.game.network.restart.indexOf('[]') > -1) {
                    return this.game.network.restart.split('[]')[0];
                }
                var m3 = new Date(this.game.network.restart);
                if (m3.getTime() - Date.now() <= 5 * 1000 * 60) {
                    return '<font color="#ff0000">' + this.timeUntil(m3) + '</font>';
                } else {
                    return this.timeUntil(m3);
                }
            }
            timeUntil(m7) {
                function m8(m9) {
                    return (m9 < 10 ? '0' : '') + m9;
                }
                var ma = m7 - new Date();
                var mb = ma < 0 ? '-' : '';
                ma = Math.abs(ma);
                var mc = ma / 3600000 | 0;
                var md = ma % 3600000 / 60000 | 0;
                var me = Math.round(ma % 60000 / 1000);
                return mb + m8(mc) + ':' + m8(md) + ':' + m8(me);
            }
            getMass() {
                var mf = 0;
                for (var mg = 0; mg < this.game.playerCells.length; mg++) {
                    mf += this.game.playerCells[mg].getMass();
                }
                return ~~mf;
            }
            getScore() {
                var mh = 0;
                for (var mi = 0; mi < this.game.playerCells.length; mi++) {
                    mh += this.game.playerCells[mi].getMass();
                }
                this.score = Math.max(this.score || 0, mh);
                this.game.highestMass = Math.max(this.score, this.game.highestMass);
                return ~~this.score;
            }
            getFPS() {
                var mj = ~~this.game.fps;
                if (mj <= 15) {
                    return '<font color="#ff0000">' + mj + '</font>';
                } else if (mj <= 30) {
                    return '<font color="yellow">' + mj + '</font>';
                } else {
                    return '<font color="#00ff00">' + mj + '</font>';
                }
            }
            getPING() {
                // Ping font color
                var mk = ~~this.game.ping;
                if (!mk) {
                    return 'N/A';
                }
                if (mk >= 200) {
                    return '<font color="#ff0000">' + mk + '</font>';
                } else if (mk >= 100) {
                    return '<font color="yellow">' + mk + '</font>';
                } else {
                    return '<font color="#00ff00">' + mk + '</font>';
                }
            }
        }
        var ml = modules('lerp');
        var mm = modules.n(ml); // module wrapper
        class mn {
            constructor(game, id, mass, originX, originY, name) {
                this.game = game;
                this.id = id;
                this.mass = mass;
                this.originX = originX;
                this.originY = originY;
                this.targetX = originX;
                this.targetY = originY;
                this.x = originX;
                this.y = originY;
                this.name = name;
                this.updateTime = Date.now();
            }
            updatePos() {
                this.delta = (this.game.updateTime - this.updateTime) / this.game.settings.settings.animationDelay;
                this.delta = Math.min(1, Math.max(0, this.delta));
                this.x = mm()(this.originX, this.targetX, this.delta);
                this.y = mm()(this.originY, this.targetY, this.delta);
            }
        }
        class mu {
            constructor(game) {
                this.game = game;
                this.x = 0;
                this.y = 0;
                this.nx = 0;
                this.ny = 0;
                this.ox = 0;
                this.oy = 0;
                this.delta = 0;
            }
            update() {
                const speed = (this.game.freeSpec ? 150 : this.game.settings.settings.cameraDelay || 1) / 10;
                const t = this.game.delta / speed;
                this.x = mm()(this.x, this.nx, t);
                this.y = mm()(this.y, this.ny, t);
            }
            update() {
                const speed = this.game.freeSpec ? 15 : this.game.settings.settings.cameraDelay / 10;
                this.x = mm()(this.x, this.nx, this.game.delta / speed);
                this.y = mm()(this.y, this.ny, this.game.delta / speed);
            }
            setPosition(x, y) {
                this.nx = x;
                this.ny = y;
            }
        }
        class my {
            constructor(src, mA, isHighQuality) {
                this.cb = mA;
                this._canvas = null;
                this._texture = null;
                this._ctx = null;
                this.size = isHighQuality ? 1024 : 512;
                this.lastAccess = Date.now();
                this.image = new Image();
                this.image.crossOrigin = 'anonymous';
                this.image.src = src;
                this.image.onload = this.render.bind(this);
            }
            async render() {
                if (null == this._canvas) {
                    this._canvas = document.createElement('canvas');
                    this._ctx = this._canvas.getContext('2d');
                }
                this._canvas.width = this.size;
                this._canvas.height = this.size;
                this._ctx.beginPath();
                this._ctx.arc(this._canvas.width / 2, this._canvas.height / 2, this.size / 2, 0, Math.PI * 2);
                this._ctx.clip();
                this._ctx.drawImage(this.image, 0, 0, this._canvas.width, this._canvas.height);
                if (!this.texture) {
                    this.texture = PIXI.Texture.from(this._canvas);
                    if (this.cb)
                        this.cb();
                }
            }
        }
        ;const nodeType = {
            'Player': 0,
            'Virus': 1,
            'Food': 2
        };
        ;class mC {
            constructor(mD, id, parent, mG, mH, mI, mJ, mK, mL, mM, mN, mO, mP) {
                this.id = id;
                this.parent = parent;
                this.game = mD;
                this.type = mG;
                this.updateTime = this.game.updateTime;
                this.created = this.game.updateTime;
                this.destroyed = false;
                this.opacity = 1;
                this.x = mH;
                this.y = mI;
                this.ox = mH;
                this.oy = mI;
                this.nx = mH;
                this.ny = mI;
                this.size = mJ;
                this.oSize = mJ;
                this.nSize = mJ;
                this.color = mO;
                this.rgb = mP;
                this.lockedColor = mL;
                this.lockedPosition = mM;
                this.root = new PIXI.Container();
                this.root.sortableChildren = true;
                this.calculateIndex();
                switch (this.type) {
                case nodeType.Virus:
                    this.cellSize = this.game.virusSize;
                    this.cellSprite = PIXI.Sprite.from(this.game.virusTexture);
                    break;
                case nodeType.Food:
                    this.cellSize = this.game.foodSize;
                    this.cellSprite = PIXI.Sprite.from(this.game.getRandomFoodTexture());
                    break;
                case nodeType.Player:
                    this.cellSize = this.game.cellSize;
                    this.cellSprite = PIXI.Sprite.from(this.game.cellTexture);
                    break;
                }
                this.cellSprite.tint = this.color;
                this.cellSprite.anchor.set(0.5, 0.5);
                if (this.type == nodeType.Food) {
                    this.cellSprite.rotation = Math.random() * (2 * Math.PI);
                }
                this.root.addChild(this.cellSprite);
                this.game.cellContainer.addChild(this.root);
            }
            destroy() {
                if (document.hidden) {
                    return this.game.removeNode(this);
                }
                this.destroyed = true;
                if (this.type != nodeType.Player) {
                    this.nSize = 1;
                }
            }
            reset() {
                this.root.visible = false;
                delete this.name;
                delete this.skin;
                if (this.nameSprite) {
                    this.root.removeChild(this.nameSprite);
                    this.nameSprite.destroy();
                }
                if (this.skinSprite) {
                    this.root.removeChild(this.skinSprite);
                    this.skinSprite.destroy();
                }
                if (this.sizeText) {
                    this.root.removeChild(this.sizeText);
                    this.sizeText.destroy();
                }
                delete this.skinCache;
                delete this.skinSprite;
                delete this.nameCache;
                delete this.nameSprite;
                delete this.sizeText;
            }
            clear() {
                this.reset();
                this.game.cellContainer.removeChild(this.root);
            }
            getScaleSize() {
                return this.size / this.cellSize;
            }
            moveRoot() {
                this.root.x = this.x;
                this.root.y = this.y;
                this.root.scale.x = this.getScaleSize();
                this.root.scale.y = this.root.scale.x;
                this.calculateIndex();
            }
            calculateIndex() {
                this.root.zIndex = this.size + this.id * 0.00001;
            }
            updatePos() {
                this.delta = (this.game.updateTime - this.updateTime) / this.game.settings.settings.animationDelay;
                if (this.delta > 1)
                    this.delta = 1;
                if (this.delta < 0)
                    this.delta = 0;
                this.x = mm()(this.ox, this.nx, this.delta);
                this.y = mm()(this.oy, this.ny, this.delta);
                this.size = mm()(this.oSize, this.nSize, this.delta);
                //if (this.destroyed) this.opacity -= this.delta / 10;
                if (this.nameCache) {
                    this.nameCache.lastAccess = this.game.updateTime;
                }
                if (this.skinCache) {
                    this.skinCache.lastAccess = this.game.updateTime;
                }
                this.moveRoot();
            }
            setColor(color, rgb) {
                if (this.color != color) {
                    this.color = color;
                    this.cellSprite.tint = color;
                }
                if (this.rgb != rgb)
                    this.rgb = rgb;
            }
            setSkin(key, removeSkin) {
                if (this.skin != key || removeSkin) {
                    this.skin = key;
                    switch (this.game.settings.getItem('showSkins')) {
                    case 'all':
                        break;
                    case 'party':
                        if (this.game.party) {
                            if (this.game.party.hasOwnProperty(this.parent) == true) {
                                break;
                            }
                        }
                    case 'self':
                        if (this.game.myCells.indexOf(this.id) > -1) {
                            break;
                        }
                    default:
                        if (removeSkin && this.skinSprite) {
                            this.root.removeChild(this.skinSprite);
                            this.skinSprite.destroy();
                            delete this.skinSprite;
                            delete this.skinCache;
                        }
                        return;
                    }
                    if (key && key != '') {
                        if (this.game.skins.hasOwnProperty(key) == false) {
                            this.skinCache = new my(this.game.getSkinURL(key),this.skinCheck.bind(this),this.game.settings.settings.highQualitySkins);
                            this.game.skins[key] = this.skinCache;
                        } else {
                            this.skinCache = this.game.skins[key];
                            this.skinCheck();
                        }
                        this.skinCache.lastAccess = this.game.updateTime;
                    }
                }
            }
            skinCheck() {
                if (!this.skinSprite && this.skinCache && this.skinCache.texture != null) {
                    this.skinSprite = new PIXI.Sprite(this.skinCache.texture);
                    this.skinSprite.zIndex = 0;
                    this.skinSprite.anchor.x = 0.5;
                    this.skinSprite.anchor.y = 0.5;
                    this.skinSprite.scale.set(this.getSkinSize());
                    this.root.addChild(this.skinSprite);
                    this.sort();
                }
            }
            getSkinSize() {
                if (!this.skinSize) {
                    const baseSize = this.game.settings.settings.highQualitySkins ? 512 : 256;
                    this.skinSize = (this.type == nodeType.Player ? (this.game.settings.settings.borderlessSkins ? 1 : 0.96) : 0.88) * (this.cellSize / baseSize);
                }
                return this.skinSize;
            }
            getNameSize() {
                return 140 - this.name.length * 3;
            }
            getMassSize() {
                return this.game.settings.settings.shortenMass ? 75 : 60;
            }
            setName(name, remove) {
                if (this.name === name && !remove)
                    return;
                this.name = name;

                switch (this.game.settings.getItem('showNames')) {
                case 'all':
                    break;
                case 'party':
                    if (this.game.party?.hasOwnProperty(this.parent))
                        break;
                case 'self':
                    if (this.game.myCells.includes(this.id))
                        break;
                default:
                    if (remove && this.nameSprite) {
                        this.root.removeChild(this.nameSprite);
                        this.nameSprite.destroy();
                        this.nameSprite = null;
                    }
                    return;
                }

                // Remove existing sprite
                if (this.nameSprite) {
                    this.root.removeChild(this.nameSprite);
                    this.nameSprite.destroy();
                    this.nameSprite = null;
                }

                if (!name || name.trim() === '')
                    return;

                const cacheKey = name + (this.lockedColor ?? '');

                if (!this.game.names[cacheKey]) {
                    const stroke = this.lockedColor ? {
                        color: 'rgba(0,0,0,0.25)',
                        width: 10,
                        join: 'round'
                    } : {
                        color: 0x000000,
                        width: 15,
                        join: 'round'
                    };

                    const text = new PIXI.Text({
                        text: name,
                        style: {
                            fontFamily: 'Ubuntu',
                            fontSize: this.getNameSize(),
                            fill: this.lockedColor ?? 0xffffff,
                            stroke,
                            align: 'center',
                            fontWeight: 'bold',
                            padding: 10,
                        }
                    });
                    const nameTexture = PIXI.RenderTexture.create({
                        width: text.width,
                        height: text.height,
                    });

                    this.game.renderer.render({
                        container: text,
                        target: nameTexture
                    });
                    text.destroy();

                    this.game.names[cacheKey] = {
                        texture: nameTexture,
                        lastAccess: this.game.updateTime
                    };
                }

                this.game.names[cacheKey].lastAccess = this.game.updateTime;
                this.nameSprite = new PIXI.Sprite(this.game.names[cacheKey].texture);
                this.nameSprite.zIndex = 1;

                switch (this.lockedPosition) {
                case 1:
                    this.nameSprite.anchor.set(0.5, 1);
                    this.nameSprite.scale.set(0.8);
                    break;
                case 3:
                    this.nameSprite.anchor.set(0.5, 0);
                    this.nameSprite.scale.set(0.8);
                    break;
                default:
                    this.nameSprite.anchor.set(0.5);
                }

                this.root.addChild(this.nameSprite);
                this.sort();
            }
            sort() {}
            setSize(size) {
                if (this.nSize == size) return;
                this.nSize = size;
                if (this.destroyed == true || this.type != nodeType.Player || Math.abs((this.oSize + this.nSize) / 2) < 100 || this.game.settings.getItem('showMass') == false)
                    return;
                if (!this.sizeText) {
                    this.sizeText = new PIXI.Sprite();
                    this.sizeText.anchor.set(0.5);
                    this.sizeText.position.y = this.cellSize / 2;
                    this.sizeText.zIndex = 1;
                    this.root.addChild(this.sizeText);
                    this.sort();
                }

                const massStr = this.game.settings.settings.shortenMass ? this.getShortMass() : String(this.getMass());
                const cacheKey = massStr;

                if (!this.game.masses[cacheKey]) {
                    const text = new PIXI.Text({
                        text: massStr,
                        style: {
                            fontFamily: 'Ubuntu',
                            fontSize: this.getMassSize(),
                            fill: 0xffffff,
                            stroke: {
                                color: 0x000000,
                                width: 13,
                                join: 'round'
                            },
                            align: 'center',
                            fontWeight: 'bold',
                            padding: 1
                        }
                    });
                    const texture = PIXI.RenderTexture.create({
                        width: text.width,
                        height: text.height
                    });
                    this.game.renderer.render({
                        container: text,
                        target: texture
                    });
                    text.destroy();
                    this.game.masses[cacheKey] = {
                        texture,
                        lastAccess: this.game.updateTime
                    };
                }

                this.game.masses[cacheKey].lastAccess = this.game.updateTime;
                // Refresh timer
                this.sizeText.texture = this.game.masses[cacheKey].texture;
            }
            getRadius() {
                return this.size;
            }
            getMass() {
                return Math.floor(this.nSize * this.nSize / 100);
            }
            decimalToRgb(mX) {
                var mY = Math.floor(mX / (256 * 256));
                var mZ = Math.floor(mX / 256) % 256;
                var n0 = mX % 256;
                return {
                    'r': mY,
                    'g': mZ,
                    'b': n0
                };
            }
            getShortMass() {
                // Return a string representing the shortened mass number
                const mass = this.getMass();
                if (mass > 1000000)
                    return `${(Math.floor(mass / 100000) / 10).toFixed(1)}M`;
                if (mass >= 1000)
                    return `${(Math.floor(mass / 100) / 10).toFixed(1)}k`;
                else
                    return mass.toString();
            }
        }
        const n1 = mC;
        ;class n2 {
            constructor(n3) {
                this.game = n3;
                this.playerPool = [];
                this.virusPool = [];
                this.foodPool = [];
                this.maxPlayerPoolSize = 256;
                this.maxVirusPoolSize = 128;
                this.maxFoodPoolSize = 256;
            }
            populate(n4) {
                for (let n5 = 0; n5 < 128; n5++) {
                    this.putNode(new n1(this.game,0,-1,nodeType.Player,0,0,1,null,null,null,null,0,''));
                }
                for (let n6 = 0; n6 < 32; n6++) {
                    this.putNode(new n1(this.game,0,-1,nodeType.Virus,0,0,1,null,null,null,null,0,''));
                }
                for (let n7 = 0; n7 < 64; n7++) {
                    this.putNode(new n1(this.game,0,-1,nodeType.Food,0,0,1,null,null,null,null,0,''));
                }
                if (n4)
                    n4();
            }
            getNode(id, parent, type, x, y, size, ne, lockedColor, lockedPosition, nh, color, rgb, nk) {
                let node = null;
                switch (type) {
                case nodeType.Player:
                    if (this.playerPool.length > 0) {
                        node = this.playerPool.shift();
                    }
                    break;
                case nodeType.Virus:
                    if (this.virusPool.length > 0) {
                        node = this.virusPool.shift();
                    }
                    break;
                case nodeType.Food:
                    if (this.foodPool.length > 0) {
                        node = this.foodPool.shift();
                    }
                    break;
                }
                if (node == null) {
                    node = new n1(this.game,id,parent,type,x,y,size,ne,lockedColor,lockedPosition,nh,color,rgb);
                } else {
                    node.id = id;
                    node.parent = parent;
                    node.x = x;
                    node.y = y;
                    node.ox = x;
                    node.oy = y;
                    node.nx = x;
                    node.ny = y;
                    node.size = size;
                    node.oSize = size;
                    node.nSize = size;
                    node.lockedColor = lockedColor;
                    node.lockedPosition = lockedPosition;
                    node.updateTime = this.game.updateTime;
                    node.created = this.game.updateTime;
                    node.color = color;
                    node.rgb = rgb;
                    node.cellSprite.tint = color;
                    node.destroyed = false;
                    node.opacity = 1;
                    node.moveRoot();
                    //node.root.alpha = 1; // Re-enable to fade cells out, as I think was originally intended
                }
                if (type != nodeType.Player && nk == false) {
                    node.size = 1;
                    node.oSize = 1;
                }
                if (type == nodeType.Food && nk == false && this.game.settings.getItem('hideFood') == true) {
                    node.root.visible = false;
                } else {
                    node.root.visible = true;
                }
                return node;
            }
            putNode(nm) {
                switch (nm.type) {
                case nodeType.Player:
                    if (this.playerPool.length < this.maxPlayerPoolSize) {
                        nm.reset();
                        this.playerPool.push(nm);
                    } else {
                        nm.clear();
                    }
                    break;
                case nodeType.Virus:
                    if (this.virusPool.length < this.maxVirusPoolSize) {
                        nm.reset();
                        this.virusPool.push(nm);
                    } else {
                        nm.clear();
                    }
                    break;
                case nodeType.Food:
                    if (this.foodPool.length < this.maxFoodPoolSize) {
                        nm.reset();
                        this.foodPool.push(nm);
                    } else {
                        nm.clear();
                    }
                    break;
                default:
                    nm.clear();
                    break;
                }
            }
        }
        const nn = n2;
        ;;// The following was initially stolen and obfuscated on Germs with a deliberate change from  
        // function to class structure.
        /*
         * Simple BinaryWriter is a minimal tool to write binary stream with unpredictable size.
         * Useful for binary serialization.
         *
         * Copyright (c) 2016 Barbosik
         * 
         * Licensed under the Apache License, Version 2.0 (the "License");
         * you may not use this file except in compliance with the License.
         * You may obtain a copy of the License at
         * 
         *     http://www.apache.org/licenses/LICENSE-2.0
         * 
         * Unless required by applicable law or agreed to in writing, software
         * distributed under the License is distributed on an "AS IS" BASIS,
         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         * See the License for the specific language governing permissions and
         * limitations under the License.
         * 
         * 
         */
        class BinaryWriter {
            constructor(size) {
                if (!size || size <= 0) {
                    size = kD.Buffer.poolSize / 2;
                }
                this._buffer = new kD.Buffer(size);
                this._length = 0;
            }
            writeUInt8(value) {
                this.checkAlloc(this, 1);
                this._buffer[this._length++] = value;
            }
            ;writeInt8(value) {
                this.checkAlloc(this, 1);
                this._buffer[this._length++] = value;
            }
            ;writeUInt16(value) {
                this.checkAlloc(this, 2);
                this._buffer[this._length++] = value;
                this._buffer[this._length++] = value >> 8;
            }
            ;writeInt16(value) {
                this.checkAlloc(this, 2);
                this._buffer[this._length++] = value;
                this._buffer[this._length++] = value >> 8;
            }
            ;writeUInt32(value) {
                this.checkAlloc(this, 4);
                this._buffer[this._length++] = value;
                this._buffer[this._length++] = value >> 8;
                this._buffer[this._length++] = value >> 16;
                this._buffer[this._length++] = value >> 24;
            }
            ;writeInt32(value) {
                this.checkAlloc(this, 4);
                this._buffer[this._length++] = value;
                this._buffer[this._length++] = value >> 8;
                this._buffer[this._length++] = value >> 16;
                this._buffer[this._length++] = value >> 24;
            }
            ;writeFloat(value) {
                this.checkAlloc(this, 4);
                this._buffer.writeFloatLE(value, this._length, true);
                this._length += 4;
            }
            ;writeDouble(value) {
                this.checkAlloc(this, 8);
                this._buffer.writeDoubleLE(value, this._length, true);
                this._length += 8;
            }
            ;writeBytes(data) {
                this.checkAlloc(this, data.length);
                data.copy(this._buffer, this._length, 0, data.length);
                this._length += data.length;
            }
            ;writeStringUtf8(value) {
                var length = kD.Buffer.byteLength(value, 'utf8')
                this.checkAlloc(this, length);
                this._buffer.write(value, this._length, 'utf8');
                this._length += length;
            }
            ;writeStringUnicode(value) {
                var length = kD.Buffer.byteLength(value, 'ucs2')
                this.checkAlloc(this, length);
                this._buffer.write(value, this._length, 'ucs2');
                this._length += length;
            }
            ;writeStringZeroUtf8(value) {
                this.writeStringUtf8(value);
                this.writeUInt8(0);
            }
            ;writeStringZeroUnicode(value) {
                this.writeStringUnicode(value);
                this.writeUInt16(0);
            }
            ;getLength() {
                return this._length;
            }
            ;reset() {
                this._length = 0;
            }
            ;toBuffer() {
                return kD.Buffer.concat([this._buffer.slice(0, this._length)]);
            }
            ;checkAlloc(writer, size) {
                var needed = writer._length + size;
                if (writer._buffer.length >= needed)
                    return;
                var chunk = Math.max(kD.Buffer.poolSize / 2, 1024);
                var chunkCount = (needed / chunk) >>> 0;
                if ((needed % chunk) > 0) {
                    chunkCount += 1;
                }
                var buffer = new kD.Buffer(chunkCount * chunk);
                writer._buffer.copy(buffer, 0, 0, writer._length);
                writer._buffer = buffer;
            }
            ;
        }
        const writer = BinaryWriter;
        ;class nN {
            constructor() {
                this._writer = new writer(1);
                this._writer.writeUInt8(100);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const nO = nN;
        ;class nP {
            constructor(nQ) {
                this._writer = new writer();
                this._writer.writeUInt8(0x7b);
                this._writer.writeUInt8(0x6);
                this._writer.writeStringZeroUtf8(nQ);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const nR = nP;
        ;class nS {
            constructor(nT) {
                this._writer = new writer();
                this._writer.writeUInt8(0xff);
                this._writer.writeStringZeroUnicode(nT);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const nU = nS;
        ;class nV {
            constructor() {
                this._writer = new writer(1);
                this._writer.writeUInt8(1);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const nW = nV;
        ;class nX {
            constructor(nY) {
                this._writer = new writer();
                this._writer.writeUInt8(0);
                this._writer.writeStringZeroUtf8(nY);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const nZ = nX;
        ;class o0 {
            constructor(o1, o2) {
                this._writer = new writer();
                this._writer.writeUInt8(0x56);
                this._writer.writeInt32(o2);
                this._writer.writeStringZeroUtf8(o1);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const o3 = o0;
        ;class o4 {
            constructor(o5, o6) {
                this._writer = new writer();
                this._writer.writeUInt8(16);
                this._writer.writeDouble(~~o5);
                this._writer.writeDouble(~~o6);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const o7 = o4;
        ;class o8 {
            constructor(/*amount*/
            ) {
                // Amount from 1-4
                this._writer = new writer(1);
                this._writer.writeUInt8(17);
                /* Server would queue splits for the next `amount` game ticks
                this._writer.writeUInt8(amount); 
                */
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const o9 = o8;
        ;class oa {
            constructor() {
                this._writer = new writer(1);
                this._writer.writeUInt8(21);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const ob = oa;
        ;class oc {
            constructor() {
                this._writer = new writer(0x1);
                this._writer.writeUInt8(0x12);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        // Extra (??) packet constructor
        const od = oc;
        ;class oe {
            constructor(of, og) {
                this._writer = new writer();
                this._writer.writeUInt8(0x55);
                this._writer.writeUInt8(of);
                if (of == 1) {
                    this._writer.writeStringZeroUtf8(og);
                }
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        const oh = oe;
        ;const packet = {
            'Ping': nO,
            'Protocol': nR,
            'Login': nU,
            'Spectate': nW,
            'Name': nZ,
            'Chat': o3,
            'Mouse': o7,
            'Split': o9,
            'Eject': ob,
            'Extra': od,
            'Party': oh
        };
        ;const oj = 'g-h';
        const ok = ['6', '9'];
        const ol = ['4', '2', '0'];
        const om = (oo, op, oq) => {
            return ok[oo] + ol[op] + ok[oq];
        }
        ;
        ;class or {
            constructor(os) {
                this.game = os;
                this.open = false;
                this.ping = Date.now();
                this.searching = false;
                this.verified = false;
                this.turnstileReady = false;
                this.token = null;
                this.cfToken = null;
                this.mode = this.game.settings.getItem("lastMode");
                this.server = '';
                this.region = '';
                this.modes = {};
                this.ip = '';
                this.skin = '';
                this.reconnectAttempts = 0;
                this.baseReconnectDelay = 1000;
                this.maxReconnectDelay = 30000;
                this.reconnectMultiplier = 1.5;
            }
            connect(mode, ou) {
                if (this.open && this.mode == mode && !ou) {
                    return;
                }
                if (this.reconnect) {
                    clearTimeout(this.reconnect);
                }
                $('#moreServers').html('<i class="fas fa-server"></i>');
                $('#moreServersList').hide();
                $('#moreServers').hide();
                this.verified = false;
                this.token = null;
                this.cfToken = null;
                this.open = false;
                this.game.setConnecting(true);
                if (this.ws) {
                    this.ws.onopen = null;
                    this.ws.onmessage = null;
                    this.ws.onclose = null;
                    try {
                        this.ws.close();
                    } catch (ov) {}
                    this.ws = null;
                }
                this.game.showMenu();
                var ow = this.findMode(mode);
                this.game.settings.setItem('lastMode', mode);
                console.debug("Settings: " + this.game.settings.getItem('lastMode'));
                var oz = ow[1];
                this.mode = ow[0];
                this.server = oz.name;
                this.ip = 'wss://' + this.domain + ':' + oz.port;
                var oA = this.getParameterByName('ip');
                if (oA) {
                    this.ip = 'wss://' + oA;
                    this.game.log('Connecting to Private Server: ' + oA);
                } else {
                    this.game.log('Connecting to ' + this.server);
                }
                this.ws = new WebSocket(this.ip,oj);
                this.ws.binaryType = 'arraybuffer';
                this.ws.onopen = this.onOpen.bind(this);
                this.ws.onmessage = this.onMessage.bind(this);
                this.ws.onclose = this.onClose.bind(this);
                this.ws.onerror = this.onClose.bind(this);
            }
            h2(oB) {
                var oC = [], oD;
                for (var oE = 0; oE < oB.length - 1; oE += 2)
                    oC.push(parseInt(oB.substr(oE, 2), 16));
                return String.fromCharCode.apply(String, oC);
            }
            getParameterByName(oF, oG) {
                if (!oG)
                    oG = window.location.href;
                oF = oF.replace(/[\[\]]/g, '\\$&');
                var oH = new RegExp('[?&]' + oF + '(=([^&#]*)|&|#|$)')
                  , oI = oH.exec(oG);
                if (!oI)
                    return null;
                if (!oI[2])
                    return '';
                return decodeURIComponent(oI[2].replace(/\+/g, ' '));
            }
            send(packet) {
                if (this.open) {
                    this.ws.send(packet.build());
                }
            }
            async sendNick(oK) {
                await this.verify();
                if (this.skin != '') {
                    this.send(new packet.Name('<' + this.skin + '>' + oK));
                } else {
                    this.send(new packet.Name(oK));
                }
            }
            sendParty(oL, oM) {
                this.send(new packet.Party(oL,oM));
            }
            setSkin(value) {
                if (skin == '' || skin == 'None') {
                    this.skin = '';
                } else {
                    this.skin = value;
                }
            }
            async sendSpectate() {
                await this.verify();
                this.send(new packet.Spectate());
            }
            sendMouse(oO) {
                this.send(new packet.Mouse(oO.x,oO.y));
            }
            sendChat(oP, oQ) {
                this.send(new packet.Chat(oP,oQ));
            }
            verify() {
                return new Promise( (oR, oS) => {
                    if (this.verified)
                        return oR();
                    this.tryVerifyCf();
                    this.captchaInterval = setInterval( () => {
                        if (this.verified) {
                            clearInterval(this.captchaInterval);
                            oR();
                        }
                    }
                    , 100);
                }
                );
            }
            sendVerification() {
                if (this.cfToken) {
                    this.send(new packet.Protocol(om(0, 2, 1) + 'TbU2&9b$4eRq' + 'bruh' + 'TbU2&9b$4eRq' + this.cfToken));
                }
            }
            tryVerify() {
                if (!this.token) {
                    if (this.game.playerCells.length > 0) {
                        return;
                    }
                    grecaptcha.execute(this.captchaId);
                }
            }
            tryVerifyCf() {
                if (!this.cfToken) {
                    if (!this.turnstileReady) {
                        if (this.cdTimeout) {
                            clearTimeout(this.cdTimeout);
                        }
                        this.cdTimeout = setTimeout(this.tryVerifyCf.bind(this), 3000);
                    }
                    if (this.turnstileId) {
                        turnstile.remove(this.turnstileId);
                        this.turnstileId = null;
                    }
                    if (this.game.playerCells.length > 0) {
                        return;
                    }
                    this.turnstileId = turnstile.render('.turnstile', {
                        'sitekey': '0x4AAAAAAADbCnxCCnFv3yIA',
                        'theme': 'dark',
                        'appearance': 'interaction-only',
                        'callback': token => {
                            this.cfToken = token;
                            this.sendVerification();
                            $('.turnstile-container').hide();
                            turnstile.remove(this.turnstileId);
                            this.turnstileId = null;
                        }
                        ,
                        'error-callback': () => {
                            turnstile.reset(this.turnstileId);
                        }
                        ,
                        'before-interactive-callback': () => {
                            $('.turnstile-container').css('display', 'flex');
                        }
                        ,
                        'after-interactive-callback': () => {
                            $('.turnstile-container').hide();
                        }
                    });
                }
            }
            onCaptchaError() {
                this.game.log('onCaptchaError');
                grecaptcha.reset(this.captchaId);
                if (this.captchaTimeout) {
                    clearTimeout(this.captchaTimeout);
                }
                this.captchaTimeout = setTimeout(this.tryVerify.bind(this), 3000);
            }
            onCaptchaExpired() {
                this.game.log('Captcha Expired!');
                grecaptcha.reset(this.captchaId);
            }
            onCaptchaLoad() {
                this.captchaElement = document.querySelector('.g-recaptcha');
                this.captchaId = grecaptcha.render(this.captchaElement, {
                    'sitekey': '6LfRVZ8UAAAAAEgD_Zaf5L8XItSFUqsFjOXfVBlT',
                    'size': 'invisible',
                    'theme': 'dark',
                    'callback': oU => {
                        this.token = oU;
                        this.sendVerification();
                        grecaptcha.reset(this.captchaId);
                    }
                    ,
                    'error-callback': this.onCaptchaError.bind(this),
                    'expired-callback': this.onCaptchaExpired.bind(this)
                }, true);
            }
            onTurnstileLoad() {
                this.turnstileReady = true;
            }
            onOpen() {
                this.verified = false;
                this.token = null;
                this.cfToken = null;
                this.tryVerifyCf();
                this.reconnectAttempts = 0;
                this.game.setConnecting(false);
                $('#gamemodes > .gm.active').removeClass('active');
                $('.gm:contains(' + this.mode + ')').addClass('active');
                this.game.chat.clear();
                this.game.log('Connection Open!');
                this.game.clearNodes();
                this.open = true;
                this.send(new packet.Login(this.game.login.uuid ? this.game.login.uuid : ''));
                if (this.pingInterval)
                    clearInterval(this.pingInterval);
                this.pingInterval = setInterval(function() {
                    this.send(new packet.Ping());
                    this.ping = Date.now();
                }
                .bind(this), 1000);
                if (window.location.hash) {
                    this.game.partyCode(window.location.hash);
                }
                this.moreServers();
            }
            sendUUID(oV) {
                this.send(new packet.Login(oV));
            }
            sendLocked() {
                var oW = Date.now() / 1000;
                if (this.game.login.lockedExpire && this.game.login.lockedExpire - oW > 0) {
                    this.send(new packet.Login('locked-' + this.game.settings.getItem('lockedColor') + '-' + this.game.settings.getItem('lockedPosition')));
                }
            }
            onMessage(oX) {
                let oY = new reader(oX.data);
                let oZ = oY.readUInt8();
                switch (oZ) {
                case 16:
                    this.handleNodes(oY);
                    break;
                case 0x11:
                    this.handlePosition(oY);
                    break;
                case 0x12:
                    this.handleClear(oY);
                    break;
                case 20:
                    this.handleClear(oY);
                    break;
                case 0x15:
                    this.handleDrawLine(oY);
                    break;
                case 0x16:
                    this.handeDrawLines(oY);
                    break;
                case 0x18:
                    break;
                case 32:
                    this.handleAddNode(oY);
                    break;
                case 0x31:
                    this.handleLeaderboardFFA(oY);
                    break;
                case 0x32:
                    this.handleLeaderboardText(oY);
                    break;
                case 0x41:
                    this.handleBorder(oY);
                    break;
                case 0x55:
                    this.handlePartyCode(oY);
                    break;
                case 0x56:
                    this.handleChat(oY);
                    break;
                case 0x57:
                    this.handleParty(oY);
                    break;
                case 0x58:
                    this.handleLevel(oY);
                    break;
                case 100:
                    this.handlePong(oY);
                    break;
                case 0x77:
                    this.handleRadius(oY);
                    break;
                case 0xfe:
                    this.handleRestart(oY);
                    break;
                }
            }
            onClose(p0) {
                $('#resetCenter').hide();
                this.game.log('Connection Closed! ' + (p0.reason ? p0.reason : ''));
                if (this.game.playerCells.length > 0) {
                    this.game.refreshAds();
                    this.game.deathTimeout = setTimeout(this.game.onDeath.bind(this.game), 100);
                } else {
                    this.game.showMenu();
                }
                this.game.clearNodes();
                this.open = false;
                this.game.setConnecting(true);
                if (this.reconnect) {
                    clearTimeout(this.reconnect);
                }
                if (p0.reason == 'No Slots') {
                    this.reconnectAttempts = 0;
                    return this.connect(this.mode);
                }
                const p1 = Math.min(this.baseReconnectDelay * Math.pow(this.reconnectMultiplier, this.reconnectAttempts), this.maxReconnectDelay);
                this.game.log('Reconnecting in ' + (p1 / 1000).toFixed(1) + 's...');
                this.reconnectAttempts++;
                this.reconnect = setTimeout( () => {
                    this.connect(this.server, true);
                }
                , p1);
            }
            handleLevel(p2) {
                this.game.login.setXP(p2.readUInt32());
                if (p2.readUInt8() == 1) {
                    this.game.login.setCoins(this.game.login.coins + p2.readUInt32());
                }
            }
            handlePong(p3) {
                var p4 = Date.now();
                var p5 = p4 - this.ping;
                this.game.ping = p5;
            }
            handlePartyCode(p6) {
                var p7 = p6.readStringZeroUtf8();
                if (p7 == 'invalid') {
                    return this.game.exitParty();
                }
                this.game.partyMove();
                this.game.inParty = true;
                $('#party').show();
                window.location.hash = p7;
                $('#partyCopyCode').val('germs.io/' + p7);
                $('.partyCreate').hide();
                $('#partyFind').hide();
                $('#partyJoin').hide();
                $('#partyMenu').show();
                $('.partyCard').addClass('partyGlow');
            }
            handleParty(p8) {
                let p9 = p8.readUInt16();
                let pa = {};
                for (let pb = 0; pb < p9; pb++) {
                    let pc = p8.readUInt32();
                    let pd = p8.readStringZeroUtf8();
                    let pe = p8.readUInt8()
                      , pf = p8.readUInt8()
                      , pg = p8.readUInt8();
                    let ph = '#' + ((1 << 0x18) + (pe << 16) + (pf << 8) + pg).toString(16).slice(0x1);
                    let pi = p8.readInt32();
                    let pj = p8.readInt32();
                    let pk = p8.readInt32();
                    var pl;
                    if (this.game.party && this.game.party.hasOwnProperty(pc)) {
                        pl = this.game.party[pc];
                        pl.ox = pl.x;
                        pl.oy = pl.y;
                        pl.nx = pj;
                        pl.ny = pk;
                    } else {
                        pl = new mn(this.game,pc,pi,pj,pk,pd);
                    }
                    pl.color = ph;
                    pl.name = pd;
                    pl.mass = pi;
                    pl.updateTime = performance.now();
                    pl.updatePos();
                    pa[pc] = pl;
                }
                this.game.party = pa;
            }
            handleDrawLine(pm) {}
            handeDrawLines(pn) {}
            handleAddNode(po) {
                if (this.game.myCells.length == 0) {
                    this.game.startTime = Date.now();
                }
                this.game.myCells.push(po.readUInt32());
            }
            handleNodes(buffer) {
                let now = performance.now();
                this.game.updateTime = now;

                let eatCount = buffer.readUInt16();
                for (let i = 0; i < eatCount; i++) {
                    let hunter = this.game.nodes[buffer.readUInt32()];
                    let eaten = this.game.nodes[buffer.readUInt32()];
                    if (eaten) {
                        if (hunter) {
                            eaten.hunter = hunter;
                            eaten.nx = hunter.x;
                            eaten.ny = hunter.y;
                            if (this.game.playerCells.indexOf(hunter) > -1) {
                                if (eaten.parent == -1) {
                                    this.game.foodEaten++;
                                } else {
                                    this.game.cellsEaten++;
                                }
                            }
                        }
                        eaten.updateTime = now;
                        eaten.destroy();
                    }
                }

                while (true) {
                    let nodeId = buffer.readUInt32();
                    if (nodeId == 0)
                        break;

                    let x = buffer.readInt32();
                    let y = buffer.readInt32();
                    let size = buffer.readUInt16();

                    // Flags byte
                    let flags = buffer.readUInt8();
                    let isVirus = flags & 1;
                    let hasColor = flags & 2;
                    let hasSkin = flags & 4;
                    let hasName = flags & 8;
                    let hasPartyInfo = flags & 16;
                    let isEjected = flags & 32;
                    let hasParent = flags & 64;

                    let skin = null;
                    let name = null;
                    let colorHex = null;
                    let colorStr = null;
                    let parentId = -1;
                    let partyId = null;
                    let partyFlags = null;

                    if (hasPartyInfo) {
                        partyId = buffer.readUInt32();
                        partyFlags = buffer.readUInt8();
                    }
                    if (hasParent) {
                        parentId = buffer.readInt32();
                    }
                    if (hasColor) {
                        let r = buffer.readUInt8();
                        let g = buffer.readUInt8();
                        let b = buffer.readUInt8();
                        colorStr = `rgb(${r}, ${g}, ${b})`;
                        colorHex = (r << 16) + (g << 8) + b;
                    }
                    if (hasSkin) {
                        skin = buffer.readStringZeroUtf8().substr(1);
                    }
                    if (hasName) {
                        name = buffer.readStringZeroUtf8().trim().replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '');
                    }

                    let node;
                    if (this.game.nodes.hasOwnProperty(nodeId)) {
                        // Existing node — save previous position for interpolation
                        node = this.game.nodes[nodeId];
                        node.ox = node.x;
                        node.oy = node.y;
                        node.oSize = node.size;
                    } else {
                        // New node — determine type from flags
                        let type = nodeType.Food;
                        if (hasParent && !isVirus && !isEjected) {
                            type = nodeType.Player;
                        } else if (isVirus) {
                            type = nodeType.Virus;
                        }
                        node = this.game.pool.getNode(nodeId, parentId, type, x, y, size, name, partyId, partyFlags, skin, colorHex, colorStr, isEjected);
                        this.game.addNode(node);
                    }

                    node.nx = x;
                    node.ny = y;
                    node.setSize(size);
                    node.updateTime = now;

                    if (hasPartyInfo) {
                        node.lockedColor = partyId;
                        node.lockedPosition = partyFlags;
                    }
                    if (hasColor) {
                        node.setColor(colorHex, colorStr);
                    }
                    if (hasSkin && skin && skin != '') {
                        node.setSkin(skin);
                    }
                    if (hasName && name && name != '') {
                        node.setName(name);
                    }
                }

                let destroyCount = buffer.readUInt16();
                for (let i = 0; i < destroyCount; i++) {
                    let node = this.game.nodes[buffer.readUInt32()];
                    if (node) {
                        node.updateTime = now;
                        node.destroy();
                    }
                }
            }
            handleBorder(pW) {
                this.game.setBorder(pW.readDouble(), pW.readDouble(), pW.readDouble(), pW.readDouble());
                this.game.pID = pW.readUInt32();
            }
            handleLeaderboardText(pX) {
                var pY = pX.readUInt16();
                this.game.leaderboard = [];
                this.game.leaderboardCustom = true;
                for (var pZ = 0; pZ < pY; pZ++) {
                    this.game.leaderboard.push(pX.readStringZeroUtf8());
                }
                this.game.ui.update();
            }
            handleLeaderboardFFA(q0) {
                let q1 = q0.readUInt16();
                this.game.leaderboard = [];
                this.game.leaderboardCustom = false;
                for (let q2 = 0; q2 < q1; q2++) {
                    let q3 = q0.readUInt16();
                    let q4 = q0.readUInt32();
                    this.game.leaderboard.push({
                        'rank': q3,
                        'id': q4,
                        'name': q0.readStringZeroUtf8()
                    });
                }
                this.game.ui.update();
            }
            handleClear(q5) {
                this.game.clearNodes();
            }
            handlePosition(q6) {
                this.game.updatePosition(q6.readFloat(), q6.readFloat(), q6.readFloat());
            }
            handleRestart(q7) {
                this.verified = true;
                this.restart = q7.readStringZeroUnicode();
                $('#resetCenter').show();
                this.game.ui.updateDebug();
            }
            handleRadius(q8) {
                this.game.radius = q8.readDouble();
            }
            handleChat(q9) {
                let qa = q9.readInt32();
                let qb = q9.readInt32();
                var qc = q9.readUInt8()
                  , qd = q9.readUInt8()
                  , qe = q9.readUInt8()
                  , qf = (qc << 16 | qd << 8 | qe).toString(16);
                while (qf.length < 6) {
                    qf = '0' + qf;
                }
                qf = '#' + qf;
                let qg = q9.readStringZeroUtf8();
                let qh = q9.readStringZeroUtf8();
                this.game.chat.onMessage(qg, qf, qh, qa, qb);
            }
            findMode(qi) {
                for (var qj in this.modes) {
                    var qk = this.modes[qj];
                    var ql = qk.servers.find(qm => qm.name == qi);
                    var qn = qk.max;
                    if (ql) {
                        return [qj, ql];
                    } else {
                        if (qj == qi) {
                            for (var qo = 0; qo < qk.servers.length; qo++) {
                                var qp = qk.servers[qo];
                                if (qp.count >= qn - 5) {
                                    continue;
                                }
                                return [qj, qp];
                            }
                        }
                    }
                }
            }
            refresh() {
                if (this.open && $('#menu').is(':visible')) {
                    $.getJSON('php/Servers.php?region=' + this.region, qq => {
                        this.domain = qq.ip;
                        this.region = qq.region;
                        this.modes = qq.modes;
                        $('#region' + this.region).removeClass('btn-secondary').addClass('btn-primary');
                        this.game.setModes(this.modes);
                        $('#gamemodes > .gm.active').removeClass('active');
                        $('.gm:contains(' + this.mode + ')').addClass('active');
                        this.moreServers();
                    }
                    );
                }
            }
            moreServers() {
                if (!this.modes || !this.mode)
                    return;
                var qr = this.modes[this.mode];
                var qs = qr.servers;
                if (qs.length > 1) {
                    let qt = '<div class="tab-pane" role="tabpanel">';
                    for (let qu = 0; qu < qs.length; qu++) {
                        qt += `<button type="button" onclick="connect('` + qs[qu].name + `');" class="btn btn-primary btn btn-block">\n                            <b>` + qs[qu].name + '</b> (' + qs[qu].count + '/' + qr.max + ')\n                        </button>';
                    }
                    qt += '</div>';
                    $('#moreServersList').html(qt);
                    $('#moreServers').off('click').on('click', this.toggleMoreServers.bind(this));
                    $('#moreServers').show();
                } else {
                    $('#moreServers').html('<i class="fas fa-server"></i>');
                    $('#moreServersList').hide();
                    $('#moreServers').hide();
                    $('#gamemodes').show();
                }
            }
            toggleMoreServers() {
                if ($('#moreServersList').is(':visible')) {
                    $('#moreServers').html('<i class="fas fa-server"></i>');
                    $('#gamemodes').show();
                    $('#moreServersList').hide();
                } else {
                    $('#moreServers').html('<i class="fas fa-times"></i>');
                    $('#gamemodes').hide();
                    $('#moreServersList').show();
                }
            }
            getServers(qv) {
                this.searching = true;
                $('#regionNA, #regionEU, #regionAS, #regionTest').removeClass('btn-primary').addClass('btn-secondary');
                $.getJSON('php/Servers.php' + (qv ? '?region=' + qv : ''), qw => {
                    this.domain = qw.ip;
                    this.region = qw.region;
                    this.modes = qw.modes;
                    $('#region' + this.region).removeClass('btn-secondary').addClass('btn-primary');
                    this.game.setRegion(this.region);
                    this.game.setModes(this.modes);
                    if (this.mode) {
                        console.debug("Connecting to " + this.mode);
                        this.connect(this.mode, true);
                    } else {
                        for (var qx in this.modes) {
                            var qy = this.modes[qx];
                            if (qy.default == true) {
                                console.debug("Connecting to default mode " + qx);
                                this.connect(qx, true);
                            }
                        }
                    }
                    this.searching = false;
                }
                );
            }
        }
        ;class qz {
            constructor(qA) {
                this.game = qA;
                this.settings = JSON.parse(window.localStorage.getItem('settings') || '{}');
                this.default = {
                    'nick': '',
                    'skin': '',
                    'theme': 'hex',
                    'color': 'gray',
                    'controls': {
                        'Split': [32, 'Space'],
                        'Feed': [0x57, 'W'],
                        'Double': [0x44, 'D'],
                        'Triple': [0x52, 'R'],
                        '16x': [0x54, 'T'],
                        'Freeze': [0x46, 'F'],
                        'Vertical': [0x56, 'V'],
                        'Hide': [0x48, 'H'],
                        'Spectate': [81, 'Q']
                    },
                    'autoZoom': false,
                    'showSkins': 'all',
                    'showNames': 'all',
                    'animationDelay': 120,
                    'showMass': false,
                    'skipDeathScreen': false,
                    'hideXP': false,
                    'hideChat': false,
                    'hideFood': false,
                    'hideBorder': false,
                    'lockedColor': '#FF0000',
                    'lockedPosition': '#FF0000',
                    'disableProfanityFilter': false,
                    'mouseArrow': false,
                    'deathCount': 0,
                    'lastMode': 'FFA',
                    'highQualitySkins': true,
                    'borderlessSkins': true,
                    'cameraDelay': 45,
                    'shortenMass': true,
                };
                for (var key in this.default) {
                    if (this.settings.hasOwnProperty(key) == false) {
                        this.settings[key] = this.default[key];
                        this.save();
                    }
                }
                for (var key in this.default.controls) {
                    if (this.settings.controls.hasOwnProperty(key) == false) {
                        this.settings.controls[key] = this.default.controls[key];
                        this.save();
                    }
                }
            }
            ready() {
                $('#nick').val(this.getItem('nick'));
                this.game.setSkin(this.getItem('skin'));
                this.game.setTheme(this.getItem('theme'), '#theme-' + this.getItem('theme'));
                this.game.setColor(this.getItem('color'), '#color-' + this.getItem('color'));
                $('#showNames').val(this.getItem('showNames'));
                $('#showSkins').val(this.getItem('showSkins'));
                $('#showMass').prop('checked', this.getItem('showMass'));
                $('#skipDeathScreen').prop('checked', this.getItem('skipDeathScreen'));
                $('#hideXP').prop('checked', this.getItem('hideXP'));
                $('#hideChat').prop('checked', this.getItem('hideChat'));
                $('#hideChat').prop('checked', this.getItem('hideFood'));
                $('#hideBorder').prop('checked', this.getItem('hideBorder'));
                $('#disableProfanityFilter').prop('checked', this.getItem('disableProfanityFilter'));
                $('#animationDelay').val(this.getItem('animationDelay'));
                $('#autoZoom').prop('checked', this.getItem('autoZoom'));
                $('#mouseArrow').prop('checked', this.getItem('mouseArrow'));
                $('#keyFeed').val(this.settings.controls.Feed[1]);
                $('#keySplit').val(this.settings.controls.Split[1]);
                $('#keyDouble').val(this.settings.controls.Double[1]);
                $('#keyTriple').val(this.settings.controls.Triple[1]);
                $('#key16x').val(this.settings.controls['16x'][1]);
                $('#keyFreeze').val(this.settings.controls.Freeze[1]);
                $('#keyVertical').val(this.settings.controls.Vertical[1]);
                $('#keyHide').val(this.settings.controls.Hide[1]);
            }
            getItem(key) {
                return this.settings[key];
            }
            setItem(key, value) {
                this.settings[key] = value;
                this.save();
                if (key == 'hideBorder') {
                    if (this.game.grid)
                        this.game.drawGrid();
                }
                if (key == 'showNames') {
                    for (var i = 0; i < this.game.cells.length; i++) {
                        if (this.game.cells[i].name && this.game.cells[i].name != '') {
                            this.game.cells[i].setName(this.game.cells[i].name, true);
                        }
                    }
                }
                if (key == 'showSkins') {
                    for (var i = 0; i < this.game.cells.length; i++) {
                        if (this.game.cells[i].skin && this.game.cells[i].skin != '') {
                            this.game.cells[i].setSkin(this.game.cells[i].skin, true);
                        }
                    }
                }
                if (key == 'showMass') {
                    for (var i = 0; i < this.game.cells.length; i++) {
                        const cell = this.game.cells[i];
                        if (!this.getItem('showMass') && cell.sizeText) {
                            cell.root.removeChild(cell.sizeText);
                            cell.sizeText.destroy();
                            delete cell.sizeText;
                        }
                    }
                }
                if (key == 'hideXP') {
                    if (value) {
                        $('#xpCenter').hide();
                    } else {
                        $('#xpCenter').show();
                    }
                }
            }
            resetControls() {
                this.settings.controls = this.default.controls;
                this.game.controls = this.settings.controls;
                this.save();
                this.ready();
            }
            save() {
                window.localStorage.setItem('settings', JSON.stringify(this.settings));
            }
        }
        ;class qI {
            constructor(qJ) {
                this.game = qJ;
                this.getCache();
                setInterval(this.refresh.bind(this), 1000);
            }
            getCache() {
                $.getJSON('php/Auth.php?cache', qK => {
                    if (qK.error) {
                        setTimeout(function() {
                            alert(qK.error);
                        }, 1000);
                    } else {
                        if (qK.uuid) {
                            this.response(qK);
                        }
                    }
                    $('#login').show();
                }
                );
            }
            auth(qL) {
                this.createWindow('php/Auth.php?provider=' + qL, 'Germs.io', 500, 700);
            }
            response(qM) {
                if (qM.error) {
                    return alert(qM.error);
                }
                this.game.network.sendUUID(qM.uuid);
                this.skins = qM['Skins'].indexOf(',') > -0x1 ? qM['Skins'].split(',') : qM['Skins'].length > 0 ? [qM['Skins']] : [];
                this.levels = qM['Shop']['Levels'];
                this['premium'] = qM['Shop']['Premium'];
                this.locked = qM['Shop']['Locked'];
                this.coinShop = qM['Shop'].Coins;
                this.bucksShop = qM['Shop'].Bucks;
                this['boostShop'] = qM['Shop']['Boosts'];
                this.uuid = qM.uuid;
                this['customSkin'] = parseInt(qM['Custom Skin']) == 1;
                this.lockedExpire = parseInt(qM['LockedExpire']);
                this.xp = parseInt(qM.XP);
                this.coins = parseInt(qM.Coins);
                this.bucks = parseInt(qM.Bucks);
                this['lastReward'] = parseInt(qM['LastReward']);
                this['original'] = $('#login').html();
                this.massBoost = qM['Mass Boost'];
                this.xpBoost = qM['XP Boost'];
                var qN = '<h4 id="loginName" class="nodrag">' + qM.Name + '</h4>';
                qN += '<div id="loginContainer"><img id="loginAvatar" class="nodrag" src="' + qM['Avatar'] + '">';
                qN += '<i id="loginLogout" class="fas fa-sign-out-alt" onclick="logout();"></i>';
                qN += '<i id="loginSettings" style="display: block !important;" class="fas fa-edit" onclick="custom();"></i>';
                qN += '<span id="loginCoins" class="nodrag"><i class="fas fa-coins"></i> <span id="coinAmount">' + this.numberWithCommas(this.coins) + `</span><a onclick="shopTab('#shopNavCoins', '#shopTabCoins'); openShop(); event.preventDefault();" href="#"><i class="fas fa-plus"></i></a></span>`;
                qN += '<span id="loginBucks" class="nodrag"><img src="res/gbux.png" class="nodrag"> <span id="bucksAmount">' + this.numberWithCommas(this.bucks) + `</span><a onclick="shopTab(null, '#shopTabBucks'); openShop(); event.preventDefault();" href="#"><i class="fas fa-plus"></i></a></span>`;
                qN += '<p id="loginShop" class="nodrag" onclick="openShop();"><img class="nodrag" src="res/shop.png?v=2"><br><span id="loginShopText">Shop</span></p>';
                qN += '<p id="loginGift" class="nodrag" onclick="redeemGift();"><img class="nodrag" src="res/gift.png?v=2"><br><span id="giftTimer">Free Gift!</span></p>';
                qN += `<p id="loginLeaderboard" class="nodrag" onclick="showRankings($('#rankingsSelect :selected').val());"><img class="nodrag" src="res/leaderboard.png?v=5"><span id="loginLeaderboardText">Rankings</span></p>`;
                qN += '<div id="loginStar"><h4 id="loginLevel" class="nodrag"></h4></div>';
                qN += '<div id="loginProgress" class="progress">\n                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%;"></div>\n                 </div>';
                qN += '<h4 id="loginEXP" class="nodrag"></h4>';
                qN += '<img id="loginXPBoost" src="res/xp boost.png" data-toggle="tooltip" data-placement="top" data-original-title="00:00:00 Remaining">';
                qN += '<img id="loginMassBoost" src="res/mass boost.png" data-toggle="tooltip" data-placement="top" data-original-title="00:00:00 Remaining">';
                qN += '<div id="loginNextLevel" class="loginReward nodrag"></div>';
                qN += '<div id="loginNextSkin" class="loginReward nodrag"></div>';
                qN += '</div>';
                qN += '<div id="loginCustom">';
                qN += '<i id="loginSettingsClose" class="fas fa-times" onclick="custom();"></i>';
                qN += '<div id="loginCustomLocked">';
                qN += '<h5 style="margin-top:5px;" class="nodrag">Redeem Code<h5>';
                qN += `<div class="input-group mb-3" style="margin-bottom: 5px !important;transform: scale(0.95);">\n                        <input id="loginLockedNameRedeem" type="text" class="form-control" placeholder="Redeem Code">\n                        <div class="input-group-append">\n                            <button class="btn btn-info" type="button" onclick="redeemCode($('#loginLockedNameRedeem').val())">Rede…`;
                qN += '</div>';
                qN += '<div id="loginCustomLockedName">';
                qN += '<h5 style="margin-top:5px;" class="nodrag">Locked Name<h5>';
                qN += '<p id="lockedNameExpire" class="nodrag"></p><p id="lockedNameColor" class="nodrag">Color:</p><div id="lockedNameColorPicker"></div>';
                qN += '<p id="lockedNamePosition" class="nodrag">Position:</p><select id="lockedNamePositionSelect"><option>Upper</option><option selected>Center</option><option>Lower</option></select>';
                qN += '</div>';
                qN += '</div>';
                if (this['customSkin']) {
                    $('#customSkin').show();
                }
                $('#shopName').text(qM.Name);
                $('#shopAvatar').prop('src', qM['Avatar']);
                $('#login').html(qN);
                this.updateSkins();
                this.updateVeteran();
                this.updatePremium();
                this.updateLocked();
                this.updateCoinShop();
                this.updateBucksShop();
                this.updateBoostShop();
                this.refresh();
                this.setXP(this.xp);
                this.setCoins(this.coins);
                this.setBucks(this.bucks);
                var qO = this;
                this.picker = new CP(document.getElementById('lockedNameColorPicker'));
                this.picker.set(this.game.settings.getItem('lockedColor'));
                this.picker.on('change', function(qP) {
                    changeSetting('lockedColor', '#' + qP);
                    this['source'].style['background'] = '#' + qP;
                });
                this.picker.on('stop', function(qQ) {
                    qO.game.network.sendLocked();
                });
                this.picker.on('exit', function(qR) {
                    qO.game.network.sendLocked();
                });
                $('#lockedNamePositionSelect').val(this.game.settings.getItem('lockedPosition'));
                document.getElementById('lockedNamePositionSelect')['onchange'] = function() {
                    changeSetting('lockedPosition', this['options'][this['selectedIndex']].innerHTML);
                    qO.game.network.sendLocked();
                }
                ;
            }
            removeDuplicates(qS) {
                var qT = {};
                var qU = [];
                for (var qV = 0; qV < qS.length; qV++) {
                    qT[qS[qV]] = true;
                }
                for (var qW in qT) {
                    qU.push(qW);
                }
                return qU;
            }
            updateCoinShop() {
                var qX = '<ul>';
                var qY = this.coinShop.sort( (qZ, r0) => {
                    return qZ.Value - r0.Value;
                }
                );
                for (var r1 = 0; r1 < qY.length; r1++) {
                    var r2 = qY[r1];
                    if (r2.Price > 0) {
                        qX += '<li><h3><i class="fas fa-coins"></i> ' + this.numberWithCommas(r2.Value) + ' Coins</h3>';
                        qX += '<button onclick="buyCoins(this, ' + r2.Value + ')" class="btn btn-sm btn-primary">' + r2.Price + ' <img src="res/gbux.png" class="nodrag"></button>';
                        qX += '</li>';
                    }
                }
                qX += '</ul>';
                $('#shopTabCoins').html(qX);
            }
            updateBoostShop() {
                var r3 = '<ul>';
                var r4 = '';
                var r5 = '';
                for (var r6 = 0; r6 < this['boostShop'].length; r6++) {
                    var r7 = this['boostShop'][r6];
                    var r8 = r7.Duration > 1 ? r7.Duration + ' hours' : r7.Duration + ' hour';
                    if (r7.Type == 'mass') {
                        r4 += '<li><img class="nodrag" src="res/' + r7.Type + ' boost.png"><p>' + r7.Title + '<br>(' + r8 + ')</p>';
                        r4 += `<button onclick="buyBoost(this, '` + r7.Type + "', " + r7.Price + ')" class="btn btn-sm btn-primary boost-mass">' + r7.Price + ' <img src="res/gbux.png" class="nodrag"></button>';
                        r4 += '</li>';
                    }
                    if (r7.Type == 'xp') {
                        r4 += '<li><img class="nodrag" src="res/' + r7.Type + ' boost.png"><p>' + r7.Title + '<br>(' + r8 + ')</p>';
                        r4 += `<button onclick="buyBoost(this, '` + r7.Type + "', " + r7.Price + ')" class="btn btn-sm btn-primary boost-xp">' + r7.Price + ' <img src="res/gbux.png" class="nodrag"></button>';
                        r4 += '</li>';
                    }
                }
                r3 += r4;
                r3 += r5;
                r3 += '</ul>';
                $('#shopTabBoosts').html(r3);
            }
            updateBucksShop() {
                var r9 = '<ul>';
                var ra = this.bucksShop.sort( (rb, rc) => {
                    return rb.Value - rc.Value;
                }
                );
                for (var rd = 0; rd < ra.length; rd++) {
                    var re = ra[rd];
                    if (re.Price > 0) {
                        r9 += '<li><h3><img src="res/gbux.png" class="nodrag"> ' + this.numberWithCommas(re.Value) + ' G-Bux</h3>';
                        r9 += '<button disabled onclick="buyBucks(this, ' + re.Value + ')" class="btn btn-sm btn-success">$' + re.Price + '</button>';
                        r9 += '</li>';
                    }
                }
                r9 += '</ul>';
                $('#shopTabBucks').html(r9);
            }
            updatePremium() {
                var rf = '<ul>';
                var rg = this['premium'].sort( (rh, ri) => {
                    if (rh.Bucks > 0 && ri.Bucks > 0) {
                        return rh.Bucks - ri.Bucks;
                    }
                    if (rh.Bucks > 0 && ri.Coins > 0) {
                        return 1;
                    }
                    if (ri.Bucks > 0 && rh.Coins > 0) {
                        return -1;
                    }
                    return rh.Coins - ri.Coins;
                }
                ).reverse();
                for (var rj = 0; rj < rg.length; rj++) {
                    var rk = rg[rj];
                    if (rk.Skin != '') {
                        var rl = rk.Skin.split('premium/')[1].capitalize();
                        rf += '<li><img class="nodrag" data-src="res/skins/' + rk.Skin + '.png"><p>' + rl + '</p>';
                        if (this.skins.indexOf(rk.Skin) > -1) {
                            rf += `<input onclick="setSkin('` + rk.Skin + `')" type="button" class="btn btn-sm btn-success" value="Use This Skin">`;
                        } else {
                            if (rk.Coins > 0) {
                                rf += `<button onclick="buySkin(this, '` + rk.Skin + `')" class="btn btn-sm btn-primary">` + rk.Coins + ' <i class="fas fa-coins"></i></button>';
                            }
                            if (rk.Bucks > 0) {
                                rf += `<button onclick="buySkin(this, '` + rk.Skin + `')" class="btn btn-sm btn-primary">` + rk.Bucks + ' <img src="res/gbux.png" class="nodrag"></button>';
                            }
                        }
                        rf += '</li>';
                    }
                }
                rf += '</ul>';
                $('#shopTabPremium').html(rf);
                $('#shopTabPremium > ul').scroll(function() {});
            }
            updateLocked() {
                var rm = '<h3>Locked Name <i class="fas fa-lock"></i></h3><h5>Change your name color and stand out!</h5><ul>';
                var rn = this.locked.sort( (ro, rp) => {
                    return ro.Days - rp.Days;
                }
                );
                for (var rq = 0; rq < rn.length; rq++) {
                    var rr = rn[rq];
                    var rs = ~~(rr.Days / 30);
                    rm += '<li><p>Locked Name<br>(' + rs + ' month' + (rs > 1 ? 's' : '') + ')</p>';
                    rm += `<button onclick="buyLocked(this, '` + rr.Days + "', " + rr.Coins + ', null)" class="btn btn-sm btn-primary">' + this.numberWithCommas(rr.Coins) + ' <i class="fas fa-coins"></i></button>';
                    rm += `<button onclick="buyLocked(this, '` + rr.Days + "', null, " + rr.Bucks + ')" class="btn btn-sm btn-primary">' + this.numberWithCommas(rr.Bucks) + ' <img src="res/gbux.png" class="nodrag"></button>';
                    rm += '</li>';
                }
                rm += '</ul>';
                $('#shopTabLocked').html(rm);
            }
            updateLimited() {
                var rt = '<h3>Limited Time Skins <i class="far fa-clock"></i></h3><h5>Get them quick before they are gone!</h5><ul>';
                var ru = this.limited.sort( (rv, rw) => {
                    if (rv.Bucks > 0 && rw.Bucks > 0) {
                        return rv.Bucks - rw.Bucks;
                    }
                    if (rv.Bucks > 0 && rw.Coins > 0) {
                        return 1;
                    }
                    if (rw.Bucks > 0 && rv.Coins > 0) {
                        return -1;
                    }
                    return rv.Coins - rw.Coins;
                }
                );
                for (var rx = 0; rx < ru.length; rx++) {
                    var ry = ru[rx];
                    if (ry.Skin != '') {
                        var rz = ry.Skin.split('limited/')[1].capitalize();
                        rt += '<li><img class="nodrag" data-src="res/skins/' + ry.Skin + '.png"><p>' + rz + '</p>';
                        if (this.skins.indexOf(ry.Skin) > -1) {
                            rt += `<input onclick="setSkin('` + ry.Skin + `')" type="button" class="btn btn-sm btn-success" value="Use This Skin">`;
                        } else {
                            if (ry.Coins > 0) {
                                rt += `<button onclick="buySkin(this, '` + ry.Skin + `')" class="btn btn-sm btn-primary">` + ry.Coins + ' <i class="fas fa-coins"></i></button>';
                            }
                            if (ry.Bucks > 0) {
                                rt += `<button onclick="buySkin(this, '` + ry.Skin + `')" class="btn btn-sm btn-primary">` + ry.Bucks + ' <img src="res/gbux.png" class="nodrag"></button>';
                            }
                        }
                        rt += '</li>';
                    }
                }
                rt += '</ul>';
                $('#shopTabLimited').html(rt);
            }
            updateVeteran() {
                var rA = '<ul>';
                for (var rB = 0; rB < this.levels.length; rB++) {
                    var rC = this.levels[rB];
                    if (rC.Skin != '') {
                        rA += '<li><img class="nodrag" data-src="res/skins/' + rC.Skin + '.png">';
                        if (this.xp >= rC.XP) {
                            rA += `<input onclick="setSkin('` + rC.Skin + `')" type="button" class="btn btn-sm btn-success" value="Use this skin">`;
                        } else {
                            rA += '<p class="nodrag">Level ' + rC.Level + ' <i class="fas fa-lock"></i></p>';
                        }
                        rA += '</li>';
                    }
                }
                rA += '</ul>';
                $('#shopTabVeteran').html(rA);
            }
            updateSkins() {
                $('#paidSkinList').html(`<li>\n                                    <img onclick="setSkin('None');" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">\n                                    <p>None</p>\n                                </li>`);
                this.skins = this.removeDuplicates(this.skins);
                if (this.skins.length > 0) {
                    $('#paidSkinList').show();
                    $('#paidSkinBadge').show();
                    $('#skinsLoginMessage').hide();
                    for (var rD = this.skins.length - 1; rD >= 0; rD--) {
                        var rE = this.skins[rD];
                        if (rE.trim() != '') {
                            var rF = rE.indexOf('/') > -1 ? this.toTitleCase(rE.split('/')[1]) : rE;
                            $('#paidSkinList').append(`<li id='skinSkin'><img onclick="setSkin('` + rE + `');" loading="lazy" width='85' height='85' data-src="res/skins/` + rE + '.png"> <p>' + rF.capitalize() + '</p></li>');
                        }
                    }
                    this.game.network.send(new packet.Login(this.uuid));
                } else {
                    $('#paidSkinBadge').hide();
                    $('#paidSkinList').hide();
                    $('#skinsLoginMessage').show();
                }
            }
            toTitleCase(rG) {
                return rG.replace(/\w\S*/g, function(rH) {
                    return rH.charAt(0).toUpperCase() + rH.substr(1).toLowerCase();
                });
            }
            custom() {
                $('#loginContainer').toggle();
                $('#loginCustom').toggle();
            }
            setXP(val) {
                if (!this.uuid)
                    return;
                this.xp = val;
                var rJ = this.levels.filter(rK => rK.XP <= this.xp);
                var rL = rJ[rJ.length - 1];
                var rM = this.levels.filter(rN => rN.XP > this.xp)[0];
                if (!this.level || this.level && this.level.Level < rL.Level) {
                    var rO = '<p>Level ' + rM.Level + '</p>\n                        <span><i class="fas fa-coins"></i> ' + rM.Coins + ' <br>\n                        <img src="res/gbux.png" class="nodrag"> ' + rM.Bucks + '</span>';
                    if (rL.Level == 200) {
                        $('#loginNextSkin').html();
                        $('#loginNextLevel').html('');
                    } else {
                        $('#loginNextLevel').html(rO);
                        if (rL.Level < 100) {
                            var rP = this.levels.find(rQ => rQ.Level == this.round(rM.Level));
                            if (rP.Skin != '') {
                                var rO = '<p>Level ' + rP.Level + '</p>\n                        <img src="res/skins/' + rP.Skin + '.png" class="nodrag">';
                                $('#loginNextSkin').html(rO);
                            } else {
                                var rO = '<p>Level ' + rP.Level + '</p>\n                        <span><i class="fas fa-coins"></i> ' + rP.Coins + ' <br>\n                        <img src="res/gbux.png" class="nodrag"> ' + rP.Bucks + '</span>';
                                $('#loginNextSkin').html(rO);
                            }
                        } else {
                            var rO = '<p>Max Veteran</p>\n                    <b>Keep leveling to gain coins!</b>';
                            $('#loginNextSkin').html(rO);
                        }
                    }
                }
                if (this.level && this.level.Level < rL.Level) {
                    this.setCoins(this.coins + parseInt(rL.Coins));
                    this.setBucks(this.bucks + parseInt(rL.Bucks));
                    if (rL.Skin != '') {
                        this.skins.push(rL.Skin);
                        this.updateSkins();
                        this.updateVeteran();
                    }
                }
                this.level = rL;
                if (rL.Level == 200) {
                    $('#loginLevel').text(rL.Level);
                    $('#loginEXP').text('Max Level!');
                    $('#loginProgress > .progress-bar').css('width', '100%');
                } else {
                    if (this.game.settings.getItem('hideXP') == false) {
                        $('#xpCenter').show();
                    }
                    $('#xpLevel').text('Level ' + rL.Level);
                    $('#xpEXP').text(this.xp - rL.XP + ' / ' + (rM.XP - rL.XP) + ' XP');
                    $('#xpProgressContainer > .progress-bar').css('width', (this.xp - rL.XP) / (rM.XP - rL.XP) * 100 + '\x25');
                    $('#loginLevel').text(rL.Level);
                    $('#loginEXP').text(this.xp - rL.XP + '/' + (rM.XP - rL.XP) + ' XP');
                    $('#loginProgress > .progress-bar').css('width', (this.xp - rL.XP) / (rM.XP - rL.XP) * 100 + '\x25');
                }
            }
            round(rU) {
                return Math.round(rU / 5) * 5;
            }
            numberWithCommas(rV) {
                return rV.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            setCoins(rW) {
                this.coins = rW;
                $('#coinAmount').text(this.numberWithCommas(this.coins));
                $('#shopCoinAmount').text(this.numberWithCommas(this.coins));
            }
            setBucks(rX) {
                this.bucks = rX;
                $('#bucksAmount').text(this.numberWithCommas(this.bucks));
                $('#shopBucksAmount').text(this.numberWithCommas(this.bucks));
            }
            redeemCode(rY) {
                if (this.redeemingCode) {
                    return;
                }
                this.redeemingCode = true;
                $('#loginLockedNameRedeem').val('');
                $.post('php/Redeem.php', {
                    'code': rY,
                    'uuid': this.uuid
                }, rZ => {
                    this.redeemingCode = false;
                    if (rZ.error) {
                        alert(rZ.error);
                    } else {
                        var s0 = 'Congratulations! You redeemed: \n';
                        if (rZ.coins > 0) {
                            s0 += rZ.coins + ' Coins! ';
                            this.setCoins(this.coins + rZ.coins);
                        }
                        if (rZ.bucks > 0) {
                            s0 += rZ.bucks + ' G-Bux! ';
                            this.setBucks(this.bucks + rZ.bucks);
                        }
                        if (rZ.locked > 0) {
                            var s1 = new Date(rZ.locked * 1000);
                            s0 += '\n' + 'Locked Name until ' + s1.toLocaleString() + '!';
                            this.lockedExpire = rZ.locked;
                        }
                        this.game.network.sendUUID(this.uuid);
                        alert(s0);
                    }
                }
                );
            }
            buyBucks(s2, s3) {
                if (this.buyingBucks) {
                    return;
                }
                this.buyingBucks = true;
                var s4 = $(s2).html();
                $(s2).text('Purchasing...');
                $.post('php/Payment.php', {
                    'value': s3,
                    'uuid': this.uuid
                }, s5 => {
                    this.buyingBucks = false;
                    if (s5.error) {
                        alert(s5.error);
                    } else {
                        var s6 = false;
                        XPayStationWidget.init({
                            'access_token': s5.token
                        });
                        XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_DONE, (s7, s8) => {
                            if (s6 == false) {
                                s6 = true;
                                this.setBucks(this.bucks + s3);
                            }
                            XPayStationWidget.off();
                        }
                        );
                        XPayStationWidget.open();
                    }
                    $(s2).html(s4);
                }
                );
            }
            buyLocked(s9, sa, sb, sc) {
                if (this.buyingLocked) {
                    return;
                }
                this.buyingLocked = true;
                var sd = $(s9).html();
                var se = {
                    'locked': sa,
                    'uuid': this.uuid
                };
                if (sb != null) {
                    se.lockedCoins = sb;
                }
                if (sc != null) {
                    se.lockedBucks = sc;
                }
                $(s9).text('Purchasing...');
                $.post('php/Purchase.php', se, sf => {
                    this.buyingLocked = false;
                    if (sf.error) {
                        if (sf.error == 'Not enough G-Bux!') {
                            shopTab(null, '#shopTabBucks');
                        }
                        if (sf.error == 'Not enough Coins!') {
                            shopTab(null, '#shopTabCoins');
                        }
                        alert(sf.error);
                    } else {
                        if (sf.coins) {
                            this.setCoins(this.coins - sf.coins);
                        }
                        if (sf.bucks) {
                            this.setBucks(this.bucks - sf.bucks);
                        }
                        this.lockedExpire = sf.locked;
                        this.game.network.sendUUID(this.uuid);
                        hideShop();
                        $('#loginContainer').hide();
                        $('#loginCustom').show();
                        this.refresh();
                    }
                    $(s9).html(sd);
                }
                );
            }
            buySkin(sg, sh) {
                if (this.buyingSkin) {
                    return;
                }
                this.buyingSkin = true;
                var si = $(sg).html();
                $(sg).text('Purchasing...');
                $.post('php/Purchase.php', {
                    'skin': sh,
                    'uuid': this.uuid
                }, sj => {
                    this.buyingSkin = false;
                    if (sj.error) {
                        if (sj.error == 'Not enough G-Bux!') {
                            shopTab(null, '#shopTabBucks');
                        }
                        alert(sj.error);
                        $(sg).html(si);
                    } else {
                        this.setCoins(this.coins - sj.coins);
                        this.setBucks(this.bucks - sj.bucks);
                        this.skins.push(sh);
                        $(sg).replaceWith(`<input onclick="setSkin('` + sh + `')" type="button" class="btn btn-sm btn-success" value="Use This Skin">`);
                        this.game.network.sendUUID(this.uuid);
                        this.updateSkins();
                    }
                }
                );
            }
            buyCoins(sk, sl) {
                if (this.buyingCoins) {
                    return;
                }
                this.buyingCoins = true;
                var sm = $(sk).html();
                $(sk).text('Purchasing...');
                $.post('php/Purchase.php', {
                    'coins': sl,
                    'uuid': this.uuid
                }, sn => {
                    this.buyingCoins = false;
                    if (sn.error) {
                        if (sn.error == 'Not enough G-Bux!') {
                            shopTab(null, '#shopTabBucks');
                        }
                        alert(sn.error);
                    } else {
                        this.setCoins(this.coins + sn.coins);
                        this.setBucks(this.bucks - sn.bucks);
                    }
                    $(sk).html(sm);
                }
                );
            }
            buyBoost(so, sp, sq) {
                if (this.buyingBoost) {
                    return;
                }
                this.buyingBoost = true;
                var sr = $(so).html();
                $(so).text('Purchasing...');
                $.post('php/Purchase.php', {
                    'boost': sp,
                    'price': sq,
                    'uuid': this.uuid
                }, ss => {
                    this.buyingBoost = false;
                    if (ss.error) {
                        if (ss.error == 'Not enough G-Bux!') {
                            shopTab(null, '#shopTabBucks');
                        }
                        alert(ss.error);
                    } else {
                        if (ss['Mass Boost']) {
                            this.massBoost = ss['Mass Boost'];
                        }
                        if (ss['XP Boost']) {
                            this.xpBoost = ss['XP Boost'];
                        }
                        this.setBucks(this.bucks - ss.bucks);
                        this.refresh();
                        this.game.network.sendUUID(this.uuid);
                    }
                    $(so).html(sr);
                }
                );
            }
            redeemGift() {
                var st = 3600;
                var su = Date.now() / 1000;
                if (su - this['lastReward'] < st) {
                    return false;
                }
                $('#loginGift').addClass('disabled');
                $('#giftTimer').text('...');
                $.post('php/Gift.php', {
                    '\x72\x65\x77\x61\x72\x64': true
                }, sv => {
                    if (sv.error) {
                        return alert(sv.error);
                    }
                    this.setCoins(this.coins + sv.coins);
                    this.setBucks(this.bucks + sv.bucks);
                    this['lastReward'] = sv['\x74\x69\x6d\x65'];
                    this.refresh();
                }
                );
            }
            refresh() {
                var sw = Date.now() / 1000;
                if ($('#menu').is(':visible')) {
                    var sx = 3600 * 24;
                    if (sw - this['lastReward'] >= sx) {
                        $('#loginGift').removeClass('disabled');
                        $('#giftTimer').text('Free Gift!');
                    } else {
                        $('#loginGift').addClass('disabled');
                        var sy = new Date(this['lastReward'] * 1000);
                        sy.addHours(24);
                        $('#giftTimer').text(this.timeUntil(sy));
                    }
                    if (this.xpBoost - sw > 0) {
                        var sz = new Date(this.xpBoost * 1000);
                        $('#loginXPBoost').show();
                        $('#loginXPBoost').attr('data-original-title', this.timeUntil(sz) + ' Remaining').tooltip();
                        $('.boost-xp').each(function() {
                            $(this).attr('disabled', true);
                        });
                    } else {
                        $('.boost-xp').each(function() {
                            $(this).attr('disabled', false);
                        });
                        $('#loginXPBoost').hide();
                    }
                    if (this.massBoost - sw > 0) {
                        var sA = new Date(this.massBoost * 1000);
                        $('#loginMassBoost').show();
                        $('#loginMassBoost').attr('data-original-title', this.timeUntil(sA) + ' Remaining').tooltip();
                        $('#loginMassBoost').tooltip();
                        $('.boost-mass').each(function() {
                            $(this).attr('disabled', true);
                        });
                    } else {
                        $('.boost-mass').each(function() {
                            $(this).attr('disabled', false);
                        });
                        $('#loginMassBoost').hide();
                    }
                    if (this.lockedExpire - sw > 0) {
                        var sB = new Date(this.lockedExpire * 1000);
                        $('#lockedNameExpire').text('Expires on ' + sB.toLocaleString());
                        $('#loginCustomLockedName').show();
                    } else {
                        $('#loginCustomLockedName').hide();
                    }
                }
            }
            timeUntil(sC) {
                function sD(sE) {
                    return (sE < 0xa ? '0' : '') + sE;
                }
                var sF = sC - new Date();
                var sG = sF < 0 ? '-' : '';
                sF = Math.abs(sF);
                var sH = sF / 3600000 | 0;
                var sI = sF % 3600000 / 60000 | 0;
                var sJ = Math.round(sF % 60000 / 1000);
                return sG + sD(sH) + ':' + sD(sI) + ':' + sD(sJ);
            }
            logout() {
                $['get']('php/Auth.php?logout', sK => {
                    if (sK.error) {
                        return alert(sK.error);
                    }
                    $('#login').html(this['original']);
                    $('#skinsLoginMessage').show();
                    $('#customSkin').hide();
                    this.uuid = 'logout';
                    this.game.network.sendUUID('logout');
                    delete this.level;
                    this.skins = [];
                    this.updateSkins();
                }
                );
            }
            createWindow(sL, sM, sN, sO) {
                var sP = window.screenLeft != undefined ? window.screenLeft : window.screenX;
                var sQ = window.screenTop != undefined ? window.screenTop : window.screenY;
                var sR = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                var sS = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                var sT = sR / 2 - sN / 2 + sP;
                var sU = sS / 2 - sO / 2 + sQ;
                var sV = window.open(sL, sM, 'scrollbars=yes, width=' + sN + ', height=' + sO + ', top=' + sU + ', left=' + sT);
                if (sV && sV.focus) {
                    sV.focus();
                }
                return sV;
            }
        }
        ;class sW {
            constructor() {
                this.viewZoom = 0;
                this.newViewZoom = 0;
                this.zoom = 0.25;
                this.width = 800;
                this.height = 600;
                this.updateTime = performance.now();
                this.specZoom = 0;
                this.setupLimit = 0;
                this.lastTime = performance.now(),
                this.delta = 1;
                this.nodeX = 0;
                this.nodeY = 0;
                this.tick = 0;
                this.splitTick = 0;
                this.fps = 60;
                this.setupLimit = 0;
                this.pID = -1;
                this.startTime = performance.now();
                this.lastEject = performance.now();
                this.ejectKey = false;
                this.hideUI = false;
                this.freeze = false;
                // Repurposed to freeze mouse, not cell
                this.vertical = false;
                this.chatHidden = false;
                this.freeSpec = false;
                this.mouse = {
                    'x': 0,
                    'y': 0
                };
                this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                this.nodes = {};
                this.cells = [];
                this.playerCells = [];
                this.myCells = [];
                this.leaderboard = [];
                this.border = [-1000, -1000, 1000, 1000];
                this.drawLines = [];
                this.skins = {};
                this.names = {};
                this.masses = {};
                this.blocked = [];
                this.sizes = {};
                this.settings = new qz(this);
                this.camera = new mu(this);
                this.network = new or(this);
                this.ui = new lC(this);
                this.login = new qI(this);
                this.chat = new l7(this);
                this.pool = new nn(this);
                this.foodEaten = 0;
                this.highestMass = 0;
                this.timeAlive = 0;
                this.leaderboardTime = 0;
                this.cellsEaten = 0;
                this.topPosition = 999;
                this.onLeaderboard = false;
                this.controls = this.settings.getItem('controls');
                this.theme = 2;
                this.ejectSpeed = 999;
                this.maxCacheTime = 10000;
            }
            async start() {

                await PIXI.Assets.init({
                    basePath: 'https://germs.io/res/assets/',

                    manifest: {
                        bundles: [{
                            name: 'ballgame',

                            assets: [{
                                alias: 'hex',
                                src: 'hex.png'
                            }, {
                                alias: 'grid',
                                src: 'grid.png'
                            }, {
                                alias: 'arrow',
                                src: 'arrow.png'
                            }, {
                                alias: 'sheet',
                                src: 'texture.json'
                            }]
                        }]
                    }
                });

                this.canvas = document.getElementById('gameCanvas');

                this.renderer = await PIXI.autoDetectRenderer({
                    preference: 'webgpu',

                    webgpu: {
                        canvas: this.canvas,
                        antialias: true,
                        powerPreference: 'high-performance',
                        background: 0x333439,
                    },

                    webgl: {
                        canvas: this.canvas,
                        antialias: true,
                        powerPreference: 'high-performance',
                        background: 0x333439,
                    },
                });

                this.stage = new PIXI.Container();
                this.stage.eventMode = 'none';

                this.bgContainer = new PIXI.Container();
                this.stage.addChild(this.bgContainer);

                this.cellContainer = new PIXI.Container();
                this.cellContainer.sortableChildren = true;
                this.stage.addChild(this.cellContainer);

                console.log('%cGerms.io %c(' + (this.renderer.type ? "WebGL" : "Canvas") + ')%c\n~ Germsfox 1.1 ~', 'font-size:70px;padding:5px;font-family:Ubuntu,Roboto,Segoe UI;font-weight:700;color:white;', 'font-size:20px;padding-left:3px;padding-right:15px;font-family:Ubuntu,Roboto,Segoe UI;font-weight:700;color:rgb(100,100,100);', 'font-size:20px;padding-left:70px;padding-right:15px;font-family:Ubuntu,Roboto,Segoe UI;font-weight:500;color:#00ff00;');

                $(window).trigger('resize');

                await PIXI.Assets.loadBundle('ballgame');

                this.spriteSheet = PIXI.Assets.get('sheet');

                this.gridTexture = PIXI.Assets.get('grid');
                this.hexTexture = PIXI.Assets.get('hex');
                this.arrowTexture = PIXI.Assets.get('arrow');

                this.cellTexture = this.spriteSheet.textures.cell;
                this.virusTexture = this.spriteSheet.textures.virus;
                this.foodTextures = [this.spriteSheet.textures.food1, this.spriteSheet.textures.food2, this.spriteSheet.textures.food3];

                this.cellSize = this.cellTexture.frame.width / 2;
                this.virusSize = this.virusTexture.frame.width / 2;
                this.foodSize = this.foodTextures[0].frame.width / 2;

                // Debug stats
                this.destroyedCount = 0;
                this.createdCount = 0;

                this.pool.populate( () => {

                    let region = this.settings.getItem('region');

                    if (window.location.hash.includes('#NA')) {
                        region = 'NA';
                    }

                    if (window.location.hash.includes('#EU')) {
                        region = 'EU';
                    }

                    if (window.location.hash.includes('#AS')) {
                        region = 'AS';
                    }

                    if (window.location.hash.includes('#TEST')) {
                        region = 'Test';
                    }

                    this.network.getServers(region);

                    $('#loader').fadeOut();

                    setInterval(this.counter.bind(this), 1000);
                    setInterval(this.sendMouse.bind(this), 40);
                    setInterval(this.refreshMenuAds.bind(this), 120 * 1000);
                    setInterval(this.cleanUpCache.bind(this), 1000);

                    this.ticker = new PIXI.Ticker();

                    this.ticker.add(this.render.bind(this));

                    this.ticker.start();
                }
                );

            }
            counter() {
                if (this.onLeaderboard) {
                    this.leaderboardTime++;
                }
                if (this.playerCells.length > 0) {
                    this.timeAlive++;
                }
            }
            getSkinURL(sY) {
                return sY.includes('i.imgur.com/') ? sY : sY.includes('.png') ? 'res/skins/' + sY : 'res/skins/' + sY + '.png';
            }
            getRandomFoodTexture() {
                return this.foodTextures[Math.floor(Math.random() * this.foodTextures.length)];
            }
            calcMouse() {
                let newX = (this.rawMouseX - this.width / 2) / this.viewZoom + this.camera.x;
                let newY = (this.rawMouseY - this.height / 2) / this.viewZoom + this.camera.y;
            
                if (!this.vertical) {
                    delete this.linesplitCell;
                    delete this.linesplitAxis;
                    delete this.linesplitOrigin;
                } else {
                    if (!this.linesplitCell || this.linesplitCell.destroyed) {
                        //console.debug("Cell does not exist, finding new one...")
                        this.linesplitCell = this.linesplitAxis !== undefined
                            ? this.getCellOnAxis(newX, newY)
                            : this.getLinesplitCell(newX, newY);
            
                        if (this.linesplitCell && this.linesplitAxis === undefined) {
                            const dx = newX - this.linesplitCell.nx;
                            const dy = newY - this.linesplitCell.ny;
                            this.linesplitAxis = ((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 4) + 4) % 4;
                            this.linesplitOrigin = { x: this.linesplitCell.nx, y: this.linesplitCell.ny };
                        }
                    }
                    const cell = this.linesplitCell;
                    if (cell) {
                        const dx = newX - this.linesplitOrigin.x;
                        const dy = newY - this.linesplitOrigin.y;
                        switch (this.linesplitAxis) {
                            case 0: newY = this.linesplitOrigin.y; break; // E/W
                            case 2: newX = this.linesplitOrigin.x; break; // N/S
                                
                            case 1: { // SE/NW
                                const d = (dx + dy) / 2; 
                                newX = this.linesplitOrigin.x + d; 
                                newY = this.linesplitOrigin.y + d; 
                                break; 
                            } 
                            case 3: { // SW/NE
                                const d = (dx - dy) / 2;
                                newX = this.linesplitOrigin.x + d;
                                newY = this.linesplitOrigin.y - d;
                                break;
                            }
                        }
                    }
                }
                this.mouse = { x: newX, y: newY, realX: newX, realY: newY };
            }
            getCellOnAxis(mouseX, mouseY) {
                if (!this.linesplitOrigin) return null;
                const { x: ox, y: oy } = this.linesplitOrigin;
                let bestCell = null;
                let bestDist = 99999;
            
                for (const id of this.myCells) {
                    const cell = this.playerCells.find(c => c.id === id);
                    if (!cell || cell.destroyed) continue;
                    const dx = cell.nx - ox, dy = cell.ny - oy;
                    let onAxis = false;
                    switch (this.linesplitAxis) {
                        case 0: onAxis = Math.abs(dy) === 0; break;
                        case 2: onAxis = Math.abs(dx) === 0; break;
                            // Diagonals are inherently inconsistent unfortunately
                        case 1: onAxis = Math.abs(dx - dy) < 5; break;
                        case 3: onAxis = Math.abs(dx + dy) < 5; break;
                    }
                    if (!onAxis) continue;
                    const dist = Math.sqrt((cell.nx - mouseX) ** 2 + (cell.ny - mouseY) ** 2);
                    if (dist < bestDist) { 
                        bestDist = dist;
                        bestCell = cell;
                    }
                }

                if (bestCell === null)
                    delete this.linesplitAxis;
                return bestCell;
            }
            getLinesplitCell(mouseX, mouseY) {
                //console.debug("Looking for new cell since you haven't set an axis yet");
                const largestSize = Math.max(...this.playerCells.map(c => c.nSize));
                let bestCell = null;
                let bestScore = 99999;
                if (this.myCells.length === 0) {
                    this.vertical = false;
                    delete this.linesplitCell;
                    delete this.linesplitAxis;
                    delete this.linesplitOrigin;
                    return null;
                }
            
                for (const id of this.myCells) {
                    const cell = this.playerCells.find(c => c.id === id);
                    if (!cell || cell.destroyed) continue;
                    const dx = mouseX - cell.nx, dy = mouseY - cell.ny;
                    const sizeFactor = largestSize / cell.nSize;
                    const score = Math.sqrt(dx * dx + dy * dy) * (sizeFactor ** 2);
                    if (score < bestScore) { 
                        bestScore = score;
                        bestCell = cell;
                    }
                }
                return bestCell;
            }
            sort() {
                this.cellContainer.children.sort( (t3, t4) => {
                    return t3.zIndex - t4.zIndex;
                }
                );
            }
            sendMouse() {
                if (this.freeze)
                    return;
                this.calcMouse();
                if (this.mouse && (this.playerCells.length > 0 || this.freeSpec) && this.network.open) {
                    if (!this.lastMouseSent || Math.abs(this.mouse.x - this.lastMouseSent.x) > 1 || Math.abs(this.mouse.y - this.lastMouseSent.y) > 1) {
                        this.network.sendMouse(this.mouse);
                        this.lastMouseSent = {
                            'x': this.mouse.x,
                            'y': this.mouse.y
                        };
                    }
                }
            }
            render(t5) {
                this.updateTime = performance.now();
                this.delta = Math.min(1, Math.max(0, t5.deltaTime));
                this.lastTime = this.updateTime;
                this.fps = this.ticker.FPS;
                if (this.playerCells.length > 0) {
                    if (this.ejectKey) {
                        this.network.send(new packet.Eject());
                        this.lastEject = this.updateTime;
                    }
                    let playerCellsAlive = 0;
                    let totalSize = 0;
                    for (let i = 0; i < this.playerCells.length; i++) {
                        if (this.playerCells[i].destroyed)
                            continue;
                        playerCellsAlive++;
                        totalSize += this.playerCells[i].nSize;
                    }
                    let t6 = 0;
                    let t7 = 0;
                    let t8 = 0;

                    for (let i = 0; i < this.playerCells.length; i++) {
                        if (this.playerCells[i].destroyed)
                            continue;
                        this.playerCells[i].updatePos();
                        const weight = this.playerCells[i].nSize / totalSize;
                        t6 += this.playerCells[i].x * weight;
                        t7 += this.playerCells[i].y * weight;
                        t8 = Math.max(t8, this.playerCells[i].size);
                    }
                    if (this.settings.getItem('mouseArrow') == true || this.isMobile) {
                        let ta = 0;
                        if (!this.arrowContainer) {
                            this.arrowContainer = new PIXI.Container();
                            this.arrowSprite = new PIXI.Sprite(this.arrowTexture);
                            this.arrowSprite.anchor.x = 0.5;
                            this.arrowSprite.anchor.y = 0.5;
                            this.arrowContainer.zIndex = 99999999;
                            this.arrowContainer.addChild(this.arrowSprite);
                            this.cellContainer.addChild(this.arrowContainer);
                        }
                        if (this.playerCells.length == 1) {
                            ta = this.playerCells[0].size * 1.5;
                        } else {
                            for (var t9 = 0; t9 < this.playerCells.length; t9++) {
                                ta = Math.max(ta, Math.abs(this.playerCells[t9].x - t6) + this.playerCells[t9].size * 1.5);
                                ta = Math.max(ta, Math.abs(this.playerCells[t9].y - t7) + this.playerCells[t9].size * 1.5);
                            }
                        }
                        if (!this.vertical) {
                            let tc = t6 - this.mouse.x;
                            let td = t7 - this.mouse.y;
                            let h = Math.sqrt(tc * tc + td * td);
                            ta = Math.min(ta, h);
                        }
                        this.arrowSprite.scale.x = 0x28 / this.arrowTexture.width / this.viewZoom;
                        this.arrowSprite.scale.y = this.arrowSprite.scale.x;
                        this.arrowSprite.tint = this.playerCells[0].color;
                        this.arrowContainer.x = t6;
                        this.arrowContainer.y = t7;
                        this.arrowContainer.pivot.x = -ta;
                        this.arrowContainer.rotation = Math.atan2(this.mouse.y - t7, this.mouse.x - t6);
                    } else {
                        if (this.arrowContainer) {
                            this.stage.removeChild(this.arrowContainer);
                            this.arrowContainer.destroy({
                                'children': true,
                                'texture': false,
                                'baseTexture': false
                            });
                            delete this.arrowContainer;
                        }
                    }
                    if (playerCellsAlive > 0) {
                        this.camera.setPosition(t6, t7);
                    }
                } else {
                    if (this.freeSpec && this.mouse) {
                        let tf = Math.min(Math.max(this.mouse.x, this.border[0]), this.border[1]);
                        let tg = Math.min(Math.max(this.mouse.y, this.border[2]), this.border[3]);
                        this.camera.setPosition(tf, tg);
                    }
                    if (this.arrowContainer) {
                        this.stage.removeChild(this.arrowContainer);
                        this.arrowContainer.destroy({
                            'children': true,
                            'texture': false,
                            'baseTexture': false
                        });
                        delete this.arrowContainer;
                    }
                }
                this.viewZoom = Math.max(0, mm()(this.viewZoom, this.calcViewZoom(), 10 * this.delta / this.settings.settings.cameraDelay));
                for (var i = 0; i < this.cells.length; i++) {
                    const cell = this.cells[i];
                    if (this.playerCells.indexOf(cell) > -1 && !cell.destroyed)
                        continue;
                    cell.updatePos();

                    if (cell.destroyed) {
                        cell.opacity = Math.max(0, cell.opacity - this.delta /* / 10*/
                        );
                        if (cell.opacity <= 0) {
                            this.removeNode(cell);
                        }
                    }
                }
                if (this.party) {
                    for (var ti in this.party) {
                        this.party[ti].updatePos();
                    }
                }
                this.cellContainer.sortChildren();
                this.camera.update();
                this.stage.x = this.width / 2 - this.camera.x * this.viewZoom;
                this.stage.y = this.height / 2 - this.camera.y * this.viewZoom;
                this.stage.scale.x = this.viewZoom;
                this.stage.scale.y = this.viewZoom;
                this.ui.loop();
                this.renderer.render(this.stage);
            }
            cleanUpCache() {
                for (var key in this.names) {
                    var tk = this.names[key];
                    if (this.updateTime - tk.lastAccess > this.maxCacheTime) {
                        tk.texture.destroy();
                        this.destroyedCount++;
                        delete this.names[key];
                    }
                }

                for (var key in this.skins) {
                    var skin = this.skins[key];
                    if (this.updateTime - skin.lastAccess > this.maxCacheTime) {
                        if (this.skins[key].texture) {
                            this.skins[key].texture.destroy(true);
                        }
                        delete this.skins[key];
                    }
                }

                for (var key in this.masses) {
                    var mass = this.masses[key];
                    if (this.updateTime - mass.lastAccess > this.maxCacheTime / 2) {
                        for (var i = 0; i < this.cells.length; i++) {
                            const cell = this.cells[i];
                            if (cell.sizeText && cell.sizeText.texture === mass.texture) {
                                cell.root.removeChild(cell.sizeText);
                                delete cell.sizeText;
                            }
                        }
                        mass.texture.destroy();
                        delete this.masses[key];
                    }
                }
                //console.debug(Object.keys(this.names).length, Object.keys(this.skins).length, Object.keys(this.masses).length, this.cells.length, Object.keys(this.nodes).length);
            }
            changeSetting(tn, to) {
                this.settings.setItem(tn, to);
            }
            iframe() {
                try {
                    var tp = window === window.parent ? false : true;
                    if (tp) {
                        window.parent.location.href = 'https://germs.io';
                        return;
                    }
                } catch (tq) {}
            }
            prerollComplete() {
                if (this.playerCells.length == 0) {
                    this.network.sendNick(this.settings.getItem('nick'));
                }
            }
            setNick(tr) {
                this.iframe();
                this.network.sendLocked();
                if (this.deathTimeout)
                    clearTimeout(this.deathTimeout);
                this.hideMenu();
                this.settings.setItem('nick', tr);
                this.deleteLastKiller();
                this.freeSpec = false;
                if (this.playerCells.length == 0) {
                    this.freeze = false;
                    this.vertical = false;
                    const ts = this.settings.getItem('deathCount');
                    if (ts % 0x5 == 0 && typeof adplayer !== 'undefined') {
                        try {
                            aiptag.cmd.player.push(function() {
                                adplayer.startPreRoll();
                            });
                        } catch (tt) {
                            this.prerollComplete();
                        }
                    } else {
                        this.prerollComplete();
                    }
                }
            }
            setSkin(tu, tv) {
                if (tu != '') {
                    if (tu.includes('imgur') || tv) {
                        if (tu.includes('i.imgur.com/')) {
                            hideSkins();
                            hideShop();
                            this.settings.setItem('skin', tu);
                            this.network.setSkin(tu);
                            $('#skin').css('background-image', 'url(' + tu + ')');
                            $('#skin').addClass('selected');
                        } else {
                            alert('Invalid Imgur Link\n(Must include i.imgur)');
                        }
                    } else {
                        hideSkins();
                        hideShop();
                        this.settings.setItem('skin', tu);
                        this.network.setSkin(tu);
                        if (tu == 'None') {
                            $('#skin').css('background-image', 'url(res/noskin.png)');
                            $('#skin').removeClass('selected');
                        } else {
                            var tw = 'res/skins/' + encodeURIComponent(tu) + '.png';
                            $('#skin').css('background-image', 'url(' + tw + ')');
                            $('#skin').addClass('selected');
                        }
                    }
                }
            }
            setTheme(tx, ty) {
                $('#themes').find('input').each(function() {
                    $(this).prop('checked', false);
                });
                $(ty).siblings('input').prop('checked', true);
                this.settings.setItem('theme', tx);
                if (this.grid)
                    this.drawGrid();
            }
            setColor(tz, tA) {
                $('#colors').find('input').each(function() {
                    $(this).prop('checked', false);
                });
                $(tA).siblings('input').prop('checked', true);
                this.settings.setItem('color', tz);
                if (this.grid)
                    this.drawGrid();
            }
            spectate() {
                this.iframe();
                if (this.playerCells.length > 0)
                    return this.hideMenu();
                this.deleteLastKiller();
                this.hideMenu();
                this.network.sendSpectate();
                this.freeSpec = true;
            }
            updatePosition(tB, tC, tD) {
                if (this.playerCells.length == 0) {
                    this.specZoom = tD;
                }
            }
            setBorder(tE, tF, tG, tH) {
                var tI = [tE, tG, tF, tH];
                if (this.border != tI) {
                    if (this.playerCells.length == 0) {
                        this.freeSpec = false;
                        this.mouse.x = 0;
                        this.mouse.y = 0;
                        this.camera.setPosition(0, 0);
                    }
                    this.border = tI;
                    this.drawGrid();
                }
            }
            calcViewZoom() {
                if (this.isMobile || this.settings.getItem('autoZoom') == true) {
                    if (this.playerCells.length == 0 && this.specZoom) {
                        return this.specZoom * this.viewRange();
                    }
                    this.newViewZoom = 0;
                    for (var tJ = 0; tJ < this.playerCells.length; tJ++) {
                        this.newViewZoom += this.playerCells[tJ].size;
                    }
                    this.newViewZoom = Math.pow(Math.min(64 / this.newViewZoom, 2), 0.3) * this.viewRange();
                } else {
                    this.newViewZoom = this.viewRange() / 2;
                }
                return this.newViewZoom;
            }
            viewRange() {
                return Math.max(this.width / 1080, this.height / 1920) * this.zoom;
            }
            drawGrid() {
                $(window).trigger('resize');
                const colorTheme = this.settings.getItem('color');
                switch (colorTheme) {
                case 'gray':
                    this.renderer.background.color = 0x333439;
                    break;
                case 'white':
                    this.renderer.background.color = 0xf0fbff;
                    break;
                case 'black':
                    this.renderer.background.color = 0x000000;
                    break;
                }

                if (this.grid) {
                    this.bgContainer.removeChild(this.grid);
                    this.grid.destroy({
                        children: true
                    });
                    this.grid = null;
                }
                this.grid = new PIXI.Container();

                const size = this.border[3] * 2;
                const scaleFactor = 0.5;
                let alpha = 0.7;
                let texture = null;

                switch (this.settings.getItem('theme')) {
                case 'hex':
                    texture = this.hexTexture;
                    break;
                case 'grid':
                    texture = this.gridTexture;
                    break;
                }

                if (texture) {
                    const tileSize = size * scaleFactor;

                    this.tilingSprite = new PIXI.TilingSprite({
                        texture,
                        width: tileSize,
                        height: tileSize
                    });

                    this.tilingSprite.scale.set(1 / scaleFactor, 1 / scaleFactor);

                    this.tilingSprite.position.set(-size / 2, -size / 2);

                    if (colorTheme === 'white' && texture === this.gridTexture) {
                        alpha = 0.2;
                    }
                    if (colorTheme === 'black' && texture === this.gridTexture) {
                        alpha = 0.35;
                    }
                    this.tilingSprite.alpha = alpha;
                    this.grid.addChild(this.tilingSprite);
                }

                if (!this.settings.getItem('hideBorder')) {
                    const borderGraphics = new PIXI.Graphics();
                    const borderSize = 150;

                    borderGraphics.rect(-borderSize / 2, -borderSize / 2, size + borderSize, size + borderSize).stroke({
                        width: borderSize,
                        color: 0x00ff00,
                        alpha: 1
                    });

                    borderGraphics.position.set(-size / 2, -size / 2);

                    this.grid.addChild(borderGraphics);
                }

                this.bgContainer.addChild(this.grid);

                if (this.isMobile) {

                    $('#mobile').show();

                    const inverse = colorTheme === 'black';

                    $('#btnEject img').attr('src', inverse ? 'res/eject inverse.png' : 'res/eject.png');

                    $('#btnSplit img').attr('src', inverse ? 'res/split inverse.png' : 'res/split.png');
                }
            }
            deleteLastKiller() {
                if (this.lastKiller) {
                    this.lastKiller = null;
                }
            }
            clearNodes() {
                this.deleteLastKiller();
                for (var tR in this.nodes) {
                    var tS = this.nodes[tR];
                    this.pool.putNode(tS);
                }
                this.nodes = {};
                this.playerCells = [];
                this.myCells = [];
                this.leaderboard = [];
                this.ui.score = 0;
                this.drawLines = [];
                this.blocked = [];
                delete this.party;
                this.cells = [];
                this.camera.setPosition(0, 0);
                this.ui.update();
                for (var ti in this.names) {
                    //console.debug("Destroyed stale texture");
                    this.names[ti].texture.destroy();
                }
                this.names = {};

                for (var ti in this.skins) {
                    if (this.skins[ti].texture) {
                        //console.debug("Destroyed stale texture");
                        this.skins[ti].texture.destroy(true);
                    }
                }
                this.skins = {};

                for (var ti in this.masses) {
                    //console.debug("Destroyed stale texture");
                    this.masses[ti].texture.destroy();
                }
                this.masses = {};

            }
            refreshMenuAds() {
                if ($('#menu').is(':visible')) {
                    try {
                        aiptag.cmd.display.push(async () => {
                            aipDisplayTag.display('germs-io_300x250');
                        }
                        );
                        aiptag.cmd.display.push(async () => {
                            aipDisplayTag.display('germs-io_728x90');
                        }
                        );
                        aiptag.cmd.display.push(async () => {
                            aipDisplayTag.display('germs-io_728x90_2');
                        }
                        );
                    } catch (tT) {
                        this.log('Failed to refresh menu ads');
                    }
                }
            }
            refreshAds() {
                try {
                    aiptag.cmd.display.push(async () => {
                        aipDisplayTag.display('germs-io_300x250_2');
                    }
                    );
                    aiptag.cmd.display.push(async () => {
                        aipDisplayTag.display('germs-io_728x90');
                    }
                    );
                    aiptag.cmd.display.push(async () => {
                        aipDisplayTag.display('germs-io_728x90_2');
                    }
                    );
                } catch (tU) {
                    this.log('Failed to refresh ads');
                }
            }
            removeNode(tV) {
                if (this.playerCells.indexOf(tV) > -1 && this.playerCells.length == 1) {
                    this.deathTimeout = setTimeout(this.onDeath.bind(this), 500);
                }
                delete this.nodes[tV.id];
                removeFromArray(this.playerCells, tV);
                removeFromArray(this.myCells, tV.id);
                removeFromArray(this.cells, tV);
                this.pool.putNode(tV);

                function removeFromArray(arr, item) {
                    let index = arr.indexOf(item);
                    if (index > -1)
                        arr.splice(index, 1);
                }
            }
            addNode(node) {
                this.nodes[node.id] = node;
                this.cells.push(node);
                if (this.myCells.indexOf(node.id) > -1 && this.playerCells.indexOf(node) == -1) {
                    this.playerCells.push(node);
                }
            }
            changeZoom(tX) {
                this.zoom *= 1 + tX * 0.3;
                0.01 > this.zoom && (this.zoom = 0.01);
                this.zoom > 4 / this.viewZoom && (this.zoom = 4 / this.viewZoom);
            }
            onTouchButtonStart(tY) {
                if (tY == 'eject') {
                    if (this.playerCells.length == 0) {
                        this.changeZoom(1);
                    } else {
                        this.sendMouse();
                        this.network.send(new packet.Eject());
                        this.ejectKey = true;
                    }
                }
                if (tY == 'split') {
                    if (this.playerCells.length == 0) {
                        this.changeZoom(-1);
                    } else {
                        this.sendMouse();
                        this.network.send(new packet.Split());
                    }
                }
            }
            onTouchButtonEnd(tZ) {
                if (tZ == 'eject') {
                    this.ejectKey = false;
                }
                if (tZ == 'split') {}
            }
            onKeyDown(event) {
                if (event.repeat)
                    return;

                // Always close settings on Escape
                if (event.keyCode === 27) {
                    $('#settings').hide();
                }

                // Suppress input while a key action is already in progress or the menu is open
                if ($('#menu').is(':visible'))
                    return;

                const self = this;
                const now = performance.now();

                if ($('#chat_input').is(':focus')) {
                    switch (event.keyCode) {
                    case 27:
                        $('#chat_input').val('');
                        $('#chat_input').blur();
                        break;
                    case 13:
                        this.chat.send($('#chat_input').val());
                        $('#chat_input').val('');
                        $('#chat_input').blur();
                        break;
                    }
                } else {
                    switch (event.keyCode) {
                    case 27:
                        this.showMenu();
                        break;
                    case 13:
                        $('#chat_input').focus();
                        break;
                    case 38:
                        this.changeZoom(1);
                        break;
                    case 40:
                        this.changeZoom(-1);
                        break;
                    case this.controls.Split[0]:
                        this.network.send(new packet.Split());
                        break;
                    case this.controls.Spectate[0]:
                        if (this.playerCells.length > 0) {
                            this.network.send(new packet.Extra());
                        }
                        break;
                    case this.controls.Feed[0]:
                        this.network.send(new packet.Eject());
                        this.ejectKey = true;
                        break;
                    case this.controls.Hide[0]:
                        this.hideUI = !this.hideUI;
                        if (this.hideUI) {
                            $('#gameMenu').hide();
                        } else {
                            $('#gameMenu').show();
                        }
                        this.partyMove();
                        break;
                    case this.controls.Freeze[0]:
                        this.freeze = !this.freeze;
                        this.ui.updateDebug();
                        this.vertical = false;
                        break;
                    case this.controls.Vertical[0]:
                        this.vertical = !this.vertical;
                        this.ui.updateDebug();
                        this.freeze = false;
                        break;
                    case this.controls.Double[0]:
                        self.network.send(new packet.Split());
                        setTimeout( () => self.network.send(new packet.Split()), 75);
                        break;
                    case this.controls.Triple[0]:
                        self.network.send(new packet.Split());
                        setTimeout( () => {
                            self.network.send(new packet.Split());
                            setTimeout( () => self.network.send(new packet.Split()), 75);
                        }
                        , 75);
                        break;
                    case this.controls['16x'][0]:
                        for (let i = 0; i < 4; i++) {
                            setTimeout( () => self.network.send(new packet.Split()), 45 * i);
                        }
                        break;
                    }
                }
            }
            onKeyUp(event) {
                if (event.keyCode === this.controls.Feed[0]) {
                    this.ejectKey = false;
                }
            }
            onDeath() {
                $('.stats-food-eaten').text(this.foodEaten);
                $('.stats-highest-mass').text(~~this.highestMass);
                $('.stats-time-alive').text(this.timeAlive.toString().toMMSS());
                $('.stats-leaderboard-time').text(this.leaderboardTime.toString().toMMSS());
                $('.stats-cells-eaten').text(this.cellsEaten);
                $('.stats-top-position').text(this.topPosition == 999 ? 'N/A' : this.topPosition + 1);
                this.foodEaten = 0;
                this.highestMass = 0;
                this.timeAlive = 0;
                this.leaderboardTime = 0;
                this.cellsEaten = 0;
                this.topPosition = 999;
                this.onLeaderboard = false;
                this.ui.onDeath();
                this.deathTimeout = setTimeout( () => {
                    if (this.settings.getItem('skipDeathScreen') == true) {
                        this.showMenu();
                    } else {
                        this.showDeath();
                    }
                }
                , 1500);
                let u5 = this.settings.getItem('deathCount');
                if (u5 >= 333) {
                    u5 = 0;
                }
                u5++;
                this.settings.setItem('deathCount', u5);
                this.onResize();
                this.network.verified = false;
                this.network.token = null;
                this.network.cfToken = null;
                this.network.tryVerify();
                this.network.tryVerifyCf();
            }
            onTouchStart(u6) {
                u6.preventDefault();
                if (u6.target.id == 'btnEject' || u6.target.id == 'btnSplit') {
                    return;
                }
                var u7 = u6.originalEvent.touches[0] || u6.originalEvent.changedTouches[0];
                this.touchStartX = u7.clientX;
                this.touchStartY = u7.clientY;
                this.pageX = u7.pageX;
                this.pageY = u7.pageY;
            }
            onTouchMove(u8) {
                u8.preventDefault();
                if (u8.target.id == 'btnEject' || u8.target.id == 'btnSplit') {
                    return;
                }
                var u9 = u8.originalEvent.touches[0] || u8.originalEvent.changedTouches[0];
                var ua = u9.clientX;
                var ub = u9.clientY;
                ua -= this.touchStartX;
                ub -= this.touchStartY;
                this.rawMouseX = ua * 3 + this.width / 2;
                this.rawMouseY = ub * 3 + this.height / 2;
                this.calcMouse();
            }
            onMouseMove(uc) {
                if (!uc.isTrusted) {
                    return;
                }
                if (this.isMobile) {
                    if (uc.target.id == 'btnEject' || uc.target.id == 'btnSplit') {
                        return;
                    }
                }
                this.pageX = uc.pageX;
                this.pageY = uc.pageY;
                this.rawMouseX = uc.clientX;
                this.rawMouseY = uc.clientY;
                this.calcMouse();
            }
            onMouseDown(ud) {
                if (ud.target.className != 'userMenuItem') {
                    $('#userMenu').hide();
                }
            }
            onContextMenu(ue) {
                this.ejectKey = false;
                if ($('#menu').is(':visible') || ue.target.id != 'gameMenu')
                    return false;
                ue.preventDefault();
                var uf = this.mouse.realX;
                var ug = this.mouse.realY;
                for (var uh in this.nodes) {
                    var uj = this.nodes[uh];
                    if (this.pointInCircle(uf, ug, uj.x, uj.y, uj.size)) {
                        if (this.playerCells.indexOf(uj.id) == -1) {
                            if (uj.parent > 0) {
                                return openUserMenu(uj);
                            }
                        }
                    }
                }
                return openUserMenu(null);
            }
            openUserMenu(uk) {
                if (uk && this.pID != uk.parent) {
                    this.lastSelectedPlayer = uk;
                    $('#userMenuPlayerName').html(uk.name ? uk.name.replaceAllPoly('\u0bf5', '').replaceAllPoly('\ufdfd', '') : 'An unnamed cell');
                    if (uk.skinSprite) {
                        $('#userMenuPlayerSkin').css('background-image', 'url(' + this.getSkinURL(uk.skin) + ')');
                    } else {
                        $('#userMenuPlayerSkin').css('background-image', 'none');
                    }
                    $('#userMenuPlayerSkin').css('background-color', uk.rgb);
                    $('#userMenuPlayer').show();
                    if (this.blocked.indexOf(uk.parent) > -1) {
                        $('#userMenuBlockText').text('Unmute Player');
                    } else {
                        $('#userMenuBlockText').text('Mute Player');
                    }
                } else {
                    $('#userMenuPlayer').hide();
                }
                if (this.inParty) {
                    $('#userMenuCreateParty').hide();
                    $('#userMenuLeaveParty').show();
                } else {
                    $('#userMenuCreateParty').show();
                    $('#userMenuLeaveParty').hide();
                }
                var ul = this.pageY;
                var um = this.pageX;
                if (um + $('#userMenu').width() >= $(window).width()) {
                    um -= $('#userMenu').width();
                }
                if (ul + $('#userMenu').height() >= $(window).height()) {
                    ul -= $('#userMenu').height();
                }
                $('#userMenu').css('top', ul);
                $('#userMenu').css('left', um);
                $('#userMenu').show();
            }
            userMenuBlock() {
                if (this.lastSelectedPlayer) {
                    if (this.blocked.indexOf(this.lastSelectedPlayer.parent) > -1) {
                        this.blocked.splice(this.blocked.indexOf(this.lastSelectedPlayer.parent), 1);
                    } else {
                        this.blocked.push(this.lastSelectedPlayer.parent);
                    }
                }
                $('#userMenu').hide();
            }
            userMenuCreateParty() {
                this.createParty();
                $('#userMenu').hide();
            }
            userMenuLeaveParty() {
                this.exitParty();
                $('#userMenu').hide();
            }
            userMenuInvite() {
                if (this.lastSelectedPlayer) {
                    if (!this.inParty) {
                        this.createParty();
                        setTimeout( () => {
                            this.network.sendChat('/invite ' + this.lastSelectedPlayer.parent);
                        }
                        , 1000);
                    } else {
                        this.network.sendChat('/invite ' + this.lastSelectedPlayer.parent);
                    }
                }
                $('#userMenu').hide();
            }
            userMenuScreenshot() {
                $('#userMenu').hide();
                html2canvas(document.getElementById('game'), {
                    'backgroundColor': null
                }).then(un => {
                    let uo = PIXI.RenderTexture.create({
                        width: this.width,
                        height: this.height
                    })
                    this.renderer.render(this.stage, uo);
                    let up = this.renderer['extract'].canvas(uo);
                    let uq = document.createElement('canvas');
                    let ur = uq.getContext('2d');
                    uq.width = this.width;
                    uq.height = this.height;
                    ur.fillStyle = '#' + ('00000' + (this.renderer.backgroundColor | 0).toString(16)).substr(-6);
                    ur.fillRect(0, 0, this.width, this.height);
                    ur.drawImage(up, 0, 0);
                    ur.drawImage(un, 0, 0);
                    let us = this.login.createWindow('', 'Germs.io', this.width / 3, this.height / 3);
                    us.document.body.innerHTML = '<img src="' + uq.toDataURL('image/png') + '" style="width:100%;height:auto;">';
                }
                );
            }
            pointInCircle(ut, uu, uv, uw, ux) {
                return Math.sqrt((ut - uv) * (ut - uv) + (uu - uw) * (uu - uw)) < ux;
            }
            onScroll(uy) {
                if (uy.target.className == 'chatTab' || uy.target.className == 'chatMessage' || uy.target.parentElement.className == 'chatTab' || uy.target.parentElement.className == 'chatMessage' || uy.target.parentElement.parentElement.className == 'chatMessage' || uy.target.parentElement.id == 'emotes' || uy.target.parentElement.id == 'emotesList' || uy.target.id == 'emotesList' || uy.target.id == 'emotes' || uy.target.id == 'tabs' || uy.target.className == 'chatTab' || uy.target.parentElement.className == 'emotesEmote' || uy.target.className == 'emotesEmote')
                    return;
                this.zoom *= Math.pow(0.9, uy['wheelDelta'] / -120 || uy['detail'] || 0);
                0.01 > this.zoom && (this.zoom = 0.01);
                this.zoom > 4 / this.viewZoom && (this.zoom = 4 / this.viewZoom);
            }
            onResize(uz) {
                this.width = $(window).width();
                this.height = $(window).height();
                var uA = Math.min(this.width / $('#menuContainer').width(), this.height / $('#menuContainer').height());
                $('#menuContainer').css('transform', 'scale(' + uA + ', ' + uA + ')');
                $('#deathContainer').css('transform', 'scale(' + uA + ', ' + uA + ')');
                $('#settingsContainer').css('transform', 'scale(' + uA + ', ' + uA + ')');
                $('#skinsCard').css('transform', 'scale(' + uA + ', ' + uA + ')');
                $('#shopCard').css('transform', 'scale(' + uA + ', ' + uA + ')');
                $('#rankingsCard').css('transform', 'scale(' + uA + ', ' + uA + ')');
                this.UIRatio = $(window).height() / 800;
                $('#map').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                $('#leaderboard').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                $('#debug').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                $('#reset').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                $('#chat').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                $('#xpProgress').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                $('#mobile').css('transform', 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')');
                this.partyMove();
                if (this.renderer)
                    this.renderer.resize(this.width, this.height);
            }
            partyMove() {
                $('#party').css({
                    'transform': 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')',
                    'left': 20 + $('#debug').width() * this.UIRatio + 'px'
                });
            }
            exitParty() {
                $('#party').hide();
                this.party = {};
                this.inParty = false;
                this.network.sendParty(2);
                this.ui.exitParty();
                history.pushState('', document.title, window.location.pathname + window.location.search);
                $('.partyCard').removeClass('partyGlow');
                $('.partyCreate').hide();
                $('#partyFind').show();
                $('#partyMenu').hide();
                $('#partyJoin').hide();
            }
            joinParty() {
                if (this.network.open == false)
                    return;
                $('.partyCreate').hide();
                $('#partyFind').hide();
                $('#partyMenu').hide();
                $('#partyJoin').show();
            }
            partyCode(uB) {
                if (uB)
                    uB = uB.replace('germs.io/', '').replace('https://', '');
                if (!uB || uB == '' || uB.charAt(0) != '#')
                    return alert('Invalid Party Code!');
                $('.partyCreate').show();
                this.network.sendParty(1, uB);
            }
            createParty() {
                if (this.network.open == false)
                    return;
                $('.partyCreate').show();
                this.network.sendParty(0);
            }
            setModes(uC) {
                var uD = '';
                for (var uE in uC) {
                    var uF = uC[uE];
                    uD += '<div class="gm gm-' + uF.icon.replace(' ', '-') + `" onclick="connect('` + uE + `');">`;
                    uD += '<span class="gm-name">' + uE + '</span>';
                    uD += '<span class="gm-count">' + uF['total'] + ' Players</span>';
                    uD += '</div>';
                }
                $('#gamemodes').html(uD);
            }
            setRegion(uG) {
                if (this.network.region != uG && this.network.searching == false) {
                    this.setConnecting(true);
                    this.network.getServers(uG);
                    this.settings.setItem('region', uG);
                    this.exitParty();
                }
                return false;
            }
            setConnecting(uH) {
                $('#play').prop('disabled', uH);
                $('#spectate').prop('disabled', uH);
                if (uH) {
                    $('#gamemodes').hide();
                    $('#connecting').fadeIn('fast');
                } else {
                    $('#gamemodes').show();
                    $('#connecting').fadeOut('fast');
                }
            }
            hideMenu() {
                if (this.settings.getItem('hideChat') == true) {
                    $('#chat').hide();
                } else {
                    $('#chat').show();
                }
                $('#menu').hide();
                if (!this.hideUI)
                    $('#gameMenu').show();
                if (this.inParty)
                    this.partyMove();
            }
            showMenu() {
                $('#gameMenu').hide();
                $('#menu').fadeIn('fast');
                this.onResize();
            }
            showDeath() {
                this.refreshAds();
                $('#deathContainer').show();
                this.showMenu();
            }
            hideDeath() {
                $('#deathContainer').fadeOut('fast');
                this.onResize();
            }
            shopTab(uI, uJ) {
                $('#shopNav').children().removeClass('active');
                if (uI)
                    $(uI).parent().addClass('active');
                $('#shopContent').children().removeClass('active');
                $(uJ).addClass('active');
                return false;
            }
            log(uK) {
                console.log('%cGerms:~$ %c ' + uK, 'color: #00fd00; font-weight: bold; font-size: 14px; font-family: Ubuntu;', 'color: white; font-size: 14px;text-shadow: rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;');
            }
        }
        ;window.countFPS = function() {
            var uL = new Date()['getMilliseconds']();
            var uM = 1;
            var uN = 0;
            return function() {
                var uO = new Date()['getMilliseconds']();
                if (uL > uO) {
                    uN = uM;
                    uM = 1;
                } else {
                    uM += 1;
                }
                uL = uO;
                return uN;
            }
            ;
        }();

        String.prototype.replaceAllPoly = function(uR, uS) {
            var uT = this;
            return uT.replace(new RegExp(uR,'g'), uS);
        }
        ;
        String.prototype.capitalize = function() {
            return this.replace(/\w\S*/g, function(uU) {
                return uU.charAt(0).toUpperCase() + uU.substr(1).toLowerCase();
            });
        }
        ;
        $.expr[':'].icontains = $.expr.createPseudo(function(uV) {
            return function(uW) {
                return $(uW).text().toUpperCase().indexOf(uV.toUpperCase()) >= 0;
            }
            ;
        });
        Date.prototype.addHours = function(uX) {
            this['setTime'](this.getTime() + uX * 60 * 60 * 1000);
            return this;
        }
        ;
        String.prototype['toHHMMSS'] = function() {
            var uY = parseInt(this, 0xa);
            var uZ = Math.floor(uY / 3600);
            var v0 = Math.floor((uY - uZ * 3600) / 60);
            var v1 = uY - uZ * 3600 - v0 * 60;
            if (uZ < 0xa) {
                uZ = '0' + uZ;
            }
            if (v0 < 0xa) {
                v0 = '0' + v0;
            }
            if (v1 < 0xa) {
                v1 = '0' + v1;
            }
            return uZ + ':' + v0 + ':' + v1;
        }
        ;
        String.prototype.toMMSS = function() {
            var v2 = parseInt(this, 0xa);
            var v3 = 0;
            var v4 = Math.floor((v2 - v3 * 3600) / 60);
            var v5 = v2 - v3 * 3600 - v4 * 60;
            if (v4 < 0xa) {
                v4 = '0' + v4;
            }
            if (v5 < 0xa) {
                v5 = '0' + v5;
            }
            return v4 + ':' + v5;
        }
        ;
        /* Also interferes with systems init
        Array.prototype.last = function() {
            return this[this.length - 0x1];
        }*/
        var instance = new sW();
        $('#play').click(function(v7) {
            if (v7.originalEvent === undefined) {
                return;
            }
            if (v7.originalEvent.isTrusted != null && v7.originalEvent.isTrusted == false) {
                return;
            }
            v7.preventDefault();
            instance.setNick($('#nick').val());
            return false;
        });
        $('#spectate').click(function(v8) {
            if (v8.originalEvent === undefined) {
                return;
            }
            if (v8.originalEvent.isTrusted != null && v8.originalEvent.isTrusted == false) {
                return;
            }
            v8.preventDefault();
            instance.spectate();
            return false;
        });
        window.__game = instance;
        self.hideDeath = instance.hideDeath.bind(instance);
        self.setSkin = instance.setSkin.bind(instance);
        self.setTheme = instance.setTheme.bind(instance);
        self.setColor = instance.setColor.bind(instance);
        self.createParty = instance.createParty.bind(instance);
        self.joinParty = instance.joinParty.bind(instance);
        self.exitParty = instance.exitParty.bind(instance);
        self.partyCode = instance.partyCode.bind(instance);
        self.changeSetting = instance.changeSetting.bind(instance);
        self.resetControls = instance.settings.resetControls.bind(instance.settings);
        self.connect = instance.network.connect.bind(instance.network);
        self.onCaptchaLoad = instance.network.onCaptchaLoad.bind(instance.network);
        self.onTurnstileLoad = instance.network.onTurnstileLoad.bind(instance.network);
        self.setRegion = instance.setRegion.bind(instance);
        self.auth = instance.login.auth.bind(instance.login);
        self.addEmote = instance.chat.addEmote.bind(instance.chat);
        self.logout = instance.login.logout.bind(instance.login);
        self.custom = instance.login.custom.bind(instance.login);
        self.redeemGift = instance.login.redeemGift.bind(instance.login);
        self.authResponse = instance.login.response.bind(instance.login);
        self.shopTab = instance.shopTab.bind(instance);
        self.openUserMenu = instance.openUserMenu.bind(instance);
        self.userMenuBlock = instance.userMenuBlock.bind(instance);
        self.userMenuScreenshot = instance.userMenuScreenshot.bind(instance);
        self.userMenuInvite = instance.userMenuInvite.bind(instance);
        self.userMenuCreateParty = instance.userMenuCreateParty.bind(instance);
        self.userMenuLeaveParty = instance.userMenuLeaveParty.bind(instance);
        self.buyLocked = instance.login.buyLocked.bind(instance.login);
        self.buySkin = instance.login.buySkin.bind(instance.login);
        self.buyCoins = instance.login.buyCoins.bind(instance.login);
        self.onTouchButtonStart = instance.login.buyBoost.bind(instance.login);
        self.redeemCode = instance.login.redeemCode.bind(instance.login);
        self.buyBucks = instance.login.buyBucks.bind(instance.login);
        self.onTouchButtonStart = instance.onTouchButtonStart.bind(instance);
        self.onTouchButtonEnd = instance.onTouchButtonEnd.bind(instance);
        self.prerollComplete = instance.prerollComplete.bind(instance);
        self.openShop = function(v9) {
            $('#shop').show();
        }
        ;
        self.hideShop = function(va) {
            if (!va)
                return $('#shop').hide();
            if (va.target.id == 'shop' || va.target.id == 'shopClose') {
                $('#shop').hide();
            }
        }
        ;
        self.openSettings = function(vb) {
            $('#settings').show();
        }
        ;
        self.hideSettings = function(vc) {
            if (!vc)
                return $('#settings').hide();
            if (vc.target.id == 'settings' || vc.target.id == 'settingsClose') {
                $('#settings').hide();
            }
        }
        ;
        self.openSkins = function(vd) {
            $('#skins').show();
            if (!self.freeSkins) {
                self.freeSkins = [];
                $.getJSON('php/Skins.php?type=free', function(ve) {
                    self.freeSkins = ve;
                    for (var vf = 0; vf < ve.length; vf++) {
                        var vg = ve[vf];
                        $('#freeSkinList').append(`<li id='skinSkin'><img onclick="setSkin('free/` + vg + `');" loading="lazy" width='85' height='85' data-src="res/skins/free/` + vg + '.png"> <p>' + vg.capitalize() + '</p></li>');
                    }
                });
            }
        }
        ;
        self.hideSkins = function(vh) {
            if (!vh)
                return $('#skins').hide();
            if (vh.target.id == 'skins' || vh.target.id == 'skinsClose') {
                $('#skins').hide();
            }
        }
        ;
        self.showRankings = function(vi) {
            function vj(vk) {
                return vk.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            $('#rankings').show();
            $.getJSON('php/Rankings.php?type=' + vi, function(vl) {
                var vm = '';
                for (var vn = 0; vn < vl.length; vn++) {
                    var vo = vl[vn];
                    var vp = 'font-size: 15px;';
                    switch (vn + 1) {
                    case 1:
                        vp += 'background-color: gold;';
                        break;
                    case 2:
                        vp += 'background-color: silver;';
                        break;
                    case 3:
                        vp += 'background-color: #CD7F32;';
                        break;
                    }
                    var vq = '';
                    switch (vi) {
                    case 'Levels':
                        vq = '<tr>\n\t\t\t\t\t\t\t\t\t\t<th scope="row"><span style="' + vp + '" class="badge badge-pill badge-primary">' + (vn + 1) + '</span></th>\n\t\t\t\t\t\t\t\t\t\t<td>' + vo.Name + '</td>\n\t\t\t\t\t\t\t\t\t\t<td>' + vo.Level + '</td>\n\t\t\t\t\t\t\t\t\t\t<td>' + vj(vo.XP) + '</td>\n\t\t\t\t\t\t\t\t\t</tr>';
                        break;
                    case 'Coins':
                        vq = '<tr>\n\t\t\t\t\t\t\t\t\t\t<th scope="row"><span style="' + vp + '" class="badge badge-pill badge-primary">' + (vn + 1) + '</span></th>\n\t\t\t\t\t\t\t\t\t\t<td>' + vo.Name + '</td>\n\t\t\t\t\t\t\t\t\t\t<td>' + vj(vo.Coins) + '</td>\n\t\t\t\t\t\t\t\t\t\t<td>' + vj(vo.Bucks) + '</td>\n\t\t\t\t\t\t\t\t\t</tr>';
                        break;
                    }
                    vm += vq;
                }
                var vr = '';
                switch (vi) {
                case 'Levels':
                    vr = '<tr>\n\t\t\t\t\t\t\t<th scope="col">Rank</th>\n\t\t\t\t\t\t\t<th scope="col">Name</th>\n\t\t\t\t\t\t\t<th scope="col">Level</th>\n\t\t\t\t\t\t\t<th scope="col">Experience</th>\n\t\t\t\t\t\t</tr>';
                    break;
                case 'Coins':
                    vr = '<tr>\n\t\t\t\t\t\t\t<th scope="col">Rank</th>\n\t\t\t\t\t\t\t<th scope="col">Name</th>\n\t\t\t\t\t\t\t<th scope="col">Coins</th>\n\t\t\t\t\t\t\t<th scope="col">G-Bux</th>\n\t\t\t\t\t\t</tr>';
                    break;
                }
                $('#rankingsHead').html(vr);
                $('#rankingsTable').html(vm);
            });
        }
        ;
        self.hideRankings = function(event) {
            if (!event)
                return $('#rankings').hide();
            if (event.target.id == 'rankings' || event.target.id == 'rankingsClose') {
                $('#rankings').hide();
            }
        }
        ;
        self.searchSkin = function(vt) {
            $('#clearSearch').hide();
            $('#freeSkinList > li').show();
            var vu = $('#freeSkinList li > p:icontains("' + vt.trim() + '")');
            $(vu).each(function() {
                var vv = $(this).parent().children('img');
                vv.each(function() {
                    this.src = $(this).data('src');
                });
            });
            $('#freeSkinList > li').not($(vu).closest('li')).hide();
            $('#paidSkinList > li').show();
            var vu = $('#paidSkinList li > p:icontains("' + vt.trim() + '")');
            $(vu).each(function() {
                var vx = $(this).parent().children('img');
                vx.each(function() {
                    this.src = $(this).data('src');
                });
            });
            $('#paidSkinList > li').not($(vu).closest('li')).hide();
            $('#clearSearch').show();
        }
        ;
        self.clearSearch = function(vy) {
            $('#freeSkinList > li').show();
            $('#paidSkinList > li').show();
        }
        ;
        $(window).on('resize', instance.onResize.bind(instance));
        $(document).ready(async function() {
            await instance.start();
            instance.settings.ready();

            const versionAnchor = document.getElementById('version');
            versionAnchor.innerHTML = 'Version: <b>' + '5.2.2-live-2179' + '</b>';
            versionAnchor.removeAttribute("href");
            
            // Germsfox information
            const germsfoxInfo = document.createElement("span");
            germsfoxInfo.innerText =  " | ";
            const germsfoxInfoAnchor = document.createElement("a");
            germsfoxInfoAnchor.id = "germsfoxInfo";
            germsfoxInfoAnchor.classList.add("nodrag");
            germsfoxInfoAnchor.innerText = "Germsfox: ";
            germsfoxInfoAnchor.href = "https://pishi.dev/germsfox";
            germsfoxInfoAnchor.target = "_blank";
            germsfoxInfoAnchor.addEventListener("click", event => event.stopPropagation());
            const germsfoxInfoVersion = document.createElement("b");
            germsfoxInfoVersion.innerText = "1.1";
            germsfoxInfoAnchor.appendChild(germsfoxInfoVersion);
            germsfoxInfo.appendChild(germsfoxInfoAnchor);
            versionAnchor.appendChild(germsfoxInfo);

            // Render new settings buttons
            const animationDelayLabel = document.getElementById("animationDelayLabel");
            animationDelayLabel.innerText = "Animation Delay";
            const animationDelayClearfix = animationDelayLabel.parentElement;

            const newSettings = {
                shortenMass: "Shorten Mass",
                highQualitySkins: "Enable Hi-Res Skins",
                borderlessSkins: "Enable Borderless Skins"
            };

            for (const key in newSettings) {
                const clearfix = document.createElement('div');
                clearfix.className = 'clearfix';
                clearfix.innerHTML = `
                    <h5 class="optionLabel">${newSettings[key]}</h5>
                    <label class="switch">
                        <input type="checkbox" id="${key}" onchange="changeSetting('${key}', this.checked);">
                        <span class="slider round"></span>
                    </label>
                `;
                clearfix.querySelector(`#${key}`).checked = instance.settings.settings[key];
                animationDelayClearfix.after(clearfix);

                animationDelayClearfix.after(clearfix);
            }

            const delayClearfix = document.createElement('div');
            delayClearfix.className = 'clearfix';
            delayClearfix.innerHTML = `
                <h5 id="cameraDelayLabel" class="optionLabel">Camera Delay</h5>
                <input data-placement="top" title="" type="range" min="10" max="200" value="${instance.settings.settings.cameraDelay}" class="range" id="cameraDelay"
                    oninput="changeSetting('cameraDelay', this.value); $('#cameraDelayTooltip').text(this.value);"
                    data-original-title="<div id='cameraDelayTooltip'>45</div>" data-toggle="tooltip">
            `;
            animationDelayClearfix.before(delayClearfix);
            setInterval(instance.network.refresh.bind(instance.network), 30000);
            window.onbeforeunload = function() {
                if (instance.playerCells.length > 0) {
                    return 'You will lose all your mass!';
                }
            }
            ;
            window.onkeydown = instance.onKeyDown.bind(instance);
            window.onkeyup = instance.onKeyUp.bind(instance);
            var vz = document.getElementById('game');
            vz.onmousedown = instance.onMouseDown.bind(instance);
            vz.oncontextmenu = instance.onContextMenu.bind(instance);
            if (/firefox/i.test(navigator.userAgent)) {
                vz.addEventListener('DOMMouseScroll', instance.onScroll.bind(instance), false);
            } else {
                vz.onmousewheel = instance.onScroll.bind(instance);
            }
            window.onmousemove = instance.onMouseMove.bind(instance);
            $(window).bind('touchstart', instance.onTouchStart.bind(instance));
            $(window).bind('touchmove', instance.onTouchMove.bind(instance));
            document.documentElement.addEventListener('touchmove', function(vA) {
                vA.preventDefault();
            }, false);
            $.ajax('js/adsbygoogle.js').fail(function(vB) {
                $('.blocker').each(function() {
                    $(this).fadeIn();
                });
            });
            $('#channels > li').click(function(vC) {
                var vD = parseInt($(this).attr('value'));
                instance.chat.setChannel(vD);
            });
            $('#skinContainer').scroll(function() {});
            if (instance.isMobile) {
                $('#ad-top').hide();
                $('#ad-bottom').hide();
            }
            $('#gameMenu').click(function(vE) {
                switch (vE.target.id) {
                case 'btnChannel':
                    return;
                case 'btnEmote':
                    return;
                }
                $('#emotes').hide();
                $('#channels').hide();
                $('#btnEmote').blur();
                $('#btnChannel').blur();
            });
            $("#settings-controls input[type='text']").on('click focus', function() {
                $(this).select();
            });
            $("#settings-controls input[type='text']").on('keydown', function(vF) {
                if (vF.which == 32)
                    vF.key = 'Space';
                var vG = vF.key.capitalize();
                switch ($(this).attr('id')) {
                case 'keyFeed':
                    instance.controls.Feed = [vF.which, vG];
                    break;
                case 'keySplit':
                    instance.controls.Split = [vF.which, vG];
                    break;
                case 'keyDouble':
                    instance.controls.Double = [vF.which, vG];
                    break;
                case 'keyTriple':
                    instance.controls.Triple = [vF.which, vG];
                    break;
                case 'key16x':
                    instance.controls['16x'] = [vF.which, vG];
                    break;
                case 'keyFreeze':
                    instance.controls.Freeze = [vF.which, vG];
                    break;
                case 'keyVertical':
                    instance.controls.Vertical = [vF.which, vG];
                    break;
                case 'keyHide':
                    instance.controls.Hide = [vF.which, vG];
                    break;
                case 'keySpectate':
                    instance.controls.Spectate = [vF.which, vG];
                    break;
                }
                instance.settings.setItem('controls', instance.controls);
                $(this).val(vG);
                $(this).blur();
            });
            $('[data-toggle="tooltip"]').tooltip({
                'html': true,
                'trigger': 'hover'
            });
            $('#animationDelay').on('mouseenter', function() {
                $('#animationDelayTooltip').text(this.value);
            });
            $('#cameraDelay').on('mouseenter', function() {
                $('#cameraDelayTooltip').text(this.value);
            });
        });
        self.copyToClipboard = function(vH) {
            var vI = 'copyToClipboard';
            var vJ = vH.tagName === 'INPUT' || vH.tagName === 'TEXTAREA';
            var vK, vL;
            if (vJ) {
                vM = vH;
                vK = vH.selectionStart;
                vL = vH.selectionEnd;
            } else {
                vM = document.getElementById(vI);
                if (!vM) {
                    var vM = document.createElement('textarea');
                    vM.style.position = 'absolute';
                    vM.style.left = '-9999px';
                    vM.style.top = '0';
                    vM.id = vI;
                    document.body.appendChild(vM);
                }
                vM.textContent = vH.textContent;
            }
            var vN = document.activeElement;
            vM.focus();
            vM.setSelectionRange(0, vM.value.length);
            var vO;
            try {
                vO = document.execCommand('copy');
            } catch (vP) {
                vO = false;
            }
            if (vN && typeof vN.focus === 'function') {
                vN.focus();
            }
            if (vJ) {
                vH.setSelectionRange(vK, vL);
            } else {
                vM.textContent = '';
            }
            return vO;
        }
        ;
    }
    )();
}
)();
