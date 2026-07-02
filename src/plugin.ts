import streamDeck from "@elgato/streamdeck";

import { PVOverView } from "./actions/pv-overview";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new PVOverView());

streamDeck.connect();
