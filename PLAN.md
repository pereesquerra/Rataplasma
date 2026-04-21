# rataplasma.com — Pla del projecte v2

**Projecte:** web educativa i lúdica per al Pau (nebot de Pere) i els seus amics
**Edat:** 10-13 anys
**Domini:** rataplasma.com (Cloudflare Registrar, registrat 21/04/2026)
**Data:** 21/04/2026

---

## 1. Visió

Tres pilars alhora:

1. **Un joc visual** amb personatge propi (la Rata Fantasma) i competició entre amics.
2. **Un laboratori d'IA** on els nens demanen coses i veuen com els la crea.
3. **Una primera introducció al codi** real: tocar botons del panell i veure, amb
   fletxes i explicacions, què fa cada tros de codi; fins i tot escriure instruccions
   senzilles pròpies que funcionen.

El tercer és el que fa que els pares ho vegin com una cosa que suma al nen.

## 2. Mascot propi (copyright)

Scooby-Doo és propietat de Warner Bros. Solució:
- Mascot original: Rata Fantasma pròpia, estètica cartoon anys 70-80, translúcida verda.
- "Rataplasma" com a crit inventat, no marca registrada.
- Els nens que hagin vist la sèrie captaran la referència sense que copiem res.

## 3. Accés — Pau com a admin

El Pau és el rei de rataplasma.com:
- Cada nen demana entrar amb el seu nom.
- Pau aprova o rebutja des del panel admin.
- Pot expulsar, crear reptes setmanals, obrir esdeveniments especials.

## 4. Jocs — lògica, competició, punts robables

### Duel de Prompts ⭐
Dos nens reben un repte visual, cadascú escriu un prompt, la IA (Flux) genera les
imatges, els altres voten, el guanyador s'emporta punts del perdedor.

### L'Enigma de la Rata
Seqüències, puzles visuals, missatges xifrats. Apareixen "quan la Rata es desperta"
(no diari — sorpresa quan entris).

### Memòria Rataplasma
Memòria visual amb tauler generat per IA segons tema; possibilitat d'"espia".

### IA crea jocs (fase avançada)
El nen escriu un tema; la IA genera 10 enigmes temàtics que s'afegeixen al banc.

## 5. Mascot + botó RATAPLASMA

Mascot gran al centre, flotació suau, botó tàctil que creix + àudio
"RATAAAPLAAAAASMAAA!" + canvi de pose + partícules. Àudio sintetitzat en viu amb
Web Audio API (sense fitxer extern).

## 6. Apartat Codi — pilar educatiu central

Cada element interactiu té mode "mira el codi":
- Panell lateral amb el codi real
- Fletxes animades i anotacions tipus còmic
- Glossari visual
- Botó "toca i prova" per canviar valors en directe

### Nivells
- **Nivell 1:** valors simples (canvia `"blau"` per `"vermell"`).
- **Nivell 2:** blocs tipus Scratch/Blockly.
- **Nivell 3:** JavaScript real amb editor i botó executar.

### Activitats
Dissenya la teva rata, escriu el que diu la Rata, fes una animació, el teu botó màgic.

Aquesta secció és **la diferència pedagògica** davant dels pares.

## 7. IA — usos i guardrails

**Usos:** personalitat xat (Haiku 4.5), imatges (Flux), enigmes, packs de jocs,
explicació de codi.

**Guardrails:** la Rata només parla dins del seu món (formatges, fantasmes, jocs);
no respon preguntes personals, polítiques, violentes o inapropiades; filtres
de contingut nadius + validador secundari a imatges i reptes.

## 8. Stack tècnic

| Component | Servei | Cost |
|---|---|---|
| Frontend | Cloudflare Pages (React + Vite + Tailwind) | 0 € |
| Animacions | Motion (Framer Motion) + CSS + Web Audio API | 0 € |
| Endpoints | Cloudflare Pages Functions | 0 € fins 100k req/dia |
| BD | Cloudflare D1 | 0 € fins 5 GB |
| Xat IA | Claude API Haiku 4.5 | ~1-3 €/mes |
| Imatges IA | Workers AI (Flux) | 0 € dins quota |
| Domini | Cloudflare Registrar | ~10 €/any |

**Total primer any:** 10-50 €.

## 9. Roadmap per fases

### Fase 1 — MVP ✅ (aquest commit)
- Home + mascot + botó RATAPLASMA amb àudio
- Xat Haiku amb personalitat
- Login amb codi + panell admin del Pau

### Fase 2 — Codi educatiu
- CodiViewer amb fletxes animades
- Nivell 1 (editors visuals de color/text)

### Fase 3 — Generador d'imatges
- Endpoint Workers AI Flux
- `/crea` + galeria

### Fase 4 — Duel de Prompts + punts
- D1 schema
- Frontend del duel

### Fase 5 — Enigma + Memòria
- Generació d'enigmes amb IA
- Sistema d'activació pel Pau

### Fase 6 — Codi nivells 2 i 3
- Blockly
- Editor JavaScript amb execució segura

### Fase 7 — IA que crea jocs
- Generació de packs temàtics

## 10. Decisions preses

- Xat: Claude Haiku 4.5
- Mascot original (no Scooby)
- Pau admin (aprovació manual)
- Codi educatiu com a pilar central
- Disseny: ràdio pirata fantasma anys 80 (negre + verd fosforit + morat)
- Repo públic: pereesquerra/rataplasma
- Tipografies: Silkscreen (pixel) + VT323 (CRT) + Atkinson Hyperlegible (cos)

## 11. Validació amb el Pau (pròxima sessió)

1. Ensenyar la Fase 1 desplegada
2. Ell tria: nom definitiu del personatge, colors que prefereix, quin joc li emociona més
3. Invita el primer amic, observem com reacciona
4. Iteració del disseny si cal
