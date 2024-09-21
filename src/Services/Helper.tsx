import B from "../assets/card-symbols/B.svg";
import G from "../assets/card-symbols/G.svg";
import R from "../assets/card-symbols/R.svg";
import U from "../assets/card-symbols/U.svg";
import W from "../assets/card-symbols/W.svg";
import C from "../assets/card-symbols/C.svg";
import symbolMap from "../assets/symbolmap.json";

export default class Helper {
  static replaceColorSymbolsByImage(symbol: string) {
    const symbolToImageMap = {
      U: U,
      B: B,
      G: G,
      R: R,
      W: W,
      C: C,
    } as any;
    const image = symbolToImageMap[symbol] || "";
    return <img key={symbol} className="manaSymbol" src={image} alt="" />;
  }

  static convertCostsToImgArray(costs: string) {
    if (!costs) {
      return [];
    }
    const result = [];
    let remainingCost = costs;

    while (remainingCost.length > 0) {
      const startIndex = remainingCost.indexOf("{");
      if (startIndex === -1) {
        result.push(remainingCost);
        break;
      }

      if (startIndex > 0) {
        result.push(remainingCost.substring(0, startIndex));
      }

      const endIndex = remainingCost.indexOf("}");
      result.push(remainingCost.substring(startIndex, endIndex + 1));
      remainingCost = remainingCost.substring(endIndex + 1);
    }

    return result.map((symbol, index) => (
      <img key={index} className="manaSymbol" src={(symbolMap as any)[symbol]} alt="" />
    ));
  }
}
