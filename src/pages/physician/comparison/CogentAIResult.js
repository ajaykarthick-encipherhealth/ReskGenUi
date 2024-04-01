import React from "react";
import SuggestedCode from "./content/SuggestedCode";
import ValidHcc from "./content/ValidHcc";

const CogentAIResult = ({
  validClienHccList,
  cogentSuggestedHccList,
  comparisonData,
}) => {
  const meatCriteriaYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.cogentAIResult?.meatCriteria)
    : "";
  const meatCriteriaList =
    comparisonData?.data?.cogentAIResult?.meatCriteria[meatCriteriaYear];
  const ProviderName =
    comparisonData?.data?.cogentAIResult?.provider[meatCriteriaYear];

  return (
    <div className="row">
      <div className="col-xl-12">
        <ValidHcc
          content={validClienHccList}
          meatCriteriaList={meatCriteriaList}
          ProviderName={ProviderName}
        />
      </div>
      <div className="col-xl-12">
        <SuggestedCode
          content={cogentSuggestedHccList}
          ProviderName={ProviderName}
        />
      </div>
    </div>
  );
};

export default CogentAIResult;
