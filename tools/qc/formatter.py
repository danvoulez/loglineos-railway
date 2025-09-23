
#!/usr/bin/env python3
import sys, re, json
from pathlib import Path
MAX_COL = 120
def is_text(b): return b.find(b'\x00') == -1
def normalize(s):
    s = s.replace('\r\n','\n').replace('\r','\n')
    s = '\n'.join([ln.rstrip() for ln in s.split('\n')]).replace('\t','  ')
    s = re.sub(r'\n{3,}', '\n\n', s)
    if not s.endswith('\n'): s += '\n'
    return s
def main(root):
    changed = 0; long_lines = []
    for p in Path(root).rglob('*'):
        if p.is_file():
            b = p.read_bytes()
            if not is_text(b): continue
            s = b.decode('utf-8', errors='ignore')
            out = normalize(s)
            if out != s:
                p.write_text(out, encoding='utf-8')
                changed += 1
            for i,ln in enumerate(out.splitlines(), start=1):
                if len(ln) > MAX_COL:
                    long_lines.append({'path': str(p), 'line': i, 'len': len(ln)})
    print(json.dumps({'changed': changed, 'long_lines': long_lines}, indent=2))
if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv)>1 else ".")
