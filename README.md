# Kauguras skolas tīmekļa vietne
 
Kauguras skolas tīmekļa vietne, kas darbojas kā darbvirsmas lietotne, izmantojot **pywebview**.
 
 **Tiešsaistē:** [olux.eth0wlan.space](https://olux.eth0wlan.space)
 
---
 
## Prasības
 
Lai palaistu projektu, **obligāti** jābūt instalētam:
 
- [Python 3](https://www.python.org/downloads/)
- [pywebview](https://pywebview.flowrl.com/)
## Instalēšana
 
```bash
pip install -r requirements.txt
```
 
> **Piezīme:** Linux sistēmās pywebview var būt nepieciešamas papildu bibliotēkas (piemēram, GTK vai Qt). Sīkāk skatiet [pywebview dokumentācijā](https://pywebview.flowrl.com/guide/installation.html).
 
## Palaišana
 
```bash
python main.py
```

Vai vienkārši atver `index.html` pārlūkā.
 
## Pieslēgšanās (login)

Vietne ir atvērta visiem — pieslēgšanās loga sākumā vairs nav. Galvenē pa kreisi ir poga **Pieslēgties**
(pēc pieslēgšanās — **Iziet**), pa labi — nolaižamā izvēlne **Vairāk**. Tās cilnes viesiem un pēc
pieslēgšanās atšķiras; abi saraksti glabājas failā `menu.js`.

Lapām, kas pieejamas tikai pēc pieslēgšanās, `<html>` tagā ir `data-auth="required"`
(`konsultacijas.html`, `atbildes.html`, `zpd.html`). Bez pieslēgšanās tās pāradresē uz sākumlapu
un atver pieslēgšanās logu.

Serveris nav vajadzīgs — lietotāji glabājas failā `db.js`
(tikai sāls + SHA-256 hash, paroles tekstā nav). Jaunu lietotāju pievienošana — skat. komentāru `db.js` sākumā.

> Tā ir vienkārša aizsardzība bez servera: tā neapturēs cilvēku, kas pārzina pārlūka rīkus.

## Hostings
 
| Parametrs | Vērtība |
|-----------|---------|
| Hostings  | **ETH0WLAN** |
| Versija   | **OLUX EDITION** |
| Domēns    | [olux.eth0wlan.space](https://olux.eth0wlan.space) |
 
## Autors
 
**Aleksejs Vasilinenko**
 
---
 
© Aleksejs Vasilinenko. Visas tiesības aizsargātas.
 
