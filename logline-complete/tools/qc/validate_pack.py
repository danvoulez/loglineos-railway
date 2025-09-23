
#!/usr/bin/env python3
import sys, re, json
from pathlib import Path
def validate_pack(path: Path):
    lines = path.read_text().splitlines()
    errors = []
    def find_line(prefix):
        for i,l in enumerate(lines, start=1):
            if l.strip().startswith(prefix):
                return i,l
        return None,None
    i,l = find_line('version:')
    if not l or not re.search(r'version:\s*\d+', l):
        errors.append('missing or invalid "version:" (should be integer)')
    i,l = find_line('layout:')
    if not l:
        errors.append('missing "layout:" block')
    else:
        need = ['engine:', 'interfaces:', 'policies:']
        block = "\n".join(lines[i: i+10])
        for n in need:
            if n not in block:
                errors.append(f'missing layout entry "{n}"')
    i,l = find_line('post_install:')
    if not l:
        errors.append('missing "post_install:" block')
    else:
        has_attach = any(re.match(r'\s*-\s*ATTACH\s+\S+', ln) for ln in lines[i+1: i+30])
        if not has_attach:
            errors.append('no ATTACH lines under "post_install:"')
    return errors
def main():
    root = Path('.')
    pack = root/'pack.yml'
    if not pack.exists():
        pack = root/'Engine'/'pack.yml'
    if not pack.exists():
        print(json.dumps({'ok': False, 'error': 'pack.yml not found (root or Engine/)'}))
        return 2
    errs = validate_pack(pack)
    if errs:
        print(json.dumps({'ok': False, 'errors': errs}, indent=2)); return 1
    print(json.dumps({'ok': True, 'message': f'{pack} looks sane'}, indent=2)); return 0
if __name__ == '__main__':
    sys.exit(main())
