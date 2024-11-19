import { useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import DeckPreview from "../components/Deck/DeckPreview";
import { Playtest } from "../models/dtos";
import PlaytestService from "../Services/PlaytestService";
import { FormatType, formatUnixTimestamp } from "../utils/dataUtils";
import { Helmet } from "react-helmet-async";

const playtestService = PlaytestService.shared;

const PlaytestsListPage = () => {
  const playtestHistory = useLoaderData() as Playtest[];

  function play(id: number) {
    window.open(`/playtests/${id}`, "_blank");
  }

  return (
    <div className="mx-auto">
      <Helmet title="Playtests" />
      <div className="text-3xl font-semibold m-2 text-center mb-8 select-none">
        Playtest History
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 select-none">
        <thead className="text-xs text-gray-700 uppercase bg-mediumBlue dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Preview
            </th>
            <th scope="col" className="px-6 py-3">
              Created
            </th>
            <th scope="col" className="px-6 py-3">
              Play
            </th>
          </tr>
        </thead>
        <tbody>
          {playtestHistory.map((pt) => (
            <tr
              key={pt.id}
              className="border-b border-lightBlue bg-darkBlue h-16"
            >
              <td className="px-6">{pt.id}</td>
              <td className="px-6 text-base">
                {pt.promoId && (
                  <DeckPreview
                    moxfieldId={pt.moxfieldId}
                    name={pt.name}
                    promoId={pt.promoId}
                  />
                )}
              </td>
              <td
                className="px-6"
                title={formatUnixTimestamp(pt.createdAt, FormatType.DAY_TIME)}
              >
                {new Date(pt.createdAt * 1000).toLocaleDateString()}
              </td>
              <td className="px-6">
                <Button title="Play" onClick={() => play(pt.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaytestsListPage;

export const loader = async () => {
  return await playtestService.getAll();
};
