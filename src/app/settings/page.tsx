"use client";

import { SideMenu } from "~/app/_components/side-menu";
import {
  type Dispatch,
  type SettingsOption,
  type SettingsOptions,
  useStateStore,
} from "../_stores/state";
import { SimpleHeader } from "../_components/simple-header";

const SettingsPage = (): JSX.Element => {
  const settings = useStateStore((x) => x.settings);
  const dispatch = useStateStore((x) => x.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="Settings" />

      <ul className="w-full max-w-2xl">
        {Object.entries(settings).map(([settingsName, settingsOption]) => {
          return (
            <SettingsOptionItem
              key={settingsName}
              settingsName={settingsName as keyof SettingsOptions}
              settingsOption={settingsOption}
              dispatch={dispatch}
            />
          );
        })}
      </ul>

      <SideMenu selectedItem="Settings" />
    </div>
  );
};

export default SettingsPage;

const SettingsOptionItem = ({
  settingsName,
  settingsOption,
  dispatch,
}: {
  settingsName: keyof SettingsOptions;
  settingsOption: SettingsOption;
  dispatch: Dispatch;
}): JSX.Element => {
  return (
    <li key={settingsName} className="w-full">
      <button
        className="w-full p-4 text-left"
        onClick={() => {
          dispatch({
            type: "TOGGLE_SETTINGS_OPTION",
            name: settingsName,
          });
        }}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="flex flex-col gap-2">
            <span className="">{settingsOption.name}</span>
            <span className="text-sm text-slate-400">
              {settingsOption.description}
            </span>
          </span>
          <input
            className="h-5 w-5 shrink-0"
            type="checkbox"
            checked={settingsOption.enabled}
            // Do nothing on change because we're already handling the state change on the button click
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
          ></input>
        </span>
      </button>
    </li>
  );
};
