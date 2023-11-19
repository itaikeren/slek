import { useState } from "react";
import Calendar, { useCalendar } from "slek";

import Header from "./components/header";
import { GithubIcon, LogoIcon, CopyIcon, ConfirmedIcon } from "./components/icons";

import Linear from "./assets/linear.svg?react";
import Notion from "./assets/notion.svg?react";
import Vercel from "./assets/vercel.svg?react";
import Cron from "./assets/cron.svg?react";

import "./assets/App.css";
import "./assets/linear.css";
import "./assets/vercel.css";
import "./assets/cron.css";
import "./assets/notion.css";

function BrandButton({
  logo,
  text,
  selected,
  onClick
}: {
  logo: React.ReactNode;
  text: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex w-[100px] items-center justify-center gap-1 rounded-full px-3.5  py-2 transition-all ${
        !selected ? "opacity-30" : ""
      } cursor-pointer select-none hover:opacity-100`}
      onClick={onClick}
    >
      <div className="h-5 w-5">{logo}</div>
      <span className="font-serif text-sm">{text}</span>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState("linear");
  const [shrink, setShrink] = useState(false);
  const [copy, setCopy] = useState(false);
  const { date, setDate } = useCalendar();

  const handleClick = (brand: string) => {
    setSelected(brand);
    setShrink(true);
    setTimeout(() => {
      setShrink(false);
    }, 200);
  };

  const handleCopy = () => {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
    navigator.clipboard.writeText("npm i slek");
  };

  const CopyButton = () => (
    <div className="group relative flex items-center">
      <span
        className="z-10 cursor-pointer select-none rounded-full border border-slate-400/50 bg-white px-3.5 py-2 font-mono text-xs shadow-sm md:text-sm"
        onClick={handleCopy}
      >
        npm i slek
      </span>
      <div className="absolute left-1 w-16 text-right font-mono text-xs text-slate-500 transition-all ease-linear group-hover:-left-5">
        {copy ? <ConfirmedIcon /> : <CopyIcon />}
      </div>
    </div>
  );

  return (
    <main className="mx-auto flex max-w-5xl flex-col space-y-5 p-5">
      <section className="flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-gray-700">
            <LogoIcon />
            <h1 className="font-serif text-3xl text-slate-900 md:text-4xl">Slek</h1>
          </p>
          <span className="text-xs text-slate-500 md:text-sm">An unstyled calendar component for React.</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton />
          <GithubIcon />
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center gap-5">
        <div
          className={`${selected} h-[365px] transition-all ease-linear ${
            shrink ? "scale-95 opacity-50" : "scale-100 opacity-100"
          }`}
        >
          <Calendar
            date={date}
            onChange={(date) => setDate(date)}
            disabled={Array.isArray(date) ? date.length >= 5 : false}
            className="w-[320px]"
          >
            <Calendar.Header>
              <Header monthStyle={selected === "vercel" ? "full" : "short"} />
            </Calendar.Header>
            <Calendar.Grid mode="single">{({ value }) => <div>{value}</div>}</Calendar.Grid>
          </Calendar>
        </div>
        <div className="relative">
          <div className="relative z-20 flex gap-4">
            <BrandButton
              logo={<Linear />}
              text="Linear"
              selected={selected === "linear"}
              onClick={() => (selected === "linear" ? undefined : handleClick("linear"))}
            />
            <BrandButton
              logo={<Vercel />}
              text="Vercel"
              selected={selected === "vercel"}
              onClick={() => (selected === "vercel" ? undefined : handleClick("vercel"))}
            />
            <BrandButton
              logo={<Cron />}
              text="Cron"
              selected={selected === "cron"}
              onClick={() => (selected === "cron" ? undefined : handleClick("cron"))}
            />
            <BrandButton
              logo={<Notion />}
              text="Notion"
              selected={selected === "notion"}
              onClick={() => (selected === "notion" ? undefined : handleClick("notion"))}
            />
          </div>
          <div
            className="absolute top-0 h-9 w-[100px] rounded-full bg-white shadow-sm outline outline-slate-300/50 transition-all"
            style={{
              left: selected === "linear" ? "0%" : selected === "vercel" ? "25%" : selected === "cron" ? "50%" : "77%"
            }}
          />
        </div>
        <div className="prose w-full">
          <pre className="rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-900 outline outline-1 outline-slate-200">
            <code>
              {`import Calendar from 'slek'

...

<Calendar>
  <Calendar.Header>
    <Calendar.Headline />
    <Calendar.NextButton />
    <Calendar.PrevButton />
  </Calendar.Header>
  <Calendar.Grid>
      {(props) => <MyCell>{props.value}</MyCell>}
  </Calendar.Grid>
</Calendar>`}
            </code>
          </pre>
        </div>
      </section>
    </main>
  );
}

export default App;
