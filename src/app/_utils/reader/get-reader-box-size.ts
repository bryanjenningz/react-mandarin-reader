import { type BoxSize } from "~/app/_stores/state";
import { readerContainerId } from "./constants";

const getElementBoxSize = (element: HTMLElement): BoxSize => {
  const { clientWidth: width, clientHeight: height } = element;
  return { width, height };
};

export const getReaderBoxSize = (): Promise<BoxSize> => {
  const start = Date.now();
  const giveUpTime = 10_000;
  const retryTime = 1_000;
  return new Promise((resolve, reject) => {
    const check = (): void => {
      if (Date.now() - start >= giveUpTime) {
        return reject(
          new Error(`No reader container with id "${readerContainerId}"`),
        );
      }
      const readerContainer = document.getElementById(readerContainerId);
      if (!readerContainer) {
        return void setTimeout(check, retryTime);
      }
      return resolve(getElementBoxSize(readerContainer));
    };
    check();
  });
};
