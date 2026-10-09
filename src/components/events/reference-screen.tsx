import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import parse, { domToReact, Element as HtmlElement, attributesToProps, type HTMLReactParserOptions, type DOMNode } from 'html-react-parser';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { referenceScreens } from '@/data/reference-screens';
import { teammateNumbers } from '@/lib/event-rules';

type Screen = keyof typeof referenceScreens;
type Modal = { title: string; body: string; kind?: 'pass' | 'schedule' | 'teams' | 'teaser' };
const navPaths = ['/', '/event-details', '/my-passes', '/organizer'] as const;

async function downloadPdf(title: string, body: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(24); doc.text('JECRC Events Hub', 20, 25);
  doc.setFontSize(17); doc.text(title, 20, 45);
  doc.setFontSize(11); doc.text(doc.splitTextToSize(body, 165), 20, 65);
  doc.text('Reference preview — verify with the event organizer before entry.', 20, 270);
  doc.save(`${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
}

export function ReferenceScreen({ screen }: { screen: Screen }) {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [modal, setModal] = useState<Modal | null>(null);
  const [notice, setNotice] = useState('');
  const content = useMemo(() => {
    const options: HTMLReactParserOptions = { replace(node) {
      if (!(node instanceof HtmlElement)) return;
      if (node.name === 'button') {
        const props = attributesToProps(node.attribs);
        return <Button {...props} className={node.attribs['class']} variant="reference" type={node.attribs['type'] === 'submit' ? 'submit' : 'button'}>{domToReact(node.children as DOMNode[], options)}</Button>;
      }
      if (node.name === 'a' && navPaths.includes(node.attribs['href'] as typeof navPaths[number])) {
        return <Link to={node.attribs['href'] as typeof navPaths[number]} className={node.attribs['class']} aria-current={node.attribs['aria-current'] === 'page' ? 'page' : undefined}>{domToReact(node.children as DOMNode[], options)}</Link>;
      }
      return undefined;
    } };
    return parse(referenceScreens[screen], options);
  }, [screen]);

  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => {
    if (!modal) return;
    const listener = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null); };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [modal]);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const q = (selector: string) => container.querySelector<HTMLElement>(selector);
    const all = (selector: string) => Array.from(container.querySelectorAll<HTMLElement>(selector));
    const activate = (buttons: HTMLElement[], active: HTMLElement) => buttons.forEach(b => {
      const isActive = b === active;
      b.classList.toggle('bg-primary-container', isActive); b.classList.toggle('text-on-primary-container', isActive);
      b.classList.toggle('bg-surface-container', !isActive); b.classList.toggle('text-on-surface-variant', !isActive);
      b.setAttribute('aria-selected', String(isActive));
    });
    let category = 'All Events'; let search = ''; let savedOnly = false;
    const articles = all('article');
    let venue = 0; let club = 0;
    const categories = ['Technical & Hackathons','Robotics & Hardware','Cultural & Dance','Workshops & Talks','E-Sports & Gaming','Technical & Hackathons'];
    const venues = [2,5,3,2,4,6]; const clubs = [1,3,4,2,5,6];
    const filter = () => {
      let count = 0;
      articles.forEach((a, i) => { const visible = (category === 'All Events' || categories[i] === category) && a.textContent?.toLowerCase().includes(search) && (!venue || venues[i] === venue) && (!club || clubs[i] === club) && (!savedOnly || a.dataset['saved'] === 'true'); a.classList.toggle('hidden', !visible); if (visible) count++; });
      let empty = q('.reference-empty');
      if (!empty && articles[0]?.parentElement) { empty = document.createElement('div'); empty.className = 'reference-empty'; articles[0].parentElement.append(empty); }
      if (empty) { empty.textContent = 'No events match your filters.'; empty.classList.toggle('hidden', count > 0); }
      const label = all('span').find(x => x.textContent?.startsWith('Showing 6 of 42')); if (label) label.textContent = `Showing ${count} of 42 Featured Events`;
    };
    all('article').forEach(a => {
      const save = document.createElement('button'); save.type = 'button'; save.className = 'absolute top-3 right-3 p-1.5 rounded-lg bg-surface-container-lowest text-primary';save.setAttribute('aria-label','Save event');save.dataset['saveEvent']='true';
      const icon=document.createElement('span');icon.className='material-symbols-outlined';icon.textContent='bookmark_add';save.append(icon);a.firstElementChild?.append(save);
    });
    if (screen === 'details') {
      const team = q('#dynamicTeammates');
      const update = (size: number) => {
        if (!team) return; team.replaceChildren();
        teammateNumbers(size).forEach(number => {
          const field=document.createElement('div');const label=document.createElement('label');label.className='block text-label-sm text-secondary uppercase mb-1';label.textContent=`Teammate ${number} Email`;label.htmlFor=`teammate-${number}`;
          const input=document.createElement('input');input.id=`teammate-${number}`;input.type='email';input.required=true;input.placeholder=`member${number}@jecrc.ac.in`;input.className='w-full px-3 py-1.5 rounded-lg bg-surface text-on-surface text-body-sm';field.append(label,input);team.append(field);
        }); activate(all('.size-btn'), q(`#team-btn-${size}`) || team);
      };
      update(3);
    }
    const click = (event: MouseEvent) => {
      const el = event.target instanceof Element ? event.target.closest<HTMLElement>('button,a,[data-tab]') : null;
      if (!el || !container.contains(el)) return;
      const text = el.textContent?.trim() || ''; const id = el.id;
      if (el.dataset['saveEvent']) {const a=el.closest('article');if(a){a.dataset['saved']=String(a.dataset['saved']!=='true');el.setAttribute('aria-label',a.dataset['saved']==='true'?'Unsave event':'Save event');el.firstElementChild && (el.firstElementChild.textContent=a.dataset['saved']==='true'?'bookmark':'bookmark_add');}return;}
      if (el.matches('a') && el.getAttribute('href') === '#') { event.preventDefault(); if(text.includes('Host an Event')) void navigate({to:'/organizer'});else if(text.includes('Home'))void navigate({to:'/'});else if(text.includes('Calendar'))setModal({title:'Campus Calendar',body:'March 28–30 · Hack-JECRC 3.0\nApril 5 · GenAI on AWS Cloud\nApril 10–13 · Renaissance 2025',kind:'schedule'});else setModal({title:text,body:'This campus resource is not connected in the reference preview.'});return; }
      if (el.classList.contains('category-pill')) {category=text;activate(all('.category-pill'),el);filter();return;}
      if (el.dataset['action']?.startsWith('switchEventTab')) {const tab=el.dataset['action'].match(/'([^']+)'/)?.[1];all('[id^="tab-content-"]').forEach(p=>{p.classList.toggle('hidden',p.id!==`tab-content-${tab}`);p.classList.toggle('flex',p.id===`tab-content-${tab}`);});activate(all('#eventTabNav button'),el);return;}
      if(el.dataset['action']?.startsWith('updateMemberCount')) {const size=Number(el.dataset['action'].match(/\d+/)?.[0]);const team=q('#dynamicTeammates');if(team){team.replaceChildren();teammateNumbers(size).forEach(n=>{const div=document.createElement('div');const label=document.createElement('label');label.textContent=`Teammate ${n} Email`;label.htmlFor=`teammate-${n}`;label.className='block text-label-sm text-secondary uppercase mb-1';const input=document.createElement('input');input.id=`teammate-${n}`;input.type='email';input.required=true;input.placeholder=`member${n}@jecrc.ac.in`;input.className='w-full px-3 py-1.5 rounded-lg bg-surface text-on-surface text-body-sm';div.append(label,input);team.append(div);});activate(all('.size-btn'),el);}return;}
      if (id==='clubSelectBtn') {q('#clubDropdownMenu')?.classList.toggle('hidden');return;}
      if(el.classList.contains('club-option')) {const name=el.dataset['club'] || text.replace('check','').trim();const label=q('#activeClubName');if(label)label.textContent=name;q('#clubDropdownMenu')?.classList.add('hidden');setNotice(`Selected ${name}`);return;}
      if(id==='createEventModalBtn') {q('#eventModal')?.classList.remove('hidden');return;}
      if(id==='closeEventModalBtn'||id==='cancelModalBtn') {q('#eventModal')?.classList.add('hidden');return;}
      if(id==='broadcastScrollBtn') {q('#broadcastComposer')?.scrollIntoView({behavior:'smooth',block:'center'});q('#broadcastSubject')?.focus();return;}
      if(id==='exportCsvBtn') {const blob=new Blob(['Name,Event,Status\nPriya Sharma,Hack-JECRC 3.0,Registered\nTeam CyberKnights,Hack-JECRC 3.0,Verified\nRohan Verma,DSA Bootcamp,Waitlisted'],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='jecrc-reference-attendees.csv';a.click();URL.revokeObjectURL(url);setNotice('Reference attendee list downloaded.');return;}
      if(id==='openScannerBtn'||text.includes('Scan Gate Token')||text==='qr_code') {setModal({title:'Digital Gate Token',body:'Hack-JECRC 3.0\nAarav Sharma · Team ByteForge\nPass #JECRC-HACK-8841\nLab 4 · Table 12\nReference token: 9482-ADF0',kind:'pass'});return;}
      if (el.dataset['tab']) {activate(all('.tab-btn'),el);if(el.dataset['tab']==='timeline')setModal({title:'My Schedule & Calendar',body:'March 28 · 08:30 AM — Gate 1 check-in & kit collection\n10:00 AM — Opening keynote at Audi 2\n12:00 PM — Hacking begins at Lab 4\nMarch 29 · 08:00 PM — Code freeze\nMarch 30 · 10:00 AM — Demo expo & awards',kind:'schedule'});if(el.dataset['tab']==='past')setModal({title:'Past Events & Attendance',body:'Smart India Internal Hackathon 2024 · Attended\nRoboSoccer Championship 2024 · Attended\nCampus participation records shown in this reference preview.'});if(el.dataset['tab']==='certs')all('h2,h3').find(h=>h.textContent?.includes('Verified Credentials'))?.scrollIntoView({behavior:'smooth',block:'center'});return;}
      if(text.includes('Download')) {void downloadPdf(text.includes('Certificate')?'Verified Certificate':'Digital Event Pass','Aarav Sharma · JECRC / 21EJCCS042\nHack-JECRC 3.0 · Team ByteForge\nMarch 28–30, 2025\nLab 4, Table 12 · Gate 1\nPass #JECRC-HACK-8841');return;}
      if(/Register Team|Register Now|Book Pass|Claim Seat|Register Squad|Submit Deck|Explore Fest/.test(text)) {void navigate({to:'/event-details'});return;}
      if(text.includes('Watch Teaser')) {setModal({title:'Renaissance 2025',body:'March 24–27, 2025 · Central Lawns & Audi-1\nThe reference includes a festival image, but no teaser video.',kind:'teaser'});return;}
      if(el.getAttribute('aria-label')==='Saved Bookmarks') {if(screen!=='explore'){void navigate({to:'/'});return;}savedOnly=!savedOnly;filter();setNotice(savedOnly?'Showing saved events.':'Showing all events.');return;}
      if(el.getAttribute('aria-label')==='Notifications') {setModal({title:'Campus Notifications',body:'Hack-JECRC 3.0 registration is open.\nBring your college ID with your digital pass.\nYour next check-in is at Gate 1, 08:30 AM.'});return;}
      if(text.includes('Sync Timetable')) {setNotice('Reference schedule is up to date.');return;}
      if(text.includes('Teammates')||text==='View Teams') {setModal({title:'Team ByteForge',body:'4 members registered\nAarav Sharma · Team Leader\nReference team roster · Assigned Lab 4, Table 12',kind:'teams'});return;}
      if(text.includes('Entry Guidelines')) {setModal({title:'Campus Entry Guidelines',body:'Bring your physical JECRC College ID and digital pass.\nGates open at 07:45 AM.\nCollect your Renaissance wristband on April 9.'});return;}
      if(text.includes('Wallet')) {setModal({title:'Add to Wallet',body:'Wallet integration is not connected in this preview. Download your PDF pass to keep a copy.'});return;}
      if(text.includes('Schedule')||text==='chevron_left'||text==='chevron_right') {setModal({title:'Campus Schedule',body:'March 28–30 · Hack-JECRC 3.0\nApril 5 · GenAI on AWS Cloud\nApril 10–13 · Renaissance 2025',kind:'schedule'});return;}
      if(['All Statuses','Drafts','Archived'].includes(text)) {activate([el,...all('button').filter(b=>['All Statuses','Drafts','Archived'].includes(b.textContent?.trim()||''))],el);setModal({title:text==='All Statuses'?'Active & Upcoming Events':text,body:text==='Drafts'?'AI Ideathon 2025 · Pending Dean Approval':text==='Archived'?'No archived events in the reference preview.':'Hack-JECRC 3.0 · Registrations Open\nDSA Bootcamp · Waitlist Active\nAI Ideathon 2025 · Pending Dean Approval'});return;}
      if(el.getAttribute('type')==='submit')return;
      if(el.tagName==='BUTTON')setModal({title:text.replace(/^[a-z_]+\s/,'')||'Event Information',body:'This action is available as a reference preview only; no campus service is connected.'});
    };
    const submit=(event: SubmitEvent)=>{
      const form=event.target; if(!(form instanceof HTMLFormElement))return; event.preventDefault();
      if(form.id==='hackathonRegistrationForm'){form.classList.add('hidden');const success=q('#regSuccessMessage');if(success){success.classList.remove('hidden');success.textContent='Registration preview complete. Your team details were validated locally. No registration or email has been sent.';}return;}
      if(form.id==='createEventForm'){q('#eventModal')?.classList.add('hidden');setNotice('Event details validated for preview. No review request was sent.');form.reset();return;}
      if(form.id==='broadcastForm'){setNotice('Notice prepared for preview. SMS and push delivery are not connected.');return;}
      setNotice('Subscription preview complete. No email service is connected.');
    };
    const change=(event: Event)=>{const el=event.target;if(!(el instanceof HTMLSelectElement)||screen!=='explore')return;const selects=container.querySelectorAll('select');const i=Array.from(selects).indexOf(el);if(i===0)venue=el.selectedIndex;if(i===1)club=el.selectedIndex;if(i===2&&articles[0]?.parentElement){const order=el.selectedIndex===1?[2,0,1,4,5,3]:el.selectedIndex===2?[4,2,0,3,5,1]:[0,1,2,3,4,5];order.forEach(index=>{const article=articles[index];const parent=articles[0]?.parentElement;if(article&&parent)parent.append(article);});}filter();};
    const input=(event: Event)=>{const el=event.target;if(el instanceof HTMLInputElement&&el.placeholder.includes('Search events')){search=el.value.toLowerCase();if(screen==='explore')filter();}};
    container.addEventListener('click',click);container.addEventListener('submit',submit);container.addEventListener('change',change);container.addEventListener('input',input);
    return ()=>{container.removeEventListener('click',click);container.removeEventListener('submit',submit);container.removeEventListener('change',change);container.removeEventListener('input',input);all('[data-save-event]').forEach(b=>b.remove());};
  },[screen,navigate]);

  return <><div ref={root} className="reference-screen">{content}</div>{notice&&<div role="status" className="reference-toast">{notice}</div>}{modal&&<div className="reference-dialog" onClick={()=>setModal(null)}><section className="reference-dialog-panel" role="dialog" aria-modal="true" aria-label={modal.title} onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between gap-4"><h2>{modal.title}</h2><Button autoFocus variant="ghost" size="icon" aria-label="Close dialog" onClick={()=>setModal(null)}><X/></Button></div>{modal.kind==='teaser'&&<div className="reference-festival-image aspect-video bg-cover bg-center rounded-lg mt-5"/>}<p className="whitespace-pre-line text-secondary leading-7 mt-5">{modal.body}</p>{modal.kind==='pass'&&<Button className="mt-6" variant="reference" onClick={()=>void downloadPdf(modal.title,modal.body)}>Download PDF Pass</Button>}</section></div>}</>;
}
