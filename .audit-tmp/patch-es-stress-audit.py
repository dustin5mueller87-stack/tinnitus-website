from pathlib import Path
import re

p=Path('.audit-tmp/es-stress-audit.py')
text=p.read_text(encoding='utf-8')

start=text.index('def apply_changes(')
end=text.index('\ndef final_verify_changes', start)
new_func=r'''def _fragment_text_nodes(fragment: str) -> list[str]:
    from bs4 import NavigableString
    soup=BeautifulSoup(f'<div id="root">{fragment}</div>','html.parser')
    root=soup.find(id='root')
    return [str(x) for x in root.descendants if isinstance(x,NavigableString) and str(x).strip()]


def _replace_unique(raw: str, old: str, new: str, label: str) -> str:
    import html as html_mod
    candidates=[]
    for candidate in (old, html_mod.escape(old,quote=False), old.replace('\xa0','&nbsp;')):
        if candidate not in candidates: candidates.append(candidate)
    for candidate in candidates:
        count=raw.count(candidate)
        if count==1:
            replacement=new if candidate==old else html_mod.escape(new,quote=False)
            return raw.replace(candidate,replacement,1)
    counts={candidate:raw.count(candidate) for candidate in candidates}
    raise RuntimeError(f'Keine eindeutige quelltexttreue Ersetzung für {label}: {counts}; ALT={old!r}')


def apply_changes(llm: Llama, es_raw: str, units: list[Unit], audit: dict[str,dict[str,Any]], verdicts: dict[str,dict[str,Any]], rules: str) -> tuple[str,list[dict[str,Any]]]:
    final_raw=es_raw
    accepted=[]
    by_id={u.uid:u for u in units}
    for uid,v in verdicts.items():
        if str(v.get('decision')).upper() not in {'APPROVE','MODIFY'}: continue
        if float(v.get('confidence',0)) < 0.90: continue
        u=by_id[uid]
        new_es=str(v.get('final_es','')).strip()
        if not new_es or new_es==u.es: continue
        if u.kind=='html':
            new_html=surgical_html(llm,u,v,rules)
            if tag_signature(new_html)!=tag_signature(u.es_html):
                raise RuntimeError(f'HTML-Strukturänderung bei {uid}')
            old_nodes=_fragment_text_nodes(u.es_html)
            new_nodes=_fragment_text_nodes(new_html)
            if len(old_nodes)!=len(new_nodes):
                raise RuntimeError(f'Textknotenanzahl verändert bei {uid}: {len(old_nodes)} -> {len(new_nodes)}')
            changed_nodes=0
            for node_index,(old_node,new_node) in enumerate(zip(old_nodes,new_nodes),1):
                if old_node!=new_node:
                    final_raw=_replace_unique(final_raw,old_node,new_node,f'{uid}/Textknoten{node_index}')
                    changed_nodes+=1
            if not changed_nodes:
                raise RuntimeError(f'Genehmigte Änderung {uid} erzeugte keinen Textknotenunterschied')
        elif u.kind=='attr':
            path,attr=u.locator.rsplit('@',1)
            escaped_old=u.es.replace('&','&amp;').replace('"','&quot;')
            escaped_new=new_es.replace('&','&amp;').replace('"','&quot;')
            patterns=[(f'{attr}="{u.es}"',f'{attr}="{new_es}"'),(f'{attr}="{escaped_old}"',f'{attr}="{escaped_new}"')]
            done=False
            for old_assign,new_assign in patterns:
                if final_raw.count(old_assign)==1:
                    final_raw=final_raw.replace(old_assign,new_assign,1); done=True; break
            if not done:
                raise RuntimeError(f'Attribut nicht eindeutig ersetzbar {uid}: {attr}')
        elif u.kind=='json':
            old_json=json.dumps(u.es,ensure_ascii=False)
            new_json=json.dumps(new_es,ensure_ascii=False)
            if final_raw.count(old_json)!=1:
                raise RuntimeError(f'JSON-Wert nicht eindeutig ersetzbar {uid}: {final_raw.count(old_json)}')
            final_raw=final_raw.replace(old_json,new_json,1)
        accepted.append({
            'uid':uid,'kind':u.kind,'section_de':u.section_de,'de':u.de,'old_es':u.es,
            'old_es_de':audit[uid].get('old_es_de',''),'new_es':new_es,
            'new_es_de':v.get('final_es_de',''),'problem_de':v.get('problem_de') or audit[uid].get('problem_de',''),
            'reason_de':v.get('reason_de',''),'severity':v.get('severity',audit[uid].get('severity','MINOR')),
            'confidence':v.get('confidence',0),'locator':u.locator
        })
    # Vollständige Struktur-Neuprüfung gegen das deutsche Original; das Rohformat bleibt unangetastet.
    rebuilt,_=build_units(PAGE_DE.read_text(encoding='utf-8'),final_raw)
    if len(rebuilt)!=len(units):
        raise RuntimeError(f'Prüfeinheiten nach Korrektur verändert: {len(units)} -> {len(rebuilt)}')
    return final_raw,accepted
'''
text=text[:start]+new_func+text[end:]

old_main="""    write_matrix(units,audit,accepted,verification)\n    write_reports(units,accepted,audit,rules,technical,js_rows,images,render,day3,arsenal_docs)\n    update_master(accepted,len(units),len(images))\n    zip_path=package(final_raw,de_raw,es_raw,accepted)\n    (OUT/'technical-validation.json').write_text(json.dumps({'html':technical,'javascript':js_rows,'render':render,'day3':day3},ensure_ascii=False,indent=2),encoding='utf-8')\n    (OUT/'READY').write_text('READY\\n',encoding='utf-8')\n"""
new_main="""    write_matrix(units,audit,accepted,verification)\n    write_reports(units,accepted,audit,rules,technical,js_rows,images,render,day3,arsenal_docs)\n    update_master(accepted,len(units),len(images))\n    (OUT/'technical-validation.json').write_text(json.dumps({'html':technical,'javascript':js_rows,'render':render,'day3':day3},ensure_ascii=False,indent=2),encoding='utf-8')\n    (OUT/'READY').write_text('READY\\n',encoding='utf-8')\n    zip_path=package(final_raw,de_raw,es_raw,accepted)\n"""
if old_main not in text:
    raise SystemExit('Main-Block zum Patchen nicht gefunden')
text=text.replace(old_main,new_main,1)
p.write_text(text,encoding='utf-8')
print('Source-preserving patch applied.')
