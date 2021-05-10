//Create variables here
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var dogImg, happyDog, database, foodS, foodStoke, readStock;
var dog;
var fedTime, lastFed;
var food1;

function preload(){
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
 // MilkIMG = loadImage("images/Milk.png");
}

function setup() {
  createCanvas(1000, 600);
  engine = Engine.create();
  world = engine.world;

  database = firebase.database();

  dog = createSprite(550,300,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.25;

  food1 = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStoke);

  feed = createButton('Feed the dog');
  feed.position(650, 150);
  feed.mousePressed(feedDog);

  addFood= createButton('Add Food');
  addFood.position(750, 150);
  addFood.mousePressed(addFoods);
}

function draw() { 
  background(46, 139, 87);

  food1.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
      lastFed=data.val();
  });

  fill(255,255,254);
  textSize(25);
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12 + " PM", 250, 70);
  } else if(lastFed === 0){
    text("Last Feed: 12 AM", 250, 70);
  }else{
    text("Last Feed: "+ lastFed + " AM", 250, 70);
  }

  drawSprites();
  //add styles here
  textSize(20);
  fill("red");
  stroke("white");
  strokeWeight(5);
  text("Note: Press the button to feed the dog milk", 200, 30);
}

function readStoke(data){
  foodS = data.val();
  food1.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  food1.updateFoodStock(food1.getFoodStock()-1);
  database.ref('/').update({
    Food:food1.getFoodStock(),
    FeedTime:hour()
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
}