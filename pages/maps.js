
settings.hintAlign = 'left';
unmap('u'); // u is used for undo;
/*
 ** iteration in collection or tree
 **
 ** {: fist or root
 ** }: last or last leaf
 ** ]: next
 ** [: previous
 ** t: to
 ** |: time based last used(active)
 ** >: first child of the parent, next sibling is no children
 ** <: parent, previous sibling if no parent
 ** note:
 ** all command could be prefix with numbers to repeat.
 ** the prefix number for 'to' command is the object index in collection
 */
keyMaps = [
    ['<F1>', '?', false],
    [']t', 'R', false],
    ['[t', 'E', false],
    ['{t', 'g0', true],
    ['|t', '<Ctrl-6>', true], // last used tab
    ['}t', 'g$', true],
    [']s', 'cs', true],
    [']h', 'D', false],
    ['[h', 'S', false],
    ['|{', 'gT', true], // first actived tab
    ['|}', 'gt', true], // last actived tab
    ['|[', 'B'], //  one tab history back
    ['|]', 'F'], //  one tab history forward
    ['[u', 'gu', true],
    ['{u', 'gU', true],

    ['<Alt-t>', '<Alt-s>', true], // toggle surfkey
    ['<Alt-s>', 'd', true], // down
    ['<Alt-w>', 'e', true], // up
    ['{i', 'gi', true],

    // display hints
    ['dh', '<Ctrl-h>', true],
    ['dH', '<Ctrl-j>', true],
    ['ds', ';fs', true],
    ['dmt', 'cf', true],
    ['dt', 'gf', true],
    ['dT', 'af', true],
    ['di', 'q', true], // click image or button
    ['dvs', 'zv', true], // visual element select
    ['dq', 'cq', true],// query word

    // add
    ['aj', ';i', true], // add jquery

    // remove
    ['-h', ';dh', true], // delete history older than 30 days
    ['-b', ';db', true], // remove bookmark of this page

    // search and show
    ['sb', 'ob', true],
    ['sg', 'og', true],
    ['sd', 'od', true],
    ['sw', 'ow', true],
    ['sy', 'oy', true],
    ['sla', 'sql', true], // show last action
    // open
    ['oh', 'H', false], // open one tab history in new tab
    ['os', 'se', true, '#11Open settings'],
    ['oba', 'ga', true], // browser about
    ['obb', 'gb', true], // browser bookmark
    ['obc', 'gc', true], // browser cache
    ['obd', 'gd', true], // browser download
    ['obh', 'gh', true], // browser history
    ['obk', 'gk', true], // browser cookies
    ['obe', 'ge', true], // browser extensions
    ['obn', 'gn', true], // browser net-internals
    ['obs', 'gs', true], // browser page source
    ['obi', 'si', true], // browser inspect
    ['om', 'sm', true], // markdown preview
    ['oo', 'go', false], // open url in current tab

    // close
    ['cd', ';j', true], // close download shelf
    ['c}', 'gx$', true],
    ['c{', 'gx0', true],
    ['c[', 'gxt', true],
    ['c]', 'gxT', true],
    ["c'", 'gxx', true],

    // move
    ['\\l', '<<', true],
    ['\\r', '>>', true],
    ['\\o', 'W', false],

    // copy(yank)
    ['ypf', 'yp', true], // yank form data for post
    ['ypi', ';cp', true], // yank proxy info

    // past
    ['pp', ';ap', true], // apply proxy info from clipboard
    ['pf', ';pf', true], // fill form with data from yf

    // edit
    ['eur', 'sU', true],
    ['eut', 'su', true],


    // undo, unset, clear
    ['uh', ';m', true], // hover
    ['uc', 'X'], // undo tab close

    //reload, refresh, reset
    ['rr', 'r', true], // ctrl-r and F5
    ['rs', 'cS', true], // refresh scrollables
    ['r#', 'g#', true], // reload without hash
    ['r?', 'g?', true], // reload without query string

    // set
    ['=pa', 'spa', true],
    ['=pb', 'spb', true],
    ['=pd', 'spd', true],
    ['=ps', 'sps', true],
    ['=pc', 'spc', true],

    // toggle
    ['`pi', '<Alt-p>', true], // pin
    ['`pr', 'cp', true], // proxy
    ['`m', '<Alt-m>', true], // mute

    // mis
    ['z0', 'zr']
];

function rmap(newKey, oldKey, ummapOldKey, domain, annotation) { // replacing map
    map(newKey, oldKey, domain, annotation);
    !!ummapOldKey && unmap(oldKey);
}

keyMaps.forEach(map => {
    rmap(map[0], map[1], map[2], undefined, map[3]);
});

Front.registerInlineQuery({
    url: "https://api.shanbay.com/bdc/search/?word=",
    parseResult: function (res) {
        try {
            res = JSON.parse(res.text);
            var exp = res.msg;
            if (res.data.definition) {
                var pronunciations = [];
                for (var reg in res.data.pronunciations) {
                    pronunciations.push(`<div>[${reg}] ${res.data.pronunciations[reg]}</div>`);
                    // pronunciations.push(`<div><audio src="${res.data[reg+'_audio']}" controls></audio></div>`);
                }
                var definition = res.data.definition.split("\n").map(function (d) {
                    return `<li>${d}</li>`;
                }).join("");
                exp = `${pronunciations.join("")}<ul>${definition}</ul>`;
            }
            if (res.data.en_definitions) {
                exp += "<hr/>";
                for (var lex in res.data.en_definitions) {
                    var sense = res.data.en_definitions[lex].map(function (s) {
                        return `<li>${s}</li>`;
                    }).join("");
                    exp += `<div>${lex}</div><ul>${sense}</ul>`;
                }
            }
            return exp;
        } catch (e) {
            return "";
        }
    }
});