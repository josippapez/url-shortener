import Input from "./Input";
import style from "./input.module.css";
import pageStyle from "./page.module.css";

export default function Home() {
  return (
    <main className="page-container">
      <div
        className={`flex-center flex-column height-full-viewport ${pageStyle.text}`}
      >
        <div className={pageStyle.title}>URL Shortener</div>
        <Input style={style} />
      </div>
    </main>
  );
}
