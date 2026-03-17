import MixinStorage "blob-storage/Mixin";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

actor {
  include MixinStorage();

  ///////////////////////////
  // Weather Actor
  ///////////////////////////

  type WeatherForecast = {
    region : Text;
    temperature : Int;
    rainfall : Int;
    humidity : Int;
    forecastDate : Time.Time;
    farmingTip : Text;
  };

  module WeatherForecast {
    public func compare(a : WeatherForecast, b : WeatherForecast) : Order.Order {
      Text.compare(a.region, b.region);
    };
  };

  let weatherData = Map.empty<Text, WeatherForecast>();

  // Seed sample regions
  public shared ({ caller }) func initializeWeatherData() : async () {
    weatherData.add(
      "Colombo",
      {
        region = "Colombo";
        temperature = 30;
        rainfall = 100;
        humidity = 80;
        forecastDate = Time.now();
        farmingTip = "Rice needs 5cm water per week";
      },
    );
    weatherData.add(
      "Kandy",
      {
        region = "Kandy";
        temperature = 25;
        rainfall = 150;
        humidity = 85;
        forecastDate = Time.now();
        farmingTip = "Tea grows best at 20-30 celsius";
      },
    );
  };

  public shared ({ caller }) func addWeatherForecast(forecast : WeatherForecast) : async () {
    weatherData.add(forecast.region, forecast);
  };

  public query ({ caller }) func getWeatherByRegion(region : Text) : async WeatherForecast {
    switch (weatherData.get(region)) {
      case (null) { Runtime.trap("Region not found") };
      case (?forecast) { forecast };
    };
  };

  ///////////////////////////
  // Market Actor
  ///////////////////////////

  type CropPrice = {
    cropName : Text;
    pricePerKg : Float;
    marketLocation : Text;
    date : Time.Time;
    trendUp : Bool;
  };

  let marketData = List.empty<CropPrice>();

  public shared ({ caller }) func initializeMarketData() : async () {
    marketData.add({
      cropName = "Rice";
      pricePerKg = 100.0;
      marketLocation = "Colombo";
      date = Time.now();
      trendUp = true;
    });
    marketData.add({
      cropName = "Tea";
      pricePerKg = 200.0;
      marketLocation = "Kandy";
      date = Time.now();
      trendUp = false;
    });
  };

  public shared ({ caller }) func addCropPrice(price : CropPrice) : async () {
    marketData.add(price);
  };

  public query ({ caller }) func getAllPrices() : async [CropPrice] {
    marketData.values().toArray();
  };

  public query ({ caller }) func getPricesByCrop(crop : Text) : async [CropPrice] {
    switch (marketData.values().find(func(x) { x.cropName == crop })) {
      case (null) { Runtime.trap("Crop not found") };
      case (?price) { [price] };
    };
  };

  ///////////////////////////
  // Fertilizer Actor
  ///////////////////////////

  type FertilizerTask = {
    dayOffset : Int;
    fertilizerName : Text;
    amount : Text;
    notes : Text;
  };

  type FertilizerSchedule = {
    cropType : Text;
    plantingDate : Text;
    tasks : [FertilizerTask];
  };

  let fertilizerSchedules = Map.empty<Principal, FertilizerSchedule>();

  public shared ({ caller }) func addFertilizerSchedule(cropType : Text, plantingDate : Text) : async () {
    let tasks = [
      {
        dayOffset = 0;
        fertilizerName = "Urea";
        amount = "50kg/acre";
        notes = "Apply at planting";
      },
      {
        dayOffset = 30;
        fertilizerName = "MOP";
        amount = "40kg/acre";
        notes = "Apply after 1 month";
      },
    ];
    let schedule : FertilizerSchedule = {
      cropType;
      plantingDate;
      tasks;
    };
    fertilizerSchedules.add(caller, schedule);
  };

  public query ({ caller }) func getMySchedule() : async FertilizerSchedule {
    switch (fertilizerSchedules.get(caller)) {
      case (null) { Runtime.trap("No schedule found") };
      case (?schedule) { schedule };
    };
  };

  ///////////////////////////
  // Knowledge Actor
  ///////////////////////////

  type Article = {
    title : Text;
    content : Text;
    category : Text;
    language : Text;
  };

  let knowledgeData = List.empty<Article>();

  public shared ({ caller }) func initializeKnowledgeData() : async () {
    knowledgeData.add({
      title = "Rice Planting Guide";
      content = "Step by step rice planting instructions...";
      category = "planting";
      language = "en";
    });
    knowledgeData.add({
      title = "Irrigation Tips";
      content = "Best practices for farm irrigation...";
      category = "irrigation";
      language = "en";
    });
  };

  public shared ({ caller }) func addArticle(article : Article) : async () {
    knowledgeData.add(article);
  };

  public query ({ caller }) func getAllArticles() : async [Article] {
    knowledgeData.values().toArray();
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [Article] {
    let filtered = knowledgeData.values().filter(
      func(article) {
        article.category == category;
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getArticlesByLanguage(language : Text) : async [Article] {
    let filtered = knowledgeData.values().filter(
      func(article) {
        article.language == language;
      }
    );
    filtered.toArray();
  };
};
