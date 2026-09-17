import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { color, registerPresenceBase, statusIcon, statusKind, statusOrder as statusOrderOf } from "./status";
import {
  clampSpan, dayBounds, fmtClock, fmtDateTime, fmtShort, fmtTime, fmtTimeRange,
  getInitials, isToday, toUtcLiteral,
} from "./time";

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
  showAgents: string; now: string; offline: string;
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
  showAgents:"Show agents", now:"now", offline:"Offline",
};

const TRANSLATIONS: Record<string, Partial<I18nStrings>> = {
// Western European
de:{loading:"Laden\u2026",timeInStatus:"Zeit im Status",today:"Heute",timeline:"Zeitverlauf",noActivity:"Keine Aktivit\u00e4t an diesem Tag",failedToLoad:"Laden fehlgeschlagen:",subtitle:"Pr\u00fcfen Sie den Anwesenheitsstatus der Agenten und welchen Warteschlangen sie angeh\u00f6ren.",queues:"Warteschlangen",agents:"Agenten",searchQueues:"Warteschlangen suchen\u2026",searchAgents:"Agenten suchen\u2026",noQueuesMatch:"Keine Warteschlangen gefunden",noQueuesFound:"Keine Warteschlangen vorhanden",noAgentsMatch:"Keine Agenten gefunden",noAgentsFound:"Keine Agenten vorhanden",agentsInSelected:"Agenten in ausgew\u00e4hlten Warteschlangen",noAgentsInSelected:"Keine Agenten in ausgew\u00e4hlten Warteschlangen",you:"Sie",presenceHistory:"Anwesenheitsverlauf",queueHub:"Warteschlangen-Hub",pickDate:"Datum w\u00e4hlen",unknown:"Unbekannt",selected:"ausgew\u00e4hlt",queue_one:"Warteschlange",agent_one:"Agent",refresh:"Aktualisieren",showAgents:"Agenten anzeigen",now:"jetzt",offline:"Offline"},
fr:{loading:"Chargement\u2026",timeInStatus:"temps dans le statut",today:"Aujourd\u2019hui",timeline:"Chronologie",noActivity:"Aucune activit\u00e9 ce jour",failedToLoad:"\u00c9chec du chargement :",subtitle:"V\u00e9rifiez le statut de pr\u00e9sence des agents et les files d\u2019attente auxquelles ils appartiennent.",queues:"Files d\u2019attente",agents:"Agents",searchQueues:"Rechercher des files\u2026",searchAgents:"Rechercher des agents\u2026",noQueuesMatch:"Aucune file ne correspond",noQueuesFound:"Aucune file trouv\u00e9e",noAgentsMatch:"Aucun agent ne correspond",noAgentsFound:"Aucun agent trouv\u00e9",agentsInSelected:"Agents dans les files s\u00e9lectionn\u00e9es",noAgentsInSelected:"Aucun agent dans les files s\u00e9lectionn\u00e9es",you:"Vous",presenceHistory:"Historique de pr\u00e9sence",queueHub:"Hub de files",pickDate:"Choisir une date",unknown:"Inconnu",selected:"s\u00e9lectionn\u00e9(es)",queue_one:"file",agent_one:"agent",refresh:"Actualiser",showAgents:"Afficher les agents",now:"maintenant",offline:"Hors ligne"},
es:{loading:"Cargando\u2026",timeInStatus:"tiempo en estado",today:"Hoy",timeline:"Cronolog\u00eda",noActivity:"Sin actividad en este d\u00eda",failedToLoad:"Error al cargar:",subtitle:"Compruebe el estado de presencia de los agentes y a qu\u00e9 colas pertenecen.",queues:"Colas",agents:"Agentes",searchQueues:"Buscar colas\u2026",searchAgents:"Buscar agentes\u2026",noQueuesMatch:"Ninguna cola coincide",noQueuesFound:"No se encontraron colas",noAgentsMatch:"Ning\u00fan agente coincide",noAgentsFound:"No se encontraron agentes",agentsInSelected:"Agentes en colas seleccionadas",noAgentsInSelected:"Sin agentes en colas seleccionadas",you:"T\u00fa",presenceHistory:"Historial de presencia",queueHub:"Hub de colas",pickDate:"Elegir fecha",unknown:"Desconocido",selected:"seleccionadas",queue_one:"cola",agent_one:"agente",refresh:"Actualizar",showAgents:"Mostrar agentes",now:"ahora",offline:"Sin conexi\u00f3n"},
it:{loading:"Caricamento\u2026",timeInStatus:"tempo nello stato",today:"Oggi",timeline:"Cronologia",noActivity:"Nessuna attivit\u00e0 in questo giorno",failedToLoad:"Caricamento non riuscito:",subtitle:"Controlla lo stato di presenza degli agenti e a quali code appartengono.",queues:"Code",agents:"Agenti",searchQueues:"Cerca code\u2026",searchAgents:"Cerca agenti\u2026",noQueuesMatch:"Nessuna coda corrisponde",noQueuesFound:"Nessuna coda trovata",noAgentsMatch:"Nessun agente corrisponde",noAgentsFound:"Nessun agente trovato",agentsInSelected:"Agenti nelle code selezionate",noAgentsInSelected:"Nessun agente nelle code selezionate",you:"Tu",presenceHistory:"Cronologia presenza",queueHub:"Hub code",pickDate:"Scegli data",unknown:"Sconosciuto",selected:"selezionate",queue_one:"coda",agent_one:"agente",refresh:"Aggiorna",showAgents:"Mostra agenti",now:"adesso",offline:"Non in linea"},
"pt-BR":{loading:"Carregando\u2026",timeInStatus:"tempo no status",today:"Hoje",timeline:"Linha do tempo",noActivity:"Nenhuma atividade neste dia",failedToLoad:"Falha ao carregar:",subtitle:"Verifique o status de presen\u00e7a dos agentes e quais filas eles participam.",queues:"Filas",agents:"Agentes",searchQueues:"Pesquisar filas\u2026",searchAgents:"Pesquisar agentes\u2026",noQueuesMatch:"Nenhuma fila corresponde",noQueuesFound:"Nenhuma fila encontrada",noAgentsMatch:"Nenhum agente corresponde",noAgentsFound:"Nenhum agente encontrado",agentsInSelected:"Agentes nas filas selecionadas",noAgentsInSelected:"Nenhum agente nas filas selecionadas",you:"Voc\u00ea",presenceHistory:"Hist\u00f3rico de presen\u00e7a",queueHub:"Hub de filas",pickDate:"Escolher data",unknown:"Desconhecido",selected:"selecionadas",queue_one:"fila",agent_one:"agente",refresh:"Atualizar",showAgents:"Mostrar agentes",now:"agora",offline:"Offline"},
"pt-PT":{loading:"A carregar\u2026",timeInStatus:"tempo no estado",today:"Hoje",timeline:"Linha cronol\u00f3gica",noActivity:"Sem atividade neste dia",failedToLoad:"Falha ao carregar:",subtitle:"Verifique o estado de presen\u00e7a dos agentes e a que filas pertencem.",queues:"Filas",agents:"Agentes",searchQueues:"Procurar filas\u2026",searchAgents:"Procurar agentes\u2026",noQueuesMatch:"Nenhuma fila corresponde",noQueuesFound:"Nenhuma fila encontrada",noAgentsMatch:"Nenhum agente corresponde",noAgentsFound:"Nenhum agente encontrado",agentsInSelected:"Agentes nas filas selecionadas",noAgentsInSelected:"Nenhum agente nas filas selecionadas",you:"Voc\u00ea",presenceHistory:"Hist\u00f3rico de presen\u00e7a",queueHub:"Hub de filas",pickDate:"Escolher data",unknown:"Desconhecido",selected:"selecionadas",queue_one:"fila",agent_one:"agente",refresh:"Atualizar",showAgents:"Mostrar agentes",now:"agora",offline:"Offline"},
nl:{loading:"Laden\u2026",timeInStatus:"tijd in status",today:"Vandaag",timeline:"Tijdlijn",noActivity:"Geen activiteit op deze dag",failedToLoad:"Laden mislukt:",subtitle:"Controleer de aanwezigheidsstatus van agenten en bij welke wachtrijen ze horen.",queues:"Wachtrijen",agents:"Agenten",searchQueues:"Wachtrijen zoeken\u2026",searchAgents:"Agenten zoeken\u2026",noQueuesMatch:"Geen wachtrijen gevonden",noQueuesFound:"Geen wachtrijen beschikbaar",noAgentsMatch:"Geen agenten gevonden",noAgentsFound:"Geen agenten beschikbaar",agentsInSelected:"Agenten in geselecteerde wachtrijen",noAgentsInSelected:"Geen agenten in geselecteerde wachtrijen",you:"Jij",presenceHistory:"Aanwezigheidsoverzicht",queueHub:"Wachtrij-hub",pickDate:"Kies een datum",unknown:"Onbekend",selected:"geselecteerd",queue_one:"wachtrij",agent_one:"agent",refresh:"Vernieuwen",showAgents:"Agenten tonen",now:"nu",offline:"Offline"},
ca:{loading:"Carregant\u2026",timeInStatus:"temps en l\u2019estat",today:"Avui",timeline:"Cronologia",noActivity:"Cap activitat aquest dia",failedToLoad:"Error en carregar:",subtitle:"Consulteu l\u2019estat de pres\u00e8ncia dels agents i a quines cues pertanyen.",queues:"Cues",agents:"Agents",you:"Tu",presenceHistory:"Historial de pres\u00e8ncia",queueHub:"Hub de cues",unknown:"Desconegut",selected:"seleccionades",queue_one:"cua",agent_one:"agent",refresh:"Actualitza",showAgents:"Mostra els agents",now:"ara",offline:"Fora de l\u00ednia",searchQueues:"Cerca cues\u2026",searchAgents:"Cerca agents\u2026",noQueuesMatch:"Cap cua coincideix amb la cerca",noQueuesFound:"No s'han trobat cues",noAgentsMatch:"Cap agent coincideix amb la cerca",noAgentsFound:"No s'han trobat agents",agentsInSelected:"Agents a les cues seleccionades",noAgentsInSelected:"Cap agent a les cues seleccionades",pickDate:"Tria una data"},
eu:{loading:"Kargatzen\u2026",today:"Gaur",subtitle:"Egiaztatu agenteen presentzia-egoera eta zein ilaratan dauden.",queues:"Ilarak",agents:"Agenteak",you:"Zu",unknown:"Ezezaguna",refresh:"Freskatu",showAgents:"Erakutsi agenteak",now:"orain",offline:"Lineaz kanpo"},
gl:{loading:"Cargando\u2026",today:"Hoxe",subtitle:"Verifique o estado de presenza dos axentes e a que filas pertencen.",queues:"Filas",agents:"Axentes",you:"Ti",unknown:"Desco\u00f1ecido",refresh:"Actualizar",showAgents:"Amosar axentes",now:"agora",offline:"Sen conexi\u00f3n"},
// Nordic
da:{loading:"Indl\u00e6ser\u2026",timeInStatus:"tid i status",today:"I dag",timeline:"Tidslinje",noActivity:"Ingen aktivitet denne dag",failedToLoad:"Kunne ikke indl\u00e6se:",subtitle:"Kontroll\u00e9r agenternes tilstedev\u00e6relsesstatus og hvilke k\u00f8er de tilh\u00f8rer.",queues:"K\u00f8er",agents:"Agenter",searchQueues:"S\u00f8g k\u00f8er\u2026",searchAgents:"S\u00f8g agenter\u2026",noQueuesMatch:"Ingen k\u00f8er matcher",noQueuesFound:"Ingen k\u00f8er fundet",noAgentsMatch:"Ingen agenter matcher",noAgentsFound:"Ingen agenter fundet",agentsInSelected:"Agenter i valgte k\u00f8er",noAgentsInSelected:"Ingen agenter i valgte k\u00f8er",you:"Dig",presenceHistory:"Tilstedev\u00e6relseshistorik",queueHub:"K\u00f8-hub",pickDate:"V\u00e6lg dato",unknown:"Ukendt",selected:"valgte",queue_one:"k\u00f8",agent_one:"agent",refresh:"Opdater",showAgents:"Vis agenter",now:"nu",offline:"Offline"},
sv:{loading:"L\u00e4ser in\u2026",timeInStatus:"tid i status",today:"Idag",timeline:"Tidslinje",noActivity:"Ingen aktivitet denna dag",failedToLoad:"Det gick inte att l\u00e4sa in:",subtitle:"Kontrollera agenternas n\u00e4rvarostatus och vilka k\u00f6er de tillh\u00f6r.",queues:"K\u00f6er",agents:"Agenter",searchQueues:"S\u00f6k k\u00f6er\u2026",searchAgents:"S\u00f6k agenter\u2026",noQueuesMatch:"Inga k\u00f6er matchar",noQueuesFound:"Inga k\u00f6er hittades",noAgentsMatch:"Inga agenter matchar",noAgentsFound:"Inga agenter hittades",agentsInSelected:"Agenter i valda k\u00f6er",noAgentsInSelected:"Inga agenter i valda k\u00f6er",you:"Du",presenceHistory:"N\u00e4rvarohistorik",queueHub:"K\u00f6-hubb",pickDate:"V\u00e4lj datum",unknown:"Ok\u00e4nd",selected:"valda",queue_one:"k\u00f6",agent_one:"agent",refresh:"Uppdatera",showAgents:"Visa agenter",now:"nu",offline:"Offline"},
nb:{loading:"Laster\u2026",timeInStatus:"tid i status",today:"I dag",timeline:"Tidslinje",noActivity:"Ingen aktivitet denne dagen",failedToLoad:"Kunne ikke laste:",subtitle:"Kontroller agentenes tilstedev\u00e6relsesstatus og hvilke k\u00f8er de tilh\u00f8rer.",queues:"K\u00f8er",agents:"Agenter",searchQueues:"S\u00f8k k\u00f8er\u2026",searchAgents:"S\u00f8k agenter\u2026",noQueuesMatch:"Ingen k\u00f8er samsvarer",noQueuesFound:"Ingen k\u00f8er funnet",noAgentsMatch:"Ingen agenter samsvarer",noAgentsFound:"Ingen agenter funnet",agentsInSelected:"Agenter i valgte k\u00f8er",noAgentsInSelected:"Ingen agenter i valgte k\u00f8er",you:"Du",presenceHistory:"Tilstedev\u00e6relseshistorikk",queueHub:"K\u00f8-hub",pickDate:"Velg dato",unknown:"Ukjent",selected:"valgte",queue_one:"k\u00f8",agent_one:"agent",refresh:"Oppdater",showAgents:"Vis agenter",now:"n\u00e5",offline:"Frakoblet"},
fi:{loading:"Ladataan\u2026",timeInStatus:"aika tilassa",today:"T\u00e4n\u00e4\u00e4n",timeline:"Aikajana",noActivity:"Ei toimintaa t\u00e4n\u00e4 p\u00e4iv\u00e4n\u00e4",failedToLoad:"Lataus ep\u00e4onnistui:",subtitle:"Tarkista agenttien l\u00e4sn\u00e4olotila ja mihin jonoihin he kuuluvat.",queues:"Jonot",agents:"Agentit",searchQueues:"Hae jonoja\u2026",searchAgents:"Hae agentteja\u2026",noQueuesMatch:"Yksik\u00e4\u00e4n jono ei vastaa hakua",noQueuesFound:"Jonoja ei l\u00f6ytynyt",noAgentsMatch:"Yksik\u00e4\u00e4n agentti ei vastaa hakua",noAgentsFound:"Agentteja ei l\u00f6ytynyt",agentsInSelected:"Agentit valituissa jonoissa",noAgentsInSelected:"Ei agentteja valituissa jonoissa",you:"Sin\u00e4",presenceHistory:"L\u00e4sn\u00e4olohistoria",queueHub:"Jonokeskus",pickDate:"Valitse p\u00e4iv\u00e4",unknown:"Tuntematon",selected:"valittu",queue_one:"jono",agent_one:"agentti",refresh:"P\u00e4ivit\u00e4",showAgents:"N\u00e4yt\u00e4 agentit",now:"nyt",offline:"Offline"},
// Eastern European
pl:{loading:"\u0141adowanie\u2026",timeInStatus:"czas w statusie",today:"Dzisiaj",timeline:"O\u015b czasu",noActivity:"Brak aktywno\u015bci w tym dniu",failedToLoad:"Nie uda\u0142o si\u0119 za\u0142adowa\u0107:",subtitle:"Sprawd\u017a status obecno\u015bci agent\u00f3w i do jakich kolejek nale\u017c\u0105.",queues:"Kolejki",agents:"Agenci",searchQueues:"Szukaj kolejek\u2026",searchAgents:"Szukaj agent\u00f3w\u2026",noQueuesMatch:"Brak pasuj\u0105cych kolejek",noQueuesFound:"Nie znaleziono kolejek",noAgentsMatch:"Brak pasuj\u0105cych agent\u00f3w",noAgentsFound:"Nie znaleziono agent\u00f3w",agentsInSelected:"Agenci w wybranych kolejkach",noAgentsInSelected:"Brak agent\u00f3w w wybranych kolejkach",you:"Ty",presenceHistory:"Historia obecno\u015bci",queueHub:"Centrum kolejek",pickDate:"Wybierz dat\u0119",unknown:"Nieznany",selected:"wybrane",queue_one:"kolejka",agent_one:"agent",refresh:"Od\u015bwie\u017c",showAgents:"Poka\u017c agent\u00f3w",now:"teraz",offline:"Offline"},
cs:{loading:"Na\u010d\u00edt\u00e1n\u00ed\u2026",timeInStatus:"\u010das ve stavu",today:"Dnes",timeline:"\u010casov\u00e1 osa",noActivity:"\u017d\u00e1dn\u00e1 aktivita v tento den",failedToLoad:"Nepoda\u0159ilo se na\u010d\u00edst:",subtitle:"Zkontrolujte stav p\u0159\u00edtomnosti agent\u016f a do jak\u00fdch front pat\u0159\u00ed.",queues:"Fronty",agents:"Agenti",searchQueues:"Hledat fronty\u2026",searchAgents:"Hledat agenty\u2026",noQueuesMatch:"\u017d\u00e1dn\u00e1 fronta neodpov\u00edd\u00e1",noQueuesFound:"\u017d\u00e1dn\u00e9 fronty nenalezeny",noAgentsMatch:"\u017d\u00e1dn\u00fd agent neodpov\u00edd\u00e1",noAgentsFound:"\u017d\u00e1dn\u00ed agenti nenalezeni",agentsInSelected:"Agenti ve vybran\u00fdch front\u00e1ch",noAgentsInSelected:"\u017d\u00e1dn\u00ed agenti ve vybran\u00fdch front\u00e1ch",you:"Vy",presenceHistory:"Historie p\u0159\u00edtomnosti",queueHub:"Centrum front",pickDate:"Vybrat datum",unknown:"Nezn\u00e1m\u00fd",selected:"vybr\u00e1no",queue_one:"fronta",agent_one:"agent",refresh:"Obnovit",showAgents:"Zobrazit agenty",now:"nyn\u00ed",offline:"Offline"},
hu:{loading:"Bet\u00f6lt\u00e9s\u2026",timeInStatus:"id\u0151 az \u00e1llapotban",today:"Ma",timeline:"Id\u0151vonal",noActivity:"Nincs tev\u00e9kenys\u00e9g ezen a napon",failedToLoad:"Bet\u00f6lt\u00e9s sikertelen:",subtitle:"Ellen\u0151rizze az \u00fcgyn\u00f6k\u00f6k jelenl\u00e9ti \u00e1llapot\u00e1t \u00e9s hogy mely sorokhoz tartoznak.",queues:"Sorok",agents:"\u00dcgyn\u00f6k\u00f6k",searchQueues:"Sorok keres\u00e9se\u2026",searchAgents:"\u00dcgyn\u00f6k\u00f6k keres\u00e9se\u2026",noQueuesMatch:"Nincs egyez\u0151 sor",noQueuesFound:"Nem tal\u00e1lhat\u00f3 sor",noAgentsMatch:"Nincs egyez\u0151 \u00fcgyn\u00f6k",noAgentsFound:"Nem tal\u00e1lhat\u00f3 \u00fcgyn\u00f6k",agentsInSelected:"\u00dcgyn\u00f6k\u00f6k a kiv\u00e1lasztott sorokban",noAgentsInSelected:"Nincs \u00fcgyn\u00f6k a kiv\u00e1lasztott sorokban",you:"\u00d6n",presenceHistory:"Jelenl\u00e9ti el\u0151zm\u00e9nyek",queueHub:"Sor-k\u00f6zpont",pickDate:"D\u00e1tum v\u00e1laszt\u00e1sa",unknown:"Ismeretlen",selected:"kiv\u00e1lasztva",queue_one:"sor",agent_one:"\u00fcgyn\u00f6k",refresh:"Friss\u00edt\u00e9s",showAgents:"\u00dcgyn\u00f6k\u00f6k megjelen\u00edt\u00e9se",now:"most",offline:"Offline"},
ro:{loading:"\u00cencarc\u0103\u2026",timeInStatus:"timp \u00een stare",today:"Ast\u0103zi",timeline:"Cronologie",noActivity:"Nicio activitate \u00een aceast\u0103 zi",failedToLoad:"\u00cencarcare e\u015fuat\u0103:",subtitle:"Verifica\u021bi starea de prezen\u021b\u0103 a agen\u021bilor \u0219i la ce cozi apar\u021bin.",queues:"Cozi",agents:"Agen\u021bi",searchQueues:"C\u0103uta\u021bi cozi\u2026",searchAgents:"C\u0103uta\u021bi agen\u021bi\u2026",noQueuesMatch:"Nicio coad\u0103 nu corespunde",noQueuesFound:"Nicio coad\u0103 g\u0103sit\u0103",noAgentsMatch:"Niciun agent nu corespunde",noAgentsFound:"Niciun agent g\u0103sit",agentsInSelected:"Agen\u021bi \u00een cozile selectate",noAgentsInSelected:"Niciun agent \u00een cozile selectate",you:"Tu",presenceHistory:"Istoric prezen\u021b\u0103",queueHub:"Hub cozi",pickDate:"Alege data",unknown:"Necunoscut",selected:"selectate",queue_one:"coad\u0103",agent_one:"agent",refresh:"Actualizeaz\u0103",showAgents:"Afi\u0219eaz\u0103 agen\u021bii",now:"acum",offline:"Offline"},
ru:{loading:"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430\u2026",timeInStatus:"\u0432\u0440\u0435\u043c\u044f \u0432 \u0441\u0442\u0430\u0442\u0443\u0441\u0435",today:"\u0421\u0435\u0433\u043e\u0434\u043d\u044f",timeline:"\u0425\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0438\u044f",noActivity:"\u041d\u0435\u0442 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0438 \u0432 \u044d\u0442\u043e\u0442 \u0434\u0435\u043d\u044c",failedToLoad:"\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c:",subtitle:"\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0439\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044f \u0430\u0433\u0435\u043d\u0442\u043e\u0432 \u0438 \u043a \u043a\u0430\u043a\u0438\u043c \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u043c \u043e\u043d\u0438 \u043e\u0442\u043d\u043e\u0441\u044f\u0442\u0441\u044f.",queues:"\u041e\u0447\u0435\u0440\u0435\u0434\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u044b",searchQueues:"\u041f\u043e\u0438\u0441\u043a \u043e\u0447\u0435\u0440\u0435\u0434\u0435\u0439\u2026",searchAgents:"\u041f\u043e\u0438\u0441\u043a \u0430\u0433\u0435\u043d\u0442\u043e\u0432\u2026",noQueuesMatch:"\u041e\u0447\u0435\u0440\u0435\u0434\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b",noQueuesFound:"\u041e\u0447\u0435\u0440\u0435\u0434\u0438 \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0442",noAgentsMatch:"\u0410\u0433\u0435\u043d\u0442\u044b \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b",noAgentsFound:"\u0410\u0433\u0435\u043d\u0442\u044b \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0442",agentsInSelected:"\u0410\u0433\u0435\u043d\u0442\u044b \u0432 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u0445",noAgentsInSelected:"\u041d\u0435\u0442 \u0430\u0433\u0435\u043d\u0442\u043e\u0432 \u0432 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u0445",you:"\u0412\u044b",presenceHistory:"\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044f",queueHub:"\u0426\u0435\u043d\u0442\u0440 \u043e\u0447\u0435\u0440\u0435\u0434\u0435\u0439",pickDate:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0434\u0430\u0442\u0443",unknown:"\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",selected:"\u0432\u044b\u0431\u0440\u0430\u043d\u043e",queue_one:"\u043e\u0447\u0435\u0440\u0435\u0434\u044c",agent_one:"\u0430\u0433\u0435\u043d\u0442",refresh:"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c",showAgents:"\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0430\u0433\u0435\u043d\u0442\u043e\u0432",now:"\u0441\u0435\u0439\u0447\u0430\u0441",offline:"\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438"},
tr:{loading:"Y\u00fckleniyor\u2026",timeInStatus:"durumdaki s\u00fcre",today:"Bug\u00fcn",timeline:"Zaman \u00e7izelgesi",noActivity:"Bu g\u00fcn etkinlik yok",failedToLoad:"Y\u00fcklenemedi:",subtitle:"Temsilcilerin durum bilgisini ve hangi kuyruklara ait olduklar\u0131n\u0131 kontrol edin.",queues:"Kuyruklar",agents:"Temsilciler",searchQueues:"Kuyruk ara\u2026",searchAgents:"Temsilci ara\u2026",noQueuesMatch:"E\u015fle\u015fen kuyruk yok",noQueuesFound:"Kuyruk bulunamad\u0131",noAgentsMatch:"E\u015fle\u015fen temsilci yok",noAgentsFound:"Temsilci bulunamad\u0131",agentsInSelected:"Se\u00e7ili kuyruklardaki temsilciler",noAgentsInSelected:"Se\u00e7ili kuyruklarda temsilci yok",you:"Siz",presenceHistory:"Durum ge\u00e7mi\u015fi",queueHub:"Kuyruk merkezi",pickDate:"Tarih se\u00e7in",unknown:"Bilinmiyor",selected:"se\u00e7ili",queue_one:"kuyruk",agent_one:"temsilci",refresh:"Yenile",showAgents:"Temsilcileri g\u00f6ster",now:"\u015fimdi",offline:"\u00c7evrimd\u0131\u015f\u0131"},
// Baltics & Balkans
hr:{loading:"U\u010ditavanje\u2026",timeInStatus:"vrijeme u statusu",today:"Danas",timeline:"Vremenska crta",noActivity:"Nema aktivnosti ovog dana",failedToLoad:"Neuspjelo u\u010ditavanje:",subtitle:"Provjerite status prisutnosti agenata i kojim redovima pripadaju.",queues:"Redovi",agents:"Agenti",you:"Vi",presenceHistory:"Povijest prisutnosti",queueHub:"Sredi\u0161te redova",unknown:"Nepoznato",selected:"odabrano",queue_one:"red",agent_one:"agent",refresh:"Osvje\u017ei",showAgents:"Prika\u017ei agente",now:"sada",offline:"Izvan mre\u017ee",searchQueues:"Pretra\u017ei redove\u2026",searchAgents:"Pretra\u017ei agente\u2026",noQueuesMatch:"Nema redova koji odgovaraju pretrazi",noQueuesFound:"Nema prona\u0111enih redova",noAgentsMatch:"Nema agenata koji odgovaraju pretrazi",noAgentsFound:"Nema prona\u0111enih agenata",agentsInSelected:"Agenti u odabranim redovima",noAgentsInSelected:"Nema agenata u odabranim redovima",pickDate:"Odaberi datum"},
sk:{loading:"Na\u010d\u00edtava sa\u2026",timeInStatus:"\u010das v stave",today:"Dnes",timeline:"\u010casov\u00e1 os",subtitle:"Skontrolujte stav pr\u00edtomnosti agentov a do ak\u00fdch frontov patria.",queues:"Fronty",agents:"Agenti",you:"Vy",presenceHistory:"Hist\u00f3ria pr\u00edtomnosti",queueHub:"Centrum frontov",unknown:"Nezn\u00e1my",selected:"vybran\u00e9",queue_one:"front",agent_one:"agent",refresh:"Obnovi\u0165",showAgents:"Zobrazi\u0165 agentov",now:"teraz",offline:"Offline",noActivity:"\u017diadna aktivita v tento de\u0148",failedToLoad:"Na\u010d\u00edtanie zlyhalo:",searchQueues:"H\u013eada\u0165 fronty\u2026",searchAgents:"H\u013eada\u0165 agentov\u2026",noQueuesMatch:"\u017diadne fronty nezodpovedaj\u00fa h\u013eadaniu",noQueuesFound:"Nena\u0161li sa \u017eiadne fronty",noAgentsMatch:"\u017diadni agenti nezodpovedaj\u00fa h\u013eadaniu",noAgentsFound:"Nena\u0161li sa \u017eiadni agenti",agentsInSelected:"Agenti vo vybran\u00fdch frontoch",noAgentsInSelected:"\u017diadni agenti vo vybran\u00fdch frontoch",pickDate:"Vybra\u0165 d\u00e1tum"},
sl:{loading:"Nalaganje\u2026",timeInStatus:"\u010das v stanju",today:"Danes",subtitle:"Preverite stanje prisotnosti agentov in katerim vrstam pripadajo.",queues:"Vrste",agents:"Agenti",you:"Vi",presenceHistory:"Zgodovina prisotnosti",queueHub:"Sredi\u0161\u010de vrst",unknown:"Neznano",selected:"izbrano",queue_one:"vrsta",agent_one:"agent",refresh:"Osve\u017ei",showAgents:"Prika\u017ei agente",now:"zdaj",offline:"Nepovezan",timeline:"\u010casovnica",noActivity:"Na ta dan ni dejavnosti",failedToLoad:"Nalaganje ni uspelo:",searchQueues:"I\u0161\u010di vrste\u2026",searchAgents:"I\u0161\u010di agente\u2026",noQueuesMatch:"Nobena vrsta ne ustreza iskanju",noQueuesFound:"Ni najdenih vrst",noAgentsMatch:"Noben agent ne ustreza iskanju",noAgentsFound:"Ni najdenih agentov",agentsInSelected:"Agenti v izbranih vrstah",noAgentsInSelected:"Ni agentov v izbranih vrstah",pickDate:"Izberi datum"},
et:{loading:"Laadimine\u2026",today:"T\u00e4na",subtitle:"Kontrollige agentide kohaloleku olekut ja millistes j\u00e4rjekordades nad on.",queues:"J\u00e4rjekorrad",agents:"Agendid",you:"Sina",unknown:"Tundmatu",refresh:"V\u00e4rskenda",showAgents:"Kuva agendid",now:"praegu",offline:"Offline"},
lv:{loading:"Iel\u0101d\u0113\u2026",today:"\u0160odien",subtitle:"P\u0101rbaudiet a\u0123entu kl\u0101tb\u016btnes statusu un kur\u0101m rind\u0101m vi\u0146i pieder.",queues:"Rindas",agents:"A\u0123enti",you:"J\u016bs",unknown:"Nezin\u0101ms",refresh:"Atsvaidzin\u0101t",showAgents:"R\u0101d\u012bt a\u0123entus",now:"tagad",offline:"Bezsaiste"},
lt:{loading:"Kraunama\u2026",today:"\u0160iandien",subtitle:"Patikrinkite agent\u0173 buvimo b\u016bsen\u0105 ir kurioms eil\u0117ms jie priklauso.",queues:"Eil\u0117s",agents:"Agentai",you:"J\u016bs",unknown:"Ne\u017einoma",refresh:"Atnaujinti",showAgents:"Rodyti agentus",now:"dabar",offline:"Neprisijung\u0119s"},
bg:{loading:"\u0417\u0430\u0440\u0435\u0436\u0434\u0430\u043d\u0435\u2026",today:"\u0414\u043d\u0435\u0441",subtitle:"\u041f\u0440\u043e\u0432\u0435\u0440\u0435\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u043d\u0430 \u043f\u0440\u0438\u0441\u044a\u0441\u0442\u0432\u0438\u0435 \u043d\u0430 \u0430\u0433\u0435\u043d\u0442\u0438\u0442\u0435 \u0438 \u0432 \u043a\u043e\u0438 \u043e\u043f\u0430\u0448\u043a\u0438 \u0443\u0447\u0430\u0441\u0442\u0432\u0430\u0442.",queues:"\u041e\u043f\u0430\u0448\u043a\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u0438",you:"\u0412\u0438\u0435",unknown:"\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",refresh:"\u041e\u043f\u0440\u0435\u0441\u043d\u0438",showAgents:"\u041f\u043e\u043a\u0430\u0436\u0438 \u0430\u0433\u0435\u043d\u0442\u0438\u0442\u0435",now:"\u0441\u0435\u0433\u0430",offline:"\u0418\u0437\u0432\u044a\u043d \u043b\u0438\u043d\u0438\u044f"},
sr:{loading:"\u0423\u0447\u0438\u0442\u0430\u0432\u0430\u045a\u0435\u2026",today:"\u0414\u0430\u043d\u0430\u0441",subtitle:"\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u0438\u0441\u0443\u0441\u0442\u0432\u0430 \u0430\u0433\u0435\u043d\u0430\u0442\u0430 \u0438 \u043a\u043e\u0458\u0438\u043c \u0440\u0435\u0434\u043e\u0432\u0438\u043c\u0430 \u043f\u0440\u0438\u043f\u0430\u0434\u0430\u0458\u0443.",queues:"\u0420\u0435\u0434\u043e\u0432\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u0438",you:"\u0412\u0438",unknown:"\u041d\u0435\u043f\u043e\u0437\u043d\u0430\u0442\u043e",refresh:"\u041e\u0441\u0432\u0435\u0436\u0438",showAgents:"\u041f\u0440\u0438\u043a\u0430\u0436\u0438 \u0430\u0433\u0435\u043d\u0442\u0435",now:"\u0441\u0430\u0434\u0430",offline:"\u041d\u0438\u0458\u0435 \u043d\u0430 \u043c\u0440\u0435\u0436\u0438"},
uk:{loading:"\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f\u2026",timeInStatus:"\u0447\u0430\u0441 \u0443 \u0441\u0442\u0430\u0442\u0443\u0441\u0456",today:"\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456",subtitle:"\u041f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u0438\u0441\u0443\u0442\u043d\u043e\u0441\u0442\u0456 \u0430\u0433\u0435\u043d\u0442\u0456\u0432 \u0442\u0430 \u0434\u043e \u044f\u043a\u0438\u0445 \u0447\u0435\u0440\u0433 \u0432\u043e\u043d\u0438 \u043d\u0430\u043b\u0435\u0436\u0430\u0442\u044c.",queues:"\u0427\u0435\u0440\u0433\u0438",agents:"\u0410\u0433\u0435\u043d\u0442\u0438",you:"\u0412\u0438",presenceHistory:"\u0406\u0441\u0442\u043e\u0440\u0456\u044f \u043f\u0440\u0438\u0441\u0443\u0442\u043d\u043e\u0441\u0442\u0456",queueHub:"\u0426\u0435\u043d\u0442\u0440 \u0447\u0435\u0440\u0433",unknown:"\u041d\u0435\u0432\u0456\u0434\u043e\u043c\u043e",selected:"\u0432\u0438\u0431\u0440\u0430\u043d\u043e",queue_one:"\u0447\u0435\u0440\u0433\u0430",agent_one:"\u0430\u0433\u0435\u043d\u0442",refresh:"\u041e\u043d\u043e\u0432\u0438\u0442\u0438",showAgents:"\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 \u0430\u0433\u0435\u043d\u0442\u0456\u0432",now:"\u0437\u0430\u0440\u0430\u0437",offline:"\u041d\u0435 \u0432 \u043c\u0435\u0440\u0435\u0436\u0456",timeline:"\u0425\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0456\u044f",noActivity:"\u041d\u0435\u043c\u0430\u0454 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0456 \u0446\u044c\u043e\u0433\u043e \u0434\u043d\u044f",failedToLoad:"\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438:",searchQueues:"\u041f\u043e\u0448\u0443\u043a \u0447\u0435\u0440\u0433\u2026",searchAgents:"\u041f\u043e\u0448\u0443\u043a \u0430\u0433\u0435\u043d\u0442\u0456\u0432\u2026",noQueuesMatch:"\u0416\u043e\u0434\u043d\u0430 \u0447\u0435\u0440\u0433\u0430 \u043d\u0435 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0430\u0454 \u043f\u043e\u0448\u0443\u043a\u0443",noQueuesFound:"\u0427\u0435\u0440\u0433\u0438 \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e",noAgentsMatch:"\u0416\u043e\u0434\u0435\u043d \u0430\u0433\u0435\u043d\u0442 \u043d\u0435 \u0432\u0456\u0434\u043f\u043e\u0432\u0456\u0434\u0430\u0454 \u043f\u043e\u0448\u0443\u043a\u0443",noAgentsFound:"\u0410\u0433\u0435\u043d\u0442\u0456\u0432 \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e",agentsInSelected:"\u0410\u0433\u0435\u043d\u0442\u0438 \u0432 \u043e\u0431\u0440\u0430\u043d\u0438\u0445 \u0447\u0435\u0440\u0433\u0430\u0445",noAgentsInSelected:"\u041d\u0435\u043c\u0430\u0454 \u0430\u0433\u0435\u043d\u0442\u0456\u0432 \u0432 \u043e\u0431\u0440\u0430\u043d\u0438\u0445 \u0447\u0435\u0440\u0433\u0430\u0445",pickDate:"\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0434\u0430\u0442\u0443"},
el:{loading:"\u03a6\u03cc\u03c1\u03c4\u03c9\u03c3\u03b7\u2026",timeInStatus:"\u03c7\u03c1\u03cc\u03bd\u03bf\u03c2 \u03c3\u03b5 \u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7",today:"\u03a3\u03ae\u03bc\u03b5\u03c1\u03b1",subtitle:"\u0395\u03bb\u03ad\u03b3\u03be\u03c4\u03b5 \u03c4\u03b7\u03bd \u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7 \u03c0\u03b1\u03c1\u03bf\u03c5\u03c3\u03af\u03b1\u03c2 \u03c4\u03c9\u03bd \u03c0\u03c1\u03b1\u03ba\u03c4\u03cc\u03c1\u03c9\u03bd \u03ba\u03b1\u03b9 \u03c3\u03b5 \u03c0\u03bf\u03b9\u03b5\u03c2 \u03bf\u03c5\u03c1\u03ad\u03c2 \u03b1\u03bd\u03ae\u03ba\u03bf\u03c5\u03bd.",queues:"\u039f\u03c5\u03c1\u03ad\u03c2",agents:"\u03a0\u03c1\u03ac\u03ba\u03c4\u03bf\u03c1\u03b5\u03c2",you:"\u0395\u03c3\u03b5\u03af\u03c2",unknown:"\u0386\u03b3\u03bd\u03c9\u03c3\u03c4\u03bf",refresh:"\u0391\u03bd\u03b1\u03bd\u03ad\u03c9\u03c3\u03b7",showAgents:"\u0395\u03bc\u03c6\u03ac\u03bd\u03b9\u03c3\u03b7 \u03b1\u03bd\u03c4\u03b9\u03c0\u03c1\u03bf\u03c3\u03ce\u03c0\u03c9\u03bd",now:"\u03c4\u03ce\u03c1\u03b1",offline:"\u0395\u03ba\u03c4\u03cc\u03c2 \u03c3\u03cd\u03bd\u03b4\u03b5\u03c3\u03b7\u03c2"},
kk:{loading:"\u0416\u04af\u043a\u0442\u0435\u043b\u0443\u0434\u0435\u2026",today:"\u0411\u04af\u0433\u0456\u043d",subtitle:"\u0410\u0433\u0435\u043d\u0442\u0442\u0435\u0440\u0434\u0456\u04a3 \u049b\u0430\u0442\u044b\u0441\u0443 \u043c\u04d9\u0440\u0442\u0435\u0431\u0435\u0441\u0456\u043d \u0436\u04d9\u043d\u0435 \u043e\u043b\u0430\u0440 \u049b\u0430\u043d\u0434\u0430\u0439 \u043a\u0435\u0437\u0435\u043a\u0442\u0435\u0440\u0433\u0435 \u0436\u0430\u0442\u0430\u0442\u044b\u043d\u044b\u043d \u0442\u0435\u043a\u0441\u0435\u0440\u0456\u04a3\u0456\u0437.",queues:"\u041a\u0435\u0437\u0435\u043a\u0442\u0435\u0440",agents:"\u0410\u0433\u0435\u043d\u0442\u0442\u0435\u0440",you:"\u0421\u0456\u0437",unknown:"\u0411\u0435\u043b\u0433\u0456\u0441\u0456\u0437",refresh:"\u0416\u0430\u04a3\u0430\u0440\u0442\u0443",showAgents:"\u0410\u0433\u0435\u043d\u0442\u0442\u0435\u0440\u0434\u0456 \u043a\u04e9\u0440\u0441\u0435\u0442\u0443",now:"\u049b\u0430\u0437\u0456\u0440",offline:"\u0416\u0435\u043b\u0456\u0434\u0435 \u0435\u043c\u0435\u0441"},
// Asian
ja:{loading:"\u8aad\u307f\u8fbc\u307f\u4e2d\u2026",timeInStatus:"\u30b9\u30c6\u30fc\u30bf\u30b9\u306e\u7d4c\u904e\u6642\u9593",today:"\u4eca\u65e5",timeline:"\u30bf\u30a4\u30e0\u30e9\u30a4\u30f3",noActivity:"\u3053\u306e\u65e5\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u306f\u3042\u308a\u307e\u305b\u3093",failedToLoad:"\u8aad\u307f\u8fbc\u307f\u5931\u6557:",subtitle:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u30d7\u30ec\u30bc\u30f3\u30b9\u72b6\u614b\u3068\u6240\u5c5e\u30ad\u30e5\u30fc\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002",queues:"\u30ad\u30e5\u30fc",agents:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",searchQueues:"\u30ad\u30e5\u30fc\u3092\u691c\u7d22\u2026",searchAgents:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u691c\u7d22\u2026",noQueuesMatch:"\u4e00\u81f4\u3059\u308b\u30ad\u30e5\u30fc\u304c\u3042\u308a\u307e\u305b\u3093",noQueuesFound:"\u30ad\u30e5\u30fc\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093",noAgentsMatch:"\u4e00\u81f4\u3059\u308b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u3044\u307e\u305b\u3093",noAgentsFound:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093",agentsInSelected:"\u9078\u629e\u3057\u305f\u30ad\u30e5\u30fc\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",noAgentsInSelected:"\u9078\u629e\u3057\u305f\u30ad\u30e5\u30fc\u306b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u3044\u307e\u305b\u3093",you:"\u81ea\u5206",presenceHistory:"\u30d7\u30ec\u30bc\u30f3\u30b9\u5c65\u6b74",queueHub:"\u30ad\u30e5\u30fc\u30cf\u30d6",pickDate:"\u65e5\u4ed8\u3092\u9078\u629e",unknown:"\u4e0d\u660e",selected:"\u9078\u629e\u6e08\u307f",queue_one:"\u30ad\u30e5\u30fc",agent_one:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",refresh:"\u66f4\u65b0",showAgents:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u8868\u793a",now:"\u73fe\u5728",offline:"\u30aa\u30d5\u30e9\u30a4\u30f3"},
ko:{loading:"\uB85C\uB4DC \uC911\u2026",timeInStatus:"\uC0C1\uD0DC \uC9C0\uC18D \uC2DC\uAC04",today:"\uC624\uB298",timeline:"\uD0C0\uC784\uB77C\uC778",noActivity:"\uC774 \uB0A0\uC758 \uD65C\uB3D9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",failedToLoad:"\uB85C\uB4DC \uC2E4\uD328:",subtitle:"\uC5D0\uC774\uC804\uD2B8\uC758 \uD504\uB808\uC804\uC2A4 \uC0C1\uD0DC\uC640 \uC18C\uC18D \uB300\uAE30\uC5F4\uC744 \uD655\uC778\uD558\uC138\uC694.",queues:"\uB300\uAE30\uC5F4",agents:"\uC5D0\uC774\uC804\uD2B8",searchQueues:"\uB300\uAE30\uC5F4 \uAC80\uC0C9\u2026",searchAgents:"\uC5D0\uC774\uC804\uD2B8 \uAC80\uC0C9\u2026",noQueuesMatch:"\uC77C\uCE58\uD558\uB294 \uB300\uAE30\uC5F4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",noQueuesFound:"\uB300\uAE30\uC5F4\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4",noAgentsMatch:"\uC77C\uCE58\uD558\uB294 \uC5D0\uC774\uC804\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",noAgentsFound:"\uC5D0\uC774\uC804\uD2B8\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4",agentsInSelected:"\uC120\uD0DD\uD55C \uB300\uAE30\uC5F4\uC758 \uC5D0\uC774\uC804\uD2B8",noAgentsInSelected:"\uC120\uD0DD\uD55C \uB300\uAE30\uC5F4\uC5D0 \uC5D0\uC774\uC804\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",you:"\uB098",presenceHistory:"\uD504\uB808\uC804\uC2A4 \uAE30\uB85D",queueHub:"\uB300\uAE30\uC5F4 \uD5C8\uBE0C",pickDate:"\uB0A0\uC9DC \uC120\uD0DD",unknown:"\uC54C \uC218 \uC5C6\uC74C",selected:"\uC120\uD0DD\uB428",queue_one:"\uB300\uAE30\uC5F4",agent_one:"\uC5D0\uC774\uC804\uD2B8",refresh:"\uC0C8\uB85C \uACE0\uCE68",showAgents:"\uC5D0\uC774\uC804\uD2B8 \uD45C\uC2DC",now:"\uC9C0\uAE08",offline:"\uC624\uD504\uB77C\uC778"},
"zh-CN":{loading:"\u52A0\u8F7D\u4E2D\u2026",timeInStatus:"\u72B6\u6001\u6301\u7EED\u65F6\u95F4",today:"\u4ECA\u5929",timeline:"\u65F6\u95F4\u7EBF",noActivity:"\u5F53\u5929\u65E0\u6D3B\u52A8",failedToLoad:"\u52A0\u8F7D\u5931\u8D25\uFF1A",subtitle:"\u67E5\u770B\u5EA7\u5E2D\u7684\u5728\u7EBF\u72B6\u6001\u53CA\u5176\u6240\u5C5E\u961F\u5217\u3002",queues:"\u961F\u5217",agents:"\u5EA7\u5E2D",searchQueues:"\u641C\u7D22\u961F\u5217\u2026",searchAgents:"\u641C\u7D22\u5EA7\u5E2D\u2026",noQueuesMatch:"\u6CA1\u6709\u5339\u914D\u7684\u961F\u5217",noQueuesFound:"\u672A\u627E\u5230\u961F\u5217",noAgentsMatch:"\u6CA1\u6709\u5339\u914D\u7684\u5EA7\u5E2D",noAgentsFound:"\u672A\u627E\u5230\u5EA7\u5E2D",agentsInSelected:"\u5DF2\u9009\u961F\u5217\u4E2D\u7684\u5EA7\u5E2D",noAgentsInSelected:"\u5DF2\u9009\u961F\u5217\u4E2D\u6CA1\u6709\u5EA7\u5E2D",you:"\u6211",presenceHistory:"\u5728\u7EBF\u5386\u53F2",queueHub:"\u961F\u5217\u4E2D\u5FC3",pickDate:"\u9009\u62E9\u65E5\u671F",unknown:"\u672A\u77E5",selected:"\u5DF2\u9009",queue_one:"\u961F\u5217",agent_one:"\u5EA7\u5E2D",refresh:"\u5237\u65B0",showAgents:"\u663E\u793A\u5EA7\u5E2D",now:"\u73B0\u5728",offline:"\u79BB\u7EBF"},
"zh-TW":{loading:"\u8F09\u5165\u4E2D\u2026",timeInStatus:"\u72C0\u614B\u6301\u7E8C\u6642\u9593",today:"\u4ECA\u5929",timeline:"\u6642\u9593\u8EF8",noActivity:"\u7576\u5929\u7121\u6D3B\u52D5",failedToLoad:"\u8F09\u5165\u5931\u6557\uFF1A",subtitle:"\u67E5\u770B\u5C08\u54E1\u7684\u5728\u7DDA\u72C0\u614B\u53CA\u5176\u6240\u5C6C\u4F47\u5217\u3002",queues:"\u4F47\u5217",agents:"\u5C08\u54E1",searchQueues:"\u641C\u5C0B\u4F47\u5217\u2026",searchAgents:"\u641C\u5C0B\u5C08\u54E1\u2026",noQueuesMatch:"\u6C92\u6709\u7B26\u5408\u7684\u4F47\u5217",noQueuesFound:"\u627E\u4E0D\u5230\u4F47\u5217",noAgentsMatch:"\u6C92\u6709\u7B26\u5408\u7684\u5C08\u54E1",noAgentsFound:"\u627E\u4E0D\u5230\u5C08\u54E1",agentsInSelected:"\u5DF2\u9078\u4F47\u5217\u4E2D\u7684\u5C08\u54E1",noAgentsInSelected:"\u5DF2\u9078\u4F47\u5217\u4E2D\u6C92\u6709\u5C08\u54E1",you:"\u6211",presenceHistory:"\u5728\u7DDA\u6B77\u53F2",queueHub:"\u4F47\u5217\u4E2D\u5FC3",pickDate:"\u9078\u64C7\u65E5\u671F",unknown:"\u672A\u77E5",selected:"\u5DF2\u9078",queue_one:"\u4F47\u5217",agent_one:"\u5C08\u54E1",refresh:"\u91CD\u65B0\u6574\u7406",showAgents:"\u986F\u793A\u5C08\u54E1",now:"\u73FE\u5728",offline:"\u96E2\u7DDA"},
"zh-HK":{loading:"\u8F09\u5165\u4E2D\u2026",today:"\u4ECA\u65E5",subtitle:"\u67E5\u770B\u5C08\u54E1\u7684\u5728\u7DDA\u72C0\u614B\u53CA\u5176\u6240\u5C6C\u4F47\u5217\u3002",queues:"\u4F47\u5217",agents:"\u5C08\u54E1",you:"\u6211",unknown:"\u672A\u77E5",refresh:"\u91CD\u65B0\u6574\u7406"},
// Middle Eastern
ar:{loading:"\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644\u2026",timeInStatus:"\u0627\u0644\u0648\u0642\u062A \u0641\u064A \u0627\u0644\u062D\u0627\u0644\u0629",today:"\u0627\u0644\u064A\u0648\u0645",timeline:"\u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064A",noActivity:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0646\u0634\u0627\u0637 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645",failedToLoad:"\u0641\u0634\u0644 \u0627\u0644\u062A\u062D\u0645\u064A\u0644:",subtitle:"\u062A\u062D\u0642\u0642 \u0645\u0646 \u062D\u0627\u0644\u0629 \u062A\u0648\u0627\u062C\u062F \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0648\u0627\u0644\u0637\u0648\u0627\u0628\u064A\u0631 \u0627\u0644\u062A\u064A \u064A\u0646\u062A\u0645\u0648\u0646 \u0625\u0644\u064A\u0647\u0627.",queues:"\u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631",agents:"\u0627\u0644\u0648\u0643\u0644\u0627\u0621",searchQueues:"\u0628\u062D\u062B \u0641\u064A \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631\u2026",searchAgents:"\u0628\u062D\u062B \u0639\u0646 \u0648\u0643\u0644\u0627\u0621\u2026",noQueuesMatch:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0648\u0627\u0626\u0645 \u0645\u0637\u0627\u0628\u0642\u0629",noQueuesFound:"\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0642\u0648\u0627\u0626\u0645",noAgentsMatch:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0643\u0644\u0627\u0621 \u0645\u0637\u0627\u0628\u0642\u0648\u0646",noAgentsFound:"\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0648\u0643\u0644\u0627\u0621",agentsInSelected:"\u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0641\u064A \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u062D\u062F\u062F\u0629",noAgentsInSelected:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0643\u0644\u0627\u0621 \u0641\u064A \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u062D\u062F\u062F\u0629",you:"\u0623\u0646\u062A",presenceHistory:"\u0633\u062C\u0644 \u0627\u0644\u062A\u0648\u0627\u062C\u062F",queueHub:"\u0645\u0631\u0643\u0632 \u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631",pickDate:"\u0627\u062E\u062A\u0631 \u062A\u0627\u0631\u064A\u062E\u0627\u064B",unknown:"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641",selected:"\u0645\u062D\u062F\u062F",queue_one:"\u0642\u0627\u0626\u0645\u0629",agent_one:"\u0648\u0643\u064A\u0644",refresh:"\u062A\u062D\u062F\u064A\u062B",showAgents:"\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0648\u0643\u0644\u0627\u0621",now:"\u0627\u0644\u0622\u0646",offline:"\u063A\u064A\u0631 \u0645\u062A\u0635\u0644"},
he:{loading:"\u05D8\u05D5\u05E2\u05DF\u2026",timeInStatus:"\u05D6\u05DE\u05DF \u05D1\u05DE\u05E6\u05D1",today:"\u05D4\u05D9\u05D5\u05DD",timeline:"\u05E6\u05D9\u05E8 \u05D6\u05DE\u05DF",noActivity:"\u05D0\u05D9\u05DF \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA \u05D1\u05D9\u05D5\u05DD \u05D6\u05D4",failedToLoad:"\u05D8\u05E2\u05D9\u05E0\u05D4 \u05E0\u05DB\u05E9\u05DC\u05D4:",subtitle:"\u05D1\u05D3\u05D5\u05E7 \u05D0\u05EA \u05DE\u05E6\u05D1 \u05D4\u05E0\u05D5\u05DB\u05D7\u05D5\u05EA \u05E9\u05DC \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD \u05D5\u05DC\u05D0\u05D9\u05DC\u05D5 \u05EA\u05D5\u05E8\u05D9\u05DD \u05D4\u05DD \u05E9\u05D9\u05D9\u05DB\u05D9\u05DD.",queues:"\u05EA\u05D5\u05E8\u05D9\u05DD",agents:"\u05E0\u05E6\u05D9\u05D2\u05D9\u05DD",you:"\u05D0\u05EA\u05D4",presenceHistory:"\u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05E0\u05D5\u05DB\u05D7\u05D5\u05EA",queueHub:"\u05DE\u05E8\u05DB\u05D6 \u05EA\u05D5\u05E8\u05D9\u05DD",unknown:"\u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2",selected:"\u05E0\u05D1\u05D7\u05E8",queue_one:"\u05EA\u05D5\u05E8",agent_one:"\u05E0\u05E6\u05D9\u05D2",refresh:"\u05E8\u05E2\u05E0\u05DF",showAgents:"\u05D4\u05E6\u05D2 \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD",now:"\u05E2\u05DB\u05E9\u05D9\u05D5",offline:"\u05DC\u05D0 \u05DE\u05E7\u05D5\u05D5\u05E0",searchQueues:"\u05D7\u05E4\u05E9 \u05EA\u05D5\u05E8\u05D9\u05DD\u2026",searchAgents:"\u05D7\u05E4\u05E9 \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD\u2026",noQueuesMatch:"\u05D0\u05D9\u05DF \u05EA\u05D5\u05E8\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD",noQueuesFound:"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E8\u05D9\u05DD",noAgentsMatch:"\u05D0\u05D9\u05DF \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD",noAgentsFound:"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD",agentsInSelected:"\u05E0\u05E6\u05D9\u05D2\u05D9\u05DD \u05D1\u05EA\u05D5\u05E8\u05D9\u05DD \u05E9\u05E0\u05D1\u05D7\u05E8\u05D5",noAgentsInSelected:"\u05D0\u05D9\u05DF \u05E0\u05E6\u05D9\u05D2\u05D9\u05DD \u05D1\u05EA\u05D5\u05E8\u05D9\u05DD \u05E9\u05E0\u05D1\u05D7\u05E8\u05D5",pickDate:"\u05D1\u05D7\u05E8 \u05EA\u05D0\u05E8\u05D9\u05DA"},
// South & Southeast Asian
th:{loading:"\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u2026",timeInStatus:"\u0E40\u0E27\u0E25\u0E32\u0E43\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E30",today:"\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49",subtitle:"\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E15\u0E31\u0E27\u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19\u0E41\u0E25\u0E30\u0E04\u0E34\u0E27\u0E17\u0E35\u0E48\u0E1E\u0E27\u0E01\u0E40\u0E02\u0E32\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14\u0E2D\u0E22\u0E39\u0E48.",queues:"\u0E04\u0E34\u0E27",agents:"\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19",you:"\u0E04\u0E38\u0E13",presenceHistory:"\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E2A\u0E16\u0E32\u0E19\u0E30",queueHub:"\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E04\u0E34\u0E27",unknown:"\u0E44\u0E21\u0E48\u0E17\u0E23\u0E32\u0E1A",selected:"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E25\u0E49\u0E27",queue_one:"\u0E04\u0E34\u0E27",agent_one:"\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19",refresh:"\u0E23\u0E35\u0E40\u0E1F\u0E23\u0E0A",showAgents:"\u0E41\u0E2A\u0E14\u0E07\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19",now:"\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49",offline:"\u0E2D\u0E2D\u0E1F\u0E44\u0E25\u0E19\u0E4C",timeline:"\u0E44\u0E17\u0E21\u0E4C\u0E44\u0E25\u0E19\u0E4C",noActivity:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E43\u0E19\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49",failedToLoad:"\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08:",searchQueues:"\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E04\u0E34\u0E27\u2026",searchAgents:"\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19\u2026",noQueuesMatch:"\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E34\u0E27\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19",noQueuesFound:"\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E34\u0E27",noAgentsMatch:"\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19",noAgentsFound:"\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19",agentsInSelected:"\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19\u0E43\u0E19\u0E04\u0E34\u0E27\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01",noAgentsInSelected:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E31\u0E27\u0E41\u0E17\u0E19\u0E43\u0E19\u0E04\u0E34\u0E27\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01",pickDate:"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48"},
vi:{loading:"\u0110ang t\u1EA3i\u2026",timeInStatus:"th\u1EDDi gian trong tr\u1EA1ng th\u00E1i",today:"H\u00F4m nay",timeline:"D\u00F2ng th\u1EDDi gian",noActivity:"Kh\u00F4ng c\u00F3 ho\u1EA1t \u0111\u1ED9ng trong ng\u00E0y n\u00E0y",failedToLoad:"T\u1EA3i th\u1EA5t b\u1EA1i:",subtitle:"Ki\u1EC3m tra tr\u1EA1ng th\u00E1i hi\u1EC7n di\u1EC7n c\u1EE7a \u0111\u1EA1i l\u00FD v\u00E0 h\u00E0ng \u0111\u1EE3i h\u1ECD tham gia.",queues:"H\u00E0ng \u0111\u1EE3i",agents:"\u0110\u1EA1i l\u00FD",searchQueues:"T\u00ECm h\u00E0ng \u0111\u1EE3i\u2026",searchAgents:"T\u00ECm \u0111\u1EA1i l\u00FD\u2026",noQueuesMatch:"Kh\u00F4ng c\u00F3 h\u00E0ng \u0111\u1EE3i ph\u00F9 h\u1EE3p",noQueuesFound:"Kh\u00F4ng t\u00ECm th\u1EA5y h\u00E0ng \u0111\u1EE3i",noAgentsMatch:"Kh\u00F4ng c\u00F3 \u0111\u1EA1i l\u00FD ph\u00F9 h\u1EE3p",noAgentsFound:"Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u1EA1i l\u00FD",agentsInSelected:"\u0110\u1EA1i l\u00FD trong h\u00E0ng \u0111\u1EE3i \u0111\u00E3 ch\u1ECDn",noAgentsInSelected:"Kh\u00F4ng c\u00F3 \u0111\u1EA1i l\u00FD trong h\u00E0ng \u0111\u1EE3i \u0111\u00E3 ch\u1ECDn",you:"B\u1EA1n",presenceHistory:"L\u1ECBch s\u1EED hi\u1EC7n di\u1EC7n",queueHub:"Trung t\u00E2m h\u00E0ng \u0111\u1EE3i",pickDate:"Ch\u1ECDn ng\u00E0y",unknown:"Kh\u00F4ng r\u00F5",selected:"\u0111\u00E3 ch\u1ECDn",queue_one:"h\u00E0ng \u0111\u1EE3i",agent_one:"\u0111\u1EA1i l\u00FD",refresh:"L\u00E0m m\u1EDBi",showAgents:"Hi\u1EC3n th\u1ECB \u0111\u1EA1i l\u00FD",now:"b\u00E2y gi\u1EDD",offline:"Ngo\u1EA1i tuy\u1EBFn"},
id:{loading:"Memuat\u2026",timeInStatus:"waktu dalam status",today:"Hari ini",timeline:"Lini masa",noActivity:"Tidak ada aktivitas pada hari ini",failedToLoad:"Gagal memuat:",subtitle:"Periksa status kehadiran agen dan antrean yang mereka ikuti.",queues:"Antrean",agents:"Agen",searchQueues:"Cari antrean\u2026",searchAgents:"Cari agen\u2026",noQueuesMatch:"Tidak ada antrean yang cocok",noQueuesFound:"Antrean tidak ditemukan",noAgentsMatch:"Tidak ada agen yang cocok",noAgentsFound:"Agen tidak ditemukan",agentsInSelected:"Agen dalam antrean yang dipilih",noAgentsInSelected:"Tidak ada agen dalam antrean yang dipilih",you:"Anda",presenceHistory:"Riwayat kehadiran",queueHub:"Hub antrean",pickDate:"Pilih tanggal",unknown:"Tidak diketahui",selected:"dipilih",queue_one:"antrean",agent_one:"agen",refresh:"Segarkan",showAgents:"Tampilkan agen",now:"sekarang",offline:"Offline"},
ms:{loading:"Memuatkan\u2026",timeInStatus:"masa dalam status",today:"Hari ini",subtitle:"Semak status kehadiran ejen dan baris gilir yang mereka sertai.",queues:"Baris gilir",agents:"Ejen",you:"Anda",presenceHistory:"Sejarah kehadiran",queueHub:"Hab baris gilir",unknown:"Tidak diketahui",selected:"dipilih",queue_one:"baris gilir",agent_one:"ejen",refresh:"Muat semula",showAgents:"Tunjukkan ejen",now:"sekarang",offline:"Luar talian",timeline:"Garis masa",noActivity:"Tiada aktiviti pada hari ini",failedToLoad:"Gagal memuatkan:",searchQueues:"Cari baris gilir\u2026",searchAgents:"Cari ejen\u2026",noQueuesMatch:"Tiada baris gilir sepadan",noQueuesFound:"Tiada baris gilir dijumpai",noAgentsMatch:"Tiada ejen sepadan",noAgentsFound:"Tiada ejen dijumpai",agentsInSelected:"Ejen dalam baris gilir dipilih",noAgentsInSelected:"Tiada ejen dalam baris gilir dipilih",pickDate:"Pilih tarikh"},
hi:{loading:"\u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948\u2026",timeInStatus:"\u0938\u094D\u0925\u093F\u0924\u093F \u092E\u0947\u0902 \u0938\u092E\u092F",today:"\u0906\u091C",subtitle:"\u090F\u091C\u0947\u0902\u091F\u094B\u0902 \u0915\u0940 \u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0938\u094D\u0925\u093F\u0924\u093F \u0914\u0930 \u0935\u0947 \u0915\u093F\u0928 \u0915\u0924\u093E\u0930\u094B\u0902 \u092E\u0947\u0902 \u0939\u0948\u0902, \u091C\u093E\u0901\u091A\u0947\u0902\u0964",queues:"\u0915\u0924\u093E\u0930\u0947\u0902",agents:"\u090F\u091C\u0947\u0902\u091F",you:"\u0906\u092A",presenceHistory:"\u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0907\u0924\u093F\u0939\u093E\u0938",queueHub:"\u0915\u0924\u093E\u0930 \u0939\u092C",unknown:"\u0905\u091C\u094D\u091E\u093E\u0924",selected:"\u091A\u092F\u0928\u093F\u0924",queue_one:"\u0915\u0924\u093E\u0930",agent_one:"\u090F\u091C\u0947\u0902\u091F",refresh:"\u0930\u093F\u092B\u094D\u0930\u0947\u0936",showAgents:"\u090F\u091C\u0947\u0902\u091F \u0926\u093F\u0916\u093E\u090F\u0901",now:"\u0905\u092D\u0940",offline:"\u0911\u092B\u093C\u0932\u093E\u0907\u0928",timeline:"\u091F\u093E\u0907\u092E\u0932\u093E\u0907\u0928",noActivity:"\u0907\u0938 \u0926\u093F\u0928 \u0915\u094B\u0908 \u0917\u0924\u093F\u0935\u093F\u0927\u093F \u0928\u0939\u0940\u0902",failedToLoad:"\u0932\u094B\u0921 \u0928\u0939\u0940\u0902 \u0939\u094B \u0938\u0915\u093E:",searchQueues:"\u0915\u0924\u093E\u0930\u0947\u0902 \u0916\u094B\u091C\u0947\u0902\u2026",searchAgents:"\u090F\u091C\u0947\u0902\u091F \u0916\u094B\u091C\u0947\u0902\u2026",noQueuesMatch:"\u0915\u094B\u0908 \u092E\u0947\u0932 \u0916\u093E\u0924\u0940 \u0915\u0924\u093E\u0930 \u0928\u0939\u0940\u0902",noQueuesFound:"\u0915\u094B\u0908 \u0915\u0924\u093E\u0930 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0940",noAgentsMatch:"\u0915\u094B\u0908 \u092E\u0947\u0932 \u0916\u093E\u0924\u093E \u090F\u091C\u0947\u0902\u091F \u0928\u0939\u0940\u0902",noAgentsFound:"\u0915\u094B\u0908 \u090F\u091C\u0947\u0902\u091F \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u093E",agentsInSelected:"\u091A\u092F\u0928\u093F\u0924 \u0915\u0924\u093E\u0930\u094B\u0902 \u0915\u0947 \u090F\u091C\u0947\u0902\u091F",noAgentsInSelected:"\u091A\u092F\u0928\u093F\u0924 \u0915\u0924\u093E\u0930\u094B\u0902 \u092E\u0947\u0902 \u0915\u094B\u0908 \u090F\u091C\u0947\u0902\u091F \u0928\u0939\u0940\u0902",pickDate:"\u0924\u093E\u0930\u0940\u0916 \u091A\u0941\u0928\u0947\u0902"},
};

/**
 * Locales whose table is intentionally partial fall back to a closely related language
 * before English, so users see their own script rather than a sudden switch mid-screen.
 */
const LOCALE_FALLBACK: Record<string, string> = { "zh-HK": "zh-TW" };

function loc(key: keyof I18nStrings): string {
  const lang = getLocale();
  const base = lang.split("-")[0];
  const related = LOCALE_FALLBACK[lang];
  return TRANSLATIONS[lang]?.[key]
    ?? (related ? TRANSLATIONS[related]?.[key] : undefined)
    ?? TRANSLATIONS[base]?.[key]
    ?? EN[key];
}

function cntLbl(n: number, key: keyof I18nStrings): string {
  const w = loc(key);
  const base = getLocale().split("-")[0];
  return n !== 1 && base === "en" ? `${n} ${w}s` : `${n} ${w}`;
}

/* ═══════════════════════════════════════════════════════════════
   Shared constants & utilities
   ═══════════════════════════════════════════════════════════════ */

const VERSION = "2.10.0";
const POLL_PRESENCE_MS = 5000;
const POLL_QUEUE_MS = 10000;
/** Expanded-agent history is re-fetched at most this often. */
const AGENT_HISTORY_TTL_MS = 60000;
/** 1s ticks between automatic refreshes of the "Today" timeline (5 minutes). */
const DAY_REFRESH_TICKS = 300;

/** Skip polling work when the tab is hidden (saves bandwidth + RU). */
function isTabHidden(): boolean {
  return typeof document !== "undefined" && document.visibilityState === "hidden";
}

function esc(s: string): string {
  const t = document.createElement("span");
  t.textContent = s;
  return t.innerHTML;
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
  let resp: ComponentFramework.WebApi.RetrieveMultipleResponse;
  let hasBase = true;
  try {
    resp = await api.retrieveMultipleRecords(
      "msdyn_presence",
      "?$select=msdyn_presenceid,msdyn_name,msdyn_presencestatustext,msdyn_basepresencestatus"
    );
  } catch (e) {
    // Older/locked-down orgs may reject msdyn_basepresencestatus — degrade to text matching.
    console.warn("[PresenceHub] base presence status unavailable, falling back to text matching", e);
    hasBase = false;
    resp = await api.retrieveMultipleRecords(
      "msdyn_presence",
      "?$select=msdyn_presenceid,msdyn_presencestatustext"
    );
  }
  const pmap: Record<string, string> = {};
  for (const e of resp.entities) {
    const text = (e.msdyn_presencestatustext as string) || (e.msdyn_name as string) || "";
    pmap[e.msdyn_presenceid as string] = text;
    if (!hasBase) continue;
    registerPresenceBase(text, e.msdyn_basepresencestatus as number | null);
    registerPresenceBase(e.msdyn_name as string, e.msdyn_basepresencestatus as number | null);
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
   Presence / Queue Hub shared view helpers
   ═══════════════════════════════════════════════════════════════ */

/** Locale-bound wrappers over the pure formatters in ./time. */
const t = {
  time: (iso: string): string => fmtTime(iso, getLocale()),
  dateTime: (iso: string): string => fmtDateTime(iso, getLocale()),
  range: (startIso: string, endIso: string | null): string =>
    fmtTimeRange(startIso, endIso, getLocale(), loc("now")),
};

interface QueueInfo { id: string; name: string; }
interface AgentInfo { id: string; name: string; presenceId: string | null; presenceName: string; since: string | null; }
interface AgentWithQueues extends AgentInfo { queues: QueueInfo[]; }

function statusOrder(a: AgentInfo): number {
  return statusOrderOf(a.presenceName);
}

const LOADING_HTML = `<div class="qh-loading"><span class="qh-loading-dot"></span><span class="qh-loading-dot" style="animation-delay:.2s"></span><span class="qh-loading-dot" style="animation-delay:.4s"></span></div>`;

/** Users known to have no entity image — avoids re-requesting a 404 on every re-render. */
const NO_PHOTO = new Set<string>();

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
  private _onKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private _filterStatus: string | null = null;
  private _lastRecords: ComponentFramework.WebApi.Entity[] = [];
  private _polling = false;          // reentrancy guard for _poll()
  private _errStreak = 0;            // consecutive poll failures (for backoff)
  private _skipCount = 0;            // v2.8.3: monotonic tick counter for backoff gating
  private _bootstrapped = false;     // true once first successful presence read happened
  private _ticks = 0;                // 1s ticks since init (drives rollover + auto-refresh)
  private _trackingToday = true;     // false once the user pins a specific past day
  private _paused = false;           // true while the hosting tab hides this panel
  private _onVisibility: (() => void) | null = null;

  private _elDot!: HTMLDivElement;
  private _elName!: HTMLSpanElement;
  private _elClock!: HTMLDivElement;
  private _elSince!: HTMLDivElement;
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

  /** Called when the hosting tab hides this panel, so it stops polling in the background. */
  public pause(): void {
    this._paused = true;
  }

  public resume(): void {
    if (!this._paused) return;
    this._paused = false;
    this._errStreak = 0;
    this._skipCount = 0;
    void this._poll();
  }

  public destroy(): void {
    if (this._tickTimer !== null) clearInterval(this._tickTimer);
    if (this._pollTimer !== null) clearInterval(this._pollTimer);
    if (this._onDocClick) document.removeEventListener("click", this._onDocClick);
    if (this._onKeyDown) this._c.removeEventListener("keydown", this._onKeyDown);
    if (this._onVisibility) document.removeEventListener("visibilitychange", this._onVisibility);
  }

  private _buildUI(): void {
    this._c.innerHTML = `
      <div class="card">
        <div class="pill">
          <div class="dot" data-ref="dot" role="img"></div>
          <span class="name" data-ref="sName">${loc("loading")}</span>
        </div>
        <div class="time" data-ref="clock" role="timer" aria-live="off">00:00:00</div>
        <div class="lbl">${loc("timeInStatus")}</div>
        <div class="since" data-ref="since"></div>
        <div class="err" data-ref="err" role="status"></div>
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
      <div style="font-size:9px;color:#999;text-align:right;padding:2px 6px 0 0;opacity:.6">PresenceHub v${VERSION}</div>`;

    this._elDot = this._ref("dot") as HTMLDivElement;
    this._elName = this._ref("sName") as HTMLSpanElement;
    this._elClock = this._ref("clock") as HTMLDivElement;
    this._elSince = this._ref("since") as HTMLDivElement;
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
      this._setSelectedDate(new Date());
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

    this._onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !this._calOpen) return;
      this._calOpen = false;
      this._elCalOverlay.style.display = "none";
      this._elCalBtn.focus();
    };
    this._c.addEventListener("keydown", this._onKeyDown);

    // Polling is suspended while the tab is hidden, and browsers throttle background
    // timers heavily. Refresh the moment the user comes back instead of showing stale
    // data until the next interval fires.
    this._onVisibility = () => {
      if (isTabHidden()) return;
      this._errStreak = 0;
      this._skipCount = 0;
      void this._poll();
      if (this._trackingToday) {
        this._selectedDate = new Date();
        void this._loadDay();
      }
    };
    document.addEventListener("visibilitychange", this._onVisibility);
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
      this._renderSince(p.since);
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
      `?$filter=_msdyn_agentid_value eq ${this._s.userId}` +
      `&$select=_msdyn_currentpresenceid_value,msdyn_presencemodifiedon&$top=1`
    );
    // v2.8.3: never throw on missing record / null presence. Render "Offline" instead so
    // the pill always escapes the "Loading\u2026" state on first paint even when the
    // OmniChannel agent-status row hasn't been initialized yet.
    if (!resp.entities || !resp.entities.length) {
      console.warn("[PresenceHub] no msdyn_agentstatus row for user", this._s.userId);
      return { id: "", name: loc("offline"), since: null };
    }
    const rec = resp.entities[0];
    const pid = rec["_msdyn_currentpresenceid_value"] as string;
    if (!pid) {
      console.warn("[PresenceHub] msdyn_agentstatus has null currentpresenceid for user", this._s.userId);
      return { id: "", name: loc("offline"), since: null };
    }

    // The authoritative start of the CURRENT status is the still-open history segment
    // (msdyn_endtime is null). v2.8.3 took the newest segment for this presence regardless
    // of whether it was already closed, so a stale closed segment could inflate the timer
    // by days. Fall back to msdyn_presencemodifiedon when no open segment exists yet.
    let since: string | null = null;
    try {
      const hResp = await this._s.api.retrieveMultipleRecords(
        "msdyn_agentstatushistory",
        `?$filter=_msdyn_agentid_value eq ${this._s.userId} and _msdyn_presenceid_value eq ${pid}` +
        ` and msdyn_endtime eq null` +
        `&$select=msdyn_starttime&$orderby=msdyn_starttime desc&$top=1`
      );
      if (hResp.entities && hResp.entities.length) {
        since = (hResp.entities[0]["msdyn_starttime"] as string) || null;
      }
    } catch { /* fall through to msdyn_presencemodifiedon */ }
    if (!since) since = (rec["msdyn_presencemodifiedon"] as string) || null;

    return { id: pid, name: pName(pid, this._s.pmap), since };
  }

  private async _fetchHistory(date: Date): Promise<ComponentFramework.WebApi.Entity[]> {
    const b = dayBounds(date);
    const dayStartStr = toUtcLiteral(new Date(b.start));
    const dayEndStr = toUtcLiteral(new Date(b.end));
    // Match every segment that OVERLAPS the day, not only those that START in it. A status
    // held across midnight (e.g. Offline since last week) otherwise vanished and the day
    // rendered as "No activity on this day" while the pill showed hours in that status.
    const filter =
      `_msdyn_agentid_value eq ${this._s.userId}` +
      ` and msdyn_starttime lt ${dayEndStr}` +
      ` and (msdyn_endtime eq null or msdyn_endtime gt ${dayStartStr})`;
    const q =
      `?$filter=${filter}` +
      `&$select=msdyn_starttime,msdyn_endtime,_msdyn_presenceid_value` +
      `&$orderby=msdyn_starttime desc`;
    const resp = await this._s.api.retrieveMultipleRecords("msdyn_agentstatushistory", q, 5000);
    return resp.entities || [];
  }

  /** Clamp a history segment to the visible day so cross-midnight spans report day-local time. */
  private _span(r: ComponentFramework.WebApi.Entity): { st: number; en: number } {
    const rawSt = new Date(r["msdyn_starttime"] as string).getTime();
    const rawEn = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : null;
    return clampSpan(rawSt, rawEn, dayBounds(this._selectedDate));
  }

  private _tick(): void {
    if (this._start) this._elClock.textContent = fmtClock(Date.now() - this._start);
    // The panel can stay mounted for days. Roll the "Today" view over at midnight and
    // refresh the day periodically so the still-open segment keeps growing.
    this._ticks++;
    if (this._ticks % 30 === 0 && this._trackingToday && !isToday(this._selectedDate)) {
      this._selectedDate = new Date();
      void this._loadDay();
    } else if (this._ticks % DAY_REFRESH_TICKS === 0 && isToday(this._selectedDate) && !isTabHidden()) {
      void this._loadDay();
    }
  }

  private _render(p: { id: string; name: string }): void {
    // v2.8.3: defensive null-checks — if the panel was destroyed/re-rendered,
    // the cached refs may be detached. Re-query before bailing.
    if (!this._elName || !this._elName.isConnected) {
      const fresh = this._c.querySelector('[data-ref="sName"]') as HTMLElement | null;
      if (fresh) this._elName = fresh; else { console.warn("[PresenceHub] _render: sName missing"); return; }
    }
    this._elName.textContent = p.name || loc("unknown");
    if (this._elDot) {
      this._elDot.style.background = color(p.name);
      this._elDot.innerHTML = statusIcon(p.name, "lg");
      this._elDot.setAttribute("aria-label", p.name || loc("unknown"));
    }
    if (this._elErr) this._elErr.style.display = "none";
  }

  private _showErr(msg: string): void {
    this._elErr.textContent = msg;
    this._elErr.style.display = "block";
  }

  /** Show when the current status started, so a large "time in status" is self-explanatory. */
  private _renderSince(iso: string | null): void {
    if (!this._elSince) return;
    this._elSince.textContent = iso ? t.dateTime(iso) : "";
  }

  private _setSelectedDate(d: Date): void {
    this._selectedDate = d;
    this._trackingToday = isToday(d);
  }

  private async _poll(): Promise<void> {
    // Skip while a previous poll is still in flight (slow WebAPI → no thundering herd).
    if (this._polling) return;
    // Skip while hidden behind the other tab, or while the browser tab is in the background.
    if (this._paused || isTabHidden()) return;
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
      const since = p.since ? new Date(p.since).getTime() : null;
      // Resync on presence change AND on a new segment start for the same presence
      // (A -> B -> A between two polls looks unchanged by id alone, which froze the timer).
      if (p.id !== this._curId || (since !== null && since !== this._start) || wasBootstrapping) {
        this._curId = p.id;
        this._start = since ?? Date.now();
        this._renderSince(p.since);
        if (this._trackingToday) {
          this._selectedDate = new Date();
          void this._loadDay();
        }
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
      const { st, en } = this._span(r);
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
    const dayStart = this._span(chrono[0]).st;
    const lastRec = chrono[chrono.length - 1];
    const dayEnd = this._span(lastRec).en;
    const totalSpan = dayEnd - dayStart;
    if (totalSpan > 0) {
      let barHtml = '<div class="sbar">';
      const segCount = chrono.length;
      for (let i = 0; i < segCount; i++) {
        const r = chrono[i];
        const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
        const { st, en } = this._span(r);
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
      const startLbl = t.time(new Date(dayStart).toISOString());
      const endLbl = t.time(new Date(dayEnd).toISOString());
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
      const { st, en } = this._span(r);
      const dur = en - st;
      if (dur > filteredMaxDur) filteredMaxDur = dur;
    }

    let html = '<div class="tl">';
    for (const r of filtered) {
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const c = color(name);
      const { st, en } = this._span(r);
      const dur = en - st;
      const barPct = filteredMaxDur > 0 ? Math.max(4, Math.round((dur / filteredMaxDur) * 100)) : 100;
      const openEnded = !r["msdyn_endtime"] && isToday(this._selectedDate);
      html += `<div class="tl-item"><div class="tl-dot" style="background:${c}">${statusIcon(name, "lg")}</div><div class="tl-body"><div class="tl-row"><span class="tl-name">${esc(name)}</span><span class="tl-dur">${fmtShort(dur)}</span></div><div class="tl-time">${t.range(new Date(st).toISOString(), openEnded ? null : new Date(en).toISOString())}</div><div class="tl-bar" style="width:${barPct}%;background:${c}"></div></div></div>`;
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
    this._setSelectedDate(d);
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
        this._setSelectedDate(new Date(year, month, day));
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
  private _agentHistoryCache: Record<string, { at: number; records: ComponentFramework.WebApi.Entity[] }> = {};

  private _elSearch!: HTMLInputElement;
  private _elSubtitle!: HTMLDivElement;
  private _elList!: HTMLDivElement;
  private _elSummary!: HTMLDivElement;
  private _elErr!: HTMLDivElement;
  private _elTabQueues!: HTMLButtonElement;
  private _elTabAgents!: HTMLButtonElement;

  private _errStreak = 0;
  private _skipCount = 0;
  private _paused = false;

  constructor(container: HTMLDivElement, services: SharedServices) {
    this._c = container;
    this._s = services;
  }

  public init(): void {
    this._c.classList.add("queue-hub");
    this._buildUI();
    this._initialize();
  }

  /** Called when the hosting tab hides this panel, so it stops polling in the background. */
  public pause(): void {
    this._paused = true;
  }

  public resume(): void {
    if (!this._paused) return;
    this._paused = false;
    this._errStreak = 0;
    this._skipCount = 0;
    void (this._activeTab === "agents" ? this._pollAgentsTab() : this._pollQueueAgents());
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
      <div class="qh-err" data-ref="err" role="status" style="display:none"></div>
      <div class="qh-list" data-ref="list">${LOADING_HTML}</div>`;

    this._elSearch = this._ref("search") as HTMLInputElement;
    this._elSubtitle = this._ref("subtitle") as HTMLDivElement;
    this._elList = this._ref("list") as HTMLDivElement;
    this._elSummary = this._ref("summary") as HTMLDivElement;
    this._elErr = this._ref("err") as HTMLDivElement;
    this._elTabQueues = this._ref("tab-queues") as HTMLButtonElement;
    this._elTabAgents = this._ref("tab-agents") as HTMLButtonElement;

    this._elSearch.addEventListener("input", () => this._onSearch());
    this._elTabQueues.addEventListener("click", () => this._switchTab("queues"));
    this._elTabAgents.addEventListener("click", () => this._switchTab("agents"));
  }

  private _ref(name: string): HTMLElement {
    return this._c.querySelector(`[data-ref="${name}"]`) as HTMLElement;
  }

  /**
   * Background polls used to fail silently, so a throttled/erroring WebAPI left the tab
   * frozen on stale data with no indication. Surface it and back off like the presence panel.
   */
  private _pollFailed(e: unknown): void {
    this._errStreak++;
    if (this._elErr) {
      this._elErr.textContent = `${loc("failedToLoad")} ${e instanceof Error ? e.message : String(e)}`;
      this._elErr.style.display = "block";
    }
  }

  private _pollSucceeded(): void {
    this._errStreak = 0;
    this._skipCount = 0;
    if (this._elErr) this._elErr.style.display = "none";
  }

  /** True when this cycle should be skipped: paused, hidden, or backing off after failures. */
  private _shouldSkipPoll(): boolean {
    if (this._paused || isTabHidden()) return true;
    if (this._errStreak < 3) return false;
    this._skipCount++;
    return (this._skipCount % Math.min(6, this._errStreak - 2)) !== 0;
  }

  /** Re-rendering the list wholesale would otherwise jump the user back to the top. */
  private _preserveScroll(render: () => void): void {
    const top = this._elList ? this._elList.scrollTop : 0;
    render();
    if (this._elList) this._elList.scrollTop = top;
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

  /**
   * Personal default queues (one auto-created per user, `primaryuserid` set) are noise here.
   * Filtering them server-side is exact, but falls back to name heuristics if the org rejects
   * the extra attributes.
   */
  private async _loadQueues(): Promise<void> {
    const membership = `
        <link-entity name="queuemembership" from="queueid" to="queueid" intersect="true">
          <link-entity name="systemuser" from="systemuserid" to="systemuserid">
            <filter><condition attribute="systemuserid" operator="eq" value="${this._s.userId}"/></filter>
          </link-entity>
        </link-entity>`;
    const precise = `<fetch>
      <entity name="queue">
        <attribute name="queueid"/>
        <attribute name="name"/>
        <order attribute="name"/>
        <filter><condition attribute="primaryuserid" operator="null"/></filter>${membership}
      </entity>
    </fetch>`;
    const loose = `<fetch>
      <entity name="queue">
        <attribute name="queueid"/>
        <attribute name="name"/>
        <order attribute="name"/>${membership}
      </entity>
    </fetch>`;

    let entities: ComponentFramework.WebApi.Entity[];
    try {
      entities = (await this._s.api.retrieveMultipleRecords(
        "queue", `?fetchXml=${encodeURIComponent(precise)}`, 5000)).entities;
    } catch {
      entities = (await this._s.api.retrieveMultipleRecords(
        "queue", `?fetchXml=${encodeURIComponent(loose)}`, 5000)).entities;
    }

    this._queues = [];
    for (const e of entities) {
      const name = e["name"] as string;
      if (!name || /^<.*>$/.test(name) || /^[0-9a-f]{20,}_\d+$/i.test(name)) continue;
      this._queues.push({ id: e["queueid"] as string, name });
    }
  }

  private static _inFilter(attr: string, ids: string[]): string {
    return `<condition attribute="${attr}" operator="in">${ids.map(id => `<value>${id}</value>`).join("")}</condition>`;
  }

  /**
   * One request for every (agent, queue) pair across all the given queues.
   * Previously this was one request PER QUEUE, so an agent in 15 queues cost 15 round-trips
   * on every 10s poll.
   */
  private async _loadMemberships(queueIds: string[]): Promise<AgentWithQueues[]> {
    if (!queueIds.length) return [];
    const fetchXml = `<fetch distinct="true">
      <entity name="systemuser">
        <attribute name="systemuserid"/>
        <attribute name="fullname"/>
        <order attribute="fullname"/>
        <link-entity name="queuemembership" from="systemuserid" to="systemuserid" intersect="true">
          <link-entity name="queue" from="queueid" to="queueid" alias="q">
            <attribute name="queueid"/>
            <attribute name="name"/>
            <filter>${QueueHubPanel._inFilter("queueid", queueIds)}</filter>
          </link-entity>
        </link-entity>
      </entity>
    </fetch>`;
    const resp = await this._s.api.retrieveMultipleRecords(
      "systemuser", `?fetchXml=${encodeURIComponent(fetchXml)}`, 5000);

    const byAgent = new Map<string, AgentWithQueues>();
    for (const e of resp.entities) {
      const uid = e["systemuserid"] as string;
      if (!uid) continue;
      let agent = byAgent.get(uid);
      if (!agent) {
        agent = {
          id: uid,
          name: (e["fullname"] as string) || loc("unknown"),
          presenceId: null,
          presenceName: loc("unknown"),
          since: null,
          queues: [],
        };
        byAgent.set(uid, agent);
      }
      const qid = e["q.queueid"] as string | undefined;
      const qname = e["q.name"] as string | undefined;
      if (qid && !agent.queues.some(q => q.id === qid)) {
        agent.queues.push({ id: qid, name: qname || "" });
      }
    }
    return [...byAgent.values()];
  }

  /**
   * One request for the presence of every agent in the given queues, resolved server-side
   * through the membership join. Falls back to id-batched `$filter` queries run in parallel
   * if the join is rejected.
   */
  private async _loadStatuses(
    queueIds: string[],
    userIds: string[]
  ): Promise<Map<string, { presenceId: string | null; since: string | null }>> {
    const out = new Map<string, { presenceId: string | null; since: string | null }>();
    if (!userIds.length) return out;

    const absorb = (entities: ComponentFramework.WebApi.Entity[]): void => {
      for (const s of entities) {
        const aid = s["_msdyn_agentid_value"] as string;
        if (!aid) continue;
        out.set(aid, {
          presenceId: (s["_msdyn_currentpresenceid_value"] as string) || null,
          since: (s["msdyn_presencemodifiedon"] as string) || null,
        });
      }
    };

    if (queueIds.length) {
      const fetchXml = `<fetch distinct="true">
        <entity name="msdyn_agentstatus">
          <attribute name="msdyn_agentid"/>
          <attribute name="msdyn_currentpresenceid"/>
          <attribute name="msdyn_presencemodifiedon"/>
          <link-entity name="systemuser" from="systemuserid" to="msdyn_agentid">
            <link-entity name="queuemembership" from="systemuserid" to="systemuserid" intersect="true">
              <link-entity name="queue" from="queueid" to="queueid">
                <filter>${QueueHubPanel._inFilter("queueid", queueIds)}</filter>
              </link-entity>
            </link-entity>
          </link-entity>
        </entity>
      </fetch>`;
      try {
        const resp = await this._s.api.retrieveMultipleRecords(
          "msdyn_agentstatus", `?fetchXml=${encodeURIComponent(fetchXml)}`, 5000);
        absorb(resp.entities);
        return out;
      } catch {
        // fall through to id batches
      }
    }

    const BATCH = 40;
    const batches: string[][] = [];
    for (let i = 0; i < userIds.length; i += BATCH) batches.push(userIds.slice(i, i + BATCH));
    const results = await Promise.allSettled(batches.map(batch => {
      const filter = batch.map(id => `_msdyn_agentid_value eq ${id}`).join(" or ");
      return this._s.api.retrieveMultipleRecords(
        "msdyn_agentstatus",
        `?$filter=${filter}&$select=_msdyn_agentid_value,_msdyn_currentpresenceid_value,msdyn_presencemodifiedon`
      );
    }));
    for (const r of results) {
      if (r.status === "fulfilled") absorb(r.value.entities);
    }
    return out;
  }

  /** Membership + presence for a set of queues: two requests total, regardless of size. */
  private async _loadAgents(queueIds: string[]): Promise<AgentWithQueues[]> {
    const agents = await this._loadMemberships(queueIds);
    if (!agents.length) return [];
    const statuses = await this._loadStatuses(queueIds, agents.map(a => a.id));
    for (const a of agents) {
      const st = statuses.get(a.id);
      if (!st) continue;
      a.presenceId = st.presenceId;
      a.presenceName = pName(st.presenceId, this._s.pmap);
      a.since = st.since;
    }
    return agents;
  }

  private async _loadAgentsForSelectedQueues(): Promise<AgentInfo[]> {
    const agents = await this._loadAgents([...this._selectedQueueIds]);
    return agents.sort((a, b) => {
      const diff = statusOrder(a) - statusOrder(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }

  private async _loadAllAgentsWithQueues(): Promise<AgentWithQueues[]> {
    const agents = await this._loadAgents(this._queues.map(q => q.id));
    return agents.sort((a, b) => a.name.localeCompare(b.name));
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
      this._pollSucceeded();
      this._renderQueueAgentsSection(target);
      if (this._pollTimer !== null) clearInterval(this._pollTimer);
      this._pollTimer = window.setInterval(() => void this._pollQueueAgents(), POLL_QUEUE_MS);
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
    this._bindAvatars(target);
  }

  private _pollingQueueAgents = false;
  private async _pollQueueAgents(): Promise<void> {
    if (this._activeTab !== "queues" || this._selectedQueueIds.size === 0) return;
    if (this._pollingQueueAgents || this._shouldSkipPoll()) return;
    this._pollingQueueAgents = true;
    try {
      this._queueAgents = await this._loadAgentsForSelectedQueues();
      this._queueAgentsCacheKey = this._queueSelectionKey();
      this._pollSucceeded();
      const target = this._c.querySelector('[data-ref="queue-agents"]') as HTMLDivElement;
      if (target) this._preserveScroll(() => this._renderQueueAgentsSection(target));
    } catch (e: unknown) {
      this._pollFailed(e);
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

      html += `<div class="qh-agent-expandable${expanded ? " qh-agent-expandable--open" : ""}" data-aid="${esc(a.id)}">
        <div class="qh-agent qh-agent--clickable" role="button" tabindex="0" aria-expanded="${expanded}">
          <div class="qh-agent-avatar" style="background:${isMe ? "#e0ecff" : "#f0f0f0"};color:${isMe ? "#0078d4" : "#666"}">
            ${QueueHubPanel._avatarHtml(a, clientUrl)}
            <div class="qh-agent-dot" style="background:${col}" role="img" aria-label="${esc(a.presenceName)}">${statusIcon(a.presenceName, "sm")}</div>
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
    this._bindAvatars(this._elList);

    // Bind expand/collapse
    this._elList.querySelectorAll(".qh-agent--clickable").forEach(el => {
      const toggle = (): void => {
        const wrapper = el.closest(".qh-agent-expandable") as HTMLElement;
        const aid = wrapper.dataset.aid!;
        const queuesDiv = wrapper.querySelector(".qh-agent-queues") as HTMLElement;
        const arrow = wrapper.querySelector(".qh-expand-arrow") as HTMLElement;
        if (this._expandedAgentIds.has(aid)) {
          this._expandedAgentIds.delete(aid);
          queuesDiv.style.display = "none";
          wrapper.classList.remove("qh-agent-expandable--open");
          arrow.classList.remove("qh-expand-arrow--open");
          el.setAttribute("aria-expanded", "false");
        } else {
          this._expandedAgentIds.add(aid);
          queuesDiv.style.display = "block";
          wrapper.classList.add("qh-agent-expandable--open");
          arrow.classList.add("qh-expand-arrow--open");
          el.setAttribute("aria-expanded", "true");
          // Load and render history bar
          void this._fetchAgentHistory(aid).then(records => {
            this._renderAgentBar(records, queuesDiv);
            return undefined;
          }).catch(() => { /* silently skip */ });
        }
      };
      el.addEventListener("click", toggle);
      el.addEventListener("keydown", (ev) => {
        const k = (ev as KeyboardEvent).key;
        if (k !== "Enter" && k !== " ") return;
        ev.preventDefault();
        toggle();
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
    if (this._pollingAgentsTab || this._shouldSkipPoll()) return;
    this._pollingAgentsTab = true;
    try {
      this._allAgents = await this._loadAllAgentsWithQueues();
      this._pollSucceeded();
      this._preserveScroll(() => void this._renderAgentsTab(this._elSearch.value.trim() || undefined));
    } catch (e: unknown) {
      this._pollFailed(e);
    } finally {
      this._pollingAgentsTab = false;
    }
  }

  /* ── Agent history bar helpers ── */

  private async _fetchAgentHistory(agentId: string): Promise<ComponentFramework.WebApi.Entity[]> {
    // Was invalidated on every 10s poll, so each expanded row re-fetched a full day of
    // history six times a minute. A short TTL keeps it fresh at a fraction of the cost.
    const cached = this._agentHistoryCache[agentId];
    if (cached && Date.now() - cached.at < AGENT_HISTORY_TTL_MS) return cached.records;

    const b = dayBounds(new Date());
    const dayStart = toUtcLiteral(new Date(b.start));
    const dayEnd = toUtcLiteral(new Date(b.end));
    // Overlap match (not "starts today") so a status held across midnight still shows up.
    const filter =
      `_msdyn_agentid_value eq ${agentId}` +
      ` and msdyn_starttime lt ${dayEnd}` +
      ` and (msdyn_endtime eq null or msdyn_endtime gt ${dayStart})`;
    const q =
      `?$filter=${filter}` +
      `&$select=msdyn_starttime,msdyn_endtime,_msdyn_presenceid_value` +
      `&$orderby=msdyn_starttime asc`;
    const resp = await this._s.api.retrieveMultipleRecords("msdyn_agentstatushistory", q, 5000);
    const records = resp.entities || [];
    this._agentHistoryCache[agentId] = { at: Date.now(), records };
    return records;
  }

  /** Clamp a history segment to today so cross-midnight spans don't dominate the bar. */
  private static _spanToday(r: ComponentFramework.WebApi.Entity): { st: number; en: number } {
    const rawSt = new Date(r["msdyn_starttime"] as string).getTime();
    const rawEn = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : null;
    return clampSpan(rawSt, rawEn, dayBounds(new Date()));
  }

  private _renderAgentBar(records: ComponentFramework.WebApi.Entity[], container: HTMLElement): void {
    // Remove any existing bar
    const existing = container.querySelector(".qh-agent-bar-wrap");
    if (existing) existing.remove();

    if (!records.length) return;

    const chrono = [...records].sort(
      (a, b) => new Date(a["msdyn_starttime"] as string).getTime() - new Date(b["msdyn_starttime"] as string).getTime()
    );
    const barStart = QueueHubPanel._spanToday(chrono[0]).st;
    const lastRec = chrono[chrono.length - 1];
    const barEnd = QueueHubPanel._spanToday(lastRec).en;
    const totalSpan = barEnd - barStart;
    if (totalSpan <= 0) return;

    let barHtml = '<div class="qh-agent-bar-wrap"><div class="sbar">';
    const segCount = chrono.length;
    for (let i = 0; i < segCount; i++) {
      const r = chrono[i];
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const { st, en } = QueueHubPanel._spanToday(r);
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
    const startLbl = t.time(new Date(barStart).toISOString());
    const endLbl = t.time(new Date(barEnd).toISOString());
    barHtml += `<div class="sbar-labels"><span>${startLbl}</span><span>${endLbl}</span></div></div>`;

    container.insertAdjacentHTML("afterbegin", barHtml);
  }

  /* ── Shared agent card HTML ── */

  /**
   * Inline `onerror`/`onload` attributes would be dropped under a strict CSP, and the photo
   * was re-requested on every 10s re-render. Handlers are attached in _bindAvatars instead,
   * and users already known to have no image skip the request entirely.
   */
  private static _avatarHtml(a: AgentInfo, clientUrl: string): string {
    const initials = esc(getInitials(a.name));
    if (NO_PHOTO.has(a.id)) {
      return `<span class="qh-agent-initials">${initials}</span>`;
    }
    const imgUrl = `${clientUrl}/api/data/v9.2/systemusers(${a.id})/entityimage/$value`;
    return `<img class="qh-agent-photo" src="${esc(imgUrl)}" alt="" data-aid="${esc(a.id)}" />`
      + `<span class="qh-agent-initials" style="display:none">${initials}</span>`;
  }

  private _bindAvatars(root: HTMLElement): void {
    root.querySelectorAll("img.qh-agent-photo").forEach(node => {
      const img = node as HTMLImageElement;
      img.addEventListener("load", () => {
        if (img.parentElement) img.parentElement.style.background = "transparent";
      });
      img.addEventListener("error", () => {
        const aid = img.dataset.aid;
        if (aid) NO_PHOTO.add(aid);
        img.style.display = "none";
        const fallback = img.nextElementSibling as HTMLElement | null;
        if (fallback) fallback.style.display = "flex";
      });
    });
  }

  private _agentCardHtml(a: AgentInfo): string {
    const col = color(a.presenceName);
    const sinceStr = a.since ? fmtShort(Date.now() - new Date(a.since).getTime()) : "";
    const isMe = a.id === this._s.userId;
    return `<div class="qh-agent">
      <div class="qh-agent-avatar" style="background:${isMe ? "#e0ecff" : "#f0f0f0"};color:${isMe ? "#0078d4" : "#666"}">
        ${QueueHubPanel._avatarHtml(a, getClientUrl())}
        <div class="qh-agent-dot" style="background:${col}" role="img" aria-label="${esc(a.presenceName)}">${statusIcon(a.presenceName, "sm")}</div>
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
      <div class="ph-tabs" role="tablist">
        <button class="ph-tab ph-tab-active" data-tab="presence" role="tab" aria-selected="true" aria-controls="ph-panel-presence" id="ph-tab-presence">${loc("presenceHistory")}</button>
        <button class="ph-tab" data-tab="queues" role="tab" aria-selected="false" aria-controls="ph-panel-queues" id="ph-tab-queues">${loc("queueHub")}</button>
      </div>
      <div class="ph-panel" data-panel="presence" id="ph-panel-presence" role="tabpanel" aria-labelledby="ph-tab-presence"></div>
      <div class="ph-panel" data-panel="queues" id="ph-panel-queues" role="tabpanel" aria-labelledby="ph-tab-queues" style="display:none"></div>`;

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
      // Presence is the landing tab; don't let the queue fan-out run until it is shown.
      if (this._activeTab !== "queues") this._queuePanel.pause();
    } catch (e: unknown) {
      this._panelPresence.textContent = `${e instanceof Error ? e.message : String(e)}`;
    }
  }

  private _switchTab(tab: "presence" | "queues"): void {
    if (tab === this._activeTab) return;
    this._activeTab = tab;
    const showPresence = tab === "presence";

    this._tabPresence.classList.toggle("ph-tab-active", showPresence);
    this._tabQueues.classList.toggle("ph-tab-active", !showPresence);
    this._tabPresence.setAttribute("aria-selected", String(showPresence));
    this._tabQueues.setAttribute("aria-selected", String(!showPresence));
    this._panelPresence.style.display = showPresence ? "" : "none";
    this._panelQueues.style.display = showPresence ? "none" : "";

    // A hidden panel used to keep polling; the Queue Hub fan-out in particular kept running
    // behind the Presence tab for the life of the session.
    if (showPresence) {
      this._queuePanel?.pause();
      this._presencePanel?.resume();
    } else {
      this._presencePanel?.pause();
      this._queuePanel?.resume();
    }
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
    const lcid = (context.userSettings as unknown as Record<string, number>)?.languageId || 1033;
    if (lcid !== _lcid) {
      _lcid = lcid;
      this.destroy();
      this.init(context, () => { /* no outputs */ }, {}, this._container);
    }
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    if (this._presencePanel) this._presencePanel.destroy();
    if (this._queuePanel) this._queuePanel.destroy();
  }
}
