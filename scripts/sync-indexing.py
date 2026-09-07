#!/usr/bin/env python3
"""Align robots, reciprocal hreflang and sitemap with each German page.

Run after changing the German indexing policy or adding a translation.
Uses the existing language-menu mapping; never invents missing routes.
Only SEO tags in <head>, legacy indexing headers and sitemap are changed.
"""
import argparse
import html
import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('language_menus', ROOT / 'scripts/sync-language-menus.py')
menus = importlib.util.module_from_spec(spec)
spec.loader.exec_module(menus)
META = re.compile(r'<meta\b[^>]*>', re.I)
LINK = re.compile(r'<link\b[^>]*>', re.I)
ORIGIN = 'https://tinnitusbioregulation.com'


def attrs(tag):
    return {key.lower(): value for key, value in menus.attributes(tag).items()}


def robots_tag(tag):
    return attrs(tag).get('name', '').lower() in ('robots', 'googlebot')


def indexing(source):
    head = source.split('</head>', 1)[0]
    values = [attrs(tag).get('content', '').lower() for tag in META.findall(head) if robots_tag(tag)]
    return not any(re.search(r'\b(noindex|none)\b', value) for value in values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    pages, groups = menus.collect()
    policy = {group: indexing(source) for _, source, lang, group, error in pages if lang == 'de' and not error}
    changes = []
    indexable = []

    def save(path, old, new):
        if old != new:
            changes.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(new)

    for path, source, language, group, error in pages:
        if error:
            assert not indexing(source), f'Error page must remain noindex: {path}'
            continue
        can_index = policy[group]
        head, tail = source.split('</head>', 1)
        original_tail = tail
        # Do not rewrite the German policy itself. Foreign counterparts follow it.
        if language != 'de':
            desired = '<meta name="robots" content="' + ('index, follow' if can_index else 'noindex, follow') + '">'
            seen = [False]
            def replace_meta(match):
                if not robots_tag(match[0]):
                    return match[0]
                if seen[0]:
                    return ''
                seen[0] = True
                return desired
            head = META.sub(replace_meta, head)
            if not seen[0]:
                head = re.sub(r'(<head\b[^>]*>)', lambda m: m[0] + '\n' + desired, head, count=1, flags=re.I)
            head = head.replace('<!-- taalblokkade -->', '')

        # Do not advertise blocked pages as search-result language alternatives.
        head = re.sub(r'^[ \t]*<link\b[^>]*\bhreflang="[^"]*"[^>]*>[^\S\n]*\n?', '', head, flags=re.M | re.I)
        if can_index:
            siblings = groups[group]
            tags = ['  <link rel="alternate" hreflang="' + code + '" href="' + html.escape(ORIGIN + siblings[code], quote=True) + '">' for code, _ in menus.LANGUAGES if code in siblings]
            tags.append('  <link rel="alternate" hreflang="x-default" href="' + ORIGIN + siblings['de'] + '">')
            canonical = [tag for tag in LINK.findall(head) if attrs(tag).get('rel') == 'canonical']
            assert len(canonical) == 1, path
            head = head.replace(canonical[0], canonical[0] + '\n' + '\n'.join(tags), 1)
            indexable.append(ORIGIN + siblings[language])
        updated = head + '</head>' + tail
        assert updated.split('</head>', 1)[1] == original_tail, path
        save(path, source, updated)

    headers_path = ROOT / '_headers'
    headers = headers_path.read_text()
    updated_headers = re.sub(r'\n/(?:nl/\*|hi/\*|fr/sources-scientifiques)\n[ \t]+X-Robots-Tag: noindex, follow\n?', '\n', headers)
    legacy = updated_headers.find('# ------------------------------------------------------------------\n# SPRACHSPERRE')
    if legacy != -1:
        # This legacy comment described only the three removed blocks.
        remainder = updated_headers[legacy:]
        assert all(not line.strip() or line.startswith('#') for line in remainder.splitlines()), 'Review new headers following legacy comment'
        updated_headers = updated_headers[:legacy].rstrip() + '\n\n# Indexierung je Seite: deutsches Vorbild; Abgleich mit scripts/sync-indexing.py.\n'
    save(headers_path, headers, updated_headers)

    assert len(indexable) == len(set(indexable)), 'Duplicate sitemap URLs'
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in sorted(indexable):
        sitemap += '  <url><loc>' + html.escape(url) + '</loc></url>\n'
    sitemap += '</urlset>\n'
    path = ROOT / 'sitemap.xml'
    save(path, path.read_text(), sitemap)
    print(f'{len(pages)} pages; {len(indexable)} indexable URLs; {len(changes)} files ' + ('need syncing' if args.check else 'updated'))
    if args.check and changes:
        print('\n'.join(changes))
        raise SystemExit(1)


if __name__ == '__main__':
    main()
