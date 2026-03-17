import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useInitWeather() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.initializeWeatherData();
    },
  });
}

export function useWeatherByRegion(region: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["weather", region],
    queryFn: async () => {
      if (!actor || !region) return null;
      return actor.getWeatherByRegion(region);
    },
    enabled: !!actor && !isFetching && !!region,
  });
}

export function useInitMarket() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.initializeMarketData();
    },
  });
}

export function useAllPrices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPrices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFertilizerSchedule() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cropType,
      plantingDate,
    }: { cropType: string; plantingDate: string }) => {
      if (!actor) return;
      await actor.addFertilizerSchedule(cropType, plantingDate);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}

export function useMySchedule() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMySchedule();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitKnowledge() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.initializeKnowledgeData();
    },
  });
}

export function useAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}
