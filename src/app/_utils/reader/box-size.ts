import { type BoxSize } from "~/app/_stores/state";
import { readerContainerId } from "./constants";

const getElementBox = (element: HTMLElement): BoxSize => {
  const { clientWidth: width, clientHeight: height } = element;
  return { width, height };
};

export const getReaderContainerBox = (): Promise<BoxSize> => {
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
      return resolve(getElementBox(readerContainer));
    };
    check();
  });
};
