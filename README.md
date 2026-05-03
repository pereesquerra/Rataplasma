# Rataplasma

Web privada per al Pau, feta com una habitacio creativa: una rata fantasma original, musica, codi que es pot tocar i un mural d'invents per tornar-hi l'endema.

## Com correr-ho

```bash
npm install
npm run dev
```

La web queda a `http://127.0.0.1:5173/`.

Per validar el build:

```bash
unset NODE_ENV && npm run build
```

Per provar Cloudflare Pages Functions en local:

```bash
npm run build
npm run pages:dev
```

Cal tenir `ANTHROPIC_API_KEY` configurada a Cloudflare o a `.dev.vars` per al chat.

## Rule Book

- El codi d'entrada es `ADMINPLASMA`.
- La sessio es desa a `localStorage` amb la clau `rataplasma.user.v3`.
- El chat fa `POST /api/chat` amb `{ messages }` i rep stream SSE de Claude Haiku.
- Rataplasma respon en catala, amb personalitat dramatica i segura per a 11-13 anys.
- Musica fa servir Web Audio API, sense fitxers externs per al teclat.
- Les creacions del Laboratori es desen localment a `rataplasma.creacions.v1`.
- No hi ha convidats encara. Aquesta branca es per al Pau i el Pere.

## Rutes

- `/login`: porta privada.
- `/`: habitacio principal amb mascota i objectes.
- `/parla`: chat IA amb TTS i bot de silenci.
- `/musica`: teclat Do major, instruments, cancons i gravadora.
- `/codi`: nivells progressius de sliders, blocs i JS editable.
- `/laboratori`: mural creatiu de reptes i invents.

## Deploy

Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Functions: `functions/api/chat.ts`
- Headers: `public/_headers`

No es fa merge a `main` des d'aquesta feina. La branca de treball es `fresh-start`.
