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

interface AvgResult {
  days: number[][];
  week: number[];
}

function avg(fn: (colors: number[][]) => number[], colors: number[][][]) {
  const days = colors.map((c) => fn(c));
  const week = fn(days);

  return { days, week };
}

function reefCode(colors: number[][]) {
  const acc = [0, 0, 0];
  for (let i = 0; i < colors.length; i++) {
    const [r, g, b] = colors[i];
    acc[0] += r;
    acc[1] += g;
    acc[2] += b;
  }
  const res = [
    acc[0]%256,
    acc[1]%256,
    acc[2]%256,
  ];
  return res;
}

function topThree(colors: number[][]){
  const cnt:{
    [key:string]:number
  } = {}
  for(let color of colors){
    const c = color.join();
    if(!cnt[c]){
      cnt[c] = 0
    }
    cnt[c]++;
  }

  const top3 = Object.entries(cnt).map(([_,v])=>v).sort().slice(0, 3);

  let high:string[] = [];
  for(let [k,v] of Object.entries(cnt)){
    if(top3.indexOf(v) >= 0 ){
      high.push(k);
    }
  }

  return randomRedditCode(high.map(h => h.split(',').map(hh => +hh)));
}

function randomRedditCode(colors: number[][]) {
  const acc = [0, 0, 0];
  for (let i = 0; i < colors.length; i++) {
    const [r, g, b] = colors[i];
    acc[0] += Math.pow(r, 2.2);
    acc[1] += Math.pow(g, 2.2);
    acc[2] += Math.pow(b, 2.2);
  }
  const res = [
    ~~Math.pow(acc[0] / colors.length, 1 / 2.2),
    ~~Math.pow(acc[1] / colors.length, 1 / 2.2),
    ~~Math.pow(acc[2] / colors.length, 1 / 2.2),
  ];
  return res;
}

function mode(colors: number[][]) {
  const cnt:{
    [key:string]:number
  } = {}
  for(let color of colors){
    const c = color.join();
    if(!cnt[c]){
      cnt[c] = 0
    }
    cnt[c]++;
  }
  
  let n=0;
  let high:string[] = [];
  for(let [k,v] of Object.entries(cnt)){
    if(v > n){
      n = v;
      high = [k];
    }else if(v === n){
      high.push(k);
    }
  }

  if(high.length === 1)
    return high[0].split(',').map(h => +h);
  return randomRedditCode(high.map(h => h.split(',').map(hh => +hh)));
}

function secondPlace(colors: number[][]) {
  const cnt:{
    [key:string]:number
  } = {}
  for(let color of colors){
    const c = color.join();
    if(!cnt[c]){
      cnt[c] = 0
    }
    cnt[c]++;
  }
  
  let m=0;
  let high:string[] = [];
  for(let [k,v] of Object.entries(cnt)){
    if(v > m){
      m = v;
    }
  }

  let n=0;
  for(let [k,v] of Object.entries(cnt)){
    if(v === m){
      continue;
    }
    if(v > n){
      n = v;
      high = [k];
    }else if(v === n){
      high.push(k);
    }
  }

  if(high.length === 1)
    return high[0].split(',').map(h => +h);
  return randomRedditCode(high.map(h => h.split(',').map(hh => +hh)));
}

function Averages({ week }: { week: Day[] }) {
  // get rgbs
  const results = [];
  const rgbsByDay = week.map((day) =>
    Object.entries(day.users).flatMap(([k, v]) => v.map(() => day.colors[k]))
  );
  const md = avg(mode, rgbsByDay);
  results.push({ title: "Winner", result: md });
  const sd = avg(secondPlace, rgbsByDay);
  results.push({ title: "Second place", result: sd });
  const tt = avg(topThree, rgbsByDay);
  results.push({ title: "Top 3", result: tt });
  const rrc = avg(randomRedditCode, rgbsByDay);
  results.push({ title: "Random reddit code", result: rrc });
  const rbc = avg(reefCode, rgbsByDay);
  results.push({ title: "Reef's mess (don't ask)", result: rbc });

  // get day avgs

  // get week avg
  return results;
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
            <div className="fixed top-10 right-2 bg-white p-3 rounded">
              {week.length === 7 && Averages({ week: week })?.map((a) => {
                return (
                  <div>
                    <span>{a.title}</span>
                    <div>
                      {a.result.days.map((d) => (
                        <div
                          className="w-7 h-7 inline-block"
                          style={{ background: `rgb(${d.join()})` }}
                        ></div>
                      ))}
                    </div>
                    <div>
                      <div
                        className="w-48 h-7 inline-block"
                        style={{ background: `rgb(${a.result.week.join()})` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
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
