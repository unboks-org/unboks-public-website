export type Lang = 'pap' | 'en' | 'es' | 'nl' | 'sv';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'pap', label: 'Papiamentu', flag: '🇨🇼' },
  { code: 'en',  label: 'English',    flag: '🇬🇧' },
  { code: 'es',  label: 'Español',    flag: '🇪🇸' },
  { code: 'nl',  label: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv',  label: 'Svenska',    flag: '🇸🇪' },
];

export const t: Record<Lang, Record<string, string>> = {
  pap: {
    nav_services:   'Servisnan',
    nav_how:        'Kon ta traha',
    nav_contact:    'Kontakto',
    nav_login:      'Drenta',
    nav_cta:        'Kuminsá',

    hero_tag:       'Herramientanan di komunikashon AI',
    hero_h1a:       'Tur bo mensahenan.',
    hero_h1b:       'Un bandeha.',
    hero_p:         'Nos ta konstruí e kapa di komunikashon ku bo ekipo ta falta, pa bo pasa menos tempu ku mensahenan i mas tempu riba bo negoshi.',
    hero_cta:       'Kuminsá',
    hero_see:       'Mira kon ta traha',

    channels_label: 'Kanalnan',

    feat_label:     'Loke nos ta manejá',
    feat_title:     'Menos trabou. Mas negoshi.',
    feat_sub:       'Nos ta tuma e trabou di komunikashon repetitivo di riba bo ekipo su plachi, sin sakando nan for di e loop.',

    how_label:      'Kon ta traha',
    how_title:      'Nos ta studia bo proseso, despues nos ta konstruí rond\'ei.',
    how_sub:        'Sin templatnan jeneral. Nos ta wak exaktamente unda bo ekipo ta pèrdè tempu i konstruí un sistema rond di bo workflow real.',
    step1_title:    'Yamada di deskubrimento',
    step1_p:        '30 minüt pa mapéa unda bo ekipo ta pasa mas tempu riba komunikashon i unda AI por tuma over kon seguridad.',
    step2_title:    'Nos ta konstruí bo sistema',
    step2_p:        'Bandeha unifikado, kontestanan automátiko, reglanan di eskalashon, i un panel di kontrol, tur kustumisá pa bo workflow.',
    step3_title:    'Bo ekipo ta keda na kontrol',
    step3_p:        'Gerentenan ta rebeká, aprobá i interbiní kualke momentu. Bisiblidad kompleto riba tur kanal, ningun kaha negra.',

    out_label:      'Loke bo ta hañá',
    out_title_a:    'Mas tempu.',
    out_title_b:    'Mas klientenan.',
    out_title_c:    'Mas bida.',
    out1:           'Menos trabou di kontestá repetitivo',
    out2:           'Kontesta mas lihé riba tur kanal',
    out3:           'Bisiblidad kompleto sin e karga manual',
    out4:           'Eksperensha di klientenan mas konsistente',

    stat_label:     'Na base di sifranan',
    stat1_lbl:      'Kanalnan den un bandeha',
    stat2_lbl:      'Kobertura, semper aktivo',
    stat3_lbl:      'Tempu promedio di kontesta',
    stat4_lbl:      'Mensahenan pèrdè',

    cta_h2:         'Laga nos mira unda bo ekipo ta pèrdè tempu.',
    cta_p:          'Kuentanos kiko bo ekipo ta pasa demasiado tempu riba. Nos ta tuma over for di ei.',
    cta_book:       'Buká un yamada di deskubrimento',

    footer_sub:     'Herramientanan di komunikashon AI pa ekiponan chikitu.',
    footer_email:   'hello@unboks.org',
  },

  en: {
    nav_services:   'Services',
    nav_how:        'How it works',
    nav_contact:    'Contact',
    nav_login:      'Log in',
    nav_cta:        'Get started',

    hero_tag:       'AI communication tools',
    hero_h1a:       'All your messages.',
    hero_h1b:       'One inbox.',
    hero_p:         'We build the communication layer your team is missing, so you spend less time on messages and more time on your business.',
    hero_cta:       'Get started',
    hero_see:       'See how it works',

    channels_label: 'Channels',

    feat_label:     'What we handle',
    feat_title:     'Less busywork. More business.',
    feat_sub:       'We take the repetitive communication work off your team\'s plate, without taking them out of the loop.',

    how_label:      'How it works',
    how_title:      'We study your process, then build around it.',
    how_sub:        'No generic templates. We look at exactly where your team loses time and build a system around your actual workflow.',
    step1_title:    'Discovery call',
    step1_p:        '30 minutes to map where your team spends the most time on communication and where AI can take over safely.',
    step2_title:    'We build your system',
    step2_p:        'Unified inbox, automated replies, escalation rules, and a control dashboard, all tailored to your workflow.',
    step3_title:    'Your team stays in control',
    step3_p:        'Managers review, approve, and intervene anytime. Full visibility into every channel, no black boxes.',

    out_label:      'What you get',
    out_title_a:    'More time.',
    out_title_b:    'More clients.',
    out_title_c:    'More life.',
    out1:           'Less repetitive reply work',
    out2:           'Faster response across every channel',
    out3:           'Full visibility without the manual load',
    out4:           'More consistent client experience',

    stat_label:     'By the numbers',
    stat1_lbl:      'Channels in one inbox',
    stat2_lbl:      'Coverage, always on',
    stat3_lbl:      'Average response time',
    stat4_lbl:      'Messages missed',

    cta_h2:         'Let\'s see where your team is losing time.',
    cta_p:          'Tell us what your team spends too much time on. We\'ll take it from there.',
    cta_book:       'Book a discovery call',

    footer_sub:     'AI communication tools for lean teams.',
    footer_email:   'hello@unboks.org',
  },

  es: {
    nav_services:   'Qué hacemos',
    nav_how:        'Cómo funciona',
    nav_contact:    'Contacto',
    nav_login:      'Iniciar sesión',
    nav_cta:        'Empezar',

    hero_tag:       'IA para tus mensajes',
    hero_h1a:       'Todos tus mensajes.',
    hero_h1b:       'Una bandeja.',
    hero_p:         'Un solo lugar para todos tus mensajes. Desde WhatsApp hasta email y redes sociales, la IA ayuda a responder, ordenar y enviar cada mensaje a la persona correcta.',
    hero_cta:       'Empezar',
    hero_see:       'Ver cómo funciona',

    channels_label: 'Canales',

    feat_label:     'Lo que te quitamos de encima',
    feat_title:     'Menos trabajo rutinario. Más tiempo.',
    feat_sub:       'Unboks ayuda con el trabajo de mensajes que vuelve todos los días: responder preguntas, dar seguimiento a citas, reconocer pedidos, informar a clientes y reenviar mensajes importantes.\n\nTú solo ves lo que realmente necesita atención: escalaciones, pedidos y citas reservadas.',

    how_label:      'Así te devolvemos tiempo',
    how_title:      'Menos estrés de mensajes. Más tiempo para tu trabajo real.',
    how_sub:        'Todo llega a una sola bandeja. La IA se encarga de lo que puede y te avisa cuando algo necesita tu atención. Tu comunicación sigue funcionando 24/7, en varios idiomas, mientras tú solo ves lo que necesita atención.',
    step1_title:    'Vemos dónde pierdes tiempo',
    step1_p:        'En una llamada corta vemos dónde llegan más mensajes, qué preguntas se repiten y dónde la IA puede ayudar de forma segura.',
    step2_title:    'Configuramos Unboks para ti',
    step2_p:        'Conectamos tus canales, agregamos tu información y configuramos reglas para responder, ordenar, hacer seguimiento y reenviar mensajes.',
    step3_title:    'Tú mantienes el control',
    step3_p:        'La IA se encarga de lo que puede. Todo lo importante, poco claro o sensible llega a ti o a la persona correcta.',

    out_label:      'Lo que obtienes',
    out_title_a:    'Más tiempo.',
    out_title_b:    'Más claridad.',
    out_title_c:    'Menos lío.',
    out1:           'Menos trabajo manual respondiendo mensajes',
    out2:           'Respuestas más rápidas en todos tus canales',
    out3:           'Todos los mensajes ordenados en un solo lugar',
    out4:           'Los asuntos importantes llegan directo a la persona correcta',

    stat_label:     'En números',
    stat1_lbl:      'Canales en una bandeja',
    stat2_lbl:      'Siempre disponible',
    stat3_lbl:      'Respuestas más rápidas',
    stat4_lbl:      'Menos mensajes perdidos',

    cta_h2:         'Recupera tu día.',
    cta_p:          'Muéstranos dónde llegan tus mensajes y dónde pierdes tiempo. Te mostramos cómo Unboks se encarga de ese trabajo.',
    cta_book:       'Reservar una llamada',

    footer_sub:     'IA para mensajes, seguimiento y control.',
    footer_email:   'hello@unboks.org',
  },

  nl: {
    nav_services:   'Wat we doen',
    nav_how:        'Zo werkt het',
    nav_contact:    'Contact',
    nav_login:      'Inloggen',
    nav_cta:        'Aan de slag',

    hero_tag:       'AI voor je berichten',
    hero_h1a:       'Al je berichten.',
    hero_h1b:       'Één inbox.',
    hero_p:         'Eén plek voor al je berichten. Van WhatsApp tot e-mail en socials, AI helpt met antwoorden, sorteren en doorzetten naar de juiste persoon.',
    hero_cta:       'Aan de slag',
    hero_see:       'Bekijk hoe het werkt',

    channels_label: 'Kanalen',

    feat_label:     'Wat wij uit handen nemen',
    feat_title:     'Minder routinewerk. Meer tijd.',
    feat_sub:       'Unboks helpt met het berichtenwerk dat elke dag terugkomt: vragen beantwoorden, afspraken opvolgen, orders herkennen, klanten informeren en belangrijke berichten doorzetten.\n\nJe ziet alleen wat echt aandacht nodig heeft: escalaties, orders en geboekte afspraken.',

    how_label:      'Zo geven we je tijd terug',
    how_title:      'Minder berichtenstress. Meer tijd voor je echte werk.',
    how_sub:        'Alles komt samen in één inbox. AI handelt af wat kan en waarschuwt je wanneer iets jouw aandacht nodig heeft. Zo blijft je communicatie 24/7 doorlopen, in meerdere talen, terwijl jij alleen ziet wat aandacht nodig heeft.',
    step1_title:    'We kijken waar je tijd verliest',
    step1_p:        'In een kort gesprek brengen we in kaart waar de meeste berichten binnenkomen, welke vragen steeds terugkomen en waar AI veilig kan helpen.',
    step2_title:    'We richten Unboks voor je in',
    step2_p:        'We koppelen je kanalen, voegen je informatie toe en stellen regels in voor antwoorden, sorteren, opvolgen en doorzetten.',
    step3_title:    'Jij blijft in controle',
    step3_p:        'AI handelt af wat kan. Alles wat belangrijk, onduidelijk of gevoelig is, komt bij jou of de juiste persoon terecht.',

    out_label:      'Wat je krijgt',
    out_title_a:    'Meer tijd.',
    out_title_b:    'Meer overzicht.',
    out_title_c:    'Minder gedoe.',
    out1:           'Minder handmatig antwoordwerk',
    out2:           'Snellere reacties via al je kanalen',
    out3:           'Alle berichten overzichtelijk op één plek',
    out4:           'Belangrijke zaken direct bij de juiste persoon',

    stat_label:     'In cijfers',
    stat1_lbl:      'Kanalen in één inbox',
    stat2_lbl:      'Altijd bereikbaar',
    stat3_lbl:      'Snellere reacties',
    stat4_lbl:      'Minder gemiste berichten',

    cta_h2:         'Krijg je dag terug.',
    cta_p:          'Laat ons zien waar je berichten binnenkomen en waar je tijd verliest. Dan laten wij zien hoe Unboks dat werk uit handen neemt.',
    cta_book:       'Plan een kort gesprek',

    footer_sub:     'AI voor berichten, opvolging en overzicht.',
    footer_email:   'hello@unboks.org',
  },

  sv: {
    nav_services:   'Vad vi gör',
    nav_how:        'Så fungerar det',
    nav_contact:    'Kontakt',
    nav_login:      'Logga in',
    nav_cta:        'Kom igång',

    hero_tag:       'AI för dina meddelanden',
    hero_h1a:       'Alla dina meddelanden.',
    hero_h1b:       'En inkorg.',
    hero_p:         'En plats för alla dina meddelanden. Från WhatsApp till e-post och sociala medier hjälper AI till att svara, sortera och skicka vidare till rätt person.',
    hero_cta:       'Kom igång',
    hero_see:       'Se hur det fungerar',

    channels_label: 'Kanaler',

    feat_label:     'Det vi tar hand om',
    feat_title:     'Mindre rutinjobb. Mer tid.',
    feat_sub:       'Unboks hjälper till med meddelandearbetet som kommer tillbaka varje dag: svara på frågor, följa upp bokningar, känna igen beställningar, informera kunder och skicka viktiga meddelanden vidare.\n\nDu ser bara det som verkligen behöver uppmärksamhet: eskaleringar, beställningar och bokade tider.',

    how_label:      'Så ger vi dig tid tillbaka',
    how_title:      'Mindre meddelandestress. Mer tid för ditt riktiga arbete.',
    how_sub:        'Allt samlas i en inkorg. AI hanterar det den kan och varnar dig när något behöver din uppmärksamhet. Din kommunikation fortsätter 24/7, på flera språk, medan du bara ser det som behöver uppmärksamhet.',
    step1_title:    'Vi ser var du förlorar tid',
    step1_p:        'I ett kort samtal går vi igenom var flest meddelanden kommer in, vilka frågor som återkommer och var AI kan hjälpa till på ett säkert sätt.',
    step2_title:    'Vi ställer in Unboks åt dig',
    step2_p:        'Vi kopplar dina kanaler, lägger till din information och sätter regler för svar, sortering, uppföljning och vidarebefordran.',
    step3_title:    'Du behåller kontrollen',
    step3_p:        'AI hanterar det den kan. Allt som är viktigt, oklart eller känsligt går till dig eller rätt person.',

    out_label:      'Det du får',
    out_title_a:    'Mer tid.',
    out_title_b:    'Bättre överblick.',
    out_title_c:    'Mindre krångel.',
    out1:           'Mindre manuellt svarsarbete',
    out2:           'Snabbare svar i alla dina kanaler',
    out3:           'Alla meddelanden tydligt samlade på en plats',
    out4:           'Viktiga saker direkt till rätt person',

    stat_label:     'I siffror',
    stat1_lbl:      'Kanaler i en inkorg',
    stat2_lbl:      'Alltid nåbar',
    stat3_lbl:      'Snabbare svar',
    stat4_lbl:      'Färre missade meddelanden',

    cta_h2:         'Ta tillbaka din dag.',
    cta_p:          'Visa oss var dina meddelanden kommer in och var du förlorar tid. Vi visar hur Unboks tar det arbetet från dina händer.',
    cta_book:       'Boka ett samtal',

    footer_sub:     'AI för meddelanden, uppföljning och överblick.',
    footer_email:   'hello@unboks.org',
  },
};