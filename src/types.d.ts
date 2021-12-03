type ExportRun = {
  game: string;
  level: string | null;
  category: string;
  videos: string | null;
  comment: string;
  verified: boolean | string;
  players: string;
  date: Date | string;
  rta: string | number | null;
  igt: string | number | null;
  rta_noloads: string | number | null;
  platform?: string;
  emulator: boolean | string;
  region: string | null;
};

type SRCRun = {
  id: string;
  weblink: string;
  game: { data: SRCGame };
  level: { data: SRCLevel | [] };
  category: { data: SRCCategory };
  videos: SRCVideo;
  comment: string;
  status: SRCStatus;
  players: { data: SRCPlayer[] };
  date: string;
  submitted: string | null;
  times: SRCTimes;
  system: SRCSystem;
  splits: any;
  values: any;
  links: SRCLink[];
  platform: { data: SRCPlatform };
  region: { data: SRCRegion };
};

type SRCGame = {
  id: string;
  names: {
    international: string;
  };
};

type SRCLevel = {
  id: string;
  name: string;
};

type SRCCategory = {
  id: string;
  name: string;
};

type SRCUser = {
  id: string;
  names: {
    international: string;
  };
};

type SRCPlatform = {
  id: string;
  name: string;
};

type SRCRegion = {
  id: string;
  name: string;
};

type SRCVideo = {
  links: {
    uri: string;
  }[];
};

type SRCStatus = {
  status: string;
  examiner: string;
  "verify-date": string | null;
};

type SRCPlayer = {
  rel: "user" | "guest";
  id: string;
  names?: {
    international: string;
    japanese: string;
  };
  name?: string;
};

type SRCTimes = {
  primary: string;
  primary_t: number;
  realtime: string | null;
  realtime_t: number;
  realtime_noloads: string | null;
  realtime_noloads_t: number;
  ingame: string | null;
  ingame_t: number;
};

type SRCSystem = {
  platform: string;
  emulated: boolean;
  region: string | null;
};

type SRCLink = {
  rel: string;
  uri: string;
};

type SRCPagination = {
  offset: number;
  max: number;
  size: number;
  links: SRCLink[];
};
