# REDISSENY CODEX — Rataplasma Scooby-Doo

## Previa local

Executa:

```bash
npm run dev
```

URL prevista: `http://localhost:5173/`

## Captures textuals

- `/`: fons de paper antic amb splashes 70s, Rataplasma blanc/blau amb contorn gruixut, botó `RATAPLASMAAAA` com bombolla de còmic, cards polaroid amb ombra plana i reproductor en forma de cassette.
- `/login`: cartell tipus mystery van, inputs com etiquetes de pista i mascot traient el cap per la cantonada.
- `/parla`: xat en marc de còmic, bombolles amb cua i onomatopeies `ZOINKS!`, `JINKIES!`, `RATAPLASMA!` al fons.
- `/codi`: quadern escolar/detectiu amb pòsters de nivell, demos de crit i fantasma, editor mecanografiat i fletxes animades dibuixades a mà.
- `/musica`: selector d’instruments com botons de tocadiscs, teclat de fusta, partitura groguenca i generador com cinta de paper.
- `/admin`: despatx de detectiu amb pissarra de suro; estat buit amb “tot tranquil al món real”.

## Decisions de disseny

- S’ha canviat la direcció de fonts: `Bagel Fat One` per títols, `Fredoka` per UI i `Atkinson Hyperlegible` per lectura/accessibilitat.
- La paleta base passa de neon 80s a Hanna-Barbera 70s: mustard, pumpkin, avocado, harvest, midnight, moonbeam i ghost-glow.
- S’han definit classes compartides `hb-*` per pàgines, headers, cards, botons i inputs, reduint duplicació.
- No s’han afegit imatges raster ni dependències noves. La textura de paper és CSS/data URI i els elements visuals són CSS/SVG.
- El crit manté el fitxer existent i el boom orquestral via Web Audio ja present, sense tocar `public/crit-pau-v4.mp3`.

## Llibreries afegides

Cap.

## Què canvia respecte a la versió anterior

- Home, login, chat, codi, música i admin comparteixen una capa visual Scooby-Doo coherent.
- Els components principals tenen contorn negre gruixut, ombres planes desplaçades, formes orgàniques i colors plans.
- `/codi` conserva els 3 nivells i les demos, però ara sembla un quadern de detectiu.
- `/musica` conserva el motor d’àudio i la lògica de cançons, però passa a una estètica de piano/partitura retro.
- Les transicions entre rutes tenen entrada/sortida de full de còmic amb Motion.
- S’han eliminat els `any` locals dels fallbacks d’`AudioContext`.

## Proves

- `unset NODE_ENV && npm run build` passa correctament.
- S’han preservat les rutes existents: `/`, `/login`, `/parla`, `/codi`, `/musica`, `/admin`.
- No s’han tocat els fitxers protegits del briefing: API de chat, auth, audio engine, instruments, cançons, TTS, wrangler ni assets d’àudio.

## Compromisos

- Les captures són descripcions textuals; no he afegit PNGs al repo.
- No he fet deploy ni merge a `main`; la branca queda preparada perquè el Pere revisi i decideixi.
