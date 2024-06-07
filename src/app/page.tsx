"use client";

import { useEffect, useMemo, useRef } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText } from "./_components/reader-text";
import {
  useStateStore,
  type BoxSize,
  type ActiveReader,
} from "./_stores/state";
import { ReaderBottomNav } from "./_components/reader-bottom-nav";
import { WordLookup } from "./_components/word-lookup";
import { useDictionaryStore } from "./_stores/dictionary";
import { textToSpeech } from "./_utils/text-to-speech";
import { getPageCount } from "./_utils/reader/get-page-count";
import { getReaderBoxSize } from "./_utils/reader/get-reader-box-size";
import { useServiceWorker } from "./_utils/use-service-worker";
import { getDictionaryEntries } from "./_utils/reader/get-dictionary-entries";

const useDictionaryEntries = (reader: ActiveReader, readerSize: BoxSize) => {
  const dictionary = useDictionaryStore((x) => x.dictionary);
  const dictionaryEntries = useMemo(
    () => getDictionaryEntries(reader, readerSize, dictionary),
    [reader, readerSize, dictionary],
  );
  return dictionaryEntries;
};

const HomePage = (): JSX.Element => {
  const dispatch = useStateStore((state) => state.dispatch);
  const reader = useStateStore((state) => state.reader);
  const readerSize = useStateStore((x) => x.readerSize);
  const pageCount = getPageCount(reader.text, readerSize);
  const flashcards = useStateStore((x) => x.flashcards);
  const dictionaryEntries = useDictionaryEntries(reader, readerSize);

  // SERVICE WORKER FOR OFFLINE MODE
  useServiceWorker();

  // LOAD DICTIONARY
  const loadDictionary = useDictionaryStore((x) => x.loadDictionary);
  useEffect(() => {
    loadDictionary();
  }, [loadDictionary]);

  // PLAY AUDIO ON WORD LOOKUP
  const playAudioOnWordLookupEnabled = useStateStore(
    (x) => x.settings.playAudioOnWordLookup.enabled,
  );
  // The reason why we need `shouldPlayAudio` is because if the user comes back to the page
  // and we have text selected, it will play the text audio, but we only want to play
  // the text audio right after we select the word. `shouldPlayAudio` will only be true
  // directly after we selected the text.
  const shouldPlayAudio = useRef(false);
  useEffect(() => {
    if (
      dictionaryEntries[0] &&
      playAudioOnWordLookupEnabled &&
      shouldPlayAudio.current
    ) {
      textToSpeech(dictionaryEntries[0].simplified);
    }
    shouldPlayAudio.current = false;
  }, [dictionaryEntries, playAudioOnWordLookupEnabled]);
  const wordLength = dictionaryEntries[0]?.traditional.length ?? 0;

  // SET READER SIZE
  useEffect(() => {
    const setReaderSize = () =>
      void (async () => {
        const { width, height } = await getReaderBoxSize();
        dispatch({ type: "SET_READER_SIZE", width, height });
      })();
    setReaderSize();
    addEventListener("resize", setReaderSize);
    return () => removeEventListener("resize", setReaderSize);
  }, [dispatch]);

  return (
    <div className="flex h-[100svh] flex-col items-center overflow-hidden bg-black text-white">
      <div className="flex h-full w-full max-w-2xl grow flex-col">
        <ReaderHeader
          openSideMenu={() => dispatch({ type: "OPEN_MENU" })}
          setReaderText={(readerText) => {
            dispatch({
              type: "PASTE_READER_TEXT",
              text: readerText,
              date: Date.now(),
            });
          }}
        />

        <div className="flex grow flex-col justify-between gap-2 px-2 pb-2">
          <div className="flex flex-col gap-2">
            <ReaderText
              size={readerSize}
              text={reader.text}
              date={reader.date}
              pageIndex={reader.pageIndex}
              selection={
                typeof reader.selection === "number"
                  ? {
                      start: reader.selection,
                      end: reader.selection + wordLength,
                    }
                  : null
              }
              setSelection={(selection) => {
                dispatch({ type: "SET_READER_SELECTION", selection });
                shouldPlayAudio.current = true;
              }}
            />

            {dictionaryEntries.length > 0 && (
              <WordLookup
                key={dictionaryEntries[0]?.traditional}
                flashcards={flashcards}
                dictionaryEntries={dictionaryEntries}
                addOrRemoveFlashcard={(entry) => {
                  dispatch({ type: "ADD_OR_REMOVE_FLASHCARD", entry });
                }}
              />
            )}
          </div>

          {reader.text && (
            <ReaderBottomNav
              pageIndex={reader.pageIndex}
              pageCount={pageCount}
              onClickLeft={() => dispatch({ type: "DECREMENT_PAGE_INDEX" })}
              onClickRight={() => dispatch({ type: "INCREMENT_PAGE_INDEX" })}
            />
          )}
        </div>

        <SideMenu selectedItem="Reader" />
      </div>
    </div>
  );
};

export default HomePage;
