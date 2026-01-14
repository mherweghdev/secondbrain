---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ['prd.md']
---

# UX Design Specification secondbrain

**Author:** Matthieu
**Date:** 2026-01-11

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

**secondbrain** est un outil personnel de knowledge management conçu pour les knowledge workers (développeurs, chefs de projet, consultants) qui capturent beaucoup d'informations fragmentées au quotidien mais peinent à les transformer en insights actionnables et rapports professionnels.

Le système suit un workflow en 3 phases optimisé pour un usage hebdomadaire :
1. **Capture** (Lundi-Vendredi) : Input ultra-rapide sans friction (markdown, raccourcis clavier, auto-save)
2. **Raffinage** (Vendredi 30min) : Enrichissement intelligent avec suggestions IA (typage, tags, connexions)
3. **Exploitation** (Lundi matin) : Génération automatique d'un digest professionnel prêt à partager avec le leadership

**Le "wow moment" critique** : Produire un rapport d'activité hebdomadaire professionnel (accomplissements + pain points + risques) en quelques minutes, sans compilation manuelle.

---

### Target Users

**Utilisateur principal (MVP Phase 1) :** Matthieu, développeur bidouilleur apprenant sur le tas via des projets personnels, gamer MMORPG (fan de raccourcis clavier), travaille avec des clients et capture beaucoup de contexte quotidien.

**Profil utilisateur type :**
- **Rôle** : Développeur solo, consultant, knowledge worker gérant plusieurs projets/clients
- **Pain points actuels** :
  - Notes éparpillées sur multiples supports (cahier papier, fichiers markdown, téléphone)
  - Difficulté à compiler un rapport complet hebdomadaire pour le leadership
  - Manque de connexions entre notes lors de la recherche d'information
  - Perte de contexte et d'insights noyés dans le volume de notes brutes

- **Contexte d'usage** :
  - **Capture** : Principalement desktop avec clavier pendant la journée de travail (réunions, accomplissements, bugs)
  - **Raffinage** : Desktop le vendredi après-midi (session de 30 minutes bloquée au calendrier)
  - **Consultation digest** : Multi-device (desktop/mobile/tablette) le lundi matin avant envoi au chef

- **Niveau technique** : Tech-savvy, préfère markdown natif au WYSIWYG, adore les raccourcis clavier (expérience "power user"), confortable avec les outils en ligne de commande

- **Motivation clé** : Visibilité auprès du leadership pour conversations de promotion, besoin de montrer accomplissements + pain points de manière structurée et professionnelle

---

### Key Design Challenges

**Challenge 1 : Friction-Free Multi-Source Capture**
- Le système doit centraliser des notes provenant de multiples sources (web, potentiellement iPad + handwriting future, imports markdown)
- La capture web doit être aussi rapide qu'écrire dans un cahier (pas de clics inutiles, auto-save instantané, shortcuts clavier omniprésents)
- Challenge technique : OCR et handwriting input pour iPad (Phase 3) nécessitent architecture extensible

**Challenge 2 : Connection Discovery & Navigation**
- Les utilisateurs perdent le fil entre notes lors de la recherche
- Besoin de rendre les connexions **visuelles, cliquables, et contextuelles**
- Les suggestions IA doivent identifier connexions sémantiques (pas juste lexicales : "ClientX" mentionné ailleurs)
- Challenge UX : Afficher connexions sans surcharger l'interface (progressive disclosure)

**Challenge 3 : Digest Compilation & Editability**
- Pain point #1 : compiler manuellement un rapport hebdomadaire prend trop de temps
- Le digest doit être 90% généré automatiquement (accomplissements, challenges, action items) MAIS éditable avant envoi
- Challenge UX : Équilibre entre "prêt à envoyer" et "personnalisable si besoin d'ajuster"
- Format cible : Email propre OU markdown consultable dans la plateforme

**Challenge 4 : Responsive Multi-Device Access**
- Le digest doit être consultable sur desktop, mobile, tablette de manière fluide
- Le raffinage (desktop only) doit être optimisé pour sessions de 30 min
- Challenge UX : Design responsive adapté aux différents contextes (consultation mobile vs. édition desktop)

**Challenge 5 : Keyboard-First Power User Experience**
- L'utilisateur est gamer MMORPG, habitué à des raccourcis complexes et workflows rapides
- Besoin de raccourcis clavier pour TOUTES les actions critiques (nouvelle note, raffinage, search, navigation, accept/reject suggestions)
- Challenge UX : Rendre l'interface "hotkey heaven" sans sacrifier l'accessibilité pour futurs utilisateurs moins tech-savvy (Phase 2 SaaS)

---

### Design Opportunities

**Opportunity 1 : Keyboard-First Interface ("Hotkey Heaven")**
- Créer une expérience utilisateur de type vim/MMORPG avec raccourcis omniprésents
- Exemples : `Ctrl+N` nouvelle note, `Ctrl+R` raffinage, `Ctrl+/` search, `↑/↓` navigation suggestions, `Enter` accepter, `Esc` rejeter
- Avantage compétitif : Aucun outil de knowledge management n'offre une expérience aussi rapide pour power users
- Cheatsheet de raccourcis accessible (`Ctrl+?` ou `?`)

**Opportunity 2 : Markdown-Native Experience with Smart Preview**
- Éditeur markdown pur avec syntax highlighting (pas de faux WYSIWYG)
- Preview side-by-side optionnel (peut être toggle on/off)
- Shortcuts pour formatting markdown (`Ctrl+B` bold, `Ctrl+I` italic, `Ctrl+K` link, etc.)
- Avantage : Transparence totale sur la structure des notes, export/import facile

**Opportunity 3 : Smart Connection Visualization**
- Afficher connexions entre notes de manière visuelle et interactive
- Phase 1 (MVP) : Liste de connexions avec liens cliquables ("Cette note mentionne ClientX - voir 3 notes liées")
- Phase 2 : Vue "Knowledge Graph" interactive (nodes = notes, edges = connections) pour exploration visuelle
- Avantage : Transforme la recherche en découverte (serendipity moments)

**Opportunity 4 : Intelligent Digest Editor**
- Vue "Digest Preview" avec édition inline avant envoi
- Sections générées automatiquement (Accomplissements, Challenges, Action Items) mais réorganisables
- Ability to suppress items, add manual commentary, reorder sections
- Export formats : Markdown consultable in-app + Email HTML propre + PDF (Phase 2)
- Avantage : "Ready to send in 2 minutes" tout en gardant le contrôle final

**Opportunity 5 : Extensible Capture Pipeline (Future-Ready)**
- Architecture prête pour multiples sources d'input :
  - Phase 1 : Web markdown editor
  - Phase 2 : Quick capture modal (overlay `Ctrl+Shift+N` depuis n'importe où dans l'app)
  - Phase 3 : iPad + Apple Pencil handwriting → OCR → markdown
  - Phase 3+ : Email-to-note, voice capture, web clipper
- Avantage : Le système grandit avec les besoins sans refonte architecturale

---

## Core User Experience

### Defining Experience

**L'action centrale de secondbrain : La Chaîne de Valeur de l'Information**

Le cœur de secondbrain n'est pas une action unique, mais un **workflow de transformation de valeur** en 3 étapes :

1. **Capture sans friction** (action la plus fréquente, 10+ fois/jour)
   - Prendre des notes markdown ultra-rapidement
   - Auto-save instantané, zéro friction, zéro pensée
   - Aussi rapide qu'écrire dans un cahier papier

2. **Raffinage intelligent** (action critique hebdomadaire, 30 min/vendredi)
   - Transformer les notes brutes en connaissances structurées
   - Suggestions IA pour typage, tags, connexions sémantiques
   - Validation/ajustement rapide des suggestions

3. **Exploitation professionnelle** (action à plus haute valeur, lundi matin)
   - **OBJECTIF ULTIME** : Retrouver et communiquer les accomplissements, pain points, risques
   - Digest professionnel généré automatiquement, prêt à partager avec le leadership
   - 90% auto-généré, 10% ajustements manuels = 2 minutes max

**Le "make-or-break" moment :** Si tu ne peux pas retrouver rapidement les informations pour communiquer tes accomplissements, tout le système échoue. Le raffinage est le maillon critique qui permet cette exploitation.

---

### Platform Strategy

**Plateforme Web-First, Keyboard-Driven, Multi-Device Responsive**

**Plateforme primaire :**
- **Next.js Web Application** accessible via navigateur (desktop + mobile/tablette)
- Architecture responsive adaptée aux contextes d'usage :
  - **Desktop** : Capture + Raffinage + Édition digest (keyboard-first)
  - **Mobile/Tablette** : Consultation digest + Recherche (touch-optimized)

**Paradigmes d'interaction :**
- **Desktop (primaire)** :
  - **Clavier-first** avec raccourcis omniprésents (gamer MMORPG mindset)
  - Souris optionnelle (tout navigable au clavier)
  - Cheatsheet accessible en permanence (`?` ou `Ctrl+?`)

- **Mobile/Tablette (consultation)** :
  - Touch-optimized pour lecture du digest
  - Recherche rapide avec tap sur connexions
  - Responsive layout adapté aux petits écrans

**Contraintes techniques :**
- **Online-only** : Pas de mode offline (OVH VPS, connexion requise)
- **Clipboard integration** : Support du copier/coller depuis autres apps
- **Phase future** : Tablette + stylet → import markdown (iPad + Apple Pencil, Phase 3)

**Capabilities à exploiter :**
- Notifications web (optionnel) : "Vos suggestions Tier-2 sont prêtes" le matin
- Hotkeys système : `Ctrl+Shift+N` pour quick capture depuis n'importe où (Phase 2)
- Markdown native : Import/export facile de fichiers `.md`

---

### Effortless Interactions

**Ce qui doit être magique et sans friction :**

**1. Capture Instantanée (Zéro Friction)**
- **Objectif** : Aussi rapide qu'écrire dans un cahier papier
- **Flow** :
  - Ouvrir l'app (ou `Ctrl+N` pour nouvelle note)
  - Éditeur markdown apparaît immédiatement (focus automatique)
  - Taper en markdown avec syntax highlighting
  - Auto-save pendant la frappe (pas de bouton "Save", pas de confirmation)
  - Fermer (`Esc` ou clic ailleurs) → note sauvegardée automatiquement
- **Résultat** : Capture en **moins de 5 secondes** du début à la fin

**2. Navigation Clavier Universelle**
- **Objectif** : Ne jamais toucher la souris si tu ne veux pas
- **Flow** :
  - Tous les workflows navigables au clavier (`Tab`, flèches, `Enter`, `Esc`)
  - Shortcuts pour toutes les actions critiques :
    - `Ctrl+N` : Nouvelle note
    - `Ctrl+R` : Mode raffinage
    - `Ctrl+/` : Recherche
    - `Ctrl+D` : Ouvrir digest
    - `↑/↓` : Naviguer suggestions/résultats
    - `Enter` : Accepter suggestion
    - `Esc` : Rejeter/annuler
  - Cheatsheet toujours accessible (`?`)
- **Résultat** : Expérience "power user" fluide, aucune interruption mentale

**3. Auto-Save Invisible**
- **Objectif** : Ne jamais penser à sauvegarder, ne jamais perdre de données
- **Flow** :
  - Toutes les modifications sauvegardées automatiquement (debounce 500ms)
  - Indicateur visuel discret ("Saved" / "Saving...")
  - Aucune modale de confirmation
  - Historique implicite (revert possible si besoin)
- **Résultat** : Confiance totale dans le système, zéro stress de perte de données

**4. Connexions Découvertes Automatiquement**
- **Objectif** : Le système "devine" les liens entre tes notes
- **Flow** :
  - Tu cherches "ClientX"
  - Résultats montrent :
    - Notes mentionnant explicitement "ClientX"
    - Notes **sémantiquement liées** (bug auth qui affecte ClientX, même si "ClientX" pas écrit)
    - Navigation d'une note à l'autre en un clic/touche
  - Connexions affichées en contexte ("Cette note mentionne ClientX - voir 3 notes liées")
- **Résultat** : Recherche devient exploration, moments de "serendipity" (redécouverte)

**5. Digest Généré Sans Effort**
- **Objectif** : Le rapport se crée tout seul
- **Flow** :
  - Vendredi soir : Système tourne en background (async)
  - Lundi matin : Ouvrir l'app → digest prêt
  - Édition inline rapide (supprimer un item, ajuster un commentaire)
  - Export en 1 clic (email HTML ou markdown)
- **Résultat** : De "0 à rapport professionnel" en **2 minutes max**

---

### Critical Success Moments

**Les moments "make-or-break" qui déterminent le succès du produit :**

**Moment 1 : "Wow, je capture plus vite qu'avant"**
- **Quand** : Première semaine d'usage (jours 1-3)
- **Trigger** : Prise de la 5ème note
- **Success** : L'utilisateur pense "c'est plus rapide que mon cahier/fichier markdown"
- **Failure** : Si capture prend >10 secondes ou nécessite des clics → abandon
- **Impact UX** : L'éditeur doit être ultra-responsive, shortcuts intuitifs, zéro friction

**Moment 2 : "Ces suggestions sont pertinentes"**
- **Quand** : Premier raffinage (vendredi semaine 1)
- **Trigger** : Revue des 8-10 premières notes avec suggestions IA
- **Success** : 70%+ des suggestions sont correctes ou utiles (tags, type, connexions)
- **Failure** : Si suggestions sont fausses/inutiles → perte de confiance dans le système
- **Impact UX** : Interface de raffinage doit montrer clairement suggestions + permettre ajustements rapides

**Moment 3 : "Ce digest est partageable tel quel"** ⭐ **LE WOW MOMENT ULTIME**
- **Quand** : Premier digest généré (lundi matin semaine 2)
- **Trigger** : Ouverture du digest généré automatiquement
- **Success** : L'utilisateur peut envoyer le digest à son chef SANS édition majeure (90%+ prêt)
- **Failure** : Si digest nécessite 30 min de réécriture → échec total du système
- **Impact UX** : Le digest doit être professionnel, structuré, complet (accomplissements + challenges + risques)

**Moment 4 : "J'ai retrouvé l'info en 10 secondes"**
- **Quand** : Recherche d'information en milieu de semaine (mercredi/jeudi)
- **Trigger** : Besoin de retrouver contexte (ex : "auth bug ClientX")
- **Success** : Résultats pertinents en <5 secondes, avec connexions visibles
- **Failure** : Si recherche prend 30 secondes ou ne trouve rien → frustration, retour aux vieux systèmes
- **Impact UX** : Recherche doit être rapide (<5 sec), pertinente (semantic search), navigable (connexions cliquables)

---

### Experience Principles

**Principes directeurs pour toutes les décisions UX :**

**Principe 1 : Speed is a Feature**
- La vitesse n'est pas un bonus, c'est une fonctionnalité critique
- Capture doit être <5 sec du début à la fin
- Recherche doit retourner résultats en <5 sec
- Raffinage d'une note doit prendre <2 min
- **Test** : Si une action prend 2x plus longtemps que prévu, c'est un bug UX

**Principe 2 : Keyboard-First, Mouse Optional**
- Tous les workflows critiques doivent être navigables 100% au clavier
- Raccourcis intuitifs et cohérents (inspirés de vim/MMORPG)
- La souris est une commodité, jamais une nécessité
- **Test** : Un power user peut accomplir toutes les tâches sans jamais toucher la souris

**Principe 3 : Zero-Friction Capture, High-Value Exploitation**
- Ne JAMAIS ajouter de friction à la capture (pas de tags obligatoires, pas de catégories, pas de validation)
- Toute l'intelligence/structuration se passe au raffinage (suggestions IA)
- La valeur finale se mesure à la qualité du digest (communication leadership)
- **Test** : Peut-on capturer une note en 3 clics/touches maximum ?

**Principe 4 : Trust Through Transparency**
- L'utilisateur voit toujours ce qui se passe (auto-save indicator, suggestions visibles, connexions expliquées)
- Markdown natif = transparence totale sur la structure des données
- Pas de "boîte noire" : suggestions IA sont toujours validables/modifiables
- **Test** : L'utilisateur peut-il expliquer pourquoi le système a fait telle suggestion ?

**Principe 5 : Intelligent Automation, Human Control**
- Le système automatise le travail répétitif (suggestions, connexions, digest)
- L'utilisateur garde TOUJOURS le contrôle final (accept/reject suggestions, éditer digest)
- Équilibre : 90% auto-généré, 10% validation humaine
- **Test** : L'utilisateur se sent-il "assisté" ou "contrôlé" par le système ?

---

## Desired Emotional Response

### Primary Emotional Goals

**L'émotion centrale : Sérénité Productive**

**secondbrain** doit créer un sentiment de **calme organisé** et d'**efficacité maîtrisée**. L'utilisateur doit se sentir :

1. **Serein et organisé** - "Tout est capturé, structuré, accessible. Je peux me concentrer sur mon travail sans craindre d'oublier."

2. **Efficace et productif** - "Je gagne du temps. Capture en 5 sec, recherche en 5 sec, digest en 2 min. Aucune friction."

3. **Confiant** - "Mes données sont safe. Le système fonctionne. Je peux compter dessus. Le digest est prêt à partager."

**L'émotion post-usage : Détendu et confiant**
Après avoir utilisé secondbrain, l'utilisateur doit ressentir :
- **Détente** : "Tout est capturé, je n'ai rien oublié, je peux décrocher pour le weekend"
- **Confiance** : "Je sais où retrouver l'info quand j'en aurai besoin"
- **Satisfaction professionnelle** : "Mon digest montre mes accomplissements de manière professionnelle"

**Recommandation par résultats, pas par émotion**
L'utilisateur ne parlera pas de l'outil par excitation émotionnelle, mais quand on lui demandera : "Comment tu fais pour avoir des résultats aussi structurés ?" → C'est la **démonstration de résultats** qui génère l'intérêt, pas l'enthousiasme superficiel.

---

### Emotional Journey Mapping

**Workflow hebdomadaire et états émotionnels associés :**

**Phase 1 : Capture quotidienne (Lundi-Vendredi)**
- **État émotionnel désiré** : Rapide et discret
- **Ressenti** : "Je capture ma note en pleine réunion, personne ne remarque, je peux me reconcentrer immédiatement"
- **Émotion clé** : **Fluidité** - Aucune interruption mentale, capture invisible et instantanée
- **Impact design** : Auto-save silencieux, éditeur minimaliste, shortcuts rapides (`Ctrl+N` → tape → `Esc`)

**Phase 2 : Raffinage (Vendredi 30 min)**
- **État émotionnel désiré** : Productif avec l'esprit libre avant le weekend
- **Ressenti** : "Je structure ma semaine en 30 min, je vois mes accomplissements prendre forme, je sais que je n'oublierai rien d'ici lundi"
- **Émotion clé** : **Satisfaction du progrès + Sérénité** - Le travail avance, je peux décrocher en paix
- **Impact design** : Interface de raffinage claire, suggestions IA visibles et ajustables, progression visible (2/8 notes raffinées)

**Phase 3 : Digest & Communication (Lundi matin)**
- **État émotionnel désiré** : Confiant et impressionné
- **Ressenti** : "Je n'ai rien oublié, c'est extrêmement pro, je peux envoyer ça tel quel à mon chef"
- **Émotion clé** : **Confiance professionnelle + Fierté discrète** - Le digest reflète mes accomplissements sans embellissement
- **Impact design** : Digest structuré (accomplissements en haut, challenges ensuite), ton professionnel, édition rapide si ajustements nécessaires

**Phase 4 : Recherche d'information (Mercredi/Jeudi)**
- **État émotionnel désiré** : Efficace
- **Ressenti** : "Je trouve mes infos rapidement, connexions visibles, pas de perte de temps"
- **Émotion clé** : **Efficacité instantanée** - Résultats en <5 sec, navigation fluide entre notes connectées
- **Impact design** : Recherche rapide, connexions cliquables, pas de bruit (résultats pertinents uniquement)

---

### Micro-Emotions

**Émotions micro-critiques à cultiver tout au long de l'expérience :**

**1. Confiance (Trust)**
- **Contexte** : Sauvegarde des données, fiabilité du système
- **Manifestation** : "Je sais que mes notes ne seront jamais perdues, le système est fiable"
- **Design implications** :
  - Indicateur "Saved" visible mais discret
  - Backup automatique quotidien
  - Audit trail (historique des modifications)
  - Pas de modale "Êtes-vous sûr de vouloir..." (confiance implicite dans l'auto-save)

**2. Sérénité (Calm Focus)**
- **Contexte** : Usage quotidien, capture, raffinage, recherche
- **Manifestation** : "Tout est sous contrôle, je n'ai pas de stress mental, je peux me concentrer sur mon travail"
- **Design implications** :
  - Interface minimaliste, pas de distractions visuelles
  - Pas d'animations inutiles ou de notifications agressives
  - Capture sans friction (pas de tags obligatoires, pas de validation)
  - Raffinage peut attendre (pas d'urgence créée artificiellement)

**3. Accomplissement (Achievement)**
- **Contexte** : Lundi matin, ouverture du digest
- **Manifestation** : "Je vois clairement ce que j'ai accompli cette semaine, je peux le montrer"
- **Design implications** :
  - Section "Accomplissements" en haut du digest
  - Métriques discrètes (3 features shipped, 2 bugs fixed)
  - Ton professionnel (pas de gamification enfantine, juste des faits)

**4. Efficacité (Speed & Precision)**
- **Contexte** : Toutes les interactions (capture, raffinage, recherche)
- **Manifestation** : "C'est rapide, ça marche, je ne perds pas de temps"
- **Design implications** :
  - Shortcuts clavier partout
  - Latence <5 sec garantie (capture, recherche)
  - Pas de clics inutiles, navigation directe
  - Cheatsheet accessible (`?`) pour découvrir les raccourcis

**5. Autonomie (Independence)**
- **Contexte** : MVP = outil personnel, Phase 2 = potentiel SaaS
- **Manifestation** : "C'est MON outil, je contrôle mes données, je décide comment organiser"
- **Design implications** :
  - Contrôle total sur les suggestions IA (accept/reject/modify)
  - Markdown natif = export facile, pas de lock-in
  - Pas de collaboration forcée en MVP (outil solo)
  - Phase 2 : Belonging potentiel si communauté SaaS, mais toujours avec autonomie préservée

---

### Design Implications

**Connexions Émotion → Décisions UX concrètes :**

**Émotion : Confiance (dans la fiabilité du système)**
- **Design** :
  - Auto-save avec indicateur discret ("Saved" / "Saving...")
  - Backup automatique quotidien avec vérification
  - Audit trail complet (toutes actions loggées)
  - Zéro perte de données comme success metric MVP
- **Rationale** : Si l'utilisateur doute de la sauvegarde, il n'adoptera pas l'outil. La confiance est non-négociable.

**Émotion : Sérénité (calme mental, zéro stress)**
- **Design** :
  - Interface minimaliste, pas de clutter visuel
  - Capture sans validation obligatoire (pas de tags forcés, pas de catégories)
  - Raffinage différé (notes restent en "raw" jusqu'au vendredi)
  - Pas d'animations flashy ou de notifications intrusives
- **Rationale** : L'utilisateur doit pouvoir "vider son cerveau" dans l'outil sans stress. Le raffinage intelligent se fait plus tard.

**Émotion : Accomplissement (fierté professionnelle)**
- **Design** :
  - Digest structuré avec section "Accomplissements" en premier
  - Ton professionnel, pas de gamification enfantine
  - Métriques factuelles ("3 features shipped", "2 clients meetings")
  - Prêt à partager avec leadership (90% auto-généré, 10% ajustements)
- **Rationale** : Le digest est l'outil de visibilité pour conversations de promotion. Il doit montrer les résultats sans embellissement.

**Émotion : Efficacité (vitesse, précision, zéro friction)**
- **Design** :
  - Raccourcis clavier omniprésents (`Ctrl+N`, `Ctrl+R`, `Ctrl+/`, flèches, `Enter`, `Esc`)
  - Latence garantie <5 sec pour capture et recherche
  - Navigation 100% clavier (souris optionnelle)
  - Cheatsheet accessible (`?` ou `Ctrl+?`)
- **Rationale** : L'utilisateur est gamer MMORPG, habitué à des workflows rapides. La vitesse est une fonctionnalité, pas un bonus.

**Émotion : Autonomie (contrôle personnel, indépendance)**
- **Design** :
  - Markdown natif (export/import facile, pas de lock-in)
  - Contrôle total sur suggestions IA (validation manuelle requise)
  - Outil personnel MVP (pas de collaboration forcée)
  - Données hébergées sur OVH VPS personnel (pas de cloud tiers)
- **Rationale** : L'utilisateur veut maîtriser ses données. Phase 2 SaaS possible, mais MVP = autonomie totale.

---

### Emotional Design Principles

**Principes émotionnels guidant les décisions UX :**

**Principe Émotionnel 1 : "Calm Productivity Over Excitement"**
- Priorité à la sérénité productive, pas à l'excitation superficielle
- Pas de gamification enfantine, pas de notifications "Bravo !"
- Interface sobre, efficace, professionnelle
- **Test** : L'utilisateur se sent-il calme et concentré, ou distrait et sollicité ?

**Principe Émotionnel 2 : "Trust Through Transparency"**
- La confiance se construit par la visibilité des actions système
- Auto-save indicator visible, suggestions IA expliquées, connexions justifiées
- Markdown natif = transparence totale sur la structure
- **Test** : L'utilisateur peut-il expliquer pourquoi le système a pris telle décision ?

**Principe Émotionnel 3 : "Accomplishment by Results, Not by Features"**
- L'utilisateur recommande l'outil par démonstration de résultats (digest pro), pas par enthousiasme émotionnel
- Focus sur le WOW moment final (digest prêt à envoyer), pas sur des micro-features impressionnantes
- **Test** : Quand on demande "Comment tu fais pour être aussi structuré ?", l'utilisateur répond-il "j'utilise secondbrain" ?

**Principe Émotionnel 4 : "Efficiency as Emotional Satisfaction"**
- La rapidité crée une satisfaction émotionnelle (capture en 5 sec = plaisir)
- Chaque friction évitée est une victoire émotionnelle
- **Test** : L'utilisateur ressent-il du plaisir à utiliser les raccourcis clavier ?

**Principe Émotionnel 5 : "Autonomy Over Community (MVP Phase)"**
- MVP = outil personnel, l'émotion de "belonging" n'est pas prioritaire
- L'utilisateur veut maîtriser ses données, pas partager avec une communauté
- Phase 2 SaaS peut ajouter "belonging" si validé, mais MVP = autonomie pure
- **Test** : L'utilisateur se sent-il propriétaire de ses données ?

---

**Émotions à ÉVITER absolument (failure modes émotionnels) :**

❌ **Frustration** → Créée par : capture lente, suggestions inutiles, digest nécessitant réécriture complète
❌ **Anxiété** → Créée par : peur de perte de données, doutes sur fiabilité, backup non visible
❌ **Confusion** → Créée par : interface complexe, raccourcis non intuitifs, suggestions IA opaques
❌ **Sentiment d'être contrôlé** → Créé par : IA qui impose des décisions, pas de validation manuelle possible
❌ **Culpabilité** → Créée par : notifications "Tu n'as pas capturé de notes aujourd'hui" (pas de gamification culpabilisante)
