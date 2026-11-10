/*
 * Nolaižamā izvēlne galvenes labajā pusē ("Vairāk").
 *   guest - cilnes, ko redz bez pieslēgšanās
 *   user  - cilnes, ko redz pēc pieslēgšanās
 *
 * Jauna cilne: pievieno rindu šeit un izveido lapu (piemēram, nokopē brivlaiki.html).
 * Ja lapa pieejama tikai pēc pieslēgšanās, tās <html> tagā jābūt data-auth="required"
 * (skat. konsultacijas.html).
 */
window.KVS_MENU = {
  label: "Vairāk",

  guest: [
    { href: "programmas.html", title: "2026./2027. m.g. programmas" },
    { href: "brivlaiki.html", title: "Brīvlaiki" },
    { href: "zvani.html", title: "Zvanu saraksts" },
    { href: "skolotaji.html", title: "Skolotāji" },
  ],

  user: [
    { href: "programmas.html", title: "2026./2027. m.g. programmas" },
    { href: "konsultacijas.html", title: "Konsultāciju grafiks" },
    { href: "atbildes.html", title: "Atbildes uz jautājumiem" },
    { href: "zpd.html", title: "ZPD un eksāmeni" },
    { href: "brivlaiki.html", title: "Brīvlaiki" },
    { href: "zvani.html", title: "Zvanu saraksts" },
    { href: "skolotaji.html", title: "Skolotāji" },
  ]
};
