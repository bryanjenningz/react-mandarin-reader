import { ContentPasteGoIcon } from "./_icons/content-paste-go";
import { MenuIcon } from "./_icons/menu";

const HomePage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <header className="flex h-12 w-full max-w-2xl items-center">
        <button className="flex h-12 w-12 shrink-0 items-center justify-center">
          <MenuIcon />
          <span className="sr-only">Open menu</span>
        </button>
        <h1 className="grow text-center text-xl">Reader</h1>
        <button className="flex h-12 w-12 shrink-0 items-center justify-center">
          <ContentPasteGoIcon />
          <span className="sr-only">Paste clipboard</span>
        </button>
      </header>

      <div className="fixed inset-0 bg-black opacity-70"></div>

      <aside className="fixed left-0 top-0 flex flex-col bg-black text-white">
        <h2 className="flex h-12 items-center justify-center text-xl">Menu</h2>

        <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">Reader</h3>
        <div className="px-4 py-1 text-lg">Reader</div>
        <div className="px-4 py-1 text-lg">Import PDF</div>
        <div className="px-4 py-1 text-lg">Import subtitles</div>
        <div className="px-4 py-1 text-lg">History</div>

        <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">Flashcards</h3>
        <div className="px-4 py-1 text-lg">Browse flashcards</div>
        <div className="px-4 py-1 text-lg">Audio-only</div>
        <div className="px-4 py-1 text-lg">Mandarin to English</div>
        <div className="px-4 py-1 text-lg">English to Mandarin</div>

        <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">Settings</h3>
        <div className="px-4 py-1 text-lg">Settings</div>
      </aside>
    </div>
  );
};

export default HomePage;
