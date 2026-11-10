/*
 * Vienkārša "datubāze" - lietotāji.
 * Paroles šeit NAV tekstā, tikai sāls + SHA-256 hash( sāls + ":" + parole ).
 *
 * Jauna lietotāja pievienošana:
 *   node -e "const c=require('crypto');const s=c.randomBytes(8).toString('hex');
 *            console.log(s, c.createHash('sha256').update(s+':'+'PAROLE').digest('hex'))"
 * un ielīmē rindu zemāk.
 */
window.KVS_USERS = [
  { name: "Aleksejs-Vasilinenko", salt: "2cbc2a0c18b80631", hash: "ca254d63df5a36dcd4a3bbb4ff771ee0314e3fc7fb05e97e45de7b3bf9298bfe" },
  { name: "Kirils-Krainukovs", salt: "0bd1bd77f8c3e291", hash: "59921fc46f6556229f4a0f8bda5b1a246aee14ae1a90b1d22a51a9c13404bce6" },
  { name: "kakas", salt: "30740cd75f6035f9", hash: "cbb3cc9e89dd75e2fe314e408fa526b41042fc15f2b8778d594b1d28f1778840" }
];
