import U from "../../assets/card-symbols/U.svg";
import B from "../../assets/card-symbols/B.svg";
import G from "../../assets/card-symbols/G.svg";
import R from "../../assets/card-symbols/R.svg";
import W from "../../assets/card-symbols/W.svg";
import symbolMap from "../../assets/symbolmap.js";

export default class Helper {
  static replaceColorSymbolsByImage(symbol) {
    let image;
    switch (symbol) {
      case "U":
        image = U;
        break;
      case "B":
        image = B;
        break;
      case "G":
        image = G;
        break;
      case "R":
        image = R;
        break;
      case "W":
        image = W;
        break;
      default:
        image = "";
    }
    return <img key={symbol} className="manaSymbol" src={image} />;
  }

  static convertCostsToImgArray(costs) {
    if (!costs) {
      return [];
    }
    let result = [];
    let cost = costs;
    while (cost.length > 0) {
      let index = cost.indexOf("{");
      if (index === -1) {
        result.push(cost);
        break;
      }
      if (index > 0) {
        result.push(cost.substring(0, index));
      }
      let endIndex = cost.indexOf("}");
      result.push(cost.substring(index, endIndex + 1));
      cost = cost.substring(endIndex + 1);
    }
    let out = [];
    for (let i = 0; i < result.length; i++) {
      out.push(<img key={i} className="manaSymbol" src={symbolMap[result[i]]} />);
    }
    return out;
  }
}
