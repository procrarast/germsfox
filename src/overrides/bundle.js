
/*!
 * Germsfox
 *
 * @author      pc31754 <https://github.com/procrarast>
 * @version     1.3.9.3
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
    badwordsFilter: (filter, W, require) => {
        const badwords = require('badwords');
        const moreBadwords = require('moreBadwords');
        class Filter {
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
        }
        filter.exports = Filter;
    }
    ,
    badwords: badwordsArray => { // https://github.com/MauriceButler/badwords/blob/master/array.js
        badwordsArray.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
    }
    ,
    moreBadwords: moreBadwordsArray => { // I have no idea where this comes from and I'm too afraid to keyword search
        moreBadwordsArray.exports = ["ahole","anus","ash0le","ash0les","asholes","ass","Ass Monkey","Assface","assh0le","assh0lez","asshole","assholes","assholz","asswipe","azzhole","bassterds","bastard","bastards","bastardz","basterds","basterdz","Biatch","bitch","bitches","Blow Job","boffing","butthole","buttwipe","c0ck","c0cks","c0k","Carpet Muncher","cawk","cawks","Clit","cnts","cntz","cock","cockhead","cock-head","cocks","CockSucker","cock-sucker","crap","cum","cunt","cunts","cuntz","dick","dild0","dild0s","dildo","dildos","dilld0","dilld0s","dominatricks","dominatrics","dominatrix","dyke","enema","f u c k","f u c k e r","fag","fag1t","faget","fagg1t","faggit","faggot","fagg0t","fagit","fags","fagz","faig","faigs","fart","flipping the bird","fuck","fucker","fuckin","fucking","fucks","Fudge Packer","fuk","Fukah","Fuken","fuker","Fukin","Fukk","Fukkah","Fukken","Fukker","Fukkin","g00k","God-damned","h00r","h0ar","h0re","hells","hoar","hoor","hoore","jackoff","jap","japs","jerk-off","jisim","jiss","jizm","jizz","knob","knobs","knobz","kunt","kunts","kuntz","Lezzian","Lipshits","Lipshitz","masochist","masokist","massterbait","masstrbait","masstrbate","masterbaiter","masterbate","masterbates","Motha Fucker","Motha Fuker","Motha Fukkah","Motha Fukker","Mother Fucker","Mother Fukah","Mother Fuker","Mother Fukkah","Mother Fukker","mother-fucker","Mutha Fucker","Mutha Fukah","Mutha Fuker","Mutha Fukkah","Mutha Fukker","n1gr","nastt","nigger;","nigur;","niiger;","niigr;","orafis","orgasim;","orgasm","orgasum","oriface","orifice","orifiss","packi","packie","packy","paki","pakie","paky","pecker","peeenus","peeenusss","peenus","peinus","pen1s","penas","penis","penis-breath","penus","penuus","Phuc","Phuck","Phuk","Phuker","Phukker","polac","polack","polak","Poonani","pr1c","pr1ck","pr1k","pusse","pussee","pussy","puuke","puuker","qweir","recktum","rectum","retard","sadist","scank","schlong","screwing","semen","sex","sexy","Sh!t","sh1t","sh1ter","sh1ts","sh1tter","sh1tz","shit","shits","shitter","Shitty","Shity","shitz","Shyt","Shyte","Shytty","Shyty","skanck","skank","skankee","skankey","skanks","Skanky","slag","slut","sluts","Slutty","slutz","son-of-a-bitch","tit","turd","va1jina","vag1na","vagiina","vagina","vaj1na","vajina","vullva","vulva","w0p","wh00r","wh0re","whore","xrated","xxx","b!+ch","bitch","blowjob","clit","arschloch","fuck","shit","ass","asshole","b!tch","b17ch","b1tch","bastard","bi+ch","boiolas","buceta","c0ck","cawk","chink","cipa","clits","cock","cum","cunt","dildo","dirsa","ejakulate","fatass","fcuk","fuk","fux0r","hoer","hore","jism","kawk","l3itch","l3i+ch","masturbate","masterbat*","masterbat3","motherfucker","s.o.b.","mofo","nazi","nigga","nigger","nutsack","phuck","pimpis","pusse","pussy","scrotum","sh!t","shemale","shi+","sh!+","slut","smut","teets","tits","boobs","b00bs","teez","testical","testicle","titt","w00se","jackoff","wank","whoar","whore","*damn","*dyke","*fuck*","*shit*","@$$","amcik","andskota","arse*","assrammer","ayir","bi7ch","bitch*","bollock*","breasts","butt-pirate","cabron","cazzo","chraa","chuj","Cock*","cunt*","d4mn","daygo","dego","dick*","dike*","dupa","dziwka","ejackulate","Ekrem*","Ekto","enculer","faen","fag*","fanculo","fanny","feces","feg","Felcher","ficken","fitt*","Flikker","foreskin","Fotze","Fu(*","fuk*","futkretzn","gook","guiena","h0r","h4x0r","hell","helvete","hoer*","honkey","Huevon","hui","injun","jizz","kanker*","kike","klootzak","kraut","knulle","kuk","kuksuger","Kurac","kurwa","kusi*","kyrpa*","lesbo","mamhoon","masturbat*","merd*","mibun","monkleigh","mouliewop","muie","mulkku","muschi","nazis","nepesaurio","nigger*","orospu","paska*","perse","picka","pierdol*","pillu*","pimmel","piss*","pizda","poontsee","poop","porn","p0rn","pr0n","preteen","pula","pule","puta","puto","qahbeh","queef*","rautenberg","schaffer","scheiss*","schlampe","schmuck","screw","sh!t*","sharmuta","sharmute","shipal","shiz","skribz","skurwysyn","sphencter","spic","spierdalaj","splooge","suka","b00b*","testicle*","titt*","twat","vittu","wank*","wetback*","wichser","wop*","yed","zabourah"];
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
    ( () => {
        'use strict';
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

        /**
         *  Reads the binary protocol off an incoming packet.
         *
         *  On DataView and TextDecoder rather than a vendored copy of node's Buffer, which was
         *  2,330 lines of base64-js, ieee754 and feross/buffer carried to provide thirteen
         *  methods the platform already has. Nothing here is new behaviour - the two string
         *  readers in particular are ported literally, odd-byte arithmetic and all, because
         *  that arithmetic is the wire format rather than sloppiness: the server can send
         *  unaligned UTF-16, and both of them advance the offset by a different amount than
         *  they decode.
         */
        const UTF8_DECODER = new TextDecoder('utf-8');
        const UTF8_ENCODER = new TextEncoder();

        class BinaryReader {
            constructor(buffer) {
                this._bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
                this._view = new DataView(this._bytes.buffer, this._bytes.byteOffset, this._bytes.byteLength);
                this._offset = 0;
            }

            get length() { return this._bytes.length; }

            readUInt8() {
                const value = this._view.getUint8(this._offset);
                this._offset += 1;
                return value;
            }
            readUInt16() {
                const value = this._view.getUint16(this._offset, true);
                this._offset += 2;
                return value;
            }
            readUInt32() {
                const value = this._view.getUint32(this._offset, true);
                this._offset += 4;
                return value;
            }
            readInt32() {
                const value = this._view.getInt32(this._offset, true);
                this._offset += 4;
                return value;
            }
            readDouble() {
                const value = this._view.getFloat64(this._offset, true);
                this._offset += 8;
                return value;
            }

            readStringUtf8(length) {
                if (length == null) length = this._bytes.length - this._offset;
                length = Math.max(0, length);

                const value = UTF8_DECODER.decode(this._bytes.subarray(this._offset, this._offset + length));
                this._offset += length;
                return value;
            }

            /**
             *  Built a code unit at a time rather than through TextDecoder('utf-16le').
             *
             *  They disagree on exactly one thing, and it matters: a lone surrogate. The decoder
             *  is spec-bound to replace one with U+FFFD, while Buffer's 'ucs2' - what this
             *  replaced - hands the unpaired unit back untouched. Comparing the two over 23,000
             *  string reads of real traffic, that was the only difference either produced, and
             *  it is reachable from a crafted name.
             */
            readStringUnicode(length) {
                if (length == null) length = this._bytes.length - this._offset;
                length = Math.max(0, length);

                // Decodes whole code units but advances by the full length - see the note above
                let safeLength = length - (length % 2);
                safeLength = Math.max(0, safeLength);

                let value = '';
                for (let i = 0; i < safeLength; i += 2) {
                    value += String.fromCharCode(this._view.getUint16(this._offset + i, true));
                }

                this._offset += length;
                return value;
            }

            readStringZeroUtf8() {
                let length = 0;
                let terminatorLength = 0;
                // Byte-wise is correct for UTF-8: no continuation byte is ever zero
                for (let i = this._offset; i < this._bytes.length; i++) {
                    if (this._bytes[i] === 0) {
                        terminatorLength = 1;
                        break;
                    }
                    length++;
                }
                const value = this.readStringUtf8(length);
                this._offset += terminatorLength;
                return value;
            }

            readStringZeroUnicode() {
                let length = 0;
                let terminatorLength = ((this._bytes.length - this._offset) & 1) != 0 ? 1 : 0;
                for (let i = this._offset; i + 1 < this._bytes.length; i += 2) {
                    if (this._view.getUint16(i, true) === 0) {
                        terminatorLength = 2;
                        break;
                    }
                    length += 2;
                }
                const value = this.readStringUnicode(length);
                this._offset += terminatorLength;
                return value;
            }
        }

        const reader = BinaryReader;
        var badwordsFilterModule = modules('badwordsFilter');
        var l6 = modules.n(badwordsFilterModule); // Module wrapper? Why is it doing this?
        class Chat {
            constructor(game) {
                this.game = game;
                this.channel = -1;
                // chat channel (party, world)
                this.filter = new (l6())({
                    'regex': /[^a-zA-z0-9:alnum:|\$|\@]|^/gi,
                    'list': modules('badwords').exports, // badwords array of, well, bad words of course
                });
                this.emotes = {};
                /**
                 *  Filled by loadGermsfoxEmotes() from the extension's images/emotes.json,
                 *  which storage.js reads too - 53 filenames that used to be spelled out here
                 *  and there both, kept in step by hand. Empty is safe: the two readers below
                 *  simply match nothing until start() has awaited the load.
                 */
                this.germsfoxEmotes = [];
                this.germsfoxStickers = [];

                this.blazzerQuotes = [
                    "A tiny  useless dick",
                    "Zing is a femboy",
                    "Dont cry tiny dick",
                    "Future has frustation on ur tiny dick",
                    "Nahaahaa brazil in the list bigger dicj",
                    "Future e zing sounds like venezuelano xd",
                    "Maybe virgins tiny dicks wanting atettion",
                    "I'm not mentally ill like you guys.",
                    "It's quite possible you'll experience bullying at school.",
                    "Yes u mom is obsessed w my dick brazilian 20cm",
                    "List of tiny dicks w high ego: Future, zing and lu",
                    "Just cry, you envious little-dick people.",
                    "You guys live in a favela compared to mine.",
                    "Lu must be a psychopath just like the guys from Colubine.",
                    "Future maybe a nigga nerd",
                    "Canadians are all cowards with a reputation for liking to give their ass.",
                    "Like sucks biggers black dicks and licks butthole of my friends",
                    "future assumes his frustration because I'm Brazilian and have a bigger penis.",
                    "Your mother would love to taste my Brazilian cock, something you don't have to please.",
                    "Are you dating your hand?",
                    "It had to be a black monkey.",
                    "OMG I hate Israel",
                    "Who are the girls in this group?",
                    "Even though the Barcode is from the RSK age, I'm still older than him.",
                    "Lu=🐒"
                ];

                this.wahbasQuotes = [
                    "Look at the professionalism, big guy!ـط",
                    "Give me my share of the tasteـس",
                    "gsCool ـص",
                    "Your mother likes to be spanked on her bottom",
                    "Feed me, slave",
                    "I'm going to spank you",
                    "Your playing is as bad as your mom's a ss",
                    "Don't waste your time with him, he's a disgusting person.",
                    "Hiding in your mother's house",
                    "Who gave you permission to speak to me, slave?",
                    "Long live Iran",
                    "I will ride you",
                    "I will make you an example for this game",
                    "You son of a whore",
                    "Jeffrey Epstein",
                    "You and I are one",
                    "f u c k y o u monkey",
                    "You are a traitor, you son of a whore",
                    "Shut up, you son of a bitch",
                    "Your mother's a ss More beautiful",
                    "Iran will have s ex with you",
                    "Three lionesses confront a lion",
                    "Three prostitutes facing a lion",
                    "Hitler will come back to life again.",
                    "I love China, the king of this planet.",
                    "Bark like a dog, I won't listen to you.",
                    "You are a good girl, Candy, hahahahaha",
                    "You cannot rape my mother because you are a woman like her.",
                    "The children will rape you",
                    "I'm going to have sex with you and your mother, you son of a",
                    "Do you want to suck my p e n is?",
                    "spy I want you to suck my penis",
                    "You will dwell in the fire of Hell, God willing.",
                    "Your mom's a ss is ugly",
                    "I will have sex with your mother spy",
                    "Damn America and Israel, you terrorists!",
                    "Now I understand how you understand. You understand with you"
                ];
            }
            fetchEmotes() {
                $.getJSON('php/Emotes.php', emotes => {
                    if (emotes) {
                        this.emotes = emotes;
                        for (var key in emotes) {
                            var path = emotes[key];
                            var emoteHTML = `<li class="emotesEmote" onclick="addEmote('` + key + `');"><img name="` + key + '" title="' + key + '" src="res/emotes/' + path + '"></li>';
                            $('#emotesList').append(emoteHTML);
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
                // /wahbas sends a random line from wahbasQuotes instead of the literal command
                if (lg.trim() === '/blazzer') {
                    lg = this.blazzerQuotes[Math.floor(Math.random() * this.blazzerQuotes.length)];
                }
                if (lg.trim() === '/wahbas') {
                    lg = this.wahbasQuotes[Math.floor(Math.random() * this.wahbasQuotes.length)];
                }
                this.game.network.sendChat(lg, this.channel);
            }

            // On incoming chat message
            onMessage(sender, rgb, message, parent, channel) {
                var color = 'white';
                if (sender.indexOf('[Console]') > -1) {
                    channel = -99;
                }
                if (channel == -99) {
                    $('#tabs').children().each(function() {
                        let chatTab = $(this);
                        let lo = sender.indexOf('[Console]') > -1 ? '' : ':';
                        let lp = sender.indexOf('[Console]') > -1 ? '' : "<p class='nowrap' style='color: " + rgb + "'>" + sender + '</p>';
                        let lq = $("<div class='adminMessage' style='color: " + color + "'>" + lp + '<p>' + lo + ' ' + message + '</p></div>');
                        $(lq).appendTo(chatTab).hide().fadeIn(500);
                    });
                } else {
                    const tab = document.querySelector("#tabs [value='" + channel + "']");
                    if (tab) {
                        let notDefault = false;
                        let isAdmin = false;

                        if (sender.indexOf('[VIP]') > -1 || sender.indexOf('[Mod]') > -1 || sender.indexOf('[Admin]') > -1) {
                            notDefault = true;
                            isAdmin = sender.indexOf('[Admin]') > -1;

                            sender = sender.replace('[VIP]', '').replace('[Mod]', '').replace('[Admin]', '');
                            sender = sender.replace("font-weight: 900;", "font-weight: 300;");
                        } else {
                            sender = sender.replace(/<([^>]*)>/g, '$1').trim();
                            if (sender === "") sender = "An unnamed cell";

                            // div is just created to build stringified HTML of message and sender divs 
                            const div = document.createElement('div');

                            div.textContent = sender.removeWideChars();
                            sender = div.innerHTML;

                            div.textContent = message.removeWideChars();
                            message = div.innerHTML;

                            if (this.game.settings.getItem('disableProfanityFilter') != true) {
                                message = this.filter.clean(message);
                            }
                        }

                        const meta = {
                            skinSprite: null,
                            name: sender.replaceAllPoly("'", ''),
                            rgb: rgb,
                            parent: parent
                        };

                        // Unlike emotes (embedded anywhere in the message as a substring),
                        // a sticker only fires when the entire message is exactly its keyword.
                        const stickerFilename = this.germsfoxStickers.find(filename =>
                            message.trim() === filename.slice(0, filename.lastIndexOf(".")));

                        if (stickerFilename) {
                            const key = stickerFilename.slice(0, stickerFilename.lastIndexOf("."));
                            message = '<img class="germsfoxSticker" alt="' + key + '" data-filename="' + stickerFilename + '">';
                        } else {
                            for (const key in this.emotes) {
                                const filename = this.emotes[key];

                                message = message.replaceAllPoly(
                                    key,
                                    '<img class="chatEmote" src="res/emotes/' + filename + '">'
                                );
                            }

                            for (const filename of this.germsfoxEmotes) {
                                const key = filename.slice(0, filename.lastIndexOf("."));

                                message = message.replaceAllPoly(key,
                                    '<img class="germsfoxEmote" alt="' + key + '" data-filename="' + filename + '">');
                            }
                        }

                        if (message.replace(/<img\b[^>]*>/g, "").trim() === "") {
                            message = message.replaceAllPoly('class="chatEmote"', 'class="chatEmote big"')
                                             .replaceAllPoly('class="germsfoxEmote"', 'class="germsfoxEmote big"');
                        }

                        const messageDiv = document.createElement('div');

                        messageDiv.className = isAdmin ? 'adminMessage noshadow' : 'chatMessage';
                        messageDiv.style.color = color;
                        messageDiv.style.opacity = '0';
                        messageDiv.style.transition = 'opacity 500ms';
                        messageDiv.innerHTML = "<p><b oncontextmenu='openUserMenu(" + JSON.stringify(meta).replaceAll("'", "&apos;") + "); return false;' " + "style='display:inline-block;pointer-events:all;white-space:nowrap;height:14px;color:" + rgb + "'>" + sender + "</b>: " + message + "</p>";

                        // Stashed so a right-click anywhere in the row can open the same menu
                        // the name does. The name's own inline handler still works; this just
                        // stops the rest of the message being a dead zone.
                        messageDiv.dataset.germsfoxSender = JSON.stringify(meta);

                        tab.appendChild(messageDiv);

                        // Trigger fade
                        requestAnimationFrame(() => { messageDiv.style.opacity = '1'; });

                        if (notDefault) {
                            $('[data-toggle="tooltip"]').tooltip();
                        }
                    }
                }
                document.querySelectorAll('.chatTab').forEach(tab => {
                    if (tab.children.length > 50) {
                        const first = tab.firstElementChild;
                        if (first) {
                            first.style.opacity = '1';
                            first.style.transition = 'opacity 500ms';

                            requestAnimationFrame(() => {
                                first.style.opacity = '0';
                            });
                            setTimeout(() => {
                                first.remove();
                            }, 500);
                        }
                    }
                    tab.scrollTop = tab.scrollHeight;
                });
            }

            clear() {
                document.querySelectorAll('.chatTab').forEach(chatTab => {
                    chatTab.replaceChildren();
                });

                [...document.getElementById('tabs').children].slice(2).forEach(el => el.remove());
                [...document.getElementById('channels').children].slice(2).forEach(el => el.remove()); 
            }

            /**
             *  Reads the shared emote lists off the extension. Failure leaves both empty, which
             *  costs the germsfox emotes and nothing else - the game's own still work.
             */
            async loadGermsfoxEmotes(extensionURL) {
                try {
                    const lists = await (await fetch(`${extensionURL}images/emotes.json`)).json();
                    this.germsfoxEmotes = lists.emotes ?? [];
                    this.germsfoxStickers = lists.stickers ?? [];
                } catch (error) {
                    console.warn('[Germsfox] Could not load images/emotes.json', error);
                }
            }

            setChannel(channel) {
                this.channel = channel;

                const btnChannel = document.getElementById('btnChannel');

                switch (channel) {
                    case -2:
                        btnChannel.innerHTML = '<i class="fas fa-users"></i>';
                        break;
                    case -1:
                        btnChannel.innerHTML = '<i class="fas fa-globe"></i>';
                        break;
                }

                document.getElementById('channels').style.display = 'none';

                // Hide everything in the old tab
                [...document.getElementById('tabs').children].forEach(el => { el.style.display = 'none'; });

                const tab = document.querySelector(`#tabs [value="${channel}"]`);

                // Show the new tab
                if (tab) tab.style.display = '';

                document.querySelectorAll('[value]').forEach(el => {
                    el.scrollTop = el.scrollHeight;
                });
            }
        }

        // Per-mode cell-split cap, keyed by network.mode's exact display name. Not provided by
        // the server anywhere we can read (modes[mode].max is server player-slot capacity, a
        // different thing entirely), so these just mirror the game's own known limits.
        const CELL_COUNT_CAPS = {
            'FFA': 32,
            'Dream': 64,
            'Ultra': 200,
            'Infinity': 500,
            'Self Feed': 200,
            'Virus Feed': 48,
            'Crazy': 64,
            'Bots': 128,
        };

        class GameUI {
            constructor(game) {
                this.game = game;
                this.mapParty = document.getElementById('mapParty');
                this.debugText = document.getElementById('debugText');
                this.partyText = document.getElementById('partyText');
                this.partyCreateButton = this.buildPartyButton('germsfoxPartyCreate', 'Create Party', 'fa-plus', () => this.game.createParty());
                this.partyLeaveButton = this.buildPartyButton('germsfoxPartyLeave', 'Leave Party', 'fa-sign-out-alt', () => this.game.exitParty());
                this.resetText = document.getElementById('resetText');
                this.lbList = document.getElementById('leaderboardList');
                this.mapPlayer = $('#mapPlayer');
                this.mapPlayerEl = this.mapPlayer[0];
                this.mapPlayerEl.style.top = '0px';
                this.mapPlayerEl.style.left = '0px';
                this.leaderboard = $('#leaderboard');
                this.mapSize = $('#map').width();
                this.nodeX = 0;
                this.nodeY = 0;
            }
            // Runs every rendered frame, so avoid rewriting DOM/style properties that haven't
            // actually changed since the last call (jQuery's .css() doesn't diff for us).
            updateMinimap() {
                this.nodeX = this.game.camera.x / (this.game.border[3] * 2) * this.mapSize;
                this.nodeY = this.game.camera.y / (this.game.border[3] * 2) * this.mapSize;

                // Writing top/left relayouts the element every frame; a transform is
                // composite-only, and it's one style write instead of two.
                //
                // Rounded and deduped as well: this is a handful of pixels on a minimap, so the
                // dot only moves a whole pixel every several frames even at speed, and the write
                // that was happening on all of them was costing as much as the entire base
                // Renderer.tick across every node in the game.
                const el = this.mapPlayerEl;
                const mapX = Math.round(this.nodeX + this.mapSize / 2);
                const mapY = Math.round(this.nodeY + this.mapSize / 2);

                if (mapX !== this._mapX || mapY !== this._mapY) {
                    this._mapX = mapX;
                    this._mapY = mapY;
                    el.style.transform = `translate(${mapX}px, ${mapY}px)`;
                }

                /**
                 *  aliveCell, not playerCells.size: eaten cells stay in playerCells for the
                 *  length of their fade, so the size outlives the last living cell by about a
                 *  second. Guarding on it dereferenced a null aliveCell the moment the last
                 *  cell died - and before that, it painted the minimap from a corpse.
                 */
                const cell = this.game.aliveCell;
                if (cell) {
                    if (cell.renderer.heldSkin) {
                        if (this._mapSkin !== cell.skin) {
                            this._mapSkin = cell.skin;
                            el.style.backgroundImage = 'url(' + this.game.skinURLFrom(cell.skin) + ')';
                        }
                        if (this._mapBorderRgb !== cell.rgb) {
                            this._mapBorderRgb = cell.rgb;
                            el.style.border = '1px solid ' + cell.rgb;
                        }
                    } else if (this._mapBgRgb !== cell.rgb) {
                        this._mapBgRgb = cell.rgb;
                        el.style.backgroundColor = cell.rgb;
                    }
                }
            }
            onDeath() {
                this.score = 0;
                this.mapPlayer.css('background-color', 'rgba(255, 255, 255, 0.5)');
                this.mapPlayer.css('background-image', 'none');
                this.mapPlayer.css('border', '2px solid rgba(0,0,0, 0.2);');
                // Invalidate updateMinimap()'s dedupe cache so respawning with the same
                // skin/color re-applies it instead of being skipped as a no-op change.
                this._mapSkin = undefined;
                this._mapBorderRgb = undefined;
                this._mapBgRgb = undefined;
                this._mapX = undefined;
                this._mapY = undefined;
            }
            updateLeaderboardHTML() {
                let leaderboardHTML = '';

                for (let i = 0; i < this.game.leaderboard.length; i++) {
                    let player = this.game.leaderboard[i];
                    let playerRankHTML = '<li %style%>\n                                <p class="leaderboardRank">%rank%</p>\n                                <p class="leaderboardName">%name%</p>\n                            </li>';
                    let playerIconHTML = player.rank <= 2 ? '<i class="fas fa-crown lbCrown lbCrown-' + (player.rank + 1) + '"></i>' : player.rank + 1;
                    var myPlayerHTML = '';
                    if (this.game.party) {
                        if (this.game.party.hasOwnProperty(player.id) == true) {
                            var partyMember = this.game.party[player.id];
                            playerIconHTML = '<i class="fas fa-user-friends lbFriend" style="color:' + partyMember.color + '"></i>';
                        }
                    }
                    if (player.name.includes('[YT]')) {
                        player.name = player.name.replace('[YT]', '');
                        playerIconHTML = '<b class="lbYT">YT</b>';
                        if (this.game.myID == player.id) {
                            if (this.game.aliveCell) {
                                this.game.topPosition = Math.min(this.game.topPosition, player.rank);
                                myPlayerHTML = 'style="color: ' + this.game.aliveCell.rgb + '; font-weight: bold;"';
                                if (player.rank < 10) {
                                    this.game.onLeaderboard = true;
                                }
                            }
                        }
                    } else {
                        if (this.game.myID == player.id) {
                            if (this.game.aliveCell) {
                                this.game.topPosition = Math.min(this.game.topPosition, player.rank);
                                myPlayerHTML = 'style="color: ' + this.game.aliveCell.rgb + '; font-weight: bold;"';
                                if (player.rank > 2 && player.rank < 10) {
                                    var lM = 'background-color: ' + this.game.aliveCell.rgb + ';';
                                    if (this.game.aliveCell.renderer.heldSkin) {
                                        lM += 'background-image: url(' + this.game.skinURLFrom(this.game.aliveCell.skin) + ');';
                                        lM += 'border: 1px solid ' + this.game.aliveCell.rgb + ';';
                                    }
                                    playerIconHTML = '<span class="lbCell" style="' + lM + '"></span>';
                                }
                                if (player.rank < 10) {
                                    this.game.onLeaderboard = true;
                                }
                            } else {
                                continue;
                            }
                        }
                    }
                    var playerNameDiv = document.createElement('div');
                    playerNameDiv.textContent = player.name.trim().removeWideChars();
                    var playerNameHTML = playerNameDiv.innerHTML;
                    leaderboardHTML += playerRankHTML.replace('%style%', myPlayerHTML).replace('%rank%', playerIconHTML).replace('%name%', playerNameHTML.trim().removeWideChars() === '' ? 'An unnamed cell' : playerNameHTML).replace('%mass%', '500');
                }
                this.leaderboard.css('height', 55 + this.game.leaderboard.length * 20 + 'px');
                this.lbList.innerHTML = leaderboardHTML;
            }

            buildPartyButton(id, title, icon, onClick) {
                const button = document.createElement('button');
                button.id = id;
                button.className = 'germsfoxPartyButton';
                button.title = title;
                button.innerHTML = '<i class="fas ' + icon + '"></i>';
                button.addEventListener('click', onClick);
                this.partyText.parentElement.appendChild(button);
                return button;
            }

            clearPartyHTML() {
                this.partyText.innerHTML = '';
                this.mapParty.innerHTML = '';
            }
            

            /**
             *  Lays the debug panel out once, so updateDebugHTML() only ever has to write
             *  numbers into it.
             *
             *  It used to rebuild the whole panel as a string of markup and assign innerHTML,
             *  which runs on every node packet - tens of times a second - and makes the browser
             *  reparse the HTML and relayout the panel each time for what is almost always the
             *  same five labels with different digits. Profiled during a max-split cascade the
             *  innerHTML setter alone came to 0.35ms a frame, before the layout and paint it
             *  drags behind it.
             */
            buildDebugRows() {
                this.debugText.textContent = '';
                this.debugValues = [];
                this.debugColors = [];

                for (const label of DEBUG_LABELS) {
                    if (this.debugValues.length) this.debugText.appendChild(document.createElement('br'));

                    const labelEl = document.createElement('b');
                    labelEl.textContent = label + ' ';

                    const valueEl = document.createElement('span');
                    valueEl.appendChild(document.createTextNode(''));

                    this.debugText.append(labelEl, valueEl);
                    this.debugValues.push(valueEl.firstChild);
                    this.debugColors.push(null);
                }

                // The linesplit / mouse-frozen banner, hidden until one of them is on
                this.debugStateBreak = document.createElement('br');
                this.debugState = document.createElement('b');
                this.debugState.style.color = 'red';
                this.debugText.append(this.debugStateBreak, this.debugState);
                this.debugStateText = null;
                this.setDebugState(null);
            }

            setDebugValue(index, text, color) {
                const node = this.debugValues[index];
                if (node.nodeValue !== text) node.nodeValue = text;

                // Cached rather than read back off the element: the browser normalises
                // '#ff0000' to 'rgb(255, 0, 0)', so comparing against style.color never matches
                if (this.debugColors[index] !== color) {
                    this.debugColors[index] = color;
                    node.parentNode.style.color = color;
                }
            }

            setDebugState(text) {
                if (this.debugStateText === text) return;
                this.debugStateText = text;

                this.debugState.textContent = text ?? '';
                const display = text ? '' : 'none';
                this.debugState.style.display = display;
                this.debugStateBreak.style.display = display;
            }

            updateDebugHTML() {
                const game = this.game;

                if (!this.debugValues) this.buildDebugRows();

                const [cells, cellsColor] = this.getCellCountValue();
                const [fps, fpsColor] = this.getFPSValue();
                const [ping, pingColor] = this.getPingValue();

                this.setDebugValue(0, String(this.getMass()), 'white');
                this.setDebugValue(1, String(this.getScore()), 'white');
                this.setDebugValue(2, cells, cellsColor);
                this.setDebugValue(3, fps, fpsColor);
                this.setDebugValue(4, ping, pingColor);

                this.setDebugState(game.linesplit ? '[ LINESPLITTING ]'
                    : game.freeze ? '[ MOUSE FROZEN ]'
                    : null);

                if (game.network.restart) {
                    const restartHTML = this.getRestartHTML();
                    const server = game.network.server.slice(3);

                    this.resetText.innerHTML = game.network.restart.includes('[console]')
                        ? `<b>${restartHTML}</b>`
                        : `<b>${server}</b> - <b>${restartHTML}</b>`;
                }

                // Party
                if (game.party && game.inParty) {
                    const getNameHTML = (name) => {
                        const div = document.createElement('div');
                        div.textContent = (name || 'An unnamed cell').trim().removeWideChars();

                        if (!div.textContent) {
                            div.textContent = 'An unnamed cell';
                        }

                        return div.innerHTML;
                    };

                    let partyTextHTML = '<b>Party Members</b><br>';
                    let mapPartyHTML = '';
                    let partyMemberRank = 1;

                    const border = game.border[3] * 2;

                    if (game.aliveCell) {
                        const partyNameHTML = getNameHTML(game.aliveCell.name);

                        partyTextHTML += `
                            <div style="color:${game.aliveCell.rgb};white-space: nowrap;">
                                <p style="max-width:150px;overflow:hidden;text-overflow:ellipsis;display:inline-block;">
                                    ${partyMemberRank}. ${partyNameHTML}
                                </p>
                                <p style="display:inline-block;margin-left:5px;float:right;">
                                    ${this.getMass()}
                                </p>
                            </div>`;

                        partyMemberRank++;
                    }

                    for (const id in game.party) {
                        const partyMember = game.party[id];
                        const partyNameHTML = getNameHTML(partyMember.name);

                        partyTextHTML += `
                            <div style="white-space: nowrap;">
                                <p style="max-width:150px;overflow:hidden;text-overflow:ellipsis;display:inline-block;">
                                    ${partyMemberRank}. ${partyNameHTML}
                                </p>
                                <p style="display:inline-block;margin-left:5px;float:right;">
                                    ${partyMember.mass}
                                </p>
                            </div>`;

                        partyMemberRank++;

                        const mapX = partyMember.x / border * this.mapSize;
                        const mapY = partyMember.y / border * this.mapSize;

                        mapPartyHTML += `
                            <div class="mapPartyMember" style="background-color:${partyMember.color};top:${mapY + this.mapSize / 2}px;left:${mapX + this.mapSize / 2}px;">
                                <p>${partyNameHTML}</p>
                            </div>`;
                    }

                    this.partyText.innerHTML = partyTextHTML;
                    game.partyMove();

                    this.mapParty.innerHTML = mapPartyHTML;
                    game.themeMove();
                }
            }

            getRestartHTML() {
                if (this.game.network.restart.indexOf('[console]') > -1) {
                    var m3 = new Date(this.game.network.restart.split('[console]')[1]);
                    var m4 = this.game.network.restart.split('[console]')[0];
                    var m5 = document.createElement('div');
                    m5.textContent = m4.removeWideChars();
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
                var me = Math.floor(ma % 60000 / 1000);
                return mb + m8(mc) + ':' + m8(md) + ':' + m8(me);
            }
          
            getMass() {
                let total = 0;
                for (const cell of this.game.playerCells) {
                    // Eaten cells stay in playerCells (at half their pre-eaten size) for the
                    // duration of their fade-out animation - removeNode() only runs once that
                    // finishes, in the render loop, not as soon as the server says they're gone.
                    if (cell.eaten) continue;
                    total += cell.size ** 2;
                }
                return ~~(total / 100);
            }
            getCellCount() {
                let count = 0;
                for (const cell of this.game.playerCells) {
                    if (!cell.eaten) count++;
                }
                return count;
            }
            /**
             *  Value plus colour rather than a <font> wrapper: the debug panel writes these into
             *  nodes it already owns (see updateDebugHTML), so handing back markup would only
             *  mean parsing it again on every packet.
             */
            getCellCountValue() {
                const count = this.getCellCount();
                const max = CELL_COUNT_CAPS[this.game.network.mode];
                if (!max) return [String(count), 'white']; // Unrecognized mode - just the raw count

                if (count >= max) return [count + ' / ' + max, '#ff0000'];
                if (count > max / 2) return [count + ' / ' + max, 'yellow'];
                return [count + ' / ' + max, 'white'];
            }
            getScore() {
                const mass = this.getMass();
                this.score = Math.max(this.score || 0, mass);
                this.game.highestMass = Math.max(this.score, this.game.highestMass);
                return ~~this.score;
            }
            getFPSValue() {
                const FPS = ~~this.game.ticker?.FPS;
                if (FPS <= 15) return [String(FPS), '#ff0000'];
                if (FPS <= 30) return [String(FPS), 'yellow'];
                return [String(FPS), '#00ff00'];
            }
            getPingValue() {
                const ping = ~~this.game.ping;
                if (!ping) return ['N/A', 'white'];
                if (ping >= 200) return [String(ping), '#ff0000'];
                if (ping >= 100) return [String(ping), 'yellow'];
                return [String(ping), '#00ff00'];
            }
        }

        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        class PartyMember {
            constructor(game, id, mass, x, y, name) {
                this.game = game;
                this.id = id;
                this.mass = mass;
                this.x = x;
                this.y = y;
                this.targetX = x;
                this.targetY = y;
                this.name = name;
                this.lastUpdate = performance.now();
            }
            updatePos() {
                this.delta = Math.min(1, Math.max(0, 
                    (this.game.updateTime - this.lastUpdate) / 10));
                this.x = lerp(this.x, this.targetX, this.delta);
                this.y = lerp(this.y, this.targetY, this.delta);
                this.lastUpdate = this.game.updateTime;
            }
        }

        // Slack around the viewport before a node is culled, in world units.
        const CULL_MARGIN = 64;

        /**
         *  Spacing between the splits of a 2x/3x/4x macro.
         *
         *  The server advances a tick at a time and takes at most one split per tick, so two
         *  splits landing inside the same tick means the second is dropped outright - which is
         *  how a 4x comes out as a 3x. Spacing them is the only lever the client has, since
         *  there is no macro support server-side to ask for.
         *
         *  Measured against us.germs.io over 2465 ticks: the stream runs at 25 Hz (mean 39.2ms,
         *  median 39.7ms) but arrives badly jittered - consecutive ticks land 26ms to 49ms apart
         *  at the 10th and 90th percentiles. Split packets ride the same link, so a nominal
         *  spacing S reaches the server at roughly S-14ms .. S+9ms. That is exactly why the old
         *  45ms dropped splits: a good share of the time it arrived under one tick apart and
         *  collapsed. One tick plus this margin clears the jitter both ways without feeling
         *  sluggish, and replaces the old split personality where 2x and 3x used 75ms (safe but
         *  slow) and 4x used 45ms (fast but lossy).
         */
        const SPLIT_JITTER_MARGIN = 18;

        /**
         *  Ceiling on splits waiting to go out. Chaining two 4x presses for eight splits is a
         *  real Self Feed technique and has to fit exactly; this is also what stops a held key
         *  building a queue that keeps splitting long after it was let go, since key repeat
         *  arrives faster than one split per tick can drain.
         *
         *  Counted in splits the player asked for, not packets queued: a rushed run sends
         *  SPLIT_RUSH_COPIES packets per split and still costs the queue one. See queuedSplits.
         */
        const SPLIT_QUEUE_MAX = 8;

        /**
         *  Copies sent per tick once a macro is known to end at the cell cap.
         *
         *  Spacing splits apart buys accuracy by giving up throughput: the queue asks for one
         *  every splitSpacing on a server that will take one every tick. That trade is worth
         *  making when the count matters and worthless when it doesn't - past the cap the
         *  server discards the surplus regardless, so there is nothing left to protect.
         *
         *  So a capped run stops pacing and blankets the ticks instead, which is exactly what
         *  hand-spamming does and why it has always felt faster: with a copy always waiting,
         *  a split goes in the moment the tick flips rather than a jitter margin later. Three
         *  a tick covers the measured jitter; the surplus lands in a tick that has already
         *  taken one and costs nothing.
         */
        const SPLIT_RUSH_COPIES = 3;

        /**
         *  Modes where the 16x key is only ever pressed to reach the cell cap.
         *
         *  Everywhere else the queue waits for splitsWillCap() to prove overshoot is free
         *  before it stops pacing. In a feed mode that proof arrives too late to be useful: it
         *  reads playerCells, which trails the server by a round trip, so the first press of a
         *  max split still looks like it starts from one cell and gets paced - and at any real
         *  ping the second press often does too. Both then run at one split per splitSpacing
         *  rather than one per tick, which is the whole of the "max split is slow" complaint.
         *
         *  Here the intent is not in doubt, so the key skips the check.
         */
        const MAX_SPLIT_MODE = 'Self Feed';
        const SPLIT_SPACING_MIN = 45;
        const SPLIT_SPACING_MAX = 90;

        /**
         *  The tick rate is measured rather than assumed, so a server on a different rate paces
         *  itself. Several packets can arrive for one tick, so anything closer than COALESCE is
         *  one tick smeared rather than a new one; anything past STALL is a hiccup and says
         *  nothing about the server's rate. The average of a jittered arrival gap is still the
         *  true period, which is the whole reason a slow EMA works here.
         */
        const SERVER_TICK_ESTIMATE = 40;
        const TICK_COALESCE_MS = 10;
        const TICK_STALL_MS = 100;
        const TICK_EMA = 0.05;

        /**
         *  Phase tracking, which exists so the split margin can be measured rather than assumed.
         *
         *  The anchor is pulled toward each arrival quickly (the grid is stable, so a few
         *  samples pin it); the jitter estimate is deliberately slower, because it is a spread
         *  rather than a level and a couple of outliers should not move it.
         *
         *  Measured on us.germs.io: arrivals sit on a 40.00ms grid with a residual SD of
         *  2.05ms over 839 packets - the grid itself is near-perfect, and what varies is
         *  delivery.
         */
        const TICK_PHASE_EMA = 0.1;
        const TICK_JITTER_EMA = 0.02;

        /**
         *  Converts the EMA of |residual| into the SD of a *delivered gap*, which is what
         *  actually decides whether two splits collapse into one tick.
         *
         *  mean|X| is SD * sqrt(2/pi) for a normal, so SD is mean|X| * 1.2533; and the gap
         *  between two arrivals is a difference of two of them, widening it by sqrt(2). The
         *  product is the only number here that is arithmetic rather than judgement.
         */
        const JITTER_ABS_TO_GAP_SD = 1.2533 * Math.SQRT2;

        /**
         *  How many sigmas of delivered-gap jitter the split margin has to clear.
         *
         *  Four, because that is what the existing hand-tuned 18ms turns out to BE: the
         *  measured gap SD is ~3.6ms, and 18/3.6 = 4.9. It also reproduces this project's own
         *  two observations - at 4 sigma a 45ms spacing loses a split in ~59% of eight-split
         *  macros ("a good share of the time", which is what retired it) while 58ms loses one
         *  in ~0.008%.
         */
        const SPLIT_JITTER_SIGMAS = 4;

        /**
         *  Raises PIXI's per-frame ceiling on separately-shaded objects.
         *
         *  Anything that can't be batched takes one slot in the WebGPU uniform buffer batch,
         *  and each slot is padded up to the GPU's minUniformBufferOffsetAlignment. The jelly
         *  meshes this was written for are gone, but every BitmapText is non-batchable too, so
         *  a lobby where most cells show their mass still spends a slot apiece.
         *  PIXI hard-codes that batch at Float32Array(65535) = 262140 bytes with no option to
         *  configure it, so on a 128-byte-alignment GPU the limit is 2047 objects in one frame;
         *  cross it and PIXI throws "ubo batch got too big" mid-render and the renderer dies.
         *  Splitting into a crowded fight clears 2047 easily.
         *
         *  Measured on an Apple/metal-3 adapter: throws at exactly 2047 before this, and at
         *  exactly UNIFORM_BATCH_RENDERABLES after. maxBufferSize there is 4 GiB, so a couple of
         *  MiB is nothing - the 65535 is a PIXI default, not a hardware constraint.
         *
         *  This reaches into PIXI internals, so it is written to no-op rather than throw if a
         *  future version reshapes them: losing the headroom is survivable, a crash on boot is
         *  not. Applied before the first frame, while no bind group can reference the old buffer.
         */
        const UNIFORM_BATCH_RENDERABLES = 8192;

        function growUniformBatch(renderer) {
            const pipe = renderer?.renderPipes?.uniformBatch;
            const batch = pipe?._batchBuffer;
            const alignment = batch?._minUniformOffsetAlignment;

            // No uniformBatch at all is just the WebGL backend, which doesn't have this limit.
            // Anything else means a PIXI upgrade moved the internals this depends on - and since
            // the only symptom would be the renderer dying again under load, that must be loud.
            if (!pipe) return;
            if (!batch?.data || !Array.isArray(pipe._buffers) || !alignment) {
                console.warn('[Germsfox] Could not raise the PIXI uniform batch: its internals ' +
                    'have changed shape. The renderer will crash again past a few thousand cells.');
                return;
            }

            // Sized from the alignment so the object budget is the same on every GPU, rather
            // than the byte count being the same and the budget varying with hardware
            const floats = Math.ceil((UNIFORM_BATCH_RENDERABLES * alignment) / 4);
            if (batch.data.length >= floats) return;

            const grown = new Float32Array(floats);
            batch.data = grown;
            // The GPU-side buffers are constructed from this same array, so they have to be
            // repointed too or they keep uploading the old one at the old size
            for (const buffer of pipe._buffers) buffer.data = grown;
        }

        /** Zoom applied per wheel notch at the default sensitivity, and the span the slider covers. */
        const ZOOM_STEP = 0.9;
        const ZOOM_SENSITIVITY_RANGE = 4;

        const SPECTATE_CURVE = 1.25;

        /**
         *  Lerp divisor for the free-spectate camera, where cameraDelay does not apply - the
         *  pan rate comes from SPECTATE_CURVE and the cursor's distance instead. Named because
         *  the prediction in Camera.predict() has to divide by the same number.
         */
        const FREE_SPEC_SPEED = 20;

        /**
         *  How often sendMouse() fires. Named because leadMs() has to reason about it: the
         *  server acts on the newest position it has, so between sends that position ages.
         */
        const MOUSE_SEND_PERIOD = 40;

        /**
         *  DIAGNOSTIC - freeSpec lead measurement, driven by util/leadprobe.js.
         *
         *  Kept rather than deleted because the server-side wait leadMs() compensates for is
         *  not a constant: it measured 1.5 ticks in an empty region and 2.8 under load, so a
         *  different server or a busier one wants re-measuring rather than guessing. Gated off;
         *  it costs two dead branch tests per packet and per send while `on` is false.
         */
        const GF_DIAG = {
            marker: 'leadprobe-2',
            on: false,
            sent: [],
            recv: [],
            start() { this.sent.length = 0; this.recv.length = 0; this.on = true; return this.marker; },
            stop() { this.on = false; return { sent: this.sent.length, recv: this.recv.length }; },
            dump() { return JSON.stringify({ marker: this.marker, sent: this.sent, recv: this.recv }); },
        };
        self.__gfDiag = GF_DIAG;

        // PIXI normalises tick.deltaTime against 60Hz, so this is what one unit of delta buys
        const MS_PER_DELTA = 1000 / 60;

        /**
         *  How long the zoom has to settle before it is written to the synced settings blob.
         *  Long enough that one flick of the wheel is a single write, short enough that the
         *  other tabs feel like they followed rather than caught up.
         */
        const ZOOM_SYNC_DEBOUNCE = 150;

        const ZOOM_MIN = 0.01;
        const ZOOM_MAX = 5;

        class Camera {
            constructor(game) {
                this.game = game;
                // Render pos
                this.x = 0;
                this.y = 0;
                // Interpolated position
                this.targetX = 0;
                this.targetY = 0;

                // World units per millisecond the free-spectate pan is travelling - see predict()
                this.driftX = 0;
                this.driftY = 0;

                this.userZoom = 0.25;
                this.renderZoom = 1;

                this.cameraDelay = this.game.settings.settings.cameraDelay;
                this.zoomSensitivity = this.game.settings.settings.zoomSensitivity;
            }

            /**
             *  Fraction of the remaining distance to cover this frame, for a smoothing that
             *  takes the same wall-clock time to close whatever the frame rate is.
             *
             *  `1/speed` is the share a 60Hz frame covers, so what is left after n of them is
             *  (1 - 1/speed)^n - compounded, not multiplied. Multiplying (the old delta/speed)
             *  is only right while n is near 1, and delta was clamped at 1, so under 60fps the
             *  camera quietly covered less ground per second than it should: at 30fps it moved
             *  half as fast, at 20fps a third. Compounding also saturates instead of
             *  overshooting, which is what the clamp was there to prevent - after a long stall
             *  this approaches 1 and the camera simply arrives.
             */
            smoothing(speed) {
                const perFrame = Math.min(1, 1 / speed);
                return 1 - Math.pow(1 - perFrame, this.game.frames);
            }

            tick() {
                // Update position
                const speed = this.game.freeSpec ? FREE_SPEC_SPEED : this.cameraDelay / 10;
                const move = this.smoothing(speed);
                this.x = lerp(this.x, this.targetX, move);
                this.y = lerp(this.y, this.targetY, move);
                
                // Update zoom
                let newZoom;
                // Autozoom
                if (this.game.settings.settings.autoZoom == true) {
                    newZoom = 0;
                    for (const cell of this.game.playerCells) {
                        newZoom += cell.size;
                    }
                    newZoom = Math.pow(Math.min(64 / newZoom, 2), 0.3) * this.viewRange;
                } else {
                    newZoom = this.viewRange / 2;
                }

                this.renderZoom = Math.max(0, lerp(this.renderZoom, newZoom, this.smoothing(this.cameraDelay / 10)));
            }

            /**
             *  Where the camera will be `ms` from now if nothing changes.
             *
             *  A straight line is the correct extrapolation here rather than an approximation:
             *  the spectate pan recomputes its target relative to the camera every frame, so a
             *  cursor held still produces a constant velocity, not a decaying approach to a
             *  fixed point. Nothing curves for it to cut a corner off.
             */
            predict(ms) {
                return { x: this.x + this.driftX * ms, y: this.y + this.driftY * ms };
            }

            setPosition(x, y) {
                if (!this.menuEl) this.menuEl = document.getElementById("menu");
                if ((this.game.freeze || this.menuEl.style.display !== "none") && this.game.freeSpec) return;
                this.targetX = x;
                this.targetY = y;
            }

            // Routed through setZoom so the clamp lives in exactly one place
            changeZoom(amount) { this.setZoom(this.userZoom * Math.pow(ZOOM_STEP, amount * this._zoomStep)); }

            setZoom(value, fromSync = false) {
                this.userZoom = Math.min(Math.max(value, ZOOM_MIN), ZOOM_MAX);

                /**
                 *  Zoom rides along in the settings blob so it syncs the same way everything
                 *  else does, rather than earning a transport of its own.
                 *
                 *  Debounced because a scroll arrives as a burst and the blob is rewritten
                 *  whole: saving per tick would serialise every setting the game has dozens of
                 *  times per flick of the wheel. A wheel is not a cursor - landing a fraction
                 *  of a second after it stops is indistinguishable from following it.
                 *
                 *  `fromSync` is the echo guard: a zoom that arrived from another tab must not
                 *  be written back out, or two tabs would trade the same value forever.
                 */
                if (fromSync || !this.game.settings.getItem('syncZoom')) return;

                clearTimeout(this._zoomSaveTimer);
                this._zoomSaveTimer = setTimeout(
                    () => this.game.settings.setItem('zoom', this.userZoom),
                    ZOOM_SYNC_DEBOUNCE
                );
            }

            /**
             *  Recomputed once per frame so isVisible() stays a plain compare per node.
             *  stage.x is width/2 - camera.x * renderZoom and the stage is scaled by renderZoom,
             *  so a world point is on screen when it's within width/(2 * renderZoom) of the
             *  camera. renderZoom can lerp toward 0, which makes these Infinity - that fails
             *  open (everything visible), which is the right way round to fail.
             */
            updateBounds() {
                const halfWidth = this.game.width / (2 * this.renderZoom);
                const halfHeight = this.game.height / (2 * this.renderZoom);
                this.viewLeft = this.x - halfWidth;
                this.viewRight = this.x + halfWidth;
                this.viewTop = this.y - halfHeight;
                this.viewBottom = this.y + halfHeight;
            }

            // Deliberately generous: the bounds are a frame stale (refreshed before the node
            // loop, which runs before camera.tick()), and a cell draws past its radius by its
            // border width and whatever its name and mass labels reach. Over-reporting costs
            // one wasted draw; under-reporting pops a cell out at the screen edge.
            isVisible(x, y, radius) {
                const reach = radius * 1.5 + CULL_MARGIN;
                return x + reach >= this.viewLeft
                    && x - reach <= this.viewRight
                    && y + reach >= this.viewTop
                    && y - reach <= this.viewBottom;
            }
            get viewRange() { return Math.max(this.game.width / 1080, this.game.height / 1920) * this.userZoom; }
            get cameraDelay() { return this._delay }
            set cameraDelay(cameraDelay) { this._delay = cameraDelay; }

            /**
             *  0-100 from the settings slider, kept as the multiplier a wheel notch is raised to.
             *
             *  The midpoint is 1, which is exactly the step the wheel always had, so a default
             *  install zooms identically to before. Either end is a factor of ZOOM_SENSITIVITY_RANGE
             *  away from it, and the mapping is exponential because sensitivity is multiplicative -
             *  halving it should feel like the mirror of doubling it.
             */
            get zoomSensitivity() { return this._zoomSensitivity; }
            set zoomSensitivity(value) {
                this._zoomSensitivity = Number(value);
                this._zoomStep = Math.pow(ZOOM_SENSITIVITY_RANGE, (this._zoomSensitivity - 50) / 50);
            }
        }

        /**
         *  TextureCache is just a Map with a bunch of helpers and maintanence functions
         *  TextureCache subclasses define how they create new textures or, in skins' case, what we call 'resources'
         */

        /**
         *  Textures waiting to be freed, and the reason a texture may not be freed on the spot.
         *
         *  This is what fixes the WebGPU crash "the resource bound as textureSourceN was
         *  destroyed while a shader still uses it". The refcounting below was never wrong: a
         *  texture only ever reaches here with no node referencing it and every sprite that
         *  drew it already blanked to Texture.EMPTY. PIXI keeps a reference the refcount cannot
         *  see.
         *
         *  Batcher.checkAndUpdateTexture rebuilds a batch only when the sprite's *new* texture
         *  source is not already in it. Texture.EMPTY is in essentially every batch, so blanking
         *  a sprite takes the fast path - its texture id is swapped in place and the batch is
         *  left alone, still holding the old source in the array that becomes textureSource0..15
         *  in the bind group. Free the source and the next frame throws, and it never stops
         *  throwing: the uncaught error propagates out of the ticker callback, the next
         *  requestAnimationFrame is never armed, and the session is over. The crash was rare
         *  only because it needs the free to land while that particular batch is still standing.
         *
         *  So frees are queued and drained by drainTextureFrees(), which Game.render() calls
         *  after a frame that rebuilt the instruction set from scratch - by which point no batch
         *  holds the source any more. An earlier diagnostic that froze this cache's sweep proved
         *  nothing, because clear() destroyed textures inline and bypassed it entirely; it now
         *  goes through the queue like everything else. See BINDGROUP-CRASH.md.
         */
        const pendingTextureFrees = [];

        function queueTextureFree(texture) {
            if (texture) pendingTextureFrees.push(texture);
        }

        function drainTextureFrees() {
            for (const texture of pendingTextureFrees) texture.destroy(true);
            pendingTextureFrees.length = 0;
        }

        /**
         *  Reachable from the console as `__gfDiag.pendingFrees()`.
         *
         *  The queue is drained on the first frame after anything is put in it, so this reads 0
         *  between frames and climbs only while the game is not rendering. A number that stays
         *  up after a death or a server switch means the rebuild is not firing and textures are
         *  no longer being freed at all - which is the one way this fix can fail quietly.
         */
        GF_DIAG.pendingFrees = () => pendingTextureFrees.length;

        // Parented and orphaned again to force a rebuild through the public API - see below
        let rebuildSentinel = null;

        /**
         *  Marks the stage's instruction set for a full rebuild, so the next render discards
         *  every batch and the stale texture sources they hold with them.
         *
         *  The flag is a PIXI internal, so - like growUniformBatch - this does not assume it is
         *  still there. Attaching a child sets it through the public API and detaching the child
         *  again does not clear it, so an empty Container in and straight back out buys the same
         *  rebuild at the cost of one allocation. Falling back rather than no-opping matters
         *  here: a caller that cannot rebuild can never free what it has queued, which would
         *  leak worse than the crash this exists to fix.
         */
        function forceInstructionRebuild(container) {
            if (!container) return false;

            const group = container.renderGroup;
            if (group && 'structureDidChange' in group) {
                group.structureDidChange = true;
                return true;
            }

            if (!rebuildSentinel) rebuildSentinel = new PIXI.Container();
            container.addChild(rebuildSentinel);
            container.removeChild(rebuildSentinel);
            return true;
        }

        class TextureCache {
            constructor(game) {
                this.game = game;
                this.entries = new Map();
                this.maxClears = 10;
            }

            // Called by create()
            set(key, texture) {
                this.entries.set(key, {
                    texture: texture,        // The texture which is cached
                    refs: 0,        // The amount of onscreen nodes which reference the texture
                    clearAt: null,  // The time at which the texture may be freed
                });

                return texture;
            }

            has(key) { return this.entries.has(key); }

            // Return a texture, or null if it doesn't exist
            get(key) {
                const entry = this.entries.get(key);
                if (!entry) return null;

                return entry.texture;
            }

            startCleanupInterval(interval) {
                setInterval(() => {
                    let cleared = 0;
                    for (const [key, entry] of this.entries) {
                        if (cleared >= this.maxClears) {
                            return;
                        }
                        
                        // Texture is orphaned
                        if (entry.refs <= 0) {
                            // Put it on a timer if it isn't already
                            if (!entry.clearAt) {
                                entry.clearAt = this.game.updateTime + 10000;
                                continue;
                            }

                            // Clear the texture if it's ready
                            if (entry.clearAt < this.game.updateTime) {
                                this.destroyTexture(entry);
                                this.entries.delete(key);
                                cleared++;
                            }
                        } else {
                            // If attached texture was on a timer, clear the timer
                            if (entry.clearAt) entry.clearAt = null;
                        }
                    }
                }, interval);
            }

            // Put a texture on hold. The entry may be deleted once its texture has no references
            hold(key) {
                const entry = this.entries.get(key);
                if (entry) {
                    entry.refs++;
                    return true;
                }
                console.warn(`Tried to hold nonexistent resource ${key}. This should never happen!`);
            }

            release(key) {
                const entry = this.entries.get(key);
                if (entry) {
                    entry.refs--;
                    return true;
                }
                console.warn(`Tried to release nonexistent resource ${key}. This should never happen!`);
            }

            destroyTexture(entry) {
                if (entry.texture) {
                    queueTextureFree(entry.texture);
                    return true;
                }
                console.warn("Could not find texture for deletion!");
            }


            clear() {
                // Queued rather than freed here: these textures are still sitting in whatever
                // batches drew them, and clearNodes() runs mid-frame on every death, reconnect
                // and server switch - see pendingTextureFrees
                for (const entry of this.entries.values()) {
                    this.destroyTexture(entry);
                }
                this.entries.clear();
            }
        }

        class NameCache extends TextureCache {
            create(key, name, fontSize, fill, isLocked) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const font = `bold ${fontSize}px Ubuntu`;
                const strokeWidth = fontSize / (isLocked ? 12 : 6);
                const pad = Math.ceil(strokeWidth);
                const strokeAlpha = isLocked ? 0.5 : 1; 
                const strokeStyle = isLocked ? `#${fill.toString(16).padStart(6, '0')}` : 'black';

                let lines = name.split('\n');
                if (lines.length > 6) { // Keep names from being way too tall
                    lines = [...lines.slice(0, 6), lines[lines.length - 1]];
                }

                const lineHeight = fontSize * 1.5;

                ctx.font = font;
                // Find the widest line :widekisser:
                canvas.width = Math.ceil(Math.max(...lines.map(line => ctx.measureText(line).width))) + pad * 2;
                canvas.height = Math.ceil(lines.length * lineHeight) + pad * 2;

                ctx.font = font;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.lineJoin = 'round';
                ctx.lineWidth = strokeWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.globalAlpha = strokeAlpha ?? 1;
                lines.forEach((line, i) => ctx.strokeText(line, canvas.width / 2, pad + i * lineHeight + lineHeight * 0.5));
                ctx.globalAlpha = 1;
                ctx.fillStyle = `#${fill.toString(16).padStart(6, '0')}`;
                lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, pad + i * lineHeight + lineHeight * 0.5));

                let texture = new PIXI.Texture({ 
                    source: new PIXI.CanvasSource({ 
                        resource: canvas,
                        autoGenerateMipmaps: false
                    }) 
                });

                return this.set(key, texture);
            }
        }

        /**
         *  Mass labels are the most volatile text in the game: with "Shorten Mass" off the label
         *  is the raw mass value, so the key space is unbounded and nearly every update
         *  rasterized a fresh canvas and GPU texture faster than the cache could reclaim them.
         *  The glyph set is tiny and fixed, so a bitmap font rasterizes it once up front and
         *  every label draws from that one atlas instead.
         */
        const MASS_FONT = 'GermsfoxMass';
        const DEBUG_LABELS = ['Mass:', 'Score:', 'Cells:', 'FPS:', 'PING:'];

        const MASS_FONT_SIZE = 75;       // atlas size, and the rendered size for shortened mass
        const MASS_FONT_SIZE_FULL = 60;  // unshortened values are longer, so they render smaller

        /**
         *  The old canvas label was ceil(fontSize * 1.5) tall plus stroke padding, and an
         *  anchor.y of -0.8 pushed it that far below the cell's center. A bitmap font's line
         *  metrics aren't that height, so anchoring the same way would move every label.
         *  Deriving the offset from the old geometry keeps them exactly where they were.
         */
        function massLabelOffset(fontSize) {
            return 0.8 * (Math.ceil(fontSize * 1.5) + 2 * Math.ceil(fontSize / 12));
        }

        function installMassFont() {
            PIXI.BitmapFont.install({
                name: MASS_FONT,
                style: {
                    fontFamily: 'Ubuntu',
                    fontSize: MASS_FONT_SIZE,
                    fontWeight: 'bold',
                    fill: 'white',
                    stroke: { color: 'black', width: MASS_FONT_SIZE / 6, join: 'round' },
                },
                chars: [['0', '9'], '.kM'],
                // Defaults to 4, which would clip a stroke this thick - the stroke straddles
                // the glyph edge, so half its width has to fit outside
                padding: Math.ceil(MASS_FONT_SIZE / 12) + 2,
            });
        }

        /**
         *  Still caches textures, but with a layer of abstraction in the SkinResource class for async render handling
         */

        class SkinCache extends TextureCache {
            set(key, resource) {
                this.entries.set(key, {
                    resource: resource,
                    refs: 0,
                    clearAt: null,
                });

                return resource;
            }

            // Return a SkinResource, or null if it doesn't exist
            get(key) {
                const entry = this.entries.get(key);
                if (!entry) return null;

                return entry.resource;
            }

            create(skinName, isHighQuality) {
                const resource = new SkinResource(
                    this.game.skinURLFrom(skinName),
                    isHighQuality,
                );

                return this.set(skinName, resource);
            }


            destroyTexture(entry) {
                // Stays synchronous even though the free itself is deferred: this is what stops
                // a queued onReady() from handing a dead resource to a renderer
                entry.resource.pending = null; // Clear queue in case the texture hasn't rendered yet
                if (entry.resource.texture) {
                    queueTextureFree(entry.resource.texture);
                    return true;
                }
                console.warn("Could not find texture for deletion!");
            }
        }

        /**
         *  How wide a square the skin is sampled down to for the opacity check below.
         *
         *  A skin canvas is 512 or 1024 across, so scanning it whole is up to a million alpha
         *  reads on the main thread every time a new skin loads. Sampling it down first costs a
         *  single drawImage and makes the scan a few thousand reads. Averaging is the right
         *  direction of error, too: a hole anywhere in a neighbourhood drags that sample below
         *  full alpha, so the check gets *more* willing to call a skin transparent, not less.
         */
        const SKIN_OPACITY_PROBE = 64;

        /**
         *  How opaque a sampled pixel has to be to count as covered.
         *
         *  Not 255. Every skin the game ships carries a few hundred pixels sitting at 240-254
         *  from whatever resampling produced the art - a couple of percent of the body showing
         *  through, which is nothing - and demanding the full 255 called two of them transparent
         *  over pixels no one can see. At this threshold a probe sample has to be more than an
         *  eighth clear to fail, which no real hole ever isn't and no resampling noise ever is.
         */
        const SKIN_OPACITY_MIN_ALPHA = 224;

        /**
         *  Whether a skin paints its whole circle solid.
         *
         *  This decides whether the body underneath it may be erased - see rimTextureFor(). A
         *  skin with holes in it has to keep its body, because the erased area is a plain disc
         *  rather than the skin's own outline, and anything the skin does not cover would show
         *  the map through the cell.
         *
         *  Only the inside of the circle is looked at. The canvas is clipped to a disc, so its
         *  corners are transparent on every skin ever drawn - scanning the full square would
         *  call all of them transparent. The radius is trimmed a little further to clear the
         *  clip's own antialiased edge, which the downsample smears over a pixel or so.
         */
        function skinFillsItsCircle(canvas) {
            const size = SKIN_OPACITY_PROBE;
            const probe = document.createElement('canvas');
            probe.width = size;
            probe.height = size;

            const ctx = probe.getContext('2d');
            ctx.drawImage(canvas, 0, 0, size, size);

            let data;
            try {
                data = ctx.getImageData(0, 0, size, size).data;
            } catch (error) {
                // A skin host without CORS headers taints the canvas despite crossOrigin. Treat
                // it as opaque: that is what the overwhelming majority of skins are, and it
                // leaves such a skin behaving exactly as it did before this check existed.
                return true;
            }

            const center = size / 2;
            const radius = center * 0.94;

            for (let y = 0; y < size; y++) {
                const dy = y + 0.5 - center;
                const half = Math.sqrt(Math.max(0, radius * radius - dy * dy));
                const to = Math.floor(center + half);
                for (let x = Math.ceil(center - half); x <= to; x++) {
                    if (data[(y * size + x) * 4 + 3] < SKIN_OPACITY_MIN_ALPHA) return false;
                }
            }

            return true;
        }

        class SkinResource {
            constructor(src, isHighQuality) {
                this.texture = null;
                this.size = isHighQuality ? 1024 : 512;
                this.pending = new Map(); // Map of pending callbacks to run when image loads
                this.image = new Image();
                this.image.crossOrigin = 'anonymous';
                this.image.onload = this.renderTexture.bind(this);
                this.image.src = src;
            }

            onReady(id, cb) {
                if (this.texture) {
                    // Callback immediately if the texture already exists
                    cb(this);
                } else {
                    // Or add it to the queue
                    if (this.pending.has(id)) {
                        console.warn(`Duplicate callback from cell with id ${id} denied`);
                        return;
                    }
                    this.pending.set(id, cb);
                }
            }

            async renderTexture() {
                const canvas = document.createElement('canvas');
                canvas.width = this.size;
                canvas.height = this.size;

                const ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(this.size / 2, this.size / 2, this.size / 2, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(this.image, 0, 0, this.size, this.size);

                this.opaque = skinFillsItsCircle(canvas);

                this.texture = new PIXI.Texture({ 
                    source: new PIXI.CanvasSource({ 
                        resource: canvas,
                        autoGenerateMipmaps: true
                    }) 
                });

                // Done rendering, callback those who're waiting
                for (const cb of this.pending.values()) 
                    cb(this);

                this.pending = null;
            }
        }

        /**
         *  The backgrounds behind the white/gray/black color buttons. Previously these literals
         *  lived inside drawGrid()'s switch, which is what made the color buttons and the custom
         *  theme two separate systems: picking a preset never told the theme anything. setColor()
         *  now writes the preset straight into customTheme.background, so there is one value that
         *  decides the background and the theme panel always shows what is actually on screen.
         */
        const COLOR_PRESETS = {
            gray:  0x333439,
            white: 0xF0FBFF,
            black: 0x000000,
        };

        /**
         *  Every themeable slot in one place: its label, and the color its picker opens on while
         *  the slot is still unset. That starting color is load-bearing - see seedPicker().
         */
        const THEME_SLOTS = {
            // `unset` says what the swatch previews while the slot has no override: 'rainbow'
            // where the server's own varied colors come through, 'preset' where the background
            // follows a color button, and otherwise the slot's own `start` colour.
            //
            // Virus previews its own green rather than deferring to the map border. It used to
            // read the border, which left the two looking joined at the hip in the panel - move
            // the border and the virus swatch moved with it - even though nothing in the game
            // ever coupled them.
            virus:      { label: "Virus",        start: 0x33FF33 },
            food:       { label: "Food",         unset: 'rainbow', start: 0xAAAAAA },
            players:    { label: "Player Cells", unset: 'rainbow', start: 0xAAAAAA },
            background: { label: "Background",   unset: 'preset' },
            border:     { label: "Map Border",   start: 0x00FF00 },
        };

        const nodeType = {
            'Player': 0,
            'Virus': 1,
            'Food': 2
        };

        /**
         *  Recolors `baseHex` toward `filterHex` while keeping its brightness, so a themed cell
         *  still shows the light/dark variation the server gave it instead of going flat.
         */
        function filterColor(baseHex, filterHex) {
            const baseR = (baseHex >> 16) & 0xFF;
            const baseG = (baseHex >> 8) & 0xFF;
            const baseB = baseHex & 0xFF;

            const filterR = (filterHex >> 16) & 0xFF;
            const filterG = (filterHex >> 8) & 0xFF;
            const filterB = filterHex & 0xFF;

            const brightness = (baseR + baseG + baseB) / (3 * 255) * 2;

            const r = Math.min(255, Math.round(filterR * brightness));
            const g = Math.min(255, Math.round(filterG * brightness));
            const b = Math.min(255, Math.round(filterB * brightness));

            return (r << 16) | (g << 8) | b;
        }

        function cssColorFrom(hex) {
            return `rgb(${(hex >> 16) & 0xFF}, ${(hex >> 8) & 0xFF}, ${hex & 0xFF})`;
        }

        /**
         *  'Renderer' has nothing to do with PIXI.Renderer, rather it's my implementation of allowing different ways for 
         *  an attached Node to be displayed to the main container. Sprite renderers are the only
         *  family left now that jelly is gone, but the split is what keeps adding another cheap.
         *  Composition (allegedly) will make appearance easy to extend and customize!
         *
         *  This base class provides:
         *      - Root container
         *      - The means of moving and setting the radius (size) of any Node, including basic animations like eating
         *      - Destruction, sanitization and resetting (destroy, clean, init respectively)
         */

        const LOD_SCALE = 25;

        // How close a lerped value gets before it's snapped onto its target outright.
        const CONVERGE_EPSILON = 0.01;

        /**
         *  How far toward invisible a corpse gets before it is removed, as a fraction of
         *  whatever opacity the cell was drawn at. The old per-frame fade covered 0.255 (a
         *  1 -> 0.745 slide); this is one and a half times that, so a corpse thins out more
         *  before it goes rather than popping while still most of the way solid.
         */
        const EATEN_FADE_DEPTH = 0.383;

        /**
         *  How long that fade takes, in multiples of the animation delay.
         *
         *  It used to subtract from alpha once per frame and remove the cell when it crossed a
         *  fixed threshold, which stopped working the moment cells could be drawn at less than
         *  full opacity: a cell already below the threshold was removed on the first frame it
         *  died. Reading the clock instead keeps the same duration at every opacity, and still
         *  follows the animation delay the way it always did.
         *
         *  The old per-frame arithmetic worked out to 1.275 (its 0.255 depth * 5); this is that,
         *  a quarter shorter, so corpses clear sooner while fading by exactly the same fraction
         *  of whatever opacity they were drawn at.
         */
        const EATEN_FADE_TIME = 0.956;

        /**
         *  zIndex stamped on a parked renderer so it sorts ahead of every live cell.
         *
         *  Live cells index on (size | 0) + a sub-unit tiebreak, so they are never negative;
         *  this can only ever collide with itself. Sorting them to the front is what lets
         *  compactCellContainer() take the whole backlog as one leading slice.
         */
        const PARKED_Z_INDEX = -1e9;

        /**
         *  Parked roots to accumulate before compacting them out of the cell container.
         *
         *  Detaching costs one O(n) pass however many are taken, so the bigger the batch the
         *  cheaper each one is; but leaving them in costs a sort and two traversals of the whole
         *  child list every frame. A few hundred is the point where the per-frame tax outweighs
         *  the one-off pass.
         */
        const CELL_COMPACT_THRESHOLD = 384;

        /**
         *  Body textures with the disc a skin covers punched out, keyed by texture and skin size.
         *
         *  A fading cell fades its body sprite and its skin sprite independently, so over a
         *  background the result is `a*skin + a(1-a)*body + (1-a)^2*bg` where it should be
         *  `a*skin + (1-a)*bg`. That middle term is the bug: the body's colour washes over an
         *  opaque skin, peaking at a(1-a) = 0.19 at the cutoff above - a fifth of the cell's
         *  colour, right at the most visible moment of the fade.
         *
         *  Two sprites that never overlap composite correctly at any alpha, so rather than
         *  flattening them (a render target per corpse) or compositing them in one draw (a mesh
         *  per corpse, non-batchable, and a split cascade would put hundreds in a frame), the
         *  body simply stops drawing where the skin already covers it. Same sprite, same batch,
         *  no per-frame cost - and slightly less overdraw than before.
         *
         *  Only ever two or three of these exist: cell, borderless cell, virus.
         */
        const rimTextures = new Map();

        function rimTextureFor(texture, skinSize) {
            const key = texture.uid + ':' + skinSize;
            const cached = rimTextures.get(key);
            if (cached) return cached;

            let rim;
            try {
                // Copied out of the atlas rather than drawn from scratch: a virus's rim is a
                // ring of spikes, not a circle, and nothing outside the artwork knows its shape.
                const frame = texture.frame;
                const canvas = document.createElement('canvas');
                canvas.width = frame.width;
                canvas.height = frame.height;

                const context = canvas.getContext('2d');
                context.drawImage(
                    texture.source.resource,
                    frame.x, frame.y, frame.width, frame.height,
                    0, 0, frame.width, frame.height
                );

                context.globalCompositeOperation = 'destination-out';
                context.beginPath();
                context.arc(frame.width / 2, frame.height / 2, (frame.width / 2) * skinSize, 0, Math.PI * 2);
                context.fill();

                rim = new PIXI.Texture({ source: new PIXI.CanvasSource({ resource: canvas }) });
            } catch (error) {
                // The atlas is a local extension asset, so this should not fail - but handing
                // back the untouched texture restores the old bleed, which is a great deal
                // better than a cell body that has stopped drawing at all.
                console.warn('Germsfox: could not build a rim texture; eaten cells will bleed', error);
                rim = texture;
            }

            rimTextures.set(key, rim);
            return rim;
        }

        /**
         *  Breaks depth ties between cells that quantise to the same integer size, so their draw
         *  order stays put instead of shuffling whenever a node is added or removed.
         *
         *  The modulo is the point: node ids arrive as uint32 straight off the wire, and the old
         *  unbounded `id * 0.00001` would exceed a whole size unit once ids passed 100000 - at
         *  which point the tiebreak outweighs size itself and small cells start painting over
         *  large ones. Bounded, it can only ever order cells that were already tied.
         */
        function zOrderTiebreak(id) {
            return (id % 100000) * 0.00001;
        }

        class Renderer {
            constructor(game) {
                this.game = game;

                this.root = this.createRoot();
            }

            /**
             *  The display object this renderer moves, scales and fades as a unit.
             *
             *  A Container by default, because most cells stack a body, a skin, a name and a
             *  mass label inside it. A renderer with nothing to group can override this and
             *  hand back its own sprite instead - see FoodSpriteRenderer.
             */
            createRoot() {
                const root = new PIXI.Container();
                root.sortableChildren = true;
                return root;
            }
            
            init(node) {
                // Attach node to renderer both ways
                this.node = node;
                this.node.renderer = this;

                this.lastUpdate = this.game.updateTime;

                // Ejected mass and viruses grow into size
                this.size = (node.isEjected || node.parent === -1) 
                    ? node.size / 2 
                    : node.size;
                this.x = node.x;
                this.y = node.y;

                this.root.zIndex = (this.size | 0) + zOrderTiebreak(node.id); // same form as tick()
                this.root.alpha = this.opacity;
                this.root.visible = true;
                this.onScreen = true;
                this.culled = false;
                this.hidden = false; // set by settings that suppress a whole node type, e.g. hideFood
                this.animationDelay = this.game.settings.settings.animationDelay;
                // Already parented if this renderer came back out of the pool - clean() parks
                // roots in place rather than detaching them
                if (this.root.parent !== this.game.cellContainer) {
                    this.game.cellContainer.addChild(this.root);
                }
            }
           
            /**
             *  Fades a corpse toward invisible and retires it once it has gone far enough.
             *  Returns true when the node was removed and this renderer is finished.
             *
             *  Driven off the clock rather than by subtracting a little alpha each frame, so the
             *  corpse takes the same time to clear whatever opacity its cell was drawn at - see
             *  EATEN_FADE_TIME.
             */
            fadeEaten() {
                const progress = (this.game.updateTime - this.node.eatenAt)
                    / (this.animationDelay * EATEN_FADE_TIME);

                if (progress >= 1) {
                    this.game.removeNode(this.node);
                    return true;
                }

                this.root.alpha = this.opacity * (1 - EATEN_FADE_DEPTH * progress);
                return false;
            }

            /**
             *  The alpha this node is drawn at while it is alive.
             *
             *  Only player cells follow the opacity setting - seeing through the crowd is the
             *  point of it, and food and viruses are small enough that fading them would just
             *  make them hard to pick out. Keyed on the node rather than overridden per class so
             *  both renderer families get it from one place.
             */
            get opacity() {
                return this.node.type === nodeType.Player ? this.game.cellOpacity : 1;
            }

            /**
             *  Update rendered position, size and alpha of the displayed Node
             *  Return true if rendering should continue after tick() returns
             */

            tick() {
                this.delta = Math.max(0, (Math.min(1,
                    (this.game.updateTime - this.lastUpdate) / this.animationDelay
                )));

                this.lastUpdate = this.game.updateTime;

                /**
                 *  Culled first, and against the node's own position rather than the
                 *  interpolated one: everything below this is animation, and a cell nobody can
                 *  see does not need animating. The interpolated position is deliberately stale
                 *  while culled, so it is not fit to cull against.
                 *
                 *  `hidden` counts the same way - a node type switched off in settings (food,
                 *  say) is just as invisible as one off the edge of the screen.
                 */
                this.onScreen = this.game.camera.isVisible(this.node.x, this.node.y, this.node.size);
                this.culled = this.hidden || !this.onScreen;

                if (this.culled) {
                    this.root.visible = false;

                    // Snapped rather than left behind, so a cell scrolling back into view is
                    // already where it belongs instead of sliding in from wherever it was
                    // standing when it left
                    this.x = this.node.x;
                    this.y = this.node.y;
                    this.size = this.node.size;

                    // Corpses still have to retire off screen, or they pile up in the node map
                    // for as long as the camera looks away
                    if (this.node.eaten && this.fadeEaten()) return false;

                    return true;
                }

                // Update position
                if (this.node.eaten) {
                    // Cute eating animations
                    this.node.trackHunter();
                    this.x = lerp(this.x, this.node.x, this.delta / 5);
                    this.y = lerp(this.y, this.node.y, this.delta / 5);

                    if (this.fadeEaten()) return false;
                } else {
                    this.x = lerp(this.x, this.node.x, this.delta);
                    this.y = lerp(this.y, this.node.y, this.delta);
                }
                
                // Update renderer size (not node size!)
                this.size = lerp(this.size, this.node.size, this.delta);

                // Let lerp snap so it doesn't have to keep recalculating if it has reached its destination
                if (Math.abs(this.x - this.node.x) < CONVERGE_EPSILON) this.x = this.node.x;
                if (Math.abs(this.y - this.node.y) < CONVERGE_EPSILON) this.y = this.node.y;
                if (Math.abs(this.size - this.node.size) < CONVERGE_EPSILON) this.size = this.node.size;

                const zIndex = (this.size | 0) + zOrderTiebreak(this.node.id);
                if (zIndex !== this.root.zIndex) this.root.zIndex = zIndex;

                // Update root
                if (this.root.x !== this.x) this.root.x = this.x;
                if (this.root.y !== this.y) this.root.y = this.y;

                this.root.visible = true;

                const scale = this.size * this.game.camera.renderZoom;
                const LOD = Math.min(Math.floor(scale / LOD_SCALE), 2);
                
                // LOD has a setter because subclasses may want to do some stuff when LOD updates
                if (LOD !== this.LOD) {
                    this.setLOD(LOD);
                }

                return true;
            }
            
            // Prepare for putNode()
            clean() {
                this.root.visible = false;
                // Sorts to the front, where compactCellContainer() can detach the whole backlog
                // in a single slice instead of one indexOf per node
                this.root.zIndex = PARKED_Z_INDEX;
                this.game.parkedRoots++;
            }

            destroy() {
                // May already be detached by a compaction pass, and removeChild on an orphan
                // still scans the whole child list to find nothing
                if (this.root.parent) this.root.parent.removeChild(this.root);
                this.root.destroy({ children: true });
                this.root = null;
            }

            /**
             *  Regardless of Renderer type, setName and setSize both apply rasterized text to each respective
             *  sprite appended to this.uiRoot 
             */

            setName() {
                const name = this.node.name;
                const color = this.node.lockedColor;
                const position = this.node.lockedPosition;
                
                // Don't create a texture if it's an empty name or the user doesn't want one
                if (!name || !name.trim() || !this.canDisplay(this.game.settings.settings.showNames)) return;
                
                // Release the old name texture
                if (this.heldName) this.game.names.release(this.heldName);

                const nameKey = name + this.node.parent;
                
                // Set and hold the new name texture
                let texture = this.game.names.get(nameKey);

                if (texture === null) {
                    texture = this.game.names.create(
                        nameKey,
                        name,
                        140 - name.length * 3,
                        (color ?? 0xFFFFFF) & 0xFFFFFF,
                        color !== null ? true : false
                    );
                }

                this.game.names.hold(nameKey);
                this.heldName = nameKey;

                if (this.nameSprite) {
                    this.nameSprite.visible = true;
                    this.nameSprite.texture = texture;
                } else {
                    this.nameSprite = new PIXI.Sprite(texture);
                    this.uiRoot.addChild(this.nameSprite);
                }

                this.nameSprite.zIndex = 1;

                switch (position) {
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
                    this.nameSprite.scale.set(1);
                }
            }

            setSkin() {
                const skin = this.node.skin;
                if (!skin || 
                    !this.canDisplay(this.game.settings.settings.showSkins) ||
                    this.game.settings.settings.blockedSkins.has(skin)) return;

                if (this.heldSkin === skin) return;

                // Release old skin texture
                if (this.heldSkin) this.game.skins.release(this.heldSkin);

                // Set and hold the new skin texture
                let resource = this.game.skins.get(skin) ??
                    this.game.skins.create(skin, this.game.settings.settings.highQualitySkins);

                this.game.skins.hold(skin);
                this.heldSkin = skin;

                resource.onReady(this.node.id, resource => {
                    const texture = resource.texture;
                    if (!texture) return; 
                    this.skinTexture = texture;
                    this.skinTexture.size = resource.size; // Funi hack
                    this.skinTexture.opaque = resource.opaque;
                    this.applySkinTexture();
                });
            }

            applySkinTexture() {
                console.error("This renderer has no type!");
            }

            canDisplay(preference) {
                if (preference === 'all') return true;
                if (preference === 'party') return !!this.game.party?.hasOwnProperty(this.node.parent);
                if (preference === 'self') return this.game.myCells.has(this.node.id);
                return false;
            }

            // Both renderer families scale a container by size/textureSize every frame. Skipped
            // once the cell has settled, since a scale write dirties the transform of everything
            // beneath it - only answerable because tick() snaps size onto its target.
            applyScale(container) {
                const scale = this.size / this.textureSize;
                if (scale === this._lastScale) return;
                this._lastScale = scale;
                container.scale.set(scale);
            }

            setSize() {
                if (!this.game.settings.settings.showMass) return;
                
                const size = this.node.size;
                
                // Hide the texture if...
                let zoomThreshold = 24 + this.game.nodeCountRoot;

                if (this.massSprite?.visible) zoomThreshold -= 10; // Otherwise it flickers sometimes

                if (size * this.game.camera.renderZoom < zoomThreshold || this.node.eaten) {
                    if (this.massSprite) this.massSprite.visible = false;
                    return;
                }

                // Skip updating mass sprite if...
                if (this.game.updateTime - this.lastMassUpdate < 100)
                    return;

                this.lastMassUpdate = this.game.updateTime;

                const mass = Math.floor(size * size / 100);
                const shorten = this.game.settings.settings.shortenMass;
                const massText = shorten ? this.shortStringFrom(mass) : mass.toString();
                const fontSize = shorten ? MASS_FONT_SIZE : MASS_FONT_SIZE_FULL;

                if (this.massSprite) {
                    this.massSprite.visible = true;
                    // Most updates land on the same text, and assigning .text re-lays out the
                    // glyphs whether or not it actually changed
                    if (this.massSprite.text !== massText) this.massSprite.text = massText;
                    // Only moves when the shortenMass setting is toggled mid-game
                    if (this.massSprite.style.fontSize !== fontSize) {
                        this.massSprite.style.fontSize = fontSize;
                        this.massSprite.y = massLabelOffset(fontSize);
                    }
                } else {
                    this.massSprite = new PIXI.BitmapText({
                        text: massText,
                        style: { fontFamily: MASS_FONT, fontSize },
                    });
                    this.massSprite.anchor.set(0.5, 0);
                    this.massSprite.y = massLabelOffset(fontSize);
                    this.massSprite.zIndex = 1;
                    this.uiRoot.addChild(this.massSprite);
                }
            }

            /**
             *  Note that Size and Mass semantically differ only by Mass being the ingame
             *  representation of a cell's Size.
             */

            shortStringFrom(mass) {
                if (mass >= 1000000)
                    return `${(Math.floor(mass / 100000) / 10).toFixed(1)}M`;
                if (mass >= 1000)
                    return `${(Math.floor(mass / 100) / 10).toFixed(1)}k`;
                else
                    return mass.toString();
            }

            /**
             *  remove() functions clear relevant textures from both the game cache and node sprite
             */

            removeMass() {
                // setSize() turns it back on with the new node's value when the renderer is
                // checked back out of the pool
                if (this.massSprite) this.massSprite.visible = false;
            }

            removeName() {
                if (this.heldName) {
                    this.game.names.release(this.heldName);
                    this.heldName = null;
                    this.nameSprite.texture = PIXI.Texture.EMPTY;
                    return true;
                }
                return false;
            }
            
            removeSkin() {
                if (this.heldSkin) {
                    const resource = this.game.skins.get(this.heldSkin);
                    
                    // Check if the SkinResource is still waiting for a texture
                    // If it is, remove this node from the queue so it doesn't get set later
                    if (resource.pending) resource.pending.delete(this.node.id);

                    this.game.skins.release(this.heldSkin);
                    this.heldSkin = null;

                    this.removeSkinTexture();

                    return true;
                }
                return false;
            }

            // TODO not yet properly implemented
            setLOD(LOD) {
                this.LOD = LOD;
            }

            debug(...args) {
                console.debug(`[Renderer ${this.node.id}]`, ...args);
            }
            
            
            get skinSprite() {
                console.error("This renderer has no type!");
            }

            get uiRoot() { return this.root; } // Where names, skins, and mass are appended
            get animationDelay() { return this._delay; }
            set animationDelay(delay) { this._delay = delay; } 
        }

        /**
         *  SpriteRenderers are essentially just PIXI containers with a cellSprite. Each of its derivative
         *  subclasses provide its respective texture and texture size.
         */

        class SpriteRenderer extends Renderer {
            createRoot() {
                // Built here rather than in the constructor so a renderer with nothing to group
                // can hand this sprite straight back as its own root
                this.sprite = this.createSprite();

                const root = super.createRoot();
                root.addChild(this.sprite);
                return root;
            }

            init(node) {
                super.init(node);
                this.sprite.tint = this.node.color;

                // A pooled renderer can still be wearing the rim it was swapped to while it
                // faded. Doubles as food's shape texture, which is why FoodSpriteRenderer no
                // longer sets it - `this.texture` reads the checked-out node either way.
                this.sprite.texture = this.texture;
                this.rimmed = false;
                this.eatenRimChecked = false;
            }

            refreshColor() {
                this.sprite.tint = this.node.color;
            }

            tick() {
                if (!super.tick()) return false;

                // Nothing below this changes anything a culled cell would show
                if (this.culled) return;

                this.applyScale(this.root);

                // Checked once, on the frame it dies: a skin still loading at that moment keeps
                // the plain body rather than making every remaining frame of the fade re-test.
                if (this.node.eaten && !this.eatenRimChecked) {
                    this.eatenRimChecked = true;
                    this.refreshBodyTexture();
                }
            }

            /**
             *  Chooses between the plain body texture and one with the skin's disc erased.
             *
             *  A body only bleeds through its skin once the two are drawn at less than full
             *  alpha - while a corpse fades, or whenever the cell opacity setting is turned
             *  down. At full opacity the plain texture is kept, so a skin with transparent parts
             *  still shows the cell's colour through them exactly as it always has.
             *
             *  Erasing is only safe under a skin that covers its whole circle. What gets cut out
             *  of the body is a plain disc, not the skin's outline, so under a skin with holes
             *  in it the map itself would show through them. Those skins keep their body and go
             *  back to the milder artefact this erasing was added to remove - a faint wash of
             *  cell colour over the skin as it fades, rather than a hole clean through the cell.
             */
            refreshBodyTexture() {
                const skinned = !!this.heldSkin
                    && !!this._skinSprite
                    && this._skinSprite.texture !== PIXI.Texture.EMPTY
                    && this._skinSprite.texture.opaque !== false;

                this.rimmed = skinned && (this.node.eaten || this.opacity < 1);

                const texture = this.rimmed
                    ? rimTextureFor(this.texture, this.skinSize)
                    : this.texture;

                if (this.sprite.texture !== texture) this.sprite.texture = texture;
            }

            // Creates a Sprite with a texture defined by each node type
            createSprite() {
                const sprite = new PIXI.Sprite(this.texture);
                sprite.anchor.set(0.5, 0.5);
                return sprite;
            }

            applySkinTexture() {
                this.skinSprite.texture = this.skinTexture;
                this.skinSprite.scale.set(this.skinSize * (2 * this.textureSize / this.skinTexture.size));
                this.refreshBodyTexture();
            }

            removeSkinTexture() {
                // Going through the getter would *create* a skin sprite just to blank it, which
                // is exactly what happens tearing down a cell whose skin never finished loading
                if (!this._skinSprite) return;
                this._skinSprite.removeAllListeners();
                this._skinSprite.texture = PIXI.Texture.EMPTY;
                this.refreshBodyTexture();
            }

            get skinSprite() {
                if (!this._skinSprite) {
                    this._skinSprite = new PIXI.Sprite();
                    this._skinSprite.zIndex = 0;
                    this._skinSprite.anchor.set(0.5, 0.5);
                    this.uiRoot.addChild(this._skinSprite);
                }
                return this._skinSprite;
            }
        }

        /**
         *  Players can have skins and names
         */

        class PlayerSpriteRenderer extends SpriteRenderer {
            init(node) {
                super.init(node);
                this.setName();
                this.setSkin();
            }

            destroy() {
                this.removeName();
                this.removeSkin();
                super.destroy();
            }

            clean() {
                this.removeName();
                this.removeSkin();
                super.clean();
            }

            get skinSize() { console.error("This node has no type!") };
        }

        /**
         *  Cells can have mass labels
         */

        class CellSpriteRenderer extends PlayerSpriteRenderer {
            init(node) {
                super.init(node);
                this.setSize();
            }

            destroy() {
                this.removeMass();
                super.destroy();
            }

            clean() {
                this.removeMass();
                super.clean();
            }

            updateBorder() {
                if (this.skinTexture) this.skinSprite.scale.set(this.skinSize * (2 * this.textureSize / this.skinTexture.size));
                // Through refreshBodyTexture rather than a direct write, or toggling the border
                // would strip the rim off every skinned cell currently wearing one
                this.refreshBodyTexture();
            }

            get texture() { return this.game.cellTexture };
            get textureSize() { return this.game.cellSize; }
            get skinSize() { return this.game.settings.settings.borderlessCells ? 1 : 0.96; }
        }

        class VirusSpriteRenderer extends PlayerSpriteRenderer {
            get texture() { return this.game.virusTexture; }
            get textureSize() { return this.game.virusSize; }
            get skinSize() { return 0.88; }
        }

        class FoodSpriteRenderer extends SpriteRenderer {
            /**
             *  Food and ejected mass are a single tinted sprite - no skin, no name, no mass
             *  label - so the container that exists to group those is pure overhead. Dropping it
             *  halves the display objects for far and away the most numerous node in the game,
             *  and every one saved is a transform the renderer no longer walks.
             */
            createRoot() {
                this.sprite = this.createSprite();
                return this.sprite;
            }

            init(node) {
                super.init(node);

                /**
                 *  tick() folds this into root.visible, and a hidden node is culled outright -
                 *  it returns before any interpolation and never reaches the render pipe.
                 *
                 *  Ejected mass answers to its own setting rather than to Hide Food. It is
                 *  gameplay rather than scenery, so hiding it along with the pellets was wrong;
                 *  but in a feed mode it is both the most numerous food node and the only one
                 *  that draws a border, so the players who hide food for the frames in the first
                 *  place need some way to drop it.
                 */
                this.hidden = this.node.isEjected
                    ? this.game.settings.settings.hideEjectedMass
                    : this.game.settings.settings.hideFood;

                this.root.rotation = this.node.rotation; 
            }

            get texture() { 
                if (!this.node) return PIXI.Texture.EMPTY;
                // shape is 0/1/2 - pentagon, hexagon, circle - matching foodTextures' order
                return this.game.foodTextures[this.node.shape]; 
            }

            get textureSize() { return this.game.foodSize; }
        }

        /**
         *  The Node base class provides state. While it also provides the means of interpolating size/position for animations,
         *  these animations may soon be moved to each respective Renderer.
         *
         *  Node only holds a reference to Renderer, but a Renderer knows everything about its attached Node.
         */

        class Node {
            constructor(game, nodeData = {}) {
                this.game = game;
                this.init(nodeData);
            }

            init(nodeData = {}) {
                const { 
                    id = 0, 
                    parent = -1, 
                    x = 0,
                    y = 0,
                    size = 1,
                    name = null,
                    rgb = '',
                    lockedPosition = null,
                    lockedColor = null,
                    skin = null,
                    color = 0,
                    isEjected = false
                } = nodeData;

                this.id = id;
                this.parent = parent;

                this.x = x;
                this.y = y;

                this.name = name;
                this.skin = skin;
                this.size = size;
                this.lockedPosition = lockedPosition;
                this.lockedColor = lockedColor;
                // As the server sent it. Independent of actual cell color as affected by custom themes
                this.baseColor = color;
                this.baseRgb = rgb;

                // Set before applyTheme(), not after: FoodNode.themeKey reads it, and deriving
                // the colour first left every ejected node reading it as undefined and taking
                // the food theme anyway on the frame it spawned
                this.isEjected = isEjected;

                // Now we can customize the color
                this.applyTheme();

                this.lastUpdate = this.game.updateTime;

                this.eaten = false;
                this.hunterId = null;
                this.animationDelay = this.game.settings.settings.animationDelay;
            }

            /**
             *  Prepare node to return to its Pool.
             *  Death (getting eaten) is a state, so of course it's located here rather than in the Renderer.
             */

            getEatenBy(hunter) {
                this.eaten = true;
                // Hand off now rather than a fade later, while there is still something alive
                // to hand off to - see repointAliveCell()
                this.game.repointAliveCell(this);
                // Falls back to the wall clock for the window before the first frame has set
                // updateTime - an undefined start would make the fade's progress NaN, and a NaN
                // alpha is an invisible cell that never retires
                this.eatenAt = this.game.updateTime || performance.now();

                // Max distance is 3x cell radius
                this.eatenMaxDist = this.size * 3;

                // Where it died, so every re-aim is measured from the same origin instead of
                // compounding frame over frame
                this.eatenX = this.x;
                this.eatenY = this.y;

                this.size *= 0.5;

                if (!hunter) return;

                // Held by id, not by reference: nodes are pooled, so a stored hunter can quietly
                // come back as an entirely different cell
                this.hunterId = hunter.id;

                this.trackHunter();
            }

            /**
             *  Re-aims a corpse at where its hunter is *now*.
             *
             *  The target used to be a single snapshot taken at the moment of the eat, so a
             *  hunter that kept moving - which is most of them - left its kill sliding toward a
             *  point it had long since left, and the further it ran the more obviously the
             *  corpse drifted off to nowhere.
             *
             *  The clamp is the original's: the corpse never travels more than three of its own
             *  radii from where it died, so a hunter that runs swings the target around the
             *  death spot rather than dragging the body across the map.
             */
            trackHunter() {
                if (this.hunterId === null) return;

                const hunter = this.game.nodes.get(this.hunterId);
                if (!hunter) return; // eaten, or dropped out of view - keep the last target

                // The drawn position rather than the last one off the wire, since that is the
                // cell the corpse visibly disappears into
                const hunterX = hunter.renderer?.x ?? hunter.x;
                const hunterY = hunter.renderer?.y ?? hunter.y;

                const dx = hunterX - this.eatenX;
                const dy = hunterY - this.eatenY;
                const dist = Math.hypot(dx, dy);

                const moveDist = Math.min(dist, this.eatenMaxDist);
                const invDist = dist > 0 ? 1 / dist : 0;

                this.x = this.eatenX + dx * invDist * moveDist;
                this.y = this.eatenY + dy * invDist * moveDist;
            }

            applyTheme() {
                const key = this.themeKey;
                const override = key === null ? null : this.game.customTheme[key];

                if (override == null) {
                    this.color = this.baseColor;
                    this.rgb = this.baseRgb;
                    return;
                }

                this.color = this.themeReplaces ? override : filterColor(this.baseColor, override);
                // Derived from the final color rather than the raw override, so the minimap dot
                // and leaderboard entry agree with the cell instead of drifting from it
                this.rgb = cssColorFrom(this.color);
            }

            debug(...args) {
                console.debug(`[Node ${this.id}]`, ...args);
            }
            get type() { console.error("This node has no type!"); }

            // Which customTheme slot recolors this node type, and how. Tinting preserves the
            // per-cell variation the server sent; replacing ignores it outright.
            get themeKey() { return null; }
            get themeReplaces() { return false; }
        }

        // Since the decoupling of each Node and Renderer type, all Node types have wrapped back around to being essentially the same thing state-wise.
        // I'm keeping it around in case, say, we wanted to pass only relevant state fields to each constructor
        //
        // Ex. lockedColor ---> CellNode
        //     lockedColor -X-> FoodNode
        //
        // I'll end up doing this by just creating base/player/etc data objects

        class FoodNode extends Node {
            get type() { return nodeType.Food; }

            /**
             *  Ejected mass is a food node to the renderer, but to everyone looking at it it is
             *  a player's mass - it carries the colour of whoever spat it out, and that is how
             *  you tell whose it is. The food theme recolouring it threw that away, so it keeps
             *  the colour the server sent and only real food answers to the theme.
             */
            get themeKey() { return this.isEjected ? null : 'food'; }
            get shape() {
                if (this._shape == null) {
                    this._shape = Math.floor(Math.random() * 3);
                }
                return this._shape;
            }
            get rotation() {
                if (!this._rotation) {
                    this._rotation = Math.random() * Math.PI * 2; 
                }
                return this._rotation;
            }
        }

        class CellNode extends Node {
            get type() { return nodeType.Player; }
            get themeKey() { return 'players'; }
        }

        class VirusNode extends Node {
            get type() { return nodeType.Virus; }
            get themeKey() { return 'virus'; }
            // Viruses arrive in a single color, so a tint would have no variation to preserve
            get themeReplaces() { return true; }
        }

        class Pool {
            constructor(game) {
                this.game = game;
                this.playerPool = [];
                this.virusPool = [];
                this.foodPool = [];

                /**
                 *  `ceiling` is a memory guard, not the working capacity - see capacityFor().
                 *  The old fixed caps (512/128/256) were far under what a busy lobby holds, so
                 *  almost every node checked out was built from scratch and almost every node
                 *  returned was thrown away: a 4000-node spawn measured 17.3ms, against 4.3ms
                 *  once the pool could actually hold them.
                 */
                this.config = {
                    [nodeType.Player]: {
                        pool: 'playerPool',
                        ceiling: 8192,
                        size: 128,
                        node: CellNode,
                        renderer: CellSpriteRenderer,
                    },
                    [nodeType.Virus]: {
                        pool: 'virusPool',
                        ceiling: 1024,
                        size: 64,
                        node: VirusNode,
                        renderer: VirusSpriteRenderer,
                    },
                    [nodeType.Food]: {
                        pool: 'foodPool',
                        ceiling: 16384,
                        size: 128,
                        node: FoodNode,
                        renderer: FoodSpriteRenderer,
                    }
                }

                for (const cfg of Object.values(this.config)) {
                    cfg.live = 0;   // checked out right now
                    cfg.peak = cfg.size; // most that have ever been out at once
                }
            };

            /**
             *  How many spares this type is allowed to keep.
             *
             *  Pinned to the most of that type ever live at once, which is exactly the number
             *  needed for the worst case - every one of them dying in the same frame - and never
             *  more: a pool can only ever hold what was checked out, so `pool.length + live` can
             *  never exceed the high-water mark. Sizing to it means a settled lobby stops
             *  building and destroying renderers altogether.
             *
             *  The ceiling only exists so one freak lobby cannot pin that memory for the rest of
             *  the session. Nothing shrinks the pool back down after a spike below it.
             */
            capacityFor(cfg) {
                return Math.min(cfg.ceiling, cfg.peak);
            }

            createNode(type, nodeData = {}) {
                const cfg = this.config[type];

                const node = new cfg.node(this.game, nodeData);
                const renderer = new cfg.renderer(this.game);

                renderer.init(node);

                return node;
            }

            populate(cb) {
                this.playerPool = [];
                this.virusPool = [];
                this.foodPool = [];
                for (const [type, cfg] of Object.entries(this.config)) {
                    cfg.live = 0;
                    cfg.peak = cfg.size;
                    // Straight onto the pool rather than through putNode(), which counts a
                    // return and would drive `live` negative for nodes never checked out
                    for (let i = 0; i < cfg.size; i++) {
                        const node = this.createNode(type);
                        node.renderer.clean();
                        this[cfg.pool].push(node);
                    }
                }
                cb?.();
            }

            getNode(type, nodeData) {
                const cfg = this.config[type];
                const pool = this[cfg.pool];

                if (++cfg.live > cfg.peak) cfg.peak = cfg.live;

                const node = pool.pop();

                if (node) {
                    node.init(nodeData);
                    node.renderer.init(node);
                    return node;
                }

                return this.createNode(type, nodeData);
            }

            putNode(node) {
                const cfg = this.config[node.type];
                const pool = this[cfg.pool];

                if (cfg.live > 0) cfg.live--;

                if (pool.length < this.capacityFor(cfg)) {
                    node.renderer.clean();
                    pool.push(node);
                } else {
                    node.renderer.destroy();
                }
            }
        }

        // The following class was initially stolen and obfuscated on Germs with a deliberate change from  
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
        class PingWriter {
            constructor() {
                this._writer = new BinaryWriter(1);
                this._writer.writeUInt8(100);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class ProtocolWriter {
            constructor(nQ) {
                this._writer = new BinaryWriter();
                this._writer.writeUInt8(0x7b);
                this._writer.writeUInt8(0x6);
                this._writer.writeStringZeroUtf8(nQ);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class LoginWriter {
            constructor(nT) {
                this._writer = new BinaryWriter();
                this._writer.writeUInt8(0xff);
                this._writer.writeStringZeroUnicode(nT);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class SpectateWriter {
            constructor() {
                this._writer = new BinaryWriter(1);
                this._writer.writeUInt8(1);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class NameWriter {
            constructor(nY) {
                this._writer = new BinaryWriter();
                this._writer.writeUInt8(0);
                this._writer.writeStringZeroUtf8(nY);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class ChatWriter {
            constructor(o1, o2) {
                this._writer = new BinaryWriter();
                this._writer.writeUInt8(0x56);
                this._writer.writeInt32(o2);
                this._writer.writeStringZeroUtf8(o1);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class MouseWriter {
            constructor(o5, o6) {
                this._writer = new BinaryWriter();
                this._writer.writeUInt8(16);
                this._writer.writeDouble(~~o5);
                this._writer.writeDouble(~~o6);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class SplitWriter {
            constructor(/*amount*/
            ) {
                // Amount from 1-4
                this._writer = new BinaryWriter(1);
                this._writer.writeUInt8(17);
                /* Server would queue splits for the next `amount` game ticks
                this._writer.writeUInt8(amount); 
                */
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class EjectWriter {
            constructor() {
                this._writer = new BinaryWriter(1);
                this._writer.writeUInt8(21);
            }
            build() {
                return this._writer.toBuffer();
            }
        }
        class PartyWriter {
            constructor(of, og) {
                this._writer = new BinaryWriter();
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

        /**
         *  Builds an outgoing packet.
         *
         *  Companion to BinaryReader above, and on the same footing: a growable Uint8Array with
         *  a DataView over it, rather than node's Buffer. Only the methods something actually
         *  sends are here - writeInt8, writeInt16, writeUInt32, writeFloat, writeBytes and
         *  getLength had no caller anywhere in the file and are gone with the vendoring.
         */
        const WRITER_CHUNK = 1024;

        class BinaryWriter {
            constructor(size) {
                if (!size || size <= 0) size = WRITER_CHUNK;
                this._bytes = new Uint8Array(size);
                this._view = new DataView(this._bytes.buffer);
                this._length = 0;
            }

            /**
             *  Grows to fit `size` more bytes, in whole chunks like the Buffer version did, so
             *  a packet built a byte at a time reallocates a handful of times rather than once
             *  per write.
             */
            checkAlloc(size) {
                const needed = this._length + size;
                if (this._bytes.length >= needed) return;

                const grown = new Uint8Array(Math.ceil(needed / WRITER_CHUNK) * WRITER_CHUNK);
                grown.set(this._bytes.subarray(0, this._length));
                this._bytes = grown;
                this._view = new DataView(grown.buffer);
            }

            writeUInt8(value) {
                this.checkAlloc(1);
                this._bytes[this._length++] = value;
            }
            writeUInt16(value) {
                this.checkAlloc(2);
                this._view.setUint16(this._length, value, true);
                this._length += 2;
            }
            writeInt32(value) {
                this.checkAlloc(4);
                this._view.setInt32(this._length, value, true);
                this._length += 4;
            }
            writeDouble(value) {
                this.checkAlloc(8);
                this._view.setFloat64(this._length, value, true);
                this._length += 8;
            }

            writeStringUtf8(value) {
                const encoded = UTF8_ENCODER.encode(value);
                this.checkAlloc(encoded.length);
                this._bytes.set(encoded, this._length);
                this._length += encoded.length;
            }

            /**
             *  UTF-16LE, which TextEncoder cannot produce - it only speaks UTF-8. Written a code
             *  unit at a time, which is what Buffer's 'ucs2' did: surrogate pairs go out as the
             *  two units they already are, and nothing is normalised on the way.
             */
            writeStringUnicode(value) {
                this.checkAlloc(value.length * 2);
                for (let i = 0; i < value.length; i++) {
                    this._view.setUint16(this._length, value.charCodeAt(i), true);
                    this._length += 2;
                }
            }

            writeStringZeroUtf8(value) {
                this.writeStringUtf8(value);
                this.writeUInt8(0);
            }
            writeStringZeroUnicode(value) {
                this.writeStringUnicode(value);
                this.writeUInt16(0);
            }

            reset() { this._length = 0; }

            // Copied rather than subarray'd, so a later write into the growable backing store
            // cannot change a packet already handed to the socket
            toBuffer() { return this._bytes.slice(0, this._length); }
        }

        const packet = {
            'Ping': PingWriter,
            'Protocol': ProtocolWriter,
            'Login': LoginWriter,
            'Spectate': SpectateWriter,
            'Name': NameWriter,
            'Chat': ChatWriter,
            'Mouse': MouseWriter,
            'Split': SplitWriter,
            'Eject': EjectWriter,
            'Party': PartyWriter
        };
        ;const oj = 'g-h';
        const ok = ['6', '9'];
        const ol = ['4', '2', '0'];
        const om = (oo, op, oq) => {
            return ok[oo] + ol[op] + ok[oq];
        }
        ;
        ;class Network {
            constructor(game) {
                this.game = game;
                this.open = false;
                // Paced off the server's own rate rather than a guess - see SPLIT_JITTER_MARGIN
                this.tickPeriod = SERVER_TICK_ESTIMATE;
                this.lastTickAt = 0;
                this.tickAnchor = undefined;
                // Seeded at the value that reproduces SPLIT_JITTER_MARGIN exactly, so a fresh
                // connection paces the way it always did until it has measured something
                this.tickJitter = SPLIT_JITTER_MARGIN / (SPLIT_JITTER_SIGMAS * JITTER_ABS_TO_GAP_SD);
                this.ping = Date.now();
                this.searching = false;
                this.verifying = false;
                this.verified = false;
                // See verify() and flushSpectate()
                this.verifyWait = null;
                this.resolveVerify = null;
                this.spectatePending = false;
                this.flushingSpectate = false;
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
                if (!ow) {
                    mode = 'FFA';
                    ow = this.findMode(mode);
                }
                // ow[0], not `mode`: connect() accepts either a mode key or a server name, and
                // storing the raw argument meant lastMode could hold something like
                // "NA Self Feed 1". network.mode is seeded from it on the next page load, so the
                // daily leaderboard would then ask the board for a server name, get nothing back
                // and hide itself until a connection re-established the real mode.
                this.game.settings.setItem('lastMode', ow[0]);
                var oz = ow[1];
                const previousMode = this.mode;
                this.mode = ow[0];
                if (this.mode !== previousMode) {
                    // Lets the daily leaderboard panel clear its (now wrong-mode) display and
                    // refetch immediately, instead of showing stale data until its next poll.
                    window.postMessage({ __germsfox: true, type: 'modeChange', mode: this.mode }, '*');
                }
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

            // One node packet per server tick, so their spacing is the server's rate as seen
            // from here - jitter and all, which averages out.
            noteServerTick() {
                const now = performance.now();
                const gap = now - this.lastTickAt;
                if (gap < TICK_COALESCE_MS) return;
                this.lastTickAt = now;
                if (gap > TICK_STALL_MS) {
                    // A hiccup says nothing about the rate, and re-anchoring on one would drag
                    // the phase estimate a whole slot sideways. Restart the grid from here.
                    this.tickAnchor = now;
                    return;
                }
                this.tickPeriod += (gap - this.tickPeriod) * TICK_EMA;

                if (this.tickAnchor === undefined) { this.tickAnchor = now; return; }

                /**
                 *  Where this arrival fell against the grid we have been predicting. Skipped
                 *  ticks are fine - the slot index absorbs them - but a packet landing in the
                 *  slot we are already anchored on is one tick smeared across two messages
                 *  rather than a new one, and its "residual" would be the smear, not jitter.
                 */
                const slots = Math.round((now - this.tickAnchor) / this.tickPeriod);
                if (slots < 1) return;

                const residual = now - (this.tickAnchor + slots * this.tickPeriod);
                this.tickAnchor += slots * this.tickPeriod + residual * TICK_PHASE_EMA;
                this.tickJitter += (Math.abs(residual) - this.tickJitter) * TICK_JITTER_EMA;
            }

            /**
             *  The margin is whichever is larger: the hand-tuned constant, or what this
             *  connection has actually been measured to need.
             *
             *  Deliberately one-directional. On a clean line the measurement comes in under
             *  SPLIT_JITTER_MARGIN and nothing changes - the constant is already about four
             *  sigma there, so there is no speed to win and shaving it would only trade a
             *  0.008% chance of losing a split per macro for a 1% one. The case this exists
             *  for is the other end: a player whose line jitters three times as much gets no
             *  warning today, just splits that quietly collapse. There the margin widens on
             *  its own.
             */
            get splitSpacing() {
                const measured = this.tickJitter * JITTER_ABS_TO_GAP_SD * SPLIT_JITTER_SIGMAS;
                const margin = Math.max(SPLIT_JITTER_MARGIN, measured);
                return Math.min(SPLIT_SPACING_MAX,
                    Math.max(SPLIT_SPACING_MIN, this.tickPeriod + margin));
            }
            async sendNick(oK) {
                // Spawning supersedes any spectate still waiting on verification
                this.spectatePending = false;
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
                if (value == '' || value == 'None') {
                    this.skin = '';
                } else {
                    this.skin = value;
                }
            }
            /**
             *  Spectating is an intent that survives until it actually takes effect, rather
             *  than one packet fired at whatever moment the button happened to be clicked.
             *
             *  Two windows used to swallow it. send() is a no-op while the socket is closed, so
             *  a Spectate built during a reconnect went nowhere and nothing retried it; and the
             *  server ignores one that arrives before verification. Either way the client had
             *  already hidden the menu and set freeSpec, so it looked like it had worked while
             *  no node stream ever arrived - and the only way out was to reopen the menu and
             *  click again. Holding the intent lets onOpen and handleRestart flush it the
             *  moment both conditions are true.
             */
            sendSpectate() {
                this.spectatePending = true;
                this.flushSpectate();
            }

            async flushSpectate() {
                if (!this.spectatePending || this.flushingSpectate) return;

                this.flushingSpectate = true;
                try {
                    await this.verify();

                    // Re-checked after awaiting: the connection can have dropped in the
                    // meantime, and the intent is deliberately left set so the next onOpen
                    // picks it up instead of the packet being quietly discarded.
                    if (!this.spectatePending || !this.open || !this.verified) return;

                    this.spectatePending = false;
                    this.send(new packet.Spectate());
                } finally {
                    this.flushingSpectate = false;
                }
            }
            sendMouse(oO) {
                if (!this.game.freeze && document.getElementById("menu").style.display == "none")
                    this.send(new packet.Mouse(oO.x,oO.y));
            }
            sendChat(oP, oQ) {
                this.send(new packet.Chat(oP,oQ));
            }
            /**
             *  Resolves once the server has acknowledged verification (handleRestart), or as
             *  soon as the connection goes away - so nothing is left waiting on a socket that
             *  is never coming back. Callers must therefore re-check `verified` and `open`
             *  after awaiting rather than assuming both.
             *
             *  One shared wait, not one per caller. This used to open an interval per call and
             *  keep the handle in a single field, so a second verify() overwrote the first
             *  one's handle: whichever interval fired first cleared the *other* one and
             *  resolved only its own promise, leaving the loser pending forever. Clicking
             *  Spectate while another verify() was already in flight - a second click, or a
             *  Play attempt - was a click that silently did nothing, which is exactly the
             *  "press escape and click it again" symptom.
             */
            verify() {
                if (this.verified) return Promise.resolve();

                if (!this.verifyWait) {
                    this.verifyWait = new Promise(resolve => { this.resolveVerify = resolve; });
                }
                if (!this.verifying) this.tryVerifyCf();

                return this.verifyWait;
            }

            // Releases anyone awaiting verify(), whether it succeeded or the socket went away
            settleVerify() {
                if (!this.resolveVerify) return;
                const resolve = this.resolveVerify;
                this.verifyWait = null;
                this.resolveVerify = null;
                resolve();
            }
            sendVerification() {
                if (this.cfToken) {
                    this.send(new packet.Protocol(om(0, 2, 1) + 'TbU2&9b$4eRq' + 'bruh' + 'TbU2&9b$4eRq' + this.cfToken));
                }
            }
            tryVerify() {
                if (!this.token) {
                    if (this.game.playerCells.size > 0) {
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
                    if (this.game.playerCells.size > 0) {
                        return;
                    }

                    this.verifying = true;

                    // disable play button
                    const playButton = document.getElementById("play");
                    const playButtonIcon = playButton.querySelector("i");
                    playButton.disabled = true;
                    playButtonIcon.classList = "fas fa-spinner fa-spin";
                    playButton.classList.add("disabled");

                    this.turnstileId = turnstile.render('.turnstile', {
                        'sitekey': '0x4AAAAAAADbCnxCCnFv3yIA',
                        'theme': 'dark',
                        'appearance': 'interaction-only',
                        'callback': token => {
                            this.verifying = false;
                            this.cfToken = token;
                            this.sendVerification();
                            $('.turnstile-container').hide();
                            turnstile.remove(this.turnstileId);
                            this.turnstileId = null;
                            
                            // enable play button
                            const playButton = document.getElementById("play");
                            const playButtonIcon = playButton.querySelector("i");
                            playButton.disabled = false;
                            playButtonIcon.classList = "fas fa-play";
                            playButton.classList.remove("disabled");
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
                // Release anything still waiting on the previous connection's verification
                this.settleVerify();
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
                // A spectate clicked before this connection existed is still waiting
                this.flushSpectate();
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
                const now = Date.now() / 1000;
                if (this.game.login.lockedExpire && 
                    this.game.login.lockedExpire - now > 0) {
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
                    case 0x12:
                    case 20:
                        this.handleClear();
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
                        this.handlePong();
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
                if (this.game.playerCells.size > 0) {
                    this.game.refreshAds();
                    this.game.deathTimeout = setTimeout(this.game.onDeath.bind(this.game), 100);
                } else {
                    this.game.showMenu();
                }
                this.game.clearNodes();
                this.open = false;
                // Nothing should be left awaiting verification on a socket that has closed
                this.settleVerify();
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

            handleLevel(reader) {
                this.game.login.setXP(reader.readUInt32());
                if (reader.readUInt8() == 1) {
                    this.game.login.setCoins(this.game.login.coins + reader.readUInt32());
                }
            }

            handlePong() {
                var p4 = Date.now();
                var p5 = p4 - this.ping;
                this.game.ping = p5;
            }

            handlePartyCode(p6) {
                var p7 = p6.readStringZeroUtf8();
                if (p7 == 'invalid') {
                    return this.game.exitParty();
                }
                this.game.inParty = true;
                this.game.partyCodeJoined = p7;
                // The server has confirmed this tab is in, so the other tabs can follow it in -
                // see announcePartyCode()
                this.game.announcePartyCode(p7);
                this.game.syncPartyUI();
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
                    let ph = '#' + ((1 << 0x18) + (pe << 16) + (pf << 8) + pg).toString(16).slice(1);
                    let pi = p8.readInt32();
                    let pj = p8.readInt32();
                    let pk = p8.readInt32();
                    var pl;
                    if (this.game.party && this.game.party.hasOwnProperty(pc)) {
                        pl = this.game.party[pc];
                        pl.targetX = pj;
                        pl.targetY = pk;
                    } else {
                        pl = new PartyMember(this.game,pc,pi,pj,pk,pd);
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

            handleAddNode(po) {
                if (this.game.myCells.size == 0) {
                    this.game.startTime = Date.now();
                }
                const id = po.readUInt32();
                this.game.myCells.add(id); // id of node owned by player

                if (this.game.nodes.has(id)) {
                    // This has never fired once, but I'm keeping it
                    console.warn("!!!!! CAUGHT EXISTING NODE OWNED BY PLAYER !!!!!");
                    const node = this.game.nodes.get(id);
                    if (!this.game.aliveCell) this.game.aliveCell = node;
                    this.game.playerCells.add(node);
                }
            }

            handleNodes(buffer) {
                this.noteServerTick();

                let eatCount = buffer.readUInt16();
                for (let i = 0; i < eatCount; i++) {
                    let hunter = this.game.nodes.get(buffer.readUInt32());
                    let eaten = this.game.nodes.get(buffer.readUInt32());

                    if (!eaten) continue;

                    if (document.hidden) {
                        this.game.removeNode(eaten);
                        continue;
                    }

                    eaten.getEatenBy(hunter);

                    if (!hunter || !this.game.playerCells.has(hunter)) continue;

                    if (eaten.parent == -1) { // No parent means it's not a player
                        this.game.foodEaten++;
                    } else {
                        this.game.cellsEaten++;
                    }
                }

                while (true) {
                    let id = buffer.readUInt32();
                    if (id == 0)
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
                    let hasLocked = flags & 16;
                    let isEjected = flags & 32;
                    let hasParent = flags & 64;

                    let skin = null;
                    let name = null;
                    let color = null;
                    let rgb = null;
                    let parent = -1;
                    let lockedColor = null;
                    let lockedPosition = null;

                    if (hasLocked) {
                        lockedColor = buffer.readUInt32();
                        lockedPosition = buffer.readUInt8();
                    }
                    if (hasParent) parent = buffer.readInt32();
                    if (hasColor) {
                        let r = buffer.readUInt8();
                        let g = buffer.readUInt8();
                        let b = buffer.readUInt8();
                        rgb = `rgb(${r}, ${g}, ${b})`;
                        color = (r << 16) + (g << 8) + b;
                        
                    }
                    if (hasSkin) skin = buffer.readStringZeroUtf8().substr(1);
                    if (hasName) name = buffer.readStringZeroUtf8().trim().removeWideChars();

                    let node = this.game.nodes.get(id);
                    if (!node) {
                        // New node — determine type from flags
                        let type = nodeType.Food;
                        if (hasParent && !isVirus && !isEjected) {
                            type = nodeType.Player;
                        } else if (isVirus) {
                            type = nodeType.Virus;
                        }
                        
                        // Colour goes through untouched - each Node type applies the theme to
                        // itself in applyTheme(), which is also what lets a theme change take
                        // effect on cells that already exist.
                        const nodeData = {
                            id: id,
                            parent: parent,
                            x: x,
                            y: y,
                            size: size,
                            name: name,
                            color: color,
                            rgb: rgb,
                            skin: skin,
                            lockedColor: lockedColor,
                            lockedPosition: lockedPosition,
                            isEjected: isEjected
                        };

                        node = this.game.pool.getNode(type, nodeData);

                        this.game.addNode(node);
                        
                        continue; // Because state is clean
                    }
                    
                    // Since the node exists, just update its state 
                    node.x = x;
                    node.y = y;
                    node.size = size;

                    /**
                     *  Colour is state like any other: a cell carries a new one when its owner
                     *  disconnects and turns grey, and reading it only on the packet that
                     *  created the node left those cells their old colour for the rest of their
                     *  lives.
                     *
                     *  Written through baseColor and re-derived rather than assigned to `color`
                     *  directly, the same way a theme change does it - the displayed colour is
                     *  always derived from the server's, so whatever theme is running survives
                     *  the update instead of being painted over.
                     */
                    if (hasColor && color !== node.baseColor) {
                        node.baseColor = color;
                        node.baseRgb = rgb;
                        node.applyTheme();
                        node.renderer.refreshColor();
                    }

                    // ...And its rendered mass sprite
                    if (node.type === nodeType.Player) node.renderer.setSize();
                }

                let destroyCount = buffer.readUInt16();
                for (let i = 0; i < destroyCount; i++) {
                    let node = this.game.nodes.get(buffer.readUInt32());
                    if (node && !node.eaten) {
                       this.game.removeNode(node);
                    }
                }

                if (GF_DIAG.on) {
                    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, n = 0;
                    for (const node of this.game.nodes.values()) {
                        if (node.eaten) continue;
                        n++;
                        if (node.x < minX) minX = node.x;
                        if (node.x > maxX) maxX = node.x;
                        if (node.y < minY) minY = node.y;
                        if (node.y > maxY) maxY = node.y;
                    }
                    if (n > 0) {
                        GF_DIAG.recv.push({
                            t: performance.now(), n,
                            cx: (minX + maxX) / 2, cy: (minY + maxY) / 2,
                            w: maxX - minX, h: maxY - minY,
                            camX: this.game.camera.x, camY: this.game.camera.y,
                        });
                        if (GF_DIAG.recv.length > 6000) GF_DIAG.recv.shift();
                    }
                }

                // Whole packet is settled now - safe to read mass/score/cell count.
                this.game.ui.updateDebugHTML();

            }

            handleBorder(pW) {
                this.game.setBorder(pW.readDouble(), pW.readDouble(), pW.readDouble(), pW.readDouble());
                this.game.myID = pW.readUInt32();
            }
            handleLeaderboardText(reader) {
                const amount = reader.readUInt16();

                let leaderboard = [];
                for (let i = 0; i < amount; i++) {
                    leaderboard.push(reader.readStringZeroUtf8());
                }
                this.game.leaderboard = leaderboard;

                this.game.ui.updateLeaderboardHTML();
            }
            handleLeaderboardFFA(reader) {
                const amount = reader.readUInt16();
                let leaderboard = [];
                for (let i = 0; i < amount; i++) {
                    const rank = reader.readUInt16();
                    const id = reader.readUInt32();
                    leaderboard.push({
                        'rank': rank,
                        'id': id,
                        'name': reader.readStringZeroUtf8()
                    });
                }
                this.game.leaderboard = leaderboard;
                this.game.ui.updateLeaderboardHTML();
            }
            handleClear() {
                this.game.clearNodes();
            }
            handleRestart(reader) {
                this.verified = true;
                this.settleVerify();
                this.flushSpectate();
                this.restart = reader.readStringZeroUnicode();
                $('#resetCenter').show();
                this.game.ui.updateDebugHTML();
            }
            handleRadius(reader) {
                this.game.radius = reader.readDouble();
            }
            handleChat(reader) {
                let parent = reader.readInt32();
                let channel = reader.readInt32();
                var r = reader.readUInt8()
                  , g = reader.readUInt8()
                  , b = reader.readUInt8()
                  , color = (r << 16 | g << 8 | b).toString(16);
                while (color.length < 6) {
                    color = '0' + color;
                }
                color = '#' + color;
                let sender = reader.readStringZeroUtf8();
                let message = reader.readStringZeroUtf8();
                this.game.chat.onMessage(sender, color, message, parent, channel);
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
            fetchServers(qv) {
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
                        this.connect(this.mode, true);
                    } else {
                        for (var qx in this.modes) {
                            var qy = this.modes[qx];
                            if (qy.default == true) {
                                this.connect(qx, true);
                            }
                        }
                    }
                    this.searching = false;
                }
                );
            }
        }
        /**
         *  Settings a tab keeps to itself when the rest are synced across tabs.
         *
         *  Everything here describes *this* instance rather than how the client behaves, which
         *  is the line the sync draws: a preference belongs to the person and should follow them
         *  to every tab, while these belong to the cell in front of them and would clobber each
         *  other the moment two tabs were doing anything different.
         *
         *    nick, skin                      what this instance plays as
         *    lockedColor, lockedPosition     its locked name, sent at login - see sendLocked()
         *    deathCount                      a counter this tab accumulated on its own
         *    lastMode                        rewritten on every connect, and read only by the
         *                                    next one, so syncing it would have tabs on
         *                                    different modes overwriting each other for nothing
         *
         *  `zoom` is deliberately not here: it is only ever written while syncZoom is on, so
         *  that toggle is what decides whether the camera follows - see Camera.setZoom().
         */
        /**
         *  The values createDropdown() offers for showNames/showSkins in dom.js, in the order
         *  the cycle steps through them.
         */
        const DISPLAY_PREFERENCES = ['all', 'party', 'self', 'none'];

        /**
         *  Edge arrows pointing at party members who are off screen.
         *
         *  The texture is germs' own arrow, 256px and white, so it takes a tint cleanly and
         *  points along +X at rotation 0 - which is what lets the angle be atan2 of the offset
         *  with nothing to correct for.
         */
        const PARTY_ARROW_SIZE = 52;      // on-screen pixels along the arrow's long axis
        const PARTY_ARROW_MARGIN = 34;    // how far the tip sits in from the edge
        const PARTY_ARROW_ALPHA = 0.85;

        /**
         *  Slack, in screen pixels, before a member counts as off screen.
         *
         *  Without it a member hovering exactly on the boundary flickers an arrow on and off
         *  every frame as they drift back and forth across it.
         */
        const PARTY_ARROW_HYSTERESIS = 8;

        const SETTINGS_NOT_SYNCED = new Set([
            'nick',
            'skin',
            'lockedColor',
            'lockedPosition',
            'deathCount',
            'lastMode',
        ]);

        class Settings {
            constructor(game) {
                this.game = game;
                this.settings = JSON.parse(window.localStorage.getItem('settings') || '{}');
                this.default = {
                    'nick': '',
                    'skin': '',
                    'theme': 'hex',
                    'color': 'gray',
                    // Node colors default to unset so the server's own colours come through
                    // untouched. The two scene colors do have defaults: the background tracks
                    // the selected color preset, and the border keeps the green drawGrid() used
                    // to hardcode as its fallback.
                    'customTheme': {
                        virus: null,
                        food: null,
                        players: null,
                        background: null,
                        border: 0x00FF00
                    },
                    'controls': {
                        'Split': [32, 'Space'],
                        'Feed': [0x57, 'W'],
                        'Double': [0x44, 'D'],
                        'Triple': [0x52, 'R'],
                        '16x': [0x54, 'T'],
                        'Freeze': [0x46, 'F'],
                        'Vertical': [0x56, 'V'],
                        'Hide': [0x48, 'H'],
                        // This key was already present in stored settings with no row and no
                        // handler behind it, left over from when the game had a spectate key.
                        // Both exist again - see ensureSpectateControlRow() and onKeyDown() -
                        // and the default matches the value those stored settings already
                        // carry, so a fresh profile and an old one land on the same key.
                        'Spectate': [0x50, 'P']
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
                    'hideEjectedMass': false,
                    'hideBorder': false,
                    'lockedColor': '#FF0000',
                    'lockedPosition': '#FF0000',
                    'disableProfanityFilter': false,
                    'deathCount': 0,
                    // Begin Germsfox settings
                    'lastMode': 'FFA',
                    'highQualitySkins': false,
                    'borderlessCells': false,
                    'cameraDelay': 45,
                    'cellOpacity': 100,
                    'zoomSensitivity': 50,
                    'shortenMass': true,
                    'hideMapGrid': true,
                    'dynamicLinesplitAxis': true,
                    'diagonalLinesplits': true,
                    'webGPU': false,
                    'deathFreecam': true,
                    // Whether scroll zoom follows across multiboxed tabs, and the zoom it
                    // carries. The value is only written while the toggle is on - see
                    // Camera.setZoom() - so nothing changes for anyone who leaves it off.
                    'oldSplitMacros': false,
                    'partyArrows': true,
                    'syncZoom': false,
                    'zoom': null,
                    'acidMode': false,
                    'bruhMode': false,
                    'display': 'performance',
                    'blockedSkins': [],
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
                for (var key in this.default.customTheme) {
                    if (this.settings.customTheme.hasOwnProperty(key) == false) {
                        this.settings.customTheme[key] = this.default.customTheme[key];
                        this.save();
                    } else if (key === 'background'
                            && this.settings.customTheme[key] === COLOR_PRESETS[this.settings.color]) {
                        // An earlier build wrote the chosen preset into this slot, which now
                        // reads as a deliberate custom color and would leave every colour
                        // button unselected. Exactly matching the active preset means it was
                        // written by that sync rather than picked, so hand it back.
                        this.settings.customTheme[key] = null;
                        this.save();
                    } else if (Array.isArray(this.settings.customTheme[key])) {
                        // Migration: slots used to hold [number, cssString]. The string half went
                        // stale against the number the moment a color was tinted, so only the
                        // number is stored now and the css form is derived where it's needed.
                        this.settings.customTheme[key] = this.settings.customTheme[key][0];
                        this.save();
                    }
                }
                this.settings.blockedSkins = new Set(this.settings.blockedSkins || []);
            }
            ready() {
                this.game.setSkin(this.getItem('skin'));
                this.game.setTheme(this.getItem('theme'), `#theme-${this.getItem('theme')}`);
                // Deliberately not setColor(): that means "the user pressed a preset", which
                // stands down any custom background. On startup we only reflect what is stored.
                this.game.syncColorButtons();

                [
                    'nick',
                    'showNames',
                    'showSkins',
                    'animationDelay'
                ].forEach(id => {
                    document.getElementById(id).value = this.getItem(id);
                });

                [
                    'showMass',
                    'skipDeathScreen',
                    'hideXP',
                    'hideChat',
                    'hideFood',
                    'hideBorder',
                    'disableProfanityFilter',
                    'autoZoom'
                ].forEach(id => {
                    document.getElementById(id).checked = this.getItem(id);
                });

                this.refreshControlInputs();

                this.game.renderTheme();
            }

            /**
             *  Puts one synced value back into whatever control shows it.
             *
             *  Every settings row the game has - and every row germsfox injects beside them,
             *  see addToggle()/addSlider() - names its input after the setting, so the id is
             *  the only thing this needs to know. Without it a change made in another tab
             *  would take effect here but leave this tab's settings pane showing the old
             *  value, which reads as the sync having failed.
             *
             *  Only inputs are touched: a key with no row simply has nothing to update, and a
             *  key that happens to collide with some other element's id must not be written to.
             */
            refreshSettingInput(key, value) {
                const input = document.getElementById(key);
                if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement)) return;

                if (input.type === 'checkbox') {
                    input.checked = !!value;
                    return;
                }

                input.value = value;

                // Sliders carry their current value in a tooltip built by addSlider()
                const tooltip = document.getElementById(`${key}Tooltip`);
                if (tooltip) tooltip.textContent = value;
            }

            /**
             *  Puts the stored keybinds back into germs' own Controls pane.
             *
             *  Split out of ready() so a rebind arriving from another tab can refresh the boxes
             *  without the rest of it: ready() also re-applies the skin and theme, which write
             *  settings of their own, and a sync that saved on receipt would bounce the change
             *  back at the tab that sent it.
             *
             *  Derived from the controls themselves rather than a fixed list, so a binding added
             *  later - Spectate, which has no row in the page's own markup - is covered without
             *  this having to be kept in step. See ensureSpectateControlRow().
             */
            refreshControlInputs() {
                for (const key in this.settings.controls) {
                    const input = document.getElementById('key' + key);
                    if (input) input.value = this.settings.controls[key][1] ?? '';
                }
            }
            getItem(key) {
                return this.settings[key];
            }
            setItem(key, value) {
                this.settings[key] = value;

                this.save();
                this.applySideEffect(key, value);
                // Same as a change arriving from another tab - see applyRemote(). Keeps the
                // settings pane honest when something other than the control itself moved it.
                this.refreshSettingInput(key, value);
            }

            /**
             *  Everything a settings change has to do besides being stored.
             *
             *  Split out of setItem() so a change arriving from another tab can run it without
             *  writing the blob straight back out again - see applyRemote(). Anything in here
             *  has to tolerate being called for a value that is already in this.settings.
             */
            applySideEffect(key, value) {
                switch (key) {
                    case 'acidMode':
                        if (!this.game.settings.settings.webGPU) {
                            this.game.renderer.clearBeforeRender = !value;
                            this.game.renderer.preserveDrawingBuffer = !value;
                        }
                        break;
                    case 'webGPU':
                        const acidModeInput = document.getElementById("acidMode").parentElement.parentElement;
                        acidModeInput.style.display = value ? "none" : "block";
                        break;
                    case 'cameraDelay':
                        this.game.camera.cameraDelay = value;
                        break;
                    case 'zoom':
                        // fromSync, or applying what another tab sent would schedule a write of
                        // the same value straight back at it
                        if (value != null) this.game.camera.setZoom(value, true);
                        break;
                    case 'zoomSensitivity':
                        this.game.camera.zoomSensitivity = value;
                        break;
                    case 'cellOpacity':
                        this.game.cellOpacity = Number(value) / 100;
                        // Below full opacity a skinned body shows through its own skin, so every
                        // live cell has to reconsider which body texture it is wearing
                        for (const node of this.game.nodes.values()) {
                            const renderer = node.renderer;
                            if (!node.eaten) renderer.root.alpha = renderer.opacity;
                            renderer.refreshBodyTexture?.();
                        }
                        break;
                    case 'animationDelay':
                        for (const node of this.game.nodes.values()) {
                            node.animationDelay = value;
                        }
                        break;
                    case 'customTheme':
                        this.game.applyTheme();
                        this.game.drawGrid();
                        this.game.syncColorButtons();
                        this.game.refreshThemeUI();
                        break;
                    case 'hideBorder':
                    case 'hideMapGrid':
                        if (this.game.grid)
                            this.game.drawGrid();
                        break;
                    case 'borderlessCells':
                        this.game.cellTexture = value ? this.game.spriteSheet.textures.borderlessCell : this.game.spriteSheet.textures.cell;
                        for (const node of this.game.nodes.values()) {
                            if (node.type !== nodeType.Player) continue;
                            node.renderer.updateBorder();
                        }
                        for (const node of this.game.pool.playerPool) {
                            if (node.renderer.sprite) node.renderer.sprite.texture = this.game.cellTexture;
                        }
                        break;
                    case 'highQualitySkins':
                    case 'blockedSkins':
                        for (const node of this.game.nodes.values()) {
                            if (node.type === nodeType.Player) {
                                node.renderer.setSkin(node.skin);
                            }
                        }
                        break;
                    case 'showSkins':
                        for (const node of this.game.nodes.values()) {
                            if (node.type !== nodeType.Player) continue;
                            if (node.renderer.canDisplay(value)) {
                                node.renderer.setSkin(node.skin);
                            } else {
                                node.renderer.removeSkin();
                            }
                        }
                        break;
                    case 'showNames':
                        for (const node of this.game.nodes.values()) {
                            if (node.type !== nodeType.Player) continue;
                            if (node.renderer.canDisplay(value)) {
                                node.renderer.setName();
                            } else {
                                node.renderer.removeName();
                            }
                        }
                        break;
                    case 'showMass':
                        for (const node of this.game.nodes.values()) {
                            if (node.type !== nodeType.Player) continue;
                            if (value) {
                                node.renderer.setSize();
                            } else {
                                node.renderer.removeMass();
                            }
                        }
                        break;
                    case 'hideFood':
                    case 'hideEjectedMass':
                        /**
                         *  Re-derived per node rather than assigned `value`, which is what the
                         *  two settings sharing one flag demands: assigning it made toggling
                         *  either one overwrite what the other said, and left live nodes
                         *  disagreeing with what init() does for the very next spawn - so
                         *  whether ejected mass was culled came down to whether it happened to
                         *  exist when the switch was flipped.
                         */
                        for (const node of this.game.nodes.values()) {
                            if (node.type !== nodeType.Food) continue;
                            node.renderer.hidden = node.isEjected
                                ? this.settings.hideEjectedMass
                                : this.settings.hideFood;
                        }
                        break;
                    case 'hideXP':
                        $('#xpCenter').toggle(!value);
                        break;
                }
            }

            /**
             *  Applies a settings blob written by another tab.
             *
             *  germs' settings live in one localStorage key, and the browser fires a `storage`
             *  event in every *other* tab of the origin whenever it is rewritten - so the sync
             *  needs no transport of its own, only somewhere to land. See the listener in
             *  start().
             *
             *  Deliberately never calls save(). Writing here would fire the same event straight
             *  back at the tab that sent it, and while a diff would find nothing to do, every
             *  tab would still pay a parse per change forever - and the one side effect that is
             *  not idempotent would flicker.
             */
            applyRemote(incoming) {
                let controlsChanged = false;

                for (const key in incoming) {
                    const value = incoming[key];
                    if (SETTINGS_NOT_SYNCED.has(key)) continue;

                    /**
                     *  blockedSkins is held as a Set and saved as an array, so it arrives as the
                     *  wrong type to compare or store - rebuilt rather than assigned, or every
                     *  single change would look like this one changed too.
                     */
                    if (key === 'blockedSkins') {
                        const current = [...(this.settings.blockedSkins ?? [])];
                        const next = value ?? [];
                        if (current.length === next.length && next.every(skin => current.includes(skin))) continue;

                        this.settings.blockedSkins = new Set(next);
                        this.game.updateBlockedSkins();
                        continue;
                    }

                    // Cheap and order-insensitive enough for settings, and the only thing that
                    // has to be right is "did this change", not how
                    if (JSON.stringify(this.settings[key]) === JSON.stringify(value)) continue;

                    this.settings[key] = value;

                    if (key === 'controls') {
                        this.game.controls = value;
                        controlsChanged = true;
                        continue;
                    }

                    this.applySideEffect(key, value);
                    this.refreshSettingInput(key, value);
                }

                // Only the keybind boxes, not the whole of ready() - see refreshControlInputs()
                if (controlsChanged) this.refreshControlInputs();
            }

            resetControls() {
                this.settings.controls = this.default.controls;
                this.game.controls = this.settings.controls;
                this.save();
                this.ready();
            }
            save() {
                const saveSettings = { ...this.settings };
                saveSettings.blockedSkins = [...(this.settings.blockedSkins instanceof Set
                    ? this.settings.blockedSkins
                    : this.settings.blockedSkins || [])];
            
                window.localStorage.setItem('settings', JSON.stringify(saveSettings));
            }
        }
        class Login {
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
                this.skins = qM.Skins.indexOf(',') > -1 ? qM.Skins.split(',') : qM.Skins.length > 0 ? [qM.Skins] : [];
                this.levels = qM.Shop['Levels'];
                this.premium = qM.Shop.Premium;
                this.locked = qM.Shop['Locked'];
                this.coinShop = qM.Shop.Coins;
                this.bucksShop = qM.Shop.Bucks;
                this['boostShop'] = qM.Shop['Boosts'];
                this.uuid = qM.uuid;
                this.name = qM.Name; // Same value rendered into #loginName below
                this['customSkin'] = parseInt(qM['Custom Skin']) == 1;
                this.lockedExpire = parseInt(qM['LockedExpire']);
                this.xp = parseInt(qM.XP);
                this.coins = parseInt(qM.Coins);
                this.bucks = parseInt(qM.Bucks);
                this.lastReward = parseInt(qM['LastReward']);
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

                if (this.customSkin) {
                    document.getElementById('customSkin').style.display = 'block';
                }

                document.getElementById('shopName').textContent = qM.Name;
                document.getElementById('shopAvatar').src = qM.Avatar;
                document.getElementById('login').innerHTML = qN;

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

                const game = this.game;

                this.picker = new CP(document.getElementById('lockedNameColorPicker'));
                this.picker.set(this.game.settings.getItem('lockedColor'));
                this.picker.on('change', function(qP) {
                    changeSetting('lockedColor', '#' + qP);
                    this.source.style.background = '#' + qP;
                });
                this.picker.on('exit', function() {
                    game.network.sendLocked();
                });

                const lockedNamePositionSelect = document.getElementById('lockedNamePositionSelect');
                lockedNamePositionSelect.value = game.settings.getItem('lockedPosition');
                lockedNamePositionSelect.onchange = function() {
                    changeSetting('lockedPosition', this.options[this.selectedIndex].innerHTML);
                    game.network.sendLocked();
                };
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
                var rg = this.premium.sort( (rh, ri) => {
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
                this.skins = Array.from(new Set(this.skins));
                if (this.skins.length > 0) {
                    $('#paidSkinList').show();
                    $('#paidSkinBadge').show();
                    $('#skinsLoginMessage').hide();
                    for (var rD = this.skins.length - 1; rD >= 0; rD--) {
                        var rE = this.skins[rD];
                        if (rE.trim() != '') {
                            var rF = rE.indexOf('/') > -1 ? this.toTitleCase(rE.split('/')[1]) : rE;
                            $('#paidSkinList').append(`<li id='skinSkin'><img onclick="setSkin('` + rE + `');" loading="lazy" width='85' height='85' src="res/skins/${rE}.png" data-src="res/skins/` + rE + '.png"> <p>' + rF.capitalize() + '</p></li>');
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
                if (su - this.lastReward < st) {
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
                    this.lastReward = sv['\x74\x69\x6d\x65'];
                    this.refresh();
                }
                );
            }
            refresh() {
                var sw = Date.now() / 1000;
                if ($('#menu').is(':visible')) {
                    var sx = 3600 * 24;
                    if (sw - this.lastReward >= sx) {
                        $('#loginGift').removeClass('disabled');
                        $('#giftTimer').text('Free Gift!');
                    } else {
                        $('#loginGift').addClass('disabled');
                        var sy = new Date(this.lastReward * 1000);
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

        class Game {
            constructor() {
                this.width = 800;
                this.height = 600;
                this.updateTime = performance.now();
                this.startTime = performance.now();
                this.delta = 1;
                this.frames = 1;
                // No round trip has been measured yet - and undefined here poisons anything
                // that does arithmetic with it, see leadCamera()
                this.ping = 0;
                this.myID = -1;
                this.hideUI = false;
                this.freeze = false;
                this.linesplit = false;
                this.freeSpec = false;
                // Party member the spectate camera is following, if any - see spectatePartyMember()
                this.spectateTarget = null;
                // Backs the aliveCell accessor, which pushes spawn and death to the extension
                this._aliveCell = null;
                this.mouse = {
                    'x': 0,
                    'y': 0
                };
                this.nodes = new Map();         // Map of all nodes by ID
                this.nodeCountRoot = 0;         // sqrt(nodes.size), refreshed once per render()
                this.playerCells = new Set();   // Set of player's cell nodes
                this.myCells = new Set();       // Set of player's cell IDs
                this.leaderboard = [];
                this.border = [-10000, -10000, 10000, 10000];
                // Texture caches
                // Game objects
                this.settings = new Settings(this);
                this.skins = new SkinCache(this);
                this.names = new NameCache(this);
                this.camera = new Camera(this);
                this.network = new Network(this);
                this.ui = new GameUI(this);
                this.login = new Login(this);
                this.chat = new Chat(this);
                this.pool = new Pool(this);
                this.splitQueue = [];     // see queueSplits()
                this.lastSplitAt = 0;
                this.lastSplitRush = false;
                this.splitTimer = null;
                this.foodEaten = 0;
                this.lastColor = null; // color/skin of the last cell we were alive as
                this.lastSkin = null;
                this.highestMass = 0;
                this.lastSubmittedMass = 0; // highestMass at the last community-leaderboard submission
                this.timeAlive = 0;
                this.leaderboardTime = 0;
                this.cellsEaten = 0;
                this.topPosition = 999;
                this.onLeaderboard = false;
                this.controls = this.settings.getItem('controls');
                this.customTheme = this.settings.getItem('customTheme'); // Reduce lookups
                this.theme = 2;
            }

            async waitForGermsfoxURL() {
                while (!window.__germsfoxURL) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                return window.__germsfoxURL;
            }
            async start() {
                const extensionURL = await this.waitForGermsfoxURL();
                await this.chat.loadGermsfoxEmotes(extensionURL);

                await PIXI.Assets.init({
                    basePath: extensionURL + 'src/overrides/res/assets/',

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
                                alias: 'sheet',
                                src: 'texture.json'
                            }, {
                                // germs' own arrow, copied in beside the other textures rather
                                // than fetched from the site at runtime - see partyArrows()
                                alias: 'arrow',
                                src: 'arrow.png'
                            }]
                        }]
                    }
                });

                this.canvas = document.getElementById('gameCanvas');

                this.renderer = await PIXI.autoDetectRenderer({
                    gcActive: false,
                    preference: (this.settings.settings.webGPU ? 'webgpu' : "webgl"),
                    canvas: this.canvas,
                    antialias: true,
                    resolution: window.devicePixelRatio,
                    powerPreference: 'high-performance',
                    backgroundColor: 0x333439,

                    webgl: {
                        clearBeforeRender: !this.settings.settings.acidMode,
                        preserveDrawingBuffer: this.settings.settings.acidMode,
                    },

                    /**
                     *  The format the swap chain is configured with.
                     *
                     *  PIXI leaves this at TextureSource.defaultOptions.format, a hard-coded
                     *  'bgra8unorm', whatever the device actually wants. Where the two disagree
                     *  Chrome warns "WebGPU canvas configured with a different format than is
                     *  preferred by this device" and puts a conversion copy of the whole frame
                     *  in front of every present.
                     *
                     *  Asked of the device rather than named, so this is not a swap of one
                     *  hard-coded format for another: an adapter that prefers bgra8unorm - which
                     *  most Windows and macOS ones do - gets bgra8unorm back and nothing changes
                     *  for it. It only ever agrees with whatever is in front of it.
                     *
                     *  In this block rather than at the top level so it reaches the renderer
                     *  only when the WebGPU backend is the one that got picked: autoDetectRenderer
                     *  merges as {...options, ...options.webgpu} and deletes the sub-objects, so
                     *  a WebGL fallback never sees the field. Spread conditionally rather than
                     *  set to undefined, which would override the default instead of leaving it
                     *  alone - navigator.gpu does not exist at all in some browsers, and
                     *  getPreferredCanvasFormat is only defined where WebGPU is.
                     */
                    webgpu: {
                        ...(navigator.gpu?.getPreferredCanvasFormat
                            ? { format: navigator.gpu.getPreferredCanvasFormat() }
                            : {}),
                    },

                    eventFeatures: {
                        move: false,
                        click: false,
                        wheel: false,
                        globalMove: false
                    },
                });

                growUniformBatch(this.renderer);

                await document.fonts.load('bold 32px Ubuntu');

                // Has to follow the await - installing before the face resolves bakes a
                // fallback font into the atlas, and the atlas is rasterized only once.
                installMassFont();

                this.stage = new PIXI.Container();
                this.stage.eventMode = 'none';

                this.bgContainer = new PIXI.Container();
                this.stage.addChild(this.bgContainer);

                // Renderers parked since the last compaction pass - see compactCellContainer()
                this.parkedRoots = 0;
                this.cellContainer = new PIXI.Container();
                this.cellContainer.sortableChildren = true;
                this.stage.addChild(this.cellContainer);

                /**
                 *  Screen-space overlay, drawn over the cells.
                 *
                 *  A child of the stage like everything else, but positioned and scaled each
                 *  frame to undo the camera transform the stage carries - see render() - so its
                 *  own children are placed in plain screen pixels and keep a constant size
                 *  however far the view is zoomed.
                 */
                this.hudContainer = new PIXI.Container();
                this.stage.addChild(this.hudContainer);

                console.log('%cGerms.io %c(' + (this.renderer.type === 2 ? "WebGPU" : this.renderer.type ? "WebGL" : "Canvas") + ')%c\n~ Germsfox 1.3.9.3 ~', 'font-size:70px;padding:5px;font-family:Ubuntu,Roboto,Segoe UI;font-weight:700;color:white;', 'font-size:20px;padding-left:3px;padding-right:15px;font-family:Ubuntu,Roboto,Segoe UI;font-weight:700;color:rgb(100,100,100);', 'font-size:20px;padding-left:70px;padding-right:15px;font-family:Ubuntu,Roboto,Segoe UI;font-weight:500;color:#00ff00;');

                $(window).trigger('resize');

                await PIXI.Assets.loadBundle('ballgame');

                this.spriteSheet = PIXI.Assets.get('sheet');

                this.gridTexture = PIXI.Assets.get('grid');
                this.gridTexture.source.scaleMode = 'nearest';
                this.gridTexture.source.autoGenerateMipmaps = true;
                this.hexTexture = PIXI.Assets.get('hex');
                this.arrowTexture = PIXI.Assets.get('arrow');
                this.hexTexture.source.autoGenerateMipmaps = true;

                // Cached rather than read through settings on every checkout and every frame of
                // every corpse's fade
                this.cellOpacity = this.settings.settings.cellOpacity / 100;
                this.cellTexture = this.settings.settings.borderlessCells ? this.spriteSheet.textures.borderlessCell : this.spriteSheet.textures.cell;
                this.virusTexture = this.spriteSheet.textures.virus;
                this.foodTextures = [this.spriteSheet.textures.food1, this.spriteSheet.textures.food2, this.spriteSheet.textures.food3];

                this.bruh = new Audio(`${extensionURL}sound/bruh.mp3`);

                this.cellSize = this.cellTexture.frame.width / 2;
                this.virusSize = this.virusTexture.frame.width / 2;
                this.foodSize = this.foodTextures[0].frame.width / 2;

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

                    this.network.fetchServers(region);

                    $('#loader').fadeOut();

                    setInterval(this.counter.bind(this), 1000);
                    setInterval(this.sendMouse.bind(this), MOUSE_SEND_PERIOD);
                    setInterval(this.refreshMenuAds.bind(this), 120 * 1000);
                    setInterval(this.submitLeaderboardScore.bind(this), 30 * 1000);
                    
                    this.skins.startCleanupInterval(10000);
                    this.names.startCleanupInterval(1000);

                    this.ticker = new PIXI.Ticker();

                    this.ticker.add(this.render.bind(this));

                    this.ticker.start();
                });
            }

            skinURLFrom(skin) {
                return skin.includes('i.imgur.com/') ? skin : skin.includes('.png') ? 'res/skins/' + skin : 'res/skins/' + skin + '.png';
            }

            counter() {
                if (this.onLeaderboard) {
                    this.leaderboardTime++;
                }
                if (this.playerCells.size > 0) {
                    this.timeAlive++;
                }
            }
            
            calcMouse() {
                let newX = (this.rawMouseX - this.width / 2) / this.camera.renderZoom + this.camera.x;
                let newY = (this.rawMouseY - this.height / 2) / this.camera.renderZoom + this.camera.y;

                if (!this.linesplit) {
                    // TODO renderer.tint is not a thing. Make it a thing
                    if (this.linesplitCell && this.linesplitCell.renderer.tint !== this.linesplitCell.color) {
                        this.linesplitCell.renderer.tint = this.linesplitCell.color;
                    }
                    this.linesplitCell = null;
                    this.linesplitAxis = undefined;
                    this.linesplitOrigin = null;
                } else {
                    if (this.linesplitCell?.eaten) {
                        if (this.linesplitCell.renderer.tint !== this.linesplitCell.color)
                            this.linesplitCell.renderer.tint = this.linesplitCell.color;
                        this.linesplitCell = null;
                        // axis and origin intentionally preserved
                    }

                    if (!this.linesplitCell) {
                        if (this.linesplitAxis !== undefined) {
                            this.linesplitCell = this.getCellOnAxis(newX, newY);
                        } else {
                            this.linesplitCell = this.getLinesplitCell(newX, newY);
                            if (!this.settings.settings.dynamicLinesplitAxis) {
                                this.linesplitAxis = this.getLinesplitAxis(newX, newY);
                            }
                        }
                    }

                    if (this.linesplitCell) {
                        // Highlight cell
                        const r = (((this.linesplitCell.color >> 16) & 0xff) + 255) >> 1;
                        const g = (((this.linesplitCell.color >> 8) & 0xff) + 255) >> 1;
                        const b = ((this.linesplitCell.color & 0xff) + 255) >> 1;
                        if (this.linesplitCell.renderer.tint !== (r << 16) | (g << 8) | b)
                            this.linesplitCell.renderer.tint = (r << 16) | (g << 8) | b;

                        // Update axis and origin while waiting for first split if the user wants
                        if (this.splitPending || this.linesplitAxis === undefined) {
                            if (this.splitPending && this.settings.settings.dynamicLinesplitAxis)
                                this.linesplitAxis = this.getLinesplitAxis(newX, newY);
                            this.linesplitOrigin = { x: this.linesplitCell.x, y: this.linesplitCell.y };
                        }

                        // Constrain mouse to axis
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

            isOnLinesplitAxis(x, y) {
                const dx = x - this.linesplitOrigin.x;
                const dy = y - this.linesplitOrigin.y;

                switch (this.linesplitAxis) {
                    case 0: return Math.abs(dy) === 0;
                    case 2: return Math.abs(dx) === 0;
                    case 1: return Math.abs(dx - dy) < 5;
                    case 3: return Math.abs(dx + dy) < 5;
                    default: return false;
                }
            }
            getLinesplitAxis(mouseX, mouseY) {
                if (!this.linesplitCell) return null;

                const dx = mouseX - this.linesplitCell.x;
                const dy = mouseY - this.linesplitCell.y;

                if (this.settings.settings.diagonalLinesplits) {
                    return ((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 4) + 4) % 4;
                }

                return Math.abs(dx) >= Math.abs(dy)
                    ? 0   // E/W
                    : 2;  // N/S
            }

            getCellOnAxis(mouseX, mouseY) {
                if (!this.linesplitOrigin) return null;
                let bestCell = null;
                let bestDist = 99999; // The lower the better
            
                for (const id of this.myCells) {
                    const cell = this.nodes.get(id);
                    if (!cell || cell.eaten || !this.isOnLinesplitAxis(cell.x, cell.y)) continue;
                    const dist = Math.sqrt((cell.x - mouseX) ** 2 + (cell.y - mouseY) ** 2);
                    if (dist < bestDist) { 
                        bestDist = dist;
                        bestCell = cell;
                    }
                }

                if (bestCell === null)
                    this.linesplitAxis = undefined;
                return bestCell;
            }

            getLinesplitCell(mouseX, mouseY) {
                let largestSize = 0;
                for (const cell of this.playerCells) {
                    if (cell.size > largestSize) 
                        largestSize = cell.size;
                }
                let bestCell = null;
                let bestScore = 99999; // The lower the better
                if (this.myCells.size === 0) {
                    this.linesplit = false;
                    this.linesplitCell = null;
                    this.linesplitAxis = undefined;
                    this.linesplitOrigin = null;
                    return null;
                }
            
                for (const id of this.myCells) {
                    const cell = this.nodes.get(id);
                    if (!cell || cell.eaten) continue;
                    const dx = mouseX - cell.x, dy = mouseY - cell.y;
                    const sizeFactor = largestSize / cell.size;
                    const score = Math.sqrt(dx * dx + dy * dy) * (sizeFactor ** 2);
                    if (score < bestScore) { 
                        bestScore = score;
                        bestCell = cell;
                    }
                }
                return bestCell;
            }
            sendMouse() {
                if (this.freeze)
                    return;
                this.calcMouse();
                if (this.mouse && (this.playerCells.size > 0 || (this.freeSpec)) && this.network.open) {
                    /**
                     *  Alive this is movement input and stays the cursor. Spectating it is a
                     *  request for nodes around the view, and the view is the camera - but the
                     *  camera this packet describes has to be the one in front of the player
                     *  when the packet lands, not the one in front of them now. Sending the
                     *  current position asks the server for a view that is already a trip out
                     *  of date, so the edge being panned toward arrives last.
                     */
                    const position = this.playerCells.size > 0 ? this.mouse : this.leadCamera();

                    /**
                     *  A non-finite position is dropped rather than sent, because the filter
                     *  below is a comparison and every comparison against NaN is false: one bad
                     *  value recorded here stops the filter ever passing again, and mouse input
                     *  dies for the rest of the session - through spawning, dying and
                     *  respawning, since nothing clears it. The packet itself would have been
                     *  harmless on its own, arriving as 0,0 after the writer truncated it.
                     */
                    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return;

                    if (GF_DIAG.on && this.freeSpec) {
                        GF_DIAG.sent.push({
                            t: performance.now(), x: position.x, y: position.y,
                            camX: this.camera.x, camY: this.camera.y,
                            dX: this.camera.driftX, dY: this.camera.driftY,
                            lead: this.leadMs(), ping: this.ping,
                        });
                        if (GF_DIAG.sent.length > 6000) GF_DIAG.sent.shift();
                    }
                    if (!this.lastMouseSent || Math.abs(position.x - this.lastMouseSent.x) > 1 || Math.abs(position.y - this.lastMouseSent.y) > 1) {
                        this.network.sendMouse(position);
                        this.lastMouseSent = {
                            'x': position.x,
                            'y': position.y
                        };
                    }
                }
            }

            /**
             *  The camera one upstream trip from now, clamped to the map the same way the pan
             *  itself is - predicting past the border would ask for a view the camera can never
             *  actually reach.
             */
            /**
             *  How far ahead of itself the camera has to aim for the view to be centred by the
             *  time the player actually sees it.
             *
             *  A position sent now arrives at the server one upstream trip from now, is read by
             *  whichever server tick follows, and the nodes it picks reach the screen one
             *  downstream trip after that. So whatever is on screen at any instant was chosen
             *  around a position sent a full round trip ago - a whole ping, not half of one.
             *  Leading by the upstream leg alone still lands half a trip short, which is the
             *  part of the lag that stays visible while the camera is moving fast.
             *
             *  On top of that sit two waits, and only one of them is guessable from here.
             *
             *  The server's own wait is measured, not derived. Stepping the requested view
             *  20000 units with the camera held still and timing the first node to arrive
             *  beyond the old viewport gives onset - ping directly: 1.5 tick periods across six
             *  trials in an empty region (onset 100-120ms at a 53ms ping), tight enough to read
             *  as a mechanism - half a tick to the next boundary, then one whole tick, i.e. the
             *  server queues an incoming position and the tick *after* the one that receives it
             *  is the one that acts on it. This subsumes any wait for the position to be read;
             *  there is no separate term for that. The half tick this used to assume was simply
             *  too small, and that missing tick is most of the lag that showed on fast pans.
             *
             *  The other is display staleness: node packets are a tick apart and the one on
             *  screen stays until the next replaces it, so what the player is looking at is
             *  half a tick old again. That leg was missing outright.
             *
             *  1.5 + 0.5 is why this is two whole tick periods. Both legs are read off the
             *  measured tickPeriod so a server on a different rate paces itself, and it assumes
             *  MOUSE_SEND_PERIOD is about one tick, which it is - sending much slower than the
             *  server ticks would need a send-quantisation term of its own.
             *
             *  Not a constant, though: the same measurement in a crowded region gave 2.8 ticks
             *  (onset 140-180ms), so the wait grows with server load and this leads short under
             *  it. One tick is deliberately the low end - over-leading starves the edge behind
             *  you, which is its own visible artefact, and the server streams a box roughly
             *  1.1-1.7x the screen width, so a few hundred units of slack absorbs the rest.
             *  Re-measure with util/leadprobe.js rather than guessing.
             *
             *  Finally, camera.x is only recomputed in render() while this fires off its own
             *  interval, so it is up to a frame stale by the time it is read - the lead is
             *  measured from the frame it belongs to, not from now.
             */
            leadMs() {
                // Number.isFinite, not truthiness: ping is legitimately 0 before the first pong
                const rtt = Number.isFinite(this.ping) ? this.ping : 0;
                /**
                 *  Clamped, because a backgrounded tab pauses requestAnimationFrame while this
                 *  interval keeps firing: camera.x would sit still for seconds while driftX
                 *  held its last value, and an unbounded age would extrapolate that stale
                 *  velocity right off the map. One send period is already longer than a frame
                 *  at any frame rate worth predicting for. (Observed at 80s during testing.)
                 */
                const cameraAge = Math.min(MOUSE_SEND_PERIOD, Math.max(0, performance.now() - this.updateTime));
                return cameraAge + rtt + this.network.tickPeriod * 2;
            }

            leadCamera() {
                const lead = this.camera.predict(this.leadMs());
                return {
                    x: Math.min(Math.max(lead.x, this.border[0]), this.border[1]),
                    y: Math.min(Math.max(lead.y, this.border[2]), this.border[3]),
                };
            }

            render(tick) {
                this.updateTime = performance.now();

                this.delta = Math.min(1, Math.max(0, tick.deltaTime));
                // How many 60Hz frames this one was worth, deliberately NOT clamped - the camera
                // compounds it rather than multiplying by it, so a long frame is caught up with
                // instead of overshot. See Camera.tick().
                this.frames = Math.max(0, (tick.deltaMS || MS_PER_DELTA) / MS_PER_DELTA);

                this.nodeCountRoot = Math.sqrt(this.nodes.size); // For mass label zoom threshold
                this.rememberAppearance();

                // Before the node loop so every renderer culls against the same viewport.
                // camera.tick() runs after the loop, so this trails a frame - the margin in
                // isVisible() covers it.
                this.camera.updateBounds();

                for (const node of this.nodes.values()) {
                    node.renderer.tick();
                }

                if (this.aliveCell) {

                    // Get alive player cells and base camera position off each cell's size relative to total size
                    let playerCellsAlive = 0;

                    let totalSize = 0;
                    let cameraX = 0;
                    let cameraY = 0;

                    for (const cell of this.playerCells) {
                        if (cell.eaten)
                            continue;

                        playerCellsAlive++;

                        totalSize += cell.size;

                        cameraX += cell.renderer.x * cell.size;
                        cameraY += cell.renderer.y * cell.size;
                    }

                    if (playerCellsAlive > 0 && totalSize > 0) {
                        this.camera.setPosition(
                            cameraX / totalSize,
                            cameraY / totalSize
                        );
                    }
                } else {
                    /**
                     *  Following a party member takes the camera off the cursor entirely - see
                     *  spectatePartyMember().
                     *
                     *  handleParty() rebuilds the party every packet, so a member who is dead or
                     *  momentarily absent simply stops appearing in it. That is a gap to wait
                     *  out rather than an exit, so the target is never cleared here.
                     */
                    const tracking = this.freeSpec && this.spectateTarget !== null;
                    const tracked = tracking ? (this.party?.[this.spectateTarget] ?? null) : null;

                    if (tracking && !tracked) {
                        /**
                         *  The member is not in the party right now - dead, or simply missing
                         *  between packets. The camera holds where it is rather than handing
                         *  itself back to the cursor: they are usually about to respawn, and
                         *  dropping to a free pan would throw the view somewhere else at the
                         *  exact moment you were watching them.
                         *
                         *  Nothing is written to the camera target, so it stays on their last
                         *  known position, settles there and waits - and the branch below picks
                         *  them straight back up the moment a packet has them again. Leaving the
                         *  party for good therefore parks the camera until the mode key is
                         *  pressed, which is the deliberate trade for not losing a respawn.
                         */
                        this.camera.driftX = 0;
                        this.camera.driftY = 0;
                    } else if (tracked) {
                        /**
                         *  Eased through setPosition() rather than placed, which is the opposite
                         *  of how the jump into tracking works and for the opposite reason: this
                         *  runs every frame, so letting camera.tick() close the gap is what makes
                         *  following somebody look smooth instead of locking rigidly to them.
                         */
                        this.camera.driftX = 0;
                        this.camera.driftY = 0;
                        this.camera.setPosition(tracked.x, tracked.y);
                    } else if (this.freeSpec && this.mouse) {
                        /**
                         *  Spectate pans by how far the cursor is from the middle of the screen,
                         *  on a curve rather than in proportion: the target is placed
                         *  reach * (distance / reach) ^ SPECTATE_CURVE from the camera, in the
                         *  direction of the cursor, and camera.tick() lerps toward it.
                         *
                         *  The curve is what stands in for a dead zone. Cubed, a tenth of the
                         *  way out moves the target a thousandth of the reach, so the middle of
                         *  the screen is near enough motionless and fine positioning costs
                         *  nothing - while the edges still pan quickly. A hard dead zone did the
                         *  same job but left a boundary you could feel yourself cross; this just
                         *  fades in, and there is no radius to tune against screen size.
                         *
                         *  Worked in screen space because that is where the curve is specified -
                         *  dividing by renderZoom at the end puts the offset back into world
                         *  units, so it feels the same however far the view is zoomed out.
                         */
                        const zoom = this.camera.renderZoom;
                        const dx = this.rawMouseX - this.width / 2;
                        const dy = this.rawMouseY - this.height / 2;
                        const distance = Math.hypot(dx, dy);

                        // Half the screen diagonal - the furthest the cursor can get from the
                        // middle - so the ratio below lands in 0..1 whatever the aspect ratio
                        const reach = Math.hypot(this.width, this.height) / 2;
                        const offset = reach * Math.pow(distance / reach, SPECTATE_CURVE);

                        const scale = distance > 0 && zoom > 0 ? offset / distance / zoom : 0;

                        /**
                         *  The rate the camera is about to travel at, in world units per
                         *  millisecond, so sendMouse() can lead the server by one trip.
                         *
                         *  Now that Camera.tick() closes the same fraction per unit of time
                         *  rather than per frame, this is just a rate: a 60Hz frame covers
                         *  1/FREE_SPEC_SPEED of the offset, so a millisecond covers that over
                         *  MS_PER_DELTA. It needed the measured frame time back when the camera
                         *  was frame-rate dependent, and no longer does.
                         */
                        const perMs = scale / (MS_PER_DELTA * FREE_SPEC_SPEED);
                        this.camera.driftX = dx * perMs;
                        this.camera.driftY = dy * perMs;

                        const targetX = scale ? this.camera.x + dx * scale : this.camera.x;
                        const targetY = scale ? this.camera.y + dy * scale : this.camera.y;

                        this.camera.setPosition(
                            Math.min(Math.max(targetX, this.border[0]), this.border[1]),
                            Math.min(Math.max(targetY, this.border[2]), this.border[3])
                        );
                    }
                }

                this.camera.tick();

                if (this.party) {
                    for (const member in this.party) {
                        this.party[member].updatePos();
                    }
                }

                this.ui.updateMinimap();

                this.cellContainer.sortChildren();
                this.compactCellContainer();

                this.stage.x = this.width / 2 - this.camera.x * this.camera.renderZoom;
                this.stage.y = this.height / 2 - this.camera.y * this.camera.renderZoom;
                this.stage.scale.x = this.camera.renderZoom;
                this.stage.scale.y = this.camera.renderZoom;

                /**
                 *  Cancels the transform above, so anything in the HUD is placed in screen
                 *  pixels from the top-left and drawn at its own size whatever the zoom. Done
                 *  after the stage is positioned and before the arrows are laid out, since they
                 *  are placed in exactly those coordinates.
                 */
                const inverseZoom = this.camera.renderZoom ? 1 / this.camera.renderZoom : 1;
                this.hudContainer.x = this.camera.x - this.width / 2 * inverseZoom;
                this.hudContainer.y = this.camera.y - this.height / 2 * inverseZoom;
                this.hudContainer.scale.set(inverseZoom);

                this.updatePartyArrows();

                /**
                 *  A texture cannot be freed while a batch still lists its source, and blanking
                 *  the sprite that drew it does not take it out of one - see pendingTextureFrees.
                 *  Rebuilding the instruction set does, so frees wait for a frame that rebuilds.
                 *
                 *  The drain sits after render() rather than before it so a frame that throws
                 *  leaves the queue intact to try again, and so nothing is freed until the
                 *  rebuild it was waiting on has actually happened. Costs one rebuild on the
                 *  frames that free something, and nothing at all on the frames that do not.
                 */
                const freeing = pendingTextureFrees.length > 0 && forceInstructionRebuild(this.stage);

                this.renderer.render(this.stage);

                if (freeing) drainTextureFrees();
            }

            /**
             *  Points an arrow at every party member who is off screen.
             *
             *  Each arrow sits where the line from the middle of the screen out to that member
             *  crosses the inset edge rectangle, and is turned to face along that same line, so
             *  it is tangential to the direction they are actually in. Their cell colour is the
             *  tint, which is what makes several of them readable at once.
             *
             *  Sprites are kept per member id and reused - a party is at most a handful of
             *  people, and rebuilding them every frame would churn the batch for nothing.
             */
            updatePartyArrows() {
                if (!this.arrowTexture) return;

                // Switched off still runs the loop below once, so any arrow already on screen
                // is retired rather than left frozen where it was
                const enabled = this.settings.settings.partyArrows;

                const arrows = this.partyArrows ??= new Map();
                const zoom = this.camera.renderZoom;
                const halfWidth = this.width / 2;
                const halfHeight = this.height / 2;

                // The rectangle the tips sit on, and the one a member has to leave before an
                // arrow appears - the gap between them is the hysteresis
                const edgeX = Math.max(1, halfWidth - PARTY_ARROW_MARGIN);
                const edgeY = Math.max(1, halfHeight - PARTY_ARROW_MARGIN);

                /**
                 *  Retired rather than just hidden: a session that meets a lot of different
                 *  party members would otherwise keep a sprite for every one of them for as
                 *  long as it ran. Whoever is still in the party gets theirs shown again below.
                 */
                for (const [id, arrow] of arrows) {
                    if (this.party && id in this.party) {
                        arrow.visible = false;
                        continue;
                    }
                    arrow.destroy();
                    arrows.delete(id);
                }

                if (!enabled || !this.party || !zoom) return;

                for (const id in this.party) {
                    if (this.myID == id) continue;

                    const member = this.party[id];
                    // Offset from the middle of the screen, in screen pixels
                    const dx = (member.x - this.camera.x) * zoom;
                    const dy = (member.y - this.camera.y) * zoom;

                    const outside = Math.abs(dx) > halfWidth + PARTY_ARROW_HYSTERESIS
                        || Math.abs(dy) > halfHeight + PARTY_ARROW_HYSTERESIS;
                    if (!outside) continue;
                    if (dx === 0 && dy === 0) continue;

                    let arrow = arrows.get(id);
                    if (!arrow) {
                        arrow = new PIXI.Sprite(this.arrowTexture);
                        arrow.anchor.set(0.5);
                        arrow.alpha = PARTY_ARROW_ALPHA;
                        // The texture is square, so one scale keeps the arrow in proportion
                        arrow.scale.set(PARTY_ARROW_SIZE / this.arrowTexture.frame.width);
                        this.hudContainer.addChild(arrow);
                        arrows.set(id, arrow);
                    }

                    /**
                     *  Where the ray leaves the rectangle: whichever axis runs out of room
                     *  first decides how far along the direction the tip lands. Guarded against
                     *  a zero component, which is a member on exactly the same row or column.
                     */
                    const scale = Math.min(
                        dx === 0 ? Infinity : edgeX / Math.abs(dx),
                        dy === 0 ? Infinity : edgeY / Math.abs(dy)
                    );

                    arrow.x = halfWidth + dx * scale;
                    arrow.y = halfHeight + dy * scale;
                    arrow.rotation = Math.atan2(dy, dx);
                    arrow.tint = this.colorNumberFrom(member.color);
                    arrow.visible = true;
                }
            }

            /**
             *  '#rrggbb' as the number PIXI wants for a tint. Party colours arrive as the string
             *  handleParty() builds; anything unreadable falls back to white, which tints to
             *  nothing rather than throwing.
             */
            colorNumberFrom(color) {
                const parsed = typeof color === 'string' ? parseInt(color.replace('#', ''), 16) : color;
                return Number.isFinite(parsed) ? parsed : 0xFFFFFF;
            }

            /**
             *  Steps a display preference on, for the keybinds in content.js.
             *
             *  The decision lives here rather than in the extension because every input to it
             *  does: it used to ask over the bridge what the current value was, decide, then
             *  call back to set it. `toggleValues` is the pair to flip between, or null to walk
             *  the whole list.
             */
            cycleDisplayPreference(key, toggleValues) {
                const current = this.settings.getItem(key);
                const next = toggleValues
                    ? (current === toggleValues[0] ? toggleValues[1] : toggleValues[0])
                    : DISPLAY_PREFERENCES[(DISPLAY_PREFERENCES.indexOf(current) + 1) % DISPLAY_PREFERENCES.length];

                this.changeSetting(key, next);
            }

            /** Flips a boolean setting, for the same keybinds. */
            toggleSetting(key) {
                this.changeSetting(key, !this.settings.getItem(key));
            }

            /**
             *  The cell the camera follows, and the one thing that says whether you are alive.
             *
             *  An accessor so that spawning and dying can be pushed to the extension the moment
             *  they happen. That used to be two germsfoxGetState() polls half a second apart,
             *  forever; doing it here instead catches all five places that set or clear it, and
             *  - unlike a per-frame check - still fires in a background tab, where
             *  requestAnimationFrame is throttled to nothing but packets still arrive.
             */
            get aliveCell() { return this._aliveCell; }

            set aliveCell(cell) {
                const wasAlive = !!this._aliveCell;
                this._aliveCell = cell;

                if (!!cell === wasAlive) return;
                window.postMessage({ __germsfox: true, type: 'alive', alive: !!cell }, '*');
            }

            changeSetting(key, value) {
                this.settings.setItem(key, value);
            }

            iframe() {
                try {
                    var hasParent = window === window.parent ? false : true;
                    if (hasParent) {
                        window.parent.location.href = 'https://germs.io';
                        return;
                    }
                } catch (error) {}
            }

            prerollComplete() {
                if (this.playerCells.size == 0) {
                    this.network.sendNick(this.settings.getItem('nick'));
                }
            }

            setNick(name) {
                this.iframe();
                this.network.sendLocked();
                if (this.deathTimeout)
                    clearTimeout(this.deathTimeout);
                this.hideMenu();
                this.settings.setItem('nick', name);
                this.deleteLastKiller();
                this.freeSpec = false;

                if (!this.aliveCell) {
                    this.freeze = false;
                    this.linesplit = false;
                    const deaths = this.settings.getItem('deathCount');
                    if (deaths % 5 == 0 && typeof adplayer !== 'undefined') {
                        try {
                            aiptag.cmd.player.push(function() {
                                adplayer.startPreRoll();
                            });
                        } catch (error) {
                            this.prerollComplete();
                        }
                    } else {
                        this.prerollComplete();
                    }
                }
            }

            setSkin(skin) {
                if (skin === '') return;
                if (skin.includes('imgur')) {
                    if (skin.includes('i.imgur.com/')) {
                        hideSkins();
                        hideShop();
                        this.settings.setItem('skin', skin);
                        this.network.setSkin(skin);
                        $('#skin').css('background-image', 'url(' + skin + ')');
                        $('#skin').addClass('selected');
                    } else {
                        alert('Invalid Imgur Link\n(Must include i.imgur)');
                    }
                } else {
                    hideSkins();
                    hideShop();
                    this.settings.setItem('skin', skin);
                    this.network.setSkin(skin);
                    if (skin == 'None') {
                        $('#skin').css('background-image', 'url(res/noskin.png)');
                        $('#skin').removeClass('selected');
                    } else {
                        const url = 'res/skins/' + encodeURIComponent(skin) + '.png';
                        $('#skin').css('background-image', 'url(' + url + ')');
                        $('#skin').addClass('selected');
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
            /**
             *  Reflects the background actually in force in the #colors radios: the matching
             *  preset while the background is following one, and nothing selected at all once a
             *  custom color has taken over. Leaving a preset lit under a custom color is what
             *  made pressing one feel like it silently reset the custom choice.
             */
            syncColorButtons() {
                const usingCustom = this.settings.getItem('customTheme').background != null;
                $('#colors').find('input').prop('checked', false);
                if (!usingCustom) {
                    $(`#color-${this.settings.getItem('color')}`).siblings('input').prop('checked', true);
                }
            }

            setColor(tz, tA) {
                this.settings.setItem('color', tz);

                // Pressing a preset means "go back to the preset", so any custom background
                // stands down rather than being overwritten by it. The two are mutually
                // exclusive: whichever was chosen last is the one in force, and syncColorButtons
                // keeps the radios honest about which that is. changeSetting redraws the grid and
                // refreshes the panel, so there is no drawGrid or repaint to do here.
                const theme = this.settings.getItem('customTheme');
                theme.background = null;
                this.changeSetting('customTheme', theme);
            }
            spectate() {
                this.iframe();
                if (this.playerCells.size > 0)
                    return this.hideMenu();
                this.deleteLastKiller();
                this.hideMenu();
                this.network.sendSpectate();
                this.freeSpec = true;
                this.spectateTarget = null;
                // No drift carried in from a previous spectate until the first frame recomputes it
                this.camera.driftX = 0;
                this.camera.driftY = 0;
            }
            setBorder(tE, tF, tG, tH) {
                var tI = [tE, tG, tF, tH];
                if (this.border != tI) {
                    if (this.playerCells.size == 0) {
                        this.freeSpec = false;
                        this.mouse.x = 0;
                        this.mouse.y = 0;
                        this.camera.setPosition(0, 0);
                    }
                    this.border = tI;
                    this.drawGrid();
                }
            }
            /**
             *  Re-derives every live node's color. Previously a theme only reached cells that
             *  spawned after it was picked, so changing one left the screen a mix of old and new
             *  until everything had been eaten and respawned.
             */
            applyTheme() {
                // Re-read rather than trusting the cached reference: setItem() is free to store a
                // different object than the one this was first pointed at
                this.customTheme = this.settings.getItem('customTheme');

                for (const node of this.nodes.values()) {
                    node.applyTheme();
                    node.renderer.refreshColor();
                }
            }

            drawGrid() {
                $(window).trigger('resize');
                const colorTheme = this.settings.getItem('color');
                const customTheme = this.settings.getItem('customTheme');
                // != null, not truthiness: 0x000000 is a perfectly good background and used to
                // be silently ignored here for being falsy
                this.renderer.background.color = customTheme.background != null
                    ? customTheme.background
                    : COLOR_PRESETS[colorTheme];

                if (this.grid) {
                    this.bgContainer.removeChild(this.grid);
                    this.grid.destroy({
                        children: true
                    });
                    this.grid = null;
                }
                this.grid = new PIXI.Container();

                const size = this.border[3] * 2;
                let scaleFactor = 0.5;
                let alpha = 0.7;
                let texture = null;

                switch (this.settings.getItem('theme')) {
                case 'hex':
                    texture = this.hexTexture;
                    break;
                case 'grid':
                    texture = this.gridTexture;
                    scaleFactor = 0.7;
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

                    if (colorTheme === 'white' && texture === this.hexTexture) {
                        alpha = 0.3;
                    }
                    if (colorTheme === 'white' && texture === this.gridTexture) {
                        alpha = 0.2;
                    }
                    if (colorTheme === 'black' && texture === this.gridTexture) {
                        alpha = 0.35;
                    }
                    this.tilingSprite.alpha = alpha;
                    this.grid.addChild(this.tilingSprite);
                }
                
                if (!this.settings.settings.hideMapGrid) {
                    const letters = ['A', 'B', 'C', 'D'];
                    const cellSize = size / 4;
                    let color;

                    // todo: how will it adapt to custom background colors?
                    switch (colorTheme) {
                        case 'gray':
                            color = 0x55565f;
                            break;
                        case 'white':
                            color = 0xc0c8cc;
                            break;
                        case 'black':
                            color = 0x262626;
                            break;
                    }

                    for (let row = 0; row < 4; row++) {
                        for (let col = 0; col < 4; col++) {
                            const letter = letters[col];
                            
                            var text = new PIXI.Text({
                                text: letter + (row + 1).toString(),
                                style: {
                                    fontFamily: 'Ubuntu',
                                    fontSize: size / 24,
                                    fill: color,
                                    align: 'center',
                                    fontWeight: 'bold',
                                },
                                anchor: 0.5,
                                alpha: 0.9
                            });

                            // i would remove this and change fontSize above to be (size / 12) instead, but Firefox does not like that x)
                            text.scale.set(1 / scaleFactor, 1 / scaleFactor);
                            text.position.set((-size / 2) + (cellSize * row) + (cellSize / 2), (-size / 2) + (cellSize * col) + (cellSize / 2));

                            this.grid.addChild(text);

                            const gridGraphics = new PIXI.Graphics();
                            const gridSize = Math.round(size / 150);

                            gridGraphics.rect(-cellSize / 2, -cellSize / 2, cellSize, cellSize).stroke({
                                width: gridSize,
                                color: color
                            });
                            
                            gridGraphics.position.set((-size / 2) + (cellSize * row) + (cellSize / 2), (-size / 2) + (cellSize * col) + (cellSize / 2));

                            this.grid.addChild(gridGraphics);
                        }
                    }
                }

                if (!this.settings.getItem('hideBorder')) {
                    const borderGraphics = new PIXI.Graphics();
                    const borderSize = 150;

                    borderGraphics.rect(-borderSize / 2, -borderSize / 2, size + borderSize, size + borderSize).stroke({
                        width: borderSize,
                        color: customTheme.border != null ? customTheme.border : 0x00ff00,
                        alpha: 1
                    });

                    borderGraphics.position.set(-size / 2, -size / 2);

                    this.grid.addChild(borderGraphics);
                }

                this.bgContainer.addChild(this.grid);
            }
            deleteLastKiller() {
                if (this.lastKiller) {
                    this.lastKiller = null;
                }
            }
            clearNodes() {
                this.flushSplits();
                this.deleteLastKiller();
                for (const node of this.nodes.values()) { this.pool.putNode(node); }
                this.nodes.clear();
                this.playerCells.clear();
                this.myCells.clear();
                this.aliveCell = null;
                this.leaderboard = [];
                this.ui.score = 0;
                this.party = null;
                this.camera.setPosition(0, 0);
                this.ui.updateLeaderboardHTML();
                
                // Clear texture caches
                this.names.clear();
                this.skins.clear();
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

            /**
             *  Detaches parked renderers from the cell container once enough have piled up.
             *
             *  clean() deliberately leaves a pooled root attached, because removeChild is an
             *  indexOf plus a splice and doing it per node made a death cascade quadratic. The
             *  bill for that lands here instead: sortChildren and collectRenderables both walk
             *  the entire child list every frame, so a container sized to the lobby's busiest
             *  moment keeps costing after the crowd has gone. Profiled during a max-split
             *  cascade those two came to 2.3ms a frame.
             *
             *  Parked roots carry PARKED_Z_INDEX, so the sort that just ran has already gathered
             *  them into one leading run - and removeChildren() takes a whole range in a single
             *  pass with the render group bookkeeping done properly, which hand-splicing would
             *  not. One O(n) pass every few hundred deaths, rather than an O(n) scan per death.
             */
            compactCellContainer() {
                if (this.parkedRoots < CELL_COMPACT_THRESHOLD) return;
                this.parkedRoots = 0;

                /**
                 *  Sorted here rather than relying on the sort that runs during rendering: that
                 *  one is skipped whenever nothing happened to dirty it, and a backlog parked
                 *  during such a frame then sits scattered through the list where no leading
                 *  slice can reach it - which is exactly how an earlier version of this quietly
                 *  stopped compacting at all. Forcing it costs one sort on the frames that
                 *  actually compact, which is a few hundred deaths apart.
                 */
                const container = this.cellContainer;
                container.sortDirty = true;
                container.sortChildren();

                const children = container.children;
                let parked = 0;
                while (parked < children.length && children[parked].zIndex === PARKED_Z_INDEX) {
                    parked++;
                }

                if (parked > 0) container.removeChildren(0, parked);
            }

            /**
             *  Moves aliveCell off `node` onto a cell that is still alive, or to null when there
             *  is none left.
             *
             *  Driven by a cell being eaten rather than by its corpse being collected. Those are
             *  about a second apart - removeNode() only runs once the fade finishes, see
             *  EATEN_FADE_TIME - and for all of it aliveCell used to point at something dead.
             *  Everything reading it read a corpse: the camera's gate, the leaderboard entry's
             *  colour and skin, the minimap cell, the party name.
             *
             *  Eaten cells are skipped when choosing, which the old version in removeNode() did
             *  not do: the first cell that merely wasn't this one could just as easily be another
             *  corpse mid-fade, which only moved the problem along by one cell.
             */
            repointAliveCell(node) {
                if (this.aliveCell !== node) return;

                this.aliveCell = null;
                for (const cell of this.playerCells) {
                    if (cell !== node && !cell.eaten) {
                        this.aliveCell = cell;
                        break;
                    }
                }
            }

            removeNode(node) {
                // Usually a no-op by now - being eaten already moved it - but a node can leave
                // without ever being eaten (a clear, or leaving the viewport for good)
                this.repointAliveCell(node);
                if (this.playerCells.size === 1 && this.playerCells.has(node)) {
                    if (this.settings.settings.deathFreecam) this.freeSpec = true;
                    this.deathTimeout = setTimeout(this.onDeath.bind(this), 100);
                }
                this.nodes.delete(node.id);
                this.playerCells.delete(node);
                this.myCells.delete(node.id);
                this.pool.putNode(node);
            }

            addNode(node) {
                this.nodes.set(node.id, node);

                // Do I own this cell?
                if (this.myCells.has(node.id) && !this.playerCells.has(node)) {
                    if (!this.aliveCell) this.aliveCell = node
                    this.playerCells.add(node);
                }
            }

            onKeyDown(event) {

                // Always close settings on Escape
                if (event.keyCode === 27) {
                    $('#settings').hide();
                }

                // Suppress input while a key action is already in progress or the menu is open
                if ($('#menu').is(':visible'))
                    return;

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
                        this.camera.changeZoom(1);
                        break;
                    case 40:
                        this.camera.changeZoom(-1);
                        break;
                    case this.controls.Spectate[0]:
                        // No-ops unless spectating, so it needs no guard of its own here -
                        // see toggleSpectateMode()
                        if (event.repeat) return;
                        this.toggleSpectateMode();
                        return;
                    case this.controls.Split[0]:
                        /**
                         *  While following a party member, Split steps to the next one instead.
                         *  There is nothing to split while spectating, and it saves the feature
                         *  a keybind of its own - which is why the cycle has no separate one.
                         *
                         *  Only while already following someone: a plain free-pan spectate keeps
                         *  Split inert exactly as it was before any of this existed.
                         */
                        if (this.freeSpec && this.spectateTarget !== null) {
                            if (!event.repeat) this.cycleSpectateTarget();
                            return;
                        }
                        // Held keys do not machine-gun splits. The repeat rate is the OS's, so
                        // leaning on the key used to queue roughly thirty a second and drain
                        // them one per tick long after it was let go
                        if (event.repeat) return;
                        this.splitPending = false;
                        if (this.settings.settings.bruhMode) {
                            this.bruh.pause();
                            this.bruh.preservesPitch = false;
                            const random = (Math.random() + Math.random()) / 2;
                            this.bruh.playbackRate = 1 + (random - 0.5) * 0.5;
                            this.bruh.currentTime = 0.15;
                            this.bruh.play();
                        }
                        this.queueSplits(1);
                        break;
                    case this.controls.Feed[0]:
                        if (event.repeat || this.feedInterval)
                            return;

                        this.network.send(new packet.Eject());

                        this.feedInterval = setInterval(() => {
                            this.network.send(new packet.Eject());
                        }, 20);

                        break;
                    case this.controls.Hide[0]:
                        if (event.repeat)
                            return;
                        this.hideUI = !this.hideUI;
                        if (this.hideUI) {
                            $('#gameMenu').hide();
                        } else {
                            $('#gameMenu').show();
                        }
                        this.partyMove();
                        this.themeMove();
                        break;
                    case this.controls.Freeze[0]:
                        if (event.repeat)
                            return;
                        this.freeze = !this.freeze;
                        this.linesplit = false;
                        this.ui.updateDebugHTML();
                        break;
                    case this.controls.Vertical[0]:
                        if (event.repeat || this.freeSpec)
                            return;
                        this.splitPending = true;
                        this.linesplit = !this.linesplit;
                        this.freeze = false;
                        this.ui.updateDebugHTML();
                        break;
                    case this.controls.Double[0]:
                    case this.controls.Triple[0]:
                    case this.controls['16x'][0]: {
                        this.splitPending = false;
                        // Held keys repeat as plain single splits rather than restarting the
                        // macro, which is what these did before and what leaning on the key
                        // should do
                        if (event.repeat) {
                            if (this.settings.settings.oldSplitMacros) {
                                this.network.send(new packet.Split());
                            } else {
                                this.queueSplits(1);
                            }
                            return;
                        }
                        const count = event.keyCode === this.controls.Double[0] ? 2
                                    : event.keyCode === this.controls.Triple[0] ? 3
                                    : 4;

                        if (this.settings.settings.oldSplitMacros) {
                            this.legacySplitMacro(count);
                            break;
                        }

                        // Only the 16x key has an intent known up front - see MAX_SPLIT_MODE
                        this.queueSplits(count, count === 4 && this.network.mode === MAX_SPLIT_MODE);
                        break;
                    }
                    }
                }
            }
            /**
             *  Adds `count` splits to the outgoing queue.
             *
             *  A queue rather than a fresh schedule per press, because chaining macros is a real
             *  technique - two 4x presses for eight splits in Self Feed - and restarting would
             *  throw away whatever of the first macro had not gone out yet, then send on top of
             *  its last split inside the same tick. Both halves of that are a dropped split. Now
             *  a press only ever adds to the count, and nothing else decides when they leave.
             *
             *  Every split in the game goes through here, plain Space included. That is what
             *  keeps the spacing honest: pacing only the macros would still let a manual split
             *  land in the same tick as a macro's, and the queue cannot space against a send it
             *  never saw.
             */
            /**
             *  Whether `count` more splits would finish at the cell cap.
             *
             *  Each split doubles, so this is just the cell count shifted left by the number of
             *  splits. Deliberately measured against the cells on screen right now rather than
             *  against anything already queued: chaining macros is how people reach the cap, and
             *  each press sees the cells the previous one produced. Building 128x out of a 4x
             *  and a 3x under a 200 cap stays exact both times (1 -> 16, then 16 -> 128), and
             *  the press after that sees 128 and knows it is going to top out.
             *
             *  An unknown mode has no cap to reason about, so it keeps the accurate path.
             */
            splitsWillCap(count) {
                const cap = CELL_COUNT_CAPS[this.network.mode];

                /**
                 *  Counted rather than taken from playerCells.size, which keeps eaten cells for
                 *  the length of their fade - about a second. Using the size overstates the
                 *  count for that second after every trade, so the queue believed it was about
                 *  to cap when it was not, rushed, and turned one press into two splits well
                 *  short of the cap.
                 */
                let cells = 0;
                for (const cell of this.playerCells) if (!cell.eaten) cells++;

                if (!cap || !cells) return false;
                return cells * Math.pow(2, count) >= cap;
            }

            /**
             *  The split macros as the original client sent them: fire and forget, on fixed
             *  delays, with nothing measuring the server or spacing the packets against it.
             *
             *  Kept because the queue this replaced is not strictly better - it paces splits off
             *  the measured tick so they land on separate ticks, which is more consistent, but
             *  it is also slower to get the first few out and some people prefer the old feel.
             *  Both are one setting apart; see the Old Split Macros toggle.
             *
             *  Timings are the originals: 75ms between the splits of a double or triple, and a
             *  flat 45ms run for the 16x.
             */
            legacySplitMacro(count) {
                if (count === 4) {
                    for (let i = 0; i < 4; i++) {
                        setTimeout(() => this.network.send(new packet.Split()), 45 * i);
                    }
                    return;
                }

                this.network.send(new packet.Split());
                setTimeout(() => {
                    this.network.send(new packet.Split());
                    if (count > 2) setTimeout(() => this.network.send(new packet.Split()), 75);
                }, 75);
            }

            /**
             *  `rush` forces the unpaced path for a run whose intent is known up front, rather
             *  than waiting for the cell count to show it is about to cap - see MAX_SPLIT_MODE.
             */
            queueSplits(count, rush = false) {
                /**
                 *  Room is counted in splits the player asked for, never in packets on the
                 *  wire, so a rushed run occupies exactly what it means rather than three times
                 *  it. Two 4x presses still fill the queue exactly, rushed or not.
                 *
                 *  A press that only partly fits is clamped rather than dropped - "no more than
                 *  eight" reads as a ceiling, not as an all-or-nothing admission test, and
                 *  clamping is what keeps the 4x+4x chain landing on exactly eight. One edge
                 *  falls out of it: with seven already queued a 4x clamps to one, and a single
                 *  split fails the count > 1 test below, so that last split goes out paced
                 *  instead of blanketed. That is the correct call for a lone split and not a bug.
                 */
                const room = SPLIT_QUEUE_MAX - this.queuedSplits;
                if (room <= 0) return;
                count = Math.min(count, room);

                /**
                 *  count > 1, because the rush exists to get a *run* of splits into consecutive
                 *  ticks. A single split has no sequencing problem to solve - one packet always
                 *  lands - so the redundant copies can only do harm: three of them spread over
                 *  two thirds of a tick, so a tick boundary falls between them most of the time
                 *  and one press comes out as two splits.
                 *
                 *  Decided against the clamped count, not the requested one, so the rush matches
                 *  the run actually queued.
                 */
                const capped = this.splitsWillCap(count);
                const rushing = count > 1 && (rush || capped);

                /**
                 *  Pushed as its own run rather than added to a running total, because a rushed
                 *  run and a paced one are counted in different units and drain at different
                 *  rates. One scalar could hold the count or the cadence of whichever press
                 *  landed last but never both, so mixing the two kinds corrupted them in both
                 *  directions: a paced press arriving behind a rushed one clamped the shared
                 *  total against a limit in the wrong unit and silently destroyed queued copies,
                 *  and whichever press set the shared spacing dragged every split still waiting
                 *  into its cadence - so a paced 3x pressed alongside a rushed 4x came out at
                 *  one copy per third of a tick and collapsed into it on the server.
                 *
                 *  A rushed run is measured in ticks to cover, not packets to send: the copies
                 *  multiply and the interval divides by the same factor, so the run still spans
                 *  count ticks - it just arrives with something always waiting.
                 */
                const copies = rushing ? SPLIT_RUSH_COPIES : 1;

                /**
                 *  ...but count * copies packets span count*tick - tick/3, and the ticks that
                 *  can consume them are the ones in (0, span + tick]. That is count + 1 ticks
                 *  for two thirds of all tick phases, and the press comes out a split long -
                 *  a 16x turning 1 cell into 32 rather than 16. Ending the blanket on the last
                 *  tick it actually has to cover pins the count instead, at the same speed,
                 *  because the run still finishes on the same tick.
                 *
                 *  Only short of the cap, though. Past it the surplus is discarded anyway, and
                 *  a trimmed run's end ticks carry one packet each rather than three, so jitter
                 *  can drop one and lose a split - which is the one outcome that costs anything
                 *  when the whole point of the press was to reach the cap.
                 */
                const packets = rushing && !capped ? (count - 1) * copies + 1 : count * copies;

                /**
                 *  perSplit rather than copies, because a trimmed run's packets no longer
                 *  divide evenly into its splits - 10 packets carry 4 - and dividing by copies
                 *  would quietly under-count what the run still owes, letting a press past the
                 *  ceiling. It is packets-per-split for every shape: 1 paced, COPIES blanketed,
                 *  and the fraction in between when trimmed.
                 */
                this.splitQueue.push({ left: packets, copies, perSplit: packets / count });
                this.pumpSplits();
            }

            /** Splits the player has asked for and not yet seen leave, rush copies counted once. */
            get queuedSplits() {
                let total = 0;
                // perSplit is 1 for a paced run, so this is the same arithmetic either way
                for (const run of this.splitQueue) total += Math.ceil(run.left / run.perSplit);
                return total;
            }

            /**
             *  Releases the next split once a full spacing has passed since the last one -
             *  immediately when the queue has been idle, which is the ordinary case for a single
             *  press, so nothing pays latency for the pacing it doesn't need.
             *
             *  The spacing belongs to the run at the head of the queue, not to the queue, which
             *  is what lets a rushed press and a paced one sit in it at the same time without
             *  either adopting the other's cadence.
             *
             *  Blanketing is only ever allowed *inside* a rushed run, or across a boundary where
             *  the run on both sides is rushed - chained max splits stay continuous, the way
             *  hand-spamming them is. A boundary with a paced run on either side takes the full
             *  splitSpacing instead: those are two different splits the player asked for, and
             *  two splits a third of a tick apart are one split as far as the server is
             *  concerned.
             */
            pumpSplits() {
                if (this.splitTimer || !this.splitQueue.length) return;

                const run = this.splitQueue[0];
                /**
                 *  Mid-run this is always true, because the packet before it came from this
                 *  same run - the head does not change until a run is exhausted - so there is
                 *  no separate "first packet of the run" test to make. What it actually reads
                 *  is whether the run either side of this boundary blankets.
                 */
                const blanketing = run.copies > 1 && this.lastSplitRush;
                const spacing = blanketing
                    ? this.network.tickPeriod / run.copies
                    : this.network.splitSpacing;

                /**
                 *  Scheduled against when this packet was *due*, not when the last one actually
                 *  went, because setTimeout runs late and anchoring on the achieved time makes
                 *  that lateness compound. Measured in the page: a rushed 4x that should span
                 *  146.7ms spanned 156.6ms, every hop a couple of ms late and never recovering.
                 *  Ten milliseconds is a quarter of a tick, which is the difference between a
                 *  blanket that covers four ticks and one that clips a fifth.
                 *
                 *  Falling behind by more than a whole spacing is a stall rather than drift, so
                 *  that path re-anchors on the clock instead of trying to catch up - which would
                 *  fire the backlog together and collapse it on the server.
                 */
                const due = this.lastSplitAt + spacing;
                const wait = due - performance.now();
                if (wait <= 0) return this.releaseSplit();

                this.splitTimer = setTimeout(() => {
                    this.splitTimer = null;
                    this.releaseSplit(due);
                }, wait);
            }

            /** `at` is the time this packet was due; absent, it is going out unscheduled. */
            releaseSplit(at) {
                const run = this.splitQueue[0];
                if (!run) return;

                // The run leaves the queue as its last packet goes, so the next pump reads the
                // next run's cadence rather than this one's
                if (--run.left <= 0) this.splitQueue.shift();

                this.lastSplitAt = at === undefined ? performance.now() : at;
                this.lastSplitRush = run.copies > 1;
                this.network.send(new packet.Split());
                // Re-entrant by one hop only: lastSplitAt has just moved, so the next call
                // always schedules rather than releasing again
                this.pumpSplits();
            }

            // Dying mid-macro must not leave splits queued, or they fire into the next life
            flushSplits() {
                if (this.splitTimer) clearTimeout(this.splitTimer);
                this.splitTimer = null;
                this.splitQueue.length = 0;
                this.lastSplitRush = false;
            }

            onKeyUp(event) {
                if (event.keyCode === this.controls.Feed[0]) {
                    clearInterval(this.feedInterval);
                    this.feedInterval = null;
                }
            }
            // Community leaderboard submission (see the Germsfox bridge below) - only if logged
            // in. login.uuid is set to the literal string 'logout' rather than cleared on
            // logout, so that's excluded too. Uses the in-game nickname rather than the account
            // name, since that's the name players actually recognize each other by - "one entry
            // per account" still holds regardless, since that's keyed on client_id (a
            // per-install id), not this name.
            //
            // Called both right at death (so a life's final mass is never missed even if it grew
            // in the last few seconds before the next interval tick) and periodically while
            // still alive (see the setInterval in pool.populate()'s callback), so a long life
            // shows up on the daily leaderboard well before it ends. lastSubmittedMass makes
            // each of those interval ticks a no-op unless there's an actual new high to report.
            /**
             *  Keeps hold of the color and skin of the cell we are currently alive as.
             *
             *  Called every frame rather than at submit time, which is the whole point: onDeath()
             *  runs 100ms after the last cell is removed, so aliveCell is already null by then,
             *  and the 30s submit interval is anchored to page load rather than to spawning. A
             *  short round - which is most of them in a mode like Ultra Split - could begin and
             *  end without a single tick landing while alive, and the appearance would never be
             *  captured at all. Two scalar writes and no allocation, so the frame cost is noise.
             *
             *  baseColor, not color: that is the color the server gave this player, so the board
             *  shows what everyone else sees rather than whatever local theme this client runs.
             */
            rememberAppearance() {
                const cell = this.aliveCell;
                if (!cell) return;
                // A cell whose packet carried no color leaves baseColor null; the board treats
                // that as "no appearance" and falls back to a crown rather than drawing black.
                this.lastColor = typeof cell.baseColor === 'number' ? cell.baseColor : null;
                // Mirrors how the native leaderboard decides whether to draw a skin at all
                this.lastSkin = cell.renderer?.heldSkin ? cell.skin : null;
            }

            submitLeaderboardScore() {
                if (!this.login.uuid || this.login.uuid === 'logout') return;

                if (this.highestMass <= this.lastSubmittedMass) return;

                this.lastSubmittedMass = this.highestMass;
                window.postMessage({
                    __germsfox: true,
                    type: 'highscore',
                    mode: this.network.mode,
                    mass: ~~this.highestMass,
                    name: this.settings.getItem('nick') || 'An unnamed cell',
                    color: this.lastColor,
                    skin: this.lastSkin,
                }, '*');
            }
            onDeath() {
                this.submitLeaderboardScore();

                document.getElementsByClassName('stats-food-eaten')[0].innerText = this.foodEaten;
                document.getElementsByClassName('stats-highest-mass')[0].innerText = ~~this.highestMass;
                document.getElementsByClassName('stats-time-alive')[0].innerText = this.timeAlive.toString().toMMSS();
                document.getElementsByClassName('stats-leaderboard-time')[0].innerText = this.leaderboardTime.toString().toMMSS();
                document.getElementsByClassName('stats-cells-eaten')[0].innerText = this.cellsEaten;
                document.getElementsByClassName('stats-top-position')[0].innerText = this.topPosition == 999 ? 'N/A' : this.topPosition + 1;

                this.foodEaten = 0;
                this.highestMass = 0;
                this.lastSubmittedMass = 0; // highestMass at the last community-leaderboard submission
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
                , 1000);
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
            onMouseMove(uc) {
                if (!uc.isTrusted) {
                    return;
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
                // Chat is checked first and by position: .chatMessage is pointer-events:none so
                // the click lands on whatever is behind it, which is also why the guard below
                // would otherwise throw every chat right-click away.
                const message = this.chatMessageAt(ue.clientX, ue.clientY);
                if (message) {
                    ue.preventDefault();
                    this.chatCopyText = this.chatMessageText(message);

                    let sender = null;
                    try {
                        sender = JSON.parse(message.dataset.germsfoxSender || 'null');
                    } catch (error) {
                        sender = null; // server notices and the like have no sender
                    }
                    return this.openUserMenu(sender);
                }

                this.chatCopyText = null;

                if ($('#menu').is(':visible') || ue.target.id != 'gameMenu')
                    return false;
                ue.preventDefault();
                var mouseX = this.mouse.realX;
                var mouseY = this.mouse.realY;
                for (const [id, node] of this.nodes) {
                    if (this.pointInCircle(mouseX, mouseY, node.renderer.x, node.renderer.y, node.size)
                        && !this.myCells.has(id) 
                        && node.parent > 0) {
                            return openUserMenu(node);
                    }
                }
                return openUserMenu(null);
            }
            /**
             *  Text of a chat message as it was typed. Emotes and stickers are rendered as <img>,
             *  so they have to become their keyword again or a copied message comes out full of
             *  holes: germsfox's images carry it in `alt`, the game's only in the filename, which
             *  is the same string because Emotes.php maps every key to "<key>.png".
             */
            chatMessageText(messageDiv) {
                const paragraph = messageDiv.querySelector('p');
                if (!paragraph) return messageDiv.textContent.trim();

                const textOf = (node) => {
                    // Not Node.TEXT_NODE: this bundle has its own Node class for game nodes,
                    // which shadows the DOM one here and made every text node read as undefined
                    // - so every message copied out empty.
                    if (node.nodeName === '#text') return node.nodeValue;
                    if (node.nodeName === 'IMG') {
                        if (node.alt) return node.alt;
                        const file = (node.getAttribute('src') || '').split('/').pop() || '';
                        return file.replace(/\.[^.]+$/, '');
                    }
                    let text = '';
                    for (const child of node.childNodes) text += textOf(child);
                    return text;
                };

                let text = '';
                for (const child of paragraph.childNodes) {
                    // Everything up to and including the sender's name is chrome, not message
                    if (child.nodeName === 'B') {
                        text = '';
                        continue;
                    }
                    text += textOf(child);
                }

                // The ": " between name and message belongs to neither
                return text.replace(/^\s*:\s*/, '').trim();
            }

            /**
             *  The chat message under a point, found by hit-testing rectangles rather than by
             *  event target: .chatMessage is pointer-events:none so you can still aim through the
             *  chat, which means a right-click on one never actually lands on it. Only messages
             *  inside the tab's own visible box count, so a message scrolled out of view is not
             *  picked by its stale rectangle.
             */
            chatMessageAt(x, y) {
                for (const tab of document.querySelectorAll('.chatTab')) {
                    const tabBox = tab.getBoundingClientRect();
                    if (x < tabBox.left || x > tabBox.right || y < tabBox.top || y > tabBox.bottom) continue;

                    // Newest first. Chat messages carry a -10px bottom margin, so each one's box
                    // runs ten pixels into the box below it - and a row is only about twenty
                    // tall, so that overlap is half of it. Both messages contain a point in that
                    // band, and the one actually drawn there is the later of the two: taking the
                    // first match instead handed back the previous sender for the top half of
                    // every message in the tab.
                    const messages = tab.querySelectorAll('.chatMessage, .adminMessage');
                    for (let i = messages.length - 1; i >= 0; i--) {
                        const box = messages[i].getBoundingClientRect();
                        if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) {
                            return messages[i];
                        }
                    }
                }
                return null;
            }

            /** Adds "Copy Text" to the game's own user menu, once, matching its existing rows. */
            ensureChatCopyItem() {
                if (this.chatCopyItem) return this.chatCopyItem;

                const list = document.querySelector('#userMenu > ul');
                if (!list) return null;

                const item = document.createElement('li');
                item.id = 'userMenuCopyText';
                item.className = 'userMenuItem';
                item.innerHTML = '<i class="fas fa-copy"></i><p>Copy Text</p>';

                item.addEventListener('click', async () => {
                    $('#userMenu').hide();
                    const text = this.chatCopyText;
                    if (!text) return;
                    try {
                        await navigator.clipboard.writeText(text);
                    } catch (error) {
                        // The clipboard API wants a focused document and a secure context, and
                        // refuses often enough with a game canvas in play to be worth a fallback
                        const scratch = document.createElement('textarea');
                        scratch.value = text;
                        scratch.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
                        document.body.appendChild(scratch);
                        scratch.select();
                        document.execCommand('copy');
                        scratch.remove();
                    }
                });

                // Appended, never prepended: #userMenuPlayerCell is absolutely positioned at
                // top:-6px left:-6px of #userMenu itself, so the player's cell always draws in
                // the menu's top-left corner and only lines up with the name while the player
                // section is the first thing in the menu. Putting a row above it left the cell
                // stranded on that row with the name orphaned below.
                list.append(item);
                this.chatCopyItem = item;
                return item;
            }

            /** Adds "Spectate" to the game's own user menu, once, matching its existing rows. */
            ensurePartySpectateItem() {
                if (this.partySpectateItem) return this.partySpectateItem;

                const list = document.querySelector('#userMenu > ul');
                if (!list) return null;

                const item = document.createElement('li');
                item.id = 'userMenuSpectate';
                item.className = 'userMenuItem';
                item.innerHTML = '<i class="fas fa-search"></i><p>Spectate</p>';

                // Read at click time rather than captured, so a party packet replacing the
                // party object between opening the menu and pressing the row cannot strand this
                // on a PartyMember nothing points at any more - see handleParty()
                item.addEventListener('click', () => {
                    $('#userMenu').hide();
                    this.spectatePartyMember(this.spectateMenuTarget);
                });

                // Appended rather than prepended, for the reason ensureChatCopyItem() gives
                list.append(item);
                this.partySpectateItem = item;
                return item;
            }

            /**
             *  Locks the spectate camera onto a party member and follows them until told not to.
             *
             *  The party packet carries every member's position whether or not any of their
             *  cells are on screen - it is what draws their dots on the minimap - so this works
             *  at any distance, which is the whole point of it. The following itself happens in
             *  render(); this only chooses who, and gets the camera there.
             */
            spectatePartyMember(id) {
                if (!this.freeSpec || !this.party?.hasOwnProperty(id)) return;

                this.spectateTarget = id;

                /**
                 *  Only the target is chosen here. render() aims the camera at whoever it is
                 *  every frame, so the ordinary camera lerp carries it over - nothing needs to
                 *  place the camera, and switching members travels the same way any other
                 *  camera move does rather than cutting.
                 */
                this.camera.driftX = 0;
                this.camera.driftY = 0;
            }

            /**
             *  Party member ids that can be tracked, in a stable order.
             *
             *  Derived fresh rather than kept, because handleParty() rebuilds the party object
             *  on every packet. Integer-like keys enumerate in ascending numeric order, so the
             *  cycle visits everyone in the same order every time round.
             */
            spectatableIds() {
                if (!this.party) return [];
                return Object.keys(this.party).filter(id => this.myID != id);
            }

            /**
             *  The cycle key: move to the next party member, wrapping at the end.
             *
             *  Picks up the first member when nothing is being tracked yet, so the key alone is
             *  enough to start watching someone without going through the menu first.
             */
            cycleSpectateTarget(step = 1) {
                if (!this.freeSpec) return;

                const ids = this.spectatableIds();
                if (!ids.length) return;

                const current = ids.indexOf(String(this.spectateTarget));
                const next = current === -1 ? 0 : (current + step + ids.length) % ids.length;

                this.spectatePartyMember(ids[next]);
            }

            /**
             *  Clears every germs keybind on this key except `exceptKey`, so a key is never
             *  bound to two things at once.
             *
             *  Matched on keyCode because that is what germs' own controls store - germsfox's
             *  store event.code instead, which is why both identifiers travel together and each
             *  side picks the one it can use. Called from the bridge when the germsfox half took
             *  a key, and directly below when this half did.
             *
             *  keyCode 0 is the unbound marker here, and is skipped rather than matched, or
             *  clearing one binding would clear every other unbound one with it.
             */
            unbindGermsKey(keyCode, code, exceptKey = null) {
                if (!keyCode) return [];

                const cleared = [];
                for (const key in this.controls) {
                    if (key === exceptKey) continue;
                    if (this.controls[key][0] !== keyCode) continue;

                    this.controls[key] = [0, ''];
                    // germs' own settings pane names these inputs after the control
                    const input = document.getElementById('key' + key);
                    if (input) input.value = '';
                    cleared.push(key);
                }

                if (cleared.length) this.settings.setItem('controls', this.controls);
                return cleared;
            }

            /** The mode key: swap between following a party member and panning with the mouse. */
            toggleSpectateMode() {
                if (!this.freeSpec) return;

                if (this.spectateTarget !== null) {
                    this.spectateTarget = null;
                    return;
                }

                this.cycleSpectateTarget();
            }

            openUserMenu(node) {
                // Only offered when the menu was opened from a chat message
                const copyItem = this.ensureChatCopyItem();
                if (copyItem) copyItem.style.display = this.chatCopyText ? '' : 'none';

                /**
                 *  Spectate is only meaningful while actually spectating, and only for someone
                 *  the party packet is streaming a position for. Both entry points into this
                 *  menu - a right-clicked cell and a right-clicked chat message - carry the
                 *  owning player's id as `parent`, which is what the party is keyed by.
                 */
                const spectateItem = this.ensurePartySpectateItem();
                this.spectateMenuTarget = (this.freeSpec && node && this.myID != node.parent
                    && this.party?.hasOwnProperty(node.parent)) ? node.parent : null;
                if (spectateItem) {
                    spectateItem.style.display = this.spectateMenuTarget !== null ? '' : 'none';
                }

                if (node && this.myID != node.parent) {
                    this.lastSelectedPlayer = node;

                    // Block skins
                    const blockSkinItem = document.getElementById("userMenuBlockSkin");
                    const blockSkinText = document.getElementById("userMenuBlockSkinText");

                    if (node.skin) {
                        blockSkinItem.style.display = "";

                        if (this.settings.settings.blockedSkins.has(node.skin)) {
                            blockSkinText.innerText = "Unblock Skin";
                        } else {
                            blockSkinText.innerText = "Block Skin";
                        }
                    } else {
                        blockSkinItem.style.display = "none";
                    }
                    // Other default stuff
                    document.getElementById("userMenuBlockText").innerText = "Block Player";
                    $('#userMenuPlayerName').html(node.name && node.name !== "" ? node.name.removeWideChars() : 'An unnamed cell');
                    if (node.renderer?.heldSkin) {
                        $('#userMenuPlayerSkin').css('background-image', 'url(' + this.skinURLFrom(node.skin) + ')');
                    } else {
                        $('#userMenuPlayerSkin').css('background-image', 'none');
                    }
                    $('#userMenuPlayerSkin').css('background-color', node.rgb);
                    $('#userMenuPlayer').show();
                } else {
                    $('#userMenuPlayer').hide();
                }
                // Create and Leave Party used to be what this menu always had to show, so with
                // both of them living in the party HUD now it can end up with nothing left in
                // it. An empty rounded box is worse than no menu at all.
                if (!this.chatCopyText && !(node && this.myID != node.parent)) {
                    return $('#userMenu').hide();
                }

                var gameY = this.pageY;
                var gameX = this.pageX;
                if (gameX + $('#userMenu').width() >= $(window).width()) {
                    gameX -= $('#userMenu').width();
                }
                if (gameY + $('#userMenu').height() >= $(window).height()) {
                    gameY -= $('#userMenu').height();
                }
                $('#userMenu').css('top', gameY);
                $('#userMenu').css('left', gameX);
                $('#userMenu').show();
            }
            userMenuBlockSkin() {
                const player = this.lastSelectedPlayer;

                if (!player?.skin) {
                    $('#userMenu').hide();
                    return;
                }

                const blockedSkins = this.settings.getItem('blockedSkins');

                blockedSkins.has(player.skin)
                    ? blockedSkins.delete(player.skin)
                    : blockedSkins.add(player.skin);

                this.settings.setItem('blockedSkins', blockedSkins);
                this.updateBlockedSkins();

                $('#userMenu').hide();
            }
            updateBlockedSkins() {
                for (const cell of this.nodes.values()) {
                    if (this.settings.settings.blockedSkins.has(cell.skin)) cell.renderer.removeSkin();
                    cell.renderer.setSkin();
                }
            }
            userMenuBlock() {
                // Default blocking behavior is useless, just let Germsfox handle blocking people
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

            userMenuScreenshot() {}

            pointInCircle(ut, uu, uv, uw, ux) {
                return Math.sqrt((ut - uv) * (ut - uv) + (uu - uw) * (uu - uw)) < ux;
            }

            onScroll(event) {
                if (event.target.id !== "gameMenu" && event.target.id !== "gameCanvas") return;

                const amount =
                    event.wheelDelta / -120 ||
                    event.detail ||
                    event.deltaY ||
                    0;

                this.camera.changeZoom(amount);
            }

            onResize() {
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
                this.themeMove();
                if (this.renderer)
                    this.renderer.resize(this.width, this.height);
            }

            partyMove() {
                $('#party').css({
                    'transform': 'scale(' + this.UIRatio + ', ' + this.UIRatio + ')',
                    'left': 20 + $('#debug').width() * this.UIRatio + 'px'
                });
            }

            /**
             * germs.io keeps #party hidden until a party exists, which was fine when the only
             * thing in it was the member list. The party controls live there now, so the box
             * stays up for the whole game and shows whichever half applies: the create button
             * while solo, the member list and a leave button once in a party. #partyText is
             * padded even when empty, so it has to be hidden rather than just left blank.
             */
            syncPartyUI() {
                // Coerced: inParty starts out undefined, and jQuery's toggle() treats a
                // non-boolean as "flip me" rather than "set me", which left both halves
                // visible after the second spawn.
                const inParty = !!this.inParty;

                // Shown by class rather than .show(), which would write an inline display:block
                // over the flex layout the box needs to sit the button beside the list.
                $('#party').addClass('germsfoxPartyOpen');
                $('#partyText').toggle(inParty);
                $(this.ui.partyCreateButton).toggle(!inParty);
                $(this.ui.partyLeaveButton).toggle(inParty);
                this.partyMove();
            }

            themeMove() {
                const themeDiv = document.getElementById("theme");
                if (!themeDiv) return;
                themeDiv.style.bottom = 20 + $('#map').height() * this.UIRatio + 'px';
                themeDiv.style.transform = `scale(${this.UIRatio})`;
                // The panel sits directly above the minimap, so it takes its width from it and
                // stays matched when the minimap resizes
                themeDiv.style.setProperty('--themeWidth', $('#map').width() + 'px');
            }

            themeClick() {
                const themeDiv = document.getElementById("theme");
                const themeButton = themeDiv.querySelector("#themeButton");
                const themeButtonIcon = themeButton.querySelector("i");
                const themeUI = themeDiv.querySelector("#themeUI");
                const isHidden = !themeUI.classList.contains('themeUIOpen');

                themeButtonIcon.className = isHidden ? "fas fa-angle-down" : "fas fa-palette";
                themeButton.style.marginRight = isHidden ? "4px" : "0px";

                if (!isHidden) {
                    themeUI.classList.remove('themeUIOpen');
                    themeUI.style.height = "0px";
                    return;
                }

                /**
                 *  Measured on a hidden clone rather than on the panel itself.
                 *
                 *  Measuring in place meant briefly applying the open width and then taking it
                 *  away again - and that removal queued a width transition back to 0, so the
                 *  open that followed had nothing left to animate and simply snapped. (Closing
                 *  looked fine, which is why it read as a half-working animation.) The clone
                 *  never touches the real element's state, so the panel only ever goes from its
                 *  collapsed box straight to open, with transitions live the whole way.
                 *
                 *  It is measured here rather than when the panel is built because #theme lives
                 *  inside #gameMenu, which is display:none until a game starts, and a hidden
                 *  element always measures 0.
                 */
                const probe = themeUI.cloneNode(true);
                // The id is deliberately kept: every rule that gives this panel its geometry is
                // written as #themeUI, so a clone without it matches nothing and measures empty.
                // The duplicate exists only within this function, which runs to completion before
                // anything else can look at the document.
                probe.classList.add('themeUIOpen');
                probe.style.cssText = 'position:absolute; visibility:hidden; pointer-events:none; height:auto; transition:none;';
                themeDiv.appendChild(probe);
                const openHeight = probe.scrollHeight;
                probe.remove();

                themeUI.classList.add('themeUIOpen');
                themeUI.style.height = `${openHeight}px`;
            }

            // Re-paints every swatch from the current theme. Needed because the color buttons
            // can now change a slot from outside the panel.
            refreshThemeUI() {
                if (this.themeSwatchPainters) {
                    for (const paint of this.themeSwatchPainters) paint();
                }
            }

            renderTheme() {
                if (document.getElementById("theme")) return;
                this.themeSwatchPainters = [];

                const themeDiv = document.createElement("div");
                themeDiv.id = "theme";
                document.getElementById("map").before(themeDiv);

                // Button
                const themeButton = document.createElement("button");
                themeButton.id = "themeButton";
                themeButton.title = "Theme";
                themeButton.addEventListener('click', () => this.themeClick());
                themeButton.innerHTML = '<i class="fas fa-palette"></i>';
                themeDiv.appendChild(themeButton);

                // UI
                const themeUI = document.createElement("div");
                themeUI.id = "themeUI";

                const theme = this.settings.getItem('customTheme');

                // The background a preset would give, for the slot that defers to one
                const presetColor = () => COLOR_PRESETS[this.settings.getItem('color')]
                    ?? COLOR_PRESETS.gray;

                const renderSection = (key, slot) => {
                    const { label, start } = slot;
                    const row = document.createElement("span");
                    row.classList.add("themeRow");

                    const pickerDiv = document.createElement("div");
                    pickerDiv.classList.add("themePicker");
                    pickerDiv.title = `Pick a ${label.toLowerCase()} color`;

                    const resetButton = document.createElement("button");
                    resetButton.classList.add("themeReset");
                    resetButton.title = `Reset ${label.toLowerCase()} to default`;
                    resetButton.innerHTML = '<i class="fas fa-times"></i>';

                    const labelText = document.createElement("p");
                    labelText.innerText = label;

                    const picker = new CP(pickerDiv);

                    const defaultValue = this.settings.default.customTheme[key];

                    /**
                     *  The color this slot is actually showing right now: its own override if it
                     *  has one, otherwise whatever it defers to - the map border for viruses, the
                     *  selected color preset for the background. null means there is no single
                     *  color to show, which is the rainbow case: food and player cells keep the
                     *  server's own varied colors.
                     */
                    const effectiveColor = () => {
                        const override = theme[key];
                        if (override != null) return override;
                        // No single color to show - the server's own varied ones come through
                        if (slot.unset === 'rainbow') return null;
                        if (slot.unset === 'preset') return presetColor();
                        // Its own color, so no slot's swatch moves because another one changed
                        return slot.start ?? null;
                    };

                    // An empty slot previews what you get instead of sitting blank.
                    const paintSwatch = () => {
                        const solid = effectiveColor();
                        pickerDiv.classList.toggle('themePickerRainbow', solid == null);
                        pickerDiv.style.background = solid != null ? cssColorFrom(solid) : '';
                        // Offer a reset only where there is something to undo, so a slot sitting
                        // on its default doesn't advertise a control that would do nothing.
                        row.classList.toggle('themeRowSet', theme[key] !== defaultValue);
                    };

                    // Opens the picker on the color already in force rather than CP's default of
                    // pure red. Only the very first set() is ever echoed back (see below); later
                    // ones, such as the reset path, are silent.
                    const seedPicker = () => {
                        // `start` is the fallback for a rainbow slot, which has no single
                        // effective color to open on
                        picker.set(new PIXI.Color(effectiveColor() ?? start ?? 0xFFFFFF).toHex());
                    };

                    // CP announces its own color exactly once, asynchronously, shortly after it
                    // is constructed - whatever it was seeded with, or pure red if it never was.
                    // That announcement is not a user action, so the first change from each picker
                    // is dropped. The previous code fought the same behaviour by discarding any
                    // change that happened to equal #ff0000, which is why red could never be
                    // picked as a slot's first color.
                    let selfAnnounced = false;

                    picker.on('change', (color) => {
                        if (!selfAnnounced) {
                            selfAnnounced = true;
                            return;
                        }
                        theme[key] = new PIXI.Color('#' + color).toNumber();
                        // Repaints every row and re-syncs the color buttons by itself: changing
                        // the border moves what the virus swatch previews, and choosing a custom
                        // background stands the presets down. Not re-seeded - mid-drag here.
                        this.changeSetting('customTheme', theme);
                    });

                    resetButton.addEventListener('click', () => {
                        theme[key] = defaultValue;
                        this.changeSetting('customTheme', theme);
                        seedPicker();
                    });

                    row.append(pickerDiv, labelText, resetButton);
                    paintSwatch();
                    seedPicker();
                    this.themeSwatchPainters.push(paintSwatch);
                    themeUI.appendChild(row);
                };

                for (const [key, slot] of Object.entries(THEME_SLOTS)) {
                    renderSection(key, slot);
                }

                themeDiv.appendChild(themeUI);
            }

            exitParty() {
                this.party = {};
                this.inParty = false;
                this.partyCodeJoined = null;
                this.network.sendParty(2);
                this.ui.clearPartyHTML();
                this.syncPartyUI();
                history.pushState('', document.title, window.location.pathname + window.location.search);
                $('.partyCard').removeClass('partyGlow');
                $('.partyCreate').hide();
                $('#partyFind').show();
                $('#partyMenu').hide();
                $('#partyJoin').hide();
            }
            /**
             *  Tells this origin's other tabs which party this one is now in, so they can come
             *  along - see the channel in start().
             *
             *  Sent on the server's confirmation rather than when the button is pressed, so the
             *  other tabs only ever chase a code that is known to work, and a create and a join
             *  need no separate handling: both arrive here the same way.
             *
             *  A channel rather than the settings blob the rest of the cross-tab work uses:
             *  which party a tab is in is an event, not a preference. It should not outlive the
             *  tabs, should not be restored on the next launch, and would be one more key to
             *  keep out of the sync.
             */
            announcePartyCode(code) {
                if (!code || !this.partyChannel) return;
                this.partyChannel.postMessage({ code });
            }

            /**
             *  Joins the party another tab just created or joined.
             *
             *  Guarded on the code this tab already holds, which is what stops the two of them
             *  handing the same party back and forth: the tab that follows announces its own
             *  success in turn, and the announcement reaches the tab that started it.
             */
            followPartyCode(code) {
                if (!code || code === this.partyCodeJoined) return;
                if (!this.network.open) return;

                this.network.sendParty(1, code);
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
            setRegion(region) {
                if (this.network.region != region && this.network.searching == false) {
                    this.setConnecting(true);
                    this.network.fetchServers(region);
                    this.settings.setItem('region', region);
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
                this.syncPartyUI();
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
            log(message) {
                console.log('%cGerms:~$ %c ' + message, 'color: #00fd00; font-weight: bold; font-size: 14px; font-family: Ubuntu;', 'color: white; font-size: 14px;text-shadow: rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.426147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;');
            }
        }

        String.prototype.replaceAllPoly = function(uR, uS) {
            var uT = this;
            return uT.replace(new RegExp(uR,'g'), uS);
        };
        String.prototype.capitalize = function() {
            return this.replace(/\w\S*/g, function(uU) {
                return uU.charAt(0).toUpperCase() + uU.substr(1).toLowerCase();
            });
        };
        String.prototype.removeWideChars = function() {
            return this.replace(
                new RegExp('[\\uFDFD\\u{1242B}\\u{12219}\\u2E3B\\uA9C5\\u102A\\u0BF5\\u0BF8\\u2031\\u{1242A}]', 'gu'),
                ''
            );
        };
        $.expr[':'].icontains = $.expr.createPseudo(function(uV) {
            return function(uW) {
                return $(uW).text().toUpperCase().indexOf(uV.toUpperCase()) >= 0;
            }
            ;
        });
        Date.prototype.addHours = function(uX) {
            this.setTime(this.getTime() + uX * 60 * 60 * 1000);
            return this;
        }
        ;
        String.prototype.toHHMMSS = function() {
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

        var instance = new Game();
        GF_DIAG.game = instance; // DIAGNOSTIC - see GF_DIAG

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
        // Unlike addEmote (inserts into #chat_input for the player to send themselves), this
        // sends immediately without touching #chat_input at all - used for stickers, so
        // whatever the player was already typing is left completely untouched.
        self.sendChatMessage = instance.chat.send.bind(instance.chat);
        self.logout = instance.login.logout.bind(instance.login);
        self.custom = instance.login.custom.bind(instance.login);
        self.redeemGift = instance.login.redeemGift.bind(instance.login);
        self.authResponse = instance.login.response.bind(instance.login);
        self.shopTab = instance.shopTab.bind(instance);
        self.openUserMenu = instance.openUserMenu.bind(instance);
        self.userMenuBlock = instance.userMenuBlock.bind(instance);
        self.userMenuScreenshot = instance.userMenuScreenshot.bind(instance);
        self.userMenuInvite = instance.userMenuInvite.bind(instance);
        self.buyLocked = instance.login.buyLocked.bind(instance.login);
        self.buySkin = instance.login.buySkin.bind(instance.login);
        self.buyCoins = instance.login.buyCoins.bind(instance.login);
        self.redeemCode = instance.login.redeemCode.bind(instance.login);
        self.buyBucks = instance.login.buyBucks.bind(instance.login);
        self.prerollComplete = instance.prerollComplete.bind(instance);

        /**
         *  Party membership, shared between this origin's tabs.
         *
         *  BroadcastChannel does not deliver to the tab that posted, so a tab never hears its
         *  own announcement - see Game.announcePartyCode() for why this is a channel and not
         *  part of the settings sync below.
         */
        if (typeof BroadcastChannel === 'function') {
            instance.partyChannel = new BroadcastChannel('germsfox-party');
            instance.partyChannel.onmessage = (event) => instance.followPartyCode(event.data?.code);
        }

        /**
         *  Settings written by another tab of this origin.
         *
         *  The browser fires this in every tab *except* the one that wrote, which is exactly
         *  the shape a sync wants - no transport, no echo, and it costs nothing while nobody
         *  is multiboxing. Everything germs and germsfox both store lives in this one blob, so
         *  one listener covers all of it; see Settings.applyRemote().
         */
        window.addEventListener('storage', (event) => {
            if (event.key !== 'settings' || !event.newValue) return;

            let incoming;
            try {
                incoming = JSON.parse(event.newValue);
            } catch (error) {
                return console.warn('[Germsfox] Ignored an unreadable settings blob from another tab', error);
            }

            instance.settings.applyRemote(incoming);
        });

        // ===== Germsfox bridge =====
        // The extension's content scripts run in an isolated JS world and can't read
        // `instance`/`game` state or call its methods directly — historically this meant
        // scraping rendered DOM (e.g. regexing debugText's innerHTML for "Mass:") or
        // simulating clicks/change events on native controls to trigger the equivalent
        // logic. This exposes a small, explicit window.postMessage API instead.
        self.germsfoxSetLockedPosition = function(value) {
            instance.changeSetting('lockedPosition', value);
            instance.network.sendLocked();
        };

        const GERMSFOX_BRIDGE_CALLABLE = {
            setSkin: instance.setSkin.bind(instance),
            setColor: instance.setColor.bind(instance),
            setTheme: instance.setTheme.bind(instance),
            changeSetting: instance.changeSetting.bind(instance),
            logout: instance.login.logout.bind(instance.login),
            custom: instance.login.custom.bind(instance.login),
            setLockedPosition: self.germsfoxSetLockedPosition,
            unbindGermsKey: instance.unbindGermsKey.bind(instance),
            cycleDisplayPreference: instance.cycleDisplayPreference.bind(instance),
            toggleSetting: instance.toggleSetting.bind(instance),
        };

        function germsfoxGetState() {
            // Login.logout() sets uuid to the literal string 'logout' rather than clearing it,
            // so a plain truthiness check would misreport a logged-out session as logged in.
            const loggedIn = !!instance.login.uuid && instance.login.uuid !== 'logout';

            return {
                alive: !!instance.aliveCell,
                mass: instance.ui.getMass(),
                score: instance.ui.getScore(),
                cellCount: instance.ui.getCellCount(), // excludes cells still fading out after being eaten
                loggedIn,
                // Bare premium skin names ("Griffin", not "premium/Griffin") - matches what
                // the extension's old #paidSkinList DOM scrape used to return. Login.logout()
                // never resets customSkin, so it's gated on loggedIn to avoid going stale.
                ownedSkins: (instance.login.skins ?? []) // NOT instance.skins - that's the runtime SkinCache
                    .filter(skin => skin.startsWith('premium/'))
                    .map(skin => skin.slice('premium/'.length)),
                hasCustomSkin: loggedIn && !!instance.login.customSkin,
                settings: instance.settings.settings,
                mode: instance.network.mode,
            };
        }

        window.addEventListener('message', (event) => {
            if (event.source !== window) return;
            const data = event.data;
            if (!data || data.__germsfox !== true) return;

            if (data.type === 'call') {
                const fn = GERMSFOX_BRIDGE_CALLABLE[data.fn];
                if (fn) {
                    try {
                        fn(...(data.args || []));
                    } catch (error) {
                        console.error('[Germsfox bridge] "' + data.fn + '" call failed:', error);
                    }
                } else {
                    console.warn('[Germsfox bridge] Unknown/disallowed call: ' + data.fn);
                }
            } else if (data.type === 'getState' && data.requestId != null) {
                window.postMessage({ __germsfox: true, type: 'state', requestId: data.requestId, state: germsfoxGetState() }, '*');
            }
        });

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
                        $('#freeSkinList').append(`<li id='skinSkin'><img onclick="setSkin('free/` + vg + `');" loading="lazy" width='85' height='85' src="res/skins/free/${vg}.png" data-src="res/skins/free/` + vg + '.png"> <p>' + vg.capitalize() + '</p></li>');
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

            // ===== Block Skin =====
            const blockSkinItem = document.createElement("li");
            blockSkinItem.id = "userMenuBlockSkin";
            blockSkinItem.classList.add("userMenuItem");

            const blockIcon = document.createElement("i");
            blockIcon.classList.add("fas", "fa-ban");

            const blockLabel = document.createElement("p");
            blockLabel.id = "userMenuBlockSkinText";
            blockLabel.textContent = "Block Skin";

            blockSkinItem.append(blockIcon, blockLabel);
            document.getElementById("userMenuBlockText").parentElement.after(blockSkinItem);

            blockSkinItem.addEventListener('click', instance.userMenuBlockSkin.bind(instance));

            // The player section is the last thing in this menu now that Screenshot and both
            // party items are gone, so its trailing rule separates it from nothing. Guarded on
            // the rule actually being last: dom.js appends Copy Skin and a rule of its own at
            // document_idle, and this must take that one, not leave a dangling pair.
            const playerMenu = document.getElementById("userMenuPlayer");
            if (playerMenu.lastElementChild?.tagName === "HR") {
                playerMenu.lastElementChild.remove();
            }

            // Settings changes ===================================================
            // The General Options badge goes; its one row (skip match results) belongs under UI
            document.querySelector('#settings-general .badge.badge-pill.badge-primary').remove();

            const settingsGeneral = document.getElementById("settings-general");

            /** The row a control sits in, whichever kind of control it is. */
            const settingRow = (id) => {
                const control = document.getElementById(id);
                return control ? (control.closest(".clearfix") ?? control.parentElement) : null;
            };

            const addToggle = (key, label) => {
                const row = document.createElement("div");
                row.className = "clearfix";
                row.innerHTML = `
                    <h5 class="optionLabel">${label}</h5>
                    <label class="switch">
                        <input
                            type="checkbox"
                            id="${key}"
                            onchange="changeSetting('${key}', this.checked);">
                        <span class="slider round"></span>
                    </label>
                `;
                row.querySelector("input").checked = instance.settings.settings[key];
                settingsGeneral.appendChild(row);
            };

            const addSlider = (key, label, min, max) => {
                const value = instance.settings.settings[key];
                const row = document.createElement("div");
                row.className = "clearfix";
                row.innerHTML = `
                    <h5 id="${key}Label" class="optionLabel">${label}</h5>
                    <input
                        data-placement="top"
                        title=""
                        type="range"
                        min="${min}"
                        max="${max}"
                        value="${value}"
                        class="range"
                        id="${key}"
                        oninput="changeSetting('${key}', this.value); $('#${key}Tooltip').text(this.value);"
                        data-original-title="<div id='${key}Tooltip'>${value}</div>"
                        data-toggle="tooltip">
                `;
                settingsGeneral.appendChild(row);
            };

            // The game's own animation slider, relabelled and given a usable range
            document.getElementById("animationDelayLabel").innerText = "Animation Delay";
            const animationDelayInput = document.getElementById("animationDelay");
            animationDelayInput.max = 200;
            animationDelayInput.min = 10;

            addSlider("cameraDelay", "Camera Delay", 10, 200);
            addSlider("zoomSensitivity", "Zoom Sensitivity", 0, 100);
            addSlider("cellOpacity", "Cell Opacity", 0, 100);

            for (const [key, label] of [
                ["highQualitySkins", "Hi-Res Skins"],
                ["shortenMass", "Shorten Mass"],
                ["borderlessCells", "Borderless Cells"],
                ["hideMapGrid", "Hide Map Grid"],
                ["hideEjectedMass", "Hide Ejected Mass"],
                ["acidMode", "Acid Mode"],
                ["webGPU", "Use WebGPU"],
                ["dynamicLinesplitAxis", "Dynamic Linesplit Axis"],
                ["diagonalLinesplits", "Diagonal Linesplits"],
                ["partyArrows", "Party Arrows"],
                ["deathFreecam", "Freecam on Death"],
                ["bruhMode", "Bruh Mode"],
            ]) {
                addToggle(key, label);
            }

            // Nothing in this bundle has drawn the mouse arrow for a long time, so the toggle
            // did the same thing whichever way it was set
            settingRow("mouseArrow")?.remove();

            /**
             *  Every row placed in one pass, rather than by shuffling them around each other.
             *
             *  Appearance is what a cell looks like, Render is how the picture is produced,
             *  Gameplay is how it plays and UI is the furniture around it - so borderless cells
             *  and hi-res skins sit with the cells they describe rather than with the renderer.
             *  Anything not named here (Theme, Colour and their contents) keeps its own order,
             *  after these.
             */
            const SETTINGS_SECTIONS = [
                ["Appearance Options", [
                    "cellOpacity", "showSkins", "highQualitySkins", "showNames",
                    "showMass", "shortenMass", "borderlessCells",
                    "hideFood", "hideEjectedMass", "hideBorder", "hideMapGrid",
                    "partyArrows",
                ]],
                ["Render Options", [
                    "animationDelay", "cameraDelay", "zoomSensitivity",
                    "autoZoom", "acidMode", "webGPU",
                ]],
                ["Gameplay Options", [
                    "dynamicLinesplitAxis", "diagonalLinesplits", "deathFreecam", "bruhMode",
                ]],
                ["UI Options", [
                    "skipDeathScreen", "hideXP", "hideChat", "disableProfanityFilter",
                ]],
            ];

            const originalOrder = [...settingsGeneral.children];
            const placed = new Set();

            for (const [title, ids] of SETTINGS_SECTIONS) {
                let badge = originalOrder.find(el =>
                    el.classList?.contains("badge") && el.textContent.trim() === title);

                if (!badge) {
                    badge = document.createElement("span");
                    badge.className = "badge badge-pill badge-primary";
                    badge.textContent = title;
                }

                settingsGeneral.appendChild(badge);
                placed.add(badge);

                for (const id of ids) {
                    const row = settingRow(id);
                    if (!row) continue;
                    settingsGeneral.appendChild(row);
                    placed.add(row);
                }
            }

            for (const element of originalOrder) {
                if (!placed.has(element)) settingsGeneral.appendChild(element);
            }

            // WebGPU always clears between frames, so acid mode can never show there
            settingRow("acidMode").style.display =
                instance.settings.settings.webGPU ? "none" : "block";

            setInterval(instance.network.refresh.bind(instance.network), 30000);
            window.onbeforeunload = function() {
                if (instance.playerCells.size > 0) {
                    return 'You will lose all your mass!';
                }
            };

            // Change controls labels to better reflect actual functionality
            document.querySelector('#keyFreeze')
                .closest('.row')
                .querySelector('.col-md-6')
                .textContent = 'Freeze';

            document.querySelector('#keyVertical')
                .closest('.row')
                .querySelector('.col-md-6')
                .textContent = 'Linesplit';

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
            $.ajax('js/adsbygoogle.js').fail(function(vB) {
                console.debug("Please disable your adblocker!");
                $('.blocker').each(function() {
                    $(this).fadeIn();
                });
            });
            $('#channels > li').click(function(vC) {
                var vD = parseInt($(this).attr('value'));
                instance.chat.setChannel(vD);
            });
            $('#skinContainer').scroll(function() {});
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

            /**
             *  Gives germs' Controls pane the Spectate row its settings always had data for.
             *
             *  The stored controls carry a Spectate binding, but the page ships no input for it
             *  and nothing ever read it - so it has sat there unbindable. Cloned from the last
             *  row rather than built from markup, so it picks up whatever classes that pane
             *  uses without this having to know them.
             *
             *  Injected here, immediately before the two handlers below bind: both select
             *  `#settings-controls input` directly rather than delegating, so a row added after
             *  them would have no handler on it.
             */
            (function ensureSpectateControlRow() {
                const pane = document.getElementById('settings-controls');
                if (!pane || document.getElementById('keySpectate')) return;

                const template = document.getElementById('keyHide')?.closest('.row');
                if (!template) return;

                const row = template.cloneNode(true);
                const label = row.querySelector('.col-md-6');
                const input = row.querySelector("input[type='text']");
                if (!label || !input) return;

                label.textContent = 'Spectate (Party)';
                input.id = 'keySpectate';
                input.value = instance.controls.Spectate?.[1] ?? '';

                template.insertAdjacentElement('afterend', row);
            })();

            /**
             *  Puts the Old Split Macros switch in germs' Controls pane, under Reset Controls.
             *
             *  Cloned off a keybind row for the same reason the Spectate row is - it picks up
             *  whatever that pane's rows are made of - with the keybind box swapped for the
             *  switch markup the General pane uses, so it reads as a toggle while still lining
             *  up with the bindings above it.
             */
            (function ensureOldSplitMacroRow() {
                const pane = document.getElementById('settings-controls');
                if (!pane || document.getElementById('oldSplitMacros')) return;

                const template = document.getElementById('keyHide')?.closest('.row');
                const resetRow = pane.querySelector('.row');
                if (!template || !resetRow) return;

                const row = template.cloneNode(true);
                row.querySelector('.col-md-6').textContent = 'Old Split Macros';

                const container = row.querySelector('.input-group');
                // The keybind rows pin their group to the width of a key box; a switch sizes itself
                container.style.width = '';
                container.innerHTML = `
                    <label class="switch">
                        <input type="checkbox" id="oldSplitMacros">
                        <span class="slider round"></span>
                    </label>
                `;

                const input = row.querySelector('#oldSplitMacros');
                input.checked = !!instance.settings.settings.oldSplitMacros;
                input.addEventListener('change', () => instance.changeSetting('oldSplitMacros', input.checked));

                resetRow.insertAdjacentElement('afterend', row);
            })();

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

                /**
                 *  A key may only be bound to one thing. This half clears its own bindings and
                 *  posts the key out for the germsfox half to clear its own - they are in
                 *  different JS worlds, so the bridge is the only way across. jQuery does not
                 *  copy `code` onto its event wrapper, so it is read off the native one.
                 */
                const boundControl = $(this).attr('id').slice(3);
                const nativeKeyEvent = vF.originalEvent || vF;
                if (instance.controls.hasOwnProperty(boundControl)) {
                    instance.unbindGermsKey(vF.which, nativeKeyEvent.code, boundControl);
                }
                window.postMessage({
                    __germsfox: true,
                    type: 'keybind',
                    code: nativeKeyEvent.code || null,
                    keyCode: vF.which,
                }, '*');

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
