export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  label: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    label: 'About Unboks',
    items: [
      {
        q: 'What is Unboks?',
        a: 'Unboks is an AI inbox for your customer messages.\n\nIt brings messages from channels like WhatsApp, Instagram, Facebook, Messenger, email, and more into one place. AI helps answer repetitive questions, sort incoming messages, and alert you when something needs human attention.',
      },
      {
        q: 'Who is Unboks for?',
        a: 'Unboks is for anyone who receives many messages and spends too much time answering the same questions.\n\nThat can be a real estate agent, tourism operator, clinic, restaurant, freelancer, service provider, sales team, or small business. If messages interrupt your day, Unboks can help.',
      },
      {
        q: 'Does Unboks replace my staff?',
        a: 'No. Unboks works alongside people.\n\nAI handles repetitive questions and basic message sorting, so people can spend more time on work that creates value: customers, sales, service, bookings, listings, operations, or growth.\n\nThe goal is not to replace people. The goal is to stop people from answering the same questions all day.',
      },
      {
        q: 'Is Unboks different from ChatGPT?',
        a: 'Yes.\n\nChatGPT is a general AI tool. Unboks is built around your actual inbox, your channels, your information, your tone, and your escalation rules.\n\nIt is less "here is a tool, figure it out" and more "we help run your inbox with AI."',
      },
      {
        q: 'Is Unboks different from ManyChat or normal chatbots?',
        a: 'Yes.\n\nManyChat and many traditional chatbots are often built around flows, scripts, and manual setup.\n\nUnboks is built around your real messages and inbox. AI helps answer routine questions, sort conversations, and send important messages to the right person.',
      },
    ],
  },
  {
    label: 'How it works',
    items: [
      {
        q: 'How does Unboks save time?',
        a: 'Unboks saves time by handling the repetitive message work that comes back every day.\n\nIt can help answer common questions, sort conversations, collect basic details, and flag messages that need human attention.\n\nInstead of checking different apps all day, you only see what needs attention.',
      },
      {
        q: 'Can Unboks answer automatically?',
        a: 'Yes, Unboks can reply automatically to routine questions when the answer is clear and covered by your information.\n\nDuring setup, we decide what AI may answer automatically and what should always be sent to a human.',
      },
      {
        q: 'What happens when something needs a human?',
        a: 'Unboks flags the conversation in your dashboard.\n\nYou can see the conversation, the latest customer message, the channel it came from, and why Unboks flagged it.\n\nThat could be because the message is unclear, sensitive, urgent, a complaint, a refund request, a booking or order issue, or someone asking for a human.',
      },
      {
        q: 'Can Unboks answer in my tone?',
        a: 'Yes, if we set it up properly.\n\nDuring intake, we learn how you normally communicate: your tone, language style, formality, common phrases, and how you want customers to be treated.\n\nThe goal is for routine replies to sound like your business, not like a generic chatbot.',
      },
      {
        q: 'Will customers know they are talking to AI?',
        a: 'Routine replies should sound natural and professional when the setup is done properly.\n\nIf a customer asks whether they are talking to AI, Unboks should not pretend to be human. It can answer honestly or send the conversation to you, depending on your rules.',
      },
      {
        q: 'How does Unboks know what information is true?',
        a: 'Unboks answers from the information we set up with you.\n\nThat can include your services, prices, opening hours, policies, FAQs, tone, listings, availability, discounts, holiday schedules, and escalation rules.\n\nIf something is missing, unclear, outdated, or risky, AI should not guess. It should ask for clarification or send the conversation to a human.',
      },
    ],
  },
  {
    label: 'Channels & setup',
    items: [
      {
        q: 'Which channels can Unboks connect?',
        a: 'Unboks is designed to work with channels like WhatsApp, Instagram, Facebook, Messenger, email, and other supported platforms.\n\nExact channel setup depends on your business, your accounts, and the platforms you want to connect.',
      },
      {
        q: 'Can Unboks connect my WhatsApp, Instagram, and Facebook?',
        a: 'Yes, those channels can be connected when the setup supports it.\n\nFor Meta channels, setup may require access to the correct Meta Business account, Facebook Page, Instagram account, and WhatsApp Business setup.\n\nWe check what you already have during intake.',
      },
      {
        q: 'Can I update what the AI knows later?',
        a: 'Yes.\n\nPrices, opening hours, services, discounts, listings, policies, holiday schedules, FAQs, and temporary changes can be updated after setup.\n\nDepending on your setup, you can update information in your dashboard, send changes to Unboks, or connect Unboks to an existing system where possible.',
      },
      {
        q: 'Can Unboks connect to my database or system?',
        a: 'Where possible, yes.\n\nDepending on the setup, Unboks may connect to existing systems such as a database, booking system, inventory system, CRM, calendar, website, or listing database.\n\nExamples include stock availability, special discounts, holiday schedules, current offers, real estate listings, viewing availability, and booking availability.\n\nNot every system can be connected automatically, so we check this during setup.',
      },
      {
        q: 'Will Unboks read all my customer messages?',
        a: 'Unboks needs to process incoming customer messages to provide the service.\n\nMessages are used to run your inbox, generate replies, sort conversations, and support escalations.\n\nAccess, storage, and team visibility depend on your setup. We explain what is connected, what is stored, who can access it, and how escalations work before setup is finalized.',
      },
    ],
  },
  {
    label: 'Capabilities',
    items: [
      {
        q: 'Can Unboks help real estate agents?',
        a: 'Yes. Unboks can help real estate agents with routine messages about listings, prices, availability, viewing times, required documents, locations, and basic conditions.\n\nIf someone wants to book a viewing, negotiate, make an offer, ask a legal question, or needs personal attention, Unboks can send the conversation to you or the right person.\n\nListings can be updated in the dashboard or connected to your existing system where possible.',
      },
      {
        q: 'Can Unboks handle bookings, appointments, or orders?',
        a: 'Unboks can help with the conversation around bookings, appointments, or orders.\n\nAI can answer routine questions, collect details, check rules, check availability when connected, and prepare the next step.\n\nFinal confirmation depends on your setup. For important actions, the safest setup is often human confirmation.',
      },
      {
        q: 'Can Unboks answer in different languages?',
        a: 'Yes. Unboks can help with multilingual customer messages.\n\nIt can handle normal messy messages, including spelling mistakes, short phrases, informal WhatsApp-style writing, and mixed language.\n\nLanguages should be tested during setup so replies sound natural and professional for your audience.',
      },
      {
        q: 'What languages does the website and dashboard support?',
        a: 'The website and dashboard currently support English, Papiamento, Spanish, Dutch, and Swedish.\n\nCustomer replies can be configured based on the languages your customers use most.',
      },
      {
        q: 'Can Unboks handle voice notes, photos, screenshots, or documents?',
        a: 'For now, Unboks is mainly focused on text-based messages.\n\nIf a customer sends a voice note, screenshot, photo, or document, the safest default is to send it to a human instead of letting AI guess.\n\nDuring setup, we define how those messages should be handled.',
      },
      {
        q: 'Can Unboks answer medical, legal, or financial questions?',
        a: 'The safest setup is human escalation for medical, legal, or financial questions.\n\nAI can help recognize and route sensitive topics, but it should not give advice it is not allowed or qualified to give.\n\nDuring setup, we define which topics AI may answer and which should always be escalated.',
      },
      {
        q: 'What happens if a customer insults the AI or tries to trick it?',
        a: 'Unboks should stay calm, professional, and on-topic.\n\nAI should not argue, insult back, joke back, reveal internal instructions, or follow unsafe prompts.\n\nIf the customer keeps pushing, becomes abusive, or asks offensive questions, the conversation can be sent to a human based on your rules.',
      },
    ],
  },
  {
    label: 'Reliability & privacy',
    items: [
      {
        q: 'What if the AI gives a wrong answer?',
        a: 'No AI is perfect.\n\nUnboks reduces risk by using your own information, clear rules, and human escalation when something is unclear, sensitive, missing, or risky.\n\nDuring setup, we define what AI may answer and what should always be sent to a human.',
      },
      {
        q: 'Can Unboks guarantee I will never miss a message?',
        a: 'No. Nobody should promise that.\n\nUnboks helps reduce the chance of missed messages by bringing channels into one inbox, replying to routine questions, and flagging conversations that need attention.\n\nIt improves visibility and response speed, but it is not a guarantee of perfection.',
      },
      {
        q: 'What happens if Meta, WhatsApp, or Instagram has an outage?',
        a: 'Unboks depends on connected platforms delivering messages.\n\nIf Meta, WhatsApp, Instagram, Facebook, email, or another connected channel has an outage, messages may not reach Unboks until that platform is working again.\n\nIf your own internet is down, Unboks can still run on our side, but you may not be able to view or respond to escalations until you are back online.',
      },
      {
        q: 'Do I need a lot of messages for Unboks to make sense?',
        a: 'Not always.\n\nUnboks usually makes the most sense when messages take real time, repeat often, come through multiple channels, arrive outside working hours, or need sorting and escalation.\n\nIf you only get a few messages and they are all unique, Unboks may not save much time yet. If many are repeated questions, it can still help.',
      },
    ],
  },
  {
    label: 'Getting started',
    items: [
      {
        q: 'Am I locked into a contract?',
        a: 'Contract and cancellation terms depend on your setup.\n\nWe explain the terms before you start, including what is included, what the setup looks like, and how cancellation works.\n\nYou should know what you are agreeing to before anything goes live.',
      },
      {
        q: 'How do I get started?',
        a: 'We start with a short intake.\n\nWe look at your channels, the messages you receive, the questions that repeat, your tone, your rules, and when a human should step in.\n\nThen we set up Unboks around your real workflow.',
      },
    ],
  },
];
