import React from "react";
import SuggestedCode from "./content/SuggestedCode";
import ValidHcc from "./content/ValidHcc";

const ClientResult = ({
  validHccList,
  clientSuggestedHccList,
  comparisonData,
}) => {
  const meatCriteriaYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.clientResult?.meatCriteria)
    : "";
  const meatCriteriaList =
    comparisonData?.data?.clientResult?.meatCriteria[meatCriteriaYear];
  const ProviderName =
    comparisonData?.data?.cogentAIResult?.provider[meatCriteriaYear];

  return (
    <div className="row">
      <div className="col-xl-12">
        <ValidHcc
          content={validHccList}
          meatCriteriaList={meatCriteriaList}
          ProviderName={ProviderName}
        />
      </div>
      <div className="col-xl-12">
        <SuggestedCode
          content={clientSuggestedHccList}
          ProviderName={ProviderName}
        />
      </div>
    </div>
  );
};

export default ClientResult;
