"use client";

import { useEffect, useMemo, useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText } from "./_components/reader-text";
import { useStateStore } from "./_stores/state";
import { ReaderBottomNav } from "./_components/reader-bottom-nav";
import { WordLookup } from "./_components/word-lookup";
import { lookupLongest } from "./_utils/dictionary";
import { useDictionaryStore } from "./_stores/dictionary";
import { textToSpeech } from "./_utils/text-to-speech";
import { getPageCount, getReaderInfo } from "./_utils/reader/get-reader-info";
import { getReaderBoxSize } from "./_utils/reader/box-size";

const HomePage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
    <div className="flex h-[100dvh] flex-col items-center overflow-hidden bg-black text-white">
      <div className="flex h-full w-full max-w-2xl grow flex-col">
        <ReaderHeader
          setIsSideMenuOpen={setIsSideMenuOpen}
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
                dispatch={dispatch}
              />
            )}
          </div>

          <ReaderBottomNav
            pageIndex={reader.pageIndex}
            pageCount={pageCount}
            onClickLeft={() => dispatch({ type: "DECREMENT_PAGE_INDEX" })}
            onClickRight={() => dispatch({ type: "INCREMENT_PAGE_INDEX" })}
          />
        </div>

        <SideMenu
          selectedItem="Reader"
          isSideMenuOpen={isSideMenuOpen}
          setIsSideMenuOpen={setIsSideMenuOpen}
        />
      </div>
    </div>
  );
};

export default HomePage;
