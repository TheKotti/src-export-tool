import axios from "axios";
import profile from "./profile.json";

export const getTestData = () => {
  return profile;
};

export const getRunByUserName = (userName: string) => {
  return getUserId(userName).then((id) => {
    if (!id) {
      return null;
    }

    return getRuns(id).then((res) => {
      return res;
    });
  });
};

const getUserId = (userName: string): Promise<string | null> => {
  return axios
    .get(`https://www.speedrun.com/api/v1/users?name=${userName}`)
    .then((res: { data: any }) => {
      const {
        data: { data: users },
      }: { data: { data: SRCUser[] } } = res;

      const foundUser = users.find(
        (x) => x.names.international.toUpperCase() === userName.toUpperCase()
      );

      if (foundUser) {
        return foundUser.id;
      }

      return null;
    })
    .catch((e) => {
      console.error(`Something went wrong: `, e);
      return null;
    });
};

export const getRuns = (
  userId: string,
  previousRuns: SRCRun[] = [],
  offset = 0
): Promise<SRCRun[]> => {
  return axios
    .get(
      `https://www.speedrun.com/api/v1/runs?user=${userId}&max=200&offset=${offset}&embed=game,level,players,category,platform,region`
    )
    .then((res: { data: any }) => {
      const {
        data: { data: runs, pagination },
      } = res;

      const allRuns = [...previousRuns, ...(runs as SRCRun[])];

      const nextUrl = pagination?.links?.find(
        (x: SRCLink) => x.rel === "next"
      )?.uri;
      if (nextUrl) {
        return getRuns(userId, allRuns, offset + pagination.size);
      }
      return allRuns;
    })
    .catch((e) => {
      console.error(`Something went wrong: `, e);
      return [];
    });
};

export const formatData = (runs: SRCRun[], userName: string): ExportRun[] => {
  const formattedRuns: ExportRun[] = runs
    .sort((a, b) => sortRuns(a, b))
    .map((run) => {
      const isLevel = !Array.isArray(run.level.data);
      return {
        game: run.game.data.names.international,
        level: isLevel ? (run.level.data as SRCLevel).name : "",
        category: run.category.data.name,
        videos: getVideoUrl(run.videos),
        comment: run.comment || "",
        verified: run.status.status === "verified" ? "" : "Not verified",
        players: run.players.data
          .map((x) => getPlayerName(x))
          .filter((x) => x.toUpperCase() !== userName.toUpperCase())
          .join(", "),
        date: new Date(run.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        rta: run.times.realtime ? sec2time(run.times.realtime_t) : "",
        igt: run.times.ingame ? sec2time(run.times.ingame_t) : "",
        rta_noloads: run.times.realtime_noloads
          ? sec2time(run.times.realtime_noloads_t)
          : "",
        platform: run.platform.data.name,
        emulator: run.system.emulated ? "X" : "",
        region: run.region.data.name || "",
      };
    });

  return formattedRuns;
};

const sortRuns = (a: SRCRun, b: SRCRun) => {
  if (Array.isArray(a.level.data) === Array.isArray(b.level.data)) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  } else if (Array.isArray(a.level.data)) {
    return -1;
  }
  return 1;
};

const getPlayerName = (player: SRCPlayer) => {
  if (player.rel === "guest") {
    return player.name || "";
  } else if (player.rel === "user") {
    return player.names?.international || "";
  }
  return "";
};

const getVideoUrl = (videos: SRCVideo | null) => {
  if (!videos) {
    return null;
  }

  const urls = videos?.links.map((x) => x.uri);
  const youtubeUrl = urls.find((x) => x.includes("youtu"));

  if (youtubeUrl) {
    return youtubeUrl;
  }

  return urls[0];
};

function sec2time(timeInSeconds: number) {
  var pad = function (num: number | string, size: number) {
      return ("000" + num).slice(size * -1);
    },
    time: string = timeInSeconds.toFixed(3),
    hours: number = Math.floor(parseFloat(time) / 60 / 60),
    minutes: number = Math.floor(parseFloat(time) / 60) % 60,
    seconds: number = Math.floor(parseFloat(time) - minutes * 60),
    milliseconds: string = time.slice(-3);

  return (
    pad(hours, 2) +
    ":" +
    pad(minutes, 2) +
    ":" +
    pad(seconds, 2) +
    "." +
    pad(milliseconds, 3)
  );
}
