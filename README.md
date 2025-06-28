---
title: "Konzol Webshop Dokumentáció"
output:
  pdf_document:
    toc: true
export_on_save:
    puppeteer: true
    puppeteer: ["pdf"]
class: "markdown-body"
---

<style>
body {
    background-color: #fff;
    color: #111;
    font-family: Arial, Helvetica, sans-serif;
}

a {
    color: black;
    text-decoration-color: blue;
}

/* TOC */
ul:nth-of-type(1) a {
    line-height: 1.4rem;
}

a:hover {
  background-color: black;
  color: white;
}

a:hover code {
  background-color: black !important;
  color: white !important;
}

h1,h2,h3,h4,h5,h6 {
    color: darkblue;
}

code, pre * {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f5f2f0 !important;
    color: black;
}

h2 {
    border-bottom: 1px solid darkblue;
}

img {
  max-width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.break {
  page-break-after: always;
}
</style>

---
title: "Konzol Webshop Dokumentáció"
output:
  pdf_document:
    toc: true
export_on_save:
    puppeteer: true
    puppeteer: ["pdf"]
class: "markdown-body"
---

<style>
body {
    background-color: #fff;
    color: #111;
    font-family: Arial, Helvetica, sans-serif;
}

a {
    color: black;
    text-decoration-color: blue;
}

/* TOC */
ul:nth-of-type(1) a {
    line-height: 1.4rem;
}

a:hover {
  background-color: black;
  color: white;
}

a:hover code {
  background-color: black !important;
  color: white !important;
}

h1,h2,h3,h4,h5,h6 {
    color: darkblue;
}

code, pre * {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f5f2f0 !important;
    color: black;
}

h2 {
    border-bottom: 1px solid darkblue;
}

img {
  max-width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.break {
  page-break-after: always;
}
</style>

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Konzol webshop dokumentáció](#konzol-webshop-dokumentáció)
  - [Bevezetés](#bevezetés)
    - [Témaválasztás indoklása](#témaválasztás-indoklása)
    - [Záródolgozatom témája, mégis milyen funkciókat foglal magába?](#záródolgozatom-témája-mégis-milyen-funkciókat-foglal-magába)
    - [Sajátosságok](#sajátosságok)
  - [Fejlesztői dokumentáció](#fejlesztői-dokumentáció)
    - [Felhasznált programozási nyelvek és keretrendszerek](#felhasznált-programozási-nyelvek-és-keretrendszerek)
      - [Backend](#backend)
      - [Frontend](#frontend)
    - [Fejlesztői környezet](#fejlesztői-környezet)
      - [Github és git](#github-és-git)
      - [Tesztelési keretrendszerek](#tesztelési-keretrendszerek)
      - [A backend futtatása](#a-backend-futtatása)
      - [A frontend futtatása](#a-frontend-futtatása)
      - [A backend mappaszerkezete](#a-backend-mappaszerkezete)
    - [Végpontok](#végpontok)
    - [Adatbázis táblái](#adatbázis-táblái)
      - [A `locations` tábla](#a-locations-tábla)
      - [A `manufacturers` tábla](#a-manufacturers-tábla)
      - [A `product_states` tábla](#a-product_states-tábla)
      - [A `users` tábla](#a-users-tábla)
      - [A `models` tábla](#a-models-tábla)
      - [A `suggestions` tábla](#a-suggestions-tábla)
      - [Az `adverts` tábla](#az-adverts-tábla)
      - [A `bookmarks` tábla](#a-bookmarks-tábla)
      - [A `cart_items` tábla](#a-cart_items-tábla)
      - [A `comments` tábla](#a-comments-tábla)
      - [A `purchases` tábla](#a-purchases-tábla)
      - [A `ratings` tábla](#a-ratings-tábla)
      - [Az `advert_pics` tábla](#az-advert_pics-tábla)
    - [Algoritmusok a backend és frontend megvalósításban](#algoritmusok-a-backend-és-frontend-megvalósításban)
      - [Felhasználó regisztrációs folyamat backend oldal](#felhasználó-regisztrációs-folyamat-backend-oldal)
      - [Felhasználó regisztrációs folyamat frontend oldal](#felhasználó-regisztrációs-folyamat-frontend-oldal)
      - [Felhasználó belépési folyamat backend oldal](#felhasználó-belépési-folyamat-backend-oldal)
      - [Felhasználó belépési folyamat frontend oldal](#felhasználó-belépési-folyamat-frontend-oldal)
      - [Hirdetés feltöltési folyamat backend oldal](#hirdetés-feltöltési-folyamat-backend-oldal)
      - [Hirdetés feltöltési folyamat frontend oldal](#hirdetés-feltöltési-folyamat-frontend-oldal)
      - [Keresési folyamat backend oldal](#keresési-folyamat-backend-oldal)
      - [Keresési folyamat frontend oldal](#keresési-folyamat-frontend-oldal)
    - [Különböző körülmények, esetek és hibakezelések](#különböző-körülmények-esetek-és-hibakezelések)
      - [Hirdetések hiánya](#hirdetések-hiánya)
      - [Hirdetés módosításának hibalehetőségei](#hirdetés-módosításának-hibalehetőségei)
      - [Túl nagy vagy hibás kép feltöltése](#túl-nagy-vagy-hibás-kép-feltöltése)
      - [Hirdetés kosárhoz adása közbeni hibák](#hirdetés-kosárhoz-adása-közbeni-hibák)
    - [Fejlesztési lehetőségek](#fejlesztési-lehetőségek)
  - [Teszt dokumentáció](#teszt-dokumentáció)
    - [Backend tesztek](#backend-tesztek)
      - [Előkészítés](#előkészítés)
      - [Futtatás](#futtatás)
    - [Frontend tesztek](#frontend-tesztek)
  - [Felhasználói dokumentáció](#felhasználói-dokumentáció)
    - [Üdvözöllek!](#üdvözöllek)
    - [Szükséges eszközök a weboldal használatához](#szükséges-eszközök-a-weboldal-használatához)
    - [Weboldal eléréséhez használható böngészők](#weboldal-eléréséhez-használható-böngészők)
    - [Weboldal használatának részletes ismertetése](#weboldal-használatának-részletes-ismertetése)
      - [A regisztráció folyamatának ismertetése](#a-regisztráció-folyamatának-ismertetése)
      - [A belépés folyamatának ismertetése](#a-belépés-folyamatának-ismertetése)
      - [Hirdetés feltöltés folyamatának ismertetése](#hirdetés-feltöltés-folyamatának-ismertetése)
      - [Hirdetés keresés folyamatának ismertetése](#hirdetés-keresés-folyamatának-ismertetése)
      - [Hirdetés vásárlás folyamatának ismertetése](#hirdetés-vásárlás-folyamatának-ismertetése)

<!-- /code_chunk_output -->

<div class="break"></div>

# Konzol webshop dokumentáció

## Bevezetés

A back-end kód megtalálható: [https://github.com/TorteliImre/console-webshop-backend](https://github.com/TorteliImre/console-webshop-backend)

### Témaválasztás indoklása
A konzol árusító oldal ötlete a csapat videójátékok iránti szenvedélyéből ered. A webshop ötlet már hamar felmerült, viszont a játékkonzolos fő téma csak később került szóba. Miután eldöntöttük a fő témát, tanáraink segítségét kértük a különböző funkciók eldöntéséhez. Az eredi ötletünk csak a különleges szűrési megoldást tartalmazta, de végül kialakult egy megvalósítható funkció lista.

### Záródolgozatom témája, mégis milyen funkciókat foglal magába?
Egy videójáték konzolok árusítására specializálódott internetes áruház, ahol felhasználók feltölthetnek hirdetéseket, illetve böngészhetnek azok között. A weboldal fő funkciói közé tartozik a felhasználói profil regisztrációja és testreszabása, a hirdetések közzétéle, a hirdetések részletes keresése.

### Sajátosságok
Weboldalunk fő sajátossága más felhasználók által vezérelt áruházzal szemben a részletes szűrési lehetőség a hirdetések létrehzása és keresése közben. Ez a rendszer lehetővé teszi, hogy a felhasználók könnyedén megtalálják azokat a hirdetéseket amelyek a számukra megfelelőek.

<div class="break"></div>

## Fejlesztői dokumentáció

### Felhasznált programozási nyelvek és keretrendszerek

#### Backend
- <ins>Nest.js</ins>
  - Programozási nyelv: Typescript/Javascript 

#### Frontend
- <ins>SvelteKit</ins>
  - Programozási nyelv: Typescript/Javascript, SCSS/CSS

### Fejlesztői környezet

#### Github és git
Projektmunkánk során verziókezelőként a Git rendszerét választottuk, amelyet online a Github szolgáltalásaival tárolunk. Ezzel nagyban megkönyítettük a fejlesztési folyamatot és a változtatások egymással való megosztását.

#### Tesztelési keretrendszerek
- **Backend: Pytest**
  - A Pytest egy, a python programozási nyelven alapuló tesztelési keretrendszer amellyel bárki létre tud hozni testreszabott teszteket egyszerűen.
- **Frontend: Playwright**
  - A Playwright egy úgynevezett "End-to-End" tesztelési keretrendszer, amellyel egyszerűen tudjuk tesztelni a weblapjainkat a felhasználók szemszögéből, ezzel biztosítva a megfelelő kinézetet és viselkedést.

#### A backend futtatása
Legelső dolgunk a backend elindítása előtt az, hogy az adatbázis rendszert futtatjuk.

A `.env.template` fájlt `.env`-re átnevezve állíthatjuk be az adatbázis paramétereit: a host-ot, port-ot, felhasználónevet és a jelszót. Ezek mellett a `TESTING_DB`-vel állítható be, hogy tesztelői (fejlesztői) adatbázishoz, vagy éles adatbázishoz szeretnénk kapcsolódni. A `LOAD_SAMPLE_DATA` adja meg, hogy példa adatok betöltődjenek-e. A statikus adatok (pl. települések) mindkét esetben betöltődnek.

A tesztelői adatbázist a backend `console-webshop-testing` néven, az éles adatbázist `console-webshop` néven keresi. Ezek közül létre kell hoznunk azt, amelyiket használni fogjuk. A táblák automatikusan létrejönnek.

A képek tárolása érdekében lehetséges, hogy növelnünk kell a MySQL által engedélyezett maximum csomag méretet. Ezt a MySQL konfigurációs fájljában tehetjük meg.

A szükséges előkészületek után a backend futtatása következik. A mappájába belépve `npm i` paranccsal telepítjük a szükséges csomagokat, majd `npm run start:dev` paranccsal elindíthatjuk a backendet.

Az API és annak dokumentációja a `localhost:3000/api` címen lesz elérhető.

#### A frontend futtatása
Miután elindítottuk a backend szerverét, a frontend mappájába belépve `npm i` paranccsal telepítjük a szükséges csomagokat, majd `npm run dev` paranccsal elindíthatjuk azt.

Az oldalt a `localhost:5173` címen érhetjük el.

#### A backend mappaszerkezete
A végpontokhoz tartozó mappákban a következő fájlok vannak:
- `fájlnév.module.ts`: A modul, ami betölti a végpontokhoz tartozó kontrollereket, serviceket és elérhetővé teszi az adatbázist.
- `fájlnév.controller.ts`: A végpontokat létrehozó kód.
- `fájlnév.service.ts`: A kontroller által meghívott függvények, amik az adatbázist kezelik.
- `fájlnév.dto.ts`: A kérések és a válaszok paramétereit, formátumát és a validációt tartalmazza.

A mappaszerkezet:
- `.env.template`: Sablon a `.env` fájlhoz, amely a backend beállításait tartalmazza.
- `data/`: A statikus adatok (települések, gyártók, modellek) és példa adatok (felhasználók, hirdetések, képek, hozzászólások és javaslatok) CSV filejai.
- `entities/`: Az adatbázis táblákban tárolt példányok definícióji.
- `migration/`: A statikus és példa adatokat betöltő adatbázis migrációk.
- `src/admin/`: Csak adminok által elérhető végpontok dekorátora.
- `src/advert`: Hirdetések végpontjai.
- `src/app.module.ts`: A fő modul, ami betölti az végpontokat.
- `src/auth/`: Bejelentkezések végpontjai, JWT autentikáció, bejelentkezéssel kapcsolatos dekorátorok és guardok, felhasználói jogok, jelszó hashelés.
- `src/bookmark/`: Felhasználók könyvjelzőinek végpontjai.
- `src/cart/`: Felhasználók kosarának végpontjai.
- `src/common.ts`: Több kontroller által használt dekorátorok és osztályok.
- `src/datasource/`: Az adatbázis kapcsolódás implementációja.
- `src/filters/`: Szűrők végpontjai.
- `src/limits.ts`: Az adatbázis celláinak maximum hosszai, maximum értékei és minimum értékei.
- `src/logger/`: Hibakereséshez használatos logger.
- `src/main.ts`: A backend konfigurációja, indítása.
- `src/purchase/`: A felhasználók által vásárolt és eladott termékek végpontjai.
- `src/rating/`: A vásárlások értékeléseinek végpontjai.
- `src/suggestions/`: Felhasználók által hagyott javaslatok végpontjai.
- `src/user/`: Felhasználók létrehozása, módosítása és keresése.
- `test_scripts/`: Végpont teszt scriptek és adataik.

<div class="break"></div>

### Végpontok
![](docs/swagger_1.png)
![](docs/swagger_2.png)
![](docs/swagger_3.png)
![](docs/swagger_4.png)
![](docs/swagger_5.png)
![](docs/swagger_6.png)
![](docs/swagger_7.png)
![](docs/swagger_8.png)
![](docs/swagger_9.png)
![](docs/swagger_10.png)
![](docs/swagger_11.png)

### Adatbázis táblái

![Adatbázis Séma](./docs/scheme.png "Adatbázis Séma")

#### A `locations` tábla
A `locations` tábla tárolja el az eladni kívánt termékek lehetséges helyeit.
Ez a tábla statikus adatok tárolására szolgál, futás közben nem módosul, hanem induláskor töltődik be.
Eltároljuk a település nevét, megyéjét és irányítószámá. Ezek a keresést teszik lehetővé.
A koordináták segítségével ki tudjuk számolni a távolságokat. [Ez a keresési folyamat során történik meg](#keresési-folyamat-backend-oldal).

#### A `manufacturers` tábla
Itt tároljuk ez a gyártókat, amik a modellekhez kapcsolódnak.

#### A `product_states` tábla
Szintén a keresést segító tábla, a termékek lehetséges állapotjait tárolja.

#### A `users` tábla
Az egyik legfontosabb tábla, a felhasználói profilok legfőbb adatait tárolja.
Ezek az adatok a név, e-mail cím, profil leírás, profilkép, a jelszó hash és az, hogy a felhasználó adminisztrátor-e.
Hozzá kapcsolódnak a létrehozott hirdetések, hozzászólások, vásárlások, könyvjelzők, a kosár és a javaslatok.

#### A `models` tábla
A termékek lehetséges modelljei, amik a szűrés fő szempontjai.

#### A `suggestions` tábla
Felhasználók által tett javaslatok. Ezeket bárki létrehozhatja, de csak az adminisztrátori joggal rendelkező felhasználók olvashatják.

#### Az `adverts` tábla
A létrehozott hirdetéseket tartalmazza. Tárolja a címet, leírást, létrehozó felhasználót, a termék helyét, állapotát, árát és a modellt.
Ezek mellett azt is tárolja, hogy a termék eladottnak lett-e már jelölve.
A nézettségi számot is tárolja, ami minden olyan alkalomman növekszik, amikor egy felhasználó megnézi a hirdetést. Ez egy nagyszerű mód arra, hogy az eladók felmérjék termékeik népszerűségét.

#### A `bookmarks` tábla
A felhasználók képesek hirdetéseket későbbre elmenteni könyvjelzőzés segítségével.

#### A `cart_items` tábla
A kosárba helyezett elemeket is az adatbázisban tároljuk. Ezeket a termékeket meg tudja vásárolni a vevő.

#### A `comments` tábla
A hirdetések alatt lehetséges hozzászólásokat közzétenni. Ezekben további információkat kérdezhetünk meg az eladótól. Eltároljuk nem csak azt, hogy melyik hirdetés alatt hagyták a kommentet, hanem azt is, hogy melyik másik hozzászólásra válaszoltak.

#### A `purchases` tábla
A kosárba helyezett termékeket megvásárolhatjuk, ebben a táblában az eddigi vásárlásokat tároljuk.

#### A `ratings` tábla
A vásárlás után lehetőségünk van a terméket és az eladó által nyújtott szolgáltatást értékelni. Eltároljuk, hogy melyik vásárláshoz kapcsolódik az értékelés, valamint annak értékét.

#### Az `advert_pics` tábla
A vásárlóknak lehetőségük van a hirdetésekhez több képet csatolniuk. Maga a kép mellett egyéb adatokat is tárolunk a táblában. A képekhez lehet hozzáadni leírást is. Beállítható, hogy melyik legyen a fő kép, vagyis amelyik a hirdetés listázásakor megjelenik.

### Algoritmusok a backend és frontend megvalósításban

#### Felhasználó regisztrációs folyamat backend oldal
Egy felhasználó regisztrációja a bejelentkezés alapfeltétele. Ez után válik használhatóvá a bejelentkező képernyő és vele együtt a bejelentkezett felhasználóknak nyújtott funkciók.

A regisztrációt a backend a `POST /api/user` request segítségével biztosítja. Az adatokat érzékenységük miatt természetesen a kérés body-jában fogadja, HTTPS titkosításra hagyadkozva. Hibakezelés után létrehozza a felhasználót, majd visszaadja az id-jét.

A kérés elküldése után ez a kódrészlet fut le:
![](./docs/code/backend-register.png)

Először a felhasználónév foglaltságát ellenőrizzük. Ez után a jelszó hashelése történik.
Így elkerüljük a jelszó az adatbázisban szövegként történő tárolását.
Létrehozzuk a beillesztendő entity-t, majd eltároljuk az adatbázisban.
Az eltárolt sor id-jét visszaadjuk.

<div class="break"></div>

#### Felhasználó regisztrációs folyamat frontend oldal
A regisztrációs felület az `/auth/register` aloldalon érhető el. Ez az oldal a bejelentkezés oldallal egybefűzött, így ez a két oldal szinte ugyan az.

A form kódja a következő:
![](./docs/code/frontend-register.png)

A `data` változót tartalmazza az URL utolsó szekcióját, az úgynevezett `action` változót.

A form leadása után a következő kódrészlet fut le:
![](./docs/code/frontend-register-2.png)

Az oldal bejelentkezés után nem elérhető. Ezt minden betöltésnél a `LayoutServerLoad` funkció teszi lehetővé.

![](./docs/code/frontend-register-3.png)

#### Felhasználó belépési folyamat backend oldal
Belépett felhasználók a hirdetések megtekintésén és keresésén kívül sok más funkciót is elérhetnek.

A belépést a backend a `POST /api/auth/login` request segítségével biztosítja. Az adatok itt is a body-ban kerülnek továbbításra.

Ha a belépési adatok helyesek, egy token-t adunk vissza. A továbbiakban ez lesz használható a bejelentkezést igénylő funkciók eléréséhez.

![](./docs/code/backend-login.png)

Az adabázisból lekérjük a jelszó hashet. Ha ez nem létezik, vagy nem egyezik a felhasználó által megadott jelszóval, `401 Unauthorized` hibát adunk vissza.

Lekérjuk a felhasználó azonosítóját és az admin jogot tároló értéket. Ezek után legeneráljuk a token-t és visszaadjuk.

A bejelentkezést igénylő endpointokat a következő decoratorral jelölhetjük meg: `@UseGuards(JwtAuthGuard)`.
A tokent-t a guard-ban a következő módon használjuk fel:
![](./docs/code/backend-login-2.png)

A tokent visszaalakítjuk a payloaddá, majd ellenőrzéseket végzünk rajta. Egy másik decorator segítségével endpointokat csak admin által elérhetővé tehetünk. Ha ez az endpoint ilyen, ellenőrizzük, hogy a felhasználó admin-e. Ha a token rossz, hibát adunk vissza.

#### Felhasználó belépési folyamat frontend oldal
A bejelntkezési felület az `/auth/login` aloldalon érhető el. Ez az oldal a regisztrációs oldallal egybefűzött, így ez a két oldal szinte ugyan az.

A form kódja a következő:
![](./docs/code/frontend-login.png)

A `data` változót tartalmazza az URL utolsó szekcióját, az úgynevezett `action` változót.

A form leadása után a következő kódrészlet fut le:
![](./docs/code/frontend-login-2.png)

Az oldal bejelentkezés után nem elérhető. Ezt minden betöltésnél a `LayoutServerLoad` funkció teszi lehetővé.

![](./docs/code/frontend-register-3.png)

<div class="break"></div>

#### Hirdetés feltöltési folyamat backend oldal
A hirdetések feltöltése az oldal legfontosabb funkciója. A feltöltéskor megadhatjuk az eladni kívánt termék adatait, árát, leírását és annak helyét.
A videójáték-konzol modellének megadása a webáruház egyik fő sajátossága. Segítségével egyértelműen megjelölhetjük a terméket.
És keresésnél a modell vagy gyártó segít megtalálni a számunkra megfelelő hirdetéseket. 

#### Hirdetés feltöltési folyamat frontend oldal
A hirdetés feltöltésére szolgáló oldalt az `advert/create` címen érhetjük el, vagy az "Új hirdetés" menüpontra kattintva a felhasználói menüben.
Az oldalon egy négy részre osztott felhasználói felület tárul elénk.
- Az első rész, amely bal-felül található a hirdetéshez tartozó képek  két féle módon történő feltöltésére szolgál<div class="break"></div>
  - A plussz (+) gombra kattintva az böngésző segítségével kiválaszthatunk képeket amelyeket fel akarunk tölteni.
    - A `handleFiles` eseménykezelő függvény fut le ebben az esetben. Itt ellenőrizzük a fájl méretét, ugyanis a backend 50MB méretnél nagyobb fájlokat nem fogad el. Mindez után a képet Base64 formátumba alakítjuk és elhejezzük a kiválaszott képek listájában.
      ![](./docs/code/frontend-create-advert.png)
    <div class="break"></div>
  - A fájlokat a szekcióra dobva (Drag&Drop) a mozgatott fájlok feltöltésre kerülnek
    - Az `imageDrop` eseménykezelő függvény fut le ebben az esetben. Itt ellenőrizzük a fájl méretét, ugyanis a backend 50MB méretnél nagyobb fájlokat nem fogad el. Mindez után a képet Base64 formátumba alakítjuk és elhejezzük a kiválaszott képek listájában.
    ![](./docs/code/frontend-create-advert-2.png)
- A második rész, amely a kép feltöltéstől jobbra helyezkedik el, a hirdetés fő adatainak feltöltésére szolgál.
  - A cím megadása, amely a `limitTo100` függvény segítségével 100 karakternél nem lehet hoszabb.
    ![](./docs/code/frontend-create-advert-3.png)
  - A hirdetés árát, amelyet 0 és 10000000 között tart a kód.
  - A hirdetés gyártóját és állapotát, melyeket a backend által megadott opciók közül választhatóak ki<div class="break"></div>
  - A hirdetés modelljét, amelyeket az után kérünk le, miután a felhasználó kiválaszott egy gyártót
    ![](./docs/code/frontend-create-advert-4.png)
- A harmadik rész, amely az előző kettő alatt helyezkedik el, a leírás megadásához szolgáló szövegdobozt tartalmazza.
  - A leírás megadásánál lehetőségünk van markdown segítségével formázni a megadott szöveget. Ehhez segítségül a "Carta" nevű csomagot használjuk, amely tartalmaz egy Markdown szövegszerkesztőt.
  - A leírás hossza maximum 1000 karakter lehet, amelyet a Svelte segítségével ellenörzünk minden változtatás után.

<div class="break"></div>

#### Keresési folyamat backend oldal
A hirdetések keresése tetszőlegesen cím alapján is történhet, de emellett szűrők is rendelkezésre állnak.
A gyártón és modellen kívül a hely alapján is kereshetünk. Beállíthatjuk, hogy egy adott település körüli területen belüli hirdetéseket lássuk.
Egy másik fontos tényező a termék állapota, pl. Újszerű vagy Jó állapotú.
Azt is megadhatja a felhasználó, hogy az árak milyen értékek közöttiek lehetnek.

A következő kódrészlet összegyűjti azokat a településeket, amelyek a megadott területen belül helyezkednek el. Az ezeken a településeken lévő termékeket adjuk vissza találatként.

![](./docs/code/backend-search.png)

Az alábbi kód pedig a gyártók és modellek alapján való kereséshez kapcsolódik.
Ha egy gyártót kapunk, akkor az azon belüli minden modell visszaadandó.
Viszont ha gyártó mellett ahhoz tartozó modelleket is megkapunk, nem az összes modellt, hanem csak a megadottakat nézzük.

![](./docs/code/backend-search-2.png)

<div class="break"></div>

A keresési paraméterek előkészítése után lefuttatjuk a keresést.
Pagináció használatával adjuk vissza az eredményeket. A `skip` paraméter a kihagyott találatok, a `count` pedig a visszaadandó találatok száma.
Az összes (tehát pagináció nélküli) találatok számát is betöltjük.

![](./docs/code/backend-search-3.png)

#### Keresési folyamat frontend oldal
A hirdetések kereséséhez egy szűrési rendszert alakítottunk ki, amely alapja a hirdetések pontos keresésének. A szűrő paramétereit a backend egy végponton keresztül teszi elérhetővé, így könnyen bővíthető, és jövőbiztos. Szűrőkön felül a felahsználó képes a hirdetések címére is keresni a keresőmeő segítségével.

Egyik legtöbb munkát igénylő szűrő a távolságon alapuló kiválasztás volt. A felhasználó kiválaszthat egy adott magyarországi települést, majd a maximális távolságot, amin belüli hirdetéseke szereté látni. Ennek megvalósítására saját Svelte komponenst hoztunk létre, amely segítségével könnyedén kiválasztható egy település a település listából.
Amikor a felhasználó elindítja a keresést egy megadott szöveggel, a backend egy település listát szolgáltat, amelyből kiválaszthatunk egyet.

![](./docs/code/frontend-search.png)

Miután megjelent a lehetséges települések listája a felhasználó kattintással, vagy akár a billentyűzeten található nyilakkal is választhat egyet. Ezt egy saját `keydown` eseménykezelő teszi lehetővé.
![](./docs/code/frontend-location-search-keydown.png)

A szűrési rendszer minden változtatás után, ha 1,5 másodpercig nem történik változás autómatikas átnavigál a megfelelően szűrt oldalra. Minden szűrő az URL paramétereit módosítja, amelyeket elküld a backendnek ami azok alapján küld választ.

A kereső felület úgynevezett "végtelen görgetést" használ a hirdetések progresszív betöltéséhez. Ezt egy `IntersectionObserver` segítségével oldjuk meg. Az observer segítségével tetszőleges fügvényt tudunk futtatni amikor egy adott elem megjelenik a felhasználó képernyőjén.
Ehhez létrehoztunk egy saját Svelte komponenst:
![](./docs/code/frontend-intersection-observer.png)

Ennek segítségével könnyedén észlelhetjük hogy egy adott szekció mikor jelenik meg az oldalon.

<div class="break"></div>

### Különböző körülmények, esetek és hibakezelések
#### Hirdetések hiánya
Ha nincsenek hirdetések feltöltve az oldalra, akkor a keresőben a "Nincs találat" felirat látható

#### Hirdetés módosításának hibalehetőségei
Először megnézzük, hogy a bodyban van-e módosítandó paraméter.
Majd miután megbizonyosodtunk a hirdetés létezéréről, leellenőrizzük, hogy van-e jogunk módosítani.
Ha a hirdetés nem a miénk, vagy valaki már kosárba tette, nem engedjük a módosítást.
A kosárba helyezés azért zárja le a hirdetést, hogy annak módosítása semmiképpen se érinthesse hátrányosan a vásárlót. Így azt a terméket fogja kézhez kapni, amely a kosárban van.

![](./docs/code/backend-modify-advert.png)

<div class="break"></div>

#### Túl nagy vagy hibás kép feltöltése
Ha a felhasználó túl nagy képet szeretne feltölteni, akkor átméretezzük.
Hibás kép feltöltése esetén `Bad Request` hibát adunk vissza.
Profilkép és hirdetés kép feltöltése esetén is hasonlóan járunk el.

![](./docs/code/backend-check-resize-image.png)

<div class="break"></div>

#### Hirdetés kosárhoz adása közbeni hibák
A következő esetekben adunk vissza hibát:
- Nem található hirdetés
- Saját hirdetés
- Már a kosárban van a termék
- A termék már el lett adva

![](./docs/code/backend-add-cart-item.png)

<!-- ## Üres profil oldal lezárolt telefon után
## Üres képek a galériában
## Az időpontfoglalás kijátszása
## Foglalt időpon
## Nagyon előre tervezett időpontfoglalás -->
<!-- #### Belépési folyamat kezelése -->
### Fejlesztési lehetőségek
- Moderációs funkciók
- Felhasználók törlése
- Hozzászólások törlése
- Minden funkciót magába foglaló tesztek
- Privát üzenetek küldése és fogadása

<div class="break"></div>

## Teszt dokumentáció
### Backend tesztek
A végpontok tesztelése a kövekezőképpen történik: python scriptben kérést küldünk a `requests` könyvtár segítségével,
majd `pytest` segítségével leellenőrizzük a választ.

#### Előkészítés
1. Beállítjuk a backendet: a `.env` fájlban beállítjuk, hogy teszt adatbázist használjon (`TESTING_DB=true`) és ne töltse be a példa adatokat (`LOAD_SAMPLE_DATA=false`), majd elindítjuk/újraindítjuk.
2. Telepítjük a Python 3-at, ha szükséges.
3. Parancssorban megnyitjuk a `test_scripts/` mappát.
4. A következő paranccsal létrehozzuk a környezetet, ahova a csomagokat telepítjuk: `python -m venv .venv`.
5. Aktiváljuk a környezetet: `.venv\Scripts\activate`.
6. Telepítjük a szükséges csomagokat: `python -m pip install -r requirements.txt`.

#### Futtatás
1. Aktiváljuk a környezetet: `.venv\Scripts\activate`.
2. Futtatjuk a teszteket: `python -m pytest main.py`.

### Frontend tesztek
A frontend tesztelését úgynevezett "End-To-End" tesztekkel oldottuk meg. Ezek megvalósításához a "Playwright" nevű tesztelési keretrendszert használjuk amely segítségével könnyedén tudunk olyan teszteket készíteni, amelyek nem a kódot, hanem a felhasználói élményt tesztelik.
Példaképpen láthatjuk a regisztrációs oldal egyik tesztjét:
![](./docs/code/frontend-test-register-ui.png)
Ez a teszt azt ellenőrzi, hogy a regisztrációs felület látható-e az oldalon.

Ezeket a teszteket a Playwright által szolgáltatott felhasználó felületen futtathatjuk.
![Playwright](./docs/Playwright.png "Playwright ablak")
Itt láthatunk minden tesztet és azok eredményeit.

<div class="break"></div>

## Felhasználói dokumentáció
### Üdvözöllek!
Ön a Konzol Webshop weboldalának felhasználói dokumentációját olvassa, amely egy online webshop, ahol könnyedén könnyedén vásárolhat vagy adhat el régi és új konzolokat egyaránt.
A Konzol Webshop alapvető funkciói között szerepel a belépés és regisztráció lehetősége. Ha még nem regisztrált, egyszerűen létrehozhatja a fiókját, majd bejelentkezhet az oldalra, hogy teljes körű hozzáférést kapjon a funkciókhoz.
Emellett a weboldalon lehetősége van hirdetések böngészésére és keresésére, amelyhez segítséget nyújt a részletes szűrésre lehetsőéget adó keresőmotor. 
Ha pedig saját konzolját kívánja eladni könnyedén létre tud hozni új hirdetést melyet más felhasználók is megtekinthetnek.
Köszönjük, hogy csatlakozott hozzánk, és jó böngészést kívánunk a játékkonzolok világában!
Üdvözlettel,
Konzol Webshop csapata

### Szükséges eszközök a weboldal használatához
A weboldalhoz való hozzáféréshez és használatához csak egy internetkapcsolattal rendelkező eszközre van szükséged. 
Például:
  - Okostelefon
  - Táblagép
  - Számítógép (laptop vagy asztali számítógép)

Ezen eszközök bármelyike alkalmas a Konzol Webshop weboldalának böngészésére, hirdetések keresésére és feltöltésére.

### Weboldal eléréséhez használható böngészők
Az internetkapcsolat mellett szüksége lesz egy modern webböngészőre.
Például:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge

Ezek a böngészők lehetővé teszik a Konzol Webshop weboldalának teljes körű használatát és böngészését.

<div class="break"></div>

### Weboldal használatának részletes ismertetése
![Főoldal](./docs/main-page.jpeg "Főoldal")
Ez a Konzol Webshop főoldala. A fejlécben láthatja az oldal logóját, a szöveges kereső mezőt, a kocsár, bejelentkezés és regisztráció gombokat.
A fejléc alatt az oldal fő tartalma, a hirdetés kereső található, bal oldalt a szűrőkkel, jobb oldalt pedig a hirdetésekkel.

<div class="break"></div>

#### A regisztráció folyamatának ismertetése
A regisztrációs folyamat megkezdéséhez először a regisztrációs oldalra kell navigálnunk. Ezt a jobb felső sarokban található "Regisztráció" gombbal tehetjük meg.

![Regisztráció](./docs/register-guide.jpg "Regisztráció")

A gomb át navigál minket az `auth/register` aloldalra, ahol kitölthetjük a regisztrációs űrlapot.

![Regisztráció űrlap](./docs/register.jpeg "Regisztráció űrlap")

Az űrlap helyes kitöltése után már kész is a saját felhasználónk amely adataival be is tudunk jelentkezni.
#### A belépés folyamatának ismertetése
A belépési folyamat megkezdéséhez, hasonlóan a regisztrációhoz, először a bejelentkezés oldalra kell navigálnunk. Ezz a jobb felső sarokban található "Bejelentkezés" gombbal tehetjük meg.

![Bejelentkezés](./docs/login-guide.jpg "Bejelentkezés")

A gomb át navigál minket az `auth/login` aloldalra, ahol kitölthetjük a bejelentkezési űrlapon.

![Bejelentkezés űrlap](./docs/login.jpeg "Bejelentkezés űrlap")

Az űrlap helyes kitöltése után autómatikusan visszakerülünk a főoldalra, ahol a "Bejelentkezés" és a "Regisztráció" gombok helyett profilképünket láthatjuk.
#### Hirdetés feltöltés folyamatának ismertetése
Az oldal egyik legfontosabb funkciója a hirdetések létrehozása. Egy hirdetés feltöltéséhez először be kell jelentkeznünk az oldalra egy korábban létrehozott felhasználóval. Ezt követően a fejléc jobb oldalán a "Bejelentkezés" és "Regisztráció" gombok helyett a saját profilképünket találjuk, amelyre rákattintva megjeleníthetjük a felhasználói menüt.

![Felhasználói menü megnyitása](./docs/user-menu-unopened.jpg "Felhasználói menü megnyitása")

![Új hirdetés gomb](./docs/new-advert-arrow.jpg "Új hirdetés gomb")

A menüben az "Új hirdetés" opciót választva térhetünk át az új hirdetés készítésének oldalára.

![Új hirdetés oldal](./docs/advert-create-page.png "Új hirdetés oldal")

Ekkor átkerülünk az `advert/create` aloldara, ahol egy űrlap tárul elénk. Az űrlap 4 szekcióra osztódik szét.

- Az első szekció a bal felső sarokban található, amely képek feltöltésére szolgál. Itt a plussz (+) gombra kattintva vagy a fájlokat a fájlkezelőből a szekcióra dobva tudunk képeket feltölteni. Egy adott kép feltöltése után a szekcióban megjelenik a kép előnézete, amelyben egy jelölőnégyzet segítségével kiválaszthatjuk a kiemelni kívánt képet, amely a hirdetés indexképeként és első megjelnített képeként jelenik majd meg. Az előnézet alján pedig írhatunk leírást az adott képhez.
  ![Új hirdetés képfeltöltés](./docs/advert-create-page-images.jpg "Új hirdetés képfeltöltés")
- A második szekció az elsőtől jobbra, jobb felül található, amely a hirdetés fő adatainak megadására szolgál. Itt adhatjuk meg a hirdetésünk címét, árát, a konzol gyártóját és modelljét, illetve a hirdetés helyét is.
  ![Új hirdetés mezők](./docs/advert-create-page-inputs.jpg "Új hirdetés mezők")
- A harmadik szekció az előző kettő alatt található, amelynek egyetlen funkciója a hirdetés leírásának megadása. A szekcióban egy úgynevezett "Markdown szerkesztő" található, amely segítségével személyre szabott leírást adhatunk a hirdetéseinknek.
  ![Új hirdetés leírás](./docs/advert-create-page-desc.jpg "Új hirdetés leírás")
- Az utolsó, legkisebb szekció két gombot tartalmaz. A kuka piktogrammal ellátott gomb alaphelyzetbe állítja az űrlapot, amíg a "Létrehozás" gomb leadja azt, ezzel létrehozva egy új hirdetést.
  ![Új hirdetés gombok](./docs/advert-create-page-buttons.jpg "Új hirdetés gombok")
#### Hirdetés keresés folyamatának ismertetése
Az oldal egyik fő funkciója a hirdetések keresése. Az oldal tartalmaz egy részletes keresőmotort amely segítségével megtalálhatjuk a számunkra megfelelő hirdetéseket.
Az első keresési metódus a szöveges keresés, amely segítségével a a hirdetések címe alapján kereshetünk.

![Hirdetés keresés](./docs/advert-search-text.jpg "Hirdetés keresése")

Az oldal bal oldalán találjuk a szűrési lehetőségeket. Keresés közben szűrni tudjuk a megjelenő hirdetéseket állapotuk szerint, gyártójuk szerint, gyártó kiválasztása után az egyes modellek szerint, és földrajzi hely és attól számított távolság alapján.

![Hirdetés keresés szűrés](./docs/advert-search-filters.jpg "Hirdetés keresése szűrés")

Akármelyik szűrési opció változása esetén az oldal autómatikusan ujratöltődik, és a megfelelő hirdetések jelennek meg az oldalon.

![Hirdetés keresés szűrés példa](./docs/advert-search-filters-content.png "Hirdetés keresése szűrés példa")

<div class="break"></div>

#### Hirdetés vásárlás folyamatának ismertetése
A weblap egyik talán legfontosabb funkciója a hirdetések megvásárlása. A hirdetések listáját bárki elérheti akár bejelentkezés nélkül is, de a vásárláshoz szükséges lesz bejelentkeznünk.
Egy hirdetés megvásárlásához először el kell jutnunk a hirdetések saját oldalára. Ezt a keresőben a hirdetésekre kattintva tehetjük meg. Ekkor eljutunk a hirdetés dedikált oldalára.

![Hirdetés oldal](./docs/advert-page.png "Hirdetés oldal")
<div class="break"></div>

Itt megtekinthetjük a hirdetés pontos adatait, és ha meg vagyunk elégedve akkor elmenteni késöbbre, vagy akár kosárba helyezni.
A hirdetés adai alatt két gomb található.
- Az első hozzáadja a hirdetést a könyvjelzők listához, amellyel könnyedén vissza tudunk jönni később is a hirdetéshez
  ![Hirdetés könyvjelző](./docs/advert-page-bookmark.jpg "Hirdetés könyvjelző")
- A második gomb hozzáadja a hirdetést a kosárhoz, így később megvásárolhatjuk azt.
  ![Hirdetés kosár](./docs/advert-page-cart.jpg "Hirdetés kosár")
<div class="break"></div>

Kosárba helyezést követően a vásárlás folytatásához a kosár oldalra kell átlépnünk, amit a kosár gombra való kattintással tehetünk meg.

![Hirdetés kosárban](./docs/advert-page-incart.jpg "Hirdetés kosárban")
<div class="break"></div>

A gombra kattintva átkerülünk a `/cart` aloldalra, ahol a saját kosarunkat tekinthetjk meg.

![Kosár oldal](./docs/cart-page.png "Kosár oldal")

Ha meg vagyunk elégedve a kosarunk tartalmával, a "Vásárlás" gombra kattinva megvehetjük a kosárba rakott hirdetéseket.

![Kosár oldal vásárlás](./docs/cart-page-purchase.jpg "Kosár oldal vásárlás")

Vásárlás után a vásárlási előzmények oldalra navigál minket a weblap, ahol értékelhetjük a hirdetéseket, ezzel elősegítve az eladó további munkásságát.

![Előzmények oldal](./docs/history-page.png "Előzmények oldal")

<!-- ## Összefoglalás
### Elkészült munkánk értékelése
### Köszönetnyilvánítás
## Irodalomjegyzék -->