import { Site } from "../site"

export class Log {
    static dev = (message: any) => {
        if(!Site.PRODUCTION) console.log(message);
    }
}