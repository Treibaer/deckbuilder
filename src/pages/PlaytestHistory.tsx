import { useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import DeckPreview from "../components/Matches/DeckPreview";
import { Playtest } from "../models/dtos";
import PlaytestService from "../Services/PlaytestService";

const playtestService = PlaytestService.shared;

const PlaytestHistory = () => {
  const playtestHistory = useLoaderData() as Playtest[];

  function play(id: number) {
    window.open("/magic-web-js/play.html?matchId=" + id, "_blank");
  }

  return (
    <div className="mx-auto">
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
              <td className="px-6">
                {new Date(pt.createdAt * 1000).toLocaleDateString()}
              </td>
              <td className="px-6">
                <Button title="Play" onClick={() => play(pt.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col w-full">
        <div className="flex justify-start text-center text-xl w-full">
          <div>ID</div>
          <div className="w-[500px]">Preview</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {playtestHistory.map((pt) => (
          <div
            key={pt.id}
            className="flex justify-start gap-4 border-b border-b-slate-600 items-center h-12"
          >
            <div>{pt.id}</div>
            <div className="w-[500px]">
              {pt.promoId && (
                <DeckPreview
                  moxfieldId={pt.moxfieldId}
                  name={pt.name}
                  promoId={pt.promoId}
                />
              )}
            </div>
            <div>{new Date(pt.createdAt * 1000).toLocaleDateString()}</div>
            <Button title="Play" onClick={() => play(pt.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaytestHistory;

export const loader = async () => {
  return await playtestService.getAll();
};
