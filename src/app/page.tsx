const dynamic = "force-dynamic";
import { getData } from "@/data/DataSource";
import { Prisma } from "@prisma/client";

function a(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Day {
  users: {
    [key: string]: string[];
  };
  names: {
    [key: string]: string;
  };
  colors: {
    [key: string]: number[];
  };
}

function Chart({ day, n }: { day: Day; n: number }) {
  const users = day.users;
  if (!users) {
    return <></>;
  }
  let size = 0;
  let total = 0;
  for (const k of Object.keys(users)) {
    const colorUsers = users[k];
    if (colorUsers.length > size) size = colorUsers.length;
    total += colorUsers.length;
  }

  return (
    <>
      <div className="mb-4">
        <span className="text-xl mr-3">Day: {n}</span>
        <span className="text-md text-gray-400 italic">
          Total colors: {total}
        </span>
      </div>
      <div
        className="grid "
        style={{
          gridTemplateColumns: ".01fr .01fr 1fr",
        }}
      >
        {Object.entries(users)
          .sort(([ak], [bk]) => day.names[ak].localeCompare(day.names[bk]))
          .map(([color, users], i) => (
            <>
              <div
                key={i * 3}
                className="flex flex-col justify-center items-end"
              >
                <span className="">{a(day.names[color])}:</span>
              </div>
              <div
                key={i * 3 + 1}
                className="flex flex-col justify-center items-end px-1"
              >
                {users.length}
              </div>
              <div key={i * 3 + 2} className="p-1 box-border">
                <div
                  className="rounded-md overflow-visible px-2"
                  style={{
                    background: `rgb(${day.colors[color][0]},${day.colors[color][1]},${day.colors[color][2]})`,
                    width: (users.length / size) * 100 + "%",
                    height: "100%",
                  }}
                ></div>
              </div>
            </>
          ))}
      </div>
    </>
  );
}

export default async function Home() {
  const data = await getData();
  const weeks: Day[][] = [];
  let curWeek;
  for (let i = 0; i < data.length; i++) {
    const day = data[i] as Day;
    curWeek = Math.floor(i / 7);
    if (!weeks[curWeek]) {
      weeks.push([]);
    }
    weeks[curWeek].push(day);
  }

  return (
    <div className="container mx-auto">
      <div className="fixed top-0 left-0 w-screen bg-slate-700 p-1">
        {weeks.map((week, w) => (
          <a
            key={w}
            className="text-white p-1 mr-2 rounded inline-block bg-slate-600"
            href={`#tab-${w}`}
          >
            Week {w + 1}
          </a>
        ))}
      </div>
      {weeks.map((week, w) => {
        return (
          <div key={w} className="tab-content overflow-auto" id={`tab-${w}`}>
            {week.map((day, i) => {
              return (
                <div
                  key={i}
                  className=" bg-violet-700/10 text-white mx-auto my-8 rounded-md p-5"
                >
                  <div className="">
                    <div>
                      <Chart day={day as Day} n={w * 7 + i + 1} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.hash="tab-${curWeek}"`,
        }}
      ></script>
    </div>
  );
}
