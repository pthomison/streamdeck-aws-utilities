import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { LambdaExecuterAction } from "./actions/lambda-execute";
// import { ActionController } from "./action-controller";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// var controller = new ActionController(1000);

// Register the increment action.
// streamDeck.actions.registerAction(new LambdaExecuterAction(controller.addAction, controller.removeAction));
streamDeck.actions.registerAction(new LambdaExecuterAction());

// Finally, connect to the Stream Deck.
streamDeck.connect();
