"use client";

import { useEffect, useMemo } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText } from "./_components/reader-text";
import { useStateStore } from "./_stores/state";
import { ReaderBottomNav } from "./_components/reader-bottom-nav";
import { WordLookup } from "./_components/word-lookup";
import { lookupLongest } from "./_utils/dictionary";
import { useDictionaryStore } from "./_stores/dictionary";
import { textToSpeech } from "./_utils/text-to-speech";
import { getReaderInfo } from "./_utils/reader/get-reader-info";
import { getPageCount } from "./_utils/reader/get-page-count";
import { getReaderBoxSize } from "./_utils/reader/get-reader-box-size";
import { useServiceWorker } from "./_utils/use-service-worker";

const HomePage = (): JSX.Element => {
  const dispatch = useStateStore((state) => state.dispatch);
  const reader = useStateStore((state) => state.reader);
  const readerSize = useStateStore((x) => x.readerSize);
  const { charsPerPage } = getReaderInfo(readerSize);
  const pageCount = getPageCount(reader.text, readerSize);
  const dictionary = useDictionaryStore((x) => x.dictionary);
  const flashcards = useStateStore((x) => x.flashcards);
  const pageText = reader.text.slice(
    reader.pageIndex * charsPerPage,
    (reader.pageIndex + 1) * charsPerPage,
  );
  const maxSelectedTextLength = 12;
  const selectedText =
    reader.selection !== null
      ? pageText.slice(
          reader.selection,
          reader.selection + maxSelectedTextLength,
        )
      : "";
  const dictionaryEntry = useMemo(
    () => lookupLongest(dictionary, selectedText),
    [dictionary, selectedText],
  );
  const containsFlashcard =
    !!dictionaryEntry &&
    !!flashcards.find(
      (card) => card.entry.traditional === dictionaryEntry.traditional,
    );

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
  useEffect(() => {
    if (dictionaryEntry && playAudioOnWordLookupEnabled) {
      textToSpeech(dictionaryEntry.simplified);
    }
  }, [dictionaryEntry, playAudioOnWordLookupEnabled]);
  const wordLength = dictionaryEntry?.traditional.length ?? 0;

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
                reader.selection !== null
                  ? {
                      start: reader.selection,
                      end: reader.selection + wordLength,
                    }
                  : null
              }
              setSelection={(selection) => {
                dispatch({ type: "SET_READER_SELECTION", selection });
              }}
            />

            {dictionaryEntry && (
              <WordLookup
                containsFlashcard={containsFlashcard}
                dictionaryEntry={dictionaryEntry}
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
