import { MenuIcon } from "./_icons/menu";

const HomePage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <header className="flex h-12 w-full max-w-2xl items-center">
        <button className="flex h-12 w-12 shrink-0 items-center justify-center">
          <MenuIcon />
          <span className="sr-only">Open menu</span>
        </button>
        <h1 className="grow text-center text-xl">Mandarin Reader</h1>
        <div className="flex h-12 w-12"></div>
      </header>
    </div>
  );
};

export default HomePage;
