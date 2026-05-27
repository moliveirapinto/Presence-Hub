import { IInputs, IOutputs } from "./generated/ManifestTypes";

/* ═══════════════════════════════════════════════════════════════
   Internationalization (i18n)
   ═══════════════════════════════════════════════════════════════ */

let _lcid = 1033; // set in PresenceHub.init() from context.userSettings.languageId

const LCID_LOCALE: Record<number, string> = {
  1025:"ar",1026:"bg",1027:"ca",1028:"zh-TW",1029:"cs",1030:"da",1031:"de",1032:"el",1033:"en",
  1035:"fi",1036:"fr",1037:"he",1038:"hu",1040:"it",1041:"ja",1042:"ko",1043:"nl",1044:"nb",
  1045:"pl",1046:"pt-BR",1048:"ro",1049:"ru",1050:"hr",1051:"sk",1053:"sv",1054:"th",1055:"tr",
  1057:"id",1058:"uk",1060:"sl",1061:"et",1062:"lv",1063:"lt",1066:"vi",1069:"eu",1081:"hi",
  1086:"ms",1087:"kk",1110:"gl",2052:"zh-CN",2070:"pt-PT",3076:"zh-HK",3082:"es",3098:"sr",
};

function getLocale(): string { return LCID_LOCALE[_lcid] || "en"; }

interface I18nStrings {
  loading: string; timeInStatus: string; today: string; timeline: string;
  noActivity: string; failedToLoad: string; subtitle: string;
  queues: string; agents: string; searchQueues: string; searchAgents: string;
  noQueuesMatch: string; noQueuesFound: string; noAgentsMatch: string; noAgentsFound: string;
  agentsInSelected: string; noAgentsInSelected: string;
  you: string; presenceHistory: string; queueHub: string; pickDate: string;
  unknown: string; selected: string; queue_one: string; agent_one: string; refresh: string;
  showAgents: string;
}

const EN: I18nStrings = {
  loading:"Loading\u2026", timeInStatus:"time in status", today:"Today", timeline:"Timeline",
  noActivity:"No activity on this day", failedToLoad:"Failed to load:",
  subtitle:"Check agents\u2019 presence status and which queues they belong to.",
  queues:"Queues", agents:"Agents", searchQueues:"Search queues\u2026", searchAgents:"Search agents\u2026",
  noQueuesMatch:"No queues match your search", noQueuesFound:"No queues found",
  noAgentsMatch:"No agents match your search", noAgentsFound:"No agents found",
  agentsInSelected:"Agents in selected queues", noAgentsInSelected:"No agents in selected queues",
  you:"You", presenceHistory:"Presence History", queueHub:"Queue Hub", pickDate:"Pick a date",
  unknown:"Unknown", selected:"selected", queue_one:"queue", agent_one:"agent", refresh:"Refresh",
  showAgents:"Show agents",
};

const TRANSLATIONS: Record<string, Partial<I18nStrings>> = {
// Western European
de:{loading:"Laden\u2026",timeInStatus:"Zeit im Status",today:"Heute",timeline:"Zeitverlauf",noActivity:"Keine Aktivit\u00e4t an diesem Tag",failedToLoad:"Laden fehlgeschlagen:",subtitle:"Pr\u00fcfen Sie den Anwesenheitsstatus der Agenten und welchen Warteschlangen sie angeh\u00f6ren.",queues:"Warteschlangen",agents:"Agenten",searchQueues:"Warteschlangen suchen\u2026",searchAgents:"Agenten suchen\u2026",noQueuesMatch:"Keine Warteschlangen gefunden",noQueuesFound:"Keine Warteschlangen vorhanden",noAgentsMatch:"Keine Agenten gefunden",noAgentsFound:"Keine Agenten vorhanden",agentsInSelected:"Agenten in ausgew\u00e4hlten Warteschlangen",noAgentsInSelected:"Keine Agenten in ausgew\u00e4hlten Warteschlangen",you:"Sie",presenceHistory:"Anwesenheitsverlauf",queueHub:"Warteschlangen-Hub",pickDate:"Datum w\u00e4hlen",unknown:"Unbekannt",selected:"ausgew\u00e4hlt",queue_one:"Warteschlange",agent_one:"Agent",refresh:"Aktualisieren"},
fr:{loading:"Chargement\u2026",timeInStatus:"temps dans le statut",today:"Aujourd\u2019hui",timeline:"Chronologie",noActivity:"Aucune activit\u00e9 ce jour",failedToLoad:"\u00c9chec du chargement :",subtitle:"V\u00e9rifiez le statut de pr\u00e9sence des agents et les files d\u2019attente auxquelles ils appartiennent.",queues:"Files d\u2019attente",agents:"Agents",searchQueues:"Rechercher des files\u2026",searchAgents:"Rechercher des agents\u2026",noQueuesMatch:"Aucune file ne correspond",noQueuesFound:"Aucune file trouv\u00e9e",noAgentsMatch:"Aucun agent ne correspond",noAgentsFound:"Aucun agent trouv\u00e9",agentsInSelected:"Agents dans les files s\u00e9lectionn\u00e9es",noAgentsInSelected:"Aucun agent dans les files s\u00e9lectionn\u00e9es",you:"Vous",presenceHistory:"Historique de pr\u00e9sence",queueHub:"Hub de files",pickDate:"Choisir une date",unknown:"Inconnu",selected:"s\u00e9lectionn\u00e9(es)",queue_one:"file",agent_one:"agent",refresh:"Actualiser"},
es:{loading:"Cargando\u2026",timeInStatus:"tiempo en estado",today:"Hoy",timeline:"Cronolog\u00eda",noActivity:"Sin actividad en este d\u00eda",failedToLoad:"Error al cargar:",subtitle:"Compruebe el estado de presencia de los agentes y a qu\u00e9 colas pertenecen.",queues:"Colas",agents:"Agentes",searchQueues:"Buscar colas\u2026",searchAgents:"Buscar agentes\u2026",noQueuesMatch:"Ninguna cola coincide",noQueuesFound:"No se encontraron colas",noAgentsMatch:"Ning\u00fan agente coincide",noAgentsFound:"No se encontraron agentes",agentsInSelected:"Agentes en colas seleccionadas",noAgentsInSelected:"Sin agentes en colas seleccionadas",you:"T\u00fa",presenceHistory:"Historial de presencia",queueHub:"Hub de colas",pickDate:"Elegir fecha",unknown:"Desconocido",selected:"seleccionadas",queue_one:"cola",agent_one:"agente",refresh:"Actualizar"},
it:{loading:"Caricamento\u2026",timeInStatus:"tempo nello stato",today:"Oggi",timeline:"Cronologia",noActivity:"Nessuna attivit\u00e0 in questo giorno",failedToLoad:"Caricamento non riuscito:",subtitle:"Controlla lo stato di presenza degli agenti e a quali code appartengono.",queues:"Code",agents:"Agenti",searchQueues:"Cerca code\u2026",searchAgents:"Cerca agenti\u2026",noQueuesMatch:"Nessuna coda corrisponde",noQueuesFound:"Nessuna coda trovata",noAgentsMatch:"Nessun agente corrisponde",noAgentsFound:"Nessun agente trovato",agentsInSelected:"Agenti nelle code selezionate",noAgentsInSelected:"Nessun agente nelle code selezionate",you:"Tu",presenceHistory:"Cronologia presenza",queueHub:"Hub code",pickDate:"Scegli data",unknown:"Sconosciuto",selected:"selezionate",queue_one:"coda",agent_one:"agente",refresh:"Aggiorna"},
"pt-BR":{loading:"Carregando\u2026",timeInStatus:"tempo no status",today:"Hoje",timeline:"Linha do tempo",noActivity:"Nenhuma atividade neste dia",failedToLoad:"Falha ao carregar:",subtitle:"Verifique o status de presen\u00e7a dos agentes e quais filas eles participam.",queues:"Filas",agents:"Agentes",searchQueues:"Pesquisar filas\u2026",searchAgents:"Pesquisar agentes\u2026",noQueuesMatch:"Nenhuma fila corresponde",noQueuesFound:"Nenhuma fila encontrada",noAgentsMatch:"Nenhum agente corresponde",noAgentsFound:"Nenhum agente encontrado",agentsInSelected:"Agentes nas filas selecionadas",noAgentsInSelected:"Nenhum agente nas filas selecionadas",you:"Voc\u00ea",presenceHistory:"Hist\u00f3rico de presen\u00e7a",queueHub:"Hub de filas",pickDate:"Escolher data",unknown:"Desconhecido",selected:"selecionadas",queue_one:"fila",agent_one:"agente",refresh:"Atualizar"},
"pt-PT":{loading:"A carregar\u2026",timeInStatus:"tempo no estado",today:"Hoje",timeline:"Linha cronol\u00f3gica",noActivity:"Sem atividade neste dia",failedToLoad:"Falha ao carregar:",subtitle:"Verifique o estado de presen\u00e7a dos agentes e a que filas pertencem.",queues:"Filas",agents:"Agentes",searchQueues:"Procurar filas\u2026",searchAgents:"Procurar agentes\u2026",noQueuesMatch:"Nenhuma fila corresponde",noQueuesFound:"Nenhuma fila encontrada",noAgentsMatch:"Nenhum agente corresponde",noAgentsFound:"Nenhum agente encontrado",agentsInSelected:"Agentes nas filas selecionadas",noAgentsInSelected:"Nenhum agente nas filas selecionadas",you:"Voc\u00ea",presenceHistory:"Hist\u00f3rico de presen\u00e7a",queueHub:"Hub de filas",pickDate:"Escolher data",unknown:"Desconhecido",selected:"selecionadas",queue_one:"fila",agent_one:"agente",refresh:"Atualizar"},
nl:{loading:"Laden\u2026",timeInStatus:"tijd in status",today:"Vandaag",timeline:"Tijdlijn",noActivity:"Geen activiteit op deze dag",failedToLoad:"Laden mislukt:",subtitle:"Controleer de aanwezigheidsstatus van agenten en bij welke wachtrijen ze horen.",queues:"Wachtrijen",agents:"Agenten",searchQueues:"Wachtrijen zoeken\u2026",searchAgents:"Agenten zoeken\u2026",noQueuesMatch:"Geen wachtrijen gevonden",noQueuesFound:"Geen wachtrijen beschikbaar",noAgentsMatch:"Geen agenten gevonden",noAgentsFound:"Geen agenten beschikbaar",agentsInSelected:"Agenten in geselecteerde wachtrijen",noAgentsInSelected:"Geen agenten in geselecteerde wachtrijen",you:"Jij",presenceHistory:"Aanwezigheidsoverzicht",queueHub:"Wachtrij-hub",pickDate:"Kies een datum",unknown:"Onbekend",selected:"geselecteerd",queue_one:"wachtrij",agent_one:"agent",refresh:"Vernieuwen"},
ca:{loading:"Carregant\u2026",timeInStatus:"temps en l\u2019estat",today:"Avui",timeline:"Cronologia",noActivity:"Cap activitat aquest dia",failedToLoad:"Error en carregar:",subtitle:"Consulteu l\u2019estat de pres\u00e8ncia dels agents i a quines cues pertanyen.",queues:"Cues",agents:"Agents",you:"Tu",presenceHistory:"Historial de pres\u00e8ncia",queueHub:"Hub de cues",unknown:"Desconegut",selected:"seleccionades",queue_one:"cua",agent_one:"agent",refresh:"Actualitza"},
eu:{loading:"Kargatzen\u2026",today:"Gaur",subtitle:"Egiaztatu agenteen presentzia-egoera eta zein ilaratan dauden.",queues:"Ilarak",agents:"Agenteak",you:"Zu",unknown:"Ezezaguna",refresh:"Freskatu"},
gl:{loading:"Cargando\u2026",today:"Hoxe",subtitle:"Verifique o estado de presenza dos axentes e a que filas pertencen.",queues:"Filas",agents:"Axentes",you:"Ti",unknown:"Desco\u00f1ecido",refresh:"Actualizar"},
// Nordic
da:{loading:"Indl\u00e6ser\u2026",timeInStatus:"tid i status",today:"I dag",timeline:"Tidslinje",noActivity:"Ingen aktivitet denne dag",failedToLoad:"Kunne ikke indl\u00e6se:",subtitle:"Kontroll\u00e9r agenternes tilstedev\u00e6relsesstatus og hvilke k\u00f8er de tilh\u00f8rer.",queues:"K\u00f8er",agents:"Agenter",searchQueues:"S\u00f8g k\u00f8er\u2026",searchAgents:"S\u00f8g agenter\u2026",noQueuesMatch:"Ingen k\u00f8er matcher",noQueuesFound:"Ingen k\u00f8er fundet",noAgentsMatch:"Ingen agenter matcher",noAgentsFound:"Ingen agenter fundet",agentsInSelected:"Agenter i valgte k\u00f8er",noAgentsInSelected:"Ingen agenter i valgte k\u00f8er",you:"Dig",presenceHistory:"Tilstedev\u00e6relseshistorik",queueHub:"K\u00f8-hub",pickDate:"V\u00e6lg dato",unknown:"Ukendt",selected:"valgte",queue_one:"k\u00f8",agent_one:"agent",refresh:"Opdater"},
sv:{loading:"L\u00e4ser in\u2026",timeInStatus:"tid i status",today:"Idag",timeline:"Tidslinje",noActivity:"Ingen aktivitet denna dag",failedToLoad:"Det gick inte att l\u00e4sa in:",subtitle:"Kontrollera agenternas n\u00e4rvarostatus och vilka k\u00f6er de tillh\u00f6r.",queues:"K\u00f6er",agents:"Agenter",searchQueues:"S\u00f6k k\u00f6er\u2026",searchAgents:"S\u00f6k agenter\u2026",noQueuesMatch:"Inga k\u00f6er matchar",noQueuesFound:"Inga k\u00f6er hittades",noAgentsMatch:"Inga agenter matchar",noAgentsFound:"Inga agenter hittades",agentsInSelected:"Agenter i valda k\u00f6er",noAgentsInSelected:"Inga agenter i valda k\u00f6er",you:"Du",presenceHistory:"N\u00e4rvarohistorik",queueHub:"K\u00f6-hubb",pickDate:"V\u00e4lj datum",unknown:"Ok\u00e4nd",selected:"valda",queue_one:"k\u00f6",agent_one:"agent",refresh:"Uppdatera"},
nb:{loading:"Laster\u2026",timeInStatus:"tid i status",today:"I dag",timeline:"Tidslinje",noActivity:"Ingen aktivitet denne dagen",failedToLoad:"Kunne ikke laste:",subtitle:"Kontroller agentenes tilstedev\u00e6relsesstatus og hvilke k\u00f8er de tilh\u00f8rer.",queues:"K\u00f8er",agents:"Agenter",searchQueues:"S\u00f8k k\u00f8er\u2026",searchAgents:"S\u00f8k agenter\u2026",noQueuesMatch:"Ingen k\u00f8er samsvarer",noQueuesFound:"Ingen k\u00f8er funnet",noAgentsMatch:"Ingen agenter samsvarer",noAgentsFound:"Ingen agenter funnet",agentsInSelected:"Agenter i valgte k\u00f8er",noAgentsInSelected:"Ingen agenter i valgte k\u00f8er",you:"Du",presenceHistory:"Tilstedev\u00e6relseshistorikk",queueHub:"K\u00f8-hub",pickDate:"Velg dato",unknown:"Ukjent",selected:"valgte",queue_one:"k\u00f8",agent_one:"agent",refresh:"Oppdater"},
fi:{loading:"Ladataan\u2026",timeInStatus:"aika tilassa",today:"T\u00e4n\u00e4\u00e4n",timeline:"Aikajana",noActivity:"Ei toimintaa t\u00e4n\u00e4 p\u00e4iv\u00e4n\u00e4",failedToLoad:"Lataus ep\u00e4onnistui:",subtitle:"Tarkista agenttien l\u00e4sn\u00e4olotila ja mihin jonoihin he kuuluvat.",queues:"Jonot",agents:"Agentit",searchQueues:"Hae jonoja\u2026",searchAgents:"Hae agentteja\u2026",noQueuesMatch:"Yksik\u00e4\u00e4n jono ei vastaa hakua",noQueuesFound:"Jonoja ei l\u00f6ytynyt",noAgentsMatch:"Yksik\u00e4\u00e4n agentti ei vastaa hakua",noAgentsFound:"Agentteja ei l\u00f6ytynyt",agentsInSelected:"Agentit valituissa jonoissa",noAgentsInSelected:"Ei agentteja valituissa jonoissa",you:"Sin\u00e4",presenceHistory:"L\u00e4sn\u00e4olohistoria",queueHub:"Jonokeskus",pickDate:"Valitse p\u00e4iv\u00e4",unknown:"Tuntematon",selected:"valittu",queue_one:"jono",agent_one:"agentti",refresh:"P\u00e4ivit\u00e4"},
// Eastern European
pl:{loading:"\u0141adowanie\u2026",timeInStatus:"czas w statusie",today:"Dzisiaj",timeline:"O\u015b czasu",noActivity:"Brak aktywno\u015bci w tym dniu",failedToLoad:"Nie uda\u0142o si\u0119 za\u0142adowa\u0107:",subtitle:"Sprawd\u017a status obecno\u015bci agent\u00f3w i do jakich kolejek nale\u017c\u0105.",queues:"Kolejki",agents:"Agenci",searchQueues:"Szukaj kolejek\u2026",searchAgents:"Szukaj agent\u00f3w\u2026",noQueuesMatch:"Brak pasuj\u0105cych kolejek",noQueuesFound:"Nie znaleziono kolejek",noAgentsMatch:"Brak pasuj\u0105cych agent\u00f3w",noAgentsFound:"Nie znaleziono agent\u00f3w",agentsInSelected:"Agenci w wybranych kolejkach",noAgentsInSelected:"Brak agent\u00f3w w wybranych kolejkach",you:"Ty",presenceHistory:"Historia obecno\u015bci",queueHub:"Centrum kolejek",pickDate:"Wybierz dat\u0119",unknown:"Nieznany",selected:"wybrane",queue_one:"kolejka",agent_one:"agent",refresh:"Od\u015bwie\u017c"},
cs:{loading:"Na\u010d\u00edt\u00e1n\u00ed\u2026",timeInStatus:"\u010das ve stavu",today:"Dnes",timeline:"\u010casov\u00e1 osa",noActivity:"\u017d\u00e1dn\u00e1 aktivita v tento den",failedToLoad:"Nepoda\u0159ilo se na\u010d\u00edst:",subtitle:"Zkontrolujte stav p\u0159\u00edtomnosti agent\u016f a do jak\u00fdch front pat\u0159\u00ed.",queues:"Fronty",agents:"Agenti",searchQueues:"Hledat fronty\u2026",searchAgents:"Hledat agenty\u2026",noQueuesMatch:"\u017d\u00e1dn\u00e1 fronta neodpov\u00edd\u00e1",noQueuesFound:"\u017d\u00e1dn\u00e9 fronty nenalezeny",noAgentsMatch:"\u017d\u00e1dn\u00fd agent neodpov\u00edd\u00e1",noAgentsFound:"\u017d\u00e1dn\u00ed agenti nenalezeni",agentsInSelected:"Agenti ve vybran\u00fdch front\u00e1ch",noAgentsInSelected:"\u017d\u00e1dn\u00ed agenti ve vybran\u00fdch front\u00e1ch",you:"Vy",presenceHistory:"Historie p\u0159\u00edtomnosti",queueHub:"Centrum front",pickDate:"Vybrat datum",unknown:"Nezn\u00e1m\u00fd",selected:"vybr\u00e1no",queue_one:"fronta",agent_one:"agent",refresh:"Obnovit"},
hu:{loading:"Bet\u00f6lt\u00e9s\u2026",timeInStatus:"id\u0151 az \u00e1llapotban",today:"Ma",timeline:"Id\u0151vonal",noActivity:"Nincs tev\u00e9kenys\u00e9g ezen a napon",failedToLoad:"Bet\u00f6lt\u00e9s sikertelen:",subtitle:"Ellen\u0151rizze az \u00fcgyn\u00f6k\u00f6k jelenl\u00e9ti \u00e1llapot\u00e1t \u00e9s hogy mely sorokhoz tartoznak.",queues:"Sorok",agents:"\u00dcgyn\u00f6k\u00f6k",searchQueues:"Sorok keres\u00e9se\u2026",searchAgents:"\u00dcgyn\u00f6k\u00f6k keres\u00e9se\u2026",noQueuesMatch:"Nincs egyez\u0151 sor",noQueuesFound:"Nem tal\u00e1lhat\u00f3 sor",noAgentsMatch:"Nincs egyez\u0151 \u00fcgyn\u00f6k",noAgentsFound:"Nem tal\u00e1lhat\u00f3 \u00fcgyn\u00f6k",agentsInSelected:"\u00dcgyn\u00f6k\u00f6k a kiv\u00e1lasztott sorokban",noAgentsInSelected:"Nincs \u00fcgyn\u00f6k a kiv\u00e1lasztott sorokban",you:"\u00d6n",presenceHistory:"Jelenl\u00e9ti el\u0151zm\u00e9nyek",queueHub:"Sor-k\u00f6zpont",pickDate:"D\u00e1tum v\u00e1laszt\u00e1sa",unknown:"Ismeretlen",selected:"kiv\u00e1lasztva",queue_one:"sor",agent_one:"\u00fcgyn\u00f6k",refresh:"Friss\u00edt\u00e9s"},
ro:{loading:"\u00cencarc\u0103\u2026",timeInStatus:"timp \u00een stare",today:"Ast\u0103zi",timeline:"Cronologie",noActivity:"Nicio activitate \u00een aceast\u0103 zi",failedToLoad:"\u00cencarcare e\u015fuat\u0103:",subtitle:"Verifica\u021bi starea de prezen\u021b\u0103 a agen\u021bilor \u0219i la ce cozi apar\u021bin.",queues:"Cozi",agents:"Agen\u021bi",searchQueues:"C\u0103uta\u021bi cozi\u2026",searchAgents:"C\u0103uta\u021bi agen\u021bi\u2026",noQueuesMatch:"Nicio coad\u0103 nu corespunde",noQueuesFound:"Nicio coad\u0103 g\u0103sit\u0103",noAgentsMatch:"Niciun agent nu corespunde",noAgentsFound:"Niciun agent g\u0103sit",agentsInSelected:"Agen\u021bi \u00een cozile selectate",noAgentsInSelected:"Niciun agent \u00een cozile selectate",you:"Tu",presenceHistory:"Istoric prezen\u021b\u0103",queueHub:"Hub cozi",pickDate:"Alege data",unknown:"Necunoscut",selected:"selectate",queue_one:"coad\u0103",agent_one:"agent",refresh:"Actualizeaz\u0103"},
ru:{loading:"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430\u2026",timeInStatus:"\u0432\u0440\u0435\u043c\u044f \u0432 \u0441\u0442\u0430\u0442\u0443\u0441\u0435",today:"\u0421\u0435\u0433\u043e\u0434\u043d\u044f",timeline:"\u0425\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0438\u044f",noActivity:"\u041d\u0435\u0442 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0438 \u0432 \u044d\u0442\u043e\u0442 \u0434\u0435\u043d\u044c",failedToLoad:"\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c:",subtitle:"\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0439\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044f \u0430\u0433\u0435\u043d\u0442\u043e\u0432 \u0438 \u043a \u043a\u0430\u043a\u0438\u043c \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u043c \u043e\u043d\u0438 \u043e\u0442\u043d\u043e\u0441\u044f\u0442\u0441\u044f.",queues:"\u041e\u0447\u0435\u0440\u0435\u0434\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u044b",searchQueues:"\u041f\u043e\u0438\u0441\u043a \u043e\u0447\u0435\u0440\u0435\u0434\u0435\u0439\u2026",searchAgents:"\u041f\u043e\u0438\u0441\u043a \u0430\u0433\u0435\u043d\u0442\u043e\u0432\u2026",noQueuesMatch:"\u041e\u0447\u0435\u0440\u0435\u0434\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b",noQueuesFound:"\u041e\u0447\u0435\u0440\u0435\u0434\u0438 \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0442",noAgentsMatch:"\u0410\u0433\u0435\u043d\u0442\u044b \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b",noAgentsFound:"\u0410\u0433\u0435\u043d\u0442\u044b \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0442",agentsInSelected:"\u0410\u0433\u0435\u043d\u0442\u044b \u0432 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u0445",noAgentsInSelected:"\u041d\u0435\u0442 \u0430\u0433\u0435\u043d\u0442\u043e\u0432 \u0432 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u0445",you:"\u0412\u044b",presenceHistory:"\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044f",queueHub:"\u0426\u0435\u043d\u0442\u0440 \u043e\u0447\u0435\u0440\u0435\u0434\u0435\u0439",pickDate:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0434\u0430\u0442\u0443",unknown:"\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",selected:"\u0432\u044b\u0431\u0440\u0430\u043d\u043e",queue_one:"\u043e\u0447\u0435\u0440\u0435\u0434\u044c",agent_one:"\u0430\u0433\u0435\u043d\u0442",refresh:"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c"},
tr:{loading:"Y\u00fckleniyor\u2026",timeInStatus:"durumdaki s\u00fcre",today:"Bug\u00fcn",timeline:"Zaman \u00e7izelgesi",noActivity:"Bu g\u00fcn etkinlik yok",failedToLoad:"Y\u00fcklenemedi:",subtitle:"Temsilcilerin durum bilgisini ve hangi kuyruklara ait olduklar\u0131n\u0131 kontrol edin.",queues:"Kuyruklar",agents:"Temsilciler",searchQueues:"Kuyruk ara\u2026",searchAgents:"Temsilci ara\u2026",noQueuesMatch:"E\u015fle\u015fen kuyruk yok",noQueuesFound:"Kuyruk bulunamad\u0131",noAgentsMatch:"E\u015fle\u015fen temsilci yok",noAgentsFound:"Temsilci bulunamad\u0131",agentsInSelected:"Se\u00e7ili kuyruklardaki temsilciler",noAgentsInSelected:"Se\u00e7ili kuyruklarda temsilci yok",you:"Siz",presenceHistory:"Durum ge\u00e7mi\u015fi",queueHub:"Kuyruk merkezi",pickDate:"Tarih se\u00e7in",unknown:"Bilinmiyor",selected:"se\u00e7ili",queue_one:"kuyruk",agent_one:"temsilci",refresh:"Yenile"},
// Baltics & Balkans
hr:{loading:"U\u010ditavanje\u2026",timeInStatus:"vrijeme u statusu",today:"Danas",timeline:"Vremenska crta",noActivity:"Nema aktivnosti ovog dana",failedToLoad:"Neuspjelo u\u010ditavanje:",subtitle:"Provjerite status prisutnosti agenata i kojim redovima pripadaju.",queues:"Redovi",agents:"Agenti",you:"Vi",presenceHistory:"Povijest prisutnosti",queueHub:"Sredi\u0161te redova",unknown:"Nepoznato",selected:"odabrano",queue_one:"red",agent_one:"agent",refresh:"Osvje\u017ei"},
sk:{loading:"Na\u010d\u00edtava sa\u2026",timeInStatus:"\u010das v stave",today:"Dnes",timeline:"\u010casov\u00e1 os",subtitle:"Skontrolujte stav pr\u00edtomnosti agentov a do ak\u00fdch frontov patria.",queues:"Fronty",agents:"Agenti",you:"Vy",presenceHistory:"Hist\u00f3ria pr\u00edtomnosti",queueHub:"Centrum frontov",unknown:"Nezn\u00e1my",selected:"vybran\u00e9",queue_one:"front",agent_one:"agent",refresh:"Obnovi\u0165"},
sl:{loading:"Nalaganje\u2026",timeInStatus:"\u010das v stanju",today:"Danes",subtitle:"Preverite stanje prisotnosti agentov in katerim vrstam pripadajo.",queues:"Vrste",agents:"Agenti",you:"Vi",presenceHistory:"Zgodovina prisotnosti",queueHub:"Sredi\u0161\u010de vrst",unknown:"Neznano",selected:"izbrano",queue_one:"vrsta",agent_one:"agent",refresh:"Osve\u017ei"},
et:{loading:"Laadimine\u2026",today:"T\u00e4na",subtitle:"Kontrollige agentide kohaloleku olekut ja millistes j\u00e4rjekordades nad on.",queues:"J\u00e4rjekorrad",agents:"Agendid",you:"Sina",unknown:"Tundmatu",refresh:"V\u00e4rskenda"},
lv:{loading:"Iel\u0101d\u0113\u2026",today:"\u0160odien",subtitle:"P\u0101rbaudiet a\u0123entu kl\u0101tb\u016btnes statusu un kur\u0101m rind\u0101m vi\u0146i pieder.",queues:"Rindas",agents:"A\u0123enti",you:"J\u016bs",unknown:"Nezin\u0101ms",refresh:"Atsvaidzin\u0101t"},
lt:{loading:"Kraunama\u2026",today:"\u0160iandien",subtitle:"Patikrinkite agent\u0173 buvimo b\u016bsen\u0105 ir kurioms eil\u0117ms jie priklauso.",queues:"Eil\u0117s",agents:"Agentai",you:"J\u016bs",unknown:"Ne\u017einoma",refresh:"Atnaujinti"},
bg:{loading:"\u0417\u0430\u0440\u0435\u0436\u0434\u0430\u043d\u0435\u2026",today:"\u0414\u043d\u0435\u0441",subtitle:"\u041f\u0440\u043e\u0432\u0435\u0440\u0435\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u043d\u0430 \u043f\u0440\u0438\u0441\u044a\u0441\u0442\u0432\u0438\u0435 \u043d\u0430 \u0430\u0433\u0435\u043d\u0442\u0438\u0442\u0435 \u0438 \u0432 \u043a\u043e\u0438 \u043e\u043f\u0430\u0448\u043a\u0438 \u0443\u0447\u0430\u0441\u0442\u0432\u0430\u0442.",queues:"\u041e\u043f\u0430\u0448\u043a\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u0438",you:"\u0412\u0438\u0435",unknown:"\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",refresh:"\u041e\u043f\u0440\u0435\u0441\u043d\u0438"},
sr:{loading:"\u0423\u0447\u0438\u0442\u0430\u0432\u0430\u045a\u0435\u2026",today:"\u0414\u0430\u043d\u0430\u0441",subtitle:"\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u0438\u0441\u0443\u0441\u0442\u0432\u0430 \u0430\u0433\u0435\u043d\u0430\u0442\u0430 \u0438 \u043a\u043e\u0458\u0438\u043c \u0440\u0435\u0434\u043e\u0432\u0438\u043c\u0430 \u043f\u0440\u0438\u043f\u0430\u0434\u0430\u0458\u0443.",queues:"\u0420\u0435\u0434\u043e\u0432\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u0438",you:"\u0412\u0438",unknown:"\u041d\u0435\u043f\u043e\u0437\u043d\u0430\u0442\u043e",refresh:"\u041e\u0441\u0432\u0435\u0436\u0438"},
uk:{loading:"\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f\u2026",timeInStatus:"\u0447\u0430\u0441 \u0443 \u0441\u0442\u0430\u0442\u0443\u0441\u0456",today:"\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456",subtitle:"\u041f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u0438\u0441\u0443\u0442\u043d\u043e\u0441\u0442\u0456 \u0430\u0433\u0435\u043d\u0442\u0456\u0432 \u0442\u0430 \u0434\u043e \u044f\u043a\u0438\u0445 \u0447\u0435\u0440\u0433 \u0432\u043e\u043d\u0438 \u043d\u0430\u043b\u0435\u0436\u0430\u0442\u044c.",queues:"\u0427\u0435\u0440\u0433\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u0438",you:"\u0412\u0438",presenceHistory:"\u0406\u0441\u0442\u043e\u0440\u0456\u044f \u043f\u0440\u0438\u0441\u0443\u0442\u043d\u043e\u0441\u0442\u0456",queueHub:"\u0426\u0435\u043d\u0442\u0440 \u0447\u0435\u0440\u0433",unknown:"\u041d\u0435\u0432\u0456\u0434\u043e\u043c\u043e",selected:"\u0432\u0438\u0431\u0440\u0430\u043d\u043e",queue_one:"\u0447\u0435\u0440\u0433\u0430",agent_one:"\u0430\u0433\u0435\u043d\u0442",refresh:"\u041e\u043d\u043e\u0432\u0438\u0442\u0438"},
el:{loading:"\u03a6\u03cc\u03c1\u03c4\u03c9\u03c3\u03b7\u2026",timeInStatus:"\u03c7\u03c1\u03cc\u03bd\u03bf\u03c2 \u03c3\u03b5 \u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7",today:"\u03a3\u03ae\u03bc\u03b5\u03c1\u03b1",subtitle:"\u0395\u03bb\u03ad\u03b3\u03be\u03c4\u03b5 \u03c4\u03b7\u03bd \u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7 \u03c0\u03b1\u03c1\u03bf\u03c5\u03c3\u03af\u03b1\u03c2 \u03c4\u03c9\u03bd \u03c0\u03c1\u03b1\u03ba\u03c4\u03cc\u03c1\u03c9\u03bd \u03ba\u03b1\u03b9 \u03c3\u03b5 \u03c0\u03bf\u03b9\u03b5\u03c2 \u03bf\u03c5\u03c1\u03ad\u03c2 \u03b1\u03bd\u03ae\u03ba\u03bf\u03c5\u03bd.",queues:"\u039f\u03c5\u03c1\u03ad\u03c2",agents:"\u03a0\u03c1\u03ac\u03ba\u03c4\u03bf\u03c1\u03b5\u03c2",you:"\u0395\u03c3\u03b5\u03af\u03c2",unknown:"\u0386\u03b3\u03bd\u03c9\u03c3\u03c4\u03bf",refresh:"\u0391\u03bd\u03b1\u03bd\u03ad\u03c9\u03c3\u03b7"},
kk:{loading:"\u0416\u04af\u043a\u0442\u0435\u043b\u0443\u0434\u0435\u2026",today:"\u0411\u04af\u0433\u0456\u043d",subtitle:"\u0410\u0433\u0435\u043d\u0442\u0442\u0435\u0440\u0434\u0456\u04a3 \u049b\u0430\u0442\u044b\u0441\u0443 \u043c\u04d9\u0440\u0442\u0435\u0431\u0435\u0441\u0456\u043d \u0436\u04d9\u043d\u0435 \u043e\u043b\u0430\u0440 \u049b\u0430\u043d\u0434\u0430\u0439 \u043a\u0435\u0437\u0435\u043a\u0442\u0435\u0440\u0433\u0435 \u0436\u0430\u0442\u0430\u0442\u044b\u043d\u044b\u043d \u0442\u0435\u043a\u0441\u0435\u0440\u0456\u04a3\u0456\u0437.",queues:"\u041a\u0435\u0437\u0435\u043a\u0442\u0435\u0440",agents:"\u0410\u0433\u0435\u043d\u0442\u0442\u0435\u0440",you:"\u0421\u0456\u0437",unknown:"\u0411\u0435\u043b\u0433\u0456\u0441\u0456\u0437",refresh:"\u0416\u0430\u04a3\u0430\u0440\u0442\u0443"},
// Asian
ja:{loading:"\u8aad\u307f\u8fbc\u307f\u4e2d\u2026",timeInStatus:"\u30b9\u30c6\u30fc\u30bf\u30b9\u306e\u7d4c\u904e\u6642\u9593",today:"\u4eca\u65e5",timeline:"\u30bf\u30a4\u30e0\u30e9\u30a4\u30f3",noActivity:"\u3053\u306e\u65e5\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u306f\u3042\u308a\u307e\u305b\u3093",failedToLoad:"\u8aad\u307f\u8fbc\u307f\u5931\u6557:",subtitle:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u30d7\u30ec\u30bc\u30f3\u30b9\u72b6\u614b\u3068\u6240\u5c5e\u30ad\u30e5\u30fc\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002",queues:"\u30ad\u30e5\u30fc",agents:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",searchQueues:"\u30ad\u30e5\u30fc\u3092\u691c\u7d22\u2026",searchAgents:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u691c\u7d22\u2026",noQueuesMatch:"\u4e00\u81f4\u3059\u308b\u30ad\u30e5\u30fc\u304c\u3042\u308a\u307e\u305b\u3093",noQueuesFound:"\u30ad\u30e5\u30fc\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093",noAgentsMatch:"\u4e00\u81f4\u3059\u308b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u3044\u307e\u305b\u3093",noAgentsFound:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093",agentsInSelected:"\u9078\u629e\u3057\u305f\u30ad\u30e5\u30fc\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",noAgentsInSelected:"\u9078\u629e\u3057\u305f\u30ad\u30e5\u30fc\u306b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u3044\u307e\u305b\u3093",you:"\u81ea\u5206",presenceHistory:"\u30d7\u30ec\u30bc\u30f3\u30b9\u5c65\u6b74",queueHub:"\u30ad\u30e5\u30fc\u30cf\u30d6",pickDate:"\u65e5\u4ed8\u3092\u9078\u629e",unknown:"\u4e0d\u660e",selected:"\u9078\u629e\u6e08\u307f",queue_one:"\u30ad\u30e5\u30fc",agent_one:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",refresh:"\u66f4\u65b0"},
ko:{loading:"\uB85C\uB4DC \uC911\u2026",timeInStatus:"\uC0C1\uD0DC \uC9C0\uC18D \uC2DC\uAC04",today:"\uC624\uB298",timeline:"\uD0C0\uC784\uB77C\uC778",noActivity:"\uC774 \uB0A0\uC758 \uD65C\uB3D9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",failedToLoad:"\uB85C\uB4DC \uC2E4\uD328:",subtitle:"\uC5D0\uC774\uC804\uD2B8\uC758 \uD504\uB808\uC804\uC2A4 \uC0C1\uD0DC\uC640 \uC18C\uC18D \uB300\uAE30\uC5F4\uC744 \uD655\uC778\uD558\uC138\uC694.",queues:"\uB300\uAE30\uC5F4",agents:"\uC5D0\uC774\uC804\uD2B8",searchQueues:"\uB300\uAE30\uC5F4 \uAC80\uC0C9\u2026",searchAgents:"\uC5D0\uC774\uC804\uD2B8 \uAC80\uC0C9\u2026",noQueuesMatch:"\uC77C\uCE58\uD558\uB294 \uB300\uAE30\uC5F4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",noQueuesFound:"\uB300\uAE30\uC5F4\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4",noAgentsMatch:"\uC77C\uCE58\uD558\uB294 \uC5D0\uC774\uC804\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",noAgentsFound:"\uC5D0\uC774\uC804\uD2B8\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4",agentsInSelected:"\uC120\uD0DD\uD55C \uB300\uAE30\uC5F4\uC758 \uC5D0\uC774\uC804\uD2B8",noAgentsInSelected:"\uC120\uD0DD\uD55C \uB300\uAE30\uC5F4\uC5D0 \uC5D0\uC774\uC804\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",you:"\uB098",presenceHistory:"\uD504\uB808\uC804\uC2A4 \uAE30\uB85D",queueHub:"\uB300\uAE30\uC5F4 \uD5C8\uBE0C",pickDate:"\uB0A0\uC9DC \uC120\uD0DD",unknown:"\uC54C \uC218 \uC5C6\uC74C",selected:"\uC120\uD0DD\uB428",queue_one:"\uB300\uAE30\uC5F4",agent_one:"\uC5D0\uC774\uC804\uD2B8",refresh:"\uC0C8\uB85C \uACE0\uCE68"},
"zh-CN":{loading:"\u52A0\u8F7D\u4E2D\u2026",timeInStatus:"\u72B6\u6001\u6301\u7EED\u65F6\u95F4",today:"\u4ECA\u5929",timeline:"\u65F6\u95F4\u7EBF",noActivity:"\u5F53\u5929\u65E0\u6D3B\u52A8",failedToLoad:"\u52A0\u8F7D\u5931\u8D25\uFF1A",subtitle:"\u67E5\u770B\u5EA7\u5E2D\u7684\u5728\u7EBF\u72B6\u6001\u53CA\u5176\u6240\u5C5E\u961F\u5217\u3002",queues:"\u961F\u5217",agents:"\u5EA7\u5E2D",searchQueues:"\u641C\u7D22\u961F\u5217\u2026",searchAgents:"\u641C\u7D22\u5EA7\u5E2D\u2026",noQueuesMatch:"\u6CA1\u6709\u5339\u914D\u7684\u961F\u5217",noQueuesFound:"\u672A\u627E\u5230\u961F\u5217",noAgentsMatch:"\u6CA1\u6709\u5339\u914D\u7684\u5EA7\u5E2D",noAgentsFound:"\u672A\u627E\u5230\u5EA7\u5E2D",agentsInSelected:"\u5DF2\u9009\u961F\u5217\u4E2D\u7684\u5EA7\u5E2D",noAgentsInSelected:"\u5DF2\u9009\u961F\u5217\u4E2D\u6CA1\u6709\u5EA7\u5E2D",you:"\u6211",presenceHistory:"\u5728\u7EBF\u5386\u53F2",queueHub:"\u961F\u5217\u4E2D\u5FC3",pickDate:"\u9009\u62E9\u65E5\u671F",unknown:"\u672A\u77E5",selected:"\u5DF2\u9009",queue_one:"\u961F\u5217",agent_one:"\u5EA7\u5E2D",refresh:"\u5237\u65B0"},
"zh-TW":{loading:"\u8F09\u5165\u4E2D\u2026",timeInStatus:"\u72C0\u614B\u6301\u7E8C\u6642\u9593",today:"\u4ECA\u5929",timeline:"\u6642\u9593\u8EF8",noActivity:"\u7576\u5929\u7121\u6D3B\u52D5",failedToLoad:"\u8F09\u5165\u5931\u6557\uFF1A",subtitle:"\u67E5\u770B\u5C08\u54E1\u7684\u5728\u7DDA\u72C0\u614B\u53CA\u5176\u6240\u5C6C\u4F47\u5217\u3002",queues:"\u4F47\u5217",agents:"\u5C08\u54E1",searchQueues:"\u641C\u5C0B\u4F47\u5217\u2026",searchAgents:"\u641C\u5C0B\u5C08\u54E1\u2026",noQueuesMatch:"\u6C92\u6709\u7B26\u5408\u7684\u4F47\u5217",noQueuesFound:"\u627E\u4E0D\u5230\u4F47\u5217",noAgentsMatch:"\u6C92\u6709\u7B26\u5408\u7684\u5C08\u54E1",noAgentsFound:"\u627E\u4E0D\u5230\u5C08\u54E1",agentsInSelected:"\u5DF2\u9078\u4F47\u5217\u4E2D\u7684\u5C08\u54E1",noAgentsInSelected:"\u5DF2\u9078\u4F47\u5217\u4E2D\u6C92\u6709\u5C08\u54E1",you:"\u6211",presenceHistory:"\u5728\u7DDA\u6B77\u53F2",queueHub:"\u4F47\u5217\u4E2D\u5FC3",pickDate:"\u9078\u64C7\u65E5\u671F",unknown:"\u672A\u77E5",selected:"\u5DF2\u9078",queue_one:"\u4F47\u5217",agent_one:"\u5C08\u54E1",refresh:"\u91CD\u65B0\u6574\u7406"},
"zh-HK":{loading:"\u8F09\u5165\u4E2D\u2026",today:"\u4ECA\u65E5",subtitle:"\u67E5\u770B\u5C08\u54E1\u7684\u5728\u7DDA\u72C0\u614B\u53CA\u5176\u6240\u5C6C\u4F47\u5217\u3002",queues:"\u4F47\u5217",agents:"\u5C08\u54E1",you:"\u6211",unknown:"\u672A\u77E5",refresh:"\u91CD\u65B0\u6574\u7406"},
// Middle Eastern
ar:{loading:"\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644\u2026",timeInStatus:"\u0627\u0644\u0648\u0642\u062A \u0641\u064A \u0627\u0644\u062D\u0627\u0644\u0629",today:"\u0627\u0644\u064A\u0648\u0645",timeline:"\u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064A",noActivity:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0646\u0634\u0627\u0637 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645",failedToLoad:"\u0641\u0634\u0644 \u0627\u0644\u062A\u062D\u0645\u064A\u0644:",subtitle:"\u062A\u062D\u0642\u0642 \u0645\u0646 \u062D\u0627\u0644\u0629 \u062A\u0648\u0627\u062C\u062F \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0648\u0627\u0644\u0637\u0648\u0627\u0628\u064A\u0631 \u0627\u0644\u062A\u064A \u064A\u0646\u062A\u0645\u0648\u0646 \u0625\u0644\u064A\u0647\u0627.",queues:"\u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631",agents:"\u0627\u0644\u0648\u0643\u0644\u0627\u0621",searchQueues:"\u0628\u062D\u062B \u0641\u064A \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631\u2026",searchAgents:"\u0628\u062D\u062B \u0639\u0646 \u0648\u0643\u0644\u0627\u0621\u2026",noQueuesMatch:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0648\u0627\u0626\u0645 \u0645\u0637\u0627\u0628\u0642\u0629",noQueuesFound:"\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0642\u0648\u0627\u0626\u0645",noAgentsMatch:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0643\u0644\u0627\u0621 \u0645\u0637\u0627\u0628\u0642\u0648\u0646",noAgentsFound:"\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0648\u0643\u0644\u0627\u0621",agentsInSelected:"\u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0641\u064A \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u062D\u062F\u062F\u0629",noAgentsInSelected:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0643\u0644\u0627\u0621 \u0641\u064A \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u062D\u062F\u062F\u0629",you:"\u0623\u0646\u062A",presenceHistory:"\u0633\u062C\u0644 \u0627\u0644\u062A\u0648\u0627\u062C\u062F",queueHub:"\u0645\u0631\u0643\u0632 \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631",pickDate:"\u0627\u062E\u062A\u0631 \u062A\u0627\u0631\u064A\u062E\u0627\u064B",unknown:"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641",selected:"\u0645\u062D\u062F\u062F",queue_one:"\u0642\u0627\u0626\u0645\u0629",agent_one:"\u0648\u0643\u064A\u0644",refresh:"\u062A\u062D\u062F\u064A\u062B"},
he:{loading:"\u05D8\u05D5\u05E2\u05DF\u2026",timeInStatus:"\u05D6\u05DE\u05DF \u05D1\u05DE\u05E6\u05D1",today:"\u05D4\u05D9\u05D5\u05DD",timeline:"\u05E6\u05D9\u05E8 \u05D6\u05DE\u05DF",noActivity:"\u05D0\u05D9\u05DF \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA \u05D1\u05D9\u05D5\u05DD \u05D6\u05D4",failedToLoad:"\u05D8\u05E2\u05D9\u05E0\u05D4 \u05E0\u05DB\u05E9\u05DC\u05D4:",subtitle:"\u05D1\u05D3\u05D5\u05E7 \u05D0\u05EA \u05DE\u05E6\u05D1 \u05D4\u05E0\u05D5\u05DB\u05D7\u05D5\u05EA \u05E9\u05DC \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD \u05D5\u05DC\u05D0\u05D9\u05DC\u05D5 \u05EA\u05D5\u05E8\u05D9\u05DD \u05D4\u05DD \u05E9\u05D9\u05D9\u05DB\u05D9\u05DD.",queues:"\u05EA\u05D5\u05E8\u05D9\u05DD",agents:"\u05E0\u05E6\u05D9\u05D2\u05D9\u05DD",you:"\u05D0\u05EA\u05D4",presenceHistory:"\u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05E0\u05D5\u05DB\u05D7\u05D5\u05EA",queueHub:"\u05DE\u05E8\u05DB\u05D6 \u05EA\u05D5\u05E8\u05D9\u05DD",unknown:"\u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2",selected:"\u05E0\u05D1\u05D7\u05E8",queue_one:"\u05EA\u05D5\u05E8",agent_one:"\u05E0\u05E6\u05D9\u05D2",refresh:"\u05E8\u05E2\u05E0\u05DF"},
// South & Southeast Asian
th:{loading:"\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u2026",timeInStatus:"\u0E40\u0E27\u0E25\u0E32\u0E43\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E30",today:"\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49",subtitle:"\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19\u0E41\u0E25\u0E30\u0E04\u0E34\u0E27\u0E17\u0E35\u0E48\u0E1E\u0E27\u0E01\u0E40\u0E02\u0E32\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14\u0E2D\u0E22\u0E39\u0E48.",queues:"\u0E04\u0E34\u0E27",agents:"\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19",you:"\u0E04\u0E38\u0E13",presenceHistory:"\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E2A\u0E16\u0E32\u0E19\u0E30",queueHub:"\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E04\u0E34\u0E27",unknown:"\u0E44\u0E21\u0E48\u0E17\u0E23\u0E32\u0E1A",selected:"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E25\u0E49\u0E27",queue_one:"\u0E04\u0E34\u0E27",agent_one:"\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19",refresh:"\u0E23\u0E35\u0E40\u0E1F\u0E23\u0E0A"},
vi:{loading:"\u0110ang t\u1EA3i\u2026",timeInStatus:"th\u1EDDi gian trong tr\u1EA1ng th\u00E1i",today:"H\u00F4m nay",timeline:"D\u00F2ng th\u1EDDi gian",noActivity:"Kh\u00F4ng c\u00F3 ho\u1EA1t \u0111\u1ED9ng trong ng\u00E0y n\u00E0y",failedToLoad:"T\u1EA3i th\u1EA5t b\u1EA1i:",subtitle:"Ki\u1EC3m tra tr\u1EA1ng th\u00E1i hi\u1EC7n di\u1EC7n c\u1EE7a \u0111\u1EA1i l\u00FD v\u00E0 h\u00E0ng \u0111\u1EE3i h\u1ECD tham gia.",queues:"H\u00E0ng \u0111\u1EE3i",agents:"\u0110\u1EA1i l\u00FD",searchQueues:"T\u00ECm h\u00E0ng \u0111\u1EE3i\u2026",searchAgents:"T\u00ECm \u0111\u1EA1i l\u00FD\u2026",noQueuesMatch:"Kh\u00F4ng c\u00F3 h\u00E0ng \u0111\u1EE3i ph\u00F9 h\u1EE3p",noQueuesFound:"Kh\u00F4ng t\u00ECm th\u1EA5y h\u00E0ng \u0111\u1EE3i",noAgentsMatch:"Kh\u00F4ng c\u00F3 \u0111\u1EA1i l\u00FD ph\u00F9 h\u1EE3p",noAgentsFound:"Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u1EA1i l\u00FD",agentsInSelected:"\u0110\u1EA1i l\u00FD trong h\u00E0ng \u0111\u1EE3i \u0111\u00E3 ch\u1ECDn",noAgentsInSelected:"Kh\u00F4ng c\u00F3 \u0111\u1EA1i l\u00FD trong h\u00E0ng \u0111\u1EE3i \u0111\u00E3 ch\u1ECDn",you:"B\u1EA1n",presenceHistory:"L\u1ECBch s\u1EED hi\u1EC7n di\u1EC7n",queueHub:"Trung t\u00E2m h\u00E0ng \u0111\u1EE3i",pickDate:"Ch\u1ECDn ng\u00E0y",unknown:"Kh\u00F4ng r\u00F5",selected:"\u0111\u00E3 ch\u1ECDn",queue_one:"h\u00E0ng \u0111\u1EE3i",agent_one:"\u0111\u1EA1i l\u00FD",refresh:"L\u00E0m m\u1EDBi"},
id:{loading:"Memuat\u2026",timeInStatus:"waktu dalam status",today:"Hari ini",timeline:"Lini masa",noActivity:"Tidak ada aktivitas pada hari ini",failedToLoad:"Gagal memuat:",subtitle:"Periksa status kehadiran agen dan antrean yang mereka ikuti.",queues:"Antrean",agents:"Agen",searchQueues:"Cari antrean\u2026",searchAgents:"Cari agen\u2026",noQueuesMatch:"Tidak ada antrean yang cocok",noQueuesFound:"Antrean tidak ditemukan",noAgentsMatch:"Tidak ada agen yang cocok",noAgentsFound:"Agen tidak ditemukan",agentsInSelected:"Agen dalam antrean yang dipilih",noAgentsInSelected:"Tidak ada agen dalam antrean yang dipilih",you:"Anda",presenceHistory:"Riwayat kehadiran",queueHub:"Hub antrean",pickDate:"Pilih tanggal",unknown:"Tidak diketahui",selected:"dipilih",queue_one:"antrean",agent_one:"agen",refresh:"Segarkan"},
ms:{loading:"Memuatkan\u2026",timeInStatus:"masa dalam status",today:"Hari ini",subtitle:"Semak status kehadiran ejen dan baris gilir yang mereka sertai.",queues:"Baris gilir",agents:"Ejen",you:"Anda",presenceHistory:"Sejarah kehadiran",queueHub:"Hab baris gilir",unknown:"Tidak diketahui",selected:"dipilih",queue_one:"baris gilir",agent_one:"ejen",refresh:"Muat semula"},
hi:{loading:"\u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948\u2026",timeInStatus:"\u0938\u094D\u0925\u093F\u0924\u093F \u092E\u0947\u0902 \u0938\u092E\u092F",today:"\u0906\u091C",subtitle:"\u090F\u091C\u0947\u0902\u091F\u094B\u0902 \u0915\u0940 \u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0938\u094D\u0925\u093F\u0924\u093F \u0914\u0930 \u0935\u0947 \u0915\u093F\u0928 \u0915\u0924\u093E\u0930\u094B\u0902 \u092E\u0947\u0902 \u0939\u0948\u0902, \u091C\u093E\u0901\u091A\u0947\u0902\u0964",queues:"\u0915\u0924\u093E\u0930\u0947\u0902",agents:"\u090F\u091C\u0947\u0902\u091F",you:"\u0906\u092A",presenceHistory:"\u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0907\u0924\u093F\u0939\u093E\u0938",queueHub:"\u0915\u0924\u093E\u0930 \u0939\u092C",unknown:"\u0905\u091C\u094D\u091E\u093E\u0924",selected:"\u091A\u092F\u0928\u093F\u0924",queue_one:"\u0915\u0924\u093E\u0930",agent_one:"\u090F\u091C\u0947\u0902\u091F",refresh:"\u0930\u093F\u092B\u094D\u0930\u0947\u0936"},
};

function loc(key: keyof I18nStrings): string {
  const lang = getLocale();
  const base = lang.split("-")[0];
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS[base]?.[key] ?? EN[key];
}

function cntLbl(n: number, key: keyof I18nStrings): string {
  const w = loc(key);
  const base = getLocale().split("-")[0];
  return n !== 1 && base === "en" ? `${n} ${w}s` : `${n} ${w}`;
}

/* ═══════════════════════════════════════════════════════════════
   Shared constants & utilities
   ═══════════════════════════════════════════════════════════════ */

const POLL_PRESENCE_MS = 5000;
const POLL_QUEUE_MS = 10000;

/** Skip polling work when the tab is hidden (saves bandwidth + RU). */
function isTabHidden(): boolean {
  return typeof document !== "undefined" && document.visibilityState === "hidden";
}

const COLORS: Record<string, string> = {
  available: "#13a10e",
  busy: "#c4314b",
  "busy - dnd": "#c4314b",
  "do not disturb": "#c4314b",
  away: "#fcd116",
  "appear away": "#fcd116",
  offline: "#8c8c8c",
  inactive: "#8c8c8c",
  "busy - after conversation work": "#e3008c",
  "after conversation work": "#e3008c",
  "dnd-initiating outbound call": "#c4314b",
  "voice consult dnd": "#c4314b",
  "do not disturb - after conversation work": "#e3008c",
};

function color(name: string): string {
  const l = (name || "").toLowerCase();
  for (const k of Object.keys(COLORS)) {
    if (l.indexOf(k) > -1) return COLORS[k];
  }
  return "#8c8c8c";
}

/** Return inner-HTML icon for a presence status — matches D365 system icons. */
function statusIcon(name: string, sz: "lg" | "sm" = "lg"): string {
  const l = (name || "").toLowerCase();
  // DND / Do Not Disturb → white minus bar
  if (l.indexOf("do not disturb") > -1 || l.indexOf("dnd") > -1)
    return sz === "lg" ? '<span class="dot-minus"></span>' : '<span class="dot-minus-sm"></span>';
  // Available → white checkmark
  if (l.indexOf("available") > -1)
    return sz === "lg"
      ? '<svg class="dot-icon" viewBox="0 0 12 12"><polyline points="2.5,6.5 5,9 9.5,3.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg class="dot-icon-sm" viewBox="0 0 12 12"><polyline points="3,6.5 5,8.5 9,3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // Away / Appear Away → white clock
  if (l.indexOf("away") > -1)
    return sz === "lg"
      ? '<svg class="dot-icon" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.5" fill="none" stroke="#fff" stroke-width="1.3"/><line x1="6" y1="4" x2="6" y2="6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><line x1="6" y1="6" x2="7.8" y2="6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>'
      : '<svg class="dot-icon-sm" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#fff" stroke-width="1.8"/><line x1="6" y1="4.2" x2="6" y2="6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><line x1="6" y1="6" x2="7.6" y2="6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';
  // Offline / Inactive → diagonal slash (the dot itself is the circle)
  if (l.indexOf("offline") > -1 || l.indexOf("inactive") > -1)
    return sz === "lg"
      ? '<svg class="dot-icon" viewBox="0 0 12 12"><line x1="3" y1="9" x2="9" y2="3" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>'
      : '<svg class="dot-icon-sm" viewBox="0 0 12 12"><line x1="3" y1="9" x2="9" y2="3" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>';
  // Busy / After Conversation Work → solid, no inner icon
  return "";
}

function esc(s: string): string {
  const t = document.createElement("span");
  t.textContent = s;
  return t.innerHTML;
}

function fmtShort(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s % 60}s`;
}

interface WebApiLike {
  retrieveMultipleRecords: (
    entity: string,
    query: string,
    maxPageSize?: number
  ) => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
}

function getWebApi(ctx: ComponentFramework.Context<IInputs>): WebApiLike {
  if (ctx.webAPI) return ctx.webAPI;
  const xrm = (window as unknown as Record<string, unknown>)["Xrm"] as
    { WebApi?: WebApiLike } | undefined;
  if (xrm?.WebApi) return xrm.WebApi;
  throw new Error("WebAPI not available");
}

function getUserId(ctx: ComponentFramework.Context<IInputs>): string {
  const c = ctx as ComponentFramework.Context<IInputs> & { userSettings?: { userId?: string } };
  const uid = c.userSettings?.userId;
  if (uid) return uid.replace(/[{}]/g, "").toLowerCase();
  const xrm = (window as unknown as Record<string, unknown>)["Xrm"] as
    { Utility?: { getGlobalContext?: () => { userSettings?: { userId?: string } } } } | undefined;
  const xrmUid = xrm?.Utility?.getGlobalContext?.()?.userSettings?.userId;
  if (xrmUid) return xrmUid.replace(/[{}]/g, "").toLowerCase();
  throw new Error("Cannot determine user ID");
}

function getClientUrl(): string {
  const xrm = (window as unknown as Record<string, unknown>)["Xrm"] as
    { Utility?: { getGlobalContext?: () => { getClientUrl?: () => string } } } | undefined;
  const url = xrm?.Utility?.getGlobalContext?.()?.getClientUrl?.();
  if (url) return url;
  return window.location.origin;
}

async function loadPresenceMap(api: WebApiLike): Promise<Record<string, string>> {
  const resp = await api.retrieveMultipleRecords(
    "msdyn_presence",
    "?$select=msdyn_presenceid,msdyn_presencestatustext"
  );
  const pmap: Record<string, string> = {};
  for (const e of resp.entities) {
    pmap[e.msdyn_presenceid as string] = e.msdyn_presencestatustext as string;
  }
  return pmap;
}

function pName(id: string | null, pmap: Record<string, string>): string {
  if (!id) return loc("unknown");
  return pmap[id] || loc("unknown");
}

interface SharedServices {
  userId: string;
  pmap: Record<string, string>;
  api: WebApiLike;
}

/* ═══════════════════════════════════════════════════════════════
   Presence Timer utilities
   ═══════════════════════════════════════════════════════════════ */

function fmtClock(ms: number): string {
  let s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  s = s % 60;
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(getLocale(), { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function fmtTimeRange(startIso: string, endIso: string | null): string {
  return fmtTime(startIso) + (endIso ? ` \u2013 ${fmtTime(endIso)}` : " \u2013 now");
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

/* ═══════════════════════════════════════════════════════════════
   Queue Hub utilities
   ═══════════════════════════════════════════════════════════════ */

function getInitials(name: string): string {
  const parts = (name || "?").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

interface QueueInfo { id: string; name: string; }
interface AgentInfo { id: string; name: string; presenceId: string | null; presenceName: string; since: string | null; }
interface AgentWithQueues extends AgentInfo { queues: QueueInfo[]; }

function statusOrder(a: AgentInfo): number {
  const l = a.presenceName.toLowerCase();
  if (l.indexOf("available") > -1) return 0;
  if (l.indexOf("busy") > -1) return 1;
  if (l.indexOf("do not disturb") > -1) return 2;
  if (l.indexOf("away") > -1 || l.indexOf("appear away") > -1) return 3;
  if (l.indexOf("offline") > -1 || l.indexOf("inactive") > -1) return 5;
  return 4;
}

const LOADING_HTML = `<div class="qh-loading"><span class="qh-loading-dot"></span><span class="qh-loading-dot" style="animation-delay:.2s"></span><span class="qh-loading-dot" style="animation-delay:.4s"></span></div>`;

/* ═══════════════════════════════════════════════════════════════
   Presence Timer Panel
   ═══════════════════════════════════════════════════════════════ */

class PresenceTimerPanel {
  private _c: HTMLDivElement;
  private _s: SharedServices;

  private _curId: string | null = null;
  private _start: number | null = null;
  private _selectedDate: Date = new Date();
  private _tickTimer: number | null = null;
  private _pollTimer: number | null = null;
  private _calViewDate: Date = new Date();
  private _calOpen = false;
  private _onDocClick: ((e: MouseEvent) => void) | null = null;
  private _filterStatus: string | null = null;
  private _lastRecords: ComponentFramework.WebApi.Entity[] = [];
  private _polling = false;          // reentrancy guard for _poll()
  private _errStreak = 0;            // consecutive poll failures (for backoff)
  private _skipCount = 0;            // v2.8.3: monotonic tick counter for backoff gating
  private _bootstrapped = false;     // true once first successful presence read happened

  private _elDot!: HTMLDivElement;
  private _elName!: HTMLSpanElement;
  private _elClock!: HTMLDivElement;
  private _elErr!: HTMLDivElement;
  private _elTL!: HTMLDivElement;
  private _elSum!: HTMLDivElement;
  private _elBar!: HTMLDivElement;
  private _elDpLbl!: HTMLSpanElement;
  private _elPrev!: HTMLButtonElement;
  private _elNext!: HTMLButtonElement;
  private _elToday!: HTMLButtonElement;
  private _elCalBtn!: HTMLButtonElement;
  private _elCalOverlay!: HTMLDivElement;

  constructor(container: HTMLDivElement, services: SharedServices) {
    this._c = container;
    this._s = services;
  }

  public init(): void {
    this._c.classList.add("presence-timer");
    this._buildUI();
    this._initialize();
  }

  public destroy(): void {
    if (this._tickTimer !== null) clearInterval(this._tickTimer);
    if (this._pollTimer !== null) clearInterval(this._pollTimer);
    if (this._onDocClick) document.removeEventListener("click", this._onDocClick);
  }

  private _buildUI(): void {
    this._c.innerHTML = `
      <div class="card">
        <div class="pill">
          <div class="dot" data-ref="dot"></div>
          <span class="name" data-ref="sName">${loc("loading")}</span>
        </div>
        <div class="time" data-ref="clock">00:00:00</div>
        <div class="lbl">${loc("timeInStatus")}</div>
        <div class="err" data-ref="err"></div>
      </div>
      <div class="dp-section">
        <div class="dp-wrap">
          <button class="dp-btn" data-ref="prevDay">\u2039</button>
          <span class="dp-label" data-ref="dpLabel">${loc("today")}</span>
          <button class="dp-btn" data-ref="nextDay">\u203A</button>
          <button class="dp-cal-btn" data-ref="calBtn" title="${loc("pickDate")}"><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M7 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm2-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm2-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 5.5A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5v-9zM4 7h12v7.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5V7zm1.5-3h9A1.5 1.5 0 0 1 16 5.5V6H4v-.5A1.5 1.5 0 0 1 5.5 4z"/></svg></button>
          <button class="dp-today" data-ref="todayBtn">${loc("today")}</button>
        </div>
        <div class="cal-overlay" data-ref="calOverlay" style="display:none"></div>
      </div>
      <div class="status-bar-wrap" data-ref="statusBar"></div>
      <div class="summary" data-ref="summary"></div>
      <div class="hist">
        <div class="hist-title-row"><span class="hist-title">${loc("timeline")}</span><button class="hist-refresh" data-ref="refreshBtn" title="${loc("refresh")}">↻</button></div>
        <div data-ref="timeline"></div>
      </div>
      <div style="font-size:9px;color:#999;text-align:right;padding:2px 6px 0 0;opacity:.6">PresenceHub v2.8.3</div>`;

    this._elDot = this._ref("dot") as HTMLDivElement;
    this._elName = this._ref("sName") as HTMLSpanElement;
    this._elClock = this._ref("clock") as HTMLDivElement;
    this._elErr = this._ref("err") as HTMLDivElement;
    this._elTL = this._ref("timeline") as HTMLDivElement;
    this._elSum = this._ref("summary") as HTMLDivElement;
    this._elBar = this._ref("statusBar") as HTMLDivElement;
    this._elDpLbl = this._ref("dpLabel") as HTMLSpanElement;
    this._elPrev = this._ref("prevDay") as HTMLButtonElement;
    this._elNext = this._ref("nextDay") as HTMLButtonElement;
    this._elToday = this._ref("todayBtn") as HTMLButtonElement;
    this._elCalBtn = this._ref("calBtn") as HTMLButtonElement;
    this._elCalOverlay = this._ref("calOverlay") as HTMLDivElement;

    (this._ref("refreshBtn") as HTMLButtonElement).addEventListener("click", () => this._loadDay());
    this._elPrev.addEventListener("click", () => this._shiftDay(-1));
    this._elNext.addEventListener("click", () => this._shiftDay(1));
    this._elToday.addEventListener("click", () => {
      this._selectedDate = new Date();
      this._calOpen = false;
      this._elCalOverlay.style.display = "none";
      this._loadDay();
    });
    this._elCalBtn.addEventListener("click", () => this._toggleCalendar());
    this._elCalOverlay.addEventListener("click", (e) => e.stopPropagation());
    this._onDocClick = (e: MouseEvent) => {
      if (this._calOpen && !this._elCalBtn.contains(e.target as Node)) {
        this._calOpen = false;
        this._elCalOverlay.style.display = "none";
      }
    };
    document.addEventListener("click", this._onDocClick);
  }

  private _ref(name: string): HTMLElement {
    return this._c.querySelector(`[data-ref="${name}"]`) as HTMLElement;
  }

  private async _initialize(): Promise<void> {
    // Always wire timers up FIRST so a transient first-call failure can self-heal.
    // (Previously, an exception here left the pill stuck on "Loading\u2026" forever.)
    this._tickTimer = window.setInterval(() => this._tick(), 1000);
    this._pollTimer = window.setInterval(() => this._poll(), POLL_PRESENCE_MS);
    try {
      const p = await this._getPresence();
      this._curId = p.id;
      this._start = p.since ? new Date(p.since).getTime() : Date.now();
      this._bootstrapped = true;
      this._render(p);
      this._tick();
      this._loadDay();
    } catch (e: unknown) {
      this._elName.textContent = "\u2014";
      this._showErr(e instanceof Error ? e.message : String(e));
      // _poll() will keep retrying — and on first success will trigger _loadDay().
    }
  }

  private async _getPresence(): Promise<{ id: string; name: string; since: string | null }> {
    const resp = await this._s.api.retrieveMultipleRecords(
      "msdyn_agentstatus",
      `?$filter=_msdyn_agentid_value eq ${this._s.userId}&$select=_msdyn_currentpresenceid_value&$top=1`
    );
    // v2.8.3: never throw on missing record / null presence. Render "Offline" instead so
    // the pill always escapes the "Loading\u2026" state on first paint even when the
    // OmniChannel agent-status row hasn't been initialized yet.
    if (!resp.entities || !resp.entities.length) {
      console.warn("[PresenceHub] no msdyn_agentstatus row for user", this._s.userId);
      return { id: "", name: "Offline", since: null };
    }
    const rec = resp.entities[0];
    const pid = rec["_msdyn_currentpresenceid_value"] as string;
    if (!pid) {
      console.warn("[PresenceHub] msdyn_agentstatus has null currentpresenceid for user", this._s.userId);
      return { id: "", name: "Offline", since: null };
    }

    // Get the real start time from the latest history record (immune to page-refresh resets)
    let since: string | null = null;
    try {
      const hResp = await this._s.api.retrieveMultipleRecords(
        "msdyn_agentstatushistory",
        `?$filter=_msdyn_agentid_value eq ${this._s.userId} and _msdyn_presenceid_value eq ${pid}` +
        `&$select=msdyn_starttime,msdyn_endtime&$orderby=msdyn_starttime desc&$top=1`
      );
      if (hResp.entities && hResp.entities.length) {
        since = (hResp.entities[0]["msdyn_starttime"] as string) || null;
      }
    } catch { /* fall through */ }

    return { id: pid, name: pName(pid, this._s.pmap), since };
  }

  /**
   * Convert a local Date instant to an OData-safe UTC literal: `yyyy-MM-ddTHH:mm:ssZ`.
   * We MUST emit UTC (with `Z`), not a numeric offset like `+02:00`, because the literal
   * `+` inside an OData `$filter` value is URL-decoded to a space by the gateway,
   * producing an invalid DateTimeOffset (e.g. `2026-05-21T00:00:00 02:00`) and a
   * `"should be in format 'yyyy-mm-ddThh:mm:ss('.'s+)?(zzzzzz)?'"` error.
   * Users in negative-offset timezones never saw this (the `-` is safe); EU/Asia did.
   */
  private static _toUtcLiteral(d: Date): string {
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    const da = String(d.getUTCDate()).padStart(2, "0");
    const h = String(d.getUTCHours()).padStart(2, "0");
    const mi = String(d.getUTCMinutes()).padStart(2, "0");
    const s = String(d.getUTCSeconds()).padStart(2, "0");
    return `${y}-${mo}-${da}T${h}:${mi}:${s}Z`;
  }

  private async _fetchHistory(date: Date): Promise<ComponentFramework.WebApi.Entity[]> {
    // Build local-day boundaries as instants, then serialize as UTC (`...Z`).
    // Avoids the OData `+` URL-decoding issue for any browser timezone.
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
    const dayStartStr = PresenceTimerPanel._toUtcLiteral(dayStart);
    const dayEndStr = PresenceTimerPanel._toUtcLiteral(dayEnd);
    const filter =
      `_msdyn_agentid_value eq ${this._s.userId}` +
      ` and msdyn_starttime ge ${dayStartStr}` +
      ` and msdyn_starttime lt ${dayEndStr}`;
    const q =
      `?$filter=${filter}` +
      `&$select=msdyn_starttime,msdyn_endtime,_msdyn_presenceid_value` +
      `&$orderby=msdyn_starttime desc`;
    const resp = await this._s.api.retrieveMultipleRecords("msdyn_agentstatushistory", q, 5000);
    return resp.entities || [];
  }

  private _tick(): void {
    if (this._start) this._elClock.textContent = fmtClock(Date.now() - this._start);
  }

  private _render(p: { id: string; name: string }): void {
    // v2.8.3: defensive null-checks — if the panel was destroyed/re-rendered,
    // the cached refs may be detached. Re-query before bailing.
    if (!this._elName || !this._elName.isConnected) {
      const fresh = this._c.querySelector('[data-ref="sName"]') as HTMLElement | null;
      if (fresh) this._elName = fresh; else { console.warn("[PresenceHub] _render: sName missing"); return; }
    }
    this._elName.textContent = p.name || "Unknown";
    if (this._elDot) {
      this._elDot.style.background = color(p.name);
      this._elDot.innerHTML = statusIcon(p.name, "lg");
    }
    if (this._elErr) this._elErr.style.display = "none";
  }

  private _showErr(msg: string): void {
    this._elErr.textContent = msg;
    this._elErr.style.display = "block";
  }

  private async _poll(): Promise<void> {
    // Skip while a previous poll is still in flight (slow WebAPI → no thundering herd).
    if (this._polling) return;
    // Skip while tab is hidden — resume immediately when it becomes visible again.
    if (isTabHidden()) return;
    // v2.8.3: removed broken exponential-backoff modulo (the previous formula
    // `errStreak % (skip+1) !== 0` permanently locked polling after 3 failures
    // because errStreak only changed on real attempts, so the modulo never reset).
    // Track skip counter independently of errStreak so we always retry eventually.
    if (this._errStreak >= 3) {
      this._skipCount++;
      // After 3+ failures, only attempt every Nth poll (N = min(6, streak-2)).
      const everyN = Math.min(6, this._errStreak - 2);
      if ((this._skipCount % everyN) !== 0) return;
    }
    this._polling = true;
    try {
      const p = await this._getPresence();
      const wasBootstrapping = !this._bootstrapped;
      if (p.id !== this._curId) {
        this._curId = p.id;
        this._start = p.since ? new Date(p.since).getTime() : Date.now();
        if (isToday(this._selectedDate)) this._loadDay();
      } else if (wasBootstrapping) {
        // First successful read after initialization failed — sync start + load day.
        this._start = p.since ? new Date(p.since).getTime() : Date.now();
        this._loadDay();
      }
      this._bootstrapped = true;
      this._errStreak = 0;
      this._skipCount = 0;
      this._render(p);
      // Self-heal: clear any stale error banner on successful read.
      if (this._elErr.style.display !== "none") this._elErr.style.display = "none";
    } catch (e: unknown) {
      this._errStreak++;
      this._showErr(e instanceof Error ? e.message : String(e));
    } finally {
      this._polling = false;
    }
  }

  private _renderTimeline(records: ComponentFramework.WebApi.Entity[]): void {
    this._lastRecords = records;
    if (!records.length) {
      this._elTL.innerHTML = `<div class="tl-empty">${loc("noActivity")}</div>`;
      this._elSum.innerHTML = "";
      this._elBar.innerHTML = "";
      return;
    }
    const totals: Record<string, number> = {};
    let maxDur = 0;
    for (const r of records) {
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const st = new Date(r["msdyn_starttime"] as string).getTime();
      const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
      const dur = en - st;
      totals[name] = (totals[name] || 0) + dur;
      if (dur > maxDur) maxDur = dur;
    }
    const sortedNames = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    let sumHtml = "";
    for (const n of sortedNames) {
      const active = this._filterStatus === n;
      sumHtml += `<div class="sum-chip${active ? " sum-chip--active" : ""}" data-status="${esc(n)}"><div class="sum-dot" style="background:${color(n)}">${statusIcon(n, "sm")}</div><span>${esc(n)}</span> <span class="sum-val">${fmtShort(totals[n])}</span></div>`;
    }
    this._elSum.innerHTML = sumHtml;
    this._elSum.classList.toggle("has-filter", this._filterStatus !== null);

    // ── Day status bar (chronological segments) ──
    // Sort records chronologically (oldest first)
    const chrono = [...records].sort(
      (a, b) => new Date(a["msdyn_starttime"] as string).getTime() - new Date(b["msdyn_starttime"] as string).getTime()
    );
    const dayStart = new Date(chrono[0]["msdyn_starttime"] as string).getTime();
    const lastRec = chrono[chrono.length - 1];
    const dayEnd = lastRec["msdyn_endtime"]
      ? new Date(lastRec["msdyn_endtime"] as string).getTime()
      : Date.now();
    const totalSpan = dayEnd - dayStart;
    if (totalSpan > 0) {
      let barHtml = '<div class="sbar">';
      const segCount = chrono.length;
      for (let i = 0; i < segCount; i++) {
        const r = chrono[i];
        const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
        const st = new Date(r["msdyn_starttime"] as string).getTime();
        const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
        const pct = Math.max(0.3, ((en - st) / totalSpan) * 100);
        const dimmed = this._filterStatus && this._filterStatus !== name ? " sbar-seg--dim" : "";
        const radius = segCount === 1
          ? "border-radius:8px;"
          : i === 0
            ? "border-radius:8px 0 0 8px;"
            : i === segCount - 1
              ? "border-radius:0 8px 8px 0;"
              : "";
        barHtml += `<div class="sbar-seg${dimmed}" style="width:${pct}%;background:${color(name)};${radius}" data-status="${esc(name)}" title="${esc(name)} \u2014 ${fmtShort(en - st)}"></div>`;
      }
      barHtml += '</div>';
      // Time labels
      const startLbl = fmtTime(chrono[0]["msdyn_starttime"] as string);
      const endLbl = lastRec["msdyn_endtime"] ? fmtTime(lastRec["msdyn_endtime"] as string) : fmtTime(new Date().toISOString());
      barHtml += `<div class="sbar-labels"><span>${startLbl}</span><span>${endLbl}</span></div>`;
      this._elBar.innerHTML = barHtml;
    } else {
      this._elBar.innerHTML = "";
    }

    // Wire up click-to-filter on status bar segments
    this._elBar.querySelectorAll(".sbar-seg").forEach((seg) => {
      seg.addEventListener("click", () => {
        const status = (seg as HTMLElement).dataset.status || null;
        this._filterStatus = this._filterStatus === status ? null : status;
        this._renderTimeline(this._lastRecords);
      });
    });

    // Wire up click-to-filter on summary pills
    this._elSum.querySelectorAll(".sum-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const status = (chip as HTMLElement).dataset.status || null;
        this._filterStatus = this._filterStatus === status ? null : status;
        this._renderTimeline(this._lastRecords);
      });
    });

    // Filter timeline records if a status is selected
    const filtered = this._filterStatus
      ? records.filter(r => pName(r["_msdyn_presenceid_value"] as string, this._s.pmap) === this._filterStatus)
      : records;

    // Recalculate maxDur for filtered set
    let filteredMaxDur = 0;
    for (const r of filtered) {
      const st = new Date(r["msdyn_starttime"] as string).getTime();
      const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
      const dur = en - st;
      if (dur > filteredMaxDur) filteredMaxDur = dur;
    }

    let html = '<div class="tl">';
    for (const r of filtered) {
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const c = color(name);
      const st = new Date(r["msdyn_starttime"] as string).getTime();
      const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
      const dur = en - st;
      const barPct = filteredMaxDur > 0 ? Math.max(4, Math.round((dur / filteredMaxDur) * 100)) : 100;
      html += `<div class="tl-item"><div class="tl-dot" style="background:${c}">${statusIcon(name, "lg")}</div><div class="tl-body"><div class="tl-row"><span class="tl-name">${esc(name)}</span><span class="tl-dur">${fmtShort(dur)}</span></div><div class="tl-time">${fmtTimeRange(r["msdyn_starttime"] as string, (r["msdyn_endtime"] as string) || null)}</div><div class="tl-bar" style="width:${barPct}%;background:${c}"></div></div></div>`;
    }
    html += "</div>";
    this._elTL.innerHTML = html;
  }

  private _updateDateLabel(): void {
    if (isToday(this._selectedDate)) {
      this._elDpLbl.textContent = loc("today");
      this._elToday.style.display = "none";
      this._elNext.style.visibility = "hidden";
    } else {
      this._elDpLbl.textContent = this._selectedDate.toLocaleDateString(getLocale(), { weekday: "short", month: "short", day: "numeric" });
      this._elToday.style.display = "";
      this._elNext.style.visibility = "";
    }
  }

  private async _loadDay(): Promise<void> {
    this._updateDateLabel();
    this._filterStatus = null;
    this._elTL.innerHTML = `<div class="hist-loading">${loc("loading")}</div>`;
    this._elSum.innerHTML = "";
    try {
      const records = await this._fetchHistory(this._selectedDate);
      this._renderTimeline(records);
    } catch (e: unknown) {
      this._elTL.innerHTML = `<div class="tl-empty">${loc("failedToLoad")} ${esc(e instanceof Error ? e.message : String(e))}</div>`;
    }
  }

  private _shiftDay(offset: number): void {
    const d = new Date(this._selectedDate);
    d.setDate(d.getDate() + offset);
    if (d > new Date()) return;
    this._selectedDate = d;
    this._loadDay();
  }

  private _toggleCalendar(): void {
    this._calOpen = !this._calOpen;
    if (this._calOpen) {
      this._calViewDate = new Date(this._selectedDate.getFullYear(), this._selectedDate.getMonth(), 1);
      this._renderCalendar();
      this._elCalOverlay.style.display = "";
    } else {
      this._elCalOverlay.style.display = "none";
    }
  }

  private _renderCalendar(): void {
    const year = this._calViewDate.getFullYear();
    const month = this._calViewDate.getMonth();
    const today = new Date();
    const sel = this._selectedDate;
    const monthName = new Date(year, month, 1).toLocaleDateString(getLocale(), { month: "long", year: "numeric" });
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const canGoNext = new Date(year, month + 1, 1) <= today;

    let html = `<div class="cal-head">`;
    html += `<button class="cal-nav" data-action="calPrev">\u2039</button>`;
    html += `<span class="cal-title">${esc(monthName)}</span>`;
    html += `<button class="cal-nav${canGoNext ? "" : " cal-nav-dis"}" data-action="calNext">\u203A</button>`;
    html += `</div><div class="cal-dow-row">`;
    for (let di = 0; di < 7; di++) {
      const dayLbl = new Date(2017, 0, di + 1).toLocaleDateString(getLocale(), { weekday: "narrow" });
      html += `<span class="cal-dow">${esc(dayLbl)}</span>`;
    }
    html += `</div><div class="cal-grid">`;
    for (let i = 0; i < firstDow; i++) html += `<span class="cal-cell"></span>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const isFuture = cellDate > today;
      const isTdy = cellDate.toDateString() === today.toDateString();
      const isSel = cellDate.toDateString() === sel.toDateString();
      let cls = "cal-day";
      if (isFuture) cls += " cal-dis";
      if (isTdy) cls += " cal-today";
      if (isSel) cls += " cal-sel";
      html += `<button class="${cls}"${isFuture ? " disabled" : ""} data-day="${d}">${d}</button>`;
    }
    html += `</div>`;
    this._elCalOverlay.innerHTML = html;

    this._elCalOverlay.querySelector('[data-action="calPrev"]')
      ?.addEventListener("click", () => this._shiftCalMonth(-1));
    if (canGoNext) {
      this._elCalOverlay.querySelector('[data-action="calNext"]')
        ?.addEventListener("click", () => this._shiftCalMonth(1));
    }
    this._elCalOverlay.querySelectorAll(".cal-day:not(.cal-dis)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const day = parseInt((btn as HTMLElement).dataset.day || "1", 10);
        this._selectedDate = new Date(year, month, day);
        this._calOpen = false;
        this._elCalOverlay.style.display = "none";
        this._loadDay();
      });
    });
  }

  private _shiftCalMonth(offset: number): void {
    this._calViewDate = new Date(this._calViewDate.getFullYear(), this._calViewDate.getMonth() + offset, 1);
    this._renderCalendar();
  }
}

/* ═══════════════════════════════════════════════════════════════
   Queue Hub Panel
   ═══════════════════════════════════════════════════════════════ */

class QueueHubPanel {
  private _c: HTMLDivElement;
  private _s: SharedServices;

  private _queues: QueueInfo[] = [];
  private _pollTimer: number | null = null;
  private _activeTab: "queues" | "agents" = "queues";
  private _dataLoaded = false;

  // Queues subtab state
  private _selectedQueueIds = new Set<string>();
  private _queueAgents: AgentInfo[] = [];
  private _queueAgentsCacheKey = "";
  private _queuesCollapsed = false;

  // Agents subtab state
  private _allAgents: AgentWithQueues[] = [];
  private _expandedAgentIds = new Set<string>();
  private _agentFilterStatus: string | null = null;
  private _agentHistoryCache: Record<string, ComponentFramework.WebApi.Entity[]> = {};

  private _elSearch!: HTMLInputElement;
  private _elSubtitle!: HTMLDivElement;
  private _elList!: HTMLDivElement;
  private _elSummary!: HTMLDivElement;
  private _elTabQueues!: HTMLButtonElement;
  private _elTabAgents!: HTMLButtonElement;

  constructor(container: HTMLDivElement, services: SharedServices) {
    this._c = container;
    this._s = services;
  }

  public init(): void {
    this._c.classList.add("queue-hub");
    this._buildUI();
    this._initialize();
  }

  public destroy(): void {
    if (this._pollTimer !== null) clearInterval(this._pollTimer);
  }

  private _buildUI(): void {
    this._c.innerHTML = `
      <div class="qh-subtitle" data-ref="subtitle"><svg class="qh-info-icon" viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M8 7.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM8 5.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Zm6-5a5 5 0 1 0 0 10A5 5 0 0 0 8 3Z"/></svg>${loc("subtitle")}</div>
      <div class="qh-tabs" data-ref="tabs">
        <button class="qh-tab qh-tab--active" data-ref="tab-queues" data-tab="queues">${loc("queues")}</button>
        <button class="qh-tab" data-ref="tab-agents" data-tab="agents">${loc("agents")}</button>
      </div>
      <div class="qh-search-wrap">
        <input class="qh-search" data-ref="search" placeholder="${loc("searchQueues")}" autocomplete="off" />
      </div>
      <div class="qh-summary" data-ref="summary" style="display:none"></div>
      <div class="qh-list" data-ref="list">${LOADING_HTML}</div>`;

    this._elSearch = this._ref("search") as HTMLInputElement;
    this._elSubtitle = this._ref("subtitle") as HTMLDivElement;
    this._elList = this._ref("list") as HTMLDivElement;
    this._elSummary = this._ref("summary") as HTMLDivElement;
    this._elTabQueues = this._ref("tab-queues") as HTMLButtonElement;
    this._elTabAgents = this._ref("tab-agents") as HTMLButtonElement;

    this._elSearch.addEventListener("input", () => this._onSearch());
    this._elTabQueues.addEventListener("click", () => this._switchTab("queues"));
    this._elTabAgents.addEventListener("click", () => this._switchTab("agents"));
  }

  private _ref(name: string): HTMLElement {
    return this._c.querySelector(`[data-ref="${name}"]`) as HTMLElement;
  }

  private async _initialize(): Promise<void> {
    try {
      await this._loadQueues();
      this._dataLoaded = true;
      this._renderQueuesTab();
    } catch (e: unknown) {
      this._elList.innerHTML = `<div class="qh-empty">${esc(e instanceof Error ? e.message : String(e))}</div>`;
    }
  }

  /* ── Data loading ── */

  private async _loadQueues(): Promise<void> {
    const fetchXml = `<fetch>
      <entity name="queue">
        <attribute name="queueid"/>
        <attribute name="name"/>
        <order attribute="name"/>
        <link-entity name="queuemembership" from="queueid" to="queueid" intersect="true">
          <link-entity name="systemuser" from="systemuserid" to="systemuserid">
            <filter><condition attribute="systemuserid" operator="eq" value="${this._s.userId}"/></filter>
          </link-entity>
        </link-entity>
      </entity>
    </fetch>`;
    const resp = await this._s.api.retrieveMultipleRecords("queue", `?fetchXml=${encodeURIComponent(fetchXml)}`, 5000);
    this._queues = [];
    for (const e of resp.entities) {
      const name = e["name"] as string;
      if (/^<.*>$/.test(name) || /^[0-9a-f]{20,}_\d+$/i.test(name)) continue;
      this._queues.push({ id: e["queueid"] as string, name });
    }
  }

  private async _loadAgentsInQueue(queueId: string): Promise<AgentInfo[]> {
    const fetchXml = `<fetch>
      <entity name="systemuser">
        <attribute name="systemuserid"/>
        <attribute name="fullname"/>
        <order attribute="fullname"/>
        <link-entity name="queuemembership" from="systemuserid" to="systemuserid" intersect="true">
          <link-entity name="queue" from="queueid" to="queueid">
            <filter><condition attribute="queueid" operator="eq" value="${queueId}"/></filter>
          </link-entity>
        </link-entity>
      </entity>
    </fetch>`;
    const resp = await this._s.api.retrieveMultipleRecords("systemuser", `?fetchXml=${encodeURIComponent(fetchXml)}`, 5000);

    const agents: AgentInfo[] = [];
    const userIds: string[] = [];
    for (const e of resp.entities) {
      const uid = e["systemuserid"] as string;
      userIds.push(uid);
      agents.push({ id: uid, name: (e["fullname"] as string) || "Unknown", presenceId: null, presenceName: "Unknown", since: null });
    }

    if (userIds.length > 0) {
      const statusMap: Record<string, { presenceId: string | null; since: string | null }> = {};
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const filter = batch.map(id => `_msdyn_agentid_value eq ${id}`).join(" or ");
        try {
          const sr = await this._s.api.retrieveMultipleRecords(
            "msdyn_agentstatus",
            `?$filter=${filter}&$select=_msdyn_agentid_value,_msdyn_currentpresenceid_value,msdyn_presencemodifiedon`
          );
          for (const s of sr.entities) {
            const aid = s["_msdyn_agentid_value"] as string;
            statusMap[aid] = {
              presenceId: (s["_msdyn_currentpresenceid_value"] as string) || null,
              since: (s["msdyn_presencemodifiedon"] as string) || null,
            };
          }
        } catch {
          // Some agents may not have status records
        }
      }
      for (const a of agents) {
        const st = statusMap[a.id];
        if (st) {
          a.presenceId = st.presenceId;
          a.presenceName = pName(st.presenceId, this._s.pmap);
          a.since = st.since;
        }
      }
    }
    return agents;
  }

  private async _loadAgentsForSelectedQueues(): Promise<AgentInfo[]> {
    const agentMap: Record<string, AgentInfo> = {};
    // Parallelize per-queue fetches (was sequential).
    const results = await Promise.allSettled(
      [...this._selectedQueueIds].map(qid => this._loadAgentsInQueue(qid))
    );
    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      for (const a of r.value) {
        if (!agentMap[a.id]) {
          agentMap[a.id] = { ...a };
        } else if (a.presenceId) {
          agentMap[a.id].presenceId = a.presenceId;
          agentMap[a.id].presenceName = a.presenceName;
          agentMap[a.id].since = a.since;
        }
      }
    }
    return Object.values(agentMap).sort((a, b) => {
      const diff = statusOrder(a) - statusOrder(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }

  private async _loadAllAgentsWithQueues(): Promise<AgentWithQueues[]> {
    const agentMap: Record<string, AgentWithQueues> = {};
    // Fetch all queues in parallel (was sequential — N round-trips per poll cycle).
    // Use allSettled so one bad queue can't break the whole tab.
    const results = await Promise.allSettled(
      this._queues.map(q => this._loadAgentsInQueue(q.id).then(agents => ({ q, agents })))
    );
    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      const { q, agents } = r.value;
      for (const a of agents) {
        if (!agentMap[a.id]) {
          agentMap[a.id] = { ...a, queues: [] };
        } else if (a.presenceId) {
          agentMap[a.id].presenceId = a.presenceId;
          agentMap[a.id].presenceName = a.presenceName;
          agentMap[a.id].since = a.since;
        }
        agentMap[a.id].queues.push(q);
      }
    }
    return Object.values(agentMap).sort((a, b) => a.name.localeCompare(b.name));
  }

  /* ── Tab switching ── */

  private _switchTab(tab: "queues" | "agents"): void {
    if (this._activeTab === tab) return;
    if (this._pollTimer !== null) { clearInterval(this._pollTimer); this._pollTimer = null; }
    this._activeTab = tab;
    this._elSearch.value = "";
    this._agentFilterStatus = null;
    this._elSummary.style.display = "none";
    this._elSummary.innerHTML = "";

    this._elTabQueues.classList.toggle("qh-tab--active", tab === "queues");
    this._elTabAgents.classList.toggle("qh-tab--active", tab === "agents");

    if (tab === "queues") {
      this._elSearch.placeholder = loc("searchQueues");
      this._renderQueuesTab();
    } else {
      this._elSearch.placeholder = loc("searchAgents");
      this._renderAgentsTab();
    }
  }

  /* ══════════════════════════════════
     QUEUES SUBTAB
     ══════════════════════════════════ */

  private _renderQueuesTab(filter?: string): void {
    let queues = this._queues;
    if (filter) {
      const lf = filter.toLowerCase();
      queues = queues.filter(q => q.name.toLowerCase().indexOf(lf) > -1);
    }

    if (!queues.length) {
      this._elList.innerHTML = `<div class="qh-empty">${filter ? loc("noQueuesMatch") : loc("noQueuesFound")}</div>`;
      return;
    }

    const selCount = this._selectedQueueIds.size;
    const collapsed = this._queuesCollapsed;
    const selQueues = selCount ? this._queues.filter(q => this._selectedQueueIds.has(q.id)) : [];
    const collapseLabel = collapsed
      ? `${cntLbl(queues.length, "queue_one")}${selCount ? ` \u00b7 ${selCount} ${loc("selected")}` : ""}`
      : `${cntLbl(queues.length, "queue_one")}`;

    let html = `<div class="qh-collapse-hdr" data-ref="collapse-toggle">
      <svg class="qh-collapse-arrow${collapsed ? "" : " qh-collapse-arrow--open"}" width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M15.85 7.65a.5.5 0 0 0-.7 0L10 12.79 4.85 7.65a.5.5 0 0 0-.7.7l5.5 5.5a.5.5 0 0 0 .7 0l5.5-5.5a.5.5 0 0 0 0-.7Z"/></svg>
      <span class="qh-collapse-label">${collapseLabel}</span>
    </div>`;
    if (collapsed && selQueues.length) {
      html += `<div class="qh-selected-queues">${selQueues.map(q => `<span class="qh-sel-tag">${esc(q.name)}<span class="qh-sel-tag-x" data-qid="${esc(q.id)}">&times;</span></span>`).join("")}</div>`;
    }
    html += `<div class="qh-collapse-body" style="display:${collapsed ? "none" : "block"}">`;
    for (const q of queues) {
      const checked = this._selectedQueueIds.has(q.id);
      html += `<div class="qh-item qh-item--selectable${checked ? " qh-item--selected" : ""}" data-qid="${esc(q.id)}">
        <label class="qh-checkbox-wrap" onclick="event.stopPropagation()">
          <input type="checkbox" class="qh-checkbox" data-qid="${esc(q.id)}" ${checked ? "checked" : ""} />
          <span class="qh-checkbox-custom"></span>
        </label>
        <div class="qh-item-body">
          <div class="qh-item-name">${esc(q.name)}</div>
        </div>
      </div>`;
    }
    // CTA button inside the queue list when there's a selection and list is expanded
    if (selCount > 0 && !collapsed) {
      html += `<button class="qh-show-agents-cta" data-ref="show-agents-cta"><svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM3 18a7 7 0 0 1 14 0 .5.5 0 0 1-1 0 6 6 0 0 0-12 0 .5.5 0 0 1-1 0Z"/></svg> ${loc("showAgents")} (${selCount}) <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M15.85 7.65a.5.5 0 0 0-.7 0L10 12.79 4.85 7.65a.5.5 0 0 0-.7.7l5.5 5.5a.5.5 0 0 0 .7 0l5.5-5.5a.5.5 0 0 0 0-.7Z"/></svg></button>`;
    }
    html += `</div>`;

    if (selCount > 0 && collapsed) {
      html += `<div class="qh-results-divider"><span>${loc("agentsInSelected")}</span></div>`;
      html += `<div class="qh-selected-queues">${selQueues.map(q => `<span class="qh-sel-tag">${esc(q.name)}<span class="qh-sel-tag-x" data-qid="${esc(q.id)}">&times;</span></span>`).join("")}</div>`;
      html += `<div data-ref="queue-agents">${LOADING_HTML}</div>`;
    }

    this._elList.innerHTML = html;

    // Bind collapse toggle
    const colToggle = this._c.querySelector('[data-ref="collapse-toggle"]');
    if (colToggle) {
      colToggle.addEventListener("click", () => {
        this._queuesCollapsed = !this._queuesCollapsed;
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
        if (this._selectedQueueIds.size > 0 && this._queuesCollapsed) this._loadAndRenderQueueAgents();
      });
    }

    // Bind "Show agents" CTA button
    const ctaBtn = this._c.querySelector('[data-ref="show-agents-cta"]');
    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => {
        this._queuesCollapsed = true;
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
        this._loadAndRenderQueueAgents();
      });
    }

    // Bind checkbox events
    this._elList.querySelectorAll(".qh-checkbox").forEach(cb => {
      cb.addEventListener("change", (ev) => {
        const input = ev.target as HTMLInputElement;
        const qid = input.dataset.qid!;
        if (input.checked) {
          this._selectedQueueIds.add(qid);
        } else {
          this._selectedQueueIds.delete(qid);
          if (this._selectedQueueIds.size === 0) this._queuesCollapsed = false;
        }
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
      });
    });

    // Also allow clicking the row to toggle
    this._elList.querySelectorAll(".qh-item--selectable").forEach(el => {
      el.addEventListener("click", () => {
        const qid = (el as HTMLElement).dataset.qid!;
        const cb = el.querySelector(".qh-checkbox") as HTMLInputElement;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event("change"));
      });
    });

    // Bind tag remove buttons
    this._elList.querySelectorAll(".qh-sel-tag-x").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const qid = (btn as HTMLElement).dataset.qid!;
        this._selectedQueueIds.delete(qid);
        if (this._selectedQueueIds.size === 0) this._queuesCollapsed = false;
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
        if (this._selectedQueueIds.size > 0) this._loadAndRenderQueueAgents();
      });
    });

    if (selCount > 0 && collapsed) {
      this._loadAndRenderQueueAgents();
    }
  }

  private _queueSelectionKey(): string {
    return [...this._selectedQueueIds].sort().join(",");
  }

  private async _loadAndRenderQueueAgents(forceRefresh = false): Promise<void> {
    const target = this._c.querySelector('[data-ref="queue-agents"]') as HTMLDivElement;
    if (!target) return;

    const key = this._queueSelectionKey();
    // If selection didn't change and we have cached data, just re-render
    if (!forceRefresh && key === this._queueAgentsCacheKey && this._queueAgents.length > 0) {
      this._renderQueueAgentsSection(target);
      return;
    }

    try {
      this._queueAgents = await this._loadAgentsForSelectedQueues();
      this._queueAgentsCacheKey = key;
      this._renderQueueAgentsSection(target);
      if (this._pollTimer !== null) clearInterval(this._pollTimer);
      this._pollTimer = window.setInterval(() => this._pollQueueAgents(), POLL_QUEUE_MS);
    } catch (e: unknown) {
      target.innerHTML = `<div class="qh-empty">${esc(e instanceof Error ? e.message : String(e))}</div>`;
    }
  }

  private _renderQueueAgentsSection(target: HTMLElement): void {
    const agents = this._queueAgents;
    const totals: Record<string, number> = {};
    for (const a of agents) {
      totals[a.presenceName] = (totals[a.presenceName] || 0) + 1;
    }
    const sorted = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    let sumHtml = `<div class="qh-summary" style="display:${sorted.length ? "flex" : "none"}">`;
    for (const n of sorted) {
      sumHtml += `<div class="qh-chip"><div class="qh-chip-dot" style="background:${color(n)}">${statusIcon(n, "sm")}</div><span class="qh-chip-count">${totals[n]}</span><span>${esc(n)}</span></div>`;
    }
    sumHtml += `</div>`;

    if (!agents.length) {
      target.innerHTML = `${sumHtml}<div class="qh-empty">${loc("noAgentsInSelected")}</div>`;
      return;
    }

    let html = sumHtml;
    html += `<div class="qh-results-count">${cntLbl(agents.length, "agent_one")}</div>`;
    for (const a of agents) {
      html += this._agentCardHtml(a);
    }
    target.innerHTML = html;
  }

  private _pollingQueueAgents = false;
  private async _pollQueueAgents(): Promise<void> {
    if (this._activeTab !== "queues" || this._selectedQueueIds.size === 0) return;
    if (this._pollingQueueAgents || isTabHidden()) return;
    this._pollingQueueAgents = true;
    try {
      this._queueAgents = await this._loadAgentsForSelectedQueues();
      this._queueAgentsCacheKey = this._queueSelectionKey();
      const target = this._c.querySelector('[data-ref="queue-agents"]') as HTMLDivElement;
      if (target) this._renderQueueAgentsSection(target);
    } catch {
      // silently retry
    } finally {
      this._pollingQueueAgents = false;
    }
  }

  /* ══════════════════════════════════
     AGENTS SUBTAB
     ══════════════════════════════════ */

  private async _renderAgentsTab(filter?: string): Promise<void> {
    if (!this._allAgents.length || !this._dataLoaded) {
      this._elList.innerHTML = LOADING_HTML;
      try {
        this._allAgents = await this._loadAllAgentsWithQueues();
      } catch (e: unknown) {
        this._elList.innerHTML = `<div class="qh-empty">${esc(e instanceof Error ? e.message : String(e))}</div>`;
        return;
      }
    }

    let agents = this._allAgents;
    if (filter) {
      const lf = filter.toLowerCase();
      agents = agents.filter(a => a.name.toLowerCase().indexOf(lf) > -1);
    }
    if (this._agentFilterStatus) {
      agents = agents.filter(a => a.presenceName === this._agentFilterStatus);
    }

    if (!agents.length) {
      this._elList.innerHTML = `<div class="qh-empty">${filter ? loc("noAgentsMatch") : loc("noAgentsFound")}</div>`;
      return;
    }

    agents = [...agents].sort((a, b) => {
      const diff = statusOrder(a) - statusOrder(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });

    // Status summary chips
    const totals: Record<string, number> = {};
    for (const a of this._allAgents) {
      totals[a.presenceName] = (totals[a.presenceName] || 0) + 1;
    }
    const sortedStatuses = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    let sumHtml = `<div class="qh-summary${this._agentFilterStatus ? " qh-has-filter" : ""}" style="display:${sortedStatuses.length ? "flex" : "none"}">`;
    for (const n of sortedStatuses) {
      const active = this._agentFilterStatus === n;
      sumHtml += `<div class="qh-chip qh-chip--clickable${active ? " qh-chip--active" : ""}" data-status="${esc(n)}"><div class="qh-chip-dot" style="background:${color(n)}">${statusIcon(n, "sm")}</div><span class="qh-chip-count">${totals[n]}</span><span>${esc(n)}</span></div>`;
    }
    sumHtml += `</div>`;

    const clientUrl = getClientUrl();
    let html = "";
    for (const a of agents) {
      const expanded = this._expandedAgentIds.has(a.id);
      const col = color(a.presenceName);
      const sinceStr = a.since ? fmtShort(Date.now() - new Date(a.since).getTime()) : "";
      const isMe = a.id === this._s.userId;
      const initials = esc(getInitials(a.name));
      const imgUrl = `${clientUrl}/api/data/v9.2/systemusers(${a.id})/entityimage/$value`;
      const photoHtml = `<img class="qh-agent-photo" src="${esc(imgUrl)}" alt="" onload="this.parentElement.style.background='transparent'" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="qh-agent-initials" style="display:none">${initials}</span>`;

      html += `<div class="qh-agent-expandable${expanded ? " qh-agent-expandable--open" : ""}" data-aid="${esc(a.id)}">
        <div class="qh-agent qh-agent--clickable">
          <div class="qh-agent-avatar" style="background:${isMe ? "#e0ecff" : "#f0f0f0"};color:${isMe ? "#0078d4" : "#666"}">
            ${photoHtml}
            <div class="qh-agent-dot" style="background:${col}">${statusIcon(a.presenceName, "sm")}</div>
          </div>
          <div class="qh-agent-body">
            <div class="qh-agent-name">${esc(a.name)}</div>
            <div class="qh-agent-status"><span style="color:${col}">${esc(a.presenceName)}</span>${sinceStr ? ` \u00b7 ${esc(sinceStr)}` : ""}</div>
          </div>
          ${isMe ? `<span class="qh-agent-you">${loc("you")}</span>` : ""}
          <span class="qh-agent-queue-count">${cntLbl(a.queues.length, "queue_one")}</span>
          <svg class="qh-expand-arrow${expanded ? " qh-expand-arrow--open" : ""}" width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M15.85 7.65a.5.5 0 0 0-.7 0L10 12.79 4.85 7.65a.5.5 0 0 0-.7.7l5.5 5.5a.5.5 0 0 0 .7 0l5.5-5.5a.5.5 0 0 0 0-.7Z"/></svg>
        </div>
        <div class="qh-agent-queues" style="display:${expanded ? "block" : "none"}">
          ${a.queues.map(q => `<div class="qh-agent-queue-item">
            <span>${esc(q.name)}</span>
          </div>`).join("")}
        </div>
      </div>`;
    }

    this._elList.innerHTML = sumHtml + html;

    // Bind expand/collapse
    this._elList.querySelectorAll(".qh-agent--clickable").forEach(el => {
      el.addEventListener("click", () => {
        const wrapper = el.closest(".qh-agent-expandable") as HTMLElement;
        const aid = wrapper.dataset.aid!;
        const queuesDiv = wrapper.querySelector(".qh-agent-queues") as HTMLElement;
        const arrow = wrapper.querySelector(".qh-expand-arrow") as HTMLElement;
        if (this._expandedAgentIds.has(aid)) {
          this._expandedAgentIds.delete(aid);
          queuesDiv.style.display = "none";
          wrapper.classList.remove("qh-agent-expandable--open");
          arrow.classList.remove("qh-expand-arrow--open");
        } else {
          this._expandedAgentIds.add(aid);
          queuesDiv.style.display = "block";
          wrapper.classList.add("qh-agent-expandable--open");
          arrow.classList.add("qh-expand-arrow--open");
          // Load and render history bar
          void this._fetchAgentHistory(aid).then(records => {
            this._renderAgentBar(records, queuesDiv);
            return undefined;
          }).catch(() => { /* silently skip */ });
        }
      });
    });

    // Bind chip click-to-filter
    this._elList.querySelectorAll(".qh-chip--clickable").forEach(chip => {
      chip.addEventListener("click", () => {
        const status = (chip as HTMLElement).dataset.status || null;
        this._agentFilterStatus = this._agentFilterStatus === status ? null : status;
        this._renderAgentsTab(this._elSearch.value.trim() || undefined);
      });
    });

    // Render history bars for already-expanded agents
    this._elList.querySelectorAll(".qh-agent-expandable--open").forEach(wrapper => {
      const aid = (wrapper as HTMLElement).dataset.aid!;
      const queuesDiv = wrapper.querySelector(".qh-agent-queues") as HTMLElement;
      void this._fetchAgentHistory(aid).then(records => {
        this._renderAgentBar(records, queuesDiv);
        return undefined;
      }).catch(() => { /* silently skip */ });
    });

    if (this._pollTimer !== null) clearInterval(this._pollTimer);
    this._pollTimer = window.setInterval(() => this._pollAgentsTab(), POLL_QUEUE_MS);
  }

  private _pollingAgentsTab = false;
  private async _pollAgentsTab(): Promise<void> {
    if (this._activeTab !== "agents") return;
    if (this._pollingAgentsTab || isTabHidden()) return;
    this._pollingAgentsTab = true;
    try {
      this._allAgents = await this._loadAllAgentsWithQueues();
      this._agentHistoryCache = {};
      this._renderAgentsTab(this._elSearch.value.trim() || undefined);
    } catch {
      // silently retry
    } finally {
      this._pollingAgentsTab = false;
    }
  }

  /* ── Agent history bar helpers ── */

  private async _fetchAgentHistory(agentId: string): Promise<ComponentFramework.WebApi.Entity[]> {
    const cached = this._agentHistoryCache[agentId];
    if (cached) return cached;
    // v2.8.3: use UTC literals (matches PresenceTimerPanel._toUtcLiteral fix) to avoid
    // OData `+` URL-decode bug in positive-offset timezones.
    const today = new Date();
    const dayStartDt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const dayEndDt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0);
    const toUtc = (d: Date): string => {
      const y = d.getUTCFullYear();
      const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
      const da = String(d.getUTCDate()).padStart(2, "0");
      const h = String(d.getUTCHours()).padStart(2, "0");
      const mi = String(d.getUTCMinutes()).padStart(2, "0");
      const s = String(d.getUTCSeconds()).padStart(2, "0");
      return `${y}-${mo}-${da}T${h}:${mi}:${s}Z`;
    };
    const dayStart = toUtc(dayStartDt);
    const dayEnd = toUtc(dayEndDt);
    const filter =
      `_msdyn_agentid_value eq ${agentId}` +
      ` and msdyn_starttime ge ${dayStart}` +
      ` and msdyn_starttime lt ${dayEnd}`;
    const q =
      `?$filter=${filter}` +
      `&$select=msdyn_starttime,msdyn_endtime,_msdyn_presenceid_value` +
      `&$orderby=msdyn_starttime asc`;
    const resp = await this._s.api.retrieveMultipleRecords("msdyn_agentstatushistory", q, 5000);
    const records = resp.entities || [];
    this._agentHistoryCache[agentId] = records;
    return records;
  }

  private _renderAgentBar(records: ComponentFramework.WebApi.Entity[], container: HTMLElement): void {
    // Remove any existing bar
    const existing = container.querySelector(".qh-agent-bar-wrap");
    if (existing) existing.remove();

    if (!records.length) return;

    const chrono = [...records].sort(
      (a, b) => new Date(a["msdyn_starttime"] as string).getTime() - new Date(b["msdyn_starttime"] as string).getTime()
    );
    const barStart = new Date(chrono[0]["msdyn_starttime"] as string).getTime();
    const lastRec = chrono[chrono.length - 1];
    const barEnd = lastRec["msdyn_endtime"]
      ? new Date(lastRec["msdyn_endtime"] as string).getTime()
      : Date.now();
    const totalSpan = barEnd - barStart;
    if (totalSpan <= 0) return;

    let barHtml = '<div class="qh-agent-bar-wrap"><div class="sbar">';
    const segCount = chrono.length;
    for (let i = 0; i < segCount; i++) {
      const r = chrono[i];
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const st = new Date(r["msdyn_starttime"] as string).getTime();
      const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
      const pct = Math.max(0.3, ((en - st) / totalSpan) * 100);
      const radius = segCount === 1
        ? "border-radius:8px;"
        : i === 0
          ? "border-radius:8px 0 0 8px;"
          : i === segCount - 1
            ? "border-radius:0 8px 8px 0;"
            : "";
      barHtml += `<div class="sbar-seg" style="width:${pct}%;background:${color(name)};${radius}" title="${esc(name)} \u2014 ${fmtShort(en - st)}"></div>`;
    }
    barHtml += '</div>';
    const startLbl = fmtTime(chrono[0]["msdyn_starttime"] as string);
    const endLbl = lastRec["msdyn_endtime"] ? fmtTime(lastRec["msdyn_endtime"] as string) : fmtTime(new Date().toISOString());
    barHtml += `<div class="sbar-labels"><span>${startLbl}</span><span>${endLbl}</span></div></div>`;

    container.insertAdjacentHTML("afterbegin", barHtml);
  }

  /* ── Shared agent card HTML ── */

  private _agentCardHtml(a: AgentInfo): string {
    const col = color(a.presenceName);
    const sinceStr = a.since ? fmtShort(Date.now() - new Date(a.since).getTime()) : "";
    const isMe = a.id === this._s.userId;
    const initials = esc(getInitials(a.name));
    const clientUrl = getClientUrl();
    const imgUrl = `${clientUrl}/api/data/v9.2/systemusers(${a.id})/entityimage/$value`;
    const photoHtml = `<img class="qh-agent-photo" src="${esc(imgUrl)}" alt="" onload="this.parentElement.style.background='transparent'" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="qh-agent-initials" style="display:none">${initials}</span>`;
    return `<div class="qh-agent">
      <div class="qh-agent-avatar" style="background:${isMe ? "#e0ecff" : "#f0f0f0"};color:${isMe ? "#0078d4" : "#666"}">
        ${photoHtml}
        <div class="qh-agent-dot" style="background:${col}">${statusIcon(a.presenceName, "sm")}</div>
      </div>
      <div class="qh-agent-body">
        <div class="qh-agent-name">${esc(a.name)}</div>
        <div class="qh-agent-status"><span style="color:${col}">${esc(a.presenceName)}</span>${sinceStr ? ` \u00b7 ${esc(sinceStr)}` : ""}</div>
      </div>
      ${isMe ? `<span class="qh-agent-you">${loc("you")}</span>` : ""}
    </div>`;
  }

  /* ── Search ── */

  private _onSearch(): void {
    const val = this._elSearch.value.trim();
    if (this._activeTab === "queues") {
      this._renderQueuesTab(val || undefined);
    } else {
      this._renderAgentsTab(val || undefined);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   Main Control — Presence Hub
   ═══════════════════════════════════════════════════════════════ */

export class PresenceHub implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container!: HTMLDivElement;
  private _context!: ComponentFramework.Context<IInputs>;
  private _presencePanel!: PresenceTimerPanel;
  private _queuePanel!: QueueHubPanel;
  private _activeTab: "presence" | "queues" = "presence";
  private _tabPresence!: HTMLButtonElement;
  private _tabQueues!: HTMLButtonElement;
  private _panelPresence!: HTMLDivElement;
  private _panelQueues!: HTMLDivElement;

  constructor() {
    // empty
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    _notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._context = context;
    this._container = container;
    this._container.classList.add("presence-hub");
    _lcid = (context.userSettings as unknown as Record<string, number>)?.languageId || 1033;

    this._container.innerHTML = `
      <div class="ph-tabs">
        <button class="ph-tab ph-tab-active" data-tab="presence">${loc("presenceHistory")}</button>
        <button class="ph-tab" data-tab="queues">${loc("queueHub")}</button>
      </div>
      <div class="ph-panel" data-panel="presence"></div>
      <div class="ph-panel" data-panel="queues" style="display:none"></div>`;

    this._tabPresence = this._container.querySelector('[data-tab="presence"]') as HTMLButtonElement;
    this._tabQueues = this._container.querySelector('[data-tab="queues"]') as HTMLButtonElement;
    this._panelPresence = this._container.querySelector('[data-panel="presence"]') as HTMLDivElement;
    this._panelQueues = this._container.querySelector('[data-panel="queues"]') as HTMLDivElement;

    this._tabPresence.addEventListener("click", () => this._switchTab("presence"));
    this._tabQueues.addEventListener("click", () => this._switchTab("queues"));

    this._initAsync();
  }

  private async _initAsync(): Promise<void> {
    try {
      const api = getWebApi(this._context);
      const userId = getUserId(this._context);
      const pmap = await loadPresenceMap(api);
      const services: SharedServices = { userId, pmap, api };

      this._presencePanel = new PresenceTimerPanel(this._panelPresence, services);
      this._presencePanel.init();

      this._queuePanel = new QueueHubPanel(this._panelQueues, services);
      this._queuePanel.init();
    } catch (e: unknown) {
      this._panelPresence.textContent = `${e instanceof Error ? e.message : String(e)}`;
    }
  }

  private _switchTab(tab: "presence" | "queues"): void {
    if (tab === this._activeTab) return;
    this._activeTab = tab;
    if (tab === "presence") {
      this._tabPresence.classList.add("ph-tab-active");
      this._tabQueues.classList.remove("ph-tab-active");
      this._panelPresence.style.display = "";
      this._panelQueues.style.display = "none";
    } else {
      this._tabQueues.classList.add("ph-tab-active");
      this._tabPresence.classList.remove("ph-tab-active");
      this._panelQueues.style.display = "";
      this._panelPresence.style.display = "none";
    }
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    if (this._presencePanel) this._presencePanel.destroy();
    if (this._queuePanel) this._queuePanel.destroy();
  }
}
