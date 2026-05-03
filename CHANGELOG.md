# CHANGELOG

## fresh-start

### Direccio artistica

He triat una direccio de quadern d'invents fantasma: paper clar, contorns gruixuts, peces enganxades, colors de taller i llum cian suau. La idea es fugir de l'app generica i fer que sembli un lloc personal del Pau, amb energia de maqueta feta a ma pero prou madura per no semblar infantil. La mascota es SVG inline i animada amb moviment a passos, buscant un punt de stop-motion. La paleta barreja crema, tinta, cian, coral i groc per evitar un sol color dominant.

### Implementat

- Login privat amb `ADMINPLASMA` i sessio local.
- Habitacio principal amb objectes navegables i accio signature amb Web Audio.
- Mascota Rataplasma original com a rata fantasma SVG, amb estats calmat, content, parlant i sorpres.
- Chat IA a `/parla` contra `POST /api/chat`, stream SSE, prompt segur en catala i TTS Web Speech API amb bot de silenci.
- Seccio Musica amb teclat Do major de 8 tecles, 4 instruments, 3 cancons en pentagrama, gravacio de fins a 32 notes i reproduccio.
- Seccio Codi amb tres nivells: sliders, blocs reordenables i JS editable; inclou demos de crit sonor i fantasma viu amb fletxes SVG animades.
- Laboratori secret com a apartat creatiu: fitxes d'invent o repte desades a localStorage i generador de combinacions rares.
- Headers de cache compatibles amb Cloudflare Pages.

### Decisions tecniques

- No s'ha afegit cap dependencia nova: React, Router, Tailwind i Motion ja eren al projecte.
- El chat usa `fetch` amb `ReadableStream` per poder fer `POST` i llegir SSE sense `EventSource`.
- El layout del chat usa `position: fixed`, `100svh` i `interactive-widget=resizes-content` per reduir salts a iPhone Safari.
- La musica i els efectes son Web Audio API: no depenen de fitxers d'audio externs.
- El Laboratori es local-first per no obrir encara un sistema de convidats ni permisos.

### Queda fora

- Usuaris convidats i mural compartit remot.
- Generador d'imatges IA amb Workers AI.
- Persistencia cloud de creacions, puntuacions o reptes.
- Tests automatitzats de navegador. La validacio actual es build net i revisio visual local.
