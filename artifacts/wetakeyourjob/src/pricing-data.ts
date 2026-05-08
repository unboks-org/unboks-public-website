import type { Lang } from './i18n';

export type Plan = {
  id: 'starter' | 'business' | 'team';
  name: string;
  price: string;
  setup: string;
  features: string[];
  best_for: string;
};

type PricingCopy = {
  tag: string;
  h1: string;
  intro: string;
  step1_t: string; step1_d: string;
  step2_t: string; step2_d: string;
  step3_t: string; step3_d: string;
  per_month: string;
  setup_label: string;
  split_note: string;
  most_popular: string;
  best_for_label: string;
  cta: string;
  plans: Plan[];
  addons_h: string;
  addon_channel_l: string; addon_channel_v: string;
  addon_user_l: string;    addon_user_v: string;
  addon_x_l: string;       addon_x_v: string;
  addon_traffic_l: string; addon_traffic_v: string;
  addon_brand_l: string;   addon_brand_v: string;
  def_h: string;
  def_channel: string;
  def_user: string;
};

const F = {
  ch1: { en: '1 channel', pap: '1 kanal', es: '1 canal', nl: '1 kanaal', sv: '1 kanal' },
  ch2: { en: '2 channels', pap: '2 kanal', es: '2 canales', nl: '2 kanalen', sv: '2 kanaler' },
  ch3: { en: '3 channels', pap: '3 kanal', es: '3 canales', nl: '3 kanalen', sv: '3 kanaler' },
  u1: { en: '1 user/chair', pap: '1 usuario/siya', es: '1 usuario/silla', nl: '1 gebruiker/stoel', sv: '1 användare/stol' },
  u3: { en: '3 users/chairs', pap: '3 usuario/siya', es: '3 usuarios/sillas', nl: '3 gebruikers/stoelen', sv: '3 användare/stolar' },
  u5: { en: '5 users/chairs', pap: '5 usuario/siya', es: '5 usuarios/sillas', nl: '5 gebruikers/stoelen', sv: '5 användare/stolar' },
  agent_repetitive: {
    en: 'Unboks Agent answers repetitive questions',
    pap: 'Unboks Agent ta kontestá preguntanan ku ta bolbe',
    es: 'El Agente de Unboks responde preguntas repetitivas',
    nl: 'Unboks Agent beantwoordt terugkerende vragen',
    sv: 'Unboks Agent svarar på återkommande frågor',
  },
  human_esc: {
    en: 'Human escalation',
    pap: 'Eskalashon na hende',
    es: 'Escalado a humano',
    nl: 'Escalatie naar mens',
    sv: 'Eskalering till människa',
  },
  knowledge: {
    en: 'Company knowledge / Your Info',
    pap: 'Konosementu di kompania / Bo Info',
    es: 'Conocimiento de la empresa / Tu Info',
    nl: 'Bedrijfskennis / Jouw Info',
    sv: 'Företagskunskap / Din Info',
  },
  basic_dash: {
    en: 'Basic dashboard access',
    pap: 'Akseso básiko na dashboard',
    es: 'Acceso básico al panel',
    nl: 'Basis dashboardtoegang',
    sv: 'Grundläggande dashboard-åtkomst',
  },
  dash: {
    en: 'Dashboard access',
    pap: 'Akseso na dashboard',
    es: 'Acceso al panel',
    nl: 'Dashboardtoegang',
    sv: 'Dashboard-åtkomst',
  },
  team_dash: {
    en: 'Team dashboard access',
    pap: 'Akseso na dashboard di team',
    es: 'Acceso al panel del equipo',
    nl: 'Team-dashboardtoegang',
    sv: 'Team-dashboard-åtkomst',
  },
  msg_overview: {
    en: 'Message overview across channels',
    pap: 'Bista general di mensahe riba tur kanal',
    es: 'Visión general de mensajes en todos los canales',
    nl: 'Berichtenoverzicht over alle kanalen',
    sv: 'Meddelandeöversikt över alla kanaler',
  },
  esc_overview: {
    en: 'Escalation overview',
    pap: 'Bista general di eskalashon',
    es: 'Visión general de escaladas',
    nl: 'Escalatieoverzicht',
    sv: 'Eskaleringsöversikt',
  },
  monthly_imp: {
    en: 'Monthly Agent improvement',
    pap: 'Mehoramentu mensual di Agent',
    es: 'Mejora mensual del Agente',
    nl: 'Maandelijkse Agent-verbetering',
    sv: 'Månatlig förbättring av Agent',
  },
  higher_usage: {
    en: 'Higher usage allowance',
    pap: 'Mas uzo permití',
    es: 'Mayor cuota de uso',
    nl: 'Hogere gebruikslimiet',
    sv: 'Högre användningsgräns',
  },
  prio_support: {
    en: 'Priority support',
    pap: 'Sosten prioritario',
    es: 'Soporte prioritario',
    nl: 'Prioriteitssupport',
    sv: 'Prioriterad support',
  },
  perf_review: {
    en: 'Monthly performance review',
    pap: 'Revishon mensual di rendimentu',
    es: 'Revisión mensual de rendimiento',
    nl: 'Maandelijkse prestatiebeoordeling',
    sv: 'Månatlig prestandagenomgång',
  },
};

const BEST = {
  starter: {
    en: 'Small businesses with one main message channel, usually WhatsApp.',
    pap: 'Negoshinan chikí ku un kanal di mensahe prinsipal, normalmente WhatsApp.',
    es: 'Pequeños negocios con un canal de mensajes principal, normalmente WhatsApp.',
    nl: 'Kleine bedrijven met één hoofdkanaal voor berichten, meestal WhatsApp.',
    sv: 'Små företag med en huvudkanal för meddelanden, oftast WhatsApp.',
  },
  business: {
    en: 'Businesses that receive customer messages every day and want Unboks to reduce repetitive work across more than one channel.',
    pap: 'Negoshinan ku ta risibí mensahenan di kliente tur dia i ke pa Unboks redusí trabou repetitivo riba mas ku un kanal.',
    es: 'Negocios que reciben mensajes de clientes cada día y quieren que Unboks reduzca el trabajo repetitivo en más de un canal.',
    nl: 'Bedrijven die elke dag klantberichten ontvangen en willen dat Unboks het repetitieve werk over meerdere kanalen verlaagt.',
    sv: 'Företag som tar emot kundmeddelanden varje dag och vill att Unboks minskar det repetitiva arbetet över flera kanaler.',
  },
  team: {
    en: 'Businesses where multiple people already handle customer messages.',
    pap: 'Negoshinan kaminda mas hende ya ta trata mensahenan di kliente.',
    es: 'Negocios donde varias personas ya gestionan los mensajes de los clientes.',
    nl: 'Bedrijven waar meerdere mensen al klantberichten verwerken.',
    sv: 'Företag där flera personer redan hanterar kundmeddelanden.',
  },
};

function buildPlans(L: Lang): Plan[] {
  return [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Cg. 495',
      setup: 'Cg. 1,500',
      features: [F.ch1[L], F.u1[L], F.agent_repetitive[L], F.human_esc[L], F.knowledge[L], F.basic_dash[L]],
      best_for: BEST.starter[L],
    },
    {
      id: 'business',
      name: 'Business',
      price: 'Cg. 995',
      setup: 'Cg. 2,500',
      features: [F.ch2[L], F.u3[L], F.agent_repetitive[L], F.human_esc[L], F.knowledge[L], F.dash[L], F.msg_overview[L], F.esc_overview[L], F.monthly_imp[L]],
      best_for: BEST.business[L],
    },
    {
      id: 'team',
      name: 'Team',
      price: 'Cg. 1,995',
      setup: 'Cg. 5,000',
      features: [F.ch3[L], F.u5[L], F.agent_repetitive[L], F.human_esc[L], F.knowledge[L], F.team_dash[L], F.msg_overview[L], F.esc_overview[L], F.higher_usage[L], F.prio_support[L], F.perf_review[L]],
      best_for: BEST.team[L],
    },
  ];
}

export const PRICING: Record<Lang, PricingCopy> = {
  en: {
    tag: 'PRICING',
    h1: 'Simple pricing. Prove it first.',
    intro: 'Try Unboks live for 14 days. We set up your Unboks Agent, connect the agreed channels, and run it with your business information. If it works for your business, your paid plan starts on day 15. If not, we disconnect it.',
    step1_t: 'Day 1–14', step1_d: 'Free live proof period',
    step2_t: 'Day 15', step2_d: 'Continue and pay, or disconnect',
    step3_t: 'Setup fee', step3_d: 'Charged from the first paid invoice',
    per_month: '/month',
    setup_label: 'Setup',
    split_note: 'Larger setup fees can be split over 3 months.',
    most_popular: 'Most popular',
    best_for_label: 'Best for',
    cta: 'Get started',
    plans: buildPlans('en'),
    addons_h: 'Add-ons',
    addon_channel_l: 'Extra channel', addon_channel_v: 'Cg. 75/month',
    addon_user_l: 'Extra user/chair', addon_user_v: 'Cg. 95/month',
    addon_x_l: 'X/Twitter usage', addon_x_v: 'billed separately',
    addon_traffic_l: 'High traffic', addon_traffic_v: 'custom',
    addon_brand_l: 'Extra brand/location', addon_brand_v: 'custom',
    def_h: 'Definitions',
    def_channel: 'Channel = one connected message source, such as WhatsApp, Instagram, Facebook, TikTok, X/Twitter, or email.',
    def_user: 'User/chair = one person who can use the dashboard.',
  },
  pap: {
    tag: 'PRESIO',
    h1: 'Presio simpel. Purba promé.',
    intro: 'Purba Unboks live durante 14 dia. Nos ta konfigurá bo Unboks Agent, konektá e kanalnan akordá, i lag\'é kore ku informashon di bo negoshi. Si e ta funshoná pa bo, bo plan pagá ta kuminsá riba dia 15. Si no, nos ta deskonektá.',
    step1_t: 'Dia 1–14', step1_d: 'Periodo gratis di prueba live',
    step2_t: 'Dia 15', step2_d: 'Sigui i paga, of deskonektá',
    step3_t: 'Fee di setup', step3_d: 'Karga for di promé fakatura pagá',
    per_month: '/luna',
    setup_label: 'Setup',
    split_note: 'Fee di setup mas grandi por wòrdu plamá riba 3 luna.',
    most_popular: 'Mas popular',
    best_for_label: 'Mihó pa',
    cta: 'Kuminsá',
    plans: buildPlans('pap'),
    addons_h: 'Ekstra',
    addon_channel_l: 'Kanal ekstra', addon_channel_v: 'Cg. 75/luna',
    addon_user_l: 'Usuario/siya ekstra', addon_user_v: 'Cg. 95/luna',
    addon_x_l: 'Uzo di X/Twitter', addon_x_v: 'fakturá aparte',
    addon_traffic_l: 'Trafiko haltu', addon_traffic_v: 'personalisá',
    addon_brand_l: 'Marka/lokashon ekstra', addon_brand_v: 'personalisá',
    def_h: 'Definishon',
    def_channel: 'Kanal = un fuente di mensahe konektá, manera WhatsApp, Instagram, Facebook, TikTok, X/Twitter, of email.',
    def_user: 'Usuario/siya = un persona ku por usa e dashboard.',
  },
  es: {
    tag: 'PRECIOS',
    h1: 'Precios simples. Pruébalo primero.',
    intro: 'Prueba Unboks en vivo durante 14 días. Configuramos tu Agente Unboks, conectamos los canales acordados y lo hacemos funcionar con la información de tu negocio. Si funciona para ti, tu plan de pago empieza el día 15. Si no, lo desconectamos.',
    step1_t: 'Día 1–14', step1_d: 'Período gratuito de prueba en vivo',
    step2_t: 'Día 15', step2_d: 'Continúa y paga, o desconectamos',
    step3_t: 'Tarifa de instalación', step3_d: 'Se cobra en la primera factura pagada',
    per_month: '/mes',
    setup_label: 'Instalación',
    split_note: 'Las tarifas de instalación más grandes pueden dividirse en 3 meses.',
    most_popular: 'Más popular',
    best_for_label: 'Ideal para',
    cta: 'Empezar',
    plans: buildPlans('es'),
    addons_h: 'Extras',
    addon_channel_l: 'Canal adicional', addon_channel_v: 'Cg. 75/mes',
    addon_user_l: 'Usuario/silla adicional', addon_user_v: 'Cg. 95/mes',
    addon_x_l: 'Uso de X/Twitter', addon_x_v: 'facturado aparte',
    addon_traffic_l: 'Tráfico alto', addon_traffic_v: 'personalizado',
    addon_brand_l: 'Marca/ubicación adicional', addon_brand_v: 'personalizado',
    def_h: 'Definiciones',
    def_channel: 'Canal = una fuente de mensajes conectada, como WhatsApp, Instagram, Facebook, TikTok, X/Twitter o email.',
    def_user: 'Usuario/silla = una persona que puede usar el panel.',
  },
  nl: {
    tag: 'PRIJZEN',
    h1: 'Eenvoudige prijzen. Eerst bewijzen.',
    intro: 'Probeer Unboks 14 dagen live. We zetten je Unboks Agent op, koppelen de afgesproken kanalen en draaien het met jouw bedrijfsinformatie. Werkt het voor je bedrijf, dan start je betaalde plan op dag 15. Zo niet, dan koppelen we het los.',
    step1_t: 'Dag 1–14', step1_d: 'Gratis live proefperiode',
    step2_t: 'Dag 15', step2_d: 'Doorgaan en betalen, of loskoppelen',
    step3_t: 'Setup-kosten', step3_d: 'In rekening op de eerste betaalde factuur',
    per_month: '/maand',
    setup_label: 'Setup',
    split_note: 'Grotere setup-kosten kunnen over 3 maanden gespreid worden.',
    most_popular: 'Meest gekozen',
    best_for_label: 'Geschikt voor',
    cta: 'Aan de slag',
    plans: buildPlans('nl'),
    addons_h: 'Extra',
    addon_channel_l: 'Extra kanaal', addon_channel_v: 'Cg. 75/maand',
    addon_user_l: 'Extra gebruiker/stoel', addon_user_v: 'Cg. 95/maand',
    addon_x_l: 'X/Twitter-gebruik', addon_x_v: 'apart gefactureerd',
    addon_traffic_l: 'Hoog verkeer', addon_traffic_v: 'op maat',
    addon_brand_l: 'Extra merk/locatie', addon_brand_v: 'op maat',
    def_h: 'Definities',
    def_channel: 'Kanaal = één gekoppelde berichtenbron, zoals WhatsApp, Instagram, Facebook, TikTok, X/Twitter of email.',
    def_user: 'Gebruiker/stoel = één persoon die het dashboard kan gebruiken.',
  },
  sv: {
    tag: 'PRISER',
    h1: 'Enkla priser. Bevisa det först.',
    intro: 'Prova Unboks live i 14 dagar. Vi ställer in din Unboks Agent, kopplar de överenskomna kanalerna och kör den med din företagsinformation. Fungerar det för ditt företag startar din betalplan på dag 15. Annars kopplar vi bort den.',
    step1_t: 'Dag 1–14', step1_d: 'Gratis live-bevisperiod',
    step2_t: 'Dag 15', step2_d: 'Fortsätt och betala, eller koppla bort',
    step3_t: 'Setup-avgift', step3_d: 'Debiteras på första betalda fakturan',
    per_month: '/månad',
    setup_label: 'Setup',
    split_note: 'Större setup-avgifter kan delas upp på 3 månader.',
    most_popular: 'Mest valda',
    best_for_label: 'Passar',
    cta: 'Kom igång',
    plans: buildPlans('sv'),
    addons_h: 'Tillägg',
    addon_channel_l: 'Extra kanal', addon_channel_v: 'Cg. 75/månad',
    addon_user_l: 'Extra användare/stol', addon_user_v: 'Cg. 95/månad',
    addon_x_l: 'X/Twitter-användning', addon_x_v: 'faktureras separat',
    addon_traffic_l: 'Hög trafik', addon_traffic_v: 'anpassat',
    addon_brand_l: 'Extra varumärke/plats', addon_brand_v: 'anpassat',
    def_h: 'Definitioner',
    def_channel: 'Kanal = en kopplad meddelandekälla, t.ex. WhatsApp, Instagram, Facebook, TikTok, X/Twitter eller e-post.',
    def_user: 'Användare/stol = en person som kan använda dashboarden.',
  },
};
