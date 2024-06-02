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

function Chart({ day }: { day: Day }) {
  const users = day.users;
  if (!users) {
    return <></>;
  }
  let size = 0;
  let total = 0;
  for (const k of Object.keys(users)) {
    const colorUsers = users[k];
    if (colorUsers.length > size) size = colorUsers.length;
    total += colorUsers.length
  }

  return (
    <>
      <div>
      Total colors: {total}
      </div>
      <div
        className="grid "
        style={{
          gridTemplateColumns: ".01fr .01fr 1fr",
        }}
      >
        {Object.entries(users).map(([color, users], i) => (
          <>
            <div key={i*3} className="flex flex-col justify-center items-end">
              <span className="">{a(day.names[color])}:</span>
            </div>
            <div key={i*3+1}  className="flex flex-col justify-center items-end px-1">
                {users.length}
            </div>
            <div  key={i*3+2}  className="p-1 box-border">
              <div
                className="rounded-md overflow-visible px-2"
                style={{
                  background: `rgb(${day.colors[color][0]},${day.colors[color][1]},${day.colors[color][2]})`,
                  width: (users.length / size) * 100 + "%",
                  height: "100%",
                }}
              >
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default async function Home() {
  const data = await getData();
  console.log(data);
  return (
    <div className="container bg-violet-700/10 text-white mx-auto my-8 rounded-md p-5">
      <div className="">
        {data.map((day, i) => {
          return (
            <div key={i}>
              <div>
              Day: {i+1}
              </div>
              <Chart day={day as Day} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
