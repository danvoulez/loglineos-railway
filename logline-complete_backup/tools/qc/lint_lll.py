
#!/usr/bin/env python3
import sys, re, json
from pathlib import Path
REQUIRED_FIELDS = ['workflow:', 'flow:', 'description:']
FN_SIG = re.compile(r'^\s*fn\s+[a-zA-Z0-9_]+\s*\([^\)]*\)\s*->\s*[^\{]*\{\s*\}$')
def check_lll(path: Path):
    txt = path.read_text(errors='ignore')
    issues = []
    bal = 0
    for ch in txt:
        if ch == '{': bal += 1
        elif ch == '}': bal -= 1
    if bal != 0:
        issues.append(f"unbalanced braces (delta={bal})")
    head = txt.splitlines()[:40]
    head_txt = "\n".join(head)
    for f in REQUIRED_FIELDS:
        if f not in head_txt:
            issues.append(f"missing header field: {f.rstrip(':')}")
    in_api = False
    for line in txt.splitlines():
        s = line.strip()
        if s.startswith('api'):
            in_api = True
        if in_api and s == '}':
            in_api = False
        if in_api and s.startswith('fn'):
            if not FN_SIG.match(line):
                issues.append(f"bad fn signature: {line.strip()}")
    return issues
def main(root='.'):
    results = []
    for p in Path(root).rglob('*.lll'):
        issues = check_lll(p)
        results.append({'path': str(p), 'issues': issues, 'ok': not bool(issues)})
    print(json.dumps({'results': results, 'ok': all(r['ok'] for r in results)}, indent=2))
if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
