export type Lang = 'pap' | 'en' | 'es' | 'nl';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'pap', label: 'Papiamentu' },
  { code: 'en',  label: 'English' },
  { code: 'es',  label: 'Español' },
  { code: 'nl',  label: 'Nederlands' },
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
    nav_services:   'Servicios',
    nav_how:        'Cómo funciona',
    nav_contact:    'Contacto',
    nav_login:      'Iniciar sesión',
    nav_cta:        'Empezar',

    hero_tag:       'Herramientas de comunicación con IA',
    hero_h1a:       'Todos tus mensajes.',
    hero_h1b:       'Una bandeja.',
    hero_p:         'Construimos la capa de comunicación que le falta a tu equipo, para que pases menos tiempo en mensajes y más tiempo en tu negocio.',
    hero_cta:       'Empezar',
    hero_see:       'Ver cómo funciona',

    channels_label: 'Canales',

    feat_label:     'Lo que manejamos',
    feat_title:     'Menos trabajo. Más negocio.',
    feat_sub:       'Quitamos el trabajo de comunicación repetitivo del plato de tu equipo, sin sacarlos del loop.',

    how_label:      'Cómo funciona',
    how_title:      'Estudiamos tu proceso, luego construimos alrededor de él.',
    how_sub:        'Sin plantillas genéricas. Miramos exactamente dónde tu equipo pierde tiempo y construimos un sistema alrededor de tu flujo de trabajo real.',
    step1_title:    'Llamada de descubrimiento',
    step1_p:        '30 minutos para mapear dónde tu equipo pasa más tiempo en comunicación y dónde la IA puede tomar el control de forma segura.',
    step2_title:    'Construimos tu sistema',
    step2_p:        'Bandeja unificada, respuestas automáticas, reglas de escalación y un panel de control, todo adaptado a tu flujo de trabajo.',
    step3_title:    'Tu equipo mantiene el control',
    step3_p:        'Los gerentes revisan, aprueban e intervienen en cualquier momento. Visibilidad total en cada canal, sin cajas negras.',

    out_label:      'Lo que obtienes',
    out_title_a:    'Más tiempo.',
    out_title_b:    'Más clientes.',
    out_title_c:    'Más vida.',
    out1:           'Menos trabajo repetitivo de respuesta',
    out2:           'Respuesta más rápida en cada canal',
    out3:           'Visibilidad total sin la carga manual',
    out4:           'Experiencia del cliente más consistente',

    stat_label:     'En números',
    stat1_lbl:      'Canales en una bandeja',
    stat2_lbl:      'Cobertura, siempre activa',
    stat3_lbl:      'Tiempo de respuesta promedio',
    stat4_lbl:      'Mensajes perdidos',

    cta_h2:         'Veamos dónde tu equipo está perdiendo tiempo.',
    cta_p:          'Dinos en qué pasa demasiado tiempo tu equipo. Nosotros nos encargamos del resto.',
    cta_book:       'Reservar una llamada de descubrimiento',

    footer_sub:     'Herramientas de comunicación con IA para equipos pequeños.',
    footer_email:   'hello@unboks.org',
  },

  nl: {
    nav_services:   'Diensten',
    nav_how:        'Hoe het werkt',
    nav_contact:    'Contact',
    nav_login:      'Inloggen',
    nav_cta:        'Aan de slag',

    hero_tag:       'AI communicatietools',
    hero_h1a:       'Al je berichten.',
    hero_h1b:       'Één inbox.',
    hero_p:         'We bouwen de communicatielaag die jouw team mist, zodat je minder tijd besteedt aan berichten en meer aan je bedrijf.',
    hero_cta:       'Aan de slag',
    hero_see:       'Zie hoe het werkt',

    channels_label: 'Kanalen',

    feat_label:     'Wat we afhandelen',
    feat_title:     'Minder routinewerk. Meer business.',
    feat_sub:       'We nemen het repetitieve communicatiewerk van jouw team over, zonder hen uit de loop te halen.',

    how_label:      'Hoe het werkt',
    how_title:      'We bestuderen jouw proces en bouwen er dan omheen.',
    how_sub:        'Geen generieke templates. We kijken precies waar jouw team tijd verliest en bouwen een systeem rond jouw echte workflow.',
    step1_title:    'Ontdekkingsgesprek',
    step1_p:        '30 minuten om in kaart te brengen waar jouw team de meeste tijd besteedt aan communicatie en waar AI veilig het stokje kan overnemen.',
    step2_title:    'We bouwen jouw systeem',
    step2_p:        'Unified inbox, geautomatiseerde antwoorden, escalatieregels en een controledashboard, allemaal afgestemd op jouw workflow.',
    step3_title:    'Jouw team blijft in controle',
    step3_p:        'Managers reviewen, keuren goed en grijpen altijd in. Volledig overzicht in elk kanaal, geen black boxes.',

    out_label:      'Wat je krijgt',
    out_title_a:    'Meer tijd.',
    out_title_b:    'Meer klanten.',
    out_title_c:    'Meer leven.',
    out1:           'Minder repetitief antwoordwerk',
    out2:           'Snellere respons via elk kanaal',
    out3:           'Volledig overzicht zonder de handmatige belasting',
    out4:           'Consistentere klantervaring',

    stat_label:     'In cijfers',
    stat1_lbl:      'Kanalen in één inbox',
    stat2_lbl:      'Dekking, altijd actief',
    stat3_lbl:      'Gemiddelde responstijd',
    stat4_lbl:      'Gemiste berichten',

    cta_h2:         'Laten we kijken waar jouw team tijd verliest.',
    cta_p:          'Vertel ons waaraan jouw team te veel tijd besteedt. Wij nemen het van hier over.',
    cta_book:       'Boek een ontdekkingsgesprek',

    footer_sub:     'AI communicatietools voor slanke teams.',
    footer_email:   'hello@unboks.org',
  },
};
