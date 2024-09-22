import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import FullscreenLoadingSpinner from "../components/Common/FullscreenLoadingSpinner";
import Client from "../Services/Client";
import { FormatType, formatUnixTimestamp } from "../utils/dataUtils";

const Imports = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initialSettings = useLoaderData() as any;

  const [settings, setSettings] = useState<{
    lastImportCards: number;
    lastImportSymbols: number;
    lastImportSets: number;
    lastImportMoxFieldMappings: number;
  }>(initialSettings);

  async function importCards() {
    await rawImport("/import/cards?force=true");
  }

  async function importMoxfieldMappings() {
    await rawImport("/moxfield/import/sets");
  }

  async function importSets() {
    await rawImport("/import/sets");
  }

  async function importSymbols() {
    await rawImport("/import/symbols");
  }

  async function rawImport(path: string) {
    setIsLoading(true);
    try {
      const settings = await Client.shared.get<any>(path, true);
      setSettings(settings);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }
  return (
    <div className="mx-auto p-8">
      {isLoading && <FullscreenLoadingSpinner />}
      <h1 className="mb-8 text-center text-5xl">Imports</h1>
      <div className="grid grid-cols-2 gap-8 border border-lightBlue rounded-lg p-6 shadow-lg">
        {/* Action Column */}
        <div className="flex flex-col gap-4 justify-between h-full">
          <div className="text-lg font-semibold text-center">Action</div>
          <Button title="Import Cards" onClick={importCards} />
          <Button title="Import Sets" onClick={importSets} />
          <Button title="Import Symbols" onClick={importSymbols} />
          <Button
            title="Import Moxfield Mappings"
            onClick={importMoxfieldMappings}
          />
        </div>
        {/* Last Import Column */}
        <div className="flex flex-col gap-4 justify-between h-full">
          <div className="text-lg font-semibold">Last Import</div>
          <div>
            {formatUnixTimestamp(settings.lastImportCards, FormatType.DAY_TIME)}
          </div>
          <div>
            {formatUnixTimestamp(settings.lastImportSets, FormatType.DAY_TIME)}
          </div>
          <div>
            {formatUnixTimestamp(
              settings.lastImportSymbols,
              FormatType.DAY_TIME
            )}
          </div>
          <div>
            {formatUnixTimestamp(
              settings.lastImportMoxFieldMappings,
              FormatType.DAY_TIME
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imports;

export const loader: LoaderFunction = async () => {
  return await Client.shared.get<any>("/import/status", true);
};
