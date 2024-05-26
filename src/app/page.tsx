import { SideMenu } from "./_components/side-menu";
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

      <SideMenu />
    </div>
  );
};

export default HomePage;
