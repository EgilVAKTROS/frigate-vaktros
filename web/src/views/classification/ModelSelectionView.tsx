import { baseUrl } from "@/api/baseUrl";
import ActivityIndicator from "@/components/indicators/activity-indicator";
import { cn } from "@/lib/utils";
import {
  CustomClassificationModelConfig,
  FrigateConfig,
} from "@/types/frigateConfig";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import useSWR from "swr";

type ModelSelectionViewProps = {
  onClick: (model: CustomClassificationModelConfig) => void;
};
export default function ModelSelectionView({
  onClick,
}: ModelSelectionViewProps) {
  const { data: config } = useSWR<FrigateConfig>("config", {
    revalidateOnFocus: false,
  });

  const classificationConfigs = useMemo(() => {
    if (!config) {
      return [];
    }

    return Object.values(config.classification.custom);
  }, [config]);

  if (!config) {
    return <ActivityIndicator />;
  }

  if (classificationConfigs.length == 0) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold">
            No Classification Models Found
          </h2>
          <p className="mb-4 text-muted-foreground">
            You need to configure classification models in your Frigate
            configuration.
          </p>
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="mb-2 font-medium">
              Classification is not configured in this Frigate instance.
            </p>
            <p className="text-sm text-muted-foreground">
              Classification models allow you to train custom AI models to
              recognize specific objects or states. This feature requires
              additional configuration and model files.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              For more information, see the{" "}
              <a
                href="https://docs.frigate.video/configuration/classification"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Frigate documentation
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full gap-2 p-2">
      {classificationConfigs.map((config) => (
        <ModelCard config={config} onClick={() => onClick(config)} />
      ))}
    </div>
  );
}

type ModelCardProps = {
  config: CustomClassificationModelConfig;
  onClick: () => void;
};
function ModelCard({ config, onClick }: ModelCardProps) {
  const { data: dataset } = useSWR<{
    [id: string]: string[];
  }>(`classification/${config.name}/dataset`, { revalidateOnFocus: false });

  const coverImages = useMemo(() => {
    if (!dataset) {
      return {};
    }

    const imageMap: { [key: string]: string } = {};

    for (const [key, imageList] of Object.entries(dataset)) {
      if (imageList.length > 0) {
        imageMap[key] = imageList[0];
      }
    }

    return imageMap;
  }, [dataset]);

  return (
    <div
      key={config.name}
      className={cn(
        "flex h-60 cursor-pointer flex-col items-center gap-2 rounded-lg bg-card p-2 outline outline-[3px]",
        "outline-transparent duration-500",
        isMobile && "w-full",
      )}
      onClick={() => onClick()}
    >
      <div
        className={cn("grid size-48 grid-cols-2 gap-2", isMobile && "w-full")}
      >
        {Object.entries(coverImages).map(([key, image]) => (
          <img
            key={key}
            className=""
            src={`${baseUrl}clips/${config.name}/dataset/${key}/${image}`}
          />
        ))}
      </div>
      <div className="smart-capitalize">
        {config.name} ({config.state_config != null ? "State" : "Object"}{" "}
        Classification)
      </div>
    </div>
  );
}
