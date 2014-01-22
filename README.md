ember-data-neo4j-adapter
========================

An ember-data adapter for Neo4j

## Disclaimer
This is an experiment and it is not completed at all.

## Motivation
This is the result of a challenge at the [Toronto Javascript Hack Night](http://www.meetup.com/torontojshackers/events/154050752/). The goal was to be able to perform CRUD operations between a Neo4j database and ember-data without a backend in the middle.

This functionality may be interesting for the flexible schema possibilities that Neo4j offers. It would be possible to create and modify Ember models without database migrations or API updates.

## Considerations
Neo4j is really flexible with data types. They are not even required. However, my idea was to allow to create models with it. The solution was to use Neo4j node labels as the model class. Any other model field will be stored as a node property.

## What is working?
It is possible to specify DS.Models in an Ember application and the adapter will able to persist them. It is possible to:

 - Find all the nodes of a given type
 - Find a node by ID
 - Create a node of a given type
 - Update node fields (properties)
 - Delete a node

## Usage
You will obviously need a Neo4j server. If you install it locally you need to allow cross-domain requests. You can do this editting your neo4j-server.properties and uncommenting the line:

    org.neo4j.server.webserver.address=0.0.0.0

If your server is not running `http://localhost:7474/db/data/` you need to set the `host` property in the adapter.

## Relationships
I didn't have the time to add relationships support but if I have the chance I will add them.

## Sample app
I added a hideous app to test the adapter. It only has the Movie model and it's plain ugly HTML, but it does show how to use the adapter. You can use it by running a simple HTTP server:

    python -m SimpleHTTPServer

## Future
Only nodes are working so a lot of stuff needs to be added. I think that it will be interesting to tranform Ember findQueries into Neo4j traversals.
