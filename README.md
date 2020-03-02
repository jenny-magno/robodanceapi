# Robodance API

This is an application providing REST API for robot dance battles.

## Set up the app
Make sure you have [Node.js](https://nodejs.org) installed. You should also have [Mongo DB](https://www.mongodb.com/) installed and running locally.

    git clone https://github.com/jenny-magno/robodanceapi.git
    cd robodanceapi

    npm install

## Run the tests

The tests will be using the `robodancedb-test` database. 
You can opt to change this by setting the `MONGODB_URL` field in the `.env` file. 

    npm test

## Run the app

    npm start

The application should now be running on [localhost:3001](localhost:3001). You can also specify the `PORT` of the application in the `.env` file.

## Initializing data

If you want sample robots to be populated in the `robodancedb` database, set the following in the `.env` file.

    INIT_ROBOTS_IF_EMPTY=Y

This will populate the robots collection on startup if the collection is empty. 

## Future Work
Developments planned for this application include:

- Additional validations and test data
- Customizable input data (number of teams in a battle, number of robots in a team, etc)
- More verbose logging system
- Containerization through Docker
- Authorization for API users
- Hosting the API through Heroku

# API Documentation

The REST API to the Robodance app is described below.

## Robots
  - [GET /robots](#get-robots)
  - [GET /robots/{id}](#get-robotsid)
  
## Danceoffs

  - [POST /danceoffs](#post-danceoffs)
  - [GET /danceoffs](#get-danceoffs)
  - [GET /danceoffs/{id}](#get-danceoffsid)

---

## Robots

### GET /robots
- Returns a list of all Robots

### Query Parameters

Field | Description | Values
--- | --- | ---
working | **Optional**. *Defaults to false.* <br> When set to `true`, only Robots that are not `outOfOrder` will returned | `true` or `false`

### Sample Request 

    curl -X GET -H 'Accept: application/json' http://localhost:3001/robots?working=true

### Sample Response

`HTTP/1.1 200 OK`

    [
      {
        "_id": "5e56c061080dad1df1660934",
        "name": "Koya",
        "powermove": "sleep",
        "experience": 0,
        "outOfOrder": false,
        "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669130_1565312952620_gOyNo4tLRVZJT1bz9N.png"
      },
      {
        "_id": "5e56c061080dad1df1660935",
        "name": "RJ",
        "powermove": "eat",
        "experience": 0,
        "outOfOrder": false,
        "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669758_1565312952620_wF5IGb3sFyE5q0L3h1gpO.png"
      },
      ... 
    ]
    
## GET /robots/{id}
- Returns a Robot with the ID specified

### Path Parameters

Field | Description | Example
--- | --- | ---
id | ID of the Robot to be retrieved | `5e56c061080dad1df1660934`

### Sample Request

    curl -X GET -H 'Accept: application/json' http://localhost:3001/robots/5e56c061080dad1df1660934

### Sample Response for Existing Robot

`HTTP/1.1 200 OK`

    {
      "_id": "5e56c061080dad1df1660934",
      "name": "Koya",
      "powermove": "sleep",
      "experience": 0,
      "outOfOrder": false,
      "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669130_1565312952620_gOyNo4tLRVZJT1bz9N.png"
    }

### Sample Response for Non-existing Robot

`HTTP/1.1 404 Not Found`

---

## Danceoffs

## POST /danceoffs
- Holds a Robot Danceoff, and returns the Danceoff results

### Body Parameters 

Field | Description | Example
---  | --- | ---
teams | An array of teams.<br> Each team is an array containing robot IDs playing for the team | `[[` <br>` "5e5b55aeafb39a2711e4ca42", "5e56c061080dad1df1660934", "5e56c061080dad1df1660935", "5e56c061080dad1df1660936", "5e56c061080dad1df1660937"` <br>` ], [` <br>` "5e56c061080dad1df1660938", "5e56c061080dad1df1660939", "5e56c061080dad1df1660940", "5e56c061080dad1df1660941", "5e5b55aeafb39a2711e4ca43"` <br>` ]]`

### Sample Request

    curl -X POST -H 'Accept: application/json' http://localhost:3001/danceoffs -d \
    '{
      "teams": [
        [
          "5e5b55aeafb39a2711e4ca42",
          "5e56c061080dad1df1660934",
          "5e56c061080dad1df1660935",
          "5e56c061080dad1df1660936",
          "5e56c061080dad1df1660937"
          ], [
          "5e56c061080dad1df1660938", 
          "5e56c061080dad1df1660939", 
          "5e56c061080dad1df1660940", 
          "5e56c061080dad1df1660941", 
          "5e5b55aeafb39a2711e4ca43"
        ]
      ]
    }'

### Response
- An array of battle results for the danceoffs held

`HTTP/1.1 201 Created`

    [
      {
        "winner": {
          "_id": "5e56c061080dad1df1660934",
          "name": "Koya",
          "powermove": "sleep",
          "experience": 2,
          "outOfOrder": false,
          "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669130_1565312952620_gOyNo4tLRVZJT1bz9N.png"
        },
        "loser": {
          "_id": "5e56c061080dad1df1660939",
          "name": "Tata",
          "powermove": "love",
          "experience": 1,
          "outOfOrder": false,
          "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669809_1565312952620_Tz1ll0kg1L0t8O5il4BOK8x.png"
        }
     },
     ... 
    ]

## GET /danceoffs
- Returns a list of all previous Danceoff Results

### Query Parameters

Field | Description | Values
--- | --- | ---
sort | **Optional**.<br> <br> `wins` sorts danceoffs by count of wins (descending), then by losses (ascending). <br> `losses` sorts danceoffs  by count of losses (descending), then by wins (ascending). <br>  <br> *When left unspecified, wins and losses will not be aggregated.* | `wins` or `losses`

### Sample Request

    curl -X GET -H 'Accept: application/json' http://localhost:3001/danceoffs?sort=wins

### Response

`HTTP/1.1 200 OK`

    [
      {
        "_id": "5e56c061080dad1df1660934",
        "name": "Koya",
        "powermove": "sleep",
        "experience": 24,
        "outOfOrder": false,
        "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669130_1565312952620_gOyNo4tLRVZJT1bz9N.png",
        "wins": 6,
        "losses": 3
      },
      {
        "_id": "5e56c061080dad1df1660936",
        "name": "Shooky",
        "powermove": "plot and plan",
        "experience": 19,
        "outOfOrder": false,
        "avatar": "s3.marpple.co/files/u_14355/2019/8/150/f_669350_1565312952620_k8W5ACnDeFMAk8Z1R5d0a.png",
        "wins": 6,
        "losses": 3
      },
      ...
    ]

## GET /danceoffs/{id}
- Get Danceoff Results of specific Robot

### Path Parameters

Field | Description | Values
--- | --- | ---
id | ID of the Robot whose Danceoffs are to be retrieved | `5e56c061080dad1df1660934`

### Sample Request

    curl -X GET -H 'Accept: application/json' http://localhost:3001/danceoffs/5e56c061080dad1df1660934

### Response
- The response includes a result flag that indicates if the selected robot had a `win` or a `loss` for that danceoff

`HTTP/1.1 200 OK`

    [
      {
        "_id": "5e5b55aeafb39a2711e4ca42",
        "result": "win",
        "winner": "5e56c061080dad1df1660934",
        "loser": "5e56c061080dad1df1660935"
      },
      {
        "_id": "5e5bb05ffe219f2f3c554820",
        "result": "loss",
        "winner": "5e56c061080dad1df1660939",
        "loser": "5e56c061080dad1df1660934"
      },
      ...
    ]


