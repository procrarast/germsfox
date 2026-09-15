#!/usr/bin/env python3
"""
Regenerates the structural tables in OUTLINE.md from src/overrides/bundle.js.

Only the blocks between the AUTO markers are rewritten - everything else in the file is
hand-written knowledge and is left alone. Run after any change that moves code:

    python3 util/outline.py
"""
import io, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src/overrides/bundle.js'
OUT = ROOT / 'OUTLINE.md'

lines = io.open(SRC, encoding='utf-8').read().split('\n')

# ---- classes, with their line spans -----------------------------------------
marks = []
for i, l in enumerate(lines):
    m = re.match(r'^\s*;?class ([A-Za-z_$][\w$]*)(?:\s+extends\s+([A-Za-z_$][\w$]*))?', l)
    if m:
        marks.append((i + 1, m.group(1), m.group(2)))

def span_end(start):
    depth, started = 0, False
    for i in range(start - 1, len(lines)):
        depth += lines[i].count('{') - lines[i].count('}')
        if '{' in lines[i]:
            started = True
        if started and depth <= 0:
            return i + 1
    return len(lines)

classes = [(a, name, base, span_end(a)) for a, name, base in marks]

# ---- module-level constants --------------------------------------------------
consts = []
for i, l in enumerate(lines):
    m = re.match(r'^        const ([A-Z][A-Z0-9_]*)\s*=\s*(.+?);?\s*$', l)
    if m:
        val = m.group(2)
        consts.append((i + 1, m.group(1), val if len(val) < 46 else val[:43] + '...'))

# ---- protocol opcodes --------------------------------------------------------
ops = []
for i, l in enumerate(lines):
    m = re.match(r'\s*case (0x[0-9a-fA-F]+|\d+):\s*$', l)
    if m and i + 1 < len(lines):
        h = re.search(r'this\.(handle[A-Za-z]+)', lines[i + 1])
        if h:
            n = int(m.group(1), 0)
            ops.append((n, m.group(1), h.group(1)))

def table(rows, head):
    w = [max(len(str(r[i])) for r in [head] + rows) for i in range(len(head))]
    out = ['| ' + ' | '.join(str(h).ljust(w[i]) for i, h in enumerate(head)) + ' |',
           '|' + '|'.join('-' * (x + 2) for x in w) + '|']
    for r in rows:
        out.append('| ' + ' | '.join(str(c).ljust(w[i]) for i, c in enumerate(r)) + ' |')
    return '\n'.join(out)

# Carried over from the existing table so the hand-written column survives regeneration.
# Split on pipes rather than matched with a regex - the columns are padded, and the purposes
# themselves contain backticks and punctuation that a pattern kept tripping over.
PURPOSE = {}
if OUT.exists():
    for line in io.open(OUT, encoding='utf-8'):
        if not line.startswith('| `'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) == 5 and cells[0].startswith('`'):   # skips the header and rule rows
            PURPOSE[cells[0].strip('`')] = cells[4]

cls_rows = [(f'`{n}`', f'{a}-{e}', e - a + 1, f'`{b}`' if b else '-', PURPOSE.get(n, ''))
            for a, n, b, e in classes]
const_rows = [(f'`{n}`', ln, f'`{v}`') for ln, n, v in consts]
op_rows = [(f'`{hex(n)}`', n, f'`{h}()`') for n, _, h in sorted(ops)]

blocks = {
    'CLASSES': table(cls_rows, ('class', 'lines', 'len', 'extends', 'what it is')),
    'CONSTANTS': table(const_rows, ('name', 'line', 'value')),
    'OPCODES': table(op_rows, ('opcode', 'dec', 'handler')),
    'STATS': f'`bundle.js` is **{len(lines)}** lines and holds **{len(classes)}** classes.',
}

text = io.open(OUT, encoding='utf-8').read() if OUT.exists() else ''
for key, body in blocks.items():
    pat = re.compile(rf'<!-- AUTO:{key} -->.*?<!-- /AUTO:{key} -->', re.S)
    if not pat.search(text):
        print(f'warning: no AUTO:{key} markers in OUTLINE.md', file=sys.stderr)
        continue
    text = pat.sub(f'<!-- AUTO:{key} -->\n{body}\n<!-- /AUTO:{key} -->'.replace('\\', '\\\\'), text)

io.open(OUT, 'w', encoding='utf-8').write(text)
print(f'OUTLINE.md updated: {len(classes)} classes, {len(consts)} constants, {len(ops)} opcodes')
