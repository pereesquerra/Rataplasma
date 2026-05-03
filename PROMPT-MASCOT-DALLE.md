# PROMPT-MASCOT-DALLE.md — Generació de les 12 poses de Rataplasma

> Document per fer servir amb **ChatGPT Plus + DALL-E 3**.
> El Pere copia cada prompt, l'envia, descarrega la imatge resultant amb el nom indicat, i les guarda totes a `/Users/pereesquerra24/Documents/Projectes/rataplasma/public/mascot/`.

---

## ABANS DE COMENÇAR

1. Obre **chatgpt.com** amb el teu compte Plus.
2. Adjunta com a referència visual el fitxer `public/mascot.jpg` (la rata fantasma verda original que ja tenim).
3. Comença una conversa nova amb el missatge que diu **"PROMPT 0 — fixació del personatge"** d'a baix. Així ChatGPT 'guardarà' l'aspecte del personatge per a totes les peticions següents.
4. Després executa els 12 prompts un per un. Cada prompt **et dirà el nom de l'arxiu a guardar**.

> Important: **no toquis l'opció 'transparent background' de DALL-E** ni demanis transparent al prompt. La imatge surt amb fons negre uniforme (com `mascot.jpg` actual). Després ja la tractarem en codi (`mix-blend-mode: screen` ja existent).

---

## PROMPT 0 — FIXACIÓ DEL PERSONATGE

Envia això **primer**, junt amb la imatge `mascot.jpg`:

```
Aquest és el meu personatge: una rata fantasma cartoon anomenada "Rataplasma".
Característiques que SEMPRE ha de mantenir:

- Cos translúcid amb forma de túnica de fantasma (rodó a dalt, ondulat a sota)
- Color verd vibrant (#3DD968 a #5FE891) amb ombres més fosques
- Ulls grans expressius amb iris vermell-vinos i pupil·les negres
- Celles negres marcades, espesses
- Orelles grans roses, redondes (estil ratolí cartoon)
- Nas rosa rodó
- Bigotis llargs blancs
- Mans/potes rosa pàl·lid amb 4 dits
- Cua llarga rosa, gruixuda i amb final ondulat
- Estil dibuix professional Pixar/Disney/Hanna-Barbera modern
- Línia negra contornejant el dibuix
- Ombrejat suau amb gradients (no plana)
- Fons negre llis
- Resolució quadrada 1024x1024

A partir d'ara generaré moltes poses i variants d'aquest personatge.
Has de mantenir EXACTAMENT el mateix estil de dibuix, mateixa cara, mateixos colors,
mateix nivell de detall a totes. L'única cosa que canvia és la POSE i l'EXPRESSIÓ
emocional segons et demani.

Confirma que has entès i estàs preparat per generar les poses.
```

Espera la resposta. Quan ChatGPT confirmi, segueix amb els prompts numerats.

---

## SET A — 6 POSES VERDS (manté el color original)

### POSE 1 — idle / calmat (la "default")
Guardar com: `mascot/idle.png`

```
Genera el mateix personatge Rataplasma de la imatge de referència, en POSE IDLE / CALMAT:
- Cos centrat, postura relaxada
- Cara neutral però lleugerament curiosa
- Ulls oberts mirant endavant
- Boca petita amb un mig somriure
- Mans relaxades als costats del cos
- Cua una mica corbada cap a la dreta
- Cella esquerra una mica aixecada (curiositat)
- Fons negre, mateix estil exacte de la referència, 1024x1024.
```

### POSE 2 — parlant
Guardar com: `mascot/parlant.png`

```
Genera el mateix personatge Rataplasma de la imatge de referència, en POSE PARLANT:
- Boca oberta en mig de paraula (forma de "O" o "A" mitjana)
- Una mà aixecada gesticulant
- Ulls expressius mirant l'espectador
- Celles relaxades
- Cua relaxada
- Sembla que està explicant alguna cosa amb il·lusió
- Fons negre, mateix estil exacte de la referència, 1024x1024.
```

### POSE 3 — content / feliç
Guardar com: `mascot/content.png`

```
Genera el mateix personatge Rataplasma de la imatge de referència, en POSE CONTENT / FELIÇ:
- Somriure ample de boca a boca, mostrant les dues dents superiors
- Ulls tancats en arc somrient (forma de mitja lluna)
- Mans aixecades amb dits estesos com celebrant
- Cap lleugerament inclinat (5-10°)
- Cua aixecada amb una corba alegre
- Brillets als ulls (puntets blancs petits)
- Fons negre, mateix estil exacte de la referència, 1024x1024.
```

### POSE 4 — espantat / sorprès
Guardar com: `mascot/espantat.png`

```
Genera el mateix personatge Rataplasma de la imatge de referència, en POSE ESPANTAT:
- Ulls enormes oberts, pupil·les molt petites (terror cartoon)
- Boca oberta en forma de "O" gran (forma de scream)
- Mans aixecades a banda i banda del cap (gest universal de "AAAH!")
- Orelles cap enrere
- Cua eriçada cap amunt rígidament
- Suor o gota d'estrès al front (cartoon classic)
- Fons negre, mateix estil exacte de la referència, 1024x1024.
```

### POSE 5 — ballant
Guardar com: `mascot/ballant.png`

```
Genera el mateix personatge Rataplasma de la imatge de referència, en POSE BALLANT:
- Cos lleugerament rotat (com si fos a mig moviment de ball)
- Una mà aixecada cap amunt (com en un ball disco)
- Una cama / part baixa cap a un costat
- Somriure amb ulls tancats de gust
- Cua fent un loop circular
- Línies de moviment al voltant del cos (3 línies negres horizontals tipus còmic)
- Fons negre, mateix estil exacte de la referència, 1024x1024.
```

### POSE 6 — pensant
Guardar com: `mascot/pensant.png`

```
Genera el mateix personatge Rataplasma de la imatge de referència, en POSE PENSANT:
- Una mà a la barbeta (gest universal de "estic pensant")
- Cella esquerra molt aixecada, dreta arrufada
- Ulls mirant cap amunt-esquerra (com qui medita)
- Boca petita estreta de costat
- Núvol de pensament petit dibuixat al costat del cap (3 cercles inflant)
- Fons negre, mateix estil exacte de la referència, 1024x1024.
```

---

## SET B — 6 POSES BLANC+BLAU (la versió "ghost lluminescent")

> Aquí canviem la paleta. Provem com queda en aquest estil per comparar amb el verd.
> Si tot el set surt bé, podem usar el mateix repertori d'estats però en blanc+blau.

### POSE 7 — idle blanc+blau
Guardar com: `mascot/blau-idle.png`

```
Mateix personatge Rataplasma de la imatge de referència, però amb canvi de PALETA i POSE IDLE:
- Cos translúcid BLANC LLUMINESCENT amb glow blau cian al voltant
- Ombres en blau-violeta pàl·lid (#5FC8FF, #8AAFFF) en lloc de verd fosc
- Iris BLAU CEL clar (#5FC8FF) en lloc de vermell
- Pupil·les negres
- Orelles roses (mantenir)
- Bigotis blancs (mantenir)
- Aura suau cyan al voltant del cos (com un fantasma de pel·lícula)
- Postura idle calmada, mig somriure curiós, ulls oberts
- Fons negre, mateix nivell de detall i estil cartoon que la referència, 1024x1024.
```

### POSE 8 — parlant blanc+blau
Guardar com: `mascot/blau-parlant.png`

```
Mateix personatge Rataplasma versió blanc+blau (cos blanc lluminescent, glow cian, iris blau cel),
en POSE PARLANT:
- Boca oberta en mig de paraula
- Una mà aixecada gesticulant
- Ulls expressius blau cel mirant l'espectador
- Aura cyan al voltant
- Fons negre, 1024x1024.
```

### POSE 9 — content blanc+blau
Guardar com: `mascot/blau-content.png`

```
Mateix personatge Rataplasma versió blanc+blau (cos blanc lluminescent, glow cian, iris blau cel),
en POSE CONTENT / FELIÇ:
- Somriure ample mostrant dues dents
- Ulls tancats en arc somrient
- Mans aixecades celebrant
- Cap inclinat
- Aura cyan reforçada per l'alegria
- Fons negre, 1024x1024.
```

### POSE 10 — espantat blanc+blau
Guardar com: `mascot/blau-espantat.png`

```
Mateix personatge Rataplasma versió blanc+blau (cos blanc lluminescent, glow cian, iris blau cel),
en POSE ESPANTAT:
- Ulls enormes oberts, pupil·les molt petites
- Boca oberta gran en "O"
- Mans als costats del cap
- Cua eriçada
- Aura cyan vibrant pulsant
- Fons negre, 1024x1024.
```

### POSE 11 — ballant blanc+blau
Guardar com: `mascot/blau-ballant.png`

```
Mateix personatge Rataplasma versió blanc+blau (cos blanc lluminescent, glow cian, iris blau cel),
en POSE BALLANT:
- Mig moviment de ball, una mà aixecada disco
- Somriure amb ulls tancats
- Cua loop circular
- Línies de moviment cyan al voltant
- Fons negre, 1024x1024.
```

### POSE 12 — pensant blanc+blau
Guardar com: `mascot/blau-pensant.png`

```
Mateix personatge Rataplasma versió blanc+blau (cos blanc lluminescent, glow cian, iris blau cel),
en POSE PENSANT:
- Mà a la barbeta
- Cella esquerra aixecada, dreta arrufada
- Ulls mirant cap amunt-esquerra
- Núvol de pensament petit
- Fons negre, 1024x1024.
```

---

## EXTRES OPCIONALS (si surt prou bé i en vols més)

Si veus que les 12 poses surten bé i tens ganes, aquests són els 4 extres que vam descartar però aporten:

### EXTRA 1 — idle-2 (variació de respiració)
```
Mateix personatge en POSE IDLE però lleugerament diferent: cap inclinat 5° a la dreta, ulls que pestanyegen (mig tancats), cos un xic més alt (com inhalant). Mateix estil i fons.
```
Guardar com: `mascot/idle-2.png`

### EXTRA 2 — salt
```
Mateix personatge en POSE SALT: cos a mig aire, mans esteses cap amunt, cua estirada cap avall, somriure obert, ulls oberts plens d'il·lusió, línies de moviment al voltant. Fons negre.
```
Guardar com: `mascot/salt.png`

### EXTRA 3 — ulls tancats (pestanyeig llarg)
```
Mateix personatge en POSE IDLE però amb els ULLS TANCATS (com un pestanyeig llarg). Resta del cos relaxat. Mig somriure. Fons negre.
```
Guardar com: `mascot/ulls-tancats.png`

### EXTRA 4 — dormint
```
Mateix personatge DORMINT: cap inclinat al costat, ulls tancats, boca oberta lleugerament (Z, Z, Z petits sortint sobre el cap), mans descansades, cua plegada al costat, expressió d'enmig somnis. Fons negre.
```
Guardar com: `mascot/dormint.png`

---

## TRUCS PER MANTENIR CONSISTÈNCIA

Si en algun moment ChatGPT et genera una pose que **canvia massa** la cara o el cos respecte de la referència (passa a vegades), prova un dels trucs:

1. **Reenvia la mascot.jpg** a la conversa just abans del prompt: "recorda aquest personatge: [imatge adjunta]. Genera ara: [prompt de pose]".
2. **Demana retoc**: "Aquesta pose està molt bé però la cara no s'assembla a la referència. Refés-la mantenint la mateixa cara exacta de la imatge inicial".
3. **Genera 2 variants per pose** demanant: "Dóna'm 2 versions d'aquesta pose, lleugerament diferents, perquè jo triï la millor".

---

## QUAN HAGIS ACABAT

1. Tindràs entre 12 i 16 fitxers PNG dins `public/mascot/`.
2. Em dius "fet" i jo et preparo el component `MascotSprite.tsx` que llegeixi les imatges i les faci servir amb les animacions de stop-motion estil Hanna-Barbera (6-8 fps).
3. Provem-ho a `localhost:5173`. Si convenç, deploy.
