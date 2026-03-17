import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CropPrice {
    date: Time;
    pricePerKg: number;
    marketLocation: string;
    cropName: string;
    trendUp: boolean;
}
export type Time = bigint;
export interface FertilizerTask {
    fertilizerName: string;
    dayOffset: bigint;
    notes: string;
    amount: string;
}
export interface FertilizerSchedule {
    tasks: Array<FertilizerTask>;
    plantingDate: string;
    cropType: string;
}
export interface WeatherForecast {
    region: string;
    temperature: bigint;
    farmingTip: string;
    humidity: bigint;
    forecastDate: Time;
    rainfall: bigint;
}
export interface Article {
    title: string;
    content: string;
    language: string;
    category: string;
}
export interface backendInterface {
    addArticle(article: Article): Promise<void>;
    addCropPrice(price: CropPrice): Promise<void>;
    addFertilizerSchedule(cropType: string, plantingDate: string): Promise<void>;
    addWeatherForecast(forecast: WeatherForecast): Promise<void>;
    getAllArticles(): Promise<Array<Article>>;
    getAllPrices(): Promise<Array<CropPrice>>;
    getArticlesByCategory(category: string): Promise<Array<Article>>;
    getArticlesByLanguage(language: string): Promise<Array<Article>>;
    getMySchedule(): Promise<FertilizerSchedule>;
    getPricesByCrop(crop: string): Promise<Array<CropPrice>>;
    getWeatherByRegion(region: string): Promise<WeatherForecast>;
    initializeKnowledgeData(): Promise<void>;
    initializeMarketData(): Promise<void>;
    initializeWeatherData(): Promise<void>;
}
