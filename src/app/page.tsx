"use client";

import { useEffect, useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText, getCharsPerPage } from "./_components/reader-text";
import { useStateStore } from "./_stores/state";
import { ReaderBottomNav } from "./_components/reader-bottom-nav";
import { WordLookup } from "./_components/word-lookup";
import { lookupLongest } from "./_utils/dictionary";
import { useDictionaryStore } from "./_stores/dictionary";
import { textToSpeech } from "./_utils/text-to-speech";

const HomePage = (): JSX.Element => {
  const loadDictionary = useDictionaryStore((x) => x.loadDictionary);
  useEffect(() => loadDictionary(), [loadDictionary]);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const reader = useStateStore((state) => state.reader);
  const dispatch = useStateStore((state) => state.dispatch);
  const readerSize = useStateStore((x) => x.readerSize);
  const { charsPerPage } = getCharsPerPage(readerSize);
  const pageCount = Math.ceil(reader.text.length / charsPerPage);

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
  const dictionaryEntry = lookupLongest(dictionary, selectedText);
  const containsFlashcard =
    !!dictionaryEntry &&
    !!flashcards.find(
      (card) => card.entry.traditional === dictionaryEntry.traditional,
    );
  const playAudioOnWordLookupEnabled = useStateStore(
    (x) => x.settings.playAudioOnWordLookup.enabled,
  );
  useEffect(() => {
    if (dictionaryEntry && playAudioOnWordLookupEnabled) {
      textToSpeech(dictionaryEntry.simplified);
    }
  }, [dictionaryEntry, playAudioOnWordLookupEnabled]);
  const wordLength = dictionaryEntry?.traditional.length ?? 0;

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
              readerText={reader.text}
              readerDate={reader.date}
              readerSelection={reader.selection}
              wordLength={wordLength}
              setReaderSelection={(selection) => {
                dispatch({ type: "SET_READER_SELECTION", selection });
              }}
              pageIndex={reader.pageIndex}
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
