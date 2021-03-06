/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { SportCountryParser } from "./SportCountryParser";
import { LeagueParser } from "./LeagueParser";
import { SportParser } from "./SportParser";
import { each } from "bluebird";
import { AvailableSports } from "../utils/sport.utils";

export class Parser extends ParserBase {
    constructor() {
        super();

        this.setSuccessor(new SportParser())
            .setSuccessor(new SportCountryParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        let sports: any[] = AvailableSports;
        await each(sports, sport => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(sport).catch(err => {
                console.log('SportParser Error: ', err);
            });
        });
        // ParserBase.parsing = false;
        this.start();
        console.log("data parsing finished");
    }
}