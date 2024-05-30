import { ArrowBackIcon } from "../_icons/arrow-back";
import { ArrowForwardIcon } from "../_icons/arrow-forward";

export const ReaderBottomNav = ({
  pageIndex,
  pageCount,
  onClickLeft,
  onClickRight,
}: {
  pageIndex: number;
  pageCount: number;
  onClickLeft: () => void;
  onClickRight: () => void;
}): JSX.Element => {
  return (
    <div className="flex shrink-0 items-center justify-between">
      <button
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-white transition hover:brightness-110"
        onClick={onClickLeft}
      >
        <ArrowBackIcon />
        <span className="sr-only">Previous page</span>
      </button>
      <div className="flex grow items-center justify-center text-xl">{`${pageIndex + 1} / ${pageCount}`}</div>
      <button
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-white transition hover:brightness-110"
        onClick={onClickRight}
      >
        <ArrowForwardIcon />
        <span className="sr-only">Next page</span>
      </button>
    </div>
  );
};
